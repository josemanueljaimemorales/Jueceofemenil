// Pruebas de las reglas USAG (REGLAS_USAG.md) contra el editor real (app/editor.js) en Chromium.
// Uso: servidor estático en :8790 sirviendo /home/user/jueceofemenil; NODE_PATH=$(npm root -g) node usag_test.js
const { chromium } = require('playwright');
const BASE = 'http://localhost:8790/app/';
const SHOT = __dirname + '/usag_cel.png';

// Rutina: grupos separados por "," o ";"; dentro de un grupo "+" = conexión directa, " ind " = indirecta.
// Elemento: número USAG con marcas opcionales ":var=ext", ":spot=L", ":inc", ":caida", ":l=C", ":nf=9.1", ":void".
const T = [
  // ---- Generales ----
  ['G-04', 'N9', 'BARRAS', '1.101, 2.201, 3.301, 2.205, 7.101, 2.102, 3.405, 8.203', { cc: { d: false } }, { np: 9.60, vpDed: 0, dvb: 0.10 }],
  ['G-07.1', 'N9', 'PISO', '8.101, 5.105+5.106+8.101, 8.101', {}, { cred: { 0: true, 3: true, 4: false } }],
  ['G-07.2', 'N10', 'VIGA', '7.208+7.208+8.404, 2.201, 7.208+8.404', {}, { cred: { 0: true, 1: true, 2: true, 4: false, 5: false } }],
  ['G-07.2b', 'N10', 'VIGA', '7.208+7.208+8.404, 2.201, 7.208+8.404', {}, { lk: { 4: 0 } }],
  ['G-07.3', 'N10', 'BARRAS', '4.202+4.405, 2.201, 4.405', {}, { cred: { 1: true, 3: true }, dvb: 0.10 }],
  ['G-08.1', 'N8', 'BARRAS', '1.101, 2.201, 7.101, 8.103', {}, { nd: 2 }],
  ['G-08.2', 'N6', 'VIGA', '1.104, 2.201, 3.101, 7.104+7.104, 2.207, 2.110, 9.106', { dur: 28 }, { np: 10, nd: 0.5 }],
  ['G-09', 'N7', 'BARRAS', '1.101, 7.103, 2.201, 3.304, 6.304, 7.101', {}, { np: 9.40 }],
  ['G-10.1', 'N10', 'PISO', '5.105+5.106+8.503 ind 5.106+8.201, 6.101+6.401, 1.304+1.407, 2.301, 5.105+5.106+8.301:inc', {}, { cred: { 12: false }, sr: { s4: false } }],
  ['G-10.2', 'N9', 'VIGA', '1.104, 2.305+2.307, 2.201, 3.101, 7.208+8.404, 8.303, 7.104, 9.206:spot=L', {}, { cred: { 9: true }, sr: { s4: true } }],
  ['G-11.1', 'N9', 'VIGA', '1.104, 2.305+2.307, 2.201, 3.101, 7.208+8.404, 8.303, 7.104, 9.306', {}, { bon: 0.30, np: 10 }],
  ['G-11.2', 'N9', 'BARRAS', '3.405, 1.101, 7.409', {}, { dvb: 0.10, restDed: 0 }],
  ['G-12.1', 'N10', 'PISO', '5.105+5.106+8.301 ind 5.106+8.301, 6.301+6.201, 1.304+1.311, 2.301, 5.105+5.106+6.301', { cc: { a2: true } }, { cv: 0.50, dvb: 0, bon: 0.40, np: 9.90 }],
  ['G-12.2', 'N10', 'VIGA', '1.104, 3.101, 7.104+7.508, 8.404, 2.110, 2.305+2.307+9.306', {}, { cc: 0.30, cv: 0.20, dvb: 0.30, bon: 0.50, np: 10, extra: 0 }],
  ['G-13.1', 'N10', 'PISO', '5.105+5.106+8.403 ind 5.106+8.301, 6.101+6.301, 1.304+1.311, 2.301, 5.105+5.106+6.501', {}, { cc: 0.30, cv: 0.40, dvb: 0.30, np: 10, extra: 0 }],
  ['G-13.2', 'N10', 'PISO', '5.105+5.106+8.403 ind 5.106+8.301, 6.101+6.301, 1.304+1.311, 2.301, 5.105+5.106+8.503', {}, { np: 10, extra: 0.10 }],
  // ---- Salto ----
  ['VT-01.1', 'N8', 'SALTO', '4.203, 4.101', {}, { np: 10 }],
  ['VT-01.2', 'N9', 'SALTO', '1.301:nf=8.6, 4.203:nf=9.1', {}, { np: 9.60 }],
  ['VT-02.1', 'N9', 'SALTO', '4.305', {}, { np: 10 }],
  ['VT-02.2', 'N8', 'SALTO', '4.305', {}, { np: 0 }],
  ['VT-03.1', 'N8', 'SALTO', '4.203, 4.305', {}, { np: 0 }],
  ['VT-03.2', 'N10', 'SALTO', '4.305, 9.999', {}, { np: 9.70 }],
  ['VT-03.3', 'N6', 'SALTO', '1.111, 1.101', {}, { np: 0 }],
  ['VT-04.1', 'N10', 'SALTO', '3.404', {}, { np: 10.10 }],
  ['VT-04.2', 'N10', 'SALTO', '4.306', {}, { np: 10 }],
  ['VT-04.3', 'N10', 'SALTO', '3.404:spot=aterrizaje', {}, { np: 10 }],
  ['VT-05.1', 'N9', 'SALTO', '4.203:spot=durante, 1.101', {}, { np: 8.5 }],
  ['VT-05.2', 'N8', 'SALTO', '4.203:spot=vuelo2', {}, { np: 10, enote: /−1\.00/ }],
  ['VT-06', 'N10', 'SALTO', '3.404:void, 4.305', {}, { np: 9.70 }],
  // ---- Barras ----
  ['UB-6.1', 'N6', 'BARRAS', '1.101, 2.201, 3.304, 7.103:var=cb, 7.101, 8.103', {}, { np: 10 }],
  ['UB-6.2', 'N6', 'BARRAS', '1.101, 2.201, 3.304, 7.103:var=cb, 7.101, 8.103, 6.304', {}, { np: 9.50 }],
  ['UB-6.3', 'N6', 'BARRAS', '1.101, 2.201, 4.303, 7.103:var=cb, 7.101, 8.103', {}, { np: 8.70 }],
  ['UB-6-SR1', 'N6', 'BARRAS', '1.101, 3.304, 7.103:var=cb, 7.101, 4.202, 8.103', {}, { sr: { s1: false } }],
  ['UB-6-SR2', 'N6', 'BARRAS', '1.101, 2.201, 3.304, 7.101, 8.103', {}, { sr: { s2: false } }],
  ['UB-6-SR3', 'N6', 'BARRAS', '1.101, 2.201, 7.101, 8.103', {}, { sr: { s3: false } }],
  ['UB-6-SR4', 'N6', 'BARRAS', '1.101, 2.201, 3.304, 7.103:var=cb, 7.101, 8.208', {}, { np: 9.50, sr: { s4: false } }],
  ['UB-6-L6vuelo', 'N6', 'BARRAS', '1.101, 2.201, 3.304, 7.103:var=cb, 7.101, 4.204, 8.103', {}, { restDed: 0.50 }],
  ['UB-7.1', 'N7', 'BARRAS', '1.101, 7.103, 2.201, 3.304, 6.304, 7.101, 8.103', {}, { np: 10 }],
  ['UB-7.2', 'N7', 'BARRAS', '1.101, 7.103, 2.201, 3.304, 4.303, 7.101, 8.103', {}, { np: 8.70 }],
  ['UB-7.3', 'N7', 'BARRAS', '1.101, 7.103, 2.201, 3.304, 3.405, 7.101, 8.103', {}, { np: 8.70 }],
  ['UB-7-SR2/3.1', 'N7', 'BARRAS', '3.304, 6.304', {}, { sr: { s2a: true, s2b: true } }],
  ['UB-7-SR2/3.2', 'N7', 'BARRAS', '3.304', {}, { sr: { s2a: true, s2b: false } }],
  ['UB-7-SR2/3.3', 'N7', 'BARRAS', '4.202, 6.104', {}, { sr: { s2a: true, s2b: true } }],
  ['UB-7-cast½', 'N7', 'BARRAS', '2.201:var=m', {}, { vl: { 0: 'B' }, restDed: 0 }],
  ['UB-8-CC.1', 'N8', 'BARRAS', '1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 8.203', {}, { np: 10, cc: 0.20 }],
  ['UB-8-CC.2', 'N8', 'BARRAS', '1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 8.103', {}, { np: 9.90 }],
  ['UB-8-CC.3', 'N8', 'BARRAS', '1.101, 2.201, 3.304, 4.204, 6.104, 7.101, 7.103, 4.202+8.103', { cc: {} }, { ccIds: { s: true } }],
  ['UB-8-CC.3b', 'N8', 'BARRAS', '1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 4.202+8.103', {}, { np: 10 }],
  ['UB-8-R.1', 'N8', 'BARRAS', '1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 4.303, 8.203', {}, { restDed: 0, np: 10 }],
  ['UB-8-R.2', 'N8', 'BARRAS', '1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 4.303, 5.302, 8.203', {}, { restDed: 0.50 }],
  ['UB-8-SR2/3.1', 'N8', 'BARRAS', '4.204, 3.304', {}, { sr: { s2a: true, s2b: true } }],
  ['UB-8-SR2/3.2', 'N8', 'BARRAS', '3.304, 6.204', {}, { sr: { s2a: false, s2b: true } }],
  ['UB-8-SR2/3.3', 'N8', 'BARRAS', '3.205, 6.204', {}, { sr: { s2a: true, s2b: true } }],
  ['UB-9-R.1', 'N9', 'BARRAS', '6.304+3.405, 4.405, 5.405', {}, { restDed: 0.50, dvb: 0.10, rest: { 3: true }, tol: { 2: true } }],
  ['UB-9-R.2', 'N9', 'BARRAS', '3.405, 7.409, 4.405', {}, { restDed: 0 }],
  ['UB-9-SR1', 'N9', 'BARRAS', '3.301', {}, { sr: { s1: false } }],
  ['UB-9-CV.1', 'N9', 'BARRAS', '6.304+6.304', {}, { cv: 0 }],
  ['UB-9-CV.2', 'N9', 'BARRAS', '6.304+3.304', {}, { cv: 0.10 }],
  ['UB-9-CV.3', 'N9', 'BARRAS', '4.303+4.405', {}, { cv: 0.20 }],
  ['UB-9-CC.1', 'N9', 'BARRAS', '1.101, 2.201, 3.304, 3.301, 4.202, 4.405, 2.205, 2.102, 7.101, 8.203', {}, { np: 9.70, cc: 0.10, dvb: 0.10, srDed: 0 }],
  ['UB-9-CC.2', 'N9', 'BARRAS', '1.101, 2.201, 3.304, 6.304+3.405, 3.301, 4.202, 4.405, 2.205, 2.102, 7.101, 8.203', {}, { np: 9.80, cv: 0.10, dvb: 0.10, dvAt: 4 }],
  ['UB-10-CV.1', 'N10', 'BARRAS', '4.406+3.304', {}, { cv: 0.20 }],
  ['UB-10-CV.2', 'N10', 'BARRAS', '3.304+4.406', {}, { cv: 0.10 }],
  ['UB-10-CV.3', 'N10', 'BARRAS', '6.304+3.304', {}, { cv: 0.10 }],
  ['UB-10-CV.4', 'N10', 'BARRAS', '6.304+6.304', {}, { cv: 0 }],
  ['UB-10-CV.5', 'N10', 'BARRAS', '4.303+2.305', {}, { cv: 0.10 }],
  ['UB-10-CV.6', 'N10', 'BARRAS', '5.402+4.405', {}, { cv: 0.20 }],
  ['UB-10.full', 'N10', 'BARRAS', '1.101, 2.201, 6.304, 3.301, 4.303+4.405, 4.202+4.406+3.304, 2.102, 4.202+8.403', {}, { np: 10, extra: 0.10, cvRaw: 0.30, dvb: 0.30, cc: 0.30, srDed: 0 }],
  ['UB-10.var', 'N10', 'BARRAS', '1.101, 2.201, 6.304, 3.301, 4.303+4.405, 4.202+4.406, 2.102, 4.202+8.403', {}, { np: 9.90, extra: 0, bon: 0.40 }],
  // ---- Viga ----
  ['BB-G-1', 'N6', 'VIGA', '1.305, 2.305', {}, { restDed: 0.50, rest: { 1: true } }],
  ['BB-SR2.1', 'N8', 'VIGA', '2.201', {}, { sr: { s2: true } }],
  ['BB-SR2.2', 'N8', 'VIGA', '2.101', {}, { sr: { s2: false } }],
  ['BB-SR3', 'N8', 'VIGA', '3.305', {}, { sr: { s3: false } }],
  ['BB-SR4.1', 'N7', 'VIGA', '2.201, 9.101', {}, { sr: { s4: false } }],
  ['BB-SR4.2', 'N10', 'VIGA', '7.403+7.208+9.206', {}, { sr: { s4: true } }],
  ['BB-SR4.3', 'N10', 'VIGA', '2.305+9.208', {}, { sr: { s4: true } }],
  ['BB-6-R', 'N6', 'VIGA', '2.305, 2.307, 8.303', {}, { restDed: 1.00 }],
  ['BB-6-SR1.1', 'N6', 'VIGA', '7.104+7.104', {}, { sr: { s1: true } }],
  ['BB-6-SR1.2', 'N6', 'VIGA', '7.208', {}, { sr: { s1: true } }],
  ['BB-6-SR1.3', 'N6', 'VIGA', '6.104+6.104', {}, { sr: { s1: false } }],
  ['BB-6.1', 'N6', 'VIGA', '1.104, 2.201, 3.101, 7.104+7.104, 2.207, 2.110, 9.106', {}, { np: 10 }],
  ['BB-6.2', 'N6', 'VIGA', '1.104, 2.201, 3.101, 7.104+7.104, 2.207, 2.110, 8.303, 9.106', {}, { np: 9.50 }],
  ['BB-7-SR1.1', 'N7', 'VIGA', '7.104+7.104, 7.208', {}, { sr: { s1: true } }],
  ['BB-7-SR1.2', 'N7', 'VIGA', '7.104+7.104', {}, { sr: { s1: false } }],
  ['BB-7-SR1.3', 'N7', 'VIGA', '7.208+7.208', {}, { sr: { s1: true } }],
  ['BB-7', 'N7', 'VIGA', '1.104, 2.201, 2.305, 3.101, 7.104+7.208, 2.110, 9.106', {}, { np: 10 }],
  ['BB-8-R.1', 'N8', 'VIGA', '8.303', {}, { vl: { 0: 'B' }, restDed: 0 }],
  ['BB-8-R.2', 'N8', 'VIGA', '8.303, 8.304', {}, { restDed: 0.50 }],
  ['BB-8-R.3', 'N8', 'VIGA', '2.401', {}, { restDed: 0.50 }],
  ['BB-8-SR1', 'N8', 'VIGA', '7.104+7.208', {}, { sr: { s1: true } }],
  ['BB-8-CC.1', 'N8', 'VIGA', '1.104, 2.201, 2.207, 3.101, 7.104, 7.208+7.208, 2.110, 9.206', {}, { np: 10, cc: 0.20 }],
  ['BB-8-CC.2', 'N8', 'VIGA', '1.104, 2.201, 2.207, 3.101, 7.104, 7.208+7.208, 2.110, 9.106', {}, { np: 9.90 }],
  ['BB-8-CC.3', 'N8', 'VIGA', '1.104, 2.201, 2.207, 3.101, 7.104, 2.110, 7.208+7.208+9.106', {}, { np: 10 }],
  ['BB-9-R.1', 'N9', 'VIGA', '8.404', {}, { vl: { 0: 'C' }, dvb: 0.10 }],
  ['BB-9-R.2', 'N9', 'VIGA', '8.404, 9.406', {}, { restDed: 0.50, sr: { s4: false } }],
  ['BB-9-SR1.1', 'N9', 'VIGA', '7.104+7.208', {}, { sr: { s1: false } }],
  ['BB-9-SR1.2', 'N9', 'VIGA', '7.208+7.208', {}, { sr: { s1: true } }],
  ['BB-CV.1', 'N9', 'VIGA', '7.208+8.404', {}, { cv: 0.10 }],
  ['BB-CV.2', 'N10', 'VIGA', '7.208+7.308', {}, { cv: 0 }],
  ['BB-CV.3', 'N10', 'VIGA', '7.208+7.208+8.404', {}, { cv: 0.30 }],
  ['BB-CV.4', 'N10', 'VIGA', '2.305+2.402', {}, { cv: 0.20 }],
  ['BB-CV.5', 'N10', 'VIGA', '3.101+3.303', {}, { cv: 0.10 }],
  ['BB-CV.flight', 'N10', 'VIGA', '7.208+7.503', {}, { cv: 0.20 }],
  ['BB-9-CC', 'N9', 'VIGA', '1.104, 2.305+2.307, 2.201, 3.101, 7.208+8.404, 8.303, 7.104, 9.306', {}, { np: 10, cc: 0.20, cvRaw: 0.30, dvb: 0.10, bon: 0.30 }],
  ['BB-10-SR1.1', 'N10', 'VIGA', '7.208+7.208', {}, { sr: { s1: false } }],
  ['BB-10-SR1.2', 'N10', 'VIGA', '7.104+7.508', {}, { sr: { s1: true } }],
  ['BB-10.1', 'N10', 'VIGA', '1.104, 2.305+2.402, 3.406, 7.208+7.208+8.404, 7.403, 7.104, 2.110, 9.406', {}, { np: 10, cvRaw: 0.50, dvb: 0.50, cc: 0.30, extra: 0, srDed: 0 }],
  ['BB-10.2', 'N10', 'VIGA', '1.104, 2.305+2.402, 3.406, 7.208+7.208+8.404, 7.503, 7.104, 2.110, 9.406', {}, { np: 10, extra: 0.10 }],
  // ---- Piso ----
  ['FX-SR3.1', 'N8', 'PISO', '1.204+1.110', {}, { sr: { s3: true } }],
  ['FX-SR3.2', 'N8', 'PISO', '1.116+1.207', {}, { sr: { s3: false } }],
  ['FX-SR3.3', 'N8', 'PISO', '1.101+1.101', {}, { sr: { s3: false } }],
  ['FX-6-SR1', 'N6', 'PISO', '5.105+5.106+8.101', {}, { sr: { s1: true } }],
  ['FX-6-SR2.1', 'N6', 'PISO', '5.105+5.106+8.101, 5.102+6.101', {}, { sr: { s1: true, s2: true } }],
  ['FX-6-SR2.2', 'N6', 'PISO', '5.105+5.106+8.101, 5.105+5.106+8.101', {}, { sr: { s2: false } }],
  ['FX-6-SR2.3', 'N6', 'PISO', '5.105+5.106+8.101, 6.201', {}, { sr: { s2: true } }],
  ['FX-6.1', 'N6', 'PISO', '5.105+5.106+8.101, 5.102+6.101, 1.204+1.110, 1.209, 2.101', {}, { np: 10 }],
  ['FX-6.2', 'N6', 'PISO', '5.105+5.106+8.101, 5.102+6.101, 1.204+1.110, 1.209, 2.101, 8.301', {}, { np: 9.50 }],
  ['FX-7-SR.1', 'N7', 'PISO', '5.105+5.106+8.101:var=ext, 5.102+6.101', {}, { sr: { s1a: true, s1b: true, s1c: true } }],
  ['FX-7-SR.2', 'N7', 'PISO', '5.105+5.106+8.101, 5.102+6.101', {}, { sr: { s1c: false } }],
  ['FX-7', 'N7', 'PISO', '5.105+5.106+8.101:var=ext, 5.102+6.101, 1.204+1.110, 1.304, 1.209, 2.101', {}, { np: 10 }],
  ['FX-7.sin', 'N7', 'PISO', '5.105+5.106+8.101, 5.102+6.101, 1.204+1.110, 1.304, 1.209, 2.101', {}, { np: 9.50 }],
  ['FX-SR1.1', 'N8', 'PISO', '5.105+5.106+8.201 ind 5.106+8.101', {}, { sr: { s1: true } }],
  ['FX-SR1.2', 'N10', 'PISO', '5.105+5.106+8.403+1.207+6.101', {}, { sr: { s1: false } }],
  ['FX-SR2', 'N8', 'PISO', '8.101, 8.101, 6.101', {}, { sr: { s2: false } }],
  ['FX-SR4.1', 'N9', 'PISO', '1.204, 5.105+5.106+8.201', {}, { sr: { s4: true } }],
  ['FX-SR4.2', 'N10', 'PISO', '1.204, 5.105+5.106+8.201', {}, { sr: { s4: false } }],
  ['FX-SR4.3', 'N9', 'PISO', '8.403, 5.105+5.106+8.401', {}, { sr: { s4: false }, restDed: 0.50 }],
  ['FX-8-CC', 'N8', 'PISO', '5.105+5.106+8.201 ind 5.106+8.101, 6.201+6.101, 1.204+1.207, 2.201, 5.105+8.101', {}, { np: 10, cc: 0.20, srDed: 0 }],
  ['FX-8-CC.mismo', 'N8', 'PISO', '5.105+5.106+8.201 ind 5.106+8.101, 6.201+6.101, 1.204+1.207, 2.201, 5.105+5.106+8.101', {}, { sr: { s4: false } }],
  ['FX-CV.1', 'N9', 'PISO', '6.101+6.301', {}, { cv: 0.10 }],
  ['FX-CV.2', 'N9', 'PISO', '8.301 ind 8.403', {}, { cv: 0.20 }],
  ['FX-CV.3', 'N10', 'PISO', '8.403+1.110', {}, { cv: 0.10 }],
  ['FX-CV.4', 'N10', 'PISO', '2.301+1.304', {}, { cv: 0 }],
  ['FX-CV.5', 'N10', 'PISO', '8.102+8.102+8.403', {}, { cv: 0.20 }],
  ['FX-9-CC', 'N9', 'PISO', '5.105+5.106+8.301 ind 5.106+8.403, 6.101+6.301, 1.304+1.311, 8.201, 2.201, 5.105+5.106+8.201', {}, { np: 10, cvRaw: 0.40, dvb: 0.10, bon: 0.30, cc: 0.20, srDed: 0 }],
  ['FX-10-CC.1', 'N10', 'PISO', '8.403, 6.401, 8.301', {}, { ccIds: { a2: true } }],
  ['FX-10-CC.2', 'N10', 'PISO', '8.503, 8.301', {}, { ccIds: { a2: false, a1: true } }],
  ['FX-10-CC.3', 'N10', 'PISO', '1.407+1.304', {}, { ccIds: { z: true } }],
  ['FX-10.1', 'N10', 'PISO', '5.105+5.106+8.503 ind 5.106+8.301, 6.101+6.401, 1.304+1.407, 2.301, 5.105+5.106+8.403', {}, { np: 10, extra: 0.10, cvRaw: 0.60, dvb: 0.50, cc: 0.30, srDed: 0 }],
  ['FX-10.2', 'N10', 'PISO', '5.105+5.106+6.501 ind 5.106+8.301, 6.101+6.401, 1.304+1.407, 2.301, 5.105+5.106+8.403', {}, { np: 10, extra: 0 }],
];

function helper() {
  window.__T = (nivel, ap, rut, opts) => {
    const rows = [];
    String(rut).split(/[,;]/).map(s => s.trim()).filter(Boolean).forEach(g => {
      const parts = g.split(/(\+| ind )/);
      for (let j = 0; j < parts.length; j += 2) {
        const [n, ...fl] = parts[j].trim().split(':');
        const r = { k: ap === 'SALTO' ? 'V|' + n : 'U|' + ap + '|' + n, n };
        fl.forEach(f => { const [kk, vv] = f.split('='); r[kk] = vv === undefined ? true : (kk === 'nf' ? +vv : vv); });
        const sep = parts[j + 1];
        if (sep) { r.c = true; if (sep === ' ind ') r.ind = true; }
        rows.push(r);
      }
    });
    const a = { nivel, r: { SALTO: [], BARRAS: [], VIGA: [], PISO: [] }, cr: {}, sr: { [ap]: opts.sr || {} }, cc: { [ap]: opts.cc || {} }, p: opts.dur ? { dur: { [ap]: opts.dur } } : {} };
    a.r[ap] = rows;
    const res = compute(a, ap);
    const pick = o => o ? { n: o.n, l: o.l, vl: o.vl, cred: o.cred, rest: o.rest, tol: o.tol, rep: o.rep, dvb: o.dvb } : null;
    return {
      np: res.np, vpDed: res.vpDed, srDed: res.srDed, restDed: res.restDed, cc: res.cc, cv: res.cv, cvRaw: res.cvRaw, dvb: res.dvb, bon: res.bon, extra: res.extra || 0, nd: res.nd || 0,
      sr: Object.fromEntries((res.srDet || []).map(s => [s.id, s.hit])), srMiss: (res.srDet || []).filter(s => !s.hit).length,
      ccIds: Object.fromEntries((res.ccDet || []).map(s => [s.id, s.hit])), items: (res.items || []).map(pick), lk: res.pot || {},
      notes: res.notes, enotes: res.enotes || [], vaults: (res.vaults || []).map(v => ({ v: v.v, void: v.void })),
    };
  };
}

const near = (a, b) => Math.abs((a || 0) - b) < 1e-6;
function check(out, exp) {
  const bad = [];
  for (const [k, v] of Object.entries(exp)) {
    if (['np', 'vpDed', 'srDed', 'restDed', 'cc', 'cv', 'cvRaw', 'dvb', 'bon', 'extra', 'nd', 'srMiss'].includes(k)) { if (!near(out[k], v)) bad.push(`${k}=${out[k]} (esperado ${v})`); }
    else if (k === 'sr' || k === 'ccIds') { for (const [id, b] of Object.entries(v)) if (!!out[k][id] !== b) bad.push(`${k}.${id}=${out[k][id]} (esperado ${b})`); }
    else if (['cred', 'rest', 'tol', 'vl'].includes(k)) { for (const [i, b] of Object.entries(v)) { const it = out.items[i]; const got = it ? (k === 'vl' ? it.vl : !!it[k]) : undefined; if (got !== b) bad.push(`#${+i + 1}.${k}=${got} (esperado ${b})`); } }
    else if (k === 'lk') { for (const [i, b] of Object.entries(v)) if (!near(out.lk[i], b)) bad.push(`link ${i}=${out.lk[i]} (esperado ${b})`); }
    else if (k === 'dvAt') { const it = out.items[v]; if (!it || !it.dvb) bad.push(`DV no está en #${v + 1}`); }
    else if (k === 'enote') { if (!out.enotes.some(n => v.test(n))) bad.push('falta aviso ' + v); }
  }
  return bad;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(BASE);
  await page.waitForFunction(() => typeof S !== 'undefined' && USR && USR.listas && S.atletas && S.atletas.EJEMPLO, null, { timeout: 15000 });
  await page.evaluate(helper);
  let ok = 0, fail = 0;
  for (const [id, nivel, ap, rut, opts, exp] of T) {
    const out = await page.evaluate(([n, a, r, o]) => window.__T(n, a, r, o), [nivel, ap, rut, opts]);
    const bad = check(out, exp);
    if (bad.length) { fail++; console.log(`FALLA ${id} (${nivel} ${ap}): ${bad.join('; ')}\n   avisos: ${out.notes.join(' | ')}\n   items: ${JSON.stringify(out.items)}`); }
    else ok++;
  }
  console.log(`\nPruebas USAG: ${ok} pasan, ${fail} fallan (de ${T.length}).`);
  // Regresión FIG: rutina EJEMPLO (Salto 5.40, Barras 3.80, Viga 4.20, Piso 5.30)
  const fig = await page.evaluate(() => { const t = totals('EJEMPLO'); return { SALTO: t.SALTO.np, BARRAS: t.BARRAS.np, VIGA: t.VIGA.np, PISO: t.PISO.np }; });
  const figExp = { SALTO: 5.4, BARRAS: 3.8, VIGA: 4.2, PISO: 5.3 };   // PISO con líneas acrobáticas (reglas FIG nuevas)
  const figBad = Object.entries(figExp).filter(([k, v]) => !near(fig[k], v));
  console.log('Regresión FIG EJEMPLO:', JSON.stringify(fig), figBad.length ? 'FALLA' : 'OK');
  // Interfaz: rutina N10 de piso en celular, abrir el panel del último elemento.
  await page.evaluate(() => {
    S.atletas['Prueba N10'] = { nivel: 'N10', r: { SALTO: [{ k: 'V|3.404', n: 'Tsuk 1/1' }, { k: 'V|4.305', n: 'Yurchenko', spot: 'aterrizaje' }], BARRAS: [], VIGA: [], PISO: [] }, cr: {}, sr: {}, cc: {}, p: {} };
    const rows = []; '5.105+5.106+8.503 ind 5.106+8.301, 6.101+6.401, 1.304+1.407, 2.301, 5.105+5.106+8.403'.split(',').forEach(g => { const p = g.trim().split(/(\+| ind )/); for (let j = 0; j < p.length; j += 2) { const r = { k: 'U|PISO|' + p[j].trim(), n: nombreDe('U|PISO|' + p[j].trim(), 'N10') }; if (p[j + 1]) { r.c = true; if (p[j + 1] === ' ind ') r.ind = true; } rows.push(r); } });
    rows[rows.length - 1].caida = true;
    S.atletas['Prueba N10'].r.PISO = rows; S.orden.push('Prueba N10'); ui.atleta = 'Prueba N10'; ui.view = 'athlete'; ui.ap = 'PISO'; ui.open = rows.length - 1; render();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: SHOT, fullPage: true });
  // Clics de la interfaz: desmarcar un SR detectado, volver a automático, cambiar flag de una fila
  const ui1 = await page.evaluate(() => { const b = document.querySelector('input[data-act=sr][data-id=s2]'); b.click(); const m = S.atletas['Prueba N10'].sr.PISO.s2; const a = document.querySelector('a[data-act=srauto]'); a.click(); return { m, after: S.atletas['Prueba N10'].sr.PISO.s2, np: totals('Prueba N10').PISO.np }; });
  console.log('UI SR manual/automático:', JSON.stringify(ui1));
  await page.evaluate(() => { ui.ap = 'SALTO'; ui.open = 1; render(); });
  await page.screenshot({ path: __dirname + '/usag_cel_salto.png', fullPage: true });
  await page.evaluate(() => { ui.ap = 'BARRAS'; ui.open = -1; S.atletas['Prueba N10'].r.BARRAS = [{ k: 'U|BARRAS|2.201', n: 'cast', var: 'm' }]; render(); printAthlete('Prueba N10'); });
  await page.emulateMedia({ media: 'print' });
  await page.screenshot({ path: __dirname + '/usag_print.png', fullPage: true });
  console.log('Errores de consola:', errors.length ? errors : 'ninguno');
  await browser.close();
  process.exit(fail || figBad.length || errors.length ? 1 : 0);
})();
