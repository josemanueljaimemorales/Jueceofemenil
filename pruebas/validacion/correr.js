// Corre las rutinas reales (rutinas_src.js) en el editor real (Chromium/Playwright) y guarda resultados.
const fs = require('fs'), path = require('path');
const V = __dirname + '/';   // servidor estático en :8792 sirviendo la raíz del repo
const SRC = require(V + 'rutinas_src.js');
function rowsDe(ap, rut) {
  return String(rut).split(/\s+/).filter(Boolean).map(tok => {
    const m = /^(.*?)([>~])?$/.exec(tok); const [n, ...fl] = m[1].split(':');
    const r = { k: 'F|' + ap + '|' + n };
    fl.forEach(f => { const [kk, vv] = f.split('='); r[kk] = vv === undefined ? true : vv; });
    if (m[2]) { r.c = true; if (m[2] === '~') r.ind = true; }
    return r;
  });
}
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:8792/app/');
  await page.waitForFunction(() => typeof S !== 'undefined' && FL && FL.UB && FL.UB.raiz && S.atletas && S.atletas.EJEMPLO, null, { timeout: 15000 });
  const out = [];
  for (const R of SRC) {
    const rows = rowsDe(R.ap, R.rut);
    const res = await page.evaluate(([nivel, ap, rows, lin]) => {
      rows.forEach(r => { r.n = nombreDe(r.k, nivel) || r.k; });
      const a = { nivel, r: { SALTO: [], BARRAS: [], VIGA: [], PISO: [] }, cr: {}, sr: {}, cc: {}, p: lin != null ? { lin: { [ap]: String(lin) } } : {} };
      a.r[ap] = rows; const res = compute(a, ap);
      if (ap === 'SALTO') return { rows, vaults: res.vaults.map(v => ({ v: v.v, n: v.e && v.e.n })), avg: res.avg, notes: res.notes };
      return { rows, np: res.np, dv: res.dv, cr: res.cr, crBits: (res.crDet || []).map(c => c.hit ? '1' : '0').join(''), cv: res.cv, sb: res.sb || 0, dmt: res.dmt || 0, nd: res.nd || 0,
        counted: [...res.counted], items: res.items.map(x => ({ n: x.n, l: x.l, v: x.v, tipo: x.tipo, why: x.why || '', cv: x.r.c ? (res.pot[x.i] || 0) : null })),
        nLin: res.nLin, notes: res.notes, nd: res.nd || 0, ndDet: (res.ndDet || []).map(d => d.t + ' ' + d.v) };
    }, [R.nivel || 'FIG', R.ap, rows, R.lin ?? null]);
    out.push({ ...R, res });
    const ed = R.ap === 'SALTO' ? res.vaults.map(v => v.v).join(' / ') : res.np;
    console.log(`${R.id} ${R.ap} ${R.gym}: editor ${ed}${R.ap === 'SALTO' ? '' : ` (DV ${res.dv} CR ${res.cr} [${res.crBits}] CV ${res.cv} SB ${res.sb} DMT ${res.dmt})`} | oficial ${R.oficial} | esperado-manual ${JSON.stringify(R.esperado || '')}`);
    if (R.ap !== 'SALTO') {
      console.log('   ' + res.items.map((x, i) => `${i + 1}:${x.n}${x.l}${res.counted.includes(i) ? '*' : ''}${x.cv != null ? '>' + x.cv : ''}${x.why ? '(' + x.why + ')' : ''}`).join(' '));
      if (res.notes.length) console.log('   notas: ' + res.notes.join(' | '));
    } else console.log('   ' + res.notes.join(' | '));
  }
  fs.writeFileSync(V + 'resultados.json', JSON.stringify(out, null, 1));
  console.log('errores:', errors.length ? errors : 'ninguno');
  await browser.close();
})();
