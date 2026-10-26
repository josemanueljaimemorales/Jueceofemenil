/* Jueceo GAF MEX – editor de rutinas femenil para jueces (nota de partida / nota D).
   Niveles USAG N6-N10 (Development Program 2026-2030) y Junior FIG / FIG (Código FIG GAF 2025-2028).
   Viene de APPBKA modulos/femenil/rutinas/editor.js. Aquí: sin nube ni usuarios; las rutinas se guardan solo en el equipo
   del juez (localStorage). Los catálogos los carga app.js y llama a iniciarEditor(datos). */
const LOCAL='jueceofem_rutinas';
const APS=[['SALTO','Salto'],['BARRAS','Barras'],['VIGA','Viga'],['PISO','Piso']];
const EV={BARRAS:'UB',VIGA:'BB',PISO:'FX'};
const NIVELES=['N6','N7','N8','N9','N10','JR','FIG'];
const NIV_TXT={JR:'Junior FIG',FIG:'FIG'};
const LV={A:.1,B:.2,C:.3,D:.4,E:.5,F:.6,G:.7,H:.8,I:.9,J:1};
const VP={A:.1,B:.3,C:.5};
const LETRAS='ABCDEFGHIJ';

let FIG={}, FIGG={}, JUNIOR={}, US={}, USV={}, USR={};
let S={atletas:{},orden:[]};
let ui={view:'menu',atleta:null,ap:'BARRAS',open:-1,q:'',del:-1,delA:null};
let syncState=['ok','Guardado en este equipo'];
const root=document.getElementById('ed');

/* ---------- utilidades ---------- */
const r2=x=>Math.round(x*100+1e-9)/100;
const f1=x=>(Math.round(x*10+1e-9)/10).toFixed(1);
const f2=x=>(Math.round(x*100+1e-9)/100).toFixed(2);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nk=s=>String(s??'').replace(/½/g,' 1/2 ').replace(/¼/g,' 1/4 ').replace(/¾/g,' 3/4 ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9/.]+/g,' ').trim();
const esUSAG=n=>/^N/.test(n);
const numNivel=n=>+String(n).replace('N','');
const nivTxt=n=>NIV_TXT[n]||n;

/* ---------- catálogo ---------- */
// FIG: 'F|BARRAS|3.407'; USAG: 'U|BARRAS|5.503'; saltos USAG: 'V|1.101'.
function el(k){
  if(!k)return null;
  const [sys,ap,n]=k.split('|');
  if(sys==='F'){const e=FIG[ap+'|'+n];if(!e)return null;
    return{sys,ap,n,g:e.g,l:e.l||null,v:e.v??null,en:e.en||'',d:e.d||'',nom:e.nom||'',tipo:e.tipo||null,
      dmt:(ap==='BARRAS'||ap==='VIGA')&&e.g===6};}
  if(sys==='U'){const e=(US[ap]||{})[n];if(!e)return null;const g=+n.split('.')[0];
    const danza=(ap==='VIGA'&&g>=2&&g<=4)||(ap==='PISO'&&g<=2);
    return{sys,ap,n,g,l:e.l,en:e.en||'',d:e.d||'',nom:e.nom||'',conf:e.confianza||'',tipo:ap==='BARRAS'?null:(danza?'danza':'acro'),
      dmt:(ap==='BARRAS'&&g===8)||(ap==='VIGA'&&g===9)};}
  if(sys==='V'){return{sys,ap:'SALTO',n:ap,en:'',g:+String(ap).split('.')[0]};}
  return null;
}
function usSalto(nivel,n){return (USV[numNivel(nivel)]||[]).find(x=>x.n===n)||null;}
// Textos de búsqueda: español del Código (UPAG) + inglés + nombres + número.
const SYN={mortal:['salto'],mortales:['salto'],atras:['bwd','backward','back'],adelante:['fwd','forward','front'],lateral:['sideward','side'],
  agrupado:['tuck','tucked'],carpado:['pike','piked'],extendido:['stretched','layout','straight'],giro:['turn','twist','pirouette'],giros:['turn','twist'],
  rondada:['round','off'],paloma:['handspring'],inversion:['handspring'],rueda:['cartwheel'],parada:['handstand'],manos:['handstand','hand'],
  salida:['dismount'],entrada:['mount'],vuelta:['circle'],gigante:['giant'],doble:['double'],triple:['triple'],medio:['1/2'],
  flic:['flic','flac','flick'],flac:['flic','flac'],split:['split'],abierto:['straddle'],zancada:['leap'],salto_:['jump','leap','hop'],
  vela:['candle'],rodada:['roll'],rol:['roll'],valdez:['valdez'],kip:['kip'],baja:['lb','low'],alta:['hb','high'],banda:['bar'],
  cambio:['switch','change'],tijera:['scissor'],sissone:['sissonne'],anillo:['ring'],lobo:['wolf'],cuclillas:['tuck'],arabe:['arabian'],aereo:['aerial'],aerea:['aerial']};
const HAY={};
function hay(k){if(HAY[k])return HAY[k];const e=el(k);if(!e)return'';let extra='';
  if(e.sys==='U'){const fx=(US[e.ap][e.n]||{}).fig2025;const m=fx&&String(fx).match(/\d+\.\d+/);const f=m&&FIG[e.ap+'|'+m[0]];if(f)extra=' '+(f.d||'')+' '+(f.nom||'');}
  return HAY[k]=' '+nk(e.n+' '+e.en+' '+e.d+' '+e.nom+extra)+' ';}
function tokOk(h,t){if(h.includes(t))return true;return (SYN[t]||[]).some(s=>h.includes(' '+s)||h.includes(s+' '));}
function search(q,a,ap){
  const qn=nk(q);if(!qn)return[];const toks=qn.split(' ').filter(t=>t.length>1||/\d/.test(t));if(!toks.length)return[];
  let keys=[];
  if(ap==='SALTO'&&esUSAG(a.nivel))keys=(USV[numNivel(a.nivel)]||[]).map(x=>'V|'+x.n);
  else if(esUSAG(a.nivel))keys=Object.keys(US[ap]||{}).map(n=>'U|'+ap+'|'+n);
  else keys=Object.keys(FIG).filter(k=>k.startsWith(ap+'|')).map(k=>'F|'+k);
  const out=[];
  for(const k of keys){let h;
    if(k[0]==='V'){const x=usSalto(a.nivel,k.slice(2));h=' '+nk(x.n+' '+x.nombre_en+' '+vaultES(x.nombre_en))+' ';}else h=hay(k);
    if(!toks.every(t=>tokOk(h,t)))continue;
    const n=k.split('|').pop();let s=0;if(n===qn)s-=100;if(h.includes(' '+qn+' '))s-=10;s+=h.length/400;out.push([s,k]);}
  return out.sort((x,y)=>x[0]-y[0]).slice(0,14).map(x=>x[1]);
}
// Saltos USAG: la tabla usa abreviaturas en inglés (RO, FF, Hsp, Tsuk…); se agregan sus nombres comunes en español.
function vaultES(t){let x='';
  if(/\bRO\b/.test(t))x+=' rondada';if(/\bRO, FF\b/.test(t))x+=' yurchenko flic flac';if(/\bFF\b/.test(t))x+=' flic flac';
  if(/Hsp|FHS|Handspring/i.test(t))x+=' paloma inversion';if(/Tsuk/i.test(t))x+=' tsukahara';if(/Yami|Yamashita/i.test(t))x+=' yamashita';
  if(/tuck/i.test(t))x+=' agrupado';if(/pike/i.test(t))x+=' carpado';if(/layout/i.test(t))x+=' extendido';if(/twist|1\/1|1\/2/i.test(t))x+=' giro';
  if(/front/i.test(t))x+=' mortal adelante';if(/back (tuck|pike|layout)/i.test(t))x+=' mortal atras';return x;}
function labelOf(k,nivel){const e=el(k);if(!e)return'';
  if(e.sys==='V'){const x=usSalto(nivel,e.n);return x?x.nombre_en:'';}
  return (e.d||e.en||'').split('\n')[0];}
function letterOf(r){if(r.l)return r.l;const e=el(r.k);return e?e.l:null;}

/* ---------- reglas FIG ---------- */
const FLY_UB=/\bflight\b|\bsalto\b|release|hecht|tkatchev|jaeger|gienger|deltchev|\bpak\b|shaposh|ejova|ezhova|maloney|bhardwaj|seitz|hindorff|comaneci|markelov|nabieva|mitchell|downie|zuchold|galante|van leeuwen|ricna|fontaine|chusovitina|khorkina|komova|mustafina|derwael|counter|vuelo|suelta/i;
const flyUB=e=>!!e&&!e.dmt&&e.g!==1&&FLY_UB.test(e.en+' '+e.d+' '+e.nom);
const turnDeg=t=>{let m,mx=0;const re=/(\d{3,4})\s*°/g;while((m=re.exec(t)))mx=Math.max(mx,+m[1]);return mx;};
const esSaltoFX=e=>!!e&&e.ap==='PISO'&&(e.sys==='F'?(e.g===4||e.g===5):(e.g>=6));
const esAereo=e=>/aerial|a[eé]re[oa]/i.test(e.en+' '+e.d);
// Viga, acrobacia con vuelo. FIG: grupo 5. USAG (numeración FIG 2001): grupo 8 (mortales) y del grupo 7 los flic-flac,
// palomas, aéreos y rondadas (los walkovers y ruedas no tienen vuelo).
const vueloBB=e=>!!e&&!e.dmt&&e.tipo==='acro'&&(e.sys==='F'?(e.g===5||(e.g===1&&/salto|flight|handspring|flic/i.test(e.en))):
  (e.g===8||(e.g===7&&/flic|handspring|flyspring|aerial|free|salto|round.off|gainer/i.test(e.en))));
const giroBB=e=>!!e&&(e.sys==='F'?e.g===3:e.g===3);
const CR_ROLES=new Set(['1.303','1.403','1.304','1.207','1.308','1.514','4.203','4.204','4.304','4.105','4.305','4.206','4.306','4.207','4.307','5.405','5.505']);
const CR_TXT={
  BARRAS:['Vuelo de barra alta a barra baja','Vuelo en la misma barra','Agarres distintos (sin contar cast, entrada y salida)','Elemento sin vuelo con giro de 360° o más (no entrada)'],
  VIGA:['Conexión de 2 elementos de danza distintos, uno salto con split 180° o abierto','Giro (grupo 3) o rol/flair','Serie acrobática de 2 elementos con vuelo, uno mortal','Acrobacia adelante/lateral y atrás'],
  PISO:['Pasaje de danza: 2 saltos (leap/hop) distintos conectados, uno con split 180° o abierto','Mortal con giro de 360° o más','Doble mortal','Mortal atrás y mortal adelante (no aéreos)']};
function crAuto(ap,items){
  const E=items.map(x=>x.e),C=items;const res=[false,false,false,false];
  if(ap==='BARRAS'){
    C.forEach(({e})=>{if(!flyUB(e))return;const t=e.en;
      if(/\bLB\b/.test(t)&&!/(to|on|over|regrasp)( the)? (hang on |handstand on |support on )?HB/.test(t)&&!/LB to HB|from LB/.test(t))res[0]=true;
      else if(!/\bLB\b/.test(t))res[1]=true;});
    res[2]=E.some(e=>e&&!e.dmt&&e.g!==1&&/reverse grip|l-grip|el-grip|eagle|mixed grip|cubital|adler|\(l\)/i.test(e.en+' '+e.d));
    res[3]=E.some(e=>e&&!e.dmt&&e.g!==1&&!flyUB(e)&&turnDeg(e.en)>=360);
  }else if(ap==='VIGA'){
    for(let i=0;i<C.length-1;i++){const a=C[i],b=C[i+1];
      if(a.r.c&&a.e&&b.e&&a.e.tipo==='danza'&&b.e.tipo==='danza'&&a.k!==b.k&&(a.e.sys==='F'?a.e.g===2||b.e.g===2:true)&&/split|straddle|switch|ring|sissonne|180/i.test(a.e.en+' '+b.e.en))res[0]=true;
      if(a.r.c&&vueloBB(a.e)&&vueloBB(b.e)&&/salto/i.test(a.e.en+' '+b.e.en))res[2]=true;}
    res[1]=E.some(e=>giroBB(e)||(e&&e.sys==='F'&&CR_ROLES.has(e.n)));
    const ac=E.filter(e=>e&&e.tipo==='acro'&&!e.dmt&&e.g!==1&&!/hold|position/i.test(e.en));
    res[3]=ac.some(e=>/\bfwd\b|forward|\bswd\b|sideward|aerial|cartwheel|round.off/i.test(e.en))&&ac.some(e=>/\bbwd\b|backward/i.test(e.en));
  }else if(ap==='PISO'){
    const leap=e=>e&&e.ap==='PISO'&&(e.sys==='F'?e.g===1:e.g===1)&&!/\bjump\b/i.test(e.en);
    for(let i=0;i<C.length-1;i++){const a=C[i],b=C[i+1];
      if(a.r.c&&leap(a.e)&&leap(b.e)&&a.k!==b.k&&/split|straddle|switch|180/i.test(a.e.en+' '+b.e.en))res[0]=true;}
    const sal=E.filter(esSaltoFX);
    res[1]=sal.some(e=>/twist/i.test(e.en)&&turnDeg(e.en)>=360);
    res[2]=sal.some(e=>/double|triple/i.test(e.en));
    res[3]=sal.some(e=>/\bbwd\b|backward/i.test(e.en))&&sal.some(e=>/\bfwd\b|forward/i.test(e.en)&&!esAereo(e));
  }
  return res;
}
function cvFIG(ap,A,B,ind){
  const va=A.v,vb=B.v,lo=Math.min(va,vb),hi=Math.max(va,vb);
  if(ap==='BARRAS'){const fa=flyUB(A.e),fb=flyUB(B.e);let v=0;
    if(lo>=.4)v=.1;
    if(lo>=.5&&(fa||fb))v=.2;
    if(lo>=.4&&hi>=.6&&fa&&fb)v=.2;
    if(va>=.4&&fa&&vb>=.3)v=Math.max(v,.2);
    return{v,nota:v===.2&&lo<.5?'D con vuelo + C: solo vale 0.2 si el vuelo es en la misma barra o de BB a BA y el C se hace en barra alta':''};}
  if(ap==='VIGA'){const ea=A.e,eb=B.e;if(!ea||!eb||ea.dmt||eb.dmt)return{v:0};
    const fa=vueloBB(ea),fb=vueloBB(eb),da=ea.tipo==='danza',db=eb.tipo==='danza';
    if(fa&&fb){if((lo>=.3&&hi>=.4)||(lo>=.2&&hi>=.6))return{v:.2};if((lo>=.3)||(lo>=.2&&hi>=.4))return{v:.1,nota:lo===.2&&hi===.4?'B+D vale 0.2 si ambos son hacia adelante':''};return{v:0};}
    if(da&&db){if(lo>=.4)return{v:.2};if(lo>=.3)return{v:.1};if(giroBB(ea)&&giroBB(eb)&&hi>=.3)return{v:.1};return{v:0};}
    if((da&&fb)||(fa&&db)){if(lo>=.4)return{v:.2};if(lo>=.2&&hi>=.4)return{v:.1};return{v:0};}
    return{v:0};}
  if(ap==='PISO'){const ea=A.e,eb=B.e;if(!ea||!eb)return{v:0};
    if(esSaltoFX(ea)&&esSaltoFX(eb)){
      if(ind){if(lo>=.3&&hi>=.4)return{v:.2};if(lo>=.2&&hi>=.4)return{v:.1};return{v:0};}
      if((lo>=.2&&hi>=.4)||(lo>=.1&&hi>=.5))return{v:.2};if(lo>=.3||(lo>=.1&&hi>=.4))return{v:.1};return{v:0};}
    if(esSaltoFX(ea)&&eb.tipo==='danza'&&eb.g===1){if((va>=.4&&vb>=.2)||(va>=.5&&vb>=.1))return{v:.1};return{v:0};}
    if(ea.g===2&&eb.g===2&&ea.tipo==='danza'&&eb.tipo==='danza'){if(va>=.4&&vb>=.2)return{v:.1};return{v:0};}
    return{v:0};}
  return{v:0};
}
function computeFIG(a,ap){
  const rows=a.r[ap]||[], JR=a.nivel==='JR', notes=[], counted=new Set(), pot={};
  const items=rows.map((r,i)=>{const e=el(r.k);const l=letterOf(r);let v=l?LV[l]||0:0;if(JR&&v>.5)v=.5;return{r,i,e,k:r.k||('n:'+r.n),l,v,vr:l?LV[l]||0:0};});
  if(items.some(x=>x.e&&x.e.sys!=='F'))notes.push('Hay elementos del catálogo USAG: vuelve a elegirlos del Código FIG.');
  items.forEach(x=>{if(!x.l)notes.push(`#${x.i+1} sin valor: elige el elemento del Código o ponle valor.`);});
  if(JR)items.forEach(x=>{if(x.e&&(JUNIOR.prohibidos_candidatos||[]).some(p=>p.id===x.e.ap+'|'+x.e.n&&p.seguro))notes.push(`#${x.i+1} prohibido en Junior.`);});
  const seen=new Set(),uniq=[];
  items.forEach(x=>{if(!x.v)return;if(seen.has(x.k)){notes.push(`#${x.i+1} repetido: no vuelve a dar valor.`);return;}seen.add(x.k);uniq.push(x);});
  const sorted=[...uniq].sort((p,q)=>q.v-p.v);let chosen=[];
  if(ap==='BARRAS'||ap==='VIGA'){const d=sorted.find(x=>x.e&&x.e.dmt);if(d)chosen.push(d);}
  const cnt={acro:0,danza:0};chosen.forEach(x=>{if(x.e&&x.e.tipo)cnt[x.e.tipo]++;});
  for(const x of sorted){if(chosen.length>=8)break;if(chosen.includes(x))continue;
    const t=x.e&&x.e.tipo;if((ap==='VIGA'||ap==='PISO')&&t&&cnt[t]>=5)continue;chosen.push(x);if(t)cnt[t]++;}
  chosen.forEach(x=>counted.add(x.i));
  const dv=r2(chosen.reduce((s,x)=>s+x.v,0));
  if((ap==='VIGA'||ap==='PISO')&&uniq.length>=8&&(cnt.acro<3||cnt.danza<3))notes.push('Dentro de los 8 deben ir mínimo 3 de danza y 3 acrobáticos.');
  // Requisitos de composición: detección automática + lo que marque el entrenador.
  const au=crAuto(ap,items), man=(a.cr&&a.cr[ap])||{};
  const crDet=CR_TXT[ap].map((t,j)=>{const m=man[j];const hit=m===true||(m!==false&&au[j]);return{t,hit,auto:au[j],m};});
  const cr=r2(crDet.filter(c=>c.hit).length*.5);
  // Conexiones
  let cv=0;const used=new Map();
  for(let i=0;i<items.length-1;i++){const A=items[i],B=items[i+1];
    const p=cvFIG(ap,A,B,A.r.ind);pot[i]=p.v;
    if(!A.r.c)continue;let v=p.v;
    if(A.r.caida||B.r.caida){v=0;notes.push(`Conexión ${i+1}-${i+2} con caída: sin valor.`);}
    for(const x of[A,B]){const u=used.get(x.k);if(u!=null&&u!==i-1&&u!==i+1&&u!==i){v=0;notes.push(`#${x.i+1} ya se usó en otra conexión: no vuelve a dar CV.`);}}
    if(A.r.cvm!=null&&A.r.cvm!=='')v=+A.r.cvm;
    if(v>0){used.set(A.k,i);used.set(B.k,i);}
    if(p.nota&&A.r.c)notes.push(`Conexión ${i+1}-${i+2}: ${p.nota}.`);
    A.cv=v;cv+=v;}
  cv=r2(cv);
  // Bonificación de serie en viga: 3+ elementos conectados, mínimo B+B+C (salida mínimo C).
  let sb=0;
  if(ap==='VIGA'){let i=0;while(i<items.length){let j=i;while(j<items.length-1&&items[j].r.c)j++;
      const ch=items.slice(i,j+1);let ok=false;
      for(let w=0;w+2<ch.length;w++){const t=ch.slice(w,w+3);
        if(t.some(x=>x.r.caida))continue;
        if(t.every(x=>x.v>=.2&&!(x.e&&x.e.dmt&&x.v<.3)&&!(x.e&&/hold|position/i.test(x.e.en)))&&t.some(x=>x.v>=.3))ok=true;}
      if(ok)sb+=.1;i=j+1;}
    sb=r2(sb);}
  // Bonificación de salida
  let dmt=0;
  if(!JR){if(ap==='BARRAS'||ap==='VIGA'){const d=[...items].reverse().find(x=>x.e&&x.e.dmt);if(d&&d.vr>=.4&&!d.r.caida)dmt=.2;}
    else if(ap==='PISO'){const d=[...items].reverse().find(x=>esSaltoFX(x.e));if(d&&d.vr>=.4&&!d.r.caida&&a.p?.lineas!==false)dmt=.2;}}
  // Penalizaciones
  let nd=0;const n=uniq.length;
  if((ap==='BARRAS'||ap==='VIGA')&&!items.some(x=>x.e&&x.e.dmt)&&items.length){nd+=.5;notes.push('Sin salida: −0.50 (penalización neutral).');}
  const corto=JR?(n>=6?0:n===5?4:n>=3?6:n>=1?8:10):(n>=7?0:n>=5?4:n>=3?6:n>=1?8:10);
  if(corto&&items.length){nd+=corto;notes.push(`Ejercicio corto (${n} elementos con valor): −${corto.toFixed(2)}.`);}
  const D=r2(dv+cr+cv+sb+dmt);
  return{tipo:'FIG',np:D,dv,cr,cv,sb,dmt,nd,crDet,counted,pot,notes,items};
}
function computeSaltoFIG(a){
  const rows=a.r.SALTO||[],notes=[],vaults=rows.slice(0,2).map((r,i)=>{const e=el(r.k);const v=e&&e.sys==='F'?(e.v||0):(+r.v||0);return{v,r,e,i};});
  if(a.nivel==='JR')vaults.forEach(x=>{if(x.e&&(JUNIOR.prohibidos_candidatos||[]).some(p=>p.id==='SALTO|'+x.e.n&&p.seguro))notes.push(`Salto ${x.i+1}: prohibido en Junior (doble mortal).`);});
  if(rows.length>2)notes.push('Solo cuentan los 2 primeros saltos.');
  let avg=null;if(vaults.length===2){
    if(vaults[0].e&&vaults[1].e&&vaults[0].e.n===vaults[1].e.n)notes.push('El 2.º salto debe ser distinto (mismo número = 0 en final).');
    avg=r2((vaults[0].v+vaults[1].v)/2);
    if(a.nivel==='FIG'&&vaults[0].e&&vaults[1].e&&vaults[0].e.g===vaults[1].e.g)notes.push('Final de salto: 2 saltos del mismo grupo restan 2.00 al segundo.');}
  return{tipo:'FIG',np:vaults[0]?vaults[0].v:0,vaults,avg,notes,counted:new Set(vaults.map(x=>x.i))};
}

/* ---------- reglas USAG (Development 2026-2030) ---------- */
function creditoUSAG(L,ap,items,notes){
  // Devuelve por elemento: letra para VP (A/B/C) o restringido. Orden cronológico.
  let c6=false,cAcro8=false,de9=false;
  for(const x of items){const l=x.l;x.rest=false;x.vp=null;x.dvb=0;if(!l)continue;
    const danza=x.e&&x.e.tipo==='danza',ub=ap==='BARRAS';
    if(L<=8){
      if(l==='A'||l==='B'){x.vp=l;continue;}
      if(l==='C'){
        if(ub){if(L===6){if(!c6){c6=true;x.vp='B';}else x.rest=true;}else x.vp='B';continue;}
        if(danza){if(L===6){if(!c6){c6=true;x.vp='B';}else x.rest=true;}else x.vp='B';continue;}
        if(L===8&&!cAcro8){cAcro8=true;x.vp='B';continue;}
        x.rest=true;continue;}
      x.rest=true;continue;}
    if(L===9){
      if(l<='C'){x.vp=l;continue;}
      if(!ub&&danza){x.vp='C';continue;}
      if(!de9){de9=true;x.vp='C';if(!x.r.caida)x.dvb=.1;continue;}
      x.rest=true;continue;}
    // L10
    x.vp=l>'C'?'C':l;if(l>'C'&&(ub||!danza)&&!x.r.caida)x.dvb=l==='D'?.1:.2;
  }
  items.forEach(x=>{if(x.rest)notes.push(`#${x.i+1} (${x.l}) restringido en ${'N'+L}: −0.50 y sin valor.`);});
  if(L===7&&ap==='BARRAS'&&items.some(x=>x.l==='C'))notes.push('N7 barras: solo ciertos C son permitidos (cast a parada con ½, clear hip/stalder/pike a parada y esos con ½). Otro C es restringido.');
}
function cvUSAG(L,ap,A,B,ind){
  const cap=l=>L===9&&l>'C'?'C':l, la=cap(A.l), lb=cap(B.l);if(!la||!lb)return{v:0};
  const va=LV[la],vb=LV[lb],lo=Math.min(va,vb),hi=Math.max(va,vb),ea=A.e,eb=B.e;if(!ea||!eb)return{v:0};
  if(ap==='BARRAS'){const ft=e=>flyUB(e)||turnDeg(e.en)>=180;
    if(L===9){if(lo>=.3)return ft(ea)&&ft(eb)?{v:.2}:{v:.1};return{v:0};}
    if(lo>=.4)return{v:.2};if(lo>=.3&&hi>=.4)return{v:.1};
    if(lo>=.3)return ft(ea)&&ft(eb)?{v:.1}:{v:.1,nota:'C+C sin giro/vuelo solo vale si son 2 círculos distintos de grupos 3/6/7'};return{v:0};}
  if(ap==='VIGA'){if(ea.dmt||eb.dmt)return{v:0};const fa=vueloBB(ea),fb=vueloBB(eb),da=ea.tipo==='danza',db=eb.tipo==='danza';
    if(fa&&fb){if((lo>=.2&&hi>=.4)||(lo>=.3&&hi>=.3))return{v:.2};if(lo>=.2&&hi>=.3)return{v:.1};return{v:0};}
    if(giroBB(ea)&&giroBB(eb)&&lo>=.1&&hi>=.3)return{v:.1};
    // Danza o mixta: A+D / B+C = 0.1; B+D / C+C / C+D = 0.2.
    if((da||fa)&&(db||fb)){if((lo>=.2&&hi>=.4)||lo>=.3)return{v:.2};if((lo>=.1&&hi>=.4)||(lo>=.2&&hi>=.3))return{v:.1};}
    return{v:0};}
  if(ap==='PISO'){const sa=esSaltoFX(ea),sb=esSaltoFX(eb);
    if(sa&&sb){if(ind){if((lo>=.3)||(lo>=.1&&hi>=.5)||(lo>=.2&&hi>=.4))return{v:.2};if((lo>=.2&&hi>=.3)||(lo>=.1&&hi>=.4))return{v:.1};return{v:0};}
      if((lo>=.2&&hi>=.3)||(lo>=.1&&hi>=.4))return{v:.2};if((lo>=.2)||(lo>=.1&&hi>=.3))return{v:.1};return{v:0};}
    const da=ea.tipo==='danza',db=eb.tipo==='danza';
    if((da||sa)&&(db||sb)){if(lo>=.3&&hi>=.4)return{v:.2};if((lo>=.2&&hi>=.4)||(lo>=.3)||(sa&&va>=.4&&db))return{v:.1};}
    return{v:0};}
  return{v:0};
}
function computeUSAG(a,ap){
  const L=numNivel(a.nivel),R=USR[EV[ap]]?.[L]||{},G=USR.general||{},rows=a.r[ap]||[],notes=[],counted=new Set(),pot={};
  const items=rows.map((r,i)=>{const e=el(r.k);return{r,i,e,k:r.k||('n:'+r.n),l:letterOf(r)};});
  if(items.some(x=>x.e&&x.e.sys!=='U'))notes.push('Hay elementos del Código FIG: en niveles USAG elígelos del catálogo USAG.');
  items.forEach(x=>{if(!x.l)notes.push(`#${x.i+1} sin valor: elige el elemento o ponle valor.`);
    else if(x.e&&x.e.conf==='baja')notes.push(`#${x.i+1}: descripción USAG inferida; confirma que es el elemento correcto.`);});
  const seen=new Set(),uniq=[];
  items.forEach(x=>{if(!x.l)return;if(seen.has(x.k)){notes.push(`#${x.i+1} repetido: no vuelve a contar para VP (USAG permite 2.ª vez solo en conexión distinta).`);return;}seen.add(x.k);uniq.push(x);});
  creditoUSAG(L,ap,uniq,notes);
  // Partes de valor: los de mayor valor sustituyen a los menores (1 a 1).
  const req={...(G.vp_requeridos?.[L]||{})};delete req.fuente;
  const pool=uniq.filter(x=>x.vp).sort((p,q)=>q.vp.localeCompare(p.vp));
  const falt={A:0,B:0,C:0};
  for(const need of['C','B','A']){for(let k=0;k<(req[need]||0);k++){const j=pool.findIndex(x=>x.vp>=need);
      if(j<0){falt[need]++;continue;}counted.add(pool[j].i);pool.splice(j,1);}}
  const vpDed=r2(falt.A*VP.A+falt.B*VP.B+falt.C*VP.C);
  const restDed=r2(uniq.filter(x=>x.rest).length*.5);
  // Requisitos especiales (los marca el entrenador; la salida se detecta sola).
  const man=(a.sr&&a.sr[ap])||{};
  const srDet=(R.sr||[]).map((s,j)=>{const w=String(s.n).includes('/')?String(s.n).split('/').length:1;
    let auto=false;const m=String(s.texto).match(/^Salida.*?min\.\s*([A-E])/i);
    if(m){const d=[...items].reverse().find(x=>x.e&&x.e.dmt&&x.l&&!x.rest);auto=!!d&&d.l>=m[1].toUpperCase();}
    const mm=man[j];return{t:s.texto,n:s.n,w,auto,hit:mm===true||(mm!==false&&auto),m:mm};});
  const srFalt=srDet.filter(s=>!s.hit).reduce((s,x)=>s+x.w,0), srDed=r2(srFalt*.5);
  // Crédito de composición (N8-N10): lo marca el entrenador.
  const ccMax=G.cc_max?.[L]||0, ccm=(a.cc&&a.cc[ap])||{};
  const ccDet=(R.cc||[]).map((c,j)=>({t:c.regla,v:c.valor,tipo:c.tipo,hit:!!ccm[j]}));
  const cc=r2(Math.min(ccMax,ccDet.filter(c=>c.hit).reduce((s,c)=>s+c.v,0)));
  // Bono (N9-N10): valor de conexión + valor de dificultad.
  let cv=0,dvb=0,bon=0;
  if(L>=9){const used=new Map();
    for(let i=0;i<items.length-1;i++){const A=items[i],B=items[i+1];const p=cvUSAG(L,ap,A,B,A.r.ind);pot[i]=p.v;
      if(!A.r.c)continue;let v=p.v;
      if(A.r.caida||B.r.caida)v=0;
      if(A.rest||B.rest)v=0;
      for(const x of[A,B]){const u=used.get(x.k);if(u!=null&&u!==i-1&&u!==i+1&&u!==i)v=0;}
      if(A.r.cvm!=null&&A.r.cvm!=='')v=+A.r.cvm;
      if(v>0){used.set(A.k,i);used.set(B.k,i);}
      if(p.nota)notes.push(`Conexión ${i+1}-${i+2}: ${p.nota}.`);
      cv+=v;}
    dvb=uniq.reduce((s,x)=>s+(x.dvb||0),0);
    cv=r2(cv);dvb=r2(dvb);
    if(L===9)bon=r2(Math.min(.3,cv+Math.min(dvb,.1)));
    else{let c=cv,d=dvb;if(d===0)c=Math.min(c,.4);if(c===0)d=Math.min(d,.4);bon=r2(Math.min(.5,c+d));
      if(dvb>0)notes.push('Bono de valor de dificultad N10 (D +0.10 / E +0.20) tomado del código 2022-26: confirmar en el 2026-30.');}}
  const base=G.sv_base?.[L]??10;
  let sv=items.length?r2(Math.min(10,base-vpDed-srDed-restDed+cc+bon)):0;
  let nd=0;
  if(ap==='BARRAS'&&uniq.filter(x=>x.vp).length<5&&items.length){nd=2;notes.push('Barras con menos de 5 partes de valor: −2.00 (ejercicio corto).');}
  if(L===10&&sv>=10&&r2(cv+dvb)>=.6)notes.push('Puede recibir +0.10 extra (fuera de la NP) si además cumple el elemento E requerido.');
  if(L>=9)notes.push('USAG cuenta un elemento hasta 2 veces si va en conexión distinta; aquí solo cuenta la 1.ª vez.');
  return{tipo:'USAG',np:sv,base,vpDed,falt,req,srDet,srDed,restDed,cc,ccMax,ccDet,cv,dvb,bon,nd,counted,pot,notes,items};
}
function computeSaltoUSAG(a){
  const L=numNivel(a.nivel),rows=a.r.SALTO||[],notes=[];
  const exc=new Set(['2.302','2.311','3.407','4.306','4.309','4.403','4.407','5.301','5.408','5.409']);
  const vaults=rows.slice(0,2).map((r,i)=>{const n=r.k&&r.k.startsWith('V|')?r.k.slice(2):null;const x=n&&usSalto(a.nivel,n);
    let v=x?x.valor:0;if(!x&&r.k)notes.push(`Salto ${i+1}: no está permitido en ${a.nivel} (salto nulo).`);
    if(L===10&&x&&x.valor===10&&!exc.has(n)&&!r.caida)v=r2(v+.1);return{v,r,i,x};});
  if(rows.length>2)notes.push('Solo cuentan los 2 primeros saltos.');
  const best=vaults.length?Math.max(...vaults.map(x=>x.v)):0;
  if(L===10)notes.push('N10: +0.10 a saltos de 10.0 sin caída ni ayuda (excepto los marcados en la tabla).');
  return{tipo:'USAG',np:best,vaults,notes,counted:new Set(vaults.map(x=>x.i))};
}
function compute(a,ap){if(ap==='SALTO')return esUSAG(a.nivel)?computeSaltoUSAG(a):computeSaltoFIG(a);return esUSAG(a.nivel)?computeUSAG(a,ap):computeFIG(a,ap);}
function totals(n){const a=S.atletas[n],t={aa:0};for(const[ap]of APS){t[ap]=compute(a,ap);t.aa+=t[ap].np;}t.aa=r2(t.aa);return t;}

/* ---------- guardado ---------- */
function setSync(c,t){syncState=[c,t];const el=document.querySelector('.sync');if(el){el.className='sync '+c;el.textContent=t;}}
function save(){try{localStorage.setItem(LOCAL,JSON.stringify(S));setSync('ok','Guardado en este equipo');}
  catch(e){setSync('warn','No se pudo guardar en este equipo');}}

/* ---------- vistas ---------- */
function render(){ui.view==='menu'?renderMenu():ui.view==='list'?renderList():renderAthlete();}
// Inicio: crear rutinas, documentos oficiales (enlaces en config.js, JUECEO.docs), imprimir o descargar y sugerencias.
function renderMenu(){
  const D=(window.JUECEO&&window.JUECEO.docs)||{}, lnk=(u,t,c)=>u?`<a class="${c}" href="${esc(u)}" target="_blank" rel="noopener">${t}</a>`:'';
  const sug=!!(window.JUECEO&&window.JUECEO.api&&!/PENDIENTE/.test(window.JUECEO.api));
  root.innerHTML=`<header class="hero"><div class="hero-in">
    <div class="marca"><span class="m1">JUECEO</span><span class="m2">GAF MEX</span></div>
    <p class="lema">Herramienta para jueces de Gimnasia Artística Femenil</p>
    <div class="logos"><img src="img/fig.png" alt="FIG"><img src="img/fmg.png" alt="Federación Mexicana de Gimnasia"><img src="img/usag.png" alt="USA Gymnastics"></div>
  </div><span class="sync ${syncState[0]}">${esc(syncState[1])}</span></header>
  <div class="home">
    <button class="tile t-libre" data-act="libres"><span class="ico">＋</span><span class="tx"><b>Crear rutina libre</b><small>Niveles 6, 7, 8, 9, 10 (USAG), Junior FIG y FIG · nota de partida y nota D</small></span><span class="aa">›</span></button>
    <div class="tile t-doc"><img src="img/fig.png" alt=""><span class="tx"><b>Código FIG vigente</b><small>Código de Puntuación GAF 2025–2028</small>
      <span class="docbtns">${lnk(D.figES,'Español','dbtn')}${lnk(D.figEN,'English','dbtn')}${lnk(D.figNL,'Boletines FIG','dbtn dbtn2')}</span></span></div>
    <div class="tile t-doc"><img src="img/usag.png" alt=""><span class="tx"><b>Programa USAG vigente</b><small>Women's Development Program · Rules &amp; Policies y Código 2026–2030</small>
      <span class="docbtns">${lnk(D.usag,'Abrir','dbtn')}</span></span></div>
  </div>
  <div class="home-pie"><button class="btn" data-act="printall">Imprimir o guardar en PDF</button><button class="btn" data-act="export">Descargar en Excel</button>${sug?'<button class="btn ghost" data-act="sugerir">✉ Enviar sugerencia</button>':''}
    <small>Tus rutinas se guardan en este equipo. Imprímelas o descárgalas cuando las necesites (una hoja por atleta; en el diálogo de impresión elige "Guardar como PDF").</small></div>`;
}
function renderList(){
  let h=`<div class="top"><button class="back" data-act="menu">← Inicio</button><h1>Rutinas libres</h1><span class="sync ${syncState[0]}">${esc(syncState[1])}</span></div>`;
  h+=`<div class="cards">`;
  for(const n of S.orden){const a=S.atletas[n];if(!a)continue;const t=totals(n);
    h+=`<button class="card" data-act="open" data-v="${esc(n)}"><div><b>${esc(n)}</b><span class="lv">${esc(nivTxt(a.nivel))}</span></div><span class="aa">${esUSAG(a.nivel)?f2(t.aa):f2(t.aa)}</span></button>`;}
  h+=`</div>`;
  if(!S.orden.length)h+=`<div class="empty">Todavía no hay atletas. Agrega la primera abajo.</div>`;
  h+=`<div class="add"><div class="f" style="display:flex;gap:8px;flex-wrap:wrap"><input id="nn" placeholder="Nombre de la atleta" style="flex:1;min-width:180px">
    <select id="nl" style="background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:6px 8px">${NIVELES.map(n=>`<option value="${n}">${nivTxt(n)}</option>`).join('')}</select>
    <button class="btn" data-act="addA">Agregar atleta</button></div></div>`;
  h+=`<p class="ehelp" style="color:var(--muted);font-size:12px;margin-top:14px">N6–N10: Código USAG Development 2026-2030 (nota de partida sobre 10.0). Junior FIG y FIG: Código FIG GAF 2025-2028 (nota D). Total = suma de los 4 aparatos.</p>`;
  root.innerHTML=h;
}
function metaLine(r,res,i,a){
  const e=el(r.k),l=letterOf(r);let s='';
  if(e&&e.sys!=='V')s+=`<span class="code">${esc(e.sys==='U'?'USAG ':'')}${esc(e.n)}</span>`;
  if(e&&e.sys==='V'){const x=usSalto(a.nivel,e.n);s+=`<span class="code">USAG ${esc(e.n)}</span>`;}
  if(e&&e.sys==='F'&&e.ap==='SALTO')s+=`<span class="lt">${(e.v||0).toFixed(2)}</span> `;
  else if(e&&e.sys==='V'){const v=res.vaults?.find(x=>x.i===i);s+=`<span class="lt">${v?f2(v.v):'—'}</span> `;}
  else if(l){const it=res.items?.[i];s+=`<span class="lt ${it&&it.rest?'r':''}">${l}${r.l?' (manual)':''}</span> `;
    if(it&&it.vp&&it.vp!==l)s+=`<small>cuenta como ${it.vp}</small> `;}
  else s+=`<span class="lt r">sin valor</span> `;
  if(r.caida)s+=' · caída';
  const lab=labelOf(r.k,a.nivel);if(lab&&nk(lab)!==nk(r.n))s+=' · '+esc(lab.length>90?lab.slice(0,90)+'…':lab);
  return s;
}
function renderAthlete(){
  const a=S.atletas[ui.atleta];if(!a){ui.view='list';return renderList();}
  const rows=a.r[ui.ap]||(a.r[ui.ap]=[]),t=totals(ui.atleta),res=t[ui.ap],usag=esUSAG(a.nivel);
  let h=`<div class="top"><button class="back" data-act="list">← Atletas</button><h1></h1><span class="sync ${syncState[0]}">${esc(syncState[1])}</span></div>`;
  h+=`<div class="head"><h2>${esc(ui.atleta)}</h2><select data-act="nivel" aria-label="Nivel">${NIVELES.map(n=>`<option value="${n}" ${n===a.nivel?'selected':''}>${nivTxt(n)}</option>`).join('')}</select><span class="aatot">Total <b>${f2(t.aa)}</b></span></div>`;
  h+=`<div class="tabs">${APS.map(([k,l])=>`<button class="tab ${k===ui.ap?'on':''}" data-act="ap" data-v="${k}">${l}<span>${f2(t[k].np)}</span></button>`).join('')}</div>`;
  h+=`<div class="score"><div class="np"><strong>${f2(res.np)}</strong><em>${usag?'Nota de partida (USAG '+a.nivel+')':(ui.ap==='SALTO'?'Valor D del salto':'Nota D ('+nivTxt(a.nivel)+')')}</em></div>`;
  if(ui.ap==='SALTO'){
    h+=`<div class="metrics">${(res.vaults||[]).map((v,i)=>`<div><b>${f2(v.v)}</b><small>Salto ${i+1}</small></div>`).join('')}${res.avg!=null?`<div><b>${f2(res.avg)}</b><small>Promedio (final)</small></div>`:''}</div>`;
    h+=`<small class="ehelp" style="color:var(--muted)">${usag?'Se toma el salto de mayor valor.':'En clasificación / all-around cuenta 1 salto; en final por aparato se promedian 2.'}</small>`;
  }else if(res.tipo==='FIG'){
    h+=`<div class="metrics"><div><b>${f1(res.dv)}</b><small>Dificultad</small></div><div><b>${f1(res.cr)}</b><small>Composición</small></div><div><b>${f1(res.cv)}</b><small>Conexión</small></div><div><b>${f1(r2(res.sb+res.dmt))}</b><small>Bonos</small></div><div><b>${res.nd?'-'+f2(res.nd):'0.00'}</b><small>Penaliz.</small></div></div>`;
    h+=`<div class="sec">Requisitos de composición (0.50 c/u)</div><div class="cr">${res.crDet.map((c,j)=>`<label class="${c.hit?'hit':'miss'}"><input type="checkbox" data-act="cr" data-i="${j}" ${c.hit?'checked':''}><span>${esc(c.t)}${c.auto&&c.m==null?' <span class="auto">(detectado)</span>':''}${c.m!=null?' <small>marcado a mano · <a href="#" data-act="crauto" data-i="${j}">volver a automático</a></small>':''}</span></label>`).join('')}</div>`;
    if(ui.ap==='PISO'&&a.nivel==='FIG')h+=`<label class="opt"><input type="checkbox" data-act="lineas" ${a.p?.lineas!==false?'checked':''}> Tiene más de 2 líneas acrobáticas (requisito del bono de salida)</label>`;
    if(a.nivel==='JR')h+=`<small class="ehelp" style="color:var(--muted)">Junior: elementos F o más valen 0.50 y no hay bono de salida.</small>`;
  }else{
    h+=`<div class="metrics"><div><b>${f2(res.base)}</b><small>Base ${a.nivel}</small></div><div><b>${res.vpDed?'-'+f2(res.vpDed):'0.00'}</b><small>Partes de valor</small></div><div><b>${res.srDed?'-'+f2(res.srDed):'0.00'}</b><small>Req. especiales</small></div><div><b>${res.restDed?'-'+f2(res.restDed):'0.00'}</b><small>Restringidos</small></div><div><b>+${f2(r2(res.cc+res.bon))}</b><small>CC + bono</small></div></div>`;
    if(res.nd)h+=`<div class="chips"><span class="chip miss">Penalización aparte (juez árbitro): −${f2(res.nd)}</span></div>`;
    const reqTxt=['C','B','A'].filter(x=>res.req[x]).map(x=>`${res.req[x]}${x}`).join(' + ');
    const faltTxt=['C','B','A'].filter(x=>res.falt[x]).map(x=>`${res.falt[x]}${x}`).join(' + ');
    h+=`<div class="chips"><span class="chip ${faltTxt?'miss':'hit'}">Pide ${reqTxt}${faltTxt?' · faltan '+faltTxt:' · completo'}</span>${res.bon?`<span class="chip hit">Bono ${f2(res.bon)} (CV ${f2(res.cv)}${res.dvb?' + DV '+f2(res.dvb):''})</span>`:''}</div>`;
    h+=`<div class="sec">Requisitos especiales (0.50 c/u) — marca los que cumple</div><div class="cr">${res.srDet.map((c,j)=>`<label class="${c.hit?'hit':'miss'}"><input type="checkbox" data-act="sr" data-i="${j}" ${c.hit?'checked':''}><span>${esc(c.t)}${c.w>1?' (vale '+f2(c.w*.5)+')':''}${c.auto&&c.m==null?' <span class="auto">(detectado)</span>':''}</span></label>`).join('')}</div>`;
    if(res.ccDet.length)h+=`<div class="sec">Crédito de composición (máx. ${f2(res.ccMax)})</div><div class="cr">${res.ccDet.map((c,j)=>`<label class="${c.hit?'hit':''}"><input type="checkbox" data-act="cc" data-i="${j}" ${c.hit?'checked':''}><span>+${f2(c.v)} ${esc(c.t)}</span></label>`).join('')}</div>`;
  }
  if(res.notes.length)h+=`<div class="avisos"><b>Avisos (${new Set(res.notes).size})</b><ul class="notes">${[...new Set(res.notes)].map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div>`;
  h+=`</div><div class="list">`;
  if(!rows.length)h+=`<div class="empty">Sin elementos. Escribe abajo el primero.</div>`;
  const canLink=ui.ap!=='SALTO'&&(!usag||numNivel(a.nivel)>=9);
  rows.forEach((r,i)=>{
    h+=`<div class="row ${res.counted.has(i)?'':'off'}"><span class="num">${i+1}</span><div><button class="nm" data-act="edit" data-i="${i}">${esc(r.n)}</button><div class="meta">${metaLine(r,res,i,a)}</div></div>
      <div class="ctl"><button data-act="up" data-i="${i}" aria-label="Subir">↑</button><button data-act="down" data-i="${i}" aria-label="Bajar">↓</button><button data-act="del" data-i="${i}" aria-label="Quitar" class="${ui.del===i?'sure':''}">${ui.del===i?'Quitar':'✕'}</button></div></div>`;
    if(ui.open===i)h+=editPanel(r,i,a);
    if(i<rows.length-1){
      if(canLink){const pot=res.pot[i]||0;
        const lbl=r.c?(pot>0||(r.cvm!=null&&r.cvm!=='')?`Conectados +${f1(r.cvm!=null&&r.cvm!==''?+r.cvm:pot)}${r.cvm!=null&&r.cvm!==''?' (manual)':''}${r.ind?' · indirecta':''}`:'Conectados (sin valor de conexión)'):(pot>0?`Posible conexión +${f1(pot)} · toca para conectar`:'Conectar');
        h+=`<div class="link"><button class="${r.c?(pot>0||r.cvm?'on':''):''}" data-act="link" data-i="${i}">${lbl}</button>${r.c&&ui.ap==='PISO'?`<button class="nox" data-act="ind" data-i="${i}" title="Conexión indirecta (con rondada / flic-flac en medio)">${r.ind?'directa':'indirecta'}</button>`:''}</div>`;}
      else if(ui.ap!=='SALTO'&&(ui.ap==='VIGA'||usag)){h+=`<div class="link"><button class="${r.c?'on':''}" data-act="link" data-i="${i}">${r.c?'Conectados':'Conectar'}</button></div>`;}
      else h+='<div class="gap"></div>';}
  });
  h+=`</div><div class="add"><input id="q" placeholder="${ui.ap==='SALTO'?'Escribe el salto: nombre o número (ej. Yurchenko, 4.35)':'Escribe un elemento: nombre, apodo o número (ej. flic flac, Tkatchev, 3.407)'}" value="${esc(ui.q)}" autocomplete="off"><div id="sug"></div></div>`;
  h+=`<div class="actions"><button class="btn ghost" data-act="print">Imprimir / PDF</button><button class="btn ghost" data-act="delA">${ui.delA===ui.atleta?'Toca otra vez para borrar a '+esc(ui.atleta):'Borrar atleta'}</button></div>`;
  root.innerHTML=h;
  const q=document.getElementById('q');if(ui.q){q.focus();q.setSelectionRange(q.value.length,q.value.length);renderSug(ui.q);}
}
function editPanel(r,i,a){
  const e=el(r.k);let desc='';
  if(e&&e.sys==='V'){const x=usSalto(a.nivel,e.n);desc=x?x.nombre_en:'';}
  else if(e)desc=[e.d,e.en&&e.en!==e.d?e.en:''].filter(Boolean).join('\n');
  const usag=esUSAG(a.nivel),ap=ui.ap;
  let h=`<div class="panel"><div class="desc">${esc(desc)||'Elemento sin catálogo.'}${e&&e.conf&&e.conf!=='alta'?`\n(Descripción USAG con confianza ${esc(e.conf)}: confírmala.)`:''}</div>`;
  h+=`<div class="f"><label>Apodo <input type="text" data-act="nombre" data-i="${i}" value="${esc(r.n)}"></label></div>`;
  if(ap!=='SALTO'){const opts=usag?'ABCDE':LETRAS;
    h+=`<div class="f"><label>Valor <select data-act="letra" data-i="${i}"><option value="">${e&&e.l?'Del código ('+e.l+')':'—'}</option>${[...opts].map(x=>`<option ${r.l===x?'selected':''}>${x}</option>`).join('')}</select></label>`;
    if(i<(a.r[ap].length-1)&&r.c)h+=`<label>Conexión manual <select data-act="cvm" data-i="${i}"><option value="">automática</option>${['0','0.1','0.2'].map(v=>`<option ${String(r.cvm)===v?'selected':''}>${v}</option>`).join('')}</select></label>`;
    h+=`</div>`;}
  h+=`<div class="f"><label><input type="checkbox" data-act="caida" data-i="${i}" ${r.caida?'checked':''}> Caída</label><button class="btn ghost" data-act="replace" data-i="${i}">Cambiar elemento</button></div></div>`;
  return h;
}
function renderSug(q){
  const box=document.getElementById('sug');if(!box)return;const a=S.atletas[ui.atleta];
  const res=search(q,a,ui.ap);
  let h=res.map(k=>{const e=el(k);let sub='',lt='';
    if(e.sys==='V'){const x=usSalto(a.nivel,e.n);sub=x.nombre_en;lt=f2(x.valor);}
    else{sub=(e.d||e.en).split('\n').join(' · ');lt=e.ap==='SALTO'?(e.v||0).toFixed(2):e.l;}
    return`<button class="sugi" data-act="pick" data-v="${esc(k)}"><span class="code">${e.sys==='U'||e.sys==='V'?'USAG ':''}${esc(e.n)}</span><span class="lt">${esc(lt)}</span> ${esc(e.nom||'')}<small>${esc(sub.length>160?sub.slice(0,160)+'…':sub)}</small></button>`;}).join('');
  h+=`<button class="sugi" data-act="pickfree"><span class="code">+</span> Agregar "${esc(q)}" sin catálogo (le pones el valor a mano)</button>`;
  box.innerHTML=h;
}

/* ---------- impresión ---------- */
function printHTML(n){
  const a=S.atletas[n],t=totals(n),usag=esUSAG(a.nivel);
  let h=`<div class="fs"><div class="ph"><div><h1>${esc(n)}</h1><p>${esc(nivTxt(a.nivel))} · ${usag?'USAG Development 2026-2030':'Código FIG GAF 2025-2028'}</p></div><div class="paa"><span>${usag?'Notas de partida':'Notas D'} (suma)</span><b>${f2(t.aa)}</b></div></div><div class="grid2">`;
  for(const[ap,lab]of APS){const res=t[ap],rows=a.r[ap]||[];
    h+=`<div class="pap"><div class="pap-h"><h2>${lab}</h2><b>${f2(res.np)}</b></div>`;
    if(ap==='SALTO')h+=`<div class="pm">${(res.vaults||[]).map((v,i)=>`Salto ${i+1}: ${f2(v.v)}`).join(' · ')}${res.avg!=null?` · Promedio ${f2(res.avg)}`:''}</div>`;
    else if(res.tipo==='FIG')h+=`<div class="pm">Dificultad ${f1(res.dv)} · Composición ${f1(res.cr)} · Conexión ${f1(res.cv)} · Bonos ${f1(r2(res.sb+res.dmt))}${res.nd?` · Penalización −${f2(res.nd)}`:''}</div>`;
    else h+=`<div class="pm">Base ${f2(res.base)} · VP −${f2(res.vpDed)} · Req. esp. −${f2(res.srDed)}${res.restDed?` · Restringidos −${f2(res.restDed)}`:''} · CC ${f2(res.cc)} · Bono ${f2(res.bon)}</div>`;
    if(!rows.length)h+=`<div class="pf">Sin elementos.</div>`;
    else{h+='<table>';rows.forEach((r,i)=>{const e=el(r.k),l=letterOf(r);let v='';
        if(ap==='SALTO')v=e&&e.sys==='F'?(e.v||0).toFixed(2):(res.vaults?.find(x=>x.i===i)?f2(res.vaults.find(x=>x.i===i).v):'');else v=l||'';
        h+=`<tr class="${res.counted.has(i)?'':'off'}"><td class="n">${i+1}</td><td>${esc(r.n)}${r.caida?' (caída)':''}</td><td class="c">${e&&e.n?(e.sys==='U'||e.sys==='V'?'USAG ':'')+esc(e.n):''}</td><td class="v">${esc(v)}</td></tr>`;
        if(r.c&&i<rows.length-1){const cv=r.cvm!=null&&r.cvm!==''?+r.cvm:(res.pot?.[i]||0);h+=`<tr><td></td><td colspan="3" class="cx">↳ conectado${cv?' +'+f1(cv):''}${r.ind?' (indirecta)':''}</td></tr>`;}});
      h+='</table>';}
    h+='</div>';}
  return h+'</div></div>';
}
function printAthlete(n){let pa=document.getElementById('printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa);}
  pa.innerHTML=(Array.isArray(n)?n:[n]).map(printHTML).join('');setTimeout(()=>window.print(),50);}
// Excel: hoja "Notas" (una fila por atleta) y hoja "Rutinas" (una fila por elemento).
function exportExcel(){
  if(!window.XLSX){alert('No se pudo cargar el generador de Excel. Revisa tu internet.');return;}
  const notas=[['Atleta','Nivel',...APS.map(([,l])=>l),'Total']],rut=[['Atleta','Nivel','Aparato','#','Elemento','Código','Valor','Cuenta','Conexión','Caída']];
  for(const n of S.orden){const a=S.atletas[n];if(!a)continue;const t=totals(n);
    notas.push([n,nivTxt(a.nivel),...APS.map(([ap])=>+f2(t[ap].np)),+f2(t.aa)]);
    for(const[ap,lab]of APS){const res=t[ap];(a.r[ap]||[]).forEach((r,i)=>{const e=el(r.k),l=letterOf(r);
      let v=l||'';if(ap==='SALTO'){const x=res.vaults?.find(y=>y.i===i);v=x?+f2(x.v):'';}
      const cv=r.c?(r.cvm!=null&&r.cvm!==''?+r.cvm:(res.pot?.[i]||0)):'';
      rut.push([n,nivTxt(a.nivel),lab,i+1,r.n,e&&e.n?(e.sys==='U'||e.sys==='V'?'USAG ':'')+e.n:'',v,res.counted.has(i)?'Sí':'No',r.c?('+'+f1(cv)):'',r.caida?'Sí':'']);});}}
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(notas),'Notas');XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rut),'Rutinas');
  XLSX.writeFile(wb,'Rutinas GAF.xlsx');
}

/* ---------- eventos ---------- */
function A(){return S.atletas[ui.atleta];}
function rowsAp(){const a=A();return a.r[ui.ap]||(a.r[ui.ap]=[]);}
function addRow(k,free){const rows=rowsAp(),q0=ui.q.trim(),q=k&&/^[\d.\s]+$/.test(q0)?'':q0;
  const r={n:q||(k?labelOf(k,A().nivel):'Elemento'),k:k||null};
  if(ui.replace!=null&&ui.replace>=0&&rows[ui.replace]){const old=rows[ui.replace];rows[ui.replace]={...old,k:r.k,n:q||old.n,l:undefined};ui.replace=-1;}
  else rows.push(r);
  ui.q='';ui.open=-1;save();render();}
root.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const act=b.dataset.act,i=+b.dataset.i;
  if(b.tagName==='A')e.preventDefault();
  if(act==='open'){ui.atleta=b.dataset.v;ui.view='athlete';ui.ap='BARRAS';ui.open=-1;ui.q='';ui.del=-1;ui.delA=null;return render();}
  if(act==='list'||act==='libres'){ui.view='list';ui.delA=null;return render();}
  if(act==='menu'){ui.view='menu';return render();}
  if(act==='printall'){if(!S.orden.length){alert('Todavía no hay atletas.');return;}return printAthlete(S.orden.filter(n=>S.atletas[n]));}
  if(act==='export')return exportExcel();
  if(act==='sugerir')return window.abrirSugerencia&&window.abrirSugerencia();
  if(act==='addA'){const n=(document.getElementById('nn').value||'').trim().replace(/\s+/g,' ');const l=document.getElementById('nl').value;
    if(!n)return;if(S.atletas[n]){alert('Ya existe una atleta con ese nombre.');return;}
    S.atletas[n]={nivel:l,r:{SALTO:[],BARRAS:[],VIGA:[],PISO:[]},cr:{},sr:{},cc:{},p:{}};S.orden.push(n);save();ui.atleta=n;ui.view='athlete';ui.ap='BARRAS';return render();}
  if(act==='delA'){if(ui.delA!==ui.atleta){ui.delA=ui.atleta;return render();}
    delete S.atletas[ui.atleta];S.orden=S.orden.filter(x=>x!==ui.atleta);ui.view='list';ui.delA=null;save();return render();}
  if(act==='ap'){ui.ap=b.dataset.v;ui.open=-1;ui.q='';ui.del=-1;ui.replace=-1;return render();}
  if(act==='print'){return printAthlete(ui.atleta);}
  const a=A();if(!a)return;const rows=rowsAp();
  if(act==='pick')return addRow(b.dataset.v);
  if(act==='pickfree')return addRow(null,true);
  if(act==='edit'){ui.open=ui.open===i?-1:i;ui.del=-1;return render();}
  if(act==='up'&&i>0){[rows[i-1],rows[i]]=[rows[i],rows[i-1]];ui.open=-1;save();return render();}
  if(act==='down'&&i<rows.length-1){[rows[i+1],rows[i]]=[rows[i],rows[i+1]];ui.open=-1;save();return render();}
  if(act==='del'){if(ui.del!==i){ui.del=i;return render();}rows.splice(i,1);ui.del=-1;ui.open=-1;save();return render();}
  if(act==='link'){rows[i].c=!rows[i].c;if(!rows[i].c){delete rows[i].cvm;delete rows[i].ind;}save();return render();}
  if(act==='ind'){rows[i].ind=!rows[i].ind;save();return render();}
  if(act==='replace'){ui.replace=i;ui.q='';render();const q=document.getElementById('q');q.placeholder='Escribe el elemento que va en lugar del #'+(i+1);q.focus();return;}
  if(act==='crauto'){const m=(a.cr[ui.ap]=a.cr[ui.ap]||{});delete m[i];save();return render();}
});
root.addEventListener('change',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const act=b.dataset.act,i=+b.dataset.i,a=A();
  if(act==='nivel'){a.nivel=b.value;save();return render();}
  const rows=rowsAp();
  if(act==='letra'){if(b.value)rows[i].l=b.value;else delete rows[i].l;save();return render();}
  if(act==='cvm'){if(b.value==='')delete rows[i].cvm;else rows[i].cvm=b.value;save();return render();}
  if(act==='caida'){rows[i].caida=b.checked;save();return render();}
  if(act==='nombre'){rows[i].n=b.value.trim()||rows[i].n;save();return render();}
  if(act==='cr'){const m=(a.cr[ui.ap]=a.cr[ui.ap]||{});m[i]=b.checked;save();return render();}
  if(act==='sr'){const m=(a.sr[ui.ap]=a.sr[ui.ap]||{});m[i]=b.checked;save();return render();}
  if(act==='cc'){const m=(a.cc[ui.ap]=a.cc[ui.ap]||{});m[i]=b.checked;save();return render();}
  if(act==='lineas'){a.p=a.p||{};a.p.lineas=b.checked;save();return render();}
});
root.addEventListener('input',e=>{if(e.target.id==='q'){ui.q=e.target.value;if(ui.q.trim())renderSug(ui.q);else document.getElementById('sug').innerHTML='';}});
root.addEventListener('keydown',e=>{
  if(e.target.id==='nn'&&e.key==='Enter'){root.querySelector('[data-act=addA]').click();}
  if(e.target.id==='q'&&e.key==='Enter'){const f=root.querySelector('#sug [data-act=pick]');if(f)f.click();}
  if(e.target.id==='q'&&e.key==='Escape'){ui.q='';ui.replace=-1;render();}
});

/* ---------- inicio ---------- */
// La llama app.js con los catálogos ya cargados.
function iniciarEditor(d){
  FIG=d.fig.E;FIGG=d.fig.grupos;JUNIOR=d.fig.junior||{};US={BARRAS:d.us.BARRAS,VIGA:d.us.VIGA,PISO:d.us.PISO};USV=d.usv;USR=d.usr;
  let stored=null;try{stored=JSON.parse(localStorage.getItem(LOCAL)||'null');}catch(e){}
  S={atletas:stored?.atletas||{},orden:stored?.orden||[]};
  for(const n of Object.keys(S.atletas)){const a=S.atletas[n];a.r=a.r||{};for(const[ap]of APS)a.r[ap]=a.r[ap]||[];a.cr=a.cr||{};a.sr=a.sr||{};a.cc=a.cc||{};a.p=a.p||{};if(!S.orden.includes(n))S.orden.push(n);}
  S.orden=S.orden.filter(n=>S.atletas[n]);
  render();
}
