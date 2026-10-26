/* Panel del administrador: códigos de acceso y quién usa la app.
   Todo pasa por el servidor de licencias (apps-script/Codigo.gs) con la contraseña CLAVE_ADMIN, que se pide una vez y
   se queda guardada en este equipo (localStorage) hasta tocar "Salir" o hasta que cambie en Apps Script. La hoja de Google es el registro: también se
   puede editar a mano (desmarcar Activo = cancelar, borrar Equipos = liberar). */
(function(){
const box=document.getElementById('adm'), API=(window.JUECEO||{}).api||'';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bonito=c=>String(c||'').replace(/(.{5})(?=.)/g,'$1-');
const SS='jueceogaf_admin';
let clave='', D={licencias:[],accesos:[],sugerencias:[]}, tab='lic', filtro='', nuevo=null, cargando=false;
try{clave=localStorage.getItem(SS)||'';}catch(e){}

async function api(p){
  const r=await fetch(API,{method:'POST',body:JSON.stringify({...p,clave}),headers:{'Content-Type':'text/plain;charset=utf-8'}});
  const j=await r.json();
  if(j.clave===false){clave='';try{localStorage.removeItem(SS);}catch(e){}login(j.error);throw new Error(j.error);}
  if(!j.ok)throw new Error(j.error||'Error del servidor');
  return j;
}
const fecha=v=>v?new Date(v).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'}):'';
const fechaHora=v=>v?new Date(v).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
function hace(v){if(!v)return'nunca';const m=Math.round((Date.now()-Date.parse(v))/60000);
  if(m<2)return'ahora';if(m<60)return`hace ${m} min`;const h=Math.round(m/60);if(h<24)return`hace ${h} h`;const d=Math.round(h/24);return`hace ${d} día${d>1?'s':''}`;}
const aInput=v=>{if(!v)return'';const d=new Date(v);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function dispositivo(ua){ua=String(ua||'');
  const so=/iPhone/.test(ua)?'iPhone':/iPad/.test(ua)?'iPad':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows':/Mac OS/.test(ua)?'Mac':/Linux/.test(ua)?'Linux':'';
  const nav=/Edg\//.test(ua)?'Edge':/CriOS|Chrome\//.test(ua)?'Chrome':/FxiOS|Firefox\//.test(ua)?'Firefox':/Safari\//.test(ua)?'Safari':'';
  return [so,nav].filter(Boolean).join(' · ')||'Otro';}

function login(msg){
  box.innerHTML=`<div class="gate" style="padding-top:8vh"><h1>Administrador</h1><p>Jueceo GAF MEX: códigos de acceso y uso de la app.</p>
  <form id="flog" class="box"><input type="text" autocomplete="username" value="admin" hidden>
  <label>Contraseña<input id="lpass" type="password" autocomplete="current-password"></label>
  <button class="btn full" type="submit">Entrar</button><div class="msg ${msg?'bad':''}" id="lmsg">${esc(msg||'')}</div></form></div>`;
  const f=document.getElementById('flog');document.getElementById('lpass').focus();
  f.onsubmit=async e=>{e.preventDefault();const m=document.getElementById('lmsg');m.className='msg';m.textContent='Entrando…';
    clave=document.getElementById('lpass').value;
    try{await cargar();try{localStorage.setItem(SS,clave);}catch(e){}}catch(err){if(clave){m.className='msg bad';m.textContent=err.message||'No se pudo conectar.';}}};
}

async function cargar(){
  cargando=true;
  try{D=await api({accion:'admin_listar',accesos:500});D.sugerencias=D.sugerencias||[];}finally{cargando=false;}
  render();
}

function render(){
  const L=D.licencias, ahora=Date.now();
  const act=L.filter(l=>l.estado==='ok').length, nuevas=D.sugerencias.filter(x=>x.estado!=='atendida').length;
  const sem=new Set(D.accesos.filter(a=>!/^rechazado/.test(a.evento)&&ahora-Date.parse(a.fecha)<7*86400000).map(a=>a.codigo)).size;
  const hoy=new Set(D.accesos.filter(a=>!/^rechazado/.test(a.evento)&&new Date(a.fecha).toDateString()===new Date().toDateString()).map(a=>a.codigo)).size;
  let h=`<div class="top"><h1>Administrador</h1><button class="back" data-a="recargar">${cargando?'Actualizando…':'Actualizar'}</button><a class="back" href="./">Abrir la app</a><button class="back" data-a="salir">Salir</button></div>
  <div class="resumen"><div><b>${act}</b><small>licencias activas (de ${L.length})</small></div><div><b>${hoy}</b><small>jueces entraron hoy</small></div><div><b>${sem}</b><small>jueces en los últimos 7 días</small></div></div>
  <div class="tabs"><button class="${tab==='lic'?'on':''}" data-a="tab" data-v="lic">Licencias</button><button class="${tab==='acc'?'on':''}" data-a="tab" data-v="acc">Accesos</button><button class="${tab==='sug'?'on':''}" data-a="tab" data-v="sug">Sugerencias${nuevas?`<span class="n">${nuevas}</span>`:''}</button></div>`;
  h+=tab==='lic'?vistaLic():tab==='acc'?vistaAcc():vistaSug();
  const ae=document.activeElement&&document.activeElement.id;
  box.innerHTML=h;
  if(ae==='filtro'){const f=document.getElementById('filtro');f.focus();f.setSelectionRange(f.value.length,f.value.length);}
}
const coincide=(...xs)=>{const q=filtro.trim().toLowerCase();return !q||xs.some(x=>String(x||'').toLowerCase().includes(q)||String(x||'').toLowerCase().replace(/-/g,'').includes(q.replace(/-/g,'')));};
function buscador(){return`<div class="filtro"><input id="filtro" type="search" placeholder="Buscar juez o código" value="${esc(filtro)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" data-form-type="other"></div>`;}

function vistaLic(){
  let h=`<h2>Nueva licencia</h2><form id="fnueva" class="box" autocomplete="off"><div class="grid">
    <label>Juez<input id="nnom" required autocomplete="off" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" data-form-type="other" placeholder="Ej. Juan Pérez"></label>
    <label>Nota (contacto, pago…)<input id="nnota" autocomplete="off" data-1p-ignore="true" data-lpignore="true" data-form-type="other"></label>
    <label>Equipos permitidos<select id="nmax">${[1,2,3,4,5].map(v=>`<option ${v===2?'selected':''}>${v}</option>`).join('')}</select></label>
    <label>Vence (opcional)<input id="nvence" type="date"></label></div>
    <button class="btn" type="submit">Crear código</button></form>`;
  if(nuevo)h+=`<div class="nuevo" style="margin-top:10px">Código para <b>${esc(nuevo.nombre)}</b>: <code>${bonito(nuevo.codigo)}</code>
    <div class="actions"><button class="btn" data-a="copiar" data-id="${nuevo.codigo}">Copiar código</button><button class="btn" data-a="copiarmsg" data-id="${nuevo.codigo}">Copiar mensaje para el juez</button><button class="btn ghost" data-a="cerrarnuevo">Listo</button></div></div>`;
  const lista=D.licencias.filter(l=>coincide(l.nombre,l.codigo,bonito(l.codigo),l.nota)).sort((a,b)=>(Date.parse(b.ultimo||0)||0)-(Date.parse(a.ultimo||0)||0)||(Date.parse(b.creada||0)||0)-(Date.parse(a.creada||0)||0));
  h+=`<h2>Licencias (${D.licencias.length})</h2>${buscador()}<div class="lics">`;
  if(!lista.length)h+=`<div class="empty">${D.licencias.length?'Nada coincide con la búsqueda.':'Aún no hay licencias.'}</div>`;
  for(const l of lista){const e=l.estado==='ok'?'activa':l.estado;
    h+=`<div class="lic"><div class="fila"><b>${esc(l.nombre||'(sin nombre)')}</b><code>${bonito(l.codigo)}</code><span class="est ${e}">${e==='activa'?'Activa':e==='cancelada'?'Cancelada':'Vencida'}</span></div>
      <div class="fila"><small>Último acceso: <b>${hace(l.ultimo)}</b></small><small>Entradas: ${l.entradas}</small><small>Equipos: ${l.equipos} de ${l.max}</small><small>${l.vence?`Vence: ${fecha(l.vence)}`:'Sin vencimiento'}</small><small>Creada: ${fecha(l.creada)}</small>${l.nota?`<small>${esc(l.nota)}</small>`:''}</div>
      <div class="acc">${l.activo?`<button class="btn danger" data-a="cancelar" data-id="${l.codigo}">Cancelar acceso</button>`:`<button class="btn" data-a="reactivar" data-id="${l.codigo}">Reactivar</button>`}
      <button class="btn ghost" data-a="liberar" data-id="${l.codigo}" ${l.equipos?'':'disabled'}>Liberar equipos</button>
      <label class="btn ghost" style="display:inline-flex;gap:6px;align-items:center">Vence <input type="date" data-a="vence" data-id="${l.codigo}" value="${aInput(l.vence)}" style="padding:2px 4px;width:auto"></label>
      <select class="btn ghost" data-a="max" data-id="${l.codigo}" aria-label="Equipos permitidos">${[1,2,3,4,5].map(v=>`<option value="${v}" ${v===l.max?'selected':''}>${v} equipo${v>1?'s':''}</option>`).join('')}</select>
      <button class="btn ghost" data-a="verAcc" data-id="${l.codigo}">Ver accesos</button>
      <button class="btn ghost" data-a="copiar" data-id="${l.codigo}">Copiar código</button>
      <button class="btn ghost" data-a="borrar" data-id="${l.codigo}">Borrar</button></div></div>`;}
  return h+'</div>';
}
function vistaSug(){
  const lista=D.sugerencias.filter(x=>coincide(x.nombre,x.codigo,bonito(x.codigo),x.texto));
  let h=`<h2>Sugerencias de los jueces (${lista.length})</h2>${buscador()}<div class="sugs">`;
  if(!lista.length)h+='<div class="empty">Aún no hay sugerencias.</div>';
  for(const x of lista)h+=`<div class="sug ${x.estado==='atendida'?'atendida':''}"><div class="fila" style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center"><b>${esc(x.nombre||'—')}</b><small>${bonito(esc(x.codigo))}</small><small>${esc(fechaHora(x.fecha))}</small>${x.estado==='atendida'?'<span class="est">Atendida</span>':'<span class="est vencida">Nueva</span>'}</div>
    <p>${esc(x.texto)}</p><div class="acc" style="display:flex;gap:6px;flex-wrap:wrap">${x.estado==='atendida'?`<button class="btn ghost" data-a="sugnueva" data-s="${esc(x.id)}">Marcar como nueva</button>`:`<button class="btn" data-a="sugok" data-s="${esc(x.id)}">Marcar como atendida</button>`}<button class="btn ghost" data-a="sugborrar" data-s="${esc(x.id)}">Borrar</button></div></div>`;
  return h+'</div>';
}
function vistaAcc(){
  const lista=D.accesos.filter(a=>coincide(a.nombre,a.codigo,bonito(a.codigo)));
  let h=`<h2>Accesos recientes (${lista.length})</h2>${buscador()}<div class="accs">`;
  if(!lista.length)h+='<div class="empty">Sin accesos.</div>';
  for(const a of lista.slice(0,500))h+=`<div class="acc-f"><small>${esc(fechaHora(a.fecha))}</small><span><b>${esc(a.nombre||'—')}</b> <small>${bonito(esc(a.codigo))}</small></span>
    <small>${esc(dispositivo(a.navegador))}</small><span class="${/^rechazado/.test(a.evento)?'rech':''}">${esc(a.evento)}</span></div>`;
  return h+'</div>';
}

async function copiar(t){try{await navigator.clipboard.writeText(t);alert('Copiado.');}catch(e){prompt('Copia el texto:',t);}}
const finApp=()=>location.origin+location.pathname.replace(/admin(\.html)?$/,'');

async function accion(el){
  const a=el.dataset.a,id=el.dataset.id,l=D.licencias.find(x=>x.codigo===id);
  try{
    if(a==='salir'){if(!confirm('¿Salir del panel en este equipo? Te pedirá la contraseña la próxima vez.'))return;clave='';try{localStorage.removeItem(SS);}catch(e){}return login();}
    if(a==='recargar')return cargar();
    if(a==='tab'){tab=el.dataset.v;return render();}
    if(a==='verAcc'){tab='acc';filtro=bonito(id);return render();}
    if(a==='cerrarnuevo'){nuevo=null;return render();}
    if(a==='copiar')return copiar(bonito(id));
    if(a==='sugok'||a==='sugnueva'||a==='sugborrar'){if(a==='sugborrar'&&!confirm('¿Borrar esta sugerencia?'))return;el.disabled=true;
      await api({accion:'admin_sugerencia',id:el.dataset.s,...(a==='sugborrar'?{borrar:true}:{estado:a==='sugok'?'atendida':'nueva'})});return cargar();}
    if(a==='copiarmsg')return copiar(`Tu acceso a Jueceo GAF MEX (editor de rutinas para jueces):\n${finApp()}\nCódigo de licencia: ${bonito(id)}\nEl código se liga a tu celular o compu; no lo compartas. Tus rutinas se guardan en tu equipo.`);
    if(a==='cancelar'&&!confirm(`¿Cancelar el acceso de ${l.nombre}? Se le cierra la app en cuanto la abra o en máximo 30 minutos si la tiene abierta.`))return;
    if(a==='liberar'&&!confirm(`¿Liberar los ${l.equipos} equipos de ${l.nombre}? Tendrá que escribir su código otra vez en cada equipo.`))return;
    if(a==='borrar'&&!confirm(`¿Borrar la licencia de ${l.nombre}? No se puede deshacer. (Para solo quitarle el acceso usa "Cancelar acceso".)`))return;
    const p={cancelar:{activo:false},reactivar:{activo:true},liberar:{liberar:true}}[a];
    el.disabled=true;
    if(p)await api({accion:'admin_cambiar',codigo:id,...p});
    else if(a==='borrar')await api({accion:'admin_borrar',codigo:id});
    else return;
    await cargar();
  }catch(err){console.error(err);if(clave)alert('No se pudo: '+(err.message||err));}
}

box.addEventListener('click',e=>{const el=e.target.closest('button[data-a]');if(el)accion(el);});
box.addEventListener('input',e=>{if(e.target.id==='filtro'){filtro=e.target.value;render();}});
box.addEventListener('change',async e=>{const t=e.target,id=t.dataset.id;if(!id)return;
  try{if(t.dataset.a==='vence')await api({accion:'admin_cambiar',codigo:id,vence:t.value||''});
    else if(t.dataset.a==='max')await api({accion:'admin_cambiar',codigo:id,max:+t.value});
    else return;
    await cargar();}catch(err){console.error(err);if(clave)alert('No se pudo: '+(err.message||err));}});
box.addEventListener('submit',async e=>{if(e.target.id!=='fnueva')return;e.preventDefault();
  const nombre=document.getElementById('nnom').value.trim();if(!nombre)return;
  const b=e.target.querySelector('button');b.disabled=true;
  try{const r=await api({accion:'admin_crear',nombre,nota:document.getElementById('nnota').value.trim(),max:+document.getElementById('nmax').value,vence:document.getElementById('nvence').value||''});
    nuevo={codigo:r.codigo,nombre};await cargar();}
  catch(err){console.error(err);if(clave)alert('No se pudo crear: '+(err.message||err));b.disabled=false;}});

if(!API||/PENDIENTE/.test(API))box.innerHTML='<div class="gate"><h1>Administrador</h1><p>Falta poner la dirección del servidor de licencias en config.js.</p></div>';
else if(clave)cargar().catch(()=>login());
else login();
})();
