/* BKA · Control de acceso para editar (rutinas, avisos, calendario) y panel de administración.
   Usa Firebase Authentication (usuario y contraseña) + Firestore:
   - bkaUsuarios/{uid}: nombre, usuario, roles {admin, rutinas, avisos, calendario}, activo.
   - bkaInvitaciones/{sha256(código)}: nombre, roles, usada. El código lo genera el administrador y es de un solo uso.
   - bkaAccesos: quién abrió qué parte para editar, cuándo entró y su última actividad / salida.
   - bkaConfig/admin: uid del administrador inicial.
   Requiere en la página: firebase-app-compat, firebase-auth-compat y firebase-firestore-compat 9.6.10. */
(function(){
const FB_CONFIG={apiKey:"AIzaSyA3Zni5o3VV_Q3zIdWSnhi9a0uQNNtZa_E",authDomain:"bkaapp-f61f4.firebaseapp.com",projectId:"bkaapp-f61f4",storageBucket:"bkaapp-f61f4.firebasestorage.app",messagingSenderId:"336720035886",appId:"1:336720035886:web:36fc6827c40ee030655fbf"};
const DOMINIO='@usuarios.bka-gimnasia.app';   // correo interno: nadie recibe correos, solo identifica al usuario
const MIN_PASS=8;
const ROLES={rutinas:'Editar rutinas',avisos:'Editar avisos',calendario:'Editar calendario',admin:'Administrador'};
let app,auth,db,perfil=null,acceso=null,latido=null;

function fb(){if(app)return;app=firebase.apps.length?firebase.app():firebase.initializeApp(FB_CONFIG);auth=firebase.auth();db=firebase.firestore();}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=n=>String(n||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'.').replace(/^\.+|\.+$/g,'');
const correo=n=>slug(n)+DOMINIO;
const limpiaCodigo=c=>String(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
async function sha256(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
// Formato de contraseña (criterio de Manu): mínimo 8 caracteres, al menos una mayúscula y un número.
function passOk(p){if(p.length<MIN_PASS)return`La contraseña debe tener al menos ${MIN_PASS} caracteres.`;if(!/[A-ZÁÉÍÓÚÑ]/.test(p))return'La contraseña debe tener al menos una letra mayúscula.';if(!/\d/.test(p))return'La contraseña debe tener al menos un número.';return'';}
function msgError(e){const c=e&&e.code||'';
  if(c==='auth/operation-not-allowed'||c==='auth/configuration-not-found')return'El acceso con usuario y contraseña todavía no está activado en Firebase.';
  if(c==='auth/wrong-password'||c==='auth/user-not-found'||c==='auth/invalid-email'||c==='auth/invalid-login-credentials')return'Nombre o contraseña incorrectos.';
  if(c==='auth/email-already-in-use')return'Ya existe un usuario con ese nombre. Si eres tú, entra con tu contraseña.';
  if(c==='auth/too-many-requests')return'Demasiados intentos. Espera unos minutos.';
  if(c==='auth/network-request-failed')return'Sin conexión a internet.';
  if(c==='permission-denied')return'No tienes permiso para esta acción.';
  return'No se pudo completar: '+(e&&e.message||e);}

/* ---------- ventana ---------- */
const CSS=`.bka-acc{position:fixed;inset:0;z-index:9999;background:rgba(3,7,16,.82);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Segoe UI',system-ui,sans-serif;color:#f2f6fa}
.bka-acc .caja{width:min(420px,100%);max-height:100%;overflow:auto;background:#0b1626;border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.bka-acc h2{margin:0 0 4px;font-size:19px}.bka-acc p{margin:0 0 12px;color:#9fb1c3;font-size:13px;line-height:1.4}
.bka-acc label{display:grid;gap:5px;font-size:13px;color:#9fb1c3;margin-bottom:10px}
.bka-acc input{font:inherit;color:#f2f6fa;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:10px}
.bka-acc .fila{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:6px}
.bka-acc button{font:inherit;cursor:pointer;border-radius:12px;padding:9px 14px;font-weight:700}
.bka-acc .pri{background:#e5007d;border:1px solid #e5007d;color:#fff}.bka-acc .sec{background:none;border:1px solid rgba(255,255,255,.22);color:#cfd8e3}
.bka-acc .lnk{background:none;border:0;color:#10a9c7;padding:4px 0;font-weight:600;text-decoration:underline}
.bka-acc .err{color:#ff6b6b;font-size:13px;margin:4px 0 8px}.bka-acc .ok{color:#00e0b8;font-size:13px;margin:4px 0 8px}`;
let capa=null;
function ventana(html){if(!document.getElementById('bka-acc-css')){const s=document.createElement('style');s.id='bka-acc-css';s.textContent=CSS;document.head.appendChild(s);}
  if(!capa){capa=document.createElement('div');capa.className='bka-acc';document.body.appendChild(capa);}
  capa.innerHTML=`<div class="caja">${html}</div>`;const f=capa.querySelector('input');if(f)f.focus();return capa;}
function cerrar(){if(capa){capa.remove();capa=null;}}

/* ---------- perfil y bitácora ---------- */
async function cargaPerfil(){const u=auth.currentUser;if(!u){perfil=null;return null;}
  const s=await db.collection('bkaUsuarios').doc(u.uid).get();perfil=s.exists?{uid:u.uid,...s.data()}:null;return perfil;}
function registraAcceso(modulo){
  if(acceso||!perfil)return;const ts=firebase.firestore.FieldValue.serverTimestamp();
  acceso=db.collection('bkaAccesos').doc();
  acceso.set({uid:perfil.uid,nombre:perfil.nombre,modulo:modulo||document.title,entrada:ts,ultima:ts,dispositivo:navigator.userAgent.slice(0,160)}).catch(e=>console.error(e));
  latido=setInterval(()=>{if(document.visibilityState==='visible')acceso.update({ultima:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{});},60000);
  const sale=()=>{acceso&&acceso.update({salida:firebase.firestore.FieldValue.serverTimestamp(),ultima:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{});};
  addEventListener('pagehide',sale);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')sale();});
}

/* ---------- pantallas ---------- */
function pantallaEntrar(rol,msg,res,rej,cancelable){
  ventana(`<h2>Acceso para editar</h2><p>${esc(ROLES[rol]||'')}: entra con tu nombre completo y tu contraseña.</p>
    <form id="f"><label>Nombre completo<input id="n" autocomplete="username" required></label>
    <label>Contraseña<input id="p" type="password" autocomplete="current-password" required></label>
    ${msg?`<div class="err">${esc(msg)}</div>`:''}
    <div class="fila">${cancelable?'<button type="button" class="sec" id="x">Cancelar</button>':'<span></span>'}<button class="pri">Entrar</button></div></form>
    <div class="fila"><button class="lnk" id="cod">Es mi primera vez: tengo un código</button></div>
    <div class="fila"><button class="lnk" id="ini" hidden>Configuración inicial (crear administrador)</button></div>`);
  db.collection('bkaConfig').doc('admin').get().then(s=>{const b=capa&&capa.querySelector('#ini');if(b&&!s.exists)b.hidden=false;}).catch(()=>{});
  capa.querySelector('#f').onsubmit=async e=>{e.preventDefault();const n=capa.querySelector('#n').value.trim(),p=capa.querySelector('#p').value;
    try{await auth.signInWithEmailAndPassword(correo(n),p);await despuesDeEntrar(rol,res,rej,cancelable);}
    catch(err){pantallaEntrar(rol,msgError(err),res,rej,cancelable);}};
  capa.querySelector('#cod').onclick=()=>pantallaCodigo(rol,'',res,rej,cancelable);
  capa.querySelector('#ini').onclick=()=>pantallaInicial(rol,'',res,rej,cancelable);
  const x=capa.querySelector('#x');if(x)x.onclick=()=>{cerrar();rej(new Error('cancelado'));};
}
async function despuesDeEntrar(rol,res,rej,cancelable){
  await cargaPerfil();
  if(!perfil){await auth.signOut();return pantallaEntrar(rol,'Este usuario no tiene perfil en BKA.',res,rej,cancelable);}
  if(perfil.activo!==true){await auth.signOut();perfil=null;return pantallaEntrar(rol,'Tu acceso está bloqueado. Habla con el administrador.',res,rej,cancelable);}
  if(rol&&!(perfil.roles&&perfil.roles[rol])){
    ventana(`<h2>Sin permiso</h2><p>${esc(perfil.nombre)}, tu usuario no tiene permiso para: ${esc(ROLES[rol]||rol)}. Pídeselo al administrador.</p>
      <div class="fila"><button class="sec" id="s">Salir de mi usuario</button>${cancelable?'<button class="pri" id="x">Cerrar</button>':''}</div>`);
    capa.querySelector('#s').onclick=async()=>{await salir();pantallaEntrar(rol,'',res,rej,cancelable);};
    const x=capa.querySelector('#x');if(x)x.onclick=()=>{cerrar();rej(new Error('sin permiso'));};return;}
  cerrar();res(perfil);
}
function pantallaCodigo(rol,msg,res,rej,cancelable,inv){
  ventana(`<h2>Primer acceso</h2><p>Escribe el código que te dio el administrador. Es de un solo uso.</p>
    <form id="f"><label>Código<input id="c" required placeholder="BKA-XXXX-XXXX" value="${esc(inv?inv.codigo:'')}"></label>
    ${inv?`<div class="ok">Código válido para: ${esc(inv.nombre)}</div>
      <label>Tu nombre completo (así entrarás)<input id="n" required value="${esc(inv.nombre)}"></label>
      <label>Crea tu contraseña (mín. ${MIN_PASS} caracteres, con una mayúscula y un número)<input id="p" type="password" autocomplete="new-password" required></label>
      <label>Repite tu contraseña<input id="p2" type="password" autocomplete="new-password" required></label>`:''}
    ${msg?`<div class="err">${esc(msg)}</div>`:''}
    <div class="fila"><button type="button" class="sec" id="v">Volver</button><button class="pri">${inv?'Crear mi acceso':'Revisar código'}</button></div></form>`);
  capa.querySelector('#v').onclick=()=>pantallaEntrar(rol,'',res,rej,cancelable);
  capa.querySelector('#f').onsubmit=async e=>{e.preventDefault();const codigo=capa.querySelector('#c').value.trim();
    try{const id=await sha256(limpiaCodigo(codigo));const s=await db.collection('bkaInvitaciones').doc(id).get();
      if(!s.exists)return pantallaCodigo(rol,'Código no válido.',res,rej,cancelable);
      const d=s.data();if(d.usada)return pantallaCodigo(rol,'Este código ya se usó. Pide uno nuevo al administrador.',res,rej,cancelable);
      if(!inv||inv.id!==id)return pantallaCodigo(rol,'',res,rej,cancelable,{id,codigo,nombre:d.nombre,roles:d.roles||{}});
      const n=capa.querySelector('#n').value.trim().replace(/\s+/g,' '),p=capa.querySelector('#p').value,p2=capa.querySelector('#p2').value;
      if(n.split(' ').length<2)return pantallaCodigo(rol,'Escribe tu nombre completo (nombre y apellido).',res,rej,cancelable,inv);
      const ep=passOk(p);if(ep)return pantallaCodigo(rol,ep,res,rej,cancelable,inv);
      if(p!==p2)return pantallaCodigo(rol,'Las contraseñas no coinciden.',res,rej,cancelable,inv);
      const cred=await auth.createUserWithEmailAndPassword(correo(n),p);const uid=cred.user.uid,ts=firebase.firestore.FieldValue.serverTimestamp();
      try{const b=db.batch();
        b.set(db.collection('bkaUsuarios').doc(uid),{nombre:n,usuario:slug(n),roles:inv.roles,activo:true,creado:ts,invitacion:id});
        b.update(db.collection('bkaInvitaciones').doc(id),{usada:true,usadaPor:uid,usadaEn:ts});
        await b.commit();}
      catch(err){await cred.user.delete().catch(()=>{});throw err;}
      await despuesDeEntrar(rol,res,rej,cancelable);}
    catch(err){pantallaCodigo(rol,msgError(err),res,rej,cancelable,inv);}};
}
function pantallaInicial(rol,msg,res,rej,cancelable){
  ventana(`<h2>Configuración inicial</h2><p>Solo se hace una vez: crea la cuenta del administrador (el que da los códigos y ve quién entra).</p>
    <form id="f"><label>Nombre completo<input id="n" required></label>
    <label>Contraseña (mín. ${MIN_PASS} caracteres, con una mayúscula y un número)<input id="p" type="password" autocomplete="new-password" required></label>
    <label>Repite la contraseña<input id="p2" type="password" autocomplete="new-password" required></label>
    ${msg?`<div class="err">${esc(msg)}</div>`:''}
    <div class="fila"><button type="button" class="sec" id="v">Volver</button><button class="pri">Crear administrador</button></div></form>`);
  capa.querySelector('#v').onclick=()=>pantallaEntrar(rol,'',res,rej,cancelable);
  capa.querySelector('#f').onsubmit=async e=>{e.preventDefault();
    const n=capa.querySelector('#n').value.trim().replace(/\s+/g,' '),p=capa.querySelector('#p').value,p2=capa.querySelector('#p2').value;
    if(n.split(' ').length<2)return pantallaInicial(rol,'Escribe tu nombre completo.',res,rej,cancelable);
    const ep=passOk(p);if(ep)return pantallaInicial(rol,ep,res,rej,cancelable);if(p!==p2)return pantallaInicial(rol,'Las contraseñas no coinciden.',res,rej,cancelable);
    try{const ya=await db.collection('bkaConfig').doc('admin').get();if(ya.exists)return pantallaInicial(rol,'Ya hay un administrador. Entra con tu usuario o pide un código.',res,rej,cancelable);
      const cred=await auth.createUserWithEmailAndPassword(correo(n),p);const uid=cred.user.uid,ts=firebase.firestore.FieldValue.serverTimestamp();
      try{const b=db.batch();b.set(db.collection('bkaConfig').doc('admin'),{uid,nombre:n,creado:ts});
        b.set(db.collection('bkaUsuarios').doc(uid),{nombre:n,usuario:slug(n),roles:{admin:true,rutinas:true,avisos:true,calendario:true},activo:true,creado:ts});
        await b.commit();}
      catch(err){await cred.user.delete().catch(()=>{});throw err;}
      await despuesDeEntrar(rol,res,rej,cancelable);}
    catch(err){pantallaInicial(rol,msgError(err),res,rej,cancelable);}};
}
function pantallaCuenta(msg,okMsg){
  ventana(`<h2>Mi cuenta</h2><p>${esc(perfil?perfil.nombre:'')}</p>
    <form id="f"><label>Contraseña actual<input id="a" type="password" autocomplete="current-password" required></label>
    <label>Contraseña nueva (mín. ${MIN_PASS}, una mayúscula y un número)<input id="p" type="password" autocomplete="new-password" required></label>
    <label>Repite la nueva<input id="p2" type="password" autocomplete="new-password" required></label>
    ${msg?`<div class="err">${esc(msg)}</div>`:''}${okMsg?`<div class="ok">${esc(okMsg)}</div>`:''}
    <div class="fila"><button type="button" class="sec" id="x">Cerrar</button><button class="pri">Cambiar contraseña</button></div></form>
    <div class="fila"><button class="lnk" id="s">Salir de mi usuario</button></div>`);
  capa.querySelector('#x').onclick=cerrar;
  capa.querySelector('#s').onclick=async()=>{await salir();cerrar();location.reload();};
  capa.querySelector('#f').onsubmit=async e=>{e.preventDefault();const a=capa.querySelector('#a').value,p=capa.querySelector('#p').value,p2=capa.querySelector('#p2').value;
    const ep=passOk(p);if(ep)return pantallaCuenta(ep);if(p!==p2)return pantallaCuenta('Las contraseñas no coinciden.');
    try{const u=auth.currentUser;await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,a));await u.updatePassword(p);pantallaCuenta('','Contraseña cambiada.');}
    catch(err){pantallaCuenta(msgError(err));}};
}

/* ---------- API ---------- */
async function salir(){if(acceso){await acceso.update({salida:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{});acceso=null;}
  clearInterval(latido);perfil=null;await auth.signOut();}
// Pide usuario con el rol indicado. opciones: {modulo:'nombre para la bitácora', cancelable:true}
function requiere(rol,op){op=op||{};fb();
  return new Promise((res,rej)=>{
    const listo=p=>{registraAcceso(op.modulo);res(p);};
    const un=auth.onAuthStateChanged(async u=>{un();
      try{if(u){await cargaPerfil();if(perfil&&perfil.activo===true&&(!rol||(perfil.roles&&perfil.roles[rol])))return listo(perfil);}}catch(e){console.error(e);}
      pantallaEntrar(rol,'',listo,rej,op.cancelable!==false);});
  });}
window.BKAAcceso={requiere,salir,cuenta:()=>{fb();if(perfil)pantallaCuenta();},perfil:()=>perfil,ROLES,sha256,limpiaCodigo,
  _fb:()=>{fb();return{auth,db};}};
})();
