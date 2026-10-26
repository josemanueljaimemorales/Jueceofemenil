# Especificación de reglas de Nota de Partida (SV): USAG Women's Development Optional, niveles 6–10

Para la calculadora de SV y el editor de rutinas de Jueceo GAF MEX (`/home/user/jueceofemenil/app/editor.js`).

**Ciclo vigente**: Development Code of Points 2026‑2030 y año competitivo 2026‑27 (1‑ago‑2026 a 31‑jul‑2027).
**Fecha de corte**: 26‑oct‑2026.

**Novedades después de agosto 2026**: no hay ninguna novedad técnica (detalle en §0.3).

## 0. Convenciones

### 0.1 Fuentes y abreviaturas

Todas las rutas son relativas a `scratchpad/fuentes/usag/`.

| Clave | Documento | Archivo |
|---|---|---|
| ERC | Event Rules Charts L6‑10, Dev COP 2026‑30. Páginas VAULT‑1, BARS‑1, BEAM‑1, FLOOR‑1 | `dev_optional/eventrulescharts6_10.pdf` |
| AP1 / AP2 / AP3 | Valores de salto L10 / L9 / L6‑8 (2026‑30) | `dev_optional/appendix1‑3.pdf` |
| AP7 / AP8 | Cheat Sheets L9‑10 / L6‑8 (actualizadas 25‑may‑2026) | `dev_optional/appendix7.pdf`, `appendix8.pdf` |
| AP11 / AP12 | Hojas de puntuación L9‑10 / L6‑8 (AP12 revisada 21‑ago‑2026) | `dev_optional/appendix11.pdf`, `appendix12.pdf` |
| AP13 / AP14 | Hojas de salto L8‑10 (rev. 8.1.26) / L6‑7 | `dev_optional/appendix13.pdf`, `appendix14.pdf` |
| AP9 / AP10 | Técnica de danza / técnica de barras | `dev_optional/appendix9.pdf`, `appendix10.pdf` |
| CHG26 | Elementos que cambian de valor 2026‑30 | `dev_optional/26changedvalues.pdf` |
| R&P | Rules & Policies 2026‑27 (versión del 28‑ago‑2026; idéntica a la local) | `rules/rulespolicies_2026-27.pdf` |
| DEVUPD | 2026‑27 Development Program Update | `rules/dev_update_2026-27.pdf` |
| MIN25 | Minutas Joint DPC/Tech del 12‑may‑2025 (reglas vigentes desde 2025‑26) | `txt/minutes_dpc_051225_tech.txt` |
| MIN26 | Minutas Joint DPC/Tech del 11‑may‑2026 (reglas vigentes desde 2026‑27) | `txt/minutes_dpc_051126_tech.txt` |
| OLD | Dev COP 2022‑26, páginas revisadas 4‑ago‑2025. El texto 2026‑30 es de pago (VitalSource, $80) y no se tiene. Se usa OLD solo para reglas que las fuentes 2026 no contradicen; cada uso se marca **[OLD‑verificar]** | `historico/dpcop_2022-26_revisedpages_080425.pdf` |
| XCOP | Xcel COP, páginas revisadas ago‑2026. Analogía para reglas generales de salto | `txt/xcel_cop_rev_081226.txt` |
| EYMAN | Hojas de J. Eyman / B. Crawford (rev. ago‑2026). **No oficial** | `extra/eyman_scoresheets/` |
| TXQRG | Quick Reference Guides L10, A. Stroud (TX NAWGJ, 5/26). **No oficial** | `extra/qrg_*_6.1.pdf` |

### 0.2 Estado frente a `editor.js`

| Estado | Significado |
|---|---|
| **ok** | El código la implementa bien |
| **parcial** | Implementada solo en parte |
| **mal** | El código da un resultado incorrecto |
| **falta** | No está en el código |
| **manual** | Hoy solo la marca el juez con una casilla y no hay detección |

Las funciones revisadas son `creditoUSAG`, `cvUSAG`, `computeUSAG` y `computeSaltoUSAG`.

### 0.3 Revisión de usagym.org (26‑oct‑2026)

Se revisaron estas páginas:
- `/women/rules/`
- `/women/development/optionals/`
- `/women/judges/updates/`
- `/women/minutes/`
- `/women/updates/`

Comparación de los PDF publicados con las copias locales (md5):
- **Iguales**:
  - Apéndices 1‑14.
  - ERC y CHG26.
  - R&P (`Last-Modified` 28‑ago‑2026).
  - DEVUPD (13‑ago‑2026).
- AP12 y AP13 llevan fecha 21‑ago‑2026 y también son iguales a la copia local.

Lo único posterior a agosto de 2026 son las minutas del Women's Program Committee del 8‑ago‑2026 (publicadas el 2‑sep‑2026):
- Contenido: gobernanza, elecciones y cargos.
- **No traen ningún cambio técnico.**
- Copia descargada en `fuentes/usag/nuevos/minutes_pc_080826.pdf` (y `txt/`).

Otros puntos de la revisión:
- No hay Q&A ni aclaraciones técnicas nuevas.
- La próxima reunión del NTC es del 6 al 8‑nov‑2026, después de la fecha de corte.

### 0.4 Datos del editor y predicados que se usan en toda la especificación

**Fila de rutina `r`**:
- `k`: clave del elemento.
- `l`: letra manual.
- `c`: conectado con el siguiente.
- `ind`: indirecta (solo en PISO).
- `caida`: caída.
- `cvm`: valor de conexión manual.

**Elemento `e = el(k)`**:
- `n`: número USAG.
- `g`: grupo.
- `l`: letra.
- `en`: texto.
- `tipo`: `danza` o `acro`.
- `dmt`: es salida.

**Flags nuevos propuestos** (casillas del juez por fila; se usan más abajo):

| Flag | Significado | Efecto |
|---|---|---|
| `inc` | Incompleto o no cae primero con los pies | Sin VP, SR, CC ni bono |
| `spotE` | Ayuda durante el elemento | Sin VP, SR, CC ni bono; −0.50 de ejecución |
| `spotL` | Ayuda al aterrizar la salida | Con VP, SR y CC; sin bono; −0.50 de ejecución |
| `x` | Elemento intentado (para restringidos de L6/7) | — |
| `var` | Variante elegida cuando un número USAG agrupa variantes de distinta regla (p. ej., ½ a toma regular / ½ a toma cubital / Healy en 6.304) | — |

**Predicados**: se definen una sola vez y se citan por nombre.

| Predicado | Definición |
|---|---|
| `VP(x)` | `x` recibe VP: tiene letra, no está restringido sin crédito, no es la 3.ª repetición ni la misma conexión repetida (G‑07), y no tiene `inc`/`spotE`. |
| `L(x)` | Letra efectiva para VP, CV y CC: L6‑8 C permitido = B; L9 D/E permitido o 1.er D/E restringido = C; L10 la letra real. |
| `cadena(i)` | Secuencia maximal de filas unidas por `c=true` (en PISO puede incluir `ind=true`). |
| `pase(i)` (FX) | `cadena(i)` que contiene al menos un elemento acro (grupos 3‑8). Un elemento de danza del grupo 1 dentro de la cadena **rompe** el pase (OLD FLOOR‑23 §III.A). |

**Barras (UB)**:

| Predicado | Regla de detección |
|---|---|
| `vueloUB(e)` | `e.g≠8` y (texto con `/flight\|release\|salto\|hecht\|counter\|over (the )?(LB\|HB)\|Pak\|Tkatchev\|Jaeger\|Gienger\|Deltchev\|Shaposh\|Maloney\|Ezhova\|Ejova\|Cox\|Comaneci/i` o el número está en la lista UB‑VUELO de §3.0). Las entradas con salto (grupo 1, p. ej. 1.311) cuentan como vuelo pero **no** para "excluye entrada" cuando la regla lo dice. |
| `cambioBarra(e)` | Número en la lista UB‑CB de §3.0, o texto `/(to\|on) hang on HB\|hang on LB\|to (catch\|regrasp\|handstand on\|clear support on) LB\|over LB\|from HB to\|from LB to\|to HB\b/i`. Es heurístico: MIN26 dejó pendiente definir qué es un cambio de barra, así que el juez debe poder marcarlo a mano. |
| `giroLA(e)` | Texto `/(½\|1\/2\|1\/1\|1½\|2\/1\|180°\|360°\|540°\|720°) ?(\(?\d{3}°\)? )?turn\|pirouette\|Healy/i` y `e.g∉{1,8}` para los SR que excluyen entrada y salida. |
| `circulo367(e)` | `e.g∈{3,6,7}`, número en la lista UB‑C367 de §3.0 (círculos libres de 360°), sin sueltas y sin cadera en la barra (7.101 no cuenta). |
| `circuloLibre(e)` | `circulo367(e)` o gigantes atrás/adelante (4.102, 4.202, 4.302, 4.303, 4.402, 4.403, 4.502, 4.503, 5.202, 5.302, 5.402, 5.407, 5.507). |
| `salidaMortalUB(e)` | `e.g===8` y texto `/salto\|flyaway/i` y no `/^.*hecht(?!.*salto)/` (8.208 hecht y 8.308 hecht 1/1 **no** son mortales). 8.101 (subbalanceo a parado, sin mortal) no cuenta. |

**Viga (BB)**:

| Predicado | Regla de detección |
|---|---|
| `danzaBB(e)` | `e.g∈{2,3,4}`, o entrada del grupo 1 cuyo texto empieza con `(D)`. |
| `acroBB(e)` | No es `danzaBB`, no es `(NA)` y `e.g∉{4}`. **Abierto**: el grupo 5 (equilibrios) hoy es acro en el editor; OLD lo trata como acro solo en paradas de manos y planchas. |
| `vueloBB(e)` | Grupo 8; grupo 7 con `/flic\|handspring\|flyspring\|aerial\|free\|round.off\|gainer\|butterfly\|flight phase\|Kolesnikova/i`; o 6.201 (dive roll, rol con vuelo; OLD BEAM‑17). Entradas del grupo 1 con vuelo valen para el CV de 3 elementos, no para SR. |
| `mortalBB(e)` | Grupo 8, o grupo 9 con `/salto\|aerial/i`. |
| `aereoBB(e)` | Texto `/aerial\|free \(aerial\)\|butterfly/i`. |
| `salidaAereaMortalBB(e)` | `e.g===9` y `/salto\|aerial/i`. 9.101/9.201/9.301 (paloma) y 9.103/9.203 (rueda) **no** cuentan. |
| `giro360BB(e)` | `e.g===3` y (`turnDeg≥360` o `/1\/1\|1½\|2\/1\|3\/1\|4\/1/`). Excluye 3.107/3.207 (en posición prona) y 3.208/3.308 (flair). |
| `salto180BB(e)` | `e.g===2` y texto `/split\|straddle\|side.split\|switch\|ring\|Sissonne\|180/i` y no es un stag puro (2.101 "stag leap" sin split; 2.105 switch a wolf no cuenta). El juez confirma ≥135°. |

**Suelo (FX)**:

| Predicado | Regla de detección |
|---|---|
| `danzaFX(e)` | `e.g∈{1,2}`. |
| `saltoFX(e)` (mortal) | `e.g∈{6,7,8}`. 7.101 desde un pie "parece aéreo": **abierto**, que confirme el juez. |
| `vueloFX(e)` | `saltoFX`, o `e.g===5` con `/handspring\|flyspring\|round.off\|flic\|aerial\|free\|cartwheel.*flight\|butterfly/i`, o 4.101/4.201/4.301 (hecht roll). |
| `aereoFX(e)` | 5.103, 5.303, la variante aérea de 5.104 y la variante "free aerial" de 5.105. **No** son mortales. |
| `dirFX(e)` | Atrás = grupo 8 (incluye whip y gainer) y 7.201. Adelante = grupo 6, 7.101 y 7.202 (el árabe cuenta como adelante). |
| `leap180FX(e)` | `e.g===1`, salida desde un pie, con split o side‑split de 180°: 1.101 (leap), 1.202 (con salida de un pie), 1.203, 1.204, 1.304, 1.305, 1.109 (tijera extendida), 1.209, 1.309, 1.409, 1.210 (leap), 1.310, 1.311. El juez confirma la apertura. |
| `giro1pieFX(e)` | `e.g===2`, salvo 2.207 (spin de espalda) y 2.308 (flair). |

**Formas** (para el aviso "más de 2 elementos de la misma forma"):
- Agrupado o lobo (`tuck/wolf`):
  - FX: 1.115‑1.415, 1.116‑1.516 y 1.104.
  - BB: 2.110‑2.510, 2.111‑2.511 y 2.105.
- Abierto (`straddle`):
  - FX: 1.207, 1.307, 1.407 y la variante straddle de 1.202.
  - BB: 2.202, 2.302, 2.402, 2.502 y 2.203‑2.503.

---

## 1. Reglas generales (L6‑10, UB/BB/FX)

### G‑01 Valor de las partes de valor (VP)
- **Fuente**: ERC BARS/BEAM/FLOOR‑1; OLD GENERAL‑15 [OLD‑verificar para D y E].
- **Regla**:
  - A = 0.10, B = 0.30, C = 0.50.
  - D y E no tienen valor de VP propio: cuentan como C (L9 y L10).
- **Estado**: ok (`VP={A:.1,B:.3,C:.5}`).
- **Detección**: letra del catálogo o `r.l`.
- **Efecto**: cada VP faltante resta su valor del SV.

### G‑02 VP requeridos y SV base
- **Fuente**: ERC; AP7/AP8 "Content".
- **Regla**:

| Nivel | A | B | C | SV base (con todos los VP y SR) | CC máx. | Bono máx. |
|---|---|---|---|---|---|---|
| L6 | 4 | 2 | 0 | 10.00 | — | — |
| L7 | 4 | 3 | 0 | 10.00 | — | — |
| L8 | 4 | 4 | 0 | 9.80 | 0.20 | — |
| L9 | 3 | 4 | 1 | 9.50 | 0.20 | 0.30 |
| L10 | 3 | 3 | 2 | 9.20 | 0.30 | 0.50 |

  **Cambio frente a 2022‑26**: L6 pasó de 5A+1B a 4A+2B; L7 de 5A+2B a 4A+3B; las bases eran 10 / 9.70 / 9.50.
- **Estado**: ok (`usag_reglas.json` → `general.vp_requeridos` y `sv_base`).
- **Efecto**:
  - `SV = base − ΣVP faltantes − 0.50×SR faltantes − 0.50×restringidos + CC + bono`.
  - Tope 10.00. El +0.10 extra de L10 va fuera del SV.

### G‑03 Orden de cálculo
- **Fuente**: EYMAN; TXQRG ("USE THIS ORDER").
- **Regla**:
  1. `BASE = sv_base − VP − SR − restringidos`.
  2. Sumar el bono (DV+CV, con tope).
  3. Sumar el CC de dificultad.
  4. Sumar el CC de salida o de danza.
  5. Aplicar el tope de 10.00.
- **Estado**: ok (la suma es conmutativa salvo el tope, y el tope se aplica al final).

### G‑04 Reemplazo de VP
- **Fuente**: OLD GENERAL‑15 §I.B [OLD‑verificar]; ERC "Allowable C's = B value / D/E's = C value".
- **Regla**:
  - Un VP mayor reemplaza a uno menor, nunca al revés, 1 por 1 y sin importar los puntos.
  - L10: D y E pueden reemplazar A, B o C y aun así dan bono DV.
- **Estado**: ok (`computeUSAG`, llenado codicioso C→B→A sobre la lista ordenada de mayor a menor).
- **Prueba**:
  - L9 UB con 3A, 3B, 1C y 1 D permitido (vale C), con todos los SR, sin CV ni CC.
  - El D cubre el B que falta. SV = 9.50 + 0.10 (DV del primer D/E) = **9.60**.

### G‑05 Requisitos especiales (SR)
- **Fuente**: ERC; OLD GENERAL‑15 §I.C.2.
- **Regla**:
  - 4 SR por aparato, de 0.50 cada uno, que se restan si faltan. En L7 UB el SR 2/3 vale 2 SR y en L7 FX el SR 1/2 también.
  - Un elemento puede cumplir más de un SR salvo que se indique lo contrario (ERC BARS‑1).
  - **Para cumplir un SR el elemento debe recibir VP.**
- **Estado**: parcial.
  - Hoy los SR son casillas manuales. Solo se detecta la letra de la salida (ver UB/BB‑SR4), y aun eso mal.
- **Detección**: ver cada SR. Siempre se exige `VP(x)` y que `x` no esté restringido sin crédito.

### G‑06 Elementos restringidos
- **Fuente**: ERC ("0.50 deduction off SV – No credit for VP or SR"); AP7/AP8 ("No VP/SR/CC"); OLD GENERAL‑23 §1.d [OLD‑verificar].
- **Regla**:
  - Se evalúan en orden cronológico.
  - Solo el **primer** restringido "tolerado" del nivel recibe crédito:
    - L8: un C (UB: un C fuera de la lista permitida; BB/FX: un C acro), que vale B.
    - L9: un D/E (UB cualquiera; BB/FX acro), que vale C.
  - Cada restringido adicional, y en L6/L7 todo restringido (aunque solo se **intente** y quede incompleto):
    - −0.50 del SV;
    - sin VP, SR, CC ni CV.
  - L8/L9: el mismo restringido tolerado puede repetirse si la primera vez recibió 0 VP.
  - L6/L7: un restringido intentado sin VP no puede repetirse.
  - Se aplican igual todas las deducciones de ejecución.
- **Estado**: parcial.
  - La lógica cronológica existe, pero las listas de permitidos están mal en UB (ver UB‑6/7/8/9‑R).
  - Falta la regla de repetición del restringido con 0 VP.
  - Falta el flag "intentado" en L6/7.
  - CV se anula bien (`A.rest||B.rest`). El CC es manual.
- **Efecto**: `restDed = 0.50 × nº de restringidos sin crédito`.

### G‑07 Repetición de elementos
- **Fuente**: OLD GENERAL‑15 §I.C; OLD BEAM‑6/9 §V [OLD‑verificar]; TXQRG BB.
- **Regla**:
  - Un elemento recibe VP como **máximo 2 veces**, y la 2.ª solo si va en **conexión distinta**: una vez aislado y otra conectado, o en dos conexiones con un elemento anterior o posterior distinto (cuente o no ese otro elemento).
  - El mismo par en orden inverso cuenta como distinto.
  - La 3.ª vez, o la 2.ª en la misma conexión exacta: sin VP, SR ni CV.
  - BB: quitar o añadir el mismo flic‑flac previo no cambia la conexión.
  - L10: el mismo D/E hecho 2 veces recibe VP las 2 veces y CV cada vez, pero DV **una sola vez**.
  - Excepción (TXQRG): un elemento hecho por 3.ª vez, sin VP, pero conectado directo a la salida, sí sirve para el CC de salida en BB.
- **Estado**: **mal**.
  - El editor no da VP a ninguna 2.ª aparición (`seen`) y avisa "aquí solo cuenta la 1.ª vez".
  - Además, la lógica `used` de CV (heredada de FIG) quita el CV a un elemento ya usado en otra conexión, cuando en USAG se permite.
- **Detección**:
  - Para cada aparición de la clave `k` se calcula la firma de conexión `(k_prev_conectado || '∅', k_sig_conectado || '∅')`.
  - Aparición 1: VP.
  - Aparición 2: VP si su firma ≠ la de la aparición 1.
  - Aparición ≥3: sin VP.
- **Pruebas**:
  1. L9 FX con `8.101` aislado, luego `5.105+5.106+8.101`, luego `8.101` aislado otra vez. La 1.ª y la 2.ª dan VP; la 3.ª no da VP.
  2. L10 BB con `7.208+7.208+8.404`, y más tarde `7.208+8.404`. Los flic‑flac 3.º y 4.º no dan VP. El 8.404 de la 2.ª serie tiene la misma conexión (flic + 8.404) y no da VP ni CV (OLD BEAM‑9, ejemplo a).
  3. L10 UB con `4.405` dos veces: una conectada a `4.202` y otra aislada. Las 2 dan VP; DV +0.10 solo una vez.

### G‑08 Ejercicio corto
- **Fuente**: AP7/AP8; OLD GENERAL‑9, BEAM‑2 y FLOOR‑3.
- **Regla**:
  - UB con menos de 5 VP, o BB/FX con menos de 30 s (completo o no): el juez jefe resta −2.00 de la nota final.
  - Además se restan del SV los VP y SR que falten.
  - **Excepción L6 BB**: rutina completa de menos de 30 s, con todos los VP y SV 10.0: −0.50 en vez de −2.00.
  - Nota mínima 1.00.
- **Estado**:
  - UB: ok (`nd=2`, `uniq.filter(vp).length<5`). Debe contar solo los VP con crédito (sin `inc`/`spotE`).
  - BB/FX: **falta**; hace falta un campo de duración o una casilla "menos de 30 s".
  - Excepción L6 BB: **falta**.
- **Efecto**: no cambia el SV; es una deducción del juez jefe (se muestra aparte, como `nd`).
- **Pruebas**:
  1. L8 UB con 4 VP: aviso de −2.00.
  2. L6 BB de 28 s con todo: −0.50.

### G‑09 Sin salida
- **Fuente**: MIN25 #22; OLD GENERAL‑23 ("No longer a deduction").
- **Regla**:
  - Se **eliminó** la deducción de 0.30 del SV por falta de salida (L6‑10).
  - Faltar la salida solo cuesta el SR de salida y su VP.
- **Estado**: ok (el editor USAG no resta 0.30).
  - El SR4 de FX ("no intenta el último mortal", −0.30) también quedó eliminado según OLD 7.25. Debe tratarse igual.
- **Prueba**: L7 UB sin salida, con todo lo demás: SV = 10 − 0.10 (VP A) − 0.50 (SR4) = **9.40**, solo si la salida era uno de los 4A necesarios.

### G‑10 Caídas, spots y aterrizajes: efecto en VP, SR, CC y bono

**Fuente**: OLD GENERAL‑21; UB‑4; BEAM‑4/9/10; AP7/AP8 (columna Landing); TXQRG ("CC con caída o spot al aterrizar").

| Caso | VP | SR | CC | Bono (CV/DV) |
|---|---|---|---|---|
| Elemento completo y luego caída (BB: con los pies sobre la viga) | sí | sí | sí | **no** |
| Incompleto, o no cae primero con los pies (`inc`) | no | no | no | no |
| Cae con pies y manos o rodillas a la vez | sí | sí | sí | no |
| Ayuda durante el elemento (`spotE`) | no | no | no | no |
| Ayuda al aterrizar la salida (`spotL`) | sí | sí | sí | no |
| Toque del entrenador sin ayudar | sí | sí | sí | no |
| Aterriza un acro o la salida en el pit (CJ +0.30) | no | no | no | no |
| FX: impulso fuera de la línea | no | no | no | no |
| BB: caída en el 2.º elemento de una serie acro, ya completado | — | sí (la serie cuenta) | — | — |
| BB: caída en el 2.º elemento de una serie acro, incompleto | — | no | — | — |

- **Estado**: **parcial**.
  - `caida` quita CV y DV (ok).
  - Faltan `inc`/`spotE`/`spotL` y el efecto "sin VP, SR ni CC".
  - Hoy una caída por no caer de pie **conserva** el VP: mal.
- **Pruebas**:
  1. L10 FX: el último mortal 8.301 (C) cae sentada (`inc`). Pierde el VP C y el SR4.
  2. L9 BB: salida 9.206 (B) con `spotL`. Conserva VP y SR4; el CC de salida no se ve afectado.

### G‑11 Bono de L9
- **Fuente**: ERC; AP7; OLD GENERAL‑23 §2.b [OLD‑verificar].
- **Regla**:
  - Máximo 0.30: o 0.30 de CV, o 0.20 de CV + 0.10 de DV.
  - DV +0.10 solo para el **primer** D/E con VP:
    - UB: cualquier D/E, permitido o restringido;
    - BB/FX: solo D/E acro.
  - Sin DV si ese elemento tiene caída o spot.
  - Los D/E permitidos y el 1.er D/E restringido valen C para CV y CC.
- **Estado**: ok en el tope (`min(.3, cv+min(dvb,.1))`). **Mal** en UB: el "primer D/E" se toma solo dentro del flujo de restringidos (ver UB‑9‑R).
- **Pruebas**:
  1. L9 BB con todo, CV 0.30 y un D acro: bono 0.30, no 0.40.
  2. L9 UB con 2 D permitidos de la lista y sin CV: DV solo 0.10.

### G‑12 Bono de L10
- **Fuente**: ERC ("Max 0.50, min +0.1 DV & min +0.1 CV"); AP7; OLD GENERAL‑23/24 [OLD‑verificar].
- **Regla**:
  - Máximo 0.50 entre CV y DV, con al menos +0.10 de cada uno para llegar a 0.50.
  - Si falta DV o falta CV, el máximo útil es 0.40: con 0.50 de CV y sin DV el SV llega a 9.90; con ≥0.60 de DV y sin CV, a 9.90.
  - DV: D = +0.10.
  - **E = +0.20** (dato de OLD). Ningún documento 2026 público da el valor de E: AP11 solo tiene casillas "D ___ E ___ DV ___". Se mantiene +0.20 con aviso.
  - En BB/FX el DV de L10 vale para **todo** D/E, incluida la danza. OLD no lo limita; AP7 limita a acro solo en L9 y exige "E acro" únicamente para el +0.10 extra. **[OLD‑verificar]**
  - CV máximo en UB L10 = 0.40 (OLD BARS‑39).
- **Estado**:
  - Tope: ok.
  - DV de danza en L10: **mal** (`(ub||!danza)` excluye la danza).
  - Repetición de D/E: DV solo una vez, **falta** (ver G‑07).
- **Pruebas**:
  1. L10 FX con todo, CV 0.50 y sin D/E: SV = 9.20 + 0.40 + 0.30 (CC) = **9.90**.
  2. L10 BB con todo, CC 0.30, CV 0.20, DV 0.30 (1 D acro + 1 E acro): bono 0.50 → SV **10.00**. Bono total 0.50 < 0.60 → **no** recibe el +0.10 extra.

### G‑13 +0.10 extra en L10 (fuera del SV)
- **Fuente**: ERC; AP7; TXQRG; OLD GENERAL‑23 [OLD‑verificar].
- **Regla**: se otorga si se cumplen **todas** estas condiciones:
  1. SV 10.00 con todos los VP, SR y CC (CC = 0.30).
  2. Bono total (TB = CV + DV **sin tope**) ≥ 0.60, con CV > 0.
  3. Un elemento específico:
     - UB: suelta D de una sola barra o cualquier suelta E (no salida);
     - BB: un acro E (la salida cuenta, TXQRG);
     - FX: un acro E, **excepto 6.501** (mortal adelante 2/1).
  - Se muestra como "+0.10" junto al SV. No entra en el SV.
- **Estado**: **parcial**. El editor solo pone una nota con `sv≥10 && cv+dvb≥.6`. Faltan el CC completo, el elemento E y la exclusión de 6.501.
- **Detección**:
  - UB, suelta de una sola barra: `vueloUB` sin `cambioBarra`, con `e.g∈{2,3,4,5,6,7}` (por ejemplo 4.405, 4.407, 5.405, 5.305 y 7.511). D mínimo, o E en cualquier suelta.
  - BB: `acroBB && l==='E'`.
  - FX: `!danzaFX && l==='E' && n!=='6.501'`.
- **Pruebas**:
  1. L10 FX con todo, CC 0.30, CV 0.40, DV 0.30 (un 6.501 E y un 8.403 D): TB 0.70, pero el E es 6.501 → **sin** +0.10. SV 10.00.
  2. Igual con 8.503 E en lugar de 6.501: SV 10.00 + 0.10.

### G‑14 Crédito de composición (CC): principios
- **Fuente**: ERC; AP7/AP8; TXQRG.
- **Regla**:
  - Solo en L8 (máx. 0.20), L9 (0.20) y L10 (0.30). Se suma directo al SV.
  - Los elementos con VP sirven para el CC aunque haya caída o spot al aterrizar.
  - Los restringidos sin crédito **no** sirven.
  - "Distintos" = número USAG distinto (y variante distinta si comparten número).
- **Estado**: **manual** (casillas `a.cc`). Detección automática especificada en cada aparato.

### G‑15 Puntuación y tiempos (fuera del SV, para avisos)
- **Fuente**: ERC; AP7/AP8; R&P cap. 7 §H.
- **Regla**:
  - Los jueces puntúan en pasos de 0.05.
  - Rangos entre jueces: 9.50‑10 → 0.20; 9.0‑9.475 → 0.50; 8.0‑8.975 → 0.70; <8.0 → 1.00.
  - Nota mínima 1.00.
  - Los SV de L6‑10 se muestran o escriben siempre.
  - Tiempos de rutina:
    - BB/FX L6‑7: 1:20. BB/FX L8‑10: 1:30. Antes, L6 FX era 1:15.
    - Sobretiempo: −0.10 (CJ). Una fracción de segundo no se descuenta.
    - BB: el tiempo empieza al despegar del trampolín o colchón y termina al caer de la salida; se detiene con las caídas.
    - FX: empieza con el primer movimiento y termina con la pose final.
  - Calentamiento:
    - UB: L6/7 1:30, L8 2:00, L9/10 2:30.
    - BB: L6/7 1:30, L8‑10 2:00.
    - FX: L6/7 1:30, L8‑10 2:00.
    - VT: L6/7 1:30, L8‑10 2:00 por gimnasta.
    - Calentamiento de toque en VT: 3 saltos máx. (R&P cap. 9).
- **Estado**: falta, y no afecta al SV. Se recomienda mostrarlo en las vistas BB/FX.

---

## 2. Salto (VT)

### VT‑01 Cuántos saltos y cuál cuenta
- **Fuente**: ERC VAULT‑1 ("If either of the 2 vaults performed…"); R&P cap. 7 §H.2.b ("both Vault scores should be entered") y §J.3.c ("…prior to attempting the 2nd vault"); XCOP VAULT‑4 §I.A (texto equivalente al Dev COP, que es de pago); OLD GENERAL‑10 (cronómetro de caída entre el 1.er y el 2.º salto).
- **Regla** (L6‑10):
  - La gimnasta tiene derecho a **2 saltos**, iguales o distintos, con **3 carreras** en total.
  - Cada salto se puntúa y promedia por separado. **Cuenta la mejor nota** (no el promedio).
  - Tras una caída en el 1.er salto hay 45 s para saludar al 2.º; si se pasa el tiempo, no hay 2.º salto.
- **Estado**: ok (`best=max`); solo cuenta los 2 primeros.
  - Ajuste: la calculadora debe comparar **notas finales** (SV − ejecución) si el juez las captura. Con solo el SV, "salto de mayor SV" es una aproximación; hay que mostrarlo así.
- **Pruebas**:
  1. L8 `4.203` (10.0) y `4.101` (9.0): cuenta el de 10.0 → **10.00**.
  2. L9 `1.301` (10.0, ejec. 8.6) y `4.203` (9.6, ejec. 9.1): cuenta el segundo, porque su nota final es mayor.

### VT‑02 Saltos permitidos por nivel y SV
- **Fuente**: AP1‑AP3; ERC VAULT‑1.
- **Regla**:
  - L6/L7: solo 1.111 (paloma a la pila de colchones), 3.116 (entrada Tsuk) y 4.111 (entrada Yurchenko), todos con 10.0.
    - L6: debe llegar **de pie**.
    - L7: 3.116 y 4.111 pueden llegar de pie o de espalda; 1.111 solo de pie.
  - L8: los 35 saltos de AP3 (9.0‑10.0).
  - L9: los 55 de AP2 (7.0‑10.0).
  - L10: los 111 de AP1 (7.0‑10.0).
  - Un salto que no esté en la tabla del nivel es VOID.
  - Notas de las tablas:
    - Grupo 3: admite de 90° a 180° de giro LA en el 1.er vuelo.
    - Grupo 5 "flic‑flac 1/1": admite de 270° a 360°.
- **Estado**: ok (`usag_saltos.json`).
- **Pruebas**:
  1. L9 `4.305` → 10.0.
  2. L8 `4.305` (no está en AP3) → VOID; ver VT‑03.

### VT‑03 Salto restringido = evento VOID (L6‑L9)
- **Fuente**: ERC VAULT‑1; AP13 ("Restricted vault performed VOID"); OLD VAULT‑8 ("EVENT VOID Restricted vault performed for Level 8/9").
- **Regla**:
  - En L6/7/8/9, si **cualquiera** de los 2 saltos no está permitido en el nivel, el **evento completo** es VOID: nota 0, aunque el otro salto sea válido.
  - En L10 (sin restricciones), un salto que no está en AP1 es VOID solo él, y cuenta el otro.
- **Estado**: **mal**. El editor anota "salto nulo" y toma el mejor de los dos.
- **Detección**: `k` no está en `USV[L]` (con L ≤ 9) ⇒ `np = 0` y el aviso "Evento VOID".
- **Pruebas**:
  1. L8 `4.203` (10.0) + `4.305` → **0.00**.
  2. L10 `4.305` (9.7) + un salto que no está en la tabla → **9.70**.
  3. L6 `1.111` + `1.101` → **0.00**.

### VT‑04 Bono de salto L10
- **Fuente**: AP1.
- **Regla**:
  - Todo salto de 10.0 "performed successfully (no fall or spot)" recibe +0.10.
  - Excepto: 2.302, 2.311, 3.407, 4.306, 4.309, 4.403, 4.407, 5.301, 5.408 y 5.409.
  - El valor máximo es 10.10.
- **Estado**: **parcial**. Usa `!r.caida`; falta excluirlo con spot (y con VOID).
- **Pruebas**:
  1. L10 `3.404` → **10.10**.
  2. L10 `4.306` → **10.00**.
  3. L10 `3.404` con spot al aterrizar → **10.00**.

### VT‑05 Spot (ayuda) en salto
- **Fuente**: ERC VAULT‑1; AP13/AP14.
- **Regla**:
  - Spot durante el salto: VOID (L6‑10). Excepción L8: spot en el 2.º vuelo de un salto con mortal = −1.00 (ejecución), no VOID.
  - Spot al aterrizar: −0.50 de ejecución. L10: sin bono.
  - L6/7: spot después de aterrizar no se descuenta.
  - El entrenador atrapa a una gimnasta que cae: −0.50 solo por la caída.
- **Estado**: falta (no afecta al SV salvo VOID y el bono).
- **Detección**: flag por salto `spot: 'durante'|'aterrizaje'|'despues'`.
- **Pruebas**:
  1. L9 `4.203` con spot durante el salto → 0 en ese salto. Si el otro salto es válido, cuenta el otro.
  2. L8 `4.203` con spot en el 2.º vuelo → SV 10.0 y −1.00 de ejecución.

### VT‑06 Otros casos VOID (por salto)
- **Fuente**: AP13/AP14; R&P cap. 7 §H.8; OLD VAULT‑7/8.
- **Regla**: cada uno de estos casos deja VOID ese salto:
  - Balk n.º 2 o n.º 3.
  - Descansar o apoyarse sobre la mesa.
  - Sin contacto de manos.
  - No caer primero con los pies:
    - L8‑10: siempre.
    - L6/7: con entrada de paloma.
    - L6, entrada Tsuk o RO: −1.00.
    - L7, entrada Tsuk o RO: sin deducción.
  - Caer sobre la mesa.
  - L6/7: el primer contacto con la pila de colchones es la cabeza o el cuello.
  - L6/7: mortal hecho después de aterrizar.
  - No usar la pila de colchones (L6/7).
  - No usar el safety zone mat en los saltos de rondada (y de paloma al trampolín).
  - Trampolín alternativo.
  - Desde 2026‑27 el juez jefe debe avisar al entrenador de cualquier VOID (MIN26 #11).
- **Estado**: falta.
- **Detección**: casilla "VOID" por salto.
- **Prueba**: L10, 1.er salto VOID y 2.º `4.305` (9.7) → **9.70**.

### VT‑07 Deducciones del juez jefe y ejecución relacionadas (solo aviso)
- **Fuente**: AP13/AP14.
- **Regla**:
  - Saltar sin señal: −0.50 de la media del siguiente salto completado.
  - Entrenador entre el trampolín y la mesa: −0.50 (no aplica en grupos 4/5 ni en entrada RO).
  - Desde 2025‑26: no impulsar el trampolín con los dos pies a la vez, −0.20.
- **Estado**: no aplica al SV.

---
## 3. Barras asimétricas (UB)

### 3.0 Listas de números USAG (de `usag_elementos.json`, por texto)

Varias entradas del catálogo agrupan variantes en un mismo número. Esas variantes llevan la marca **[var]**, y el juez debe elegir la variante.

#### UB‑PERM678: C permitidos en L6, L7 y L8 (valen B)
Fuente: ERC BARS‑1.

**L6** permite **uno solo**, sin giro:
- 3.304: clear hip a parada de manos.
- 6.304: stalder atrás a parada de manos, sin giro [var].
- 7.309: pike sole circle atrás a parada de manos, sin giro [var].
- La entrada 1.315 (salto + clear hip a parada de manos en BS) es dudosa: confirmar.

**L7 y L8** permiten **cualquier número** de estos:
- Los tres de L6.
- Cast a parada de manos con ½ giro.
  - **Error en los datos**: el catálogo pone ese texto dentro de 2.201 B. En USAG es C (ERC lo lista como C permitido). Hay que crear la variante 2.201‑½ = C o usar `r.l='C'`.
- Los mismos círculos con ½ giro **a toma regular**:
  - 3.305: clear hip ½ a toma regular.
  - 6.304 [var ½ regular].
  - 7.309 [var ½ regular].
- Las variantes Healy (1/1 sobre un brazo) que están dentro de 3.305, 6.304 y 7.309 **no** están en la lista: son restringidas en L7/L8 [var].

#### UB‑PERM9‑DE: D/E permitidos en L9 (cuentan como C, cantidad libre)
Fuente: ERC BARS‑1.

La regla: "Any number of B or C root elements with ½ (180°) turn to reverse, L, or mixed‑L grip in HS, or with 1/1 (360°) turn to HS".

Lista propuesta (raíz B/C, con su número):

| Número | Elemento | Raíz |
|---|---|---|
| 3.405 | Clear hip ½ a toma cubital/L | 3.304 |
| 6.404 | Stalder ½ a toma cubital/L; **no** la variante "hop‑grip" | 6.304 |
| 7.409 | Pike sole ½ a toma cubital/L; **no** la variante "hop" | 7.309 |
| 4.403 | Gigante 1/1 | 4.202 |
| 2.403 | Uprise a parada de manos 1/1; **no** McCalla con salto de toma | 2.303 |
| 5.402 | Gigante adelante en toma cubital con 1/1; **no** Galloway | 5.302 |
| 6.401 | Stalder adelante a parada de manos con ½ o 1/1/Healy; no Boniforti | 6.301 |
| 7.408 | Pike sole adelante 1/1 | 7.308 |

- 1.415 (McNamara): dudoso, es una entrada. **Juez**.
- **No** entran (raíz D, o giro de 1½ o más):
  - 7.413, 7.513, 7.412, 7.512;
  - 6.403, 6.503;
  - 4.503, 5.507, 3.505, 2.401, 4.402.

#### UB‑CV10: lista especial de CV +0.20 en L10
Fuente: AP7; EYMAN.

Suelta D/E seguida, **en ese orden**, de un C de parada de manos de los grupos 3/6/7:
- Sueltas de BI a BS: 3.401 (Shaposhnikova/Chorkina), 6.405, 7.410 (Maloney) y 7.510 (Maloney ½).
- Sueltas de BS a BI: 2.406 (Cox), 4.406 (Pak), 4.506 (Pak 1/1) y 5.503 (Ejova).
- C de parada de manos de los grupos 3/6/7: 3.304, 3.305, 6.301, 6.304, 7.308 y 7.309.

#### UB‑VUELO: elementos con vuelo (no salidas)

| Tipo | Números |
|---|---|
| BS→BI | 2.205, 2.305, 2.405, 2.306, 2.406, 3.203, 3.303, 3.403, 3.503, 3.406, 4.204, 4.304, 4.404, 4.504, 4.406, 4.506, 5.303, 5.403, 5.503, 6.302, 6.402, 7.203 (incluye la variante 2026 "a reagarrar BI"), 7.305 |
| BI→BS | 2.202, 2.402, 3.301, 3.401, 3.501, 3.408, 6.305, 6.405, 7.301, 7.310, 7.313, 7.410, 7.510; 3.201 (subbalanceo ½ a BS) es dudoso, lo decide el juez |
| Misma barra | 2.204, 2.304, 2.404, 2.302, 2.502, 3.202, 3.502, 4.405, 4.505, 4.407, 4.507, 5.305, 5.405, 5.505, 5.306, 5.406, 5.404, 5.504, 7.102, 7.202, 7.401, 7.406, 7.407, 7.511 |
| Entradas con vuelo | 1.108, 1.208, 1.209, 1.215, 1.307, 1.310, 1.410, 1.311, 1.411, 1.412, 1.512, 1.413, 1.513 |

#### UB‑CB: cambios de barra

Cuentan, además de los vuelos BS↔BI de UB‑VUELO:
- Kips o entradas con cambio de toma a BS: 1.201, 1.202, 1.204, 1.205, 1.304 y 1.302.
- Cambios de toma a BS: 7.103 [var], 7.104 [var], 7.106 [var], 7.204 y 7.206.
- 6.202 (a colgarse en BI).
- 1.106 [var BS→BI].
- Cast squat/stoop en BI (2.102) y salto a BS: el salto no es un elemento, así que la casilla la marca el juez.

#### UB‑C367: círculos libres de 360° de los grupos 3, 6 y 7 (sin cadera en la barra)

| Grupo | Números |
|---|---|
| 3 | 3.105, 3.204, 3.205, 3.304, 3.305, 3.404, 3.405, 3.505, 3.207, 3.407 |
| 6 | 6.101, 6.201, 6.301, 6.401, 6.501, 6.104, 6.204, 6.304, 6.404, 6.504, 6.303, 6.403, 6.503 |
| 7 | 7.104 y 7.106 (círculos sentada por apoyo libre; los confirma el juez), 7.306, 7.308, 7.408, 7.109, 7.209, 7.309, 7.409, 7.509, 7.412, 7.512, 7.213, 7.413, 7.513, 7.404, 7.504 |

- **No** cuentan:
  - 7.101 (cadera en la barra);
  - 7.102, 7.202 y 7.103 (a parado);
  - las sueltas de los grupos 3, 6 y 7.
- El valor del clear hip depende del ángulo (AP4, OLD BARS‑12):
  - parada de manos (≤20°) = C;
  - de 21° a 45° = B;
  - por debajo de 45°: B con hasta −0.40;
  - con la cadera en la barra = vuelta de cadera atrás A (7.101), que **no** cumple el SR de círculo en L6‑8.

### UB‑6 (Nivel 6)

#### UB‑6‑VP
- **Fuente**: ERC. **Regla**: 4A + 2B, SV 10.00, sin CC ni bono. **Estado**: ok.

#### UB‑6‑R: permitidos y restringidos
- **Fuente**: ERC BARS‑1; EYMAN L6.
- **Regla**:
  - Permitidos: todos los A y B **sin vuelo ni suelta**, más **UN** C de UB‑PERM678 (L6), que vale B.
  - Restringidos (−0.50, sin VP ni SR):
    - cualquier otro C;
    - todos los D y E;
    - **cualquier vuelo o suelta de BS a BI o de BI a BS**, aunque sea A o B.
  - Los A y B con suelta en la misma barra (7.102, 7.202, 2.204) "no están permitidos", pero ERC no los lista como restringidos. **Abierto**: tratarlos como restringidos con aviso.
- **Estado**: **mal**.
  - `creditoUSAG` acepta **cualquier** C como el primero.
  - No restringe los vuelos A/B entre barras.
- **Detección**:
  - `l==='C'`: si `n∈PERM_L6` y aún no se usó → `vp='B'`; si no, `rest`.
  - `l∈{A,B}` y `n∈UB‑VUELO (BS→BI ∪ BI→BS)` → `rest`.
- **Pruebas**:
  1. `1.101, 2.201, 3.304, 7.103, 7.101, 8.103`, con cast ≥45° y todos los SR → **10.00**.
  2. Lo mismo más `6.304` (2.º C) → **9.50**.
  3. Lo mismo con `4.303` en vez de `3.304` (C fuera de la lista): restringido −0.50; falta 1 B (−0.30); falta el círculo 3/6/7 (−0.50) → **8.70**.

#### UB‑6‑SR1: un cast a 45° o más sobre la horizontal
- **Fuente**: ERC; AP8.
- **Regla**: el SR se da cuando el ángulo pasa la horizontal. Las deducciones de ángulo por debajo de 45° se aplican igual.
- **Estado**: manual.
- **Detección**: hay un cast (2.201 o 2.301, o cualquier cast) y la casilla del juez "cast sobre la horizontal". Por defecto se marca si hay 2.201.
- **Prueba**: rutina sin cast a parada de manos y casilla sin marcar → −0.50.

#### UB‑6‑SR2: al menos un cambio de barra
- **Estado**: manual.
- **Detección**: `∃x VP(x) ∧ cambioBarra(x) ∧ !rest`. Ojo: en L6 los vuelos BS↔BI están restringidos, así que el cambio llega por kip con cambio de toma, cast squat‑on y salto, 7.103 [var], etc.
- **Prueba**: rutina toda en BI con salida desde BI → −0.50, y además el VP de la salida es dudoso (las salidas deben hacerse desde la barra indicada; OLD BARS‑6).

#### UB‑6‑SR3: un círculo libre de 360° de los grupos 3/6/7 (sin cadera en la barra)
- **Estado**: manual.
- **Detección**: `∃x VP(x) ∧ circulo367(x)`.
- **Prueba**: solo `7.101` (vuelta de cadera) → −0.50.

#### UB‑6‑SR4: salida en mortal, mínimo A
- **Estado**: **mal**. La autodetección usa solo la letra de la salida y no comprueba que sea mortal.
- **Detección**: última `x` con `e.g===8`, `VP(x)` y `salidaMortalUB(x)`.
- **Prueba**: salida `8.208` (hecht B) → SR4 −0.50. El B sigue contando como VP → **9.50**.

### UB‑7 (Nivel 7)

#### UB‑7‑VP
- 4A + 3B, SV 10.00. **Estado**: ok.

#### UB‑7‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B, más **cualquier número** de C de UB‑PERM678 (L7/8), que valen B.
  - Restringidos: los demás C y todos los D y E.
- **Estado**: **mal**. El editor convierte cualquier C en B y solo pone una nota.
- **Detección**: `l==='C'` → `n∈PERM_L78 ? vp='B' : rest`. En las variantes, usar [var].
- **Pruebas**:
  1. `1.101, 7.103, 2.201, 3.304, 6.304, 7.101, 8.103` → **10.00**.
  2. Igual, pero `4.303` en vez de `6.304`: −0.50 (restringido), −0.30 (falta un B), −0.50 (falta el 2.º círculo) → **8.70**.
  3. Igual, pero `3.405` (D) en vez de `6.304` → **8.70**.

#### UB‑7‑SR1: cast a parada de manos
- **Regla**: el SR se da desde 45°; se aplican las deducciones de ángulo.
- **Estado**: manual.
- **Detección**: 2.201 o 2.301 con VP (la variante ½ es permitida); el ángulo lo confirma el juez.

#### UB‑7‑SR2/3: dos círculos libres de 360° (iguales o distintos)
- **Regla**:
  - a) uno de mínimo B;
  - b) uno de los grupos 3/6/7.
  - Son 2 SR (1.00 en total).
- **Estado**: **mal**. Es una sola casilla con peso 2, todo o nada.
- **Detección**:
  - Hacen falta ≥2 apariciones con VP de `circuloLibre`.
  - SR2a = alguna con `L(x)≥B`.
  - SR3b = alguna `circulo367` distinta de la usada en a).
  - Si solo hay 1 círculo que cumple ambas cosas, falta 1 SR (−0.50).
- **Pruebas**:
  1. `3.304` + `6.304` → los dos SR.
  2. Solo `3.304` y ningún otro círculo → −0.50.
  3. `4.202` (gigante B) + `6.104` (A, grupo 6) → los dos SR.

#### UB‑7‑SR4: salida en mortal, mínimo A
- Igual que UB‑6‑SR4.

### UB‑8 (Nivel 8)

#### UB‑8‑VP
- 4A + 4B, SV 9.80, CC máx. 0.20, sin bono. **Estado**: ok.

#### UB‑8‑R: permitidos y restringidos
- **Regla**:
  - Todos los A y B.
  - **Cualquier número** de UB‑PERM678 (L7/8), que valen B.
  - **UN** C restringido más (cronológico), que vale B.
  - Restringidos: cualquier otro C y todos los D y E.
- **Estado**: **mal**. El editor da `vp='B'` a todo C de UB en L8 (`ub` → `x.vp='B'`) sin límite.
- **Pruebas**:
  1. Rutina base (UB‑8‑CC) más `4.303` (1.er C fuera de la lista, tolerado, vale B) → sin deducción.
  2. Además `5.302` (2.º C fuera de la lista) → −0.50.

#### UB‑8‑SR1: cast a parada de manos
- **Estado**: manual.
- **Detección**: igual que UB‑7‑SR1. TXQRG pide que llegue a menos de 20° para el VP.

#### UB‑8‑SR2/3: dos B (iguales o distintos)
- **Regla**:
  - a) un B con vuelo (no salida) **o** un B con giro LA de 180° o más (no entrada ni salida);
  - b) un B que sea círculo libre de 360° de los grupos 3/6/7 (no salida).
  - "B" significa `L(x)≥B`: un C permitido vale B. Son 2 SR.
- **Estado**: **mal**, por la casilla de peso 2.
- **Detección**:
  - a) `L(x)≥B ∧ (vueloUB(x) ∧ e.g≠8 ∨ giroLA(x) ∧ e.g∉{1,8})`. Cast a parada ½ (C→B) cumple el giro.
  - b) `L(x)≥B ∧ circulo367(x)`.
- **Pruebas**:
  1. `4.204` (vuelo) + `3.304` → los dos.
  2. Sin vuelo B ni giro → −0.50.
  3. `3.205` (clear hip ½ en la subida, B, giro LA) + `6.204` → los dos.

#### UB‑8‑SR4: salida en mortal, mínimo A
- Igual que UB‑6‑SR4.

#### UB‑8‑CC (máx. 0.20)
- **Fuente**: ERC; AP8; EYMAN.
- **Regla**:
  - +0.10 dificultad: conexión directa B+B. **No cuenta 2.201** (cast a parada de manos) como ninguno de los dos.
  - +0.10 salida: salida de B o más, **o** un VP de B o más conectado a una salida A.
- **Estado**: **manual**.
- **Detección**:
  - Dificultad: `∃i r[i].c ∧ L(x_i)≥B ∧ L(x_{i+1})≥B ∧ n∉{2.201}` en ambos, sin `rest` sin crédito.
  - Salida: `d=salida con VP; L(d)≥B ∨ (r[d-1].c ∧ L(x_{d-1})≥B ∧ L(d)='A')`.
  - Caídas: G‑14 dice que el CC se mantiene si hay VP.
- **Pruebas**:
  1. `1.101, 2.201, 3.304+4.202, 4.204, 6.104, 7.101, 7.103, 8.203` → 9.80 + 0.10 + 0.10 = **10.00**.
  2. Igual, con `8.103` (A) aislado como salida → **9.90**.
  3. Igual, con `4.202+8.103` conectados → **10.00**.

### UB‑9 (Nivel 9)

#### UB‑9‑VP
- 3A + 4B + 1C, SV 9.50, CC 0.20, bono 0.30. **Estado**: ok.

#### UB‑9‑R: permitidos, restringidos y DV
- **Regla**:
  - Todos los A, B y C.
  - **Cualquier número** de UB‑PERM9‑DE, que valen C.
  - **UN** D/E restringido (cronológico), que vale C.
  - Restringidos: los D/E adicionales.
  - DV +0.10 solo para el **primer D/E** de la rutina, sea permitido o el restringido.
- **Estado**: **mal**. El editor trata todo D/E de UB como "el restringido": el 2.º D/E permitido se marca como restringido.
- **Detección**:
  - `l∈{D,E}`: si `n∈PERM9` → `vp='C'`.
  - Si no: si `!de9` → `de9=true; vp='C'`; si no → `rest`.
  - DV: al primer `l∈{D,E}` con VP y sin caída ni spot → +0.10.
- **Pruebas**:
  1. `6.304 + 3.405` (permitido) … luego `4.405` (el restringido tolerado) … luego `5.405` → solo `5.405` resta −0.50. DV +0.10 (por 3.405).
  2. `3.405` y `7.409` (los dos permitidos) más `4.405` → sin restringidos.

#### UB‑9‑SR1: al menos dos cambios de barra
- **Estado**: manual.
- **Detección**: cuenta de `cambioBarra(x) ∧ VP(x)` ≥ 2, más las casillas del juez. MIN26 dejó pendiente la definición de "bar change".
- **Prueba**: solo `3.301` (BI→BS) → −0.50.

#### UB‑9‑SR2: un vuelo de mínimo B (no salida)
- **Detección**: `vueloUB ∧ L≥B ∧ e.g≠8`.

#### UB‑9‑SR3: segundo vuelo distinto de mínimo C (no salida), O un giro LA de 180° o más de mínimo B (no entrada ni salida)
- **Detección**:
  - Vuelo: `vueloUB` con número distinto del usado en SR2 y `L≥C` (un D/E vale C).
  - Giro: `giroLA ∧ L≥B ∧ e.g∉{1,8}`.

#### UB‑9‑SR4: salida en mortal, mínimo B
- **Estado**: mal (solo letra).

#### UB‑9‑CV (dentro del bono máx. 0.30)
- **Fuente**: AP7 ("*C+C | C+C; *1 or both w/o turn or flt. must be diff."); EYMAN L9.
- **Regla**:
  - C+C donde uno o los dos **no** tienen giro ni vuelo: +0.10, y los dos elementos deben ser **distintos**.
  - C+C donde **los dos** tienen giro o vuelo: +0.20.
  - D/E cuentan como C.
  - Valen entradas y salidas C o más (OLD BARS‑40 [OLD‑verificar]).
  - Un swing extra entre los elementos rompe la conexión.
- **Estado**: **parcial**. Falta la condición "deben ser distintos" en el caso de +0.10.
- **Detección**:
  - `ft(e) = vueloUB(e) ∨ giroLA(e)`.
  - `L(A)≥C ∧ L(B)≥C`: si `ft(A) ∧ ft(B)` → 0.20; si no, `A.n≠B.n` → 0.10; si no → 0.
- **Pruebas**:
  1. `6.304+6.304` → 0.
  2. `6.304+3.304` → +0.10.
  3. `4.303+4.405` → +0.20.

#### UB‑9‑CC (máx. 0.20)
- **Regla**:
  - +0.10 dificultad: 2 VP distintos de C o más (D/E valen C; la salida no se excluye en AP7).
  - +0.10 salida: salida C o más, **o** un VP C o más conectado a una salida B.
- **Estado**: manual.
- **Pruebas**:
  1. `1.101, 2.201, 3.304, 3.301, 4.202, 4.405, 2.205, 2.102, 7.101, 8.203`, con los SR cumplidos y sin CV.
     - CC dificultad +0.10; CC salida 0 (B aislado); DV +0.10.
     - SV = 9.50 + 0.10 + 0.10 = **9.70**.
  2. Igual, añadiendo `6.304+3.405` conectados antes de `3.301`: el D/E que da DV pasa a ser 3.405, que va primero; CV +0.10.
     - SV = 9.50 + (0.10 CV + 0.10 DV) + 0.10 = **9.80**.

#### UB‑9‑COMP: avisos de composición (no afectan al SV)
- **Fuente**: AP7; MIN25 #10; TXQRG.
- **Avisos**:
  - Mirar en la misma dirección todo el ejercicio (sin contar entrada ni salida): 0.10. Los elementos con 1/1 no cuentan como cambio de dirección.
  - Elementos no característicos: 0.10 c/u.
  - ¾ de gigante adelante: 0.10 c/u.
  - "2 de 4" (sin salida; un elemento cumple una sola opción): 2 de 4 → 0; 1 de 4 → 0.10; 0 de 4 → 0.20. Las 4 opciones:
    1. elemento adelante (círculo o suelta) de mínimo B;
    2. elemento de los grupos 3/6/7 de mínimo B;
    3. giro LA de 180° o más (con o sin vuelo), mínimo C;
    4. suelta de una sola barra, mínimo D.
- **Estado**: falta.
- **Detección**:
  - Adelante: grupos 5 y 6 adelante (6.101‑6.503 "forward") o `/forward/` en el texto.
  - Grupos 3/6/7: `e.g∈{3,6,7}`.
  - Giro LA: `giroLA`.
  - Suelta de una barra: UB‑VUELO de "misma barra".

### UB‑10 (Nivel 10)

#### UB‑10‑VP
- 3A + 3B + 2C, SV 9.20, CC 0.30, bono 0.50. Sin restricciones. **Estado**: ok.

#### UB‑10‑SR

| SR | Requisito | Detección |
|---|---|---|
| SR1 | Vuelo de mínimo C, no salida | `vueloUB ∧ L≥C ∧ e.g≠8` |
| SR2 | Segundo vuelo **distinto** de mínimo B, no salida | número distinto del de SR1 |
| SR3 | Giro LA de mínimo C, sin entrada ni salida | `giroLA ∧ L≥C ∧ e.g∉{1,8}` |
| SR4 | Salida en mortal de mínimo C | `salidaMortalUB ∧ L≥C` |

- **Estado**: SR1‑SR3 manuales; SR4 mal (solo letra).

#### UB‑10‑CV (CV máx. 0.40 dentro del bono de 0.50)
- **Fuente**: AP7; EYMAN; TXQRG.
- **Regla**:

| Conexión | Valor |
|---|---|
| C+C con **los dos** con giro o vuelo | +0.10 |
| C+C de dos círculos **distintos** de los grupos 3/6/7 (no hace falta giro ni vuelo) | +0.10 |
| C+D o D+C (sin requisito de giro ni vuelo) | +0.10 |
| D+D o más | +0.20 |
| Suelta D/E de UB‑CV10 **seguida** de un C de parada de manos de los grupos 3/6/7 | +0.20 (si va al revés no aplica) |
| Cualquier otro C+C | 0 |

- **Estado**: **mal**.
  - C+C da +0.10 siempre (solo con nota).
  - Falta el +0.20 de la lista especial (hoy da +0.10 como C+D).
- **Detección**:
  - `la=L(A)`, `lb=L(B)`.
  - Si `A.n∈CV10_SUELTAS ∧ B.n∈C367_HS` → 0.20.
  - Si `min≥D` → 0.20.
  - Si `min==C ∧ max≥D` → 0.10.
  - Si `C+C ∧ ((ft(A)∧ft(B)) ∨ (circulo367(A)∧circulo367(B)∧A.n≠B.n))` → 0.10.
  - Si no → 0.
- **Pruebas**:
  1. `4.406+3.304` → +0.20.
  2. `3.304+4.406` → +0.10 (C+D).
  3. `6.304+3.304` → +0.10.
  4. `6.304+6.304` → 0.
  5. `4.303+2.305` → +0.10 (giro + vuelo).
  6. `5.402+4.405` → +0.20.

#### UB‑10‑DV
- D +0.10 y E +0.20 (G‑12).

#### UB‑10‑CC (máx. 0.30)
- **Regla**:
  - Dificultad: 2 sueltas D/E **distintas** con VP → +0.20; una sola → +0.10. Las salidas no cuentan.
  - Salida: salida D o más, **o** un D/E conectado a una salida C → +0.10.
- **Estado**: manual.
- **Detección**:
  - Suelta = `vueloUB` no salida (incluye las de BS↔BI, como Pak), con `l∈{D,E}`.
  - Salida: `L(d)≥D ∨ (r[d-1].c ∧ l(x_{d-1})≥D ∧ L(d)='C')`.

#### UB‑10‑PRUEBA completa
- Rutina: `1.101, 2.201, 6.304, 3.301, 4.303+4.405, 4.202+4.406+3.304, 2.102, 4.202+8.403`. Hay 2 cambios de barra y el 4.202 va 2 veces en conexión distinta.
- SR1 3.301; SR2 4.405 o 4.406; SR3 4.303; SR4 8.403 (D).
- CV:
  - 4.303+4.405: C+D → +0.10.
  - 4.202+4.406: B+D → 0.
  - 4.406+3.304: lista especial → +0.20.
  - 4.202+8.403: 0.
  - Total CV = 0.30.
- DV: 4.405 (D) + 4.406 (D) + 8.403 (D) = 0.30. TB = 0.60, bono 0.50.
- CC: 2 sueltas D distintas +0.20; salida D +0.10 → 0.30.
- **SV 10.00**.
- +0.10 extra: TB ≥0.60, CC completo y 4.405 es una suelta D de una sola barra → **10.00 +0.10**.
- Variante: sin `3.304` después del Pak → CV 0.10, TB 0.40, bono 0.40 → SV **9.90**, sin +0.10 extra.

#### UB‑10‑COMP: avisos (no afectan al SV)
- Los de L9.
- Falta de 2 cambios de barra: 0.20 (solo L10).
- Más de un squat/stoop‑on en BI con salto a BS: 0.10 c/u (solo L10; el primero tras una caída no cuenta).
- **Estado**: falta.

### UB‑GEN: reglas propias de barras
- **UB‑GEN‑1**: las salidas deben hacerse desde la barra indicada en la descripción; si no, 0 VP y sin SR4 (OLD BARS‑6). **Estado**: falta. Para la detección hace falta saber la barra.
- **UB‑GEN‑2**: para tener VP:
  - las sueltas de una barra y las de BI a BS deben tocar la barra con 1 o 2 manos;
  - las de BS a BI deben tocar BI **con las dos manos** (TXQRG).
  - **Estado**: requiere la casilla `inc`.
- **UB‑GEN‑3**: 2.205 (contraswing a BI) recibe C si sigue directo a una suelta D; 4.204 recibe C si va conectado directo a una suelta D o E (OLD BARS‑15/16 [OLD‑verificar]). **Estado**: falta (afecta a VP y CV).
- **UB‑GEN‑4**: un uprise a apoyo libre (2.203 B) seguido directo de un círculo 3/6/7 a parada de manos puede contarse como B + C o como un solo C, lo que más convenga a la gimnasta. **Estado**: falta.

---
## 4. Viga (BB)

### 4.0 Comunes a L6‑10

#### BB‑G‑1: tipo de elemento (danza o acro)
- **Fuente**: OLD BEAM‑45 (leyenda de las entradas).
- **Regla**:
  - Las entradas marcadas `(D)` son danza.
  - Las marcadas `(NA)` no son acro: cuentan para VP, pero no para restricciones ni CC acro.
  - El resto de las entradas son acro.
  - Los grupos 2, 3 y 4 son danza.
- **Estado**: **mal**. `el()` trata todo el grupo 1 como acro. Afecta a:
  - el "un C de danza" de L6;
  - el "un C acro" de L8;
  - el D/E acro de L9;
  - el CC y la dirección.
- **Detección**: el texto `en` empieza con `(D)` o `(NA)` (ver 1.101‑1.106 y 1.203‑1.206 en los datos).
- **Prueba**: L6 con `1.305 (D)` C de danza + `2.305` C de danza → el 2.º es restringido (−0.50).

#### BB‑SR2: un salto o leap con 180° de split cruzado o lateral (L6‑10)
- **Fuente**: ERC; OLD BEAM‑17/20.
- **Regla**:
  - Debe tener ≥135° de apertura y empezar y terminar sobre la viga, aislado o en serie.
  - En posición cruzada, la pierna delantera debe ir extendida (un stag delantero no cuenta).
  - 2.105 (cambio de piernas a wolf) no cuenta.
- **Estado**: manual.
- **Detección**: `salto180BB(x) ∧ VP(x)`, más la confirmación del juez (≥135°).
- **Pruebas**:
  1. `2.201` → sí.
  2. Solo `2.101` (stag) → −0.50.

#### BB‑SR3: giro de 360° o más sobre un pie, grupo 3 (L6‑10)
- **Regla**: si le faltan 90° o más de giro, recibe un VP menor o ninguno; sin VP no hay SR. El 3.505 (illusion 1/1, E) cuenta en L9/10.
- **Estado**: manual.
- **Detección**: `giro360BB(x) ∧ VP(x)`.
- **Prueba**: solo `3.305` (illusion ½) → −0.50.

#### BB‑SR4: salida aérea o en mortal
- **Mínimo por nivel**:

| Nivel | Mínimo |
|---|---|
| L6, L7, L8 | A |
| L9 | B |
| L10 | C, o B conectada directo a una serie acro con un C, o a un vuelo acro o elemento de danza de mínimo C |

- **Estado**: **mal**. La autodetección acepta cualquier salida del grupo 9 por su letra, incluso una paloma (9.101) o una rueda (9.103), y no ve la alternativa de L10.
- **Detección**:
  - Última `d` con `salidaAereaMortalBB(d) ∧ VP(d) ∧ L(d)≥min`.
  - L10, alternativa: `L(d)='B' ∧ r[d-1].c ∧ (L(x_{d-1})≥C ∧ (vueloBB ∨ danzaBB) ∨ (la cadena anterior es serie acro con algún L≥C))`.
- **Pruebas**:
  1. L7 con salida `9.101` (paloma A) → −0.50.
  2. L10 `7.403 (D) + 7.208 (B) + 9.206 (B)` → SR4 cumplido (OLD BEAM‑18, ejemplo 2).
  3. L10 `2.305 (C) + 9.208 (B gainer 1/1)` → cumplido.

#### BB‑COMP (L8‑10): avisos de composición (no afectan al SV)
- **Fuente**: AP7/AP8.
- **Avisos**:
  - Acro en una sola dirección (atrás vs. adelante/lateral): 0.10. Si la única otra dirección está en la salida: 0.05.
  - Más de un pivote ½ con pierna recta: 0.10.
  - Más de 2 elementos de danza con la misma forma: 0.10 por tipo (agrupado/lobo; abierto).
  - Falta serie de danza (2 elementos de los grupos 1D, 2 o 3 conectados; la entrada vale): 0.20.
- **Estado**: falta.
- **Detección**:
  - Dirección:
    - atrás = `/backward\|flic\|gainer/`;
    - adelante = `/forward\|handspring\|aerial walkover/`;
    - lateral = `/cartwheel\|round.off\|sideward/`.
  - Formas: según §0.4.
  - Serie de danza: `∃ r.c` con los dos elementos `danzaBB`.

### BB‑6 (Nivel 6)

#### BB‑6‑VP
- 4A + 2B, SV 10.00. **Estado**: ok.

#### BB‑6‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B, más **UN** C de danza (cronológico), que vale B.
  - Restringidos: los C de danza adicionales y todos los C/D/E acro, incluidas entradas y salidas.
- **Estado**: ok, salvo la clasificación de las entradas (BB‑G‑1).
- **Prueba**: `2.305` (C danza, permitido) + `2.307` (2.º C) + `8.303` (C acro) → −1.00.

#### BB‑6‑SR1: serie acro sin vuelo, O un elemento acro con vuelo (aislado o conectado)
- **Regla**:
  - No cuentan la entrada ni la salida.
  - La serie tiene 2 elementos A o B y uno debe pasar por la parada de manos invertida.
  - Una parada de manos sin giro y sin 2 s de mantenimiento no tiene VP ni da la serie.
- **Estado**: manual.
- **Detección**:
  - `∃ i: r[i].c ∧ acroBB(x_i) ∧ acroBB(x_{i+1}) ∧ !dmt ∧ e.g≠1 ∧ (alguno pasa por parada de manos: grupo 7 o 5.x "handstand" o 6.204)`;
  - o `∃ vueloBB(x) ∧ e.g∉{1,9}`.
- **Pruebas**:
  1. `7.104+7.104` → sí.
  2. Solo `7.208` aislado → sí.
  3. Solo `6.104+6.104` (rodadas sin parada de manos) → −0.50.

#### BB‑6‑SR4
- Salida aérea o en mortal, mínimo A (BB‑SR4).

#### BB‑6‑PRUEBA
- `1.104 (D, A), 2.201 (B), 3.101 (A), 7.104+7.104 (A+A), 2.207 (B), 2.110 (A), 9.106 (A)` → **10.00**.
- Si se agrega `8.303` → **9.50**.

#### BB‑6‑CORTO
- Ver G‑08: menos de 30 s, completa y con SV 10.0 → −0.50 (juez jefe).

### BB‑7 (Nivel 7)

#### BB‑7‑VP
- 4A + 3B, SV 10.00.

#### BB‑7‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B y **todos** los C de danza (valen B).
  - Restringidos: los D/E de danza y los C/D/E acro.
- **Estado**: ok.

#### BB‑7‑SR1: serie acro (con o sin vuelo) Y un elemento acro con vuelo (aislado o conectado)
- **Regla**:
  - No cuentan la entrada ni la salida.
  - Las dos cosas son **un solo SR** (−0.50 si falta cualquiera). Puede ser la misma serie si incluye vuelo (p. ej., `7.104+7.208`).
  - Los rollos pueden ir en la serie si un elemento pasa por la parada de manos.
- **Estado**: manual.
- **Pruebas**:
  1. `7.104+7.104` y `7.208` aislado → sí.
  2. `7.104+7.104` y ningún vuelo → −0.50.
  3. `7.208+7.208` → sí.

#### BB‑7‑PRUEBA
- `1.104, 2.201, 2.305 (C→B), 3.101, 7.104+7.208, 2.110, 9.106` → A: 1.104, 3.101, 7.104, 2.110, 9.106; B: 2.201, 2.305, 7.208 → **10.00**.

### BB‑8 (Nivel 8)

#### BB‑8‑VP
- 4A + 4B, SV 9.80, CC 0.20.

#### BB‑8‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B, todos los C de danza (valen B) y **UN** C acro restringido, incluidas entrada y salida (cronológico, vale B).
  - Restringidos: los D/E de danza, los C acro adicionales y todos los D/E acro.
- **Estado**: ok, salvo BB‑G‑1.
- **Pruebas**:
  1. `8.303` (1.er C acro) → vale B.
  2. Luego `8.304` → −0.50.
  3. `2.401` (D de danza) → −0.50.

#### BB‑8‑SR1: serie acro de 2 elementos, uno con vuelo (sin entrada ni salida)
- **Regla**:
  - Una parada de manos con 2 s de mantenimiento solo puede ir como **último** elemento de la serie.
  - Un elemento acro sin vuelo (walkover atrás) puede ir primero o segundo.
  - Rollos sin vuelo: válidos solo en L8.
- **Detección**: `∃ r[i].c ∧ acroBB(x_i) ∧ acroBB(x_{i+1}) ∧ (vueloBB(x_i) ∨ vueloBB(x_{i+1}))`, sin entrada ni salida.
- **Prueba**: `7.104+7.208` → sí.

#### BB‑8‑CC (máx. 0.20)
- **Regla**:
  - +0.10: serie acro directa B+B, **los dos con vuelo**.
  - +0.10: salida de B o más, **o** un acro B conectado a una salida en mortal A.
- **Estado**: manual.
- **Detección**:
  - Serie: `r.c ∧ vueloBB(x_i) ∧ vueloBB(x_{i+1}) ∧ L≥B` en ambos.
  - Salida: `L(d)≥B ∨ (r[d-1].c ∧ acroBB(x_{d-1}) ∧ L≥B ∧ mortalBB(d) ∧ L(d)='A')`.
  - Excepción (TXQRG): el elemento previo puede no tener VP por ser la 3.ª repetición.
- **Pruebas**:
  1. `1.104, 2.201, 2.207, 3.101, 7.104, 7.208+7.208, 2.110, 9.206` → A: 1.104, 3.101, 7.104, 2.110; B: 2.201, 2.207, 7.208, 7.208 (2.ª en conexión distinta), 9.206.
     - SR1: `7.208+7.208` cumple (los dos con vuelo); `7.104+7.208` también serviría.
     - CC 0.20 → **10.00**.
  2. Con `9.106 (A)` aislado → **9.90**.
  3. `7.208+9.106` → **10.00**.

### BB‑9 (Nivel 9)

#### BB‑9‑VP
- 3A + 4B + 1C, SV 9.50, CC 0.20, bono 0.30.

#### BB‑9‑R: permitidos, restringidos y DV
- **Regla**:
  - Permitidos: todos los A, B y C y todos los D/E de danza (valen C, **sin DV**).
  - **UN** D/E acro restringido, incluidas entrada y salida (vale C, da DV +0.10).
  - Restringidos: los D/E acro adicionales.
- **Estado**: ok, salvo BB‑G‑1.
- **Pruebas**:
  1. `8.404` (D, 1.º) → vale C y +0.10 de DV.
  2. Luego `9.406` (D) → −0.50 y sin VP; el SR4 tendría que cumplirlo otro elemento.

#### BB‑9‑SR1: serie acro con al menos 2 vuelos directos (sin entrada ni salida)
- **Detección**: `∃ r[i].c ∧ vueloBB(x_i) ∧ vueloBB(x_{i+1})`, sin entrada ni salida.
- **Pruebas**:
  1. `7.104+7.208` → **−0.50**.
  2. `7.208+7.208` → sí.

#### BB‑9‑SR4
- Salida aérea o en mortal, mínimo B.

#### BB‑CV (L9 y L10; bono)
- **Fuente**: AP7; EYMAN; TXQRG.
- **Regla**:

| Tipo | +0.10 | +0.20 |
|---|---|---|
| Acro con vuelo, 2 elementos (sin salida) | B + C, donde el **C es mortal o aéreo** (EYMAN/TXQRG: "B+C salto") | B+D/E; C+C; C+D (incluye C+E y D+D) |
| Acro con vuelo, 3 elementos (TXQRG: incluye la salida; las entradas valen) | B+B+C | B+C+C; B+B+D |
| Danza o mixto, 2 elementos (sin salida) | A+D; B+C | B+D; C+C/D |
| Giros sobre un pie | A+C o C+A | — |

- **Serie extra**: +0.10 adicional por una serie acro de 3 elementos con vuelo que tenga mínimo un mortal o aéreo C, o un vuelo D/E (con o sin apoyo). La salida no cuenta; la entrada sí.
- En L9, los D/E (danza permitida y el 1.er acro) valen C.
- Una caída o spot en cualquiera de los elementos anula el CV.
- **Abierto**: si una serie de 3 recibe el valor de 3 elementos **o** la suma de sus pares.
  - Propuesta: cada cadena recibe el máximo entre (valor de 3 elementos + serie extra) y la suma de pares sin solapamiento.
  - Lo confirma el juez con `cvm`.
- **Estado**: **parcial / mal**.
  - 2 elementos con vuelo: B+C da 0.10 aunque el C no sea mortal ni aéreo (p. ej., `7.308` flic con un brazo).
  - Falta todo el CV de 3 elementos y la serie extra.
  - `vueloBB` no reconoce `7.503` (butterfly), `7.203` (rueda con vuelo) ni `6.201` (dive roll).
  - Danza o mixto y giros: ok.
- **Pruebas**:
  1. L9 `7.208+8.404 (D→C)` → B+C mortal → +0.10.
  2. L10 `7.208+7.308` → B+C sin mortal → 0.
  3. L10 `7.208+7.208+8.404` → B+B+D → +0.20, más la serie extra +0.10.
  4. L10 `2.305+2.402` → C+D → +0.20.
  5. L10 `3.101+3.303` → A+C giros → +0.10.

#### BB‑9‑CC (máx. 0.20)
- **Regla**:
  - +0.10: 2 VP acro **distintos** de C o más, sin salida. EYMAN dice "acro con vuelo"; AP7 dice "Acro VP": se usa AP7 con aviso.
  - +0.10: salida C o más, **o** un vuelo acro de mínimo B o un elemento de danza C conectado directo a una salida B.
- **Estado**: manual.
- **Prueba**:
  - `1.104 (A), 2.305+2.307 (C+C de danza: CV +0.20), 2.201 (B), 3.101 (A), 7.208+8.404 (B+D→C: CV +0.10), 8.303 (C), 7.104 (A), 9.306 (C)`.
    - VP: A 1.104, 3.101, 7.104; B 2.201, 7.208 y las C sobrantes; C de sobra.
    - SR1: `7.208+8.404`.
    - CC: 8.404 y 8.303 → +0.10; salida C → +0.10.
    - Bono: CV 0.30 y DV 0.10 → tope 0.30.
    - SV = 9.50 + 0.30 + 0.20 = **10.00**.

### BB‑10 (Nivel 10)

#### BB‑10‑VP
- 3A + 3B + 2C, SV 9.20, CC 0.30, bono 0.50. Sin restricciones.

#### BB‑10‑SR1: serie acro con al menos 2 vuelos directos, uno de mínimo C, O un acro A sin vuelo del grupo 7 conectado directo a un vuelo acro E
- **Regla**: la entrada y la salida no cuentan; el C puede ser con o sin apoyo de manos.
- **Detección**:
  - Alternativa 1: `∃ par c: vueloBB ∧ vueloBB ∧ max(l)≥C`.
  - Alternativa 2: `x_i.g===7 ∧ l==='A' ∧ !vueloBB(x_i) ∧ r[i].c ∧ vueloBB(x_{i+1}) ∧ l==='E'`.
- **Pruebas**:
  1. `7.208+7.208` → −0.50.
  2. `7.104+7.508 (E Kochetkova)` → sí.

#### BB‑10‑SR4
- Ver BB‑SR4 (mínimo C o la alternativa B conectada).

#### BB‑10‑CC (máx. 0.30)
- **Regla**:
  - +0.20: 2 acro D/E **distintos**, sin salida (TXQRG: "acro flight"). Con uno solo: +0.10.
  - +0.10: salida D/E, **o** un vuelo acro B o un elemento de danza C conectado directo a una salida C.
  - EYMAN: un VP con caída o spot al aterrizar la salida también cumple el +0.10 de salida.
- **Estado**: manual.

#### BB‑10‑PRUEBA
- Rutina: `1.104 (A), 2.305+2.402 (C+D: +0.20), 3.406 (D), 7.208+7.208+8.404 (B+B+D: +0.20, más serie extra +0.10), 7.403 (D), 7.104 (A), 2.110 (A), 9.406 (D)`.
  - VP: A 1.104, 7.104, 2.110; B 7.208 ×2 y uno más (los D/E cubren); C de sobra.
  - SR: 1 `7.208+8.404` (con C); 2 `2.305`; 3 `3.406`; 4 `9.406`.
  - CV = 0.50. DV = 2.402, 3.406, 8.404, 7.403 y 9.406 = 0.50 (D/E de danza incluidos, G‑12). TB 1.00 → bono 0.50.
  - CC: `8.404` y `7.403` → +0.20; salida D → +0.10.
  - **SV 10.00**, **sin** +0.10 extra (no hay acro E).
- Con `7.503 (E butterfly)` en lugar de `7.403` → **10.00 +0.10**.

### BB‑GEN: reglas propias de viga
- **BB‑GEN‑1**: desde 2026‑27, el requisito de 180° en los walkovers no aplica dentro de una serie acro (DEVUPD, MIN26 #7). Afecta a la ejecución, no al SV.
- **BB‑GEN‑2**: un vuelo sin vuelo real se reconoce como el elemento sin vuelo (flic sin vuelo = walkover A) (OLD BEAM‑11). **Estado**: falta; requiere `r.l` o un cambio de elemento.
- **BB‑GEN‑3**: un elemento de 2 s de mantenimiento que no se mantiene recibe el valor del elemento raíz (OLD BEAM‑11). Lo resuelve el juez.

---

## 5. Suelo (FX)

### 5.0 Comunes

#### FX‑G‑1: qué es mortal, aéreo y pase
- **Fuente**: ERC; OLD FLOOR‑17/18/23.
- **Regla**:
  - Los aéreos (`aereoFX`) no son mortales.
  - Un mortal que cae sentado, prono o en split‑sit no cuenta como mortal.
  - Un elemento de danza dentro de un pase rompe la conexión indirecta.
  - Un acro dentro de un pasaje de danza lo rompe.
  - Impulso fuera de la línea: sin VP, SR ni bono.
- **Estado**: **parcial**. `esSaltoFX` usa `g>=6`, lo que es correcto. Falta la ruptura de pases y la regla del aterrizaje.

#### FX‑SR3: pasaje de danza (L6‑10)
- **Regla**:
  - Mínimo 2 elementos **distintos** del grupo 1, conectados directa o indirectamente (carreras, chassé).
  - Uno debe ser **leap** (despegue de un pie) con 180° cruzado o lateral.
  - Split leap y stag leap cuentan como el mismo elemento (1.101).
  - Un acro intermedio rompe el pasaje.
  - L8: un D/E de danza no puede usarse (es restringido).
  - El segundo elemento puede caer en prono o split‑sit.
- **Estado**: manual.
- **Detección**: `∃ r[i].c ∧ g1(x_i) ∧ g1(x_{i+1}) ∧ n_i≠n_{i+1} ∧ (leap180FX(x_i) ∨ leap180FX(x_{i+1}))`, ambos con VP.
- **Pruebas**:
  1. `1.204+1.110` → sí.
  2. `1.116+1.207` (wolf + straddle, sin leap) → −0.50.
  3. `1.101+1.101` (split + stag) → −0.50.

#### FX‑SR4 (L6/L7): giro de 360° o más sobre un pie
- **Detección**: `giro1pieFX(x) ∧ VP(x)`.

#### FX‑COMP (L8‑10): avisos de composición (no afectan al SV)
- **Fuente**: AP7/AP8; MIN25 #15.
- **Avisos**:
  - Mortales en una sola dirección (el árabe cuenta como adelante): 0.10.
  - Más de 2 elementos de danza con la misma forma: 0.10 por tipo.
  - Falta un giro sobre un pie de mínimo B: 0.20.
  - Falta un mortal de mínimo B (L8), C (L9) o D (L10) en el ejercicio: 0.20.
- **Estado**: falta.

### FX‑6 (Nivel 6)

#### FX‑6‑VP
- 4A + 2B, SV 10.00.

#### FX‑6‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B y **UN** C de danza (vale B).
  - Restringidos: los C de danza adicionales y todos los C/D/E acro.
- **Estado**: ok.

#### FX‑6‑SR1: un pase acro con al menos 2 vuelos directos, uno de ellos mortal
- **Detección**: cadena directa (sin `ind`) con ≥2 `vueloFX` consecutivos (`c=true`) y algún `saltoFX`.
- **Prueba**: `5.105+5.106+8.101` → sí.

#### FX‑6‑SR2: segundo pase con un mortal **distinto**, al menos 2 vuelos directos con uno mortal, O un mortal B aislado
- **Detección**:
  - Otra cadena que cumple SR1 y cuyo mortal tiene un número distinto de los de la primera;
  - o un `saltoFX` con `L≥B` y sin conexiones (`!r[i-1].c ∧ !r[i].c`).
- **Pruebas**:
  1. `5.102+6.101` → sí.
  2. Un segundo `5.105+5.106+8.101` (mismo mortal) → −0.50.
  3. `6.201` (B) aislado → sí.

#### FX‑6‑PRUEBA
- `5.105+5.106+8.101 (A,A,A); 5.102+6.101 (A,A); 1.204+1.110 (B+A); 1.209 (B); 2.101 (A)` → **10.00**.
- Si se agrega `8.301` (C acro) → **9.50**.

### FX‑7 (Nivel 7)

#### FX‑7‑VP
- 4A + 3B, SV 10.00.

#### FX‑7‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B y todos los C de danza (valen B).
  - Restringidos: los D/E de danza y los C/D/E acro.
- **Estado**: ok.

#### FX‑7‑SR1/2: al menos dos pases acro (2 SR)
- **Regla**:
  - Un pase con mortal **atrás** y al menos 2 vuelos directos.
  - Un pase con mortal **adelante** (se permiten otros elementos).
  - Un mortal (adelante o atrás) **extendido, sin giro**, con llegada a dos pies.
- **Abierto**: cómo se reparten los 2 SR. Propuesta:
  - −0.50 por cada condición que falte, con un máximo de −1.00;
  - hoy el editor resta 1.00 todo o nada.
- **Estado**: **mal** (peso 2 todo o nada) y manual.
- **Detección**:
  - Pase atrás: cadena con `dirFX='atrás'`.
  - Pase adelante: cadena con un `saltoFX` adelante.
  - Extendido: 8.101 o 6.201 con la variante "stretched sin giro" y la confirmación de llegada a 2 pies → casilla [var].
- **Pruebas**:
  1. `5.105+5.106+8.101 (extendido)` y `5.102+6.101` → los dos SR.
  2. Igual, pero `8.101` agrupado y sin otro extendido → −0.50.

#### FX‑7‑PRUEBA
- `5.105+5.106+8.101 ext; 5.102+6.101; 1.204+1.110; 1.304 (C→B); 1.209; 2.101` → A: RO, FF, 8.101, 5.102, 6.101, 1.110, 2.101; B: 1.204, 1.304, 1.209 → **10.00**.

### FX‑8 (Nivel 8)

#### FX‑8‑VP
- 4A + 4B, SV 9.80, CC 0.20.

#### FX‑8‑R: permitidos y restringidos
- **Regla**:
  - Permitidos: todos los A y B, todos los C de danza (valen B) y **UN** C acro restringido (cronológico, vale B).
  - Restringidos: todos los D/E de danza, los C acro adicionales y todos los D/E acro.
- **Estado**: ok.

#### FX‑SR1 (L8‑10): pase acro con al menos 2 mortales (iguales o distintos)
- **Regla**: los mortales van conectados directo, o indirectamente mediante vuelos (con o sin apoyo de manos).
- **Detección**: `pase` (cadena con `c`, que puede incluir `ind`) sin danza intermedia y con ≥2 `saltoFX`.
- **Pruebas**:
  1. `5.105+5.106+8.201 ind 5.106+8.101` → sí.
  2. `5.105+5.106+8.403+1.207+6.101` → −0.50 (el salto de danza rompe el pase).

#### FX‑SR2 (L8‑10): tres mortales distintos (no aéreos)
- **Detección**: ≥3 números distintos con `saltoFX ∧ VP`.
- **Prueba**: `8.101, 8.101, 6.101` → −0.50.

#### FX‑SR4 (L8‑10): el último pase acro iniciado debe tener un mortal de mínimo A (L8), B (L9) o C (L10)
- **Regla**:
  - Si el último mortal no tiene VP (3.ª vez, restringido, spot o no cae de pie), el SR no se cumple.
  - Si nunca inicia el último mortal, la deducción de −0.30 se eliminó (G‑09).
  - Un aéreo o un mortal a sentado después del último mortal no cuentan como "pase".
- **Estado**: **falta** (el texto del SR no coincide con la expresión regular de la salida).
- **Detección**: el último `pase` que contiene algún `saltoFX` o `vueloFX`; se toma `max(L(saltoFX con VP))` dentro de él y se compara con el mínimo.
- **Pruebas**:
  1. L9, último pase `5.105+5.106+8.201 (B)` → sí.
  2. L10, mismo pase → −0.50.
  3. L9, último pase `5.105+5.106+8.401` cuando es el 2.º D/E acro restringido → −0.50 (SR) y −0.50 (restringido).

#### FX‑8‑CC (máx. 0.20)
- **Regla**:
  - +0.10 acro: 2 mortales **distintos** de B o más, **y** 1 mortal A (un tercero, de A o más).
  - +0.10 danza: 2 VP de danza **distintos** de B o más (un C de danza vale B).
- **Estado**: manual.
- **Prueba**:
  - `5.105+5.106+8.201 ind 5.106+8.101; 6.201+6.101; 1.204+1.207; 2.201; 5.105+8.101`.
    - El último `8.101` es su 2.ª vez, en una conexión distinta: RO‑8.101 frente a FF‑8.101. Así que sí tiene VP.
    - Si el último pase fuera `5.105+5.106+8.101`, tendría la misma conexión que la primera vez (precedido de FF), no tendría VP y faltaría el SR4.
    - SR: 1 sí; 2 (8.201, 8.101, 6.201, 6.101) sí; 3 sí; 4 sí.
    - CC 0.20 → **10.00**.

### FX‑9 (Nivel 9)

#### FX‑9‑VP
- 3A + 4B + 1C, SV 9.50, CC 0.20, bono 0.30.

#### FX‑9‑R: permitidos, restringidos y DV
- **Regla**:
  - Permitidos: todos los A, B y C y todos los D/E de danza (valen C, sin DV).
  - **UN** D/E acro (vale C, DV +0.10).
  - Restringidos: los D/E acro adicionales.
- **Estado**: ok.

#### FX‑CV (L9 y L10)
- **Fuente**: AP7; TXQRG; EYMAN.
- **Regla**:

| Tipo | +0.10 | +0.20 |
|---|---|---|
| Acro indirecta (mortales unidos por RO/FF/whip) | A/B+A/B+C; B+C; A+D | C+C; A+E; B/C+D/E; A+A+D |
| Acro directa | B+B; A+C; A+A+C | B+C; C+C; A+A+D; A/B+D/E |
| Danza o mixto | B+D; C+C; mortal D/E + salto (grupo 1) de A o más | C+D/E |

- No hay bono por giro + salto de danza (EYMAN). Un salto que sale de 2 pies y cae en 1 vale para la conexión.
- En L9, los D/E valen C.
- **Abierto**: si en la directa cuentan como "A" los vuelos con apoyo (RO, FF). Propuesta: solo mortales (`saltoFX`), como hoy.
- **Estado**: **parcial / mal**.
  - 2 elementos (directa e indirecta): ok.
  - Falta el CV de 3 elementos (A/B+A/B+C, A+A+C, A+A+D).
  - Danza: acepta giros del grupo 2 (`danza` incluye `g===2`) → mal. Debe ser solo el grupo 1.
  - "Mortal D/E + salto": acepta giros → mal.
- **Pruebas**:
  1. L9 `6.101+6.301` directa → +0.10.
  2. L9 `8.301 ind 8.403 (D→C)` → C+C indirecta → +0.20.
  3. L10 `8.403+1.110` → D + salto A → +0.10.
  4. L10 `2.301+1.304` → giro + salto → 0.
  5. L10 `8.102+8.102+8.403` directa → A+A+D → +0.20.

#### FX‑9‑CC (máx. 0.20)
- **Regla**:
  - +0.10: 2 mortales **distintos** de C o más **y** 1 mortal B.
  - +0.10: 2 VP de danza **distintos** de C o más.
- **Estado**: manual.
- **Prueba**:
  - `5.105+5.106+8.301 ind 5.106+8.403 (D restringido →C)`, CV +0.20, DV +0.10; `6.101+6.301`, CV +0.10; `1.304+1.311`, C+C de danza, CV +0.10; `8.201`; `2.201`; `5.105+5.106+8.201`.
    - CV 0.40 + DV 0.10 → bono tope 0.30.
    - CC: 8.301, 6.301 (C) + 8.201 (B) → +0.10; danza 1.304 y 1.311 → +0.10.
    - SR4: el último pase tiene `8.201 (B)`, cumple en L9.
    - **SV 10.00**.

### FX‑10 (Nivel 10)

#### FX‑10‑VP
- 3A + 3B + 2C, SV 9.20, CC 0.30, bono 0.50.

#### FX‑10‑SR
- Los de FX‑SR1‑4, con el último mortal de mínimo C.

#### FX‑10‑CC (máx. 0.30)
- **Regla**:
  - Acro +0.20: 2 mortales D o más **distintos** + 1 mortal C o más, **o** 1 mortal E + 1 mortal D.
  - Acro +0.10 (si no llega a 0.20): 2 mortales D distintos, **o** 1 E + 1 C.
  - Danza +0.10: 3 VP de danza C **distintos**, **o** 1 D de danza + 1 C o más.
- **Estado**: manual.
- **Pruebas**:
  1. `8.403 (D), 6.401 (D), 8.301 (C)` → +0.20.
  2. `8.503 (E), 8.301 (C)` → +0.10.
  3. `1.407 (D) + 1.304 (C)` → danza +0.10.

#### FX‑10‑PRUEBA
- `5.105+5.106+8.503 (E) ind 5.106+8.301 (C)`, indirecta C+E → +0.20; `6.101+6.401 (A+D)`, directa → +0.20; `1.304+1.407 (C+D)`, danza → +0.20; `2.301 (C)`; `5.105+5.106+8.403 (D)`, último pase.
  - CV 0.60; DV: 8.503 (+0.20), 6.401 (+0.10), 1.407 (+0.10), 8.403 (+0.10) = 0.50. TB 1.10 → bono 0.50.
  - CC: acro (E + D) → +0.20; danza (D + C) → +0.10.
  - VP: A RO, FF, 6.101; B ninguno → los C sobrantes los cubren.
  - **SV 10.00 +0.10** (acro E 8.503).
- Con `6.501` como único E → sin +0.10.

---
## 6. Preguntas abiertas: respuestas y cosas por confirmar

1. **¿Qué salto cuenta?**
   - En L6‑10 se permiten 2 saltos, iguales o distintos, con 3 carreras, y **cuenta la mejor nota**.
   - En L6‑9, un salto restringido anula **todo el evento**. En L10, un salto VOID anula solo ese salto.
   - Fuentes: ERC VAULT‑1 y R&P cap. 7 (§H.2.b, §J.3.c). XCOP VAULT‑4 lo dice textualmente.
   - El texto del Dev COP 2026‑30 es de pago y no se tiene; la regla de XCOP coincide con todo lo público.
2. **Valor del E en L10 (2026‑30)**:
   - Ninguna fuente pública 2026 da el número. AP11 tiene casillas D, E y DV; ERC y AP7 hablan de "DV" sin cifras para L10.
   - La única cifra es OLD (2022‑26): E = +0.20 en L10 y +0.10 en L9. Se mantiene +0.20 con aviso.
   - Los ejemplos de AP7, EYMAN y TXQRG funcionan con +0.20 o con +0.10 (todos llegan al tope de 0.50).
3. **¿Algo nuevo publicado desde agosto de 2026?**
   - Solo las minutas del WPC del 8‑ago‑2026, de gobernanza y sin cambios técnicos.
   - Los PDF técnicos en línea son idénticos a los locales (md5).
4. **Por confirmar con el COP 2026‑30 o con un juez**:
   - (a) Cómo se reparten los SR de peso 2 (UB L7/L8 2/3; FX L7 1/2). Propuesta: 0.50 por cada parte que falte.
   - (b) CV de series de 3 elementos frente a la suma de pares.
   - (c) Si en el CV directo de FX cuentan como "A" el RO y el FF.
   - (d) DV de danza en L10.
   - (e) Qué es un cambio de barra (acción pendiente de MIN26).
   - (f) Sueltas A/B en la misma barra en L6.
   - (g) Si el grupo 5 de BB (equilibrios) es acro.
   - (h) Variantes que el catálogo agrupa: 2.201 cast ½ (C en USAG); Healy dentro de 3.305/6.304/7.309; 6.301 Healy subido a D (MIN25 #9).
   - (i) BB‑9‑CC: "acro" o "acro con vuelo".

## 7. Cambios prioritarios en `editor.js`

**Prioridad alta** (cambian el SV en rutinas comunes):

1. **VT‑03**: en L6‑9, si cualquier salto no está en `USV[L]`, `np=0` y el aviso "Evento VOID". Hoy se toma el otro salto.
2. **UB‑6/7/8‑R**:
   - Listas `PERM_L6` y `PERM_L78` (3.304, 6.304, 7.309, 3.305, cast ½).
   - L6: restringir los vuelos A/B entre barras.
   - L7: restringir los C que no están en la lista.
   - L8: lista + un solo C tolerado.
   - Hoy L7/L8 convierten **cualquier** C en B.
3. **UB‑9‑R**: lista `PERM9` (D/E permitidos, cantidad libre), un D/E restringido aparte, y DV al primer D/E de cualquier tipo.
4. **G‑07, repetición**:
   - Dar VP a la 2.ª aparición si su firma de conexión es distinta.
   - Quitar la lógica `used` de FIG en el CV de USAG.
   - L10: DV una sola vez por elemento.
5. **SR4 de salida en UB/BB**: exigir mortal o aéreo (`salidaMortalUB`, `salidaAereaMortalBB`), no solo la letra. Añadir la alternativa B‑conectada de L10 BB.
6. **G‑10, flags `inc` / `spotE` / `spotL`**: quitar VP, SR y CC cuando no cae de pie o hay ayuda durante el elemento. Hoy una caída conserva el VP.
7. **UB‑10‑CV**:
   - C+C solo con giro o vuelo en los dos, o con dos círculos 3/6/7 distintos.
   - +0.20 para la lista D/E suelta → C de parada de manos 3/6/7.
8. **BB‑CV**:
   - B+C solo si el C es mortal o aéreo.
   - CV de 3 elementos (B+B+C 0.10; B+C+C y B+B+D 0.20) y serie extra +0.10.
   - `vueloBB`: añadir 7.503, 7.203 y 6.201.
9. **FX‑CV**:
   - Danza solo con el grupo 1 (sin giros); mortal D/E + salto solo con el grupo 1.
   - 3 elementos A/B+A/B+C, A+A+C y A+A+D.
10. **SR de peso 2** (UB L7/L8 2/3, FX L7 1/2): separar en 2 casillas o detecciones (a y b).
11. **Autodetección de SR** (con casilla del juez para anular):
    - UB: cast, cambios de barra, círculo 3/6/7, vuelos y giro LA.
    - BB: SR1 por nivel, salto 180° y giro 360°.
    - FX: pases, 3 mortales distintos, pasaje de danza, último pase (FX‑SR4 hoy no se detecta) y giro.
12. **Autodetección de CC** por aparato y nivel (§3‑5) en lugar de solo casillas.
13. **G‑13, +0.10 extra en L10**: comprobar CC = 0.30, TB ≥0.60 con CV > 0, y el elemento E o la suelta D de una barra (excluir 6.501 en FX).

**Prioridad media**:

14. **BB‑G‑1**: clasificar las entradas `(D)` como danza y `(NA)` como no acro.
15. **G‑12**: DV de L10 también para los D/E de danza en BB/FX (con aviso [OLD‑verificar]).
16. **VT‑04/05**: sin bono de L10 con spot; flag de spot por salto (durante → VOID; L8 2.º vuelo → −1.00 de ejecución).
17. **G‑08**: casilla "BB/FX < 30 s" → −2.00 (L6 BB con todo y SV 10.0 → −0.50).
18. **G‑06**: restringido repetido con 0 VP (L8/9) y "intentado" (L6/7).
19. **Avisos de composición** L8‑10 (UB‑9‑COMP, UB‑10‑COMP, BB‑COMP, FX‑COMP) y tiempos de rutina (G‑15).

**Prioridad baja / datos**:

20. **Catálogo**:
    - Crear variantes [var]: 2.201‑½ = C; Healy en 3.305/6.304/7.309; 6.401 Healy (D).
    - Revisar las entradas con texto mezclado (6.401, 4.102, 7.204).
    - Revisar las entradas vacías o de confianza baja (1.308, 2.101, 3.501, 4.306, 5.502…).
21. **Etiqueta VT‑01**: mostrar "cuenta la mejor nota final (2 saltos)" y permitir capturar la ejecución para comparar las notas.

## 8. Resumen de conteo

Reglas con ID en este documento: **135**, sin contar los bloques de prueba integrales.

| Grupo | Reglas |
|---|---|
| Generales (G) | 15 |
| Salto (VT) | 7 |
| Barras (UB), incluidas UB‑GEN y las listas de §3.0 citadas por las reglas | 48 |
| Viga (BB) | 36 |
| Suelo (FX) | 29 |

Estado frente a `editor.js`, por campo "Estado" de cada regla:

| Estado | Reglas |
|---|---|
| ok | 22 |
| manual | 21 |
| mal | 14, más 5 marcadas "parcial / mal" |
| parcial | 9 |
| falta | 12, más los avisos de composición y tiempos |

Las demás son reglas de detalle que heredan el estado de su regla padre.

## Criterios confirmados por la juez
- 27-oct-2026: requisitos especiales dobles (barras N7/N8 "2/3", piso N7 "1/2"): si falta cualquier parte se descuenta −1.00 completo (no −0.50 por parte).
