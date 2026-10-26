// Pruebas de las reglas FIG GAF 2025-2028 (REGLAS_FIG_WAG.md, §1-§6 y tabla §12) contra el editor real (app/editor.js).
// Uso: servidor estático en :8791 sirviendo /home/user/jueceofemenil (setsid python3 -m http.server 8791 &)
//      NODE_PATH=$(npm root -g) node fig_test.js          → Chromium (Playwright), capturas y prueba de la interfaz
//      node fig_test.js --node                            → solo cálculo, en Node (vm), para iterar rápido
// Rutina: elementos separados por espacio; al final del elemento ">" = conectado directo con el siguiente, "~" = indirecta.
// Marcas: ":nv" (sin DV), ":caida", ":ayu=1|2", ":var=1", ":pos=t|p|s", ":gir=360", ":agr=inv", ":bv", ":lat", ":h2", ":nr",
// ":agv", ":pas", ":pre", ":p1", ":l=C" (letra manual), ":nulo" (salto).
const T = [
  // ---- Generales ----
  ['GEN-01 nd fuera de D', 'FIG', 'BARRAS', '3.404 2.305', { np: 1.20, nd: 8.50 }],
  ['GEN-03 salida FX entre los 8', 'FIG', 'PISO', '3.106> 3.107> 5.402 1.101 1.205 2.402 2.301 1.409 1.509 3.106> 3.107> 5.201', { dmtI: 11, counted: [11], nCounted: 8 }],
  ['GEN-04 10 acro + 1 danza (BB12)', 'FIG', 'VIGA', '5.202 5.204 5.312 5.410 5.512 5.612 4.108 4.109 5.208 5.408 2.101 6.405', { dv: 2.40, nCounted: 6, nd: 0 }],
  ['GEN-05 Deltchev y Gienger (UB11)', 'FIG', 'BARRAS', '3.405 3.405:var=1 6.406', { dv: 1.20, why: { 1: false } }],
  ['GEN-05 Deltchev repetido', 'FIG', 'BARRAS', '3.405 3.405 6.406', { dv: 0.80, why: { 1: /repetido/ } }],
  ['GEN-05 FX agrupado y carpado', 'FIG', 'PISO', '3.106> 3.107> 5.101:pos=t 3.106> 3.107> 5.101:pos=p', { why: { 2: false, 5: false } }],
  ['GEN-05 UB kip y kip con ½', 'FIG', 'BARRAS', '1.101 1.101:gir=180 6.406', { dv: 0.60, why: { 1: false } }],
  ['GEN-06 danza mismo recuadro (FX9)', 'FIG', 'PISO', '1.107 1.107:var=0.1 1.101 1.205', { dv: 0.40, nCorto: 4, why: { 1: /mismo recuadro/ } }],
  ['GEN-07 giro en cuclillas BB (BB7)', 'FIG', 'VIGA', '3.207 3.407 6.405', { dv: 0.60, why: { 1: /cuclillas/ }, nCorto: 3 }],
  ['GEN-07 giro en cuclillas FX (FX5)', 'FIG', 'PISO', '2.207 2.407', { dv: 0.20 }],
  ['GEN-09 árabe BB sin CR4 (BB6)', 'FIG', 'VIGA', '5.611 6.405', { cr: '0000' }],
  ['GEN-09 árabe FX sola (FX6)', 'FIG', 'PISO', '4.205', { crBit: { 3: false } }],
  ['GEN-09 árabe doble + doble atrás (FX6b)', 'FIG', 'PISO', '3.106> 3.107> 4.505 3.106> 3.107> 5.402', { crBit: { 2: true, 3: true } }],
  ['GEN-10 devaluado y repetido', 'FIG', 'BARRAS', '3.401:l=C 3.401 6.406', { dv: 0.70, why: { 1: /repetido/ } }],
  ['GEN-10 sin DV y luego bien', 'FIG', 'BARRAS', '3.404:nv 3.404 6.406', { dv: 0.80, why: { 0: /sin DV/, 1: false } }],
  ['GEN-11 sin DV en conexión', 'FIG', 'BARRAS', '3.404> 2.305:nv 6.406', { dv: 0.80, cv: 0 }],
  ['GEN-11 FX línea con mortal sin DV', 'FIG', 'PISO', '3.106> 3.107> 5.502> 5.301:nv', { nLin: 1, why: { 3: /sin DV/ } }],
  ['GEN-13 repetido no cumple CR', 'FIG', 'VIGA', '5.202> 5.312 2.305 5.202 6.405', { crBit: { 2: true, 3: false }, crSrc: { 2: [0, 1] } }],
  ['GEN-14 danza repetida en conexión (BB11)', 'FIG', 'VIGA', '2.305> 2.305 6.405', { cv: 0 }],
  ['GEN-14 flic flic mortal (BB14)', 'FIG', 'VIGA', '5.202> 5.202> 5.512 6.405', { cv: 0, sb: 0.10 }],
  ['GEN-16 bono de salida', 'FIG', 'BARRAS', '3.404 6.406', { dmt: 0.20 }],
  ['GEN-16/18 salida sin DV', 'FIG', 'BARRAS', '3.404 6.406:nv', { dmt: 0, dv: 0.40, ndNo: /Sin salida/, note: /cuentan 7/ }],
  ['GEN-17 raíz cuenta para corto', 'FIG', 'BARRAS', '4.304 4.404 4.504 4.502 6.406', { nCorto: 5, nd: 4 }],
  ['GEN-18 sin salida (UB12)', 'FIG', 'BARRAS', '3.404 2.305', { nd: 8.50, ndHas: /Sin salida/ }],
  ['GEN-19 ayuda para hacerlo', 'FIG', 'BARRAS', '3.404:ayu=2 6.406', { dv: 0.40, crBit: { 0: false }, ndHas: /Ayuda del entrenador/, nd: 9.00 }],
  ['GEN-19 ayuda después', 'FIG', 'BARRAS', '3.404 6.406:ayu=1', { dv: 0.80, dmt: 0, nd: 9.00 }],
  // ---- Junior ----
  ['JR-01 tope 0.50 (UB13)', 'JR', 'BARRAS', '3.708 6.406', { dv: 0.90, dmt: 0 }],
  ['JR-02 CV con DV topado (BB JR)', 'JR', 'VIGA', '5.202> 5.612 6.405', { cv: 0.10 }],
  ['JR-02 sénior B+F', 'FIG', 'VIGA', '5.202> 5.612 6.405', { cv: 0.20 }],
  ['JR-03 sin bono de salida', 'JR', 'BARRAS', '3.404 6.505', { dmt: 0 }],
  ['JR-04 corto Junior 6', 'JR', 'BARRAS', '1.101 2.201 3.403 4.405 2.406 6.505', { nd: 0 }],
  ['JR-04 corto Junior 5', 'JR', 'BARRAS', '1.101 3.403 4.405 2.406 6.505', { nd: 4 }],
  ['JR-04 sénior 6', 'FIG', 'BARRAS', '1.101 2.201 3.403 4.405 2.406 6.505', { nd: 4 }],
  ['JR-07 prohibido Junior (UB14)', 'JR', 'BARRAS', '1.407 6.406', { dv: 0.40, note: /prohibido para Junior/ }],
  ['JR-07 variante permitida 1.409 González', 'JR', 'BARRAS', '1.409:var=1 6.406', { dv: 0.80 }],
  ['JR-07 prohibido viga', 'JR', 'VIGA', '1.305 6.405', { dv: 0.40, why: { 0: /Junior/ } }],
  // ---- Salto ----
  ['VT-02 clasificación 1 salto', 'FIG', 'SALTO', '4.35 5.33', { np: 5.40 }],
  ['VT-06 direcciones distintas (VT1)', 'FIG', 'SALTO', '4.35 5.33', { avg: 5.70 }],
  ['VT-04 mismo grupo (VT2)', 'FIG', 'SALTO', '4.35 4.34', { avg: 4.20 }],
  ['VT-05 repite el 1.º (VT4)', 'FIG', 'SALTO', '4.35 4.35', { avg: 2.70 }],
  ['VT-06 Cuervo adelante', 'FIG', 'SALTO', '2.11 3.30', { avg: 4.00 }],
  ['VT-06 grupo 1 sin bono', 'FIG', 'SALTO', '1.00 4.10', { avg: 2.30 }],
  ['VT-06 caída sin bono', 'FIG', 'SALTO', '4.35 5.33:caida', { avg: 5.50 }],
  ['VT-08 nulo → ÷2', 'FIG', 'SALTO', '4.35 4.34:nulo', { avg: 2.70 }],
  ['JR-05 mismo grupo sin −2', 'JR', 'SALTO', '4.35 4.34', { avg: 5.20 }],
  ['JR-05 sin bono (VT3)', 'JR', 'SALTO', '4.35 5.33', { avg: 5.50 }],
  ['JR-05 repetido', 'JR', 'SALTO', '4.35 4.35', { avg: 2.70 }],
  ['JR-07 salto prohibido', 'JR', 'SALTO', '2.50', { np: 0 }],
  // ---- Barras ----
  ['UB-02 raíz (UB1)', 'FIG', 'BARRAS', '4.304 4.404 4.504 4.502 6.406', { np: 2.30, dv: 1.60, cr: '0001', dmt: 0.20, nd: 4, why: { 3: /raíz/ } }],
  ['UB-03 Tkatchev por línea (UB2)', 'FIG', 'BARRAS', '4.502 4.602 3.403 3.503 6.406', { np: 2.00, dv: 1.30, cr: '0100', why: { 1: /Tkatchev/, 3: /Tkatchev/ } }],
  ['UB-03 líneas distintas', 'FIG', 'BARRAS', '3.403 4.502 6.406', { dv: 1.30 }],
  ['UB-04 un Jaeger (UB3)', 'FIG', 'BARRAS', '3.308 3.408 6.406', { np: 1.90, dv: 0.70 }],   // el Jaeger que cuenta cumple CR3 (agarre cubital/L), validado con Melnikova, Mundial 2025
  ['UB-06 CR1 Pak (UB8)', 'FIG', 'BARRAS', '3.404 6.406', { cr: '1000' }],
  ['UB-06 CR1 3.402', 'FIG', 'BARRAS', '3.402 6.406', { crBit: { 0: true } }],
  ['UB-07 4.405 no es misma barra', 'FIG', 'BARRAS', '4.405 6.406', { crBit: { 1: false } }],
  ['UB-07/09 Chusovitina (UB9)', 'FIG', 'BARRAS', '3.401 6.406', { cr: '0001' }],
  ['UB-08 CR3 cubital (UB10)', 'FIG', 'BARRAS', '3.206:agr=inv 6.406', { crBit: { 2: true } }],
  ['UB-08 3.307 regular', 'FIG', 'BARRAS', '3.307:agr=reg 6.406', { crBit: { 2: false } }],
  ['UB-10 D+D sin vuelo ni ½ (UB4)', 'FIG', 'BARRAS', '4.401> 4.406 6.406', { cv: 0 }],
  ['UB-10 D+D con ½', 'FIG', 'BARRAS', '4.401:gir=180> 4.406:gir=180 6.406', { cv: 0.10 }],
  ['UB-10 Pak + C en BI (UB5)', 'FIG', 'BARRAS', '3.404> 2.305 6.406', { cv: 0 }],
  ['UB-10 Maloney + C con ½ (UB6)', 'FIG', 'BARRAS', '5.409> 2.305:gir=180 6.406', { cv: 0.20 }],
  ['UB-10 E + salida E (UB17)', 'FIG', 'BARRAS', '4.504> 6.505', { cv: 0.20 }],
  ['UB-10 Chusovitina + Tkatchev (UB16)', 'FIG', 'BARRAS', '3.401:gir=360> 3.403 6.406', { cv: 0.10 }],
  ['UB-10 E+E con vuelo (UB7)', 'FIG', 'BARRAS', '4.504> 2.506 6.406', { cv: 0.20 }],
  ['UB-10 E+E sin vuelo (UB7b)', 'FIG', 'BARRAS', '4.501> 4.504 6.406', { cv: 0.10 }],
  ['UB-11 balanceo vacío', 'FIG', 'BARRAS', '4.504:bv> 2.506 6.406', { cv: 0, enote: /Balanceo vacío/ }],
  ['UB-12 kip tras Shaposhnikova', 'FIG', 'BARRAS', '2.406 2.201 6.406', { enote: /Shaposhnikova/ }],
  ['UB-13 más de 2 iguales a la salida', 'FIG', 'BARRAS', '2.201> 2.201> 2.201> 6.406', { enote: /Más de 2/ }],
  ['UB-02 4.º conectado sin CV', 'FIG', 'BARRAS', '4.304 4.404 4.504> 4.502 6.406', { cv: 0 }],
  // ---- Viga ----
  ['BB-02 1.402 es danza', 'FIG', 'VIGA', '1.402 2.101 6.405', { tipo: { 0: 'danza' } }],
  ['BB-03 salto lateral +1', 'FIG', 'VIGA', '2.202:lat 6.405', { dv: 0.70, l: { 0: 'C' } }],
  ['BB-03 lateral = mismo elemento', 'FIG', 'VIGA', '2.202 2.202:lat 6.405', { dv: 0.60, why: { 1: /DV/ } }],
  ['BB-04 parada sin 2 s', 'FIG', 'VIGA', '5.302:h2 6.405', { dv: 0.60 }],
  ['BB-05 hold primero (BB4)', 'FIG', 'VIGA', '5.302> 5.312 6.405', { cv: 0, crBit: { 2: false } }],
  ['BB-05 hold último (BB13)', 'FIG', 'VIGA', '5.202> 5.302 6.405', { crBit: { 2: false } }],
  ['BB-05/15 SB con saltos de posición (BB1)', 'FIG', 'VIGA', '2.202> 2.305> 2.203 6.405', { sb: 0.10 }],
  ['BB-09 giro + wolf no es CR1', 'FIG', 'VIGA', '3.305> 2.112 6.405', { crBit: { 0: false } }],
  ['BB-09 switch + wolf', 'FIG', 'VIGA', '2.305> 2.112 6.405', { crBit: { 0: true } }],
  ['BB-11 flic + aérea (BB15)', 'FIG', 'VIGA', '5.202> 5.408 6.405', { crBit: { 2: true }, cv: 0 }],
  ['BB-11 flic flic mortal', 'FIG', 'VIGA', '5.202> 5.202> 5.312 6.405', { crBit: { 2: true } }],
  ['BB-12 CR4 desde posición lateral (BB9)', 'FIG', 'VIGA', '5.402 5.410 6.405', { crBit: { 3: true } }],
  ['BB-12 tic-toc no da las dos', 'FIG', 'VIGA', '4.108 6.405', { crBit: { 3: false } }],
  ['BB-13 B+D adelante (BB2b)', 'FIG', 'VIGA', '5.201> 5.410 6.405', { cv: 0.20 }],
  ['BB-13 D+B adelante (BB2c)', 'FIG', 'VIGA', '5.410> 5.201 6.405', { cv: 0.20 }],
  ['BB-13 B+D atrás (BB2d)', 'FIG', 'VIGA', '5.202> 5.402 6.405', { cv: 0.10 }],
  ['BB-13 D+B atrás (BB2e)', 'FIG', 'VIGA', '5.402> 5.202 6.405', { cv: 0 }],
  ['BB-13 flic + rueda aérea', 'FIG', 'VIGA', '5.202> 5.408 6.405', { cv: 0 }],
  ['BB-13 B+E (BB2a)', 'FIG', 'VIGA', '5.202> 5.512 6.405', { cv: 0.10 }],
  ['BB-13 sin rebote', 'FIG', 'VIGA', '5.202:nr> 5.512 6.405', { cv: 0 }],
  ['BB-14 mixta B+D (BB3)', 'FIG', 'VIGA', '2.203> 5.410 6.405', { cv: 0.10 }],
  ['BB-14 giros A+C', 'FIG', 'VIGA', '3.101> 3.302 6.405', { cv: 0.10, enote: /pierna contraria/ }],
  ['BB-15 caída en el 3.º', 'FIG', 'VIGA', '5.312> 5.312> 5.312:caida 6.405', { cv: 0.10, sb: 0 }],
  ['BB-15 agarre de la viga', 'FIG', 'VIGA', '2.202> 2.305> 2.203:agv 6.405', { sb: 0, enote: /agarra/ }],
  ['BB-16 B repetible, E repetido', 'FIG', 'VIGA', '5.202> 5.512 2.305 5.202> 5.512 6.405', { cv: 0.10 }],
  ['BB-16 B repetible + F', 'FIG', 'VIGA', '5.202> 5.512 2.305 5.202> 5.612 6.405', { cv: 0.30 }],
  ['BB-17 acro con apoyo repetido', 'FIG', 'VIGA', '5.407> 5.407> 5.312 6.405', { cv: 0.20, sb: 0.10 }],
  ['BB-19 entrada sin DV', 'FIG', 'VIGA', '2.101 6.405', { enote: /Entrada sin DV/ }],
  ['BB-21 salida sin DV', 'FIG', 'VIGA', '2.101 6.405:nv', { ndNo: /Sin salida/ }],
  // ---- Suelo ----
  ['FX-02 línea RO FF mortal', 'FIG', 'PISO', '3.106> 3.107> 5.402', { nLin: 1 }],
  ['FX-02 mortal solo', 'FIG', 'PISO', '5.402', { nLin: 0 }],
  ['FX-02 sin mortal', 'FIG', 'PISO', '3.106> 3.107', { nLin: 0 }],
  ['FX-02 solo aéreos', 'FIG', 'PISO', '4.104> 4.103', { nLin: 0 }],
  ['FX-02 dos mortales', 'FIG', 'PISO', '4.101> 4.202', { nLin: 1 }],
  ['FX-02 entrada no capturada', 'FIG', 'PISO', '5.402:pre', { nLin: 1 }],
  ['FX-02 despegue de un pie', 'FIG', 'PISO', '4.101:p1> 4.202:p1', { nLin: 0 }],
  ['FX-03/04 dos líneas (FX1)', 'FIG', 'PISO', '3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301 4.302', { np: 2.00, dv: 1.00, cr: '0110', cv: 0, dmt: 0, nd: 4, nLin: 2, dmtI: 6, why: { 7: /última línea/, 4: /repetido/ } }],
  ['FX-05 cuatro líneas (FX2)', 'FIG', 'PISO', '3.106> 3.107> 5.402 3.106> 3.107> 5.301 4.101> 4.202 1.205 3.106> 3.107> 5.502', { np: 3.40, dv: 1.70, cr: '0111', dmt: 0.20, nLin: 4 }],
  ['FX-04 una línea (FX12)', 'FIG', 'PISO', '3.106> 3.107> 5.402 1.101 2.101 1.205', { np: 1.50, dv: 1.00, nd: 4.50, ndHas: /Sin salida/ }],
  ['FX-04 salida repetida sin DV', 'FIG', 'PISO', '3.106> 3.107> 5.402 3.106> 3.107> 5.402', { ndNo: /Sin salida/, dmt: 0, nd: 6 }],
  ['FX-04 salida sin caer de pies', 'FIG', 'PISO', '3.106> 3.107> 5.402 3.106> 3.107> 5.502:nv', { ndNo: /Sin salida/, dmt: 0 }],
  ['FX-05 bono con 3 líneas', 'FIG', 'PISO', '3.106> 3.107> 5.301 3.106> 3.107> 5.201 2.402 3.106> 3.107> 5.402', { dmt: 0.20, nLin: 3, dmtI: 9 }],
  ['FX-05 última línea con caída', 'FIG', 'PISO', '3.106> 3.107> 5.301 3.106> 3.107> 5.201 2.402 3.106> 3.107> 5.402:caida', { dmt: 0 }],
  ['FX-05 líneas marcadas a mano', 'FIG', 'PISO', '3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301', { lin: 3, dmt: 0, ndNo: /Sin salida/ }],
  ['FX-05 líneas a mano 1', 'FIG', 'PISO', '3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301', { lin: 1, ndHas: /Sin salida/ }],
  ['FX-06 pasaje indirecto', 'FIG', 'PISO', '1.101:pas 1.205', { crBit: { 0: true } }],
  ['FX-06 sin conexión', 'FIG', 'PISO', '1.101 1.205', { crBit: { 0: false } }],
  ['FX-06 straddle jump no', 'FIG', 'PISO', '1.107> 1.205', { crBit: { 0: false } }],
  ['FX-07 árabe + adelante (FX10)', 'FIG', 'PISO', '3.106> 4.205> 4.202', { crBit: { 3: false } }],
  ['FX-07 CR fuera de línea', 'FIG', 'PISO', '3.106> 3.107> 5.402 4.302', { crBit: { 1: false, 2: true } }],
  ['FX-07 ½ o 1/1: elegir 1/1', 'FIG', 'PISO', '3.106> 3.107> 5.201:gir=360', { crBit: { 1: true } }],
  ['FX-07 ½ o 1/1: ½', 'FIG', 'PISO', '3.106> 3.107> 5.201', { crBit: { 1: false } }],
  ['FX-08 indirecta B+D (FX3)', 'FIG', 'PISO', '5.201~ 5.402', { cv: 0.10 }],
  ['FX-08 A+A+D indirecta', 'FIG', 'PISO', '5.104> 5.104> 3.107> 5.402', { cv: 0.10 }],
  ['FX-08 indirecta capturada', 'FIG', 'PISO', '3.106> 3.107> 5.201> 3.107> 5.402', { cv: 0.10 }],
  ['FX-08 giros B+D (FX4)', 'FIG', 'PISO', '2.202> 2.402', { cv: 0.10 }],
  ['FX-08 giros D+B (FX4b)', 'FIG', 'PISO', '2.402> 2.202', { cv: 0.10 }],
  ['FX-08 mixta D+B (FX8)', 'FIG', 'PISO', '5.402> 1.205', { cv: 0.10 }],
  ['FX-08 mixta al revés', 'FIG', 'PISO', '1.205> 5.402', { cv: 0 }],
  ['FX-08 directa C+C', 'FIG', 'PISO', '3.106> 3.107> 5.301> 5.301', { cv: 0.10 }],
  ['FX-11 whip 1/1 suelto', 'FIG', 'PISO', '3.106> 3.107> 5.304', { l: { 2: 'B' } }],
  ['FX-11 whip 1/1 conectado', 'FIG', 'PISO', '3.106> 3.107> 5.304> 5.402', { l: { 2: 'C' } }],
  ['FX-03 sin líneas: acro sin DV (FX7)', 'FIG', 'PISO', '5.101 5.201 5.301 5.401 5.501 4.101 4.201 4.202 4.302 4.402 1.101', { dv: 0.10, nCorto: 11 }],
  ['FX-13 empieza y termina con acro', 'FIG', 'PISO', '3.106> 3.107> 5.402', { enote: /empieza directo/ }],
];

function helper() {
  window.__T = (nivel, ap, rut, opts) => {
    const rows = String(rut).split(/\s+/).filter(Boolean).map(tok => {
      const m = /^(.*?)([>~])?$/.exec(tok); const [n, ...fl] = m[1].split(':');
      const r = { k: 'F|' + ap + '|' + n, n };
      fl.forEach(f => { const [kk, vv] = f.split('='); r[kk] = vv === undefined ? true : vv; });
      if (m[2]) { r.c = true; if (m[2] === '~') r.ind = true; }
      return r;
    });
    const a = { nivel, r: { SALTO: [], BARRAS: [], VIGA: [], PISO: [] }, cr: {}, sr: {}, cc: {}, p: opts.lin != null ? { lin: { [ap]: String(opts.lin) } } : {} };
    a.r[ap] = rows;
    const res = compute(a, ap);
    return {
      np: res.np, dv: res.dv, cr: res.cr, cv: res.cv, sb: res.sb || 0, dmt: res.dmt || 0, nd: res.nd || 0, avg: res.avg,
      crBits: (res.crDet || []).map(c => c.hit ? '1' : '0').join(''), crSrc: (res.crDet || []).map(c => c.src || []),
      counted: [...res.counted], nLin: res.nLin, dmtI: res.dmtI, nCorto: res.nCorto,
      why: (res.items || []).map(x => x.why || ''), l: (res.items || []).map(x => x.l), tipo: (res.items || []).map(x => x.tipo),
      notes: res.notes, enotes: res.enotes || [], ndDet: (res.ndDet || []).map(d => d.t + ' ' + d.v),
    };
  };
}

const near = (a, b) => Math.abs((a || 0) - b) < 1e-6;
function check(o, exp) {
  const bad = [];
  for (const [k, v] of Object.entries(exp)) {
    if (['np', 'dv', 'cv', 'sb', 'dmt', 'nd', 'avg'].includes(k)) { if (!near(o[k], v)) bad.push(`${k}=${o[k]} (esperado ${v})`); }
    else if (k === 'cr') { if (o.crBits !== v) bad.push(`CR=${o.crBits} (esperado ${v})`); }
    else if (k === 'crBit') { for (const [j, b] of Object.entries(v)) if ((o.crBits[j] === '1') !== b) bad.push(`CR${+j + 1}=${o.crBits[j]} (esperado ${b ? 1 : 0})`); }
    else if (k === 'crSrc') { for (const [j, s] of Object.entries(v)) if (JSON.stringify(o.crSrc[j]) !== JSON.stringify(s)) bad.push(`CR${+j + 1} filas ${JSON.stringify(o.crSrc[j])} (esperado ${JSON.stringify(s)})`); }
    else if (k === 'counted') { for (const i of v) if (!o.counted.includes(i)) bad.push(`#${i + 1} no cuenta`); }
    else if (k === 'nCounted') { if (o.counted.length !== v) bad.push(`cuentan ${o.counted.length} (esperado ${v})`); }
    else if (['nLin', 'dmtI', 'nCorto'].includes(k)) { if (o[k] !== v) bad.push(`${k}=${o[k]} (esperado ${v})`); }
    else if (k === 'why') { for (const [i, w] of Object.entries(v)) { const g = o.why[i]; if (w === false ? !!g : !(w instanceof RegExp ? w.test(g) : g)) bad.push(`#${+i + 1} motivo="${g}" (esperado ${w})`); } }
    else if (k === 'l' || k === 'tipo') { for (const [i, w] of Object.entries(v)) if (o[k][i] !== w) bad.push(`#${+i + 1}.${k}=${o[k][i]} (esperado ${w})`); }
    else if (k === 'note') { if (!o.notes.some(n => v.test(n))) bad.push('falta aviso ' + v); }
    else if (k === 'enote') { if (!o.enotes.some(n => v.test(n))) bad.push('falta aviso E ' + v); }
    else if (k === 'ndHas') { if (!o.ndDet.some(n => v.test(n))) bad.push('falta penalización ' + v); }
    else if (k === 'ndNo') { if (o.ndDet.some(n => v.test(n))) bad.push('sobra penalización ' + v); }
  }
  return bad;
}
function report(id, nivel, ap, out, bad) {
  console.log(`FALLA ${id} (${nivel} ${ap}): ${bad.join('; ')}\n   D ${out.np} dv ${out.dv} cr ${out.cr} [${out.crBits}] cv ${out.cv} sb ${out.sb} dmt ${out.dmt} nd ${out.nd} avg ${out.avg} lin ${out.nLin} dmtI ${out.dmtI} corto ${out.nCorto} cuentan ${out.counted}\n   motivos: ${JSON.stringify(out.why)}\n   avisos: ${out.notes.join(' | ')}\n   E: ${out.enotes.join(' | ')}\n   nd: ${out.ndDet.join(' | ')}`);
}

async function enNode() {
  const fs = require('fs'), vm = require('vm'), R = '/home/user/jueceofemenil/app/';
  const stub = { addEventListener() { }, innerHTML: '' };
  const ctx = vm.createContext({ document: { getElementById: () => stub, querySelector: () => null }, localStorage: { getItem: () => null, setItem() { } }, console, window: {} });
  vm.runInContext(fs.readFileSync(R + 'editor.js', 'utf8'), ctx);
  ctx.__d = { fig: JSON.parse(fs.readFileSync(R + 'datos/elementos_fig_wag.json')), figl: JSON.parse(fs.readFileSync(R + 'datos/fig_listas.json')) };
  vm.runInContext('FIG=__d.fig.E;FIGG=__d.fig.grupos;JUNIOR=__d.fig.junior;FL=__d.figl;', ctx);
  ctx.window = ctx; vm.runInContext('(' + helper.toString() + ')()', ctx);
  let ok = 0, fail = 0;
  for (const [id, nivel, ap, rut, exp] of T) { ctx.__a = [nivel, ap, rut, exp]; const out = vm.runInContext('__T(...__a)', ctx); const bad = check(out, exp); if (bad.length) { fail++; report(id, nivel, ap, out, bad); } else ok++; }
  console.log(`\nPruebas FIG (Node): ${ok} pasan, ${fail} fallan (de ${T.length}).`);
  process.exit(fail ? 1 : 0);
}

async function enChromium() {
  const { chromium } = require('playwright');
  const BASE = 'http://localhost:8791/app/', D = __dirname;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(BASE);
  await page.waitForFunction(() => typeof S !== 'undefined' && FL && FL.UB && FL.UB.raiz && S.atletas && S.atletas.EJEMPLO, null, { timeout: 15000 });
  await page.evaluate(helper);
  let ok = 0, fail = 0;
  for (const [id, nivel, ap, rut, exp] of T) {
    const out = await page.evaluate(([n, a, r, o]) => window.__T(n, a, r, o), [nivel, ap, rut, exp]);
    const bad = check(out, exp);
    if (bad.length) { fail++; report(id, nivel, ap, out, bad); } else ok++;
  }
  console.log(`\nPruebas FIG: ${ok} pasan, ${fail} fallan (de ${T.length}).`);
  const ej = await page.evaluate(() => { const t = totals('EJEMPLO'); const o = {}; for (const [ap] of APS) o[ap] = { np: t[ap].np, nd: t[ap].nd || 0, avg: t[ap].avg ?? null, notes: t[ap].notes }; o.aa = t.aa; return o; });
  console.log('EJEMPLO:', JSON.stringify(Object.fromEntries(Object.entries(ej).map(([k, v]) => [k, typeof v === 'object' ? { np: v.np, nd: v.nd, avg: v.avg } : v]))));
  for (const [ap, v] of Object.entries(ej)) if (typeof v === 'object' && v.notes.length) console.log('  ' + ap + ': ' + v.notes.join(' | '));
  // Interfaz: rutina FIG de piso con líneas en celular, panel del elemento abierto, marcas y clics.
  await page.setViewportSize({ width: 390, height: 844 });
  const ui1 = await page.evaluate(() => {
    const rows = []; '3.106> 3.107> 5.502 1.304> 1.205 3.106> 3.107> 5.301 2.402 3.106> 3.107> 5.402:caida 1.310'.split(' ').forEach(tok => { const m = /^(.*?)([>~])?$/.exec(tok); const [n, f] = m[1].split(':'); const r = { k: 'F|PISO|' + n, n: nombreDe('F|PISO|' + n, 'FIG') }; if (f) r[f] = true; if (m[2]) r.c = true; rows.push(r); });
    S.atletas['Prueba FIG'] = { nivel: 'FIG', r: { SALTO: [{ k: 'F|SALTO|4.35', n: 'Amanar' }, { k: 'F|SALTO|5.33', n: 'Cheng' }], BARRAS: [{ k: 'F|BARRAS|3.405', n: 'Gienger', var: '1' }, { k: 'F|BARRAS|4.504', n: 'stalder 1½', bv: true, c: true }, { k: 'F|BARRAS|2.506', n: 'Hindorff' }, { k: 'F|BARRAS|6.406', n: 'doble extendido', ayu: '1' }], VIGA: [{ k: 'F|VIGA|2.202', n: 'split jump', lat: true, c: true }, { k: 'F|VIGA|5.202', n: 'flic', nr: true, c: true }, { k: 'F|VIGA|5.512', n: 'mortal extendido' }, { k: 'F|VIGA|6.405', n: 'doble atrás' }], PISO: rows }, cr: {}, sr: {}, cc: {}, p: {} };
    S.orden.push('Prueba FIG'); ui.atleta = 'Prueba FIG'; ui.view = 'athlete'; ui.ap = 'PISO'; ui.open = 2; render();
    const t = totals('Prueba FIG').PISO; return { np: t.np, nLin: t.nLin, dmt: t.dmt, html: !!document.querySelector('select[data-act=lin]') && !!document.querySelector('select[data-act=res]') };
  });
  console.log('UI piso:', JSON.stringify(ui1));
  await page.screenshot({ path: D + '/fig_cel_piso.png', fullPage: true });
  // Cambiar la marca "sin DV" desde el panel y la variante en barras
  const ui2 = await page.evaluate(() => {
    const s = document.querySelector('select[data-act=res]'); s.value = 'nv'; s.dispatchEvent(new Event('change', { bubbles: true }));
    const nv = S.atletas['Prueba FIG'].r.PISO[2].nv === true && !S.atletas['Prueba FIG'].r.PISO[2].caida;
    const l = document.querySelector('select[data-act=lin]'); l.value = '2'; l.dispatchEvent(new Event('change', { bubbles: true }));
    const lin = S.atletas['Prueba FIG'].p.lin.PISO;
    ui.ap = 'BARRAS'; ui.open = 0; render();
    const v = document.querySelector('select[data-act=var]'); const opts = v ? v.options.length : 0;
    v.value = ''; v.dispatchEvent(new Event('change', { bubbles: true }));
    return { nv, lin, varOpts: opts, varAfter: S.atletas['Prueba FIG'].r.BARRAS[0].var ?? null, barras: totals('Prueba FIG').BARRAS.np };
  });
  console.log('UI clics:', JSON.stringify(ui2));
  await page.evaluate(() => { ui.ap = 'SALTO'; ui.open = 1; render(); });
  await page.screenshot({ path: D + '/fig_cel_salto.png', fullPage: true });
  await page.evaluate(() => { ui.ap = 'VIGA'; ui.open = -1; render(); printAthlete('Prueba FIG'); });
  await page.emulateMedia({ media: 'print' });
  await page.screenshot({ path: D + '/fig_print.png', fullPage: true });
  await page.pdf({ path: D + '/fig_print.pdf' }).catch(() => { });
  const excel = await page.evaluate(() => { let rows = null; const w = window.XLSX; if (!w) return 'sin XLSX'; const orig = w.writeFile; w.writeFile = (wb) => { rows = w.utils.sheet_to_json(wb.Sheets.Rutinas, { header: 1 }).filter(r => r[0] === 'Prueba FIG').length; }; exportExcel(); w.writeFile = orig; return rows; });
  console.log('Excel filas Prueba FIG:', excel);
  console.log('Errores de consola:', errors.length ? errors : 'ninguno');
  await browser.close();
  process.exit(fail || errors.length ? 1 : 0);
}

(process.argv.includes('--node') ? enNode : enChromium)();
