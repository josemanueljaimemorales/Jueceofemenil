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
    // Viga: las entradas marcadas (D) son danza y las (NA) no son acro (cuentan para VP, no para restricciones ni CC acro).
    const g1=ap==='VIGA'&&g===1?(/\(NA\)/.test(e.en||'')?'na':/\(D\)/.test(e.en||'')?'danza':null):null;
    const danza=(ap==='VIGA'&&g>=2&&g<=4)||(ap==='PISO'&&g<=2)||g1==='danza';
    return{sys,ap,n,g,l:e.l,en:e.en||'',d:e.d||'',nom:e.nom||'',conf:e.confianza||'',tipo:ap==='BARRAS'?null:(g1==='na'?'na':danza?'danza':'acro'),
      dmt:(ap==='BARRAS'&&g===8)||(ap==='VIGA'&&g===9)};}
  if(sys==='V'){return{sys,ap:'SALTO',n:ap,en:'',g:+String(ap).split('.')[0]};}
  return null;
}
function usSalto(nivel,n){return (USV[numNivel(nivel)]||[]).find(x=>x.n===n)||null;}
/* ---------- búsqueda (como Jueceo GAV: español e inglés, apodos aprendidos, corrige faltas de ortografía) ---------- */
// Cada palabra se lleva a una forma común, así lo escrito en español encuentra el texto en inglés (USAG solo tiene inglés)
// y al revés. "salto" en español es el salto gimnástico (jump) y en inglés es el mortal: el índice usa el idioma del texto
// y en lo que escribe el juez "salto" acepta las dos.
const STOP=new Set(['con','en','de','del','la','el','a','al','o','y','tambien','por','desde','las','los','un','una','to','the','of','or','and','with','from','on','in','also','s']);
const CANON={mortal:'mort',mortales:'mort',atras:'at',atr:'at',bwd:'at',backward:'at',back:'at',adelante:'ad',ade:'ad',adel:'ad',fwd:'ad',forward:'ad',front:'ad',
  lateral:'lat',lat:'lat',sideward:'lat',side:'lat',swd:'lat',agrupado:'agr',agrupada:'agr',agr:'agr',tuck:'agr',tucked:'agr',carpado:'carp',carpada:'carp',carp:'carp',pike:'carp',piked:'carp',
  extendido:'ext',extendida:'ext',ext:'ext',stretched:'ext',layout:'ext',straight:'ext',giro:'g',giros:'g',turn:'g',turns:'g',twist:'g',twists:'g',pirouette:'g',pirueta:'g',
  doble:'dob',double:'dob',dbl:'dob',triple:'tri',rondada:'rond',roundoff:'rond',ro:'rond',flic:'flic',flac:'flic',flick:'flic',flicflac:'flic',ff:'flic',
  paloma:'pal',handspring:'pal',hsp:'pal',fhs:'pal',rueda:'rueda',cartwheel:'rueda',parada:'hs',handstand:'hs',hs:'hs',invertido:'hs',salida:'sal',dismount:'sal',dmt:'sal',
  entrada:'ent',mount:'ent',zancada:'zanc',leap:'zanc',jump:'jump',hop:'hop',brinco:'hop',vuelta:'circ',circle:'circ',circulo:'circ',gigante:'gig',giant:'gig',
  split:'split',abierto:'abie',straddle:'abie',cambio:'camb',switch:'camb',change:'camb',tijera:'tij',scissor:'tij',sissone:'siss',sissonne:'siss',anillo:'anillo',ring:'anillo',
  lobo:'lobo',wolf:'lobo',arabe:'arab',arabian:'arab',aereo:'aereo',aerea:'aereo',aerial:'aereo',walkover:'wo',kip:'kip',bascula:'kip',glide:'kip',
  baja:'bi',bi:'bi',lb:'bi',low:'bi',inferior:'bi',alta:'bs',bs:'bs',hb:'bs',high:'bs',superior:'bs',suelta:'vuelo',release:'vuelo',vuelo:'vuelo',flight:'vuelo',
  pierna:'pie',piernas:'pie',leg:'pie',legs:'pie',medio:'1/2',media:'1/2',completo:'1/1',full:'1/1',viga:'viga',beam:'viga',barra:'barra',bar:'barra',bars:'barra',
  rol:'rol',rodada:'rol',roll:'rol',vela:'vela',candle:'vela',onda:'onda',wave:'onda',equilibrio:'equil',balance:'equil',scale:'equil',plancha:'equil'};
const CANON_ES={salto:'jump',saltos:'jump'}, CANON_EN={salto:'mort',saltos:'mort'};
const Q_ALT={salto:['jump','mort'],saltos:['jump','mort'],inversion:['pal','wo'],inversiones:['pal','wo']};
const Q_PESO={mort:.85};
const TIPOS=['jump','zanc','hop','mort','rol','pal','flic','rueda','wo','sal','ent','rond','aereo','equil','onda'];
const FAMILIA={jump:'d',zanc:'d',hop:'d',pal:'m',flic:'m',rond:'m',wo:'m',rueda:'m'};   // saltos de danza; apoyos de manos   // "salto" en español es primero el salto gimnástico
function frases(s){
  return (' '+nk(s)+' ').replace(/(\d\/\d)([a-z])/g,'$1 $2').replace(/ (\d) 1\/2 /g,(m,n)=>' '+(2*n+1)+'/2 ')
   .replace(/ (dos|2) giros? y medio /g,' 5/2 g ').replace(/ (uno|un|1) giro y medio /g,' 3/2 g ').replace(/ (tres|3) giros? y medio /g,' 7/2 g ')
   .replace(/ giro doble /g,' 2/1 g ').replace(/ giro triple /g,' 3/1 g ').replace(/ doble giro y medio /g,' 5/2 g ').replace(/ giro y medio /g,' 3/2 g ').replace(/ doble giro /g,' 2/1 g ').replace(/ triple giro /g,' 3/1 g ')
   .replace(/ (dos|2) giros /g,' 2/1 g ').replace(/ (tres|3) giros /g,' 3/1 g ').replace(/ (cuatro|4) giros /g,' 4/1 g ').replace(/ giro completo /g,' 1/1 g ').replace(/ medio giro /g,' 1/2 g ')
   .replace(/ flic flac /g,' flic ').replace(/ round off /g,' rond ').replace(/ barra (alta|superior) /g,' bs ').replace(/ barra (baja|inferior) /g,' bi ');
}
function canonT(s,lang){const ex=lang==='en'?CANON_EN:lang==='es'?CANON_ES:{};
  return frases(s).trim().split(' ').map(t=>ex[t]||CANON[t]||t).filter(t=>t&&!STOP.has(t));}
// Lo que escribe el juez: cada palabra con sus formas aceptadas.
function canonQ(s){return frases(s).trim().split(' ').filter(t=>t&&!STOP.has(t)).map(t=>Q_ALT[t]||[CANON[t]||t]);}
function keysAp(a,ap){
  if(ap==='SALTO'&&esUSAG(a.nivel))return (USV[numNivel(a.nivel)]||[]).map(x=>'V|'+x.n);
  if(esUSAG(a.nivel))return Object.keys(US[ap]||{}).map(n=>'U|'+ap+'|'+n);
  return Object.keys(FIG).filter(k=>k.startsWith(ap+'|')).map(k=>'F|'+k);}
const IDX={};
function idx(k,nivel){const ck=k[0]==='V'?numNivel(nivel)+'|'+k:k;if(IDX[ck])return IDX[ck];const e=el(k);let toks=[],raw='';
  if(k[0]==='V'){const x=usSalto(nivel,k.slice(2))||{};raw=(x.nombre_en||'')+' '+vaultES(x.nombre_en||'');toks=[...canonT(x.nombre_en||'','en'),...canonT(vaultES(x.nombre_en||''),'es')];}
  else{let extra='';if(e.sys==='U'){const fx=(US[e.ap][e.n]||{}).fig2025;const m=fx&&String(fx).match(/\d+\.\d+/);const f=m&&FIG[e.ap+'|'+m[0]];if(f)extra=(f.d||'')+' '+(f.nom||'');}
    // Saltos FIG: nombres de uso común por grupo (el Código dice "rondada flic-flac" para el Yurchenko, etc.).
    if(e.ap==='SALTO')extra+=' '+({1:'paloma yamashita',2:'paloma',3:'tsukahara',4:'yurchenko',5:'rondada medio giro'}[e.g]||'');
    raw=e.en+' '+e.d+' '+e.nom+' '+extra;toks=[...canonT(e.en,'en'),...canonT(e.d,'es'),...canonT(extra,'es'),...canonT(e.nom,'')];}
  const pri=t=>String(t||'').split(/\n|;|\balso\b|\btambién\b|\bor\b| o | \/ /)[0];
  const main=k[0]==='V'?toks:[...canonT(pri(e.en),'en'),...canonT(pri(e.d),'es')];
  return IDX[ck]={toks:[...new Set(toks)],main:new Set(main.length?main:toks),raw:nk(raw)};}
// Apodos: los que el juez ya usó en sus rutinas y los aprendidos al elegir un elemento (S.alias).
const sisDe=nivel=>esUSAG(nivel)?'U':'F';
function apodos(ap,nivel){const m={},sis=sisDe(nivel);
  for(const x of Object.values(S.atletas||{})){if(!x||sisDe(x.nivel)!==sis)continue;
    for(const o of x.r?.[ap]||[])if(o.k&&el(o.k)&&o.n&&!/^[\d.\s]+$/.test(o.n)){const n=nk(o.n);if(n&&n!==nk(labelOf(o.k,x.nivel)))m[n]=o.k;}}
  for(const [ak,k] of Object.entries(S.alias||{}))if(ak.startsWith(sis+'|'+ap+'|'))m[ak.slice(sis.length+ap.length+2)]=k;
  return m;}
function distancia(a,b){if(Math.abs(a.length-b.length)>2)return 9;const m=[...Array(b.length+1).keys()];
  for(let i=1;i<=a.length;i++){let prev=m[0];m[0]=i;for(let j=1;j<=b.length;j++){const t=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=t;}}return m[b.length];}
// "tkachev" → "tkatchev", "shaposnikova" → "shaposhnikova": cada palabra desconocida se cambia por la más parecida.
function corregir(qn,a,ap){const v=new Set();
  for(const k of keysAp(a,ap))idx(k,a.nivel).raw.split(' ').forEach(w=>{if(w.length>=4&&!/\d/.test(w))v.add(w);});
  Object.keys(apodos(ap,a.nivel)).forEach(t=>t.split(' ').forEach(w=>{if(w.length>=4)v.add(w);}));
  const voc=[...v];let cambio=false;
  const out=qn.split(' ').map(w=>{if(w.length<4||v.has(w)||/\d/.test(w)||STOP.has(w)||CANON[w]||Q_ALT[w]||voc.some(c=>c.startsWith(w)))return w;
    let mejor=null,dm=w.length>=7?2:1;for(const c of voc){const d=distancia(w,c.slice(0,Math.max(w.length,c.length)));if(d<=dm&&(!mejor||d<dm)){mejor=c;dm=d;}}
    if(mejor){cambio=true;return mejor;}return w;});
  return cambio?out.join(' '):null;}
function search(q,a,ap,sinCorregir){
  const qn=nk(q);if(!qn)return[];const qt=canonQ(qn);const out=new Map();
  const add=(k,sc)=>{const p=out.get(k);if(p==null||p<sc)out.set(k,sc);};
  const keys=keysAp(a,ap),valid=new Set(keys);
  // Número del Código escrito (3.407, 4.35; en USAG también 5.503)
  if(/^\d+\.\d+$/.test(qn))for(const k of keys){if(k.split('|').pop()===qn)add(k,5);}
  for(const [an,k] of Object.entries(apodos(ap,a.nivel))){if(!valid.has(k))continue;
    if(an===qn)add(k,4);else if(an.startsWith(qn))add(k,3.4);else if(an.includes(qn))add(k,3);
    else if(qn.length>=6&&distancia(qn.replace(/ /g,''),an.replace(/ /g,'').slice(0,qn.replace(/ /g,'').length))<=1)add(k,2.6);}
  if(qt.length)for(const k of keys){const it=idx(k,a.nivel);
    const pes=alts=>{let m=0;for(const t of alts)if(it.toks.some(x=>x.startsWith(t))||(t.length>=4&&it.raw.includes(t)))m=Math.max(m,Q_PESO[t]||1);return m;};
    const ws=qt.map(pes),hit=ws.filter(w=>w>0).length,peso=ws.reduce((x,y)=>x+y,0);
    if(!hit||hit<Math.max(1,qt.length-1))continue;
    const plano=qt.flat();const extra=it.toks.filter(x=>!plano.some(t=>x.startsWith(t))).length;
    let sc=peso/qt.length*(hit===qt.length?1.5:1)-0.01*extra;
    // Lo que no se pidió baja el elemento: doble/triple, giros (si no se escribió ninguno) y otro tipo de elemento
    // ("giro 1/1" prefiere el giro y no el salto con giro; "gigante" el gigante sin giro).
    const M=it.main,fam=new Set(plano.map(t=>FAMILIA[t]).filter(Boolean));
    if(M.has('dob')&&!plano.includes('dob'))sc-=.4;if(M.has('tri')&&!plano.includes('tri'))sc-=.4;
    if(!plano.some(t=>t==='g'||/\d\/\d/.test(t))&&[...M].some(t=>t==='g'||/^\d\/\d$/.test(t)))sc-=.4;
    sc-=.25*Math.min(2,TIPOS.filter(t=>M.has(t)&&!plano.includes(t)&&!(FAMILIA[t]&&fam.has(FAMILIA[t]))).length);
    add(k,sc);}
  const res=[...out.entries()].sort((x,y)=>y[1]-x[1]).slice(0,14);
  if(!sinCorregir&&(!res.length||res[0][1]<1)){const q2=corregir(qn,a,ap);
    if(q2){const r2=search(q2,a,ap,true);if(r2.length)return r2;}}
  return res.map(x=>x[0]);
}
// Saltos USAG: la tabla usa abreviaturas en inglés (RO, FF, Hsp, Tsuk…); se agregan sus nombres comunes en español.
function vaultES(t){let x='';
  if(/\bRO\b/.test(t))x+=' rondada';if(/\bRO, FF\b/.test(t))x+=' yurchenko flic flac';if(/\bFF\b/.test(t))x+=' flic flac';
  if(/Hsp|FHS|Handspring/i.test(t))x+=' paloma inversion';if(/Tsuk/i.test(t))x+=' tsukahara';if(/Yami|Yamashita/i.test(t))x+=' yamashita';
  if(/tuck/i.test(t))x+=' agrupado';if(/pike/i.test(t))x+=' carpado';if(/layout/i.test(t))x+=' extendido';if(/twist|1\/1|1\/2/i.test(t))x+=' giro';
  if(/front/i.test(t))x+=' mortal adelante';if(/back (tuck|pike|layout)/i.test(t))x+=' mortal atras';return x;}
function labelOf(k,nivel){const e=el(k);if(!e)return'';
  if(e.sys==='V'){const x=usSalto(nivel,e.n);return x?x.nombre_en:'';}
  // Primera línea con texto, sin notas del Código ("Considered as different elements") ni ligaduras del PDF (ﬀ, ﬁ).
  const lim=t=>String(t||'').replace(/ﬀ/g,'ff').replace(/ﬁ/g,'fi').replace(/ﬂ/g,'fl').replace(/\(?\s*considered as different elements\s*\)?/ig,'').replace(/\s+/g,' ').trim();
  return (e.d||e.en||'').split('\n').map(lim).find(Boolean)||'';}
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

/* ---------- reglas USAG (Development 2026-2030) ----------
   Especificación: REGLAS_USAG (ids de regla entre corchetes en los comentarios). Las listas de números USAG viven en
   datos/usag_reglas.json → "listas" (permitidos por nivel, vuelos, cambios de barra, círculos 3/6/7, CV especial…) y las
   variantes que el catálogo agrupa en un mismo número en "listas.variantes" (el juez la elige en el elemento). */
const LORD='ABCDE';
const lge=(l,m)=>!!l&&LORD.includes(l)&&LORD.indexOf(l)>=LORD.indexOf(m);
const lmin=(a,b)=>LORD.indexOf(a)<=LORD.indexOf(b)?a:b, lmax=(a,b)=>LORD.indexOf(a)>=LORD.indexOf(b)?a:b;
const LSU=()=>(USR&&USR.listas)||{};
const enL=(ev,k,n)=>!!n&&((LSU()[ev]||{})[k]||[]).includes(n);
function variantesDe(e){return e&&e.sys==='U'?((LSU().variantes||{})[e.ap+'|'+e.n]||[]):[];}
// Texto principal del elemento (el catálogo junta variantes: "…; also with ½ turn"): solo la primera.
// El catálogo pega a veces dos descripciones sin puntuación ("…to clear support Clear straddle circle…"): también se corta ahí.
const primario=t=>String(t||'').split(/;|\.\.\.|\. \.|\balso\b|\(also|\bor\b/i)[0].split(/(?<=[a-z)]) (?=[A-Z][a-z])/)[0];
const GIRO_RE=/(½|1\/2|1\/1|1½|2\/1|180°|360°|540°|720°) ?(\(?\d{3}°\)? )?turn|pirouette|healy/i;
const SPOT_TXT={E:'ayuda durante el elemento',L:'ayuda al aterrizar'};
// Predicados de barras [§0.4 UB]
const U={
  vuelo:x=>x.g!==8&&['vuelo_bs_bi','vuelo_bi_bs','vuelo_misma','vuelo_entrada'].some(k=>enL('UB',k,x.n)),
  entreBarras:x=>enL('UB','vuelo_bs_bi',x.n)||enL('UB','vuelo_bi_bs',x.n),
  unaBarra:x=>enL('UB','vuelo_misma',x.n),
  cambio:x=>U.entreBarras(x)||enL('UB','cambio_barra',x.n)||!!(x.vr&&x.vr.cb),
  c367:x=>enL('UB','circulo_367',x.n),
  circ:x=>U.c367(x)||enL('UB','gigantes',x.n),
  giro:x=>!!(x.vr&&x.vr.giro)||GIRO_RE.test(primario(x.en)),
  cast:x=>enL('UB','cast_hs',x.n),
  salidaMortal:x=>x.g===8&&/salto|flyaway/i.test(x.en)&&!/hecht(?!.*salto)/i.test(x.en),
  adelante:x=>enL('UB','adelante',x.n)||/forward/i.test(primario(x.en)),
};
// Predicados de viga [§0.4 BB, BB-G-1]
const BV={
  danza:x=>x.tipo==='danza',
  acro:x=>x.tipo==='acro',
  vuelo:x=>x.g===8||(x.g===7&&/flic|handspring|flyspring|aerial|free|round.off|gainer|butterfly|flight phase|kolesnikova/i.test(x.en))||enL('BB','vuelo_extra',x.n),
  vueloEnt:x=>x.g===1&&x.tipo==='acro'&&/salto|flic|handspring|flyspring|round.off|aerial|hecht/i.test(x.en),
  mortal:x=>x.g===8||(x.g===9&&/salto|aerial/i.test(x.en)),
  aereo:x=>/aerial|butterfly/i.test(x.en),
  salida:x=>x.g===9&&/salto|aerial/i.test(x.en)&&!enL('BB','salida_no_mortal',x.n),
  hs:x=>x.g===7||(x.g===5&&/handstand/i.test(x.en))||x.n==='6.204'||x.n==='6.203',
  salto180:x=>x.g===2&&/split|straddle|switch|ring|sissonne|180/i.test(primario(x.en))&&!enL('BB','salto180_excluir',x.n),
  giro360:x=>{if(x.g!==3||enL('BB','giro360_excluir',x.n))return false;const t=primario(x.en);return turnDeg(t)>=360||/1\/1|1½|2\/1|3\/1|4\/1/.test(t);},
  atras:x=>/backward|flic|gainer/i.test(x.en), adelante:x=>/forward|handspring|aerial walkover/i.test(x.en), lateral:x=>/cartwheel|round.off|sideward/i.test(x.en),
};
// Predicados de piso [§0.4 FX]
const FV={
  danza:x=>x.g===1||x.g===2,
  salto:x=>x.g>=6&&x.g<=8,
  vuelo:x=>FV.salto(x)||(x.g===5&&/handspring|flyspring|round.off|flic|aerial|free|cartwheel.*flight|butterfly/i.test(x.en))||enL('FX','vuelo_extra',x.n),
  aereo:x=>enL('FX','aereos',x.n)||x.n==='5.104',
  atras:x=>x.g===8||enL('FX','atras_extra',x.n),
  adelante:x=>x.g===6||enL('FX','adelante_extra',x.n),
  leap180:x=>enL('FX','leap180',x.n),
  giro:x=>x.g===2&&!enL('FX','giro_excluir',x.n),
  ext:x=>!!(x.vr&&x.vr.ext),
};
// Cadenas: filas unidas por "conectado" (en piso pueden incluir conexiones indirectas).
function cadenasDe(items){const ch=[];let cur=[];items.forEach((x,j)=>{cur.push(x);if(!x.r.c||j===items.length-1){ch.push(cur);cur=[];}});return ch;}
const parDistinto=(A,B)=>{for(const a of A){const b=B.find(y=>y!==a);if(b)return[a,b];}return null;};

/* ---- CV por cadena: mejor reparto en pares y series de 3 sin solapar [G-07, BB-CV, FX-CV, UB-9/10-CV] ---- */
function cvL(L,x){return L===9?x.vl:x.l;}
function cvParUB(L,A,B){const la=cvL(L,A),lb=cvL(L,B);if(!lge(la,'C')||!lge(lb,'C'))return 0;
  const ft=x=>U.vuelo(x)||U.giro(x);
  if(L===9)return ft(A)&&ft(B)?.2:(A.n!==B.n?.1:0);
  if(enL('UB','cv10_sueltas',A.n)&&enL('UB','cv10_hs',B.n))return .2;
  const lo=lmin(la,lb),hi=lmax(la,lb);
  if(lge(lo,'D'))return .2;if(lge(hi,'D'))return .1;
  return (ft(A)&&ft(B))||(U.c367(A)&&U.c367(B)&&A.n!==B.n)?.1:0;}
function cvParBB(L,A,B){if(A.dmt||B.dmt)return 0;const la=cvL(L,A),lb=cvL(L,B);if(!la||!lb)return 0;const lo=lmin(la,lb),hi=lmax(la,lb);
  const fa=BV.acro(A)&&(BV.vuelo(A)||BV.vueloEnt(A)),fb=BV.acro(B)&&(BV.vuelo(B)||BV.vueloEnt(B)),da=BV.danza(A),db=BV.danza(B);let v=0;
  if(fa&&fb){if(lge(lo,'C')||(lge(lo,'B')&&lge(hi,'D')))v=.2;
    else if(lo==='B'&&hi==='C'){const c=la==='C'?A:B;if(BV.mortal(c)||BV.aereo(c))v=.1;}}
  else if((da||fa)&&(db||fb)){if(lge(lo,'C')||(lge(lo,'B')&&lge(hi,'D')))v=.2;else if((lge(lo,'B')&&lge(hi,'C'))||lge(hi,'D'))v=.1;}
  if(A.g===3&&B.g===3&&da&&db&&lge(hi,'C'))v=Math.max(v,.1);
  return v;}
function cv3BB(L,A,B,C){const t=[A,B,C];if(!t.every(x=>BV.acro(x)&&(BV.vuelo(x)||BV.vueloEnt(x))||(x.dmt&&BV.salida(x))))return{v:0,x:0};
  const ls=t.map(x=>cvL(L,x)).sort((p,q)=>LORD.indexOf(p)-LORD.indexOf(q));let v=0;
  if(lge(ls[0],'B')){if(lge(ls[2],'D')||lge(ls[1],'C'))v=.2;else if(lge(ls[2],'C'))v=.1;}
  const x=!t.some(y=>y.dmt)&&t.some(y=>((BV.mortal(y)||BV.aereo(y))&&lge(cvL(L,y),'C'))||lge(y.l,'D'))?.1:0;
  return{v,x};}
function cvParFX(L,A,B,link){const la=cvL(L,A),lb=cvL(L,B);if(!la||!lb||!link)return 0;const lo=lmin(la,lb),hi=lmax(la,lb);
  const sa=FV.salto(A),sb=FV.salto(B),ja=A.g===1,jb=B.g===1;
  if(sa&&sb){if(link==='d'){if((lge(lo,'B')&&lge(hi,'C'))||lge(hi,'D'))return .2;if(lge(lo,'B')||lge(hi,'C'))return .1;return 0;}
    if(lge(lo,'C')||(lge(lo,'B')&&lge(hi,'D'))||lge(hi,'E'))return .2;if((lge(lo,'B')&&lge(hi,'C'))||lge(hi,'D'))return .1;return 0;}
  if(link!=='d')return 0;
  if(ja&&jb){if(lge(lo,'C')&&lge(hi,'D'))return .2;if(lge(lo,'C')||(lge(lo,'B')&&lge(hi,'D')))return .1;return 0;}
  if(sa&&jb&&lge(la,'D'))return .1;
  return 0;}
function cv3FX(L,A,B,C,l1,l2){if(!l1||!l2||![A,B,C].every(FV.salto))return 0;
  const ls=[A,B,C].map(x=>cvL(L,x)).sort((p,q)=>LORD.indexOf(p)-LORD.indexOf(q));
  return lge(ls[2],'D')?.2:lge(ls[2],'C')?.1:0;}
// Programación dinámica sobre los nodos de una cadena. links[k] = tipo de unión entre nodes[k-1] y nodes[k] ('d','i' o null).
function mejorReparto(nodes,links,v2,v3){const n=nodes.length,best=[0],ch=[null];
  for(let k=1;k<=n;k++){let b=best[k-1],c=null;
    if(k>=2&&links[k-1]){const v=v2(nodes[k-2],nodes[k-1],links[k-1]);if(v>0&&best[k-2]+v>b+1e-9){b=best[k-2]+v;c={len:2,v};}}
    if(k>=3&&v3&&links[k-1]&&links[k-2]){const t=v3(nodes[k-3],nodes[k-2],nodes[k-1],links[k-2],links[k-1]);const tv=t.v+(t.x||0);
      if(tv>0&&best[k-3]+tv>b+1e-9){b=best[k-3]+tv;c={len:3,v:t.v,x:t.x||0};}}
    best[k]=b;ch[k]=c;}
  const segs=[];let k=n;while(k>0){const c=ch[k];if(!c){k--;continue;}segs.push({...c,nodes:nodes.slice(k-c.len,k)});k-=c.len;}
  return segs.reverse();}
function cvUSAG(L,ap,items,notes){
  const ok=x=>x.cred&&!x.noBon, lk={}, lbl={}, pot={};let total=0;
  for(const ch of cadenasDe(items)){if(ch.length<2)continue;
    let nodes=[],links=[];
    if(ap==='PISO'){let prev=null,between=[];
      for(const x of ch){const isN=FV.salto(x)||x.g===1;
        if(!isN){between.push(x);continue;}
        if(!ok(x)){prev=null;between=[];continue;}
        let link=null;
        if(prev){const pr=items[x.i-1];
          if(!between.length)link=pr.r.ind?'i':'d';
          else if(between.every(b=>FV.vuelo(b)&&!FV.danza(b)&&ok(b)))link='i';
          if((x.g===1||prev.g===1)&&(link!=='d'||between.length))link=null;}   // con saltos de danza solo cuenta la conexión directa
        nodes.push(x);links.push(link);prev=x;between=[];}}
    else ch.forEach((x,k)=>{nodes.push(x);links.push(k>0&&ok(x)&&ok(ch[k-1])?'d':null);});
    const v2=(A,B,l)=>ap==='BARRAS'?cvParUB(L,A,B):ap==='VIGA'?cvParBB(L,A,B):cvParFX(L,A,B,l);
    const v3=ap==='VIGA'?(A,B,C)=>cv3BB(L,A,B,C):ap==='PISO'?(A,B,C,l1,l2)=>({v:cv3FX(L,A,B,C,l1,l2)}):null;
    for(const s of mejorReparto(nodes,links,v2,v3)){const last=s.nodes[s.nodes.length-1],li=last.i-1,tv=r2(s.v+(s.x||0));
      lk[li]=(lk[li]||0)+tv;total+=tv;
      if(s.len===3){const t=`serie de 3 +${f1(tv)}${s.x?' (incluye +0.1 serie extra)':''}`;lbl[li]=t;lbl[s.nodes[1].i-1]=lbl[s.nodes[1].i-1]||t;
        notes.push(`Serie ${s.nodes.map(x=>'#'+(x.i+1)).join('+')}: CV de 3 elementos +${f2(s.v)}${s.x?' y serie extra +0.10':''} (por confirmar: se toma lo mayor entre la serie de 3 y la suma de pares).`);}
      else if(s.nodes[0].i!==li){lbl[li]=`CV ${'#'+(s.nodes[0].i+1)}–${'#'+(last.i+1)} +${f1(tv)}${ap==='PISO'&&links[nodes.indexOf(last)]==='i'?' (indirecta)':''}`;}}}
  // Valor manual del juez en una conexión: reemplaza el automático.
  items.forEach((x,j)=>{if(x.r.c&&items[j+1]&&x.r.cvm!=null&&x.r.cvm!==''){total+=(+x.r.cvm)-(lk[j]||0);lk[j]=+x.r.cvm;lbl[j]=null;}});
  // Posibles conexiones (sugerencia en las filas no conectadas)
  items.forEach((x,j)=>{const y=items[j+1];if(!y)return;if(x.r.c){pot[j]=lk[j]||0;return;}
    if(!ok(x)||!ok(y))return;pot[j]=ap==='BARRAS'?cvParUB(L,x,y):ap==='VIGA'?cvParBB(L,x,y):cvParFX(L,x,y,'d');});
  // Avisos por conexiones que no dan valor por caída/ayuda/sin VP
  items.forEach((x,j)=>{const y=items[j+1];if(!y||!x.r.c||(x.r.cvm!=null&&x.r.cvm!==''))return;
    if((x.cred&&y.cred)&&(x.noBon||y.noBon))notes.push(`Conexión ${j+1}-${j+2}: con caída, ayuda o incompleto no da CV.`);});
  return{cv:r2(total),lk,lbl,pot};}

/* ---- Requisitos especiales [G-05 y SR por aparato] ---- */
function srUSAG(L,ap,items){
  const C=items.filter(x=>x.cred),out=[];
  const add=(id,t,hit,extra)=>{if(Array.isArray(hit)&&!hit.filter(Boolean).length)hit=null;out.push({id,t,auto:!!hit,src:hit?(Array.isArray(hit)?hit:[hit]).filter(Boolean).map(x=>x.i):[],...(extra||{})});};
  const pares=[];items.forEach((x,j)=>{const y=items[j+1];if(x.r.c&&y&&x.cred&&y.cred)pares.push([x,y]);});
  const d=[...items].reverse().find(x=>x.dmt)||null;
  if(ap==='BARRAS'){const castX=C.find(U.cast),sMin=L===9?'B':L===10?'C':'A';
    if(L===6){add('s1','Un cast a 45° o más sobre la horizontal (confirma el ángulo)',castX);
      add('s2','Mínimo un cambio de barra (detección por lista; confírmalo)',C.find(U.cambio));
      add('s3','Un círculo libre de 360° de los grupos 3/6/7 (sin cadera en la barra)',C.find(U.c367));}
    else if(L===7){add('s1','Un cast a parada de manos (cumple desde 45°; confirma el ángulo)',castX);
      const cs=C.filter(U.circ),a1=cs.filter(x=>lge(x.vl,'B')),b1=cs.filter(U.c367),par=parDistinto(a1,b1);
      add('s2a','Dos círculos libres de 360° — a) uno mínimo B',par?par[0]:a1[0],{doble:1});
      add('s2b','Dos círculos libres de 360° — b) otro de los grupos 3/6/7',par?par[1]:(a1.length?null:b1[0]),{doble:1});}
    else if(L===8){add('s1','Un cast a parada de manos (a menos de 20° de la vertical; confírmalo)',castX);
      const a1=C.filter(x=>!x.dmt&&lge(x.vl,'B')&&(U.vuelo(x)||(x.g!==1&&U.giro(x)))),b1=C.filter(x=>!x.dmt&&lge(x.vl,'B')&&U.c367(x)),par=parDistinto(a1,b1);
      add('s2a','Dos B — a) un B con vuelo (no salida) o con giro de 180° o más en el eje longitudinal (no entrada ni salida)',par?par[0]:a1[0],{doble:1});
      add('s2b','Dos B — b) un B círculo libre de 360° de los grupos 3/6/7 (no salida)',par?par[1]:(a1.length?null:b1[0]),{doble:1});}
    else if(L===9){const cb=C.filter(U.cambio);add('s1','Mínimo dos cambios de barra (detección por lista; confírmalo)',cb.length>=2?cb.slice(0,2):null);
      const f=C.filter(x=>!x.dmt&&U.vuelo(x)),fB=f.filter(x=>lge(x.vl,'B')),fC=f.filter(x=>lge(x.vl,'C'));
      const gB=C.filter(x=>x.g!==1&&!x.dmt&&U.giro(x)&&lge(x.vl,'B'));let s2=fB[0]||null,s3=null;
      for(const p of fB){const q=fC.find(y=>y.n!==p.n);if(q){s2=p;s3=q;break;}}
      if(!s3&&gB.length)s3=gB.find(g=>g!==s2)||gB[0];
      add('s2','Un elemento con vuelo mínimo B (no salida)',s2);
      add('s3','Segundo vuelo distinto mínimo C (no salida) o un giro de 180° o más en el eje longitudinal mínimo B (no entrada ni salida)',s3);}
    else{const f=C.filter(x=>!x.dmt&&U.vuelo(x)),fC=f.filter(x=>lge(x.vl,'C')),fB=f.filter(x=>lge(x.vl,'B'));let s1=fC[0]||null,s2=null;
      for(const p of fC){const q=fB.find(y=>y.n!==p.n);if(q){s1=p;s2=q;break;}}if(!s1)s2=fB[0]||null;
      add('s1','Vuelo mínimo C (no salida)',s1);add('s2','Segundo vuelo distinto mínimo B (no salida)',s2);
      add('s3','Elemento con giro en el eje longitudinal mínimo C (no entrada ni salida)',C.find(x=>x.g!==1&&!x.dmt&&U.giro(x)&&lge(x.vl,'C')));}
    add('s4',`Salida en mortal mínimo ${sMin} (hecht o subbalanceo sin mortal no cuentan)`,d&&d.cred&&U.salidaMortal(d)&&lge(d.vl,sMin)?d:null);}
  else if(ap==='VIGA'){const sinED=([x,y])=>x.g!==1&&y.g!==1&&!x.dmt&&!y.dmt,P=pares.filter(sinED),vu=BV.vuelo,ac=BV.acro;
    const vueloSuelto=C.find(x=>ac(x)&&vu(x)&&x.g!==1&&!x.dmt);let s1;
    if(L===6)s1=P.find(([x,y])=>ac(x)&&ac(y)&&(BV.hs(x)||BV.hs(y)))||vueloSuelto;
    else if(L===7){const ser=P.find(([x,y])=>ac(x)&&ac(y)&&(BV.hs(x)||BV.hs(y)||vu(x)||vu(y)));s1=ser&&vueloSuelto?[...ser,vueloSuelto]:null;}
    else if(L===8)s1=P.find(([x,y])=>ac(x)&&ac(y)&&(vu(x)||vu(y)));
    else if(L===9)s1=P.find(([x,y])=>vu(x)&&vu(y));
    else s1=P.find(([x,y])=>vu(x)&&vu(y)&&(lge(x.l,'C')||lge(y.l,'C')))||P.find(([x,y])=>x.g===7&&x.l==='A'&&!vu(x)&&vu(y)&&y.l==='E');
    const t1={6:'Serie acro sin vuelo (una pasa por parada de manos) o un elemento acro con vuelo (sin entrada ni salida)',
      7:'Serie acro (con o sin vuelo) y un elemento acro con vuelo (sin entrada ni salida)',8:'Serie acro de 2 elementos, uno con vuelo (sin entrada ni salida)',
      9:'Serie acro con 2 elementos con vuelo directos (sin entrada ni salida)',10:'Serie acro con 2 vuelos directos, uno mínimo C, o un acro A sin vuelo (grupo 7) conectado a un vuelo E (sin entrada ni salida)'}[L];
    add('s1',t1,s1);
    add('s2','Un salto o leap con 180° de split cruzado o lateral (confirma 135° o más)',C.find(BV.salto180));
    add('s3','Giro de 360° o más en un pie (grupo 3)',C.find(BV.giro360));
    const min=L===9?'B':L===10?'C':'A',dm=d&&d.cred&&BV.salida(d)?d:null;let s4=null;
    if(dm&&lge(dm.vl,min))s4=dm;
    else if(L===10&&dm&&dm.l==='B'){const p=items[dm.i-1];
      if(p&&p.r.c&&p.cred){if(lge(p.l,'C')&&(vu(p)||BV.danza(p)))s4=[p,dm];
        else{let k=dm.i-1;const ser=[];while(k>=0){ser.push(items[k]);if(k===0||!items[k-1].r.c)break;k--;}
          if(ser.length>=2&&ser.every(x=>x.cred&&ac(x))&&ser.some(x=>lge(x.l,'C')))s4=[...ser.reverse(),dm];}}}
    add('s4',L===10?'Salida aérea o en mortal mínimo C, o B conectada a una serie acro con un C o a un vuelo/danza mínimo C':`Salida aérea o en mortal mínimo ${min} (paloma o rueda no cuentan)`,s4);}
  else if(ap==='PISO'){const ch=cadenasDe(items);
    // Corridas de vuelos directos (sin conexión indirecta) con algún mortal [FX-6-SR1/2, FX-7]
    const runs=[];ch.forEach((c,ci)=>{let cur=[];const fin=()=>{if(cur.length>=2&&cur.some(FV.salto))runs.push({ci,xs:cur});cur=[];};
      c.forEach((x,k)=>{const ok=x.cred&&FV.vuelo(x);if(!ok){fin();return;}if(cur.length&&(c[k-1].r.ind))fin();cur.push(x);});fin();});
    const nums=r=>new Set(r.xs.filter(FV.salto).map(x=>x.n));
    const pases=[];ch.forEach(c=>{let cur=[];c.forEach(x=>{if(FV.danza(x)){if(cur.length)pases.push(cur);cur=[];}else cur.push(x);});if(cur.length)pases.push(cur);});
    const dance=items.map((x,j)=>[x,items[j+1]]).filter(([x,y])=>y&&x.r.c&&x.cred&&y.cred&&x.g===1&&y.g===1&&x.n!==y.n&&(FV.leap180(x)||FV.leap180(y)));
    const tD='Pasaje de danza: 2 elementos distintos del grupo 1 conectados, uno leap con 180° cruzado o lateral (confirma la apertura)';
    if(L===6){const r1=runs[0]||null;let r2=null;
      for(const a of runs){for(const b of runs){if(a===b||a.ci===b.ci)continue;const na=nums(a);if([...nums(b)].some(n=>!na.has(n))){r2=[a,b];break;}}if(r2)break;}
      const iso=C.find(x=>FV.salto(x)&&lge(x.vl,'B')&&!x.r.c&&!(items[x.i-1]&&items[x.i-1].r.c));
      add('s1','Un pase acro con 2 vuelos directos o más, uno mortal',r2?r2[0].xs:r1&&r1.xs);
      add('s2','Segundo pase con un mortal distinto y 2 vuelos directos (uno mortal), o un mortal B aislado',r2?r2[1].xs:(r1?iso:(runs[0]?null:iso)));}
    else if(L===7){const atr=runs.find(r=>r.xs.some(x=>FV.salto(x)&&FV.atras(x)));
      add('s1a','Pase con mortal atrás y 2 vuelos directos o más',atr&&atr.xs,{grp:'fx7'});
      add('s1b','Pase con mortal adelante (se permiten otros elementos)',C.find(x=>FV.salto(x)&&FV.adelante(x)),{grp:'fx7'});
      add('s1c','Un mortal adelante o atrás extendido, sin giro, con llegada a 2 pies (elige la variante en el elemento)',C.find(x=>FV.salto(x)&&FV.ext(x)),{grp:'fx7'});}
    else{add('s1','Pase acro con 2 mortales o más (directos o indirectos)',(pases.find(p=>p.filter(x=>x.cred&&FV.salto(x)).length>=2)||[]).filter(x=>x.cred&&FV.salto(x)).slice(0,2));
      const dist=[...new Map(C.filter(FV.salto).map(x=>[x.n,x])).values()];add('s2','Tres mortales distintos (no aéreos)',dist.length>=3?dist.slice(0,3):null);}
    add('s3',tD,dance[0]||null);
    if(L<=7)add('s4','Giro de 360° o más en un pie',C.find(FV.giro));
    else{const min=L===8?'A':L===9?'B':'C';
      const ps=pases.filter(p=>p.some(x=>FV.salto(x)||(FV.vuelo(x)&&!FV.aereo(x))));const u=ps[ps.length-1];let hit=null;
      if(u){const s=u.filter(x=>x.cred&&FV.salto(x)).sort((p,q)=>LORD.indexOf(q.vl)-LORD.indexOf(p.vl))[0];if(s&&lge(s.vl,min))hit=s;}
      add('s4',`El último pase acro iniciado tiene un mortal mínimo ${min}`,hit);}}
  return out;}

/* ---- Crédito de composición [G-14, UB/BB/FX-CC] ---- */
function ccUSAG(L,ap,items){
  const C=items.filter(x=>x.cred),out=[],add=(id,t,v,hit,grp)=>{if(Array.isArray(hit)&&!hit.filter(Boolean).length)hit=null;out.push({id,t,v,auto:!!hit,grp:grp||id,src:hit?(Array.isArray(hit)?hit:[hit]).filter(Boolean).map(x=>x.i):[]});};
  const d=[...items].reverse().find(x=>x.dmt)||null,dc=d&&d.cred?d:null,p=dc&&items[dc.i-1]&&items[dc.i-1].r.c?items[dc.i-1]:null;
  const dist=(xs)=>[...new Map(xs.map(x=>[x.n,x])).values()];
  if(ap==='BARRAS'){
    if(L===8){add('d','Conexión directa B+B (el cast a parada 2.201 no cuenta)',.1,items.map((x,j)=>[x,items[j+1]]).find(([x,y])=>y&&x.r.c&&x.cred&&y.cred&&lge(x.vl,'B')&&lge(y.vl,'B')&&x.n!=='2.201'&&y.n!=='2.201'));
      add('s','Salida B o más, o un B o más conectado a una salida A',.1,dc&&(lge(dc.vl,'B')?dc:(p&&p.cred&&lge(p.vl,'B')&&dc.vl==='A'?[p,dc]:null)));}
    else if(L===9){const c=dist(C.filter(x=>lge(x.vl,'C')));add('d','2 partes de valor distintas C o más (D/E valen C)',.1,c.length>=2?c.slice(0,2):null);
      add('s','Salida C o más, o un C o más conectado a una salida B',.1,dc&&(lge(dc.vl,'C')?dc:(p&&p.cred&&lge(p.vl,'C')&&dc.vl==='B'?[p,dc]:null)));}
    else{const s=dist(C.filter(x=>!x.dmt&&U.vuelo(x)&&lge(x.l,'D')));
      add('d2','2 sueltas D/E distintas',.2,s.length>=2?s.slice(0,2):null,'d');add('d1','Una suelta D/E',.1,s[0]||null,'d');
      add('s','Salida D o más, o un D/E conectado a una salida C',.1,dc&&(lge(dc.l,'D')?dc:(p&&p.cred&&lge(p.l,'D')&&dc.l==='C'?[p,dc]:null)));}}
  else if(ap==='VIGA'){const ac=BV.acro,vu=BV.vuelo;
    // El elemento previo puede no tener VP por 3.ª repetición (TXQRG).
    const pOK=p&&(p.cred||(p.rep&&!p.rest&&!p.inc&&p.r.spot!=='E'));
    if(L===8){add('d','Serie acro directa B+B, los dos con vuelo',.1,items.map((x,j)=>[x,items[j+1]]).find(([x,y])=>y&&x.r.c&&x.cred&&y.cred&&vu(x)&&vu(y)&&lge(x.vl,'B')&&lge(y.vl,'B')));
      add('s','Salida B o más, o un acro B conectado a una salida en mortal A',.1,dc&&(lge(dc.vl,'B')?dc:(pOK&&ac(p)&&lge(p.vl,'B')&&BV.mortal(dc)&&dc.vl==='A'?[p,dc]:null)));}
    else if(L===9){const c=dist(C.filter(x=>ac(x)&&!x.dmt&&lge(x.vl,'C')));add('d','2 acro distintos C o más, sin salida (EYMAN pide acro con vuelo: confírmalo)',.1,c.length>=2?c.slice(0,2):null);
      add('s','Salida C o más, o un vuelo acro B o danza C conectado a una salida B',.1,dc&&(lge(dc.vl,'C')?dc:(pOK&&((vu(p)&&lge(p.vl,'B'))||(BV.danza(p)&&lge(p.vl,'C')))&&dc.vl==='B'?[p,dc]:null)));}
    else{const c=dist(C.filter(x=>ac(x)&&!x.dmt&&lge(x.l,'D')));
      add('d2','2 acro D/E distintos, sin salida',.2,c.length>=2?c.slice(0,2):null,'d');add('d1','Un acro D/E, sin salida',.1,c[0]||null,'d');
      add('s','Salida D/E, o un vuelo acro B o danza C conectado a una salida C',.1,dc&&(lge(dc.l,'D')?dc:(pOK&&((vu(p)&&lge(p.l,'B'))||(BV.danza(p)&&lge(p.l,'C')))&&dc.l==='C'?[p,dc]:null)));}}
  else if(ap==='PISO'){const S=dist(C.filter(FV.salto)),Dz=dist(C.filter(FV.danza)),lt=L===10?(x=>x.l):(x=>x.vl);
    const tres=(m2,m3)=>{const a=S.filter(x=>lge(lt(x),m2));if(a.length<2)return null;const b=S.find(x=>x!==a[0]&&x!==a[1]&&lge(lt(x),m3));return b?[a[0],a[1],b]:null;};
    if(L===8){add('a','2 mortales distintos B o más y un tercer mortal',.1,tres('B','A'));
      const z=Dz.filter(x=>lge(x.vl,'B'));add('z','2 partes de valor de danza distintas B o más',.1,z.length>=2?z.slice(0,2):null);}
    else if(L===9){add('a','2 mortales distintos C o más y un mortal B',.1,tres('C','B'));
      const z=Dz.filter(x=>lge(x.vl,'C'));add('z','2 partes de valor de danza distintas C o más',.1,z.length>=2?z.slice(0,2):null);}
    else{const E=S.filter(x=>x.l==='E'),Dd=S.filter(x=>lge(x.l,'D'));
      const eMas=m=>{for(const e of E){const o=S.find(x=>x!==e&&lge(x.l,m));if(o)return[e,o];}return null;};
      add('a2','Acro: 2 mortales D o más distintos y un mortal C, o un mortal E y un D',.2,tres('D','C')||eMas('D'),'a');
      add('a1','Acro: 2 mortales D distintos, o un E y un C',.1,(Dd.length>=2?Dd.slice(0,2):null)||eMas('C'),'a');
      const zC=Dz.filter(x=>lge(x.l,'C')),zD=Dz.find(x=>lge(x.l,'D')),zo=zD&&zC.find(x=>x!==zD);
      add('z','Danza: 3 partes de valor de danza C distintas, o una D y otra C o más',.1,zC.length>=3?zC.slice(0,3):(zo?[zD,zo]:null));}}
  return out;}

/* ---- Avisos de composición y tiempo (no cambian la NP) [UB-9/10-COMP, BB-COMP, FX-COMP, G-15] ---- */
function composicionUSAG(L,ap,items,a,enotes){
  const C=items.filter(x=>x.cred);
  if(ap==='BARRAS'&&L>=9){const opc=[x=>!x.dmt&&x.g!==1&&U.adelante(x)&&lge(x.vl,'B'),x=>!x.dmt&&[3,6,7].includes(x.g)&&lge(x.vl,'B'),x=>!x.dmt&&x.g!==1&&U.giro(x)&&lge(x.vl,'C'),x=>!x.dmt&&U.unaBarra(x)&&lge(x.l,'D')];
    let best=0;const asig=(k,used,c)=>{if(k===4){best=Math.max(best,c);return;}asig(k+1,used,c);const x=C.find(y=>!used.has(y)&&opc[k](y));if(x){used.add(x);asig(k+1,used,c+1);used.delete(x);}};asig(0,new Set(),0);
    if(best<2)enotes.push(`Composición "2 de 4" (adelante B, grupos 3/6/7 B, giro LA C, suelta de una barra D): cumple ${best} de 4 → posible −${best===1?'0.10':'0.20'}.`);
    if(L===10&&C.filter(U.cambio).length<2)enotes.push('N10: menos de 2 cambios de barra detectados → posible −0.20 de composición.');
    if(L===10&&items.filter(x=>x.n==='2.102').length>1)enotes.push('N10: más de un cast a squat/stoop en BI para saltar a BS → −0.10 c/u (el primero tras una caída no cuenta).');}
  if(ap==='VIGA'&&L>=8){const ac=C.filter(x=>BV.acro(x)&&x.g!==1),sin=ac.filter(x=>!x.dmt);
    const dirs=xs=>new Set(xs.flatMap(x=>[BV.atras(x)?'at':null,BV.adelante(x)||BV.lateral(x)?'ad':null].filter(Boolean)));
    const ds=dirs(sin),dt=dirs(ac);if(ac.length&&ds.size<2)enotes.push(`Acro en una sola dirección → posible −${dt.size>=2?'0.05 (la otra dirección solo está en la salida)':'0.10'} de composición.`);
    const fT=C.filter(x=>enL('BB','forma_agrupado',x.n)).length,fS=C.filter(x=>enL('BB','forma_abierto',x.n)).length;
    if(fT>2)enotes.push('Más de 2 elementos de danza agrupados/lobo → −0.10 de composición.');if(fS>2)enotes.push('Más de 2 elementos de danza abiertos (straddle) → −0.10 de composición.');
    if(!items.some((x,j)=>{const y=items[j+1];return y&&x.r.c&&BV.danza(x)&&BV.danza(y)&&[1,2,3].includes(x.g)&&[1,2,3].includes(y.g);}))enotes.push('Falta serie de danza (2 elementos de danza conectados, grupos 1D/2/3) → −0.20 de composición.');}
  if(ap==='PISO'&&L>=8){const S=C.filter(FV.salto);
    if(S.length&&!(S.some(FV.atras)&&S.some(x=>!FV.atras(x))))enotes.push('Mortales en una sola dirección (el árabe cuenta adelante) → −0.10 de composición.');
    const fT=C.filter(x=>enL('FX','forma_agrupado',x.n)).length,fS=C.filter(x=>enL('FX','forma_abierto',x.n)).length;
    if(fT>2)enotes.push('Más de 2 elementos de danza agrupados/lobo → −0.10 de composición.');if(fS>2)enotes.push('Más de 2 elementos de danza abiertos (straddle) → −0.10 de composición.');
    if(!C.some(x=>FV.giro(x)&&lge(x.vl,'B')))enotes.push('Falta un giro en un pie mínimo B → −0.20 de composición.');
    const m={8:'B',9:'C',10:'D'}[L];if(!S.some(x=>lge(x.l,m)))enotes.push(`Falta un mortal mínimo ${m} en el ejercicio → −0.20 de composición.`);}
  if(ap==='VIGA'||ap==='PISO'){const lim=L<=7?80:90,dur=+((a.p&&a.p.dur&&a.p.dur[ap])||0);
    if(dur>lim)enotes.push(`Sobretiempo (${dur} s; máximo ${Math.floor(lim/60)}:${String(lim%60).padStart(2,'0')}) → −0.10 (juez árbitro).`);}
}

/* ---- Cálculo de un aparato USAG ---- */
function computeUSAG(a,ap){
  const L=numNivel(a.nivel),R=USR[EV[ap]]?.[L]||{},G=USR.general||{},rows=a.r[ap]||[],notes=[],enotes=[];
  const items=rows.map((r,i)=>{const e=el(r.k),vs=variantesDe(e),vr=r.var?vs.find(v=>v.id===r.var)||null:null;
    return{r,i,e,k:r.k||('n:'+r.n),l:r.l||(vr&&vr.l)||(e?e.l:null)||null,vr,n:e?e.n:'',g:e?e.g:0,en:e?(e.en||''):'',tipo:e?e.tipo:null,dmt:!!(e&&e.dmt)};});
  if(items.some(x=>x.e&&x.e.sys!=='U'))notes.push('Hay elementos del Código FIG: en niveles USAG elígelos del catálogo USAG.');
  items.forEach(x=>{if(!x.l)notes.push(`#${x.i+1} sin valor: elige el elemento o ponle valor.`);
    else if(x.e&&x.e.conf==='baja')notes.push(`#${x.i+1}: descripción USAG inferida; confirma que es el elemento correcto.`);});
  // [UB-GEN-3] 2.205 y 4.204 valen C conectados directo a una suelta D/E (N9-N10; dato del código 2022-26).
  if(ap==='BARRAS'&&L>=9)items.forEach((x,j)=>{const y=items[j+1];if((x.n==='2.205'||x.n==='4.204')&&!x.r.l&&x.r.c&&y&&U.vuelo(y)&&lge(y.l,'D')){x.l='C';
    notes.push(`#${x.i+1} conectado directo a una suelta D/E: vale C (código 2022-26, por confirmar).`);}});
  // [G-10] flags del juez: inc = incompleto / no cae primero con los pies; spot E = ayuda durante, L = al aterrizar la salida.
  items.forEach(x=>{x.inc=!!x.r.inc;x.spotE=x.r.spot==='E';x.noBon=!!(x.r.caida||x.r.inc||x.r.spot);});
  // [G-07] Repetición: 2.ª vez con VP solo en conexión distinta; 3.ª vez nunca.
  const occ={};items.forEach((x,j)=>{if(!x.l||!x.e)return;const p=items[j-1],y=items[j+1];x.sig=(p&&p.r.c?p.k:'-')+'>'+(x.r.c&&y?y.k:'-');
    const o=occ[x.k]=occ[x.k]||[];o.push(x);if(o.length>=3)x.rep='3';else if(o.length===2&&o[0].sig===x.sig)x.rep='misma';});
  items.forEach(x=>{x.noCred=!x.l||!!x.rep||x.inc||x.spotE;});
  // [G-06] Permitidos y restringidos, en orden cronológico.
  let c6=false,tolK=null,tolOk=false;
  const tolerar=x=>{if(tolK==null||(tolK===x.k&&!tolOk)){tolK=x.k;x.tol=true;if(!x.noCred)tolOk=true;return true;}return false;};
  const ub=ap==='BARRAS';
  for(const x of items){x.rest=false;x.tol=false;x.perm=false;x.vl=null;const l=x.l;if(!l||!LORD.includes(l))continue;const v=x.vr||{},dz=x.tipo==='danza',na=x.tipo==='na';
    if(L===10){x.vl=lge(l,'D')?'C':l;continue;}
    if(L===9){if(!lge(l,'D')){x.vl=l;continue;}
      if(ub){if(enL('UB','perm_L9',x.n)&&v.perm9!==false){x.vl='C';x.perm=true;}else if(tolerar(x))x.vl='C';else{x.rest=true;x.why='D/E fuera de la lista y no es el primero';}}
      else if(dz||na){x.vl='C';x.perm=true;}
      else if(tolerar(x))x.vl='C';else{x.rest=true;x.why='D/E acrobático adicional';}
      continue;}
    if(l==='A'||l==='B'){
      if(ub&&L===6&&x.g!==1&&U.entreBarras(x)){x.rest=true;x.why='vuelo o suelta entre barras';}
      else if(ub&&L===6&&x.g!==1&&U.unaBarra(x)){x.rest=true;x.why='suelta en la misma barra; por confirmar';}
      else x.vl=l;continue;}
    if(na&&l==='C'){x.vl='B';continue;}
    if(l==='C'){
      if(ub){const p6=enL('UB','perm_L6',x.n)&&v.perm6!==false,p78=(enL('UB','perm_L78',x.n)&&v.perm78!==false)||v.perm78===true;
        if(L===6){if(p6&&!c6){c6=true;x.vl='B';x.perm=true;}else{x.rest=true;x.why=p6?'en N6 solo se permite un C de la lista':'C fuera de la lista de N6';}}
        else if(p78){x.vl='B';x.perm=true;}
        else if(L===8&&tolerar(x))x.vl='B';
        else{x.rest=true;x.why=L===8?'C fuera de la lista y no es el primero':'C fuera de la lista de N7';}}
      else if(dz){if(L===6){if(!c6){c6=true;x.vl='B';x.perm=true;}else{x.rest=true;x.why='en N6 solo se permite un C de danza';}}else{x.vl='B';x.perm=true;}}
      else if(L===8&&tolerar(x))x.vl='B';
      else{x.rest=true;x.why=L===8?'C acrobático adicional':'C acrobático';}
      continue;}
    x.rest=true;x.why='D/E';}
  items.forEach(x=>{x.cred=!!x.vl&&!x.rest&&!x.noCred;});
  items.forEach(x=>{const h=`#${x.i+1}`;
    if(x.rest)notes.push(`${h} (${x.l}) restringido en N${L} (${x.why}): −0.50 y no da VP, SR, CC ni CV.`);
    if(x.tol)notes.push(`${h} (${x.l}) es el ${L===8?'C':'D/E'} restringido que se tolera en N${L}: vale ${x.vl}${x.noCred?' (sin VP: puede repetirse)':''}; otro restringido resta 0.50.`);
    if(x.rep==='3')notes.push(`${h} es la 3.ª vez del mismo elemento: no da VP, SR ni CV.`);
    if(x.rep==='misma')notes.push(`${h} repite el elemento en la misma conexión que la 1.ª vez: no da VP, SR ni CV (la 2.ª vez cuenta solo aislada o con otro elemento).`);
    if(x.inc&&x.l)notes.push(`${h} incompleto o no cae primero con los pies: sin VP, SR, CC ni bono.`);
    if(x.spotE&&x.l)notes.push(`${h} con ayuda durante el elemento: sin VP, SR, CC ni bono (−0.50 de ejecución).`);
    if(x.r.spot==='L'&&x.l)notes.push(`${h} con ayuda al aterrizar: conserva VP, SR y CC; sin bono (−0.50 de ejecución).`);
    if(x.r.caida&&x.cred&&L>=9)notes.push(`${h} con caída: conserva VP, SR y CC, pero no da bono (CV ni DV).`);});
  // [G-02, G-04] Partes de valor: las de mayor valor sustituyen a las menores (1 a 1).
  const req={...(G.vp_requeridos?.[L]||{})};delete req.fuente;
  const pool=items.filter(x=>x.cred).sort((p,q)=>q.vl.localeCompare(p.vl)),falt={A:0,B:0,C:0};
  for(const need of['C','B','A']){for(let k=0;k<(req[need]||0);k++){const j=pool.findIndex(x=>x.vl>=need);if(j<0){falt[need]++;continue;}pool.splice(j,1);}}
  const counted=new Set(items.filter(x=>x.cred).map(x=>x.i));
  const vpDed=r2(falt.A*VP.A+falt.B*VP.B+falt.C*VP.C), restDed=r2(items.filter(x=>x.rest).length*.5);
  // [G-05] Requisitos especiales: detección automática; el juez puede marcar o desmarcar (a.sr[ap][id]).
  const man=(a.sr&&a.sr[ap])||{};
  const srDet=srUSAG(L,ap,items).map(s=>{const m=typeof man[s.id]==='boolean'?man[s.id]:null;return{...s,m,hit:m===true||(m!==false&&s.auto)};});
  let srU=0;const grp={};srDet.forEach(s=>{if(s.hit)return;if(s.grp)grp[s.grp]=(grp[s.grp]||0)+1;else srU++;});for(const g in grp)srU+=Math.min(grp[g],2);
  const srDed=r2(srU*.5);
  if(srDet.some(s=>s.doble))notes.push('El SR doble (2/3) se cuenta como 2 requisitos de 0.50: falta 0.50 por cada parte que no se cumpla (por confirmar con el código 2026-30).');
  if(srDet.some(s=>s.grp==='fx7'))notes.push('N7 piso, SR 1/2 (2 requisitos): −0.50 por cada condición que falte, máximo −1.00 (reparto por confirmar con el código 2026-30).');
  // [G-14] Crédito de composición
  const ccMax=G.cc_max?.[L]||0,ccm=(a.cc&&a.cc[ap])||{};
  const ccDet=ccMax?ccUSAG(L,ap,items).map(c=>{const m=typeof ccm[c.id]==='boolean'?ccm[c.id]:null;return{...c,m,hit:m===true||(m!==false&&c.auto)};}):[];
  const ccG={};ccDet.forEach(c=>{if(c.hit)ccG[c.grp]=Math.max(ccG[c.grp]||0,c.v);});
  const cc=r2(Math.min(ccMax,Object.values(ccG).reduce((s,v)=>s+v,0)));
  // [G-11, G-12] Bono N9-N10: CV + DV.
  let cv=0,cvRaw=0,dvb=0,bon=0,pot={},lbl={};
  if(L>=9){const c=cvUSAG(L,ap,items,notes);cvRaw=c.cv;pot=c.pot;lbl=c.lbl;cv=cvRaw;
    if(ap==='BARRAS'&&L===10&&cv>.4){cv=.4;notes.push('Barras N10: el CV máximo es 0.40 dentro del bono.');}
    if(L===9){const f=items.find(x=>x.cred&&lge(x.l,'D')&&(ub||x.tipo==='acro'));
      if(f){if(f.noBon)notes.push(`#${f.i+1} es el primer D/E pero tiene caída o ayuda: no da DV.`);else{f.dvb=.1;dvb=.1;}}}
    else{const vistos=new Set();items.forEach(x=>{if(!x.cred||!lge(x.l,'D')||x.noBon||vistos.has(x.k))return;vistos.add(x.k);x.dvb=x.l==='D'?.1:.2;dvb+=x.dvb;});
      dvb=r2(dvb);if(items.some(x=>x.dvb&&x.l==='E'))notes.push('DV de N10: E = +0.20 (valor del código 2022-26; confírmalo en el 2026-30). El mismo D/E repetido da DV una sola vez.');
      if(!ub&&items.some(x=>x.dvb&&x.tipo==='danza'))notes.push('DV de N10 también para D/E de danza (por confirmar con el código 2026-30).');}
    cv=r2(cv);dvb=r2(dvb);
    if(L===9)bon=r2(Math.min(.3,cv+Math.min(dvb,.1)));
    else{let c2=cv,d2=dvb;if(d2===0)c2=Math.min(c2,.4);if(c2===0)d2=Math.min(d2,.4);bon=r2(Math.min(.5,c2+d2));}}
  const base=G.sv_base?.[L]??10;
  const sv=items.length?r2(Math.min(10,base-vpDed-srDed-restDed+cc+bon)):0;
  // [G-13] +0.10 extra N10 (fuera de la NP)
  let extra=0;
  if(L===10&&items.length){const tb=r2(cvRaw+dvb);let el10=null;
    if(ap==='BARRAS')el10=items.find(x=>x.cred&&!x.dmt&&U.vuelo(x)&&((U.unaBarra(x)&&[2,3,4,5,6,7].includes(x.g)&&lge(x.l,'D'))||x.l==='E'));
    else if(ap==='VIGA')el10=items.find(x=>x.cred&&BV.acro(x)&&x.l==='E');
    else el10=items.find(x=>x.cred&&!FV.danza(x)&&x.l==='E'&&x.n!=='6.501');
    const okSV=sv>=10&&!vpDed&&!srDed&&!restDed&&cc>=ccMax;
    if(okSV&&tb>=.6&&cvRaw>0&&el10){extra=.1;notes.push(`+0.10 extra de N10 (fuera de la NP): CC completo, bono total ${f2(tb)} y elemento #${el10.i+1}.`);}
    else if(sv>=9.9){const f=[];if(!okSV)f.push('NP 10.00 con todos los VP, SR y CC 0.30');if(tb<.6||cvRaw<=0)f.push(`bono total (CV+DV sin tope) 0.60 o más con CV (hoy ${f2(tb)})`);
      if(!el10)f.push(ap==='BARRAS'?'una suelta D de una barra o una suelta E':ap==='VIGA'?'un acro E':'un acro E (6.501 no cuenta)');
      notes.push('Sin +0.10 extra de N10: falta '+f.join('; ')+'.');}}
  // [G-08] Ejercicio corto (juez árbitro, aparte de la NP)
  let nd=0;
  if(ub&&items.length&&items.filter(x=>x.cred).length<5){nd=2;notes.push('Barras con menos de 5 partes de valor: −2.00 (ejercicio corto, juez árbitro).');}
  const dur=+((a.p&&a.p.dur&&a.p.dur[ap])||0);
  if(!ub&&items.length&&dur>0&&dur<30){if(L===6&&ap==='VIGA'&&sv>=10&&!vpDed){nd=.5;notes.push('N6 viga completa de menos de 30 s con todos los VP y NP 10.00: −0.50 (juez árbitro).');}
    else{nd=2;notes.push('Ejercicio de menos de 30 s: −2.00 (juez árbitro).');}}
  composicionUSAG(L,ap,items,a,enotes);
  return{tipo:'USAG',np:sv,base,vpDed,falt,req,srDet,srDed,restDed,cc,ccMax,ccDet,cv,cvRaw,dvb,bon,extra,nd,counted,pot,lbl,notes,enotes,items};
}
/* ---- Salto [VT-01…VT-06] ---- */
function computeSaltoUSAG(a){
  const L=numNivel(a.nivel),rows=a.r.SALTO||[],notes=[],enotes=[];
  const exc=new Set(['2.302','2.311','3.407','4.306','4.309','4.403','4.407','5.301','5.408','5.409']);
  let eventoVoid=null;
  const vaults=rows.slice(0,2).map((r,i)=>{const n=r.k&&r.k.startsWith('V|')?r.k.slice(2):null,x=n&&usSalto(a.nivel,n);
    let v=x?x.valor:0,motivo='';const sp=r.spot||'';
    if(r.k&&!x){motivo=`no está permitido en ${a.nivel}`;if(L<=9&&!eventoVoid)eventoVoid=i+1;}
    else if(x&&(sp==='durante'||(sp==='vuelo2'&&L!==8))){v=0;motivo='ayuda durante el salto';}
    else if(x&&r.void){v=0;motivo='VOID marcado por el juez';}
    if(motivo)notes.push(`Salto ${i+1}: VOID (${motivo}).`);
    if(!motivo&&x){if(sp==='vuelo2')enotes.push(`Salto ${i+1}: ayuda en el 2.º vuelo de un salto con mortal (N8): −1.00 de ejecución, no es VOID.`);
      if(sp==='aterrizaje')enotes.push(`Salto ${i+1}: ayuda al aterrizar: −0.50 de ejecución.`);
      if(sp==='despues')enotes.push(`Salto ${i+1}: ayuda después de aterrizar: ${L<=7?'sin deducción en N6/N7':'revisa la deducción'}.`);}
    if(L===10&&x&&!motivo&&x.valor===10&&!exc.has(n)&&!r.caida&&!sp)v=r2(v+.1);
    const nf=r.nf!=null&&r.nf!==''&&!isNaN(+r.nf)?+r.nf:null;
    return{v,r,i,x,void:!!motivo,nf};});
  if(rows.length>2)notes.push('Solo cuentan los 2 primeros saltos.');
  let np=0,cnt=new Set();
  if(eventoVoid&&L<=9){notes.unshift(`Evento VOID (N6–N9): el salto ${eventoVoid} no está permitido en el nivel; la nota de salto es 0 aunque el otro salto sea válido.`);vaults.forEach(x=>x.v=0);}
  else{const val=vaults.filter(x=>x.v>0);
    if(val.length){let b=val[0];
      if(val.length>1&&val.every(x=>x.nf!=null)){b=val.reduce((p,q)=>q.nf>p.nf?q:p);notes.push(`Cuenta el salto ${b.i+1} por tener la mejor nota final.`);}
      else{b=val.reduce((p,q)=>q.v>p.v?q:p);if(val.length>1)notes.push('Cuenta la mejor nota final de los 2 saltos; sin notas finales capturadas se toma el de mayor NP.');}
      np=b.v;cnt.add(b.i);}}
  if(L===10)notes.push('N10: +0.10 a saltos de 10.0 sin caída ni ayuda (excepto los marcados en la tabla).');
  return{tipo:'USAG',np,vaults,notes,enotes,counted:cnt};
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
  else if(e&&e.sys==='V'){const v=res.vaults?.find(x=>x.i===i);s+=`<span class="lt ${v&&v.void?'r':''}">${v?(v.void?'VOID':f2(v.v)):'—'}</span> `;
    if(v&&v.nf!=null)s+=`<small>nota final ${f2(v.nf)}</small> `;}
  else if(l||res.items?.[i]?.l){const it=res.items?.[i],le=it&&it.l||l;
    s+=`<span class="lt ${res.tipo==='USAG'&&it&&it.l&&!it.cred?'r':''}">${le}${r.l?' (manual)':''}</span> `;
    if(it&&res.tipo==='USAG'){
      if(it.rest)s+='<span class="badge b">restringido −0.50</span>';
      else if(it.rep)s+='<span class="badge b">repetido: sin VP</span>';
      else if(it.inc||it.spotE)s+='<span class="badge b">sin VP</span>';
      else if(it.tol)s+=`<span class="badge w">restringido tolerado · vale ${it.vl}</span>`;
      else if(it.vl&&it.vl!==le)s+=`<span class="badge i">vale ${it.vl}</span>`;
      if(it.dvb)s+=`<span class="badge i">DV +${f2(it.dvb)}</span>`;
      if(it.vr)s+=`<span class="badge i">${esc(it.vr.t)}</span>`;}}
  else s+=`<span class="lt r">sin valor</span> `;
  if(r.caida)s+=' · caída';
  if(r.inc)s+=' · no cae de pie / incompleto';
  if(r.spot&&e&&e.sys!=='V')s+=' · '+(SPOT_TXT[r.spot]||'ayuda');
  if(e&&e.sys==='V'){if(r.spot)s+=' · ayuda '+({durante:'durante el salto',vuelo2:'en el 2.º vuelo',aterrizaje:'al aterrizar',despues:'después de aterrizar'}[r.spot]||'');if(r.void)s+=' · VOID';}
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
    h+=`<div class="metrics">${(res.vaults||[]).map((v,i)=>`<div><b>${v.void?'VOID':f2(v.v)}</b><small>Salto ${i+1}${usag&&res.counted.has(v.i)?' · cuenta':''}</small></div>`).join('')}${res.avg!=null?`<div><b>${f2(res.avg)}</b><small>Promedio (final)</small></div>`:''}</div>`;
    h+=`<small class="ehelp" style="color:var(--muted)">${usag?'2 saltos (iguales o distintos): cuenta la mejor nota final. Si capturas la nota final de cada salto (en el salto), se compara con ella; si no, se toma el de mayor NP. N6–N9: un salto no permitido anula todo el evento.':'En clasificación / all-around cuenta 1 salto; en final por aparato se promedian 2.'}</small>`;
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
    h+=`<div class="chips"><span class="chip ${faltTxt?'miss':'hit'}">Pide ${reqTxt}${faltTxt?' · faltan '+faltTxt:' · completo'}</span>${res.bon||res.cv||res.dvb?`<span class="chip hit">Bono ${f2(res.bon)} (CV ${f2(res.cvRaw)}${res.dvb?' + DV '+f2(res.dvb):''}${r2(res.cvRaw+res.dvb)>res.bon?' · tope '+(numNivel(a.nivel)===9?'0.30':'0.50'):''})</span>`:''}${res.cc?`<span class="chip hit">CC ${f2(res.cc)}</span>`:''}${res.extra?`<span class="chip hit">+0.10 extra N10 (fuera de la NP)</span>`:''}</div>`;
    const src=c=>c.src&&c.src.length?' <small>'+c.src.map(j=>'#'+(j+1)).join(', ')+'</small>':'';
    const box=(kind,c)=>`<label class="${c.hit?'hit':kind==='sr'?'miss':''}"><input type="checkbox" data-act="${kind}" data-id="${esc(c.id)}" ${c.hit?'checked':''}><span>${kind==='cc'?'+'+f2(c.v)+' ':''}${esc(c.t)}${c.auto&&c.m==null?' <span class="auto">(detectado)</span>'+src(c):''}${c.m!=null?` <small>marcado a mano · <a href="#" data-act="${kind}auto" data-id="${esc(c.id)}">volver a automático</a></small>`:''}</span></label>`;
    h+=`<div class="sec">Requisitos especiales (0.50 c/u) — se detectan solos; marca o desmarca lo que veas distinto</div><div class="cr">${res.srDet.map(c=>box('sr',c)).join('')}</div>`;
    if(res.ccDet.length)h+=`<div class="sec">Crédito de composición (máx. ${f2(res.ccMax)})</div><div class="cr">${res.ccDet.map(c=>box('cc',c)).join('')}</div>`;
    if(ui.ap==='VIGA'||ui.ap==='PISO'){const L=numNivel(a.nivel),lim=L<=7?'1:20':'1:30',d=(a.p&&a.p.dur&&a.p.dur[ui.ap])||'';
      h+=`<label class="opt">Duración del ejercicio (s, opcional) <input class="dur" type="number" min="0" step="1" inputmode="numeric" data-act="dur" value="${esc(d)}"> <small>máx. ${lim}; menos de 30 s = ejercicio corto</small></label>`;}
  }
  const en=res.enotes||[];
  if(res.notes.length||en.length)h+=`<div class="avisos"><b>Avisos (${new Set(res.notes).size+new Set(en).size})</b><ul class="notes">${[...new Set(res.notes)].map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${en.length?`<ul class="notes enotes">${[...new Set(en)].map(n=>`<li>${esc(n)}</li>`).join('')}</ul><small class="ehelp">Composición, tiempo y ejecución: no cambian la nota de partida.</small>`:''}</div>`;
  h+=`</div><div class="list">`;
  if(!rows.length)h+=`<div class="empty">Sin elementos. Escribe abajo el primero.</div>`;
  const canLink=ui.ap!=='SALTO'&&(!usag||numNivel(a.nivel)>=9);
  rows.forEach((r,i)=>{
    h+=`<div class="row ${res.counted.has(i)?'':'off'}"><span class="num">${i+1}</span><div><button class="nm" data-act="edit" data-i="${i}">${esc(r.n)}</button><div class="meta">${metaLine(r,res,i,a)}</div></div>
      <div class="ctl"><button data-act="up" data-i="${i}" aria-label="Subir">↑</button><button data-act="down" data-i="${i}" aria-label="Bajar">↓</button><button data-act="del" data-i="${i}" aria-label="Quitar" class="${ui.del===i?'sure':''}">${ui.del===i?'Quitar':'✕'}</button></div></div>`;
    if(ui.open===i)h+=editPanel(r,i,a);
    if(i<rows.length-1){
      const indB=r.c&&ui.ap==='PISO'&&usag?`<button class="nox" data-act="ind" data-i="${i}" title="Conexión indirecta (con rondada / flic-flac en medio)">${r.ind?'directa':'indirecta'}</button>`:'';
      if(canLink){const pot=res.pot[i]||0,man=r.cvm!=null&&r.cvm!=='',ul=res.lbl&&res.lbl[i];
        const lbl=r.c?(ul&&!man?`Conectados · ${ul}${r.ind?' · indirecta':''}`:pot>0||man?`Conectados +${f1(man?+r.cvm:pot)}${man?' (manual)':''}${r.ind?' · indirecta':''}`:`Conectados (sin valor de conexión)${r.ind?' · indirecta':''}`):(pot>0?`Posible conexión +${f1(pot)} · toca para conectar`:'Conectar');
        h+=`<div class="link"><button class="${r.c?(pot>0||r.cvm||ul?'on':''):''}" data-act="link" data-i="${i}">${esc(lbl)}</button>${ui.ap==='PISO'&&!usag&&r.c?`<button class="nox" data-act="ind" data-i="${i}" title="Conexión indirecta (con rondada / flic-flac en medio)">${r.ind?'directa':'indirecta'}</button>`:indB}</div>`;}
      else if(ui.ap!=='SALTO'&&(ui.ap==='VIGA'||usag)){h+=`<div class="link"><button class="${r.c?'on':''}" data-act="link" data-i="${i}">${r.c?'Conectados':'Conectar'}${r.c&&r.ind?' · indirecta':''}</button>${indB}</div>`;}
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
  if(usag&&ap!=='SALTO'){const vs=variantesDe(e);
    if(vs.length)h+=`<div class="f"><label>Variante <select data-act="var" data-i="${i}"><option value="">${esc((primario(e.en)||'Principal').slice(0,60))}</option>${vs.map(v=>`<option value="${esc(v.id)}" ${r.var===v.id?'selected':''}>${esc(v.t)}</option>`).join('')}</select></label></div>`;
    h+=`<div class="f"><label><input type="checkbox" data-act="caida" data-i="${i}" ${r.caida?'checked':''}> Caída (después de caer de pie)</label>
      <label><input type="checkbox" data-act="inc" data-i="${i}" ${r.inc?'checked':''}> No cae primero de pie / incompleto</label>
      <label>Ayuda <select data-act="spot" data-i="${i}"><option value="">sin ayuda</option><option value="E" ${r.spot==='E'?'selected':''}>durante el elemento</option><option value="L" ${r.spot==='L'?'selected':''}>al aterrizar</option></select></label></div>
      <small class="ehelp">Caída o ayuda al aterrizar: conserva VP, SR y CC, sin bono. No cae de pie o ayuda durante el elemento: sin VP, SR, CC ni bono.</small>`;
    h+=`<div class="f"><button class="btn ghost" data-act="replace" data-i="${i}">Cambiar elemento</button></div></div>`;return h;}
  if(usag&&ap==='SALTO'){const L=numNivel(a.nivel);
    h+=`<div class="f"><label><input type="checkbox" data-act="caida" data-i="${i}" ${r.caida?'checked':''}> Caída</label>
      <label>Ayuda <select data-act="spot" data-i="${i}"><option value="">sin ayuda</option><option value="durante" ${r.spot==='durante'?'selected':''}>durante el salto (VOID)</option>${L===8?`<option value="vuelo2" ${r.spot==='vuelo2'?'selected':''}>en el 2.º vuelo de un salto con mortal (−1.00)</option>`:''}<option value="aterrizaje" ${r.spot==='aterrizaje'?'selected':''}>al aterrizar (−0.50)</option>${L<=7?`<option value="despues" ${r.spot==='despues'?'selected':''}>después de aterrizar</option>`:''}</select></label>
      <label><input type="checkbox" data-act="void" data-i="${i}" ${r.void?'checked':''}> VOID (balk, sin manos, no cae de pie…)</label>
      <label>Nota final <input type="text" inputmode="decimal" class="nf" data-act="nf" data-i="${i}" value="${esc(r.nf??'')}" placeholder="opcional"></label></div>`;
    h+=`<div class="f"><button class="btn ghost" data-act="replace" data-i="${i}">Cambiar elemento</button></div></div>`;return h;}
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
// Marcas del juez en una fila (caída, no cae de pie, ayuda, VOID) para la impresión y el Excel.
function marcasTxt(r){const m=[];if(r.caida)m.push('caída');if(r.inc)m.push('no cae de pie');
  if(r.spot)m.push('ayuda '+({E:'durante',L:'al aterrizar',durante:'durante',vuelo2:'2.º vuelo',aterrizaje:'al aterrizar',despues:'después'}[r.spot]||''));if(r.void)m.push('VOID');return m.join(', ');}
function printHTML(n){
  const a=S.atletas[n],t=totals(n),usag=esUSAG(a.nivel);
  let h=`<div class="fs"><div class="ph"><div><h1>${esc(n)}</h1><p>${esc(nivTxt(a.nivel))} · ${usag?'USAG Development 2026-2030':'Código FIG GAF 2025-2028'}</p></div><div class="paa"><span>${usag?'Notas de partida':'Notas D'} (suma)</span><b>${f2(t.aa)}</b></div></div><div class="grid2">`;
  for(const[ap,lab]of APS){const res=t[ap],rows=a.r[ap]||[];
    h+=`<div class="pap"><div class="pap-h"><h2>${lab}</h2><b>${f2(res.np)}</b></div>`;
    if(ap==='SALTO')h+=`<div class="pm">${(res.vaults||[]).map((v,i)=>`Salto ${i+1}: ${v.void?'VOID':f2(v.v)}`).join(' · ')}${res.avg!=null?` · Promedio ${f2(res.avg)}`:''}</div>`;
    else if(res.tipo==='FIG')h+=`<div class="pm">Dificultad ${f1(res.dv)} · Composición ${f1(res.cr)} · Conexión ${f1(res.cv)} · Bonos ${f1(r2(res.sb+res.dmt))}${res.nd?` · Penalización −${f2(res.nd)}`:''}</div>`;
    else h+=`<div class="pm">Base ${f2(res.base)} · VP −${f2(res.vpDed)} · Req. esp. −${f2(res.srDed)}${res.restDed?` · Restringidos −${f2(res.restDed)}`:''} · CC ${f2(res.cc)} · Bono ${f2(res.bon)}${res.extra?' · +0.10 extra N10 (fuera de la NP)':''}${res.nd?` · Juez árbitro −${f2(res.nd)}`:''}</div>`;
    if(!rows.length)h+=`<div class="pf">Sin elementos.</div>`;
    else{h+='<table>';rows.forEach((r,i)=>{const e=el(r.k),l=letterOf(r);let v='';
        if(ap==='SALTO'){const x=res.vaults?.find(y=>y.i===i);v=e&&e.sys==='F'?(e.v||0).toFixed(2):(x?(x.void?'VOID':f2(x.v)):'');}else v=(res.items?.[i]?.l)||l||'';
        const mk=marcasTxt(r);
        h+=`<tr class="${res.counted.has(i)?'':'off'}"><td class="n">${i+1}</td><td>${esc(r.n)}${mk?' ('+esc(mk)+')':''}${res.items?.[i]?.rest?' (restringido)':''}</td><td class="c">${e&&e.n?(e.sys==='U'||e.sys==='V'?'USAG ':'')+esc(e.n):''}</td><td class="v">${esc(v)}</td></tr>`;
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
  const notas=[['Atleta','Nivel',...APS.map(([,l])=>l),'Total']],rut=[['Atleta','Nivel','Aparato','#','Elemento','Código','Valor','Cuenta','Conexión','Caída','Marcas']];
  for(const n of S.orden){const a=S.atletas[n];if(!a)continue;const t=totals(n);
    notas.push([n,nivTxt(a.nivel),...APS.map(([ap])=>+f2(t[ap].np)),+f2(t.aa)]);
    for(const[ap,lab]of APS){const res=t[ap];(a.r[ap]||[]).forEach((r,i)=>{const e=el(r.k),l=letterOf(r);
      let v=(res.items?.[i]?.l)||l||'';if(ap==='SALTO'){const x=res.vaults?.find(y=>y.i===i);v=x?(x.void?'VOID':+f2(x.v)):'';}
      const cv=r.c?(r.cvm!=null&&r.cvm!==''?+r.cvm:(res.pot?.[i]||0)):'';
      rut.push([n,nivTxt(a.nivel),lab,i+1,r.n,e&&e.n?(e.sys==='U'||e.sys==='V'?'USAG ':'')+e.n:'',v,res.counted.has(i)?'Sí':'No',r.c?('+'+f1(cv)):'',r.caida?'Sí':'',marcasTxt(r)]);});}}
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(notas),'Notas');XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rut),'Rutinas');
  XLSX.writeFile(wb,'Rutinas GAF.xlsx');
}

/* ---------- eventos ---------- */
function A(){return S.atletas[ui.atleta];}
function rowsAp(){const a=A();return a.r[ui.ap]||(a.r[ui.ap]=[]);}
// Nombre al colocar un elemento (como Jueceo GAV): el apodo más usado en las rutinas, el nombre propio del Código
// (Amanar, Ejova…) o la descripción.
function nombreDe(k,nivel){const c=new Map(),lab=labelOf(k,nivel);
  for(const x of Object.values(S.atletas||{}))for(const rows of Object.values(x?.r||{}))for(const o of rows||[])
    if(o.k===k&&o.n&&!/^[\d.\s]+$/.test(o.n)&&nk(o.n)!==nk(lab))c.set(o.n.trim(),(c.get(o.n.trim())||0)+1);
  let mejor=null,max=0;for(const [n,v] of c)if(v>max){max=v;mejor=n;}if(mejor)return mejor;
  // Solo si la casilla tiene un único nombre propio (si trae varios, no se sabe cuál variante es).
  const e=el(k);const nom=e&&e.nom&&!/\/|\n/.test(e.nom)?String(e.nom).trim():'';
  return nom||lab;}
function addRow(k,free){const rows=rowsAp(),q0=ui.q.trim(),q=k&&/^[\d.\s]+$/.test(q0)?'':q0;
  // Lo escrito queda como apodo de ese elemento para la próxima búsqueda (como en Jueceo GAV).
  if(k&&q&&k[0]!=='V'&&nk(q)!==nk(labelOf(k,A().nivel))){S.alias=S.alias||{};S.alias[sisDe(A().nivel)+'|'+ui.ap+'|'+nk(q)]=k;}
  const r={n:q||(k?nombreDe(k,A().nivel):'Elemento'),k:k||null};
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
  if(act==='srauto'||act==='ccauto'){const k=act==='srauto'?'sr':'cc',m=(a[k][ui.ap]=a[k][ui.ap]||{});delete m[b.dataset.id];save();return render();}
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
  // Requisitos especiales y CC (USAG): marca manual por id; "volver a automático" la borra.
  if(act==='sr'||act==='cc'){const m=(a[act][ui.ap]=a[act][ui.ap]||{});for(const x of Object.keys(m))if(/^\d+$/.test(x))delete m[x];m[b.dataset.id]=b.checked;save();return render();}
  if(act==='inc'){if(b.checked)rows[i].inc=true;else delete rows[i].inc;save();return render();}
  if(act==='void'){if(b.checked)rows[i].void=true;else delete rows[i].void;save();return render();}
  if(act==='spot'||act==='var'){if(b.value)rows[i][act]=b.value;else delete rows[i][act];save();return render();}
  if(act==='nf'){const v=b.value.trim().replace(',','.');if(v===''||isNaN(+v))delete rows[i].nf;else rows[i].nf=+v;save();return render();}
  if(act==='dur'){a.p=a.p||{};a.p.dur=a.p.dur||{};const v=+b.value;if(v>0)a.p.dur[ui.ap]=v;else delete a.p.dur[ui.ap];save();return render();}
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
  S={atletas:stored?.atletas||{},orden:stored?.orden||[],alias:stored?.alias||{}};
  for(const n of Object.keys(S.atletas)){const a=S.atletas[n];a.r=a.r||{};for(const[ap]of APS)a.r[ap]=a.r[ap]||[];a.cr=a.cr||{};a.sr=a.sr||{};a.cc=a.cc||{};a.p=a.p||{};if(!S.orden.includes(n))S.orden.push(n);}
  S.orden=S.orden.filter(n=>S.atletas[n]);
  render();
}
