# USAG Desarrollo Opcional 2026-2030: valores de elementos y reglas (notas de método)

Fecha: 2026-10-17. Archivos en esta carpeta:
- `usag_valores.json`: valor (A-E) por número USAG para BARRAS, VIGA y PISO. Incluye conteos, anotaciones, grupos, descripciones conocidas y número aproximado de símbolos por celda.
- `usag_saltos.json`: tablas de salto por nivel (6, 7, 8, 9, 10), cada una con número, nombre y SV. En L10 se marcan los saltos sin bono de +0.10.
- `usag_reglas.json`: reglas por nivel y aparato. Cubre la fórmula de SV, VP, SR, permitidos y restringidos, CV, CC, DV, composición, sustitución, ejercicio corto y el +0.10 extra de L10.

## 1. Método para los valores
1. Los apéndices 4 (UB), 5 (BB) y 6 (FX) del Dev COP 2026-30 son cuadrículas: las filas son grupo y fila; las columnas son A (.100) a E (.500). Los símbolos son imágenes rasterizadas.
2. Extracción automática con pdfplumber (`scripts/grid2.py`). Para cada imagen se tomó el centro de su bbox y se le asignó:
   - la columna, según las líneas verticales de la tabla;
   - la fila, según las líneas horizontales y la etiqueta "NN" de la fila.

   Se usan las líneas porque en piso las etiquetas van al pie de la celda.
3. Revisión visual de las 6 páginas renderizadas a 150 dpi, celda por celda. La extracción por líneas y la lectura visual coinciden en todas las celdas.
   - Los fallos del primer método (columna A perdida en la página 2 de UB y filas altas de piso) se corrigieron así.
4. El número se arma como `G.(columna)(fila)`. Ejemplo: grupo 5, fila 03, columna E = 5.503.

| Aparato | A | B | C | D | E | Total |
|---|---|---|---|---|---|---|
| Barras | 24 | 44 | 54 | 54 | 39 | 215 |
| Viga | 42 | 62 | 61 | 45 | 35 | 245 |
| Piso | 26 | 36 | 27 | 22 | 11 | 122 |

- No hay columnas F/G: en Dev USAG el valor máximo es E.
- Una celda puede tener varios símbolos (variantes del mismo número). El conteo de imágenes por celda es solo orientativo.

### Verificaciones cruzadas (todas coinciden)
- **Cambios de valor (CHG26)**, presentes con la letra nueva:
  - UB 5.503 E.
  - BB 2.201 B, 2.202 B, 2.302 C, 2.207 B y 9.406 D.
- **Elementos nuevos**:
  - BB 3.506 E (Graba, 2026).
  - BB 2.501 E (Pennucci, 2025).
  - UB 7.203 B (variante 2026).
  - UB 6.401 D (Healy en stalder, que pasó de 6.301 C en 2025).
- **Lista de AP7** para el CV de +0.20 en UB: 3.401, 6.405, 7.410, 7.510, 2.406, 4.406, 4.506 y 5.503. Todos existen como D/E.
- **Números del COP 2022-26** (páginas revisadas en `historico/`) que siguen en la misma celda:
  - 3.401 Shaposhnikova D, 4.406 Pak D, 4.407 Gienger D, 5.405 Jaeger D, 7.410 Maloney D.
  - 8.505 double layout E, 3.407 Weiler a parada D, 1.414 D, 4.202 gigante B.

## 2. ¿La numeración es la de FIG? **No.**
- **Distinta estructura de grupos.**
  - FIG 2025-28: UB tiene 6 grupos (entradas, casts/clear hip, gigantes, stalder, pike circles, salidas); BB tiene 6; FX tiene 5.
  - USAG: UB tiene 8 grupos (5 = gigantes adelante, 6 = stalder); BB tiene 9 (6 = rolls); FX tiene 8.
- **Ejemplos del mismo elemento con número distinto**:

  | Elemento | USAG | FIG 2025 |
  |---|---|---|
  | Ejova | 5.503 (E) | 3.407 |
  | Sissonne | BB 2.207 (B) | 2.108 (A) |
  | Desde posición cruzada, salto con ¼ a split jump | BB 2.201 (B) | 2.202 (split jump cruzado), con otro valor |
  | Front 2/1 | FX 6.501 | grupo 4 de FIG |

- **La numeración USAG es propia y estable desde el Dev COP 2022-26.** Probablemente viene de un ciclo FIG anterior a 2013, con UB en 8 grupos. No lo verifiqué: no conseguí un CoP FIG 2009-12 público.
- **En USAG la centena codifica el valor.** Si el valor cambia, cambia el número:
  - Ejova: 5.403 D → 5.503 E.
  - Sissonne: 2.107 A → 2.207 B.
  - 2/1 de viga: 9.306 C → 9.406 D.

  Las guías de TX NAWGJ (A. Stroud) y el blog thegymnasticsguide citan los números viejos (5.403, 9.306). La fuente oficial (CHG26) usa los nuevos.
- **Relación con los valores FIG**: no se pueden mapear número por número. Para importar un elemento FIG hay que identificarlo por descripción y buscar su celda USAG.
- **Valor de cada letra en USAG**: A = 0.10, B = 0.30 y C = 0.50 de VP. D y E valen C para VP y dan bono. No se suman como en el D-score FIG.
- **Saltos**: numeración propia USAG (grupos I-V), con SV fijo por nivel. No usa la tabla FIG.

## 3. Reglas
- Las fuentes principales son ERC 2026-30, AP7/AP8 (cheat sheets) y AP1-3 (saltos).
- Se complementan con:
  - la presentación 2026-27 (DEVUPD);
  - las minutas de 2025 y 2026;
  - las guías no oficiales de TX NAWGJ (QRG de A. Stroud, mayo 2026);
  - las hojas de J. Eyman (agosto 2026).
- Las hojas de Eyman aclaran el CV de UB en L9: C+C vale +0.10 si uno o ambos no tienen giro/vuelo (y son distintos), y +0.20 si ambos tienen giro o vuelo. En AP7 esa fila es ambigua.
- Algunas reglas generales vienen del COP 2022-26 (marcadas OLD en el JSON):
  - reemplazo 1 a 1;
  - repetición máxima de 2 veces en conexión distinta;
  - lógica cronológica de restringidos;
  - DV: D +0.10, E +0.20 en L10.

  Pueden haber cambiado en el texto 2026-30.

## 4. Fuentes extra descargadas (`fuentes/usag/extra/`)
- `qrg_bars_6.1.pdf`, `qrg_beam_6.1.pdf`, `qrg_floor_6.1.pdf` y `qrg_all_6.1.pdf`: TX NAWGJ, guías rápidas L10 (txnawgj.org, item 799).
- `eyman_scoresheets/L{6..10}_SCORESHEET_{BARS,BEAM,FLOOR}_2026-08-19.pdf`: hojas de juez de J. Eyman (carpeta pública de Drive enlazada en txnawgj.org, item 800).
- Hay archivos `.txt` extraídos al lado de cada PDF.
- No se encontró ninguna lista pública de elementos con descripción, ni un FAQ oficial USAG de 2026-30 publicado después de agosto de 2026. La búsqueda solo arrojó:
  - el blog thegymnasticsguide.com;
  - un examen de práctica L10 de NAWGJ (el enlace devolvió HTML, no se descargó).

## 5. Incertidumbres y huecos
- **Descripciones de elementos**: solo hay unas 50 (ver `descripciones_conocidas`). Las demás (≈530) son números con valor y sin texto; el texto está en el COP de pago (VitalSource, $80).
- **Nombres de los grupos**: varios son inferidos (marcados en `_grupos`).
- **Piso 8.504 / 8.505**: la celda E está combinada en el PDF. Registré ambos como E (confianza media).
- **DV de E en L10** (+0.20) y la mecánica fina de restringidos y repetición: vienen del COP 2022-26, sin confirmar en 2026.
- **Salto**: no hay en lo público cuántos saltos cuentan (mejor o promedio) para L6-10.
- **Deducciones de ejecución**: no están estructuradas en el JSON (están en AP7/AP8, AP13/AP14 y en los TXT).

## 6. Descripciones de elementos (`usag_elementos.json`, 18-oct-2026)

### Qué numeración coincide
Coincide la del **FIG WAG CoP 2001-2005**. Los códigos 2006-08, 2009-12, 2013-16 y 2017-20 usan otra estructura y no coinciden: UB pasa a 6 grupos (casts/clear hip, gigantes, stalder, pike circles, salidas), BB a 6 y FX a 5.

En el FIG 2001-05 los grupos y sus títulos son los mismos que en USAG:

| Aparato | Grupos FIG 2001-05 | Coincide con |
|---|---|---|
| UB | 8: 1 entradas · 2 casts/contramovimientos · 3 underswings/clear hips · 4 giant swings bwd · 5 giant swings fwd · 6 stalder · 7 circle swings/hechts · 8 salidas | títulos del Xcel/Dev USAG |
| BB | 9: 1 entradas · 2 saltos · 3 giros · 4 ondas · 5 equilibrios · 6 rolls · 7 walkovers/ruedas · 8 saltos acro · 9 salidas | |
| FX | 8: 1 saltos · 2 giros · 3 paradas · 4 rolls · 5 walkovers · 6 mortales adelante · 7 laterales/arabian · 8 mortales atrás | |

Anclas comprobadas:

| Elemento | FIG 2001-05 | USAG |
|---|---|---|
| Ejova | 5.403 D | 5.503 E (antes Dev 5.403 D) |
| Shaposhnikova | 3.401 | 3.401 |
| Maloney | 7.410 | 7.410 |
| Pak | 4.406 | 4.406 |
| Gienger/Deltchev | 4.407 | 4.407 |
| Jaeger | 5.305 / 5.405 | 5.305 / 5.405 |
| Hindorff | 3.502 | 3.502 |
| Weiler | 3.407 | 3.407 |
| Sissonne (BB) | 2.107 A | 2.107 (Xcel), Dev 2.207 B |
| Salida 2/1 (BB) | 9.306 C | Dev 9.406 D |
| Illusion turn (BB) | 3.405 D | 3.505 E |
| Mortal adelante 2/1 (FX) | 6.401 D | 6.501 E |
| Healy en stalder (UB) | 6.301 | 6.301 → 6.401 D |

- Las notas manuscritas "S x.xxx JO-X" del PDF 2001 (suplemento Junior Olympic) son justamente los movimientos de valor que USAG conserva hoy.
- **Regla**: la fila de un elemento es la misma que en el FIG 2001. La columna (valor) puede ser la del FIG o la que subió USAG/JO.

### Fuentes, por orden de prioridad
1. **Tablas de elementos del Xcel COP USAG** (páginas revisadas 2022-2026, `fuentes/usag/xcel/cop_rev_*.pdf` y `xcel_extra/`). Usan la misma numeración que Dev y dan el texto USAG actual (`confianza: alta`): BARRAS 74, VIGA 102, PISO 46.
   - Ojo: Xcel no siempre dice lo mismo que Dev para el mismo número. P. ej., la celda Xcel de VIGA 2.201 solo describe el split leap. El campo `doc_usag` añade los textos oficiales Dev (CHG26, DEVUPD, minutas, AP7/AP8).
2. **FIG WAG CoP 2001-2005** (`fuentes/fig_historico/WAG_CoP_2001-2005_gymresults.pdf`, escaneado, 212 pp.). Lo transcribí mirando las imágenes de cada página de elementos, tras una prueba de OCR con tesseract (en `work/`) (`confianza: media`). Cuando el número cambió, el valor viejo va en `fig_viejo`.
3. **Inferido o sin descripción**: celdas USAG que estaban vacías en el FIG 2001 (elementos añadidos por JO/USAG o en códigos posteriores) y las filas 8.101-8.202 de FX, cuya página XI-22 falta en el PDF (`confianza: baja`).

### Cobertura

| Aparato | Con descripción | Alta | Media | Baja | Sin nada |
|---|---|---|---|---|---|
| BARRAS | 203/215 | 74 | 119 | 19 | 3 |
| VIGA | 234/245 | 102 | 131 | 7 | 5 |
| PISO | 109/122 | 46 | 57 | 18 | 1 |

En "Baja" están las inferencias "probable…" (en `nota`).

- **Sin descripción**:
  - BARRAS: 1.416, 1.308, 2.101.
  - VIGA: 1.113, 1.114, 1.513, 1.515 (solo JO), 3.509, 7.510.
  - PISO: 8.505.
- **Equivalente FIG 2025** (`fig2025`): BARRAS 69, VIGA 54, PISO 24. Se buscó por nombre propio (desempatando por la letra más cercana), por similitud de texto ≥0.80, o a mano (BARRAS 8.505 → 6.406).
  - Es **orientativo**: el match por nombre puede caer en la variante equivocada de una celda con varias.
- **Español**: no hay traducción española del FIG 2001. `d` solo se rellena con el texto UPAG del elemento FIG 2025 cuando el match es por nombre. Casi todo queda en `null`.

### Validación (37/38 casos conocidos coinciden en valor y descripción; `work/validacion.json`)
- **UB**: 5.503 Ejova, 6.401 Healy, 7.203, 2.201 cast HS, 3.401, 6.405, 7.410, 2.406 Cox, 4.406 Pak, 4.407 Gienger, 5.405 Jaeger, 1.414, 3.207 y 3.407 Weiler, 4.202, 6.204, 7.209, 6.104, 7.101, 8.103 flyaway, 8.505 double layout, 2.205, 2.303.
- **BB**: 2.201, 2.202, 2.302, 2.207 sissonne, 9.406, 3.506 Graba, 2.501 Pennucci, 1.108, 3.505 illusion, 1.311, 2.110, 2.111, 2.105.
- **FX**: 6.501.
- **Fallo: UB 4.506.** En el FIG 2001 la celda E es el Counter Kim, pero AP7 y Eyman dicen que en USAG 4.506 es una suelta de BS a BI (Pak con 1/1). Lo corregí a mano.
  - **Conclusión**: en las columnas D/E, sobre todo donde FIG tenía "Super E" o celdas vacías, USAG metió elementos propios. Las descripciones FIG 2001 de las celdas D/E que no se pudieron comprobar en Xcel deben tomarse como probables.

### Otros casos dudosos
- **BARRAS** 5.305 Jaeger agrupado: USAG mantiene una C en esa celda, pero JO 2001 lo había subido a D.
- **BARRAS** 6.502 Ricna: no existe en USAG; probablemente es D 6.402.
- **BARRAS**: 7.312/7.412/7.512 (Endo) y 7.213/7.313/7.413 (Stalder carpado), con el reparto C/D sin verificar.
- **VIGA** 3.202/3.203: anotación "45°" en el apéndice; son variantes de giro propias de USAG.
- **VIGA** 3.407 Li Li: C en FIG; en USAG solo hay celda D.
- **VIGA** 2.409/2.509/2.510/2.511: cat leap y tuck/wolf jumps con más giro, inferidos.
- **PISO** 8.101-8.501: serie de giros atrás, inferida por fila y valor.
- **PISO**: 2.105, 2.307, 2.208, 2.408, 2.405, 2.506, 2.501, 1.402, 1.404, 1.410, 1.411, 1.514 y 1.516 son celdas USAG que estaban vacías en FIG 2001.
- **Elementos nuevos USAG** (descripción tomada de DEVUPD y minutas): BB 3.506 Graba, BB 2.501 Pennucci, UB 7.203 (variante), UB 6.401 Healy, BB 1.108 (parada de hombros).

### Códigos FIG descargados (`fuentes/fig_historico/`)
- 1993-96, 1997-2000 y 2001-05: escaneados, sin texto.
- 2006-08 y 2009-12 (gymnasticsresults.com).
- 2013-16 (gymfed.cz) y 2017-20 (agf.az).
- No encontré versiones en español de los códigos viejos.
