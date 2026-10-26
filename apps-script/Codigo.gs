/* Jueceo GAF MEX – servidor de licencias (Google Apps Script ligado a una hoja de cálculo de Google).
   Pegar completo en Extensiones > Apps Script de la hoja, guardar e implementar como "Aplicación web"
   (Ejecutar como: yo · Quién tiene acceso: cualquier usuario). Ver README.md del repositorio.

   Hojas (se crean solas):
     Licencias: un renglón por juez. Activo = casilla (desmarcar = cancelar). Vence = fecha (vacío = sin vencimiento).
                Equipos = lista de equipos ligados (borrar la celda = liberar equipos).
     Accesos:   cada entrada a la app, activación y rechazo (fecha, código, juez, equipo, navegador).
     Sugerencias: las que mandan los jueces desde la app (Estado: nueva / atendida).

   Contraseña del panel: Configuración del proyecto (engrane) > Propiedades de la secuencia de comandos >
   agregar CLAVE_ADMIN. Nunca la escribas en este archivo ni en el repositorio. */

var HOJA_LIC = 'Licencias', HOJA_ACC = 'Accesos';
var COLS = ['Codigo', 'Nombre', 'Nota', 'Activo', 'MaxEquipos', 'Vence', 'Creada', 'Equipos', 'UltimoAcceso', 'Entradas'];
var COLS_ACC = ['Fecha', 'Codigo', 'Nombre', 'Equipo', 'Navegador', 'Evento'];
var HOJA_SUG = 'Sugerencias', COLS_SUG = ['Id', 'Fecha', 'Codigo', 'Nombre', 'Texto', 'Estado'];
var SUG_POR_DIA = 10;         // máximo de sugerencias por licencia al día
var GRACIA_DIAS = 3;          // días que la app funciona sin internet con el último permiso válido
var ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function doGet() { return salida({ ok: true, app: 'Jueceo GAF MEX' }); }

function doPost(e) {
  var r;
  try { r = atender(JSON.parse((e && e.postData && e.postData.contents) || '{}')); }
  catch (err) { r = { ok: false, error: String((err && err.message) || err) }; }
  return salida(r);
}

function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function hoja(nombre, cols) {
  var ss = SpreadsheetApp.getActive(), h = ss.getSheetByName(nombre);
  if (!h) { h = ss.insertSheet(nombre); h.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold'); h.setFrozenRows(1); }
  return h;
}

function limpio(v) { return String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function activo(v) { return v === true || /^(TRUE|SI|SÍ|VERDADERO|1)$/i.test(String(v).trim()); }
function fechaDe(v) { if (!v) return null; var d = v instanceof Date ? v : new Date(v); return isNaN(d) ? null : d; }
function equiposDe(v) { try { var a = JSON.parse(v || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }

// Lee la hoja de licencias: [{fila, Codigo, Nombre, ...}]
function licencias() {
  var h = hoja(HOJA_LIC, COLS), n = h.getLastRow();
  if (n < 2) return [];
  return h.getRange(2, 1, n - 1, COLS.length).getValues().map(function (r, i) {
    var o = { fila: i + 2 }; COLS.forEach(function (c, j) { o[c] = r[j]; }); o.Codigo = limpio(o.Codigo); return o;
  }).filter(function (o) { return o.Codigo; });
}
function escribir(l) {
  hoja(HOJA_LIC, COLS).getRange(l.fila, 1, 1, COLS.length).setValues([COLS.map(function (c) { return l[c] === undefined ? '' : l[c]; })]);
}
function registrar(l, codigo, equipo, ua, evento) {
  hoja(HOJA_ACC, COLS_ACC).appendRow([new Date(), codigo, l ? l.Nombre : '', equipo || '', String(ua || '').slice(0, 150), evento]);
}
function estado(l) {
  if (!activo(l.Activo)) return 'cancelada';
  var v = fechaDe(l.Vence);
  if (v && v.getTime() <= Date.now()) return 'vencida';
  return 'ok';
}
// Vence al final del día elegido (hora de México).
function finDeDia(v) { if (!v) return ''; var p = String(v).split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59) : ''; }
function iso(d) { d = fechaDe(d); return d ? d.toISOString() : null; }

function atender(p) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (p.accion === 'validar') return validar(p);
    if (p.accion === 'sugerir') return sugerir(p);
    if (String(p.accion || '').indexOf('admin_') === 0) {
      var clave = PropertiesService.getScriptProperties().getProperty('CLAVE_ADMIN');
      if (!clave) return { ok: false, error: 'Falta definir CLAVE_ADMIN en las propiedades del script.' };
      if (String(p.clave || '') !== clave) { Utilities.sleep(1500); return { ok: false, error: 'Contraseña incorrecta.', clave: false }; }
      if (p.accion === 'admin_listar') return listar(p);
      if (p.accion === 'admin_crear') return crear(p);
      if (p.accion === 'admin_cambiar') return cambiar(p);
      if (p.accion === 'admin_borrar') return borrar(p);
      if (p.accion === 'admin_sugerencia') return cambiarSugerencia(p);
    }
    return { ok: false, error: 'Acción desconocida.' };
  } finally { lock.releaseLock(); }
}

// El equipo pide permiso. La primera vez con un código se liga a la licencia (si quedan lugares).
function validar(p) {
  var c = limpio(p.codigo), eq = String(p.equipo || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 64);
  if (!c || !eq) return { ok: false, motivo: 'no' };
  var l = licencias().filter(function (x) { return x.Codigo === c; })[0];
  if (!l) { if (p.entrada) registrar(null, c, eq, p.ua, 'rechazado: no existe'); return { ok: false, motivo: 'no' }; }
  var est = estado(l), eqs = equiposDe(l.Equipos), nuevo = eqs.indexOf(eq) < 0;
  if (est !== 'ok') { if (p.entrada || p.activar) registrar(l, c, eq, p.ua, 'rechazado: ' + est); return { ok: false, motivo: est }; }
  if (nuevo) {
    // Equipo que no está en la lista: o es la primera vez (activar) o el administrador lo liberó.
    if (!p.activar) return { ok: false, motivo: 'liberado' };
    if (eqs.length >= (+l.MaxEquipos || 1)) { registrar(l, c, eq, p.ua, 'rechazado: sin lugares'); return { ok: false, motivo: 'lleno' }; }
    eqs.push(eq); l.Equipos = JSON.stringify(eqs);
  }
  l.UltimoAcceso = new Date();
  if (p.entrada || nuevo) { l.Entradas = (+l.Entradas || 0) + 1; registrar(l, c, eq, p.ua, nuevo ? 'activó este equipo' : 'entró'); }
  escribir(l);
  return { ok: true, nombre: l.Nombre, vence: iso(l.Vence), gracia: GRACIA_DIAS };
}

function publica(l) {
  return { codigo: l.Codigo, nombre: l.Nombre, nota: l.Nota, activo: activo(l.Activo), estado: estado(l), max: +l.MaxEquipos || 1,
    vence: iso(l.Vence), creada: iso(l.Creada), equipos: equiposDe(l.Equipos).length, ultimo: iso(l.UltimoAcceso), entradas: +l.Entradas || 0 };
}
function listar(p) {
  var h = hoja(HOJA_ACC, COLS_ACC), n = h.getLastRow(), acc = [];
  var cuantos = Math.min(Math.max(+p.accesos || 300, 1), 2000);
  if (n >= 2) {
    var desde = Math.max(2, n - cuantos + 1);
    acc = h.getRange(desde, 1, n - desde + 1, COLS_ACC.length).getValues().reverse().map(function (r) {
      return { fecha: iso(r[0]), codigo: r[1], nombre: r[2], equipo: r[3], navegador: r[4], evento: r[5] };
    });
  }
  return { ok: true, licencias: licencias().map(publica), accesos: acc, sugerencias: sugerencias().reverse() };
}
function nuevoCodigo(existentes) {
  for (var k = 0; k < 20; k++) {
    var b = Utilities.getUuid().replace(/-/g, ''), c = '';
    for (var i = 0; i < 10; i++) c += ABC[parseInt(b.substr(i * 3, 3), 16) % ABC.length];
    if (existentes.indexOf(c) < 0) return c;
  }
  throw new Error('No se pudo generar un código único.');
}
function crear(p) {
  var nombre = String(p.nombre || '').trim();
  if (!nombre) return { ok: false, error: 'Falta el nombre del juez.' };
  var ls = licencias(), c = nuevoCodigo(ls.map(function (x) { return x.Codigo; }));
  hoja(HOJA_LIC, COLS).appendRow([c, nombre, String(p.nota || '').trim(), true, Math.min(Math.max(+p.max || 2, 1), 10), finDeDia(p.vence), new Date(), '[]', '', 0]);
  hoja(HOJA_LIC, COLS).getRange(hoja(HOJA_LIC, COLS).getLastRow(), 4).insertCheckboxes().setValue(true);
  return { ok: true, codigo: c };
}
function buscar(p) { var c = limpio(p.codigo); var l = licencias().filter(function (x) { return x.Codigo === c; })[0]; if (!l) throw new Error('No existe esa licencia.'); return l; }
function cambiar(p) {
  var l = buscar(p);
  if (p.activo !== undefined) l.Activo = !!p.activo;
  if (p.vence !== undefined) l.Vence = finDeDia(p.vence);
  if (p.max !== undefined) { l.MaxEquipos = Math.min(Math.max(+p.max || 1, 1), 10); var e = equiposDe(l.Equipos); if (e.length > l.MaxEquipos) l.Equipos = JSON.stringify(e.slice(0, l.MaxEquipos)); }
  if (p.liberar) l.Equipos = '[]';
  if (p.nombre !== undefined) l.Nombre = String(p.nombre).trim();
  if (p.nota !== undefined) l.Nota = String(p.nota).trim();
  escribir(l);
  return { ok: true, licencia: publica(l) };
}
function borrar(p) { var l = buscar(p); hoja(HOJA_LIC, COLS).deleteRow(l.fila); return { ok: true }; }

// Texto que escribe un juez: sin fórmulas (una celda que empieza con = + - @ se guarda como texto).
function seguro(v, max) { v = String(v || '').trim().slice(0, max); return /^[=+\-@]/.test(v) ? "'" + v : v; }

// Sugerencia desde la app: solo con un código existente y máximo SUG_POR_DIA al día por licencia.
function sugerir(p) {
  var c = limpio(p.codigo), texto = seguro(p.texto, 2000);
  if (!texto) return { ok: false, error: 'Escribe tu sugerencia.' };
  var l = licencias().filter(function (x) { return x.Codigo === c; })[0];
  if (!l) return { ok: false, motivo: 'no' };
  var hoy = new Date().toDateString();
  var deHoy = sugerencias().filter(function (x) { return x.codigo === c && new Date(x.fecha).toDateString() === hoy; }).length;
  if (deHoy >= SUG_POR_DIA) return { ok: false, error: 'Ya enviaste ' + SUG_POR_DIA + ' sugerencias hoy. Inténtalo mañana.' };
  hoja(HOJA_SUG, COLS_SUG).appendRow([Utilities.getUuid(), new Date(), c, seguro(l.Nombre, 200), texto, 'nueva']);
  return { ok: true };
}
function sugerencias() {
  var h = hoja(HOJA_SUG, COLS_SUG), n = h.getLastRow();
  if (n < 2) return [];
  return h.getRange(2, 1, n - 1, COLS_SUG.length).getValues().map(function (r, i) {
    return { fila: i + 2, id: String(r[0]), fecha: iso(r[1]), codigo: limpio(r[2]), nombre: String(r[3] || ''), texto: String(r[4] || ''), estado: String(r[5] || 'nueva') };
  }).filter(function (x) { return x.id; });
}
function cambiarSugerencia(p) {
  var s = sugerencias().filter(function (x) { return x.id === String(p.id || ''); })[0];
  if (!s) return { ok: false, error: 'No existe esa sugerencia.' };
  var h = hoja(HOJA_SUG, COLS_SUG);
  if (p.borrar) h.deleteRow(s.fila);
  else h.getRange(s.fila, 6).setValue(p.estado === 'atendida' ? 'atendida' : 'nueva');
  return { ok: true };
}
