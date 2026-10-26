// Rutinas reales (Mundial Yakarta 2025, finales por aparato). Sintaxis como pruebas/fig_test.js:
// ">" conectado directo con el siguiente; marcas ":var=", ":gir=", ":pos=", ":agr=", ":caida".
const GT1 = 'https://thegymter.net/2025/10/24/2025-world-championships-apparatus-finals-day-1-live-blog/';
const GT2 = 'https://thegymter.net/2025/10/25/2025-world-championships-apparatus-finals-day-2-live-blog/';
const GN = 'https://gymnastics-now.com/event-finals-live-jakarta-2025-worlds/';
const RES = 'https://thegymter.net/2025/10/26/2025-world-championships-results/';
const IX = 'https://www.theixsports.com/newsletter/jordyn-wieber-resigns/';
const C = 'Mundial 2025 Yakarta, final por aparato';
module.exports = [
  // ---------------- SALTO (D de cada salto; promedio de final = (D1+D2)/2 + bono 0.20 si hay) ----------------
  { id: 'VT1', gym: 'Angelina Melnikova (AIN)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '4.34 5.33', oficial: '5.0 / 5.6, bono +0.2', fuentes: [GT1, GN, RES] },
  { id: 'VT2', gym: 'Lia Monica Fontaine (CAN)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '4.34 5.31', oficial: '5.0 / 4.8, bono +0.2', fuentes: [GT1, GN, RES] },
  { id: 'VT3', gym: 'Joscelyn Roberson (USA)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '5.32 4.34', oficial: '5.2 / 5.0, bono +0.2', fuentes: [GT1, GN, RES] },
  { id: 'VT4', gym: 'Lisa Vaelen (BEL)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '2.33 3.32', oficial: '5.4 / 4.4, bono +0.2', fuentes: [GT1, GN, RES] },
  { id: 'VT5', gym: 'Karina Schönmaier (GER)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '5.33 4.34', oficial: '5.6 / 5.0, bono +0.2 (−2.0 ND en el 1.º por apoyo de una mano)', fuentes: [GT1, GN, RES] },
  { id: 'VT6', gym: 'Anna Kalmykova (AIN)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '2.33:caida 4.33', oficial: '5.4 / 4.6, sin bono (caída en el 1.º)', fuentes: [GT1, GN, RES] },
  { id: 'VT7', gym: 'Charlize Mörz (AUT)', comp: C + ' (24-oct-2025)', ap: 'SALTO', rut: '2.11 3.32', oficial: '3.8 / 4.4, bono +0.2 (1.º devaluado: intentó inversión mortal extendido ½, hizo agrupado ½)', fuentes: [GT1, GN, RES] },
  // ---------------- BARRAS ----------------
  { id: 'UB1', gym: 'Kaylia Nemour (ALG)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 7.1, esperado: 'DV 3.8 + CR 2.0 + CV 1.1 + DMT 0.2 = 7.1 (IX Sports: DV 3.8, CV 1.1)',
    rut: '4.507> 4.708> 3.404> 5.409> 4.404> 4.502:var=1> 3.407> 4.505 5.408> 6.406', fuentes: [GT1, IX, RES] },
  { id: 'UB2', gym: 'Angelina Melnikova (AIN)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 6.3, esperado: 'DV 3.5 + CR 2.0 + CV 0.6 + DMT 0.2 = 6.3',
    rut: '4.507> 4.508> 3.404> 5.509 4.407:gir=180> 3.408:var=2 5.408> 6.405', fuentes: [GT1, GN, RES] },
  { id: 'UB3', gym: 'Skye Blakely (USA)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 6.2, esperado: 'DV 3.6 + CR 2.0 + CV 0.4 + DMT 0.2 = 6.2',
    rut: '4.404> 5.510 4.602> 3.404 5.408> 5.509 5.308:gir=180> 3.206:agr=mix> 6.508', fuentes: [GT1, GN, RES] },
  { id: 'UB4', gym: 'Yang Fanyuwei (CHN)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 6.7, ambiguo: 'la "front pirouette" tras el cambio de agarre no se identifica (3.306 C, 3.506 E o 3.410/3.510 en L)',
    rut: '3.506> 3.708:var=1 4.602> 3.404 4.404> 5.509 5.408> 6.606', fuentes: [GT1, GN, RES] },
  { id: 'UB5', gym: 'Kate McDonald (AUS)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 6.0, ambiguo: 'Tkatchev extendido/abierto (D, Gymternet) o carpado (E, Gymnastics Now); Weiler ½ "un poco corto"',
    rut: '2.404:gir=180> 5.409> 2.405 3.403> 3.404 5.509 5.408> 6.606', fuentes: [GT1, GN, RES] },
  { id: 'UB6', gym: 'Naomi Visser (NED)', comp: C + ' (24-oct-2025)', ap: 'BARRAS', oficial: 6.2, ambiguo: 'Gymternet: Downie (F) a Pak; Gymnastics Now: "stalder Tkatchev carpado" (Downie). Perdió la conexión al Van Leeuwen',
    rut: '4.602> 3.404 5.409> 2.305:gir=180> 3.407 4.404 5.509 5.408> 6.606', fuentes: [GT1, GN, RES] },
  // ---------------- VIGA ----------------
  { id: 'BB1', gym: 'Aiko Sugihara (JPN)', comp: C + ' (25-oct-2025)', ap: 'VIGA', oficial: 6.0, esperado: 'DV 3.2 + CR 2.0 + CV 0.4 + SB 0.2 + DMT 0.2 = 6.0',
    rut: '1.401> 2.408:var=1> 5.207 5.409> 2.202> 2.203 5.202> 5.312:pos=s 3.305 5.408 2.505 6.505', fuentes: [GT2, GN, RES] },
  { id: 'BB2', gym: 'Flavia Saraiva (BRA)', comp: C + ' (25-oct-2025)', ap: 'VIGA', oficial: 5.7, esperado: 'DV 3.1 + CR 2.0 + CV 0.3 + SB 0.1 + DMT 0.2 = 5.7',
    rut: '1.417 3.101 5.202> 5.312:pos=s 2.505 5.409> 2.408> 5.202 5.411 2.101> 2.202 6.505', fuentes: [GT2, GN, RES] },
  { id: 'BB3', gym: 'Ellie Black (CAN)', comp: C + ' (25-oct-2025)', ap: 'VIGA', oficial: 5.8, esperado: 'DV 3.1 + CR 2.0 + CV 0.4 + SB 0.1 + DMT 0.2 = 5.8',
    rut: '1.401> 2.405> 5.207 3.401> 3.101 2.203> 2.112 5.410 4.108:var=1> 5.202> 5.512 5.411 6.404', fuentes: [GT2, GN, RES] },
  { id: 'BB4', gym: 'Kaylia Nemour (ALG)', comp: C + ' (25-oct-2025)', ap: 'VIGA', oficial: 6.2, ambiguo: 'entrada: Gymternet "layout stepout mount" (1.518, E) vs Gymnastics Now "roundoff layout" (1.618 variante extendido a dos pies, F); con E la cuenta da 6.1',
    rut: '1.618:var=1> 5.312:pos=s 5.202> 5.202> 5.512 5.409> 2.202> 2.203 2.305> 2.405 5.408 3.207 6.505', fuentes: [GT2, GN, RES] },
  { id: 'BB5', gym: 'Zhang Qingying (CHN)', comp: C + ' (25-oct-2025)', ap: 'VIGA', oficial: 6.9, ambiguo: '"switch half/switch side ¼" (aquí Johnson 2.306), "straddle ¾" (aquí 2.303 C), "roundoff layout" vs "layout series"',
    rut: '1.401> 2.405> 5.207 5.208> 5.512> 2.202 2.505> 5.202 2.306> 2.203> 5.405:var=1 2.305> 2.302> 2.303 3.101 6.505', fuentes: [GT2, GN, RES] },
  // ---------------- SUELO ----------------
  { id: 'FX1', gym: 'Aiko Sugihara (JPN)', comp: C + ' (25-oct-2025)', ap: 'PISO', oficial: 5.8, esperado: 'DV 3.2 + CR 2.0 + CV 0.4 + DMT 0.2 = 5.8',
    rut: '2.402 3.106> 3.107> 5.603 3.106> 3.107> 5.301:gir=540> 3.106> 3.107> 5.402 1.305> 1.302 2.403 3.106> 3.107> 5.401> 4.202 3.106> 3.107> 5.402:var=1', fuentes: [GT2, GN, RES] },
  { id: 'FX2', gym: 'Ruby Evans (GBR)', comp: C + ' (25-oct-2025)', ap: 'PISO', oficial: 5.9, esperado: 'DV 3.3 + CR 2.0 + CV 0.4 + DMT 0.2 = 5.9',
    rut: '3.105> 4.202> 4.502 3.105> 4.302:gir=360> 4.402 1.302> 1.404 3.106> 3.107> 5.603 2.407 3.106> 3.107> 5.402', fuentes: [GT2, RES] },
  { id: 'FX3', gym: 'Sabrina Voinea (ROU)', comp: C + ' (25-oct-2025)', ap: 'PISO', oficial: 5.9, esperado: 'DV 3.3 + CR 2.0 + CV 0.4 + DMT 0.2 = 5.9',
    rut: '1.307 3.106> 3.107> 5.104> 5.603> 4.101 3.106> 3.107> 5.802 1.404 3.106> 3.107> 5.502 2.201 1.205> 1.302', fuentes: [GT2, GN, RES] },
  { id: 'FX4', gym: 'Rina Kishi (JPN)', comp: C + ' (25-oct-2025)', ap: 'PISO', oficial: 5.8, ambiguo: 'la serie de saltos solo se describe como "leap series ... switch ring half" (se supone switch leap > Sankova)',
    rut: '3.106> 3.107> 5.802 3.105> 4.202> 4.402 2.507> 2.403 3.106> 3.107> 5.401 1.205> 1.405 3.106> 3.107> 5.402:var=1', fuentes: [GT2, GN, RES] },
  // ---------------- Variantes de comprobación (no son rutinas nuevas) ----------------
  { id: 'UB2b', alt: true, gym: 'Melnikova UB: Jaeger marcado en agarre cubital (agr=inv)', ap: 'BARRAS', oficial: 6.3, rut: '4.507> 4.508> 3.404> 5.509 4.407:gir=180> 3.408:var=2:agr=inv 5.408> 6.405' },
  { id: 'UB3b', alt: true, gym: 'Blakely UB: salida Pentek (6.608 F) en vez de Arai', ap: 'BARRAS', oficial: 6.2, rut: '4.404> 5.510 4.602> 3.404 5.408> 5.509 5.308:gir=180> 3.206:agr=mix> 6.608' },
  { id: 'UB4b', alt: true, gym: 'Yang UB: pirueta sin conexión al Yang', ap: 'BARRAS', oficial: 6.7, rut: '3.506 3.708:var=1 4.602> 3.404 4.404> 5.509 5.408> 6.606' },
  { id: 'UB5b', alt: true, gym: 'McDonald UB: Weiler ½ en cubital (agr=inv)', ap: 'BARRAS', oficial: 6.0, rut: '2.404:gir=180:agr=inv> 5.409> 2.405 3.403> 3.404 5.509 5.408> 6.606' },
  { id: 'BB3b', alt: true, gym: 'Black BB: giros 2/1 y 1/1 sin conexión', ap: 'VIGA', oficial: 5.8, rut: '1.401> 2.405> 5.207 3.401 3.101 2.203> 2.112 5.410 4.108:var=1> 5.202> 5.512 5.411 6.404' },
  { id: 'BB4b', alt: true, gym: 'Nemour BB: entrada 1.518 (mortal extendido con paso, E)', ap: 'VIGA', oficial: 6.2, rut: '1.518:pos=s> 5.312:pos=s 5.202> 5.202> 5.512 5.409> 2.202> 2.203 2.305> 2.405 5.408 3.207 6.505' },
  { id: 'FX4b', alt: true, gym: 'Kishi FX: Mitchell corto → 2/1 en cuclillas (2.407 D) y sin conexión al Memmel', ap: 'PISO', oficial: 5.8, rut: '3.106> 3.107> 5.802 3.105> 4.202> 4.402 2.407 2.403 3.106> 3.107> 5.401 1.205> 1.405 3.106> 3.107> 5.402:var=1' },
];
