# Reglas FIG GAF (WAG) 2025-2028 para el editor de nota D — especificación de implementación

Destino: `/home/user/jueceofemenil/app/editor.js` (funciones `computeFIG`, `crAuto`, `cvFIG`, `computeSaltoFIG`) y catálogo `/home/user/jueceofemenil/app/datos/elementos_fig_wag.json`.

## 0. Fuentes, convenciones y cómo leer esta especificación

**Fuentes (todas revisadas; las penalizaciones en recuadro rojo son imágenes y se verificaron viendo la página renderizada):**
- **CoP** = FIG WAG Code of Points 2025-2028, edición publicada el 14-oct-2026 (`WAG_CoP_2025-2028_EN.pdf`, 224 pp.). Las citas son "CoP §x, p. n" (página impresa = página del PDF).
- **HD** = WAG Help Desk 2.ª ed. (portada "April 2026", publicada ago-2026) (`WAG_HelpDesk_2a_ed_Aug2026.pdf`). Citas "HD p. n".
- **NL1** = WAG Newsletter n.º 1, 23-feb-2026 (`WAG_Newsletter_N01_Feb2026_EN.pdf`).
- **JR** = "WAG CoP modifications for Junior competitions", CoP pp. 182-183.
- Traducción UPAG (español) solo se usó para la terminología.

**Estado respecto al código actual** (se probó el código real con un arnés de Node, ver §12):
- **OK** = implementado y correcto.
- **PARCIAL** = implementado en parte o solo como aviso, o correcto solo en casos comunes.
- **MAL** = implementado pero da un resultado incorrecto en casos normales.
- **FALTA** = no existe.
- **N/C** = no se puede calcular con los datos del editor; solo puede ser un dato que capture el juez o un aviso. Las reglas puramente técnicas de ejecución (ángulos, amplitud, caídas) se omiten salvo cuando cambian el DV/CV.

**Datos disponibles hoy en cada fila** (`a.r[ap][i]`): `k` (clave `F|AP|n`), `n` (apodo), `l` (letra manual), `c` (conectado con la siguiente), `ind` (indirecta, solo PISO), `caida` (caída con DV), `cvm` (CV manual). **Del catálogo** (`FIG['AP|n']`): `g` (grupo), `n`, `l` (letra), `v` (valor de salto), `en` (texto del recuadro; las variantes van separadas por `\n`), `d` (español UPAG), `nom`, `tipo` (`danza`/`acro`, solo VIGA/PISO), `rot` (`mismo_recuadro_dv_una_vez`, `cuenta_como_danza`), `junior_prohibido`.

**Datos nuevos que propone esta especificación** (se citan con estos nombres en cada regla):

| Campo | Dónde | Significado | Usado por |
|---|---|---|---|
| `var` | fila | Índice de la variante dentro del recuadro (líneas de `en`) y, si el texto ofrece opciones, la posición (`t` agrupado, `p` carpado, `s` extendido) y el giro elegido. Identidad del elemento = `k + '#' + var` | GEN-05, UB-16, varias |
| `nv` | fila | "Sin DV": no cae primero de pies / vuelo sin agarre de las dos manos / no reconocido. Sin DV, CR, CV, SB ni bono de salida | GEN-11, UB-15, BB-21, FX-04 |
| `agr` | fila UB | Agarre: `reg`, `inv` (cubital), `L`, `mix` | UB-02, UB-08 |
| `bv` | fila UB | Hay balanceo vacío o intermedio después de este elemento | UB-11 |
| `lat` | fila BB | Salto (jump) hecho en posición lateral | BB-03 |
| `h2` | fila BB | Parada de manos o mantenimiento sin sostener 2 s | BB-04 |
| `nr` | fila BB | La conexión acro con la siguiente no tiene rebote | BB-13 |
| `agv` | fila BB | Se agarra de la viga para no caer | BB-18 |
| `ayu` | fila | Ayuda del entrenador: 1 = después de terminar el elemento; 2 = para hacerlo | GEN-19 |
| `pas` | fila FX | Unida a la siguiente por pasos de carrera, chassé o chainé (pasaje de danza indirecto) | FX-06 |
| `pre` | fila FX | Mortal con entrada acrobática (rondada/flic-flac) que no se capturó como fila | FX-02 |
| `p1` | fila FX | Mortal con despegue de un pie | FX-02 |
| `a.p[ap]` | rutina | Penalizaciones neutrales del jurado D (tiempo, fuera del área, música, 2.º intento de entrada, etc.) | §7 |
| `a.p.SALTO[i]` | salto | `caida`, `nulo` (0.00), carrera vacía, una mano, corredor | VT |

**Resumen:** 90 reglas. OK 16 · PARCIAL 26 (2 de ellas parcial/mal) · MAL 10 · FALTA 28 · N/C 10. Las de más impacto están en §11; la comparación del resultado actual contra el esperado está en §12.

**Formato de cada regla:** ID · cita · regla (español) · **Estado** · **Detección** · **Efecto** · **Pruebas** (claves del catálogo; `>` = conectado con el siguiente, `~` = conexión indirecta; los valores esperados se dan por componente).

---

## 1. Reglas generales (UB, BB, FX) — GEN

### GEN-01 · Composición de la nota D
- **Cita:** CoP §7.1 (p. 22), §6.2 (p. 20).
- **Regla:** D en UB/BB/FX = 8 DV más altos (incluida la salida) + CR (máx. 2.00) + CV + bonificaciones (SB solo en BB, bono de salida). Las penalizaciones neutrales (ejercicio corto, sin salida, tiempo, líneas, etc.) se restan de la **nota final**, no de la D.
- **Estado:** OK (`np = dv+cr+cv+sb+dmt`; `nd` aparte).
- **Detección/Efecto:** sin cambios. Mostrar `nd` con el texto "se resta de la nota final".
- **Pruebas:** cualquier rutina: `np` nunca incluye `nd`.

### GEN-02 · Escala de DV
- **Cita:** CoP §7.2 (p. 22); HD p. 12 ("ningún elemento recibe DV mayor de 1.00").
- **Regla:** A 0.10 … J 1.00.
- **Estado:** OK (`LV`).

### GEN-03 · Cuentan los 8 DV más altos, incluida la salida
- **Cita:** CoP §7.2 a); §11.2, §12.2, §13.2.
- **Regla:** se toman como máximo 8 elementos y la salida (DMT) siempre es uno de ellos (si tiene DV). En FX la salida es el mortal de mayor DV de la última línea acrobática que cuenta (ver FX-04).
- **Estado:** PARCIAL. UB/BB fuerzan la salida (`sorted.find(x=>x.e.dmt)`); FX no la fuerza.
- **Detección:** UB/BB: `e.g===6`. FX: el DMT lo determina el motor de líneas (FX-02/FX-04).
- **Efecto:** el DMT entra primero en `chosen`; después se completan hasta 8 por valor (con GEN-04).
- **Pruebas:** FX `3.106> 3.107> 5.402 1.101 1.205 2.402 2.301 1.409 1.509 3.106> 3.107> 5.201`: la salida es `5.201` (B) y tiene que contar aunque haya 8 de más valor: dv = DMT 0.20 + los 7 mayores.

### GEN-04 · Mínimo 3 de danza y 3 acrobáticos (BB/FX), y cómo elegir cuando la regla limita
- **Cita:** CoP §12.2 y §13.2 ("3 Dance, 3 Acro and 2 optional"); HD p. 10 (10 acro + 1 danza = 6 DV), HD p. 77 ("se pueden contar hasta 5 de danza o hasta 5 acro; la salida siempre es acro").
- **Regla:** dentro de los 8 caben como máximo 5 de un mismo tipo. Si no hay suficientes elementos del otro tipo, se cuentan menos de 8 (no se rellena con más del tipo abundante).
- **Algoritmo (óptimo):** 1) meter el DMT (acro); 2) recorrer los demás elementos con DV de mayor a menor valor y aceptar cada uno si `total<8` y `cuenta[tipo]<5`. Con estas cotas (matroide de partición truncado) el voraz da la suma máxima.
- **Estado:** OK en el algoritmo (`cnt[t]>=5`). Depende de que `tipo` sea correcto (ver CAT-01: VIGA 1.402 y 1.405 están mal como `acro`) y, en FX, de que solo entren los acro elegibles (FX-03).
- **Pruebas:** BB `5.202 5.204 5.312 5.410 5.512 5.612 4.108 4.109 5.208 5.408 2.101 6.405` → cuentan 6: DMT 0.40 + 0.60 + 0.50 + 0.40 + 0.40 + danza 0.10 = **2.40** (hoy 2.40, correcto).

### GEN-05 · El mismo elemento recibe DV una sola vez (orden cronológico) — identidad del elemento
- **Cita:** CoP §7.2.1 b), e), f), g) (pp. 22-23); HD p. 12 (diagrama "Same/Different"; "UB: Deltchev y Gienger son distintos porque cambia la dirección del mortal"); HD p. 74 (UB 1.101: kip y "glide ½ glide kip" son distintos).
- **Regla:** distinto número = distinto elemento. **Mismo número** es el mismo elemento si solo cambia: UB, con o sin cambio de agarre con salto, gigantes con piernas abiertas/juntas o cadera flexionada/extendida, sole circle con piernas abiertas/juntas, vuelos con piernas juntas/abiertas; danza, despegue de uno o dos pies con la misma posición de piernas, lateral o transversal (BB), caída en uno o dos pies (o en apoyo facial en FX); acro, caída en uno o dos pies. **Mismo número pero distinto elemento** (acro, incluidas las salidas de UB): distinta posición del cuerpo en el mortal (agrupado/carpado/extendido), distinto giro (½, 1/1, 1½…), apoyo en una o dos manos, despegue de uno o dos pies, y las variantes distintas escritas en el mismo recuadro (Deltchev/Gienger en 3.405, Godwin/Adalsteinsdottir en 2.504, etc.).
- **Estado:** PARCIAL. `computeFIG` usa la clave del recuadro (`x.k`) como identidad: penaliza de más a los acro/UB de un mismo recuadro que son distintos. Afecta a 47 recuadros de UB, 32 de BB y 20 de FX con varias variantes (`\n` en `en`) y a ~86 con alternativas escritas ("tucked, piked or stretched", "½ or 1/1", "also with").
- **Detección:** si `en` tiene `\n` o un patrón `/tucked,? (or )?piked|tucked or stretched|piked,? or stretched|½ or|or \d|also with/`, mostrar un selector de variante (`var`). Identidad = `k + '#' + var`, salvo en danza (GEN-06), donde la identidad es solo `k`.
- **Efecto:** la 2.ª aparición de la misma identidad: DV 0, no cuenta para ejercicio corto, sí puede servir para CV dentro de la misma conexión (GEN-14).
- **Pruebas:** UB `3.405 3.405 6.406` con `var` Deltchev y Gienger → dv 0.40+0.40+0.40 = **1.20** (hoy 0.80: "#2 repetido"). FX `5.101 5.101` (agrupado, luego carpado) → 0.10 + 0.10. UB `1.101 1.101` (glide kip y glide ½ glide kip) → 0.10 + 0.10.

### GEN-06 · Danza: el mismo recuadro da DV una sola vez
- **Cita:** CoP §7.2.1 d) (p. 22); marcas "(*)" en las tablas BB pp. 121-131 y FX pp. 150-160; HD p. 98 (FX 1.101: split leap y jeté en tournant son el mismo elemento).
- **Regla:** distintos elementos de danza del mismo número reciben DV una sola vez, en orden cronológico. Sí cuentan para el ejercicio corto (HD p. 10).
- **Estado:** OK para el DV (clave). PARCIAL para el ejercicio corto (la deduplicación los quita del conteo; ver GEN-17).
- **Detección:** `e.tipo==='danza'` (o `rot` incluye `cuenta_como_danza`) y misma `k`.
- **Pruebas:** FX `1.107 1.107 1.101 1.205` (straddle pike y luego side split jump) → dv 0.10+0.10+0.20 = 0.40; elementos para ejercicio corto = **4** (hoy 3; la penalización es la misma, −6.00).

### GEN-07 · Solo un giro en cuclillas (tuck turn) recibe DV
- **Cita:** CoP §7.2.1 d) (p. 22).
- **Regla:** en BB y FX solo el **primer** giro en cuclillas sobre una pierna recibe DV (aunque el siguiente valga más).
- **Estado:** FALTA.
- **Detección:** BB `3.207, 3.307, 3.407, 3.507`; FX `2.207, 2.407, 2.507` y `2.307` (Nguyen: termina el giro en posición de lobo/cuclillas; incluirlo, confirmar con el juez).
- **Efecto:** a partir del 2.º: DV 0, `why` = "Solo un giro en cuclillas da valor (CoP 7.2.1 d)". Para el ejercicio corto, contarlo (no es repetición del mismo número; criterio análogo a la danza del mismo recuadro, HD p. 10).
- **Pruebas:** BB `3.207 3.407 6.405` → dv 0.20 + 0.40 (DMT) = **0.60** (hoy 1.00). FX `2.207 2.407` → dv **0.20** (hoy 0.60).

### GEN-08 · Máximo de giros reconocidos en danza
- **Cita:** CoP §7.2.1 d) (p. 22).
- **Regla:** passé hasta 4/1; otras piruetas hasta 3/1; saltos split/straddle hasta 1½; saltos complejos hasta 1/1 (5/1 passé = 4/1).
- **Estado:** N/C. El catálogo ya llega hasta esos máximos. No requiere código.

### GEN-09 · Los mortales árabes cuentan hacia adelante
- **Cita:** CoP §7.2.1 c) (p. 22); HD p. 92 ("los árabes con 180° adicionales cuentan como elementos hacia atrás").
- **Regla:** para requisitos de dirección (BB CR4, FX CR4, bono de salto) un árabe es **adelante**; si tiene ½ giro adicional, **atrás**.
- **Estado:** MAL. `crAuto` busca `bwd` y `fwd` en el texto: "Arabian salto (take-off bwd with ½ twist, salto fwd)" cuenta como **adelante y atrás a la vez** (BB `5.611`, FX `4.205`), y los árabes dobles FX `4.505, 4.605, 4.805` no cuentan como adelante (no dicen "fwd").
- **Detección:** tabla de dirección explícita (BB-12, FX-07), no regex. Árabes: BB `5.611, 6.203, 6.703`, entrada `1.716`; FX `4.205, 4.505, 4.605, 4.805` → `F`.
- **Pruebas:** BB `5.611 6.405` → CR4 **no** (hoy sí). FX `4.205` sola → CR4 no (hoy sí). FX `3.106> 3.107> 4.505 3.106> 3.107> 5.402` → CR4 **sí** (hoy no).

### GEN-10 · Reconocimiento por falla técnica y repetición del devaluado
- **Cita:** CoP §7.2.2 (pp. 23-24); HD p. 13.
- **Regla:** 1) Si se reconoce **otro elemento de la tabla** y después lo hace bien, los dos dan DV. 2) Si se acredita **1 DV menos** (no existe como elemento) y lo repite, la repetición no da DV. 3) Si no tuvo DV por falla y luego lo hace bien, sí da DV.
- **Estado:** PARCIAL. 1) se resuelve eligiendo el otro elemento del catálogo (OK). 2) la letra manual `l` sirve como "1 DV menos" y la deduplicación por identidad deja sin DV la repetición (OK). 3) FALTA: no hay forma de marcar "sin DV" sin que la fila quede como "vista" (ver GEN-11).
- **Detección:** fila con `nv` no entra en el conjunto `seen` de repetidos.
- **Pruebas:** UB `3.401(l='C') 3.401` → C (0.30) y la 2.ª sin DV. UB `3.404(nv) 3.404` → 0 y luego D (0.40).

### GEN-11 · Caídas: con o sin caer de pies
- **Cita:** CoP §8.1.3 (p. 28); tabla D-jury §9.3 (p. 37); UB §11.7 (p. 46); BB §12.7 (p. 51).
- **Regla:** caída cayendo **primero de pies** (o en la posición prescrita): sí DV; sin CV, sin SB y sin bono de salida si es la salida. **Sin caer primero de pies**: sin DV, sin CV, sin CR, sin SB y sin bono de salida. UB: vuelo con agarre de las dos manos (aunque sea momentáneo) → DV; sin agarre de las dos manos → sin DV (puede repetirlo para ganar el DV). BB: el elemento debe volver a la viga con pie o tronco.
- **Estado:** PARCIAL. `caida` quita CV/SB/bono (OK). No existe el caso "sin DV".
- **Detección:** nueva bandera `nv` (botón de 3 estados en el panel: sin caída / caída con DV / sin DV).
- **Efecto `nv`:** DV 0; excluida de CR, CV (de las dos conexiones que la tocan), SB y bono; no cuenta como "vista" para repeticiones (GEN-10); no cuenta para ejercicio corto (HD p. 10: sin DV). Excepción de la salida en GEN-18.
- **Pruebas:** UB `3.404> 2.305(nv) 6.406` → dv 0.80, CV 0. FX `3.106> 3.107> 5.502> 5.301(nv)` como última línea → 5.301 sin DV; la línea sigue siendo línea (FX-02).

### GEN-12 · Mortales con giro incompleto
- **Cita:** CoP §8.1.2 (p. 28); HD p. 20.
- **Regla:** las salidas UB/BB, los mortales en BB/FX y los saltos deben completar el giro exactamente o se reconoce el de menos giro (3/1→2½…). En FX, si el mortal con giro está conectado directamente con otro mortal y no completa el giro, **no se devalúa** (pero sí el último).
- **Estado:** N/C (lo decide el juez eligiendo el elemento).
- **Aviso sugerido:** si una fila FX de mortal con giro tiene `c` hacia otro mortal, mostrar "si el giro no se completa, no se devalúa (CoP 8.1.2)".

### GEN-13 · Requisitos de composición (CR): reglas comunes
- **Cita:** CoP §7.3 (p. 24); HD p. 14.
- **Regla:** máx. 2.00. Solo cumplen CR elementos **de la tabla**. Un elemento puede cumplir varios CR, pero **un elemento repetido no puede cumplir otro CR** (p. ej. BB: el 2.º flic-flac no cumple CR4 si el 1.º ya se usó en la serie).
- **Estado:** PARCIAL. `crAuto` usa todas las filas, incluidas las repetidas, las que no tienen DV y las de UB eliminadas por root skill/Tkatchev.
- **Detección:** filtrar antes de `crAuto`: con `k` del catálogo, sin `nv`, primera aparición de su identidad, no eliminada por UB-02 (4.º de la misma raíz) ni por FX-03 (fuera de líneas), y en FX solo dentro de líneas que cuentan.
- **Pruebas:** BB `5.202> 5.312 2.305 5.202 6.405`: el 2.º flic-flac no cumple nada (CR4 lo cumple el 1.º flic-flac o el mortal atrás).

### GEN-14 · Valor de conexión (CV): reglas comunes
- **Cita:** CoP §7.4 a)-f), §7.4.2 (pp. 25-26); HD pp. 14-17.
- **Reglas:**
  1. Los elementos no tienen que estar entre los 8 que cuentan, pero deben ser de la tabla (filas sin catálogo: sin CV).
  2. Sirven los devaluados (letra manual).
  3. Sin caída (y en UB sin golpear el colchón con los pies; golpear el aparato no rompe la conexión, HD p. 63).
  4. En 3 o más elementos, el del medio puede servir como final de una y como inicio de la siguiente.
  5. Un elemento no se repite **en otra conexión** para CV (cronológico).
  6. Dentro de **una misma conexión** puede repetirse: UB, cualquier elemento; BB/FX, solo acro. **La danza nunca** se repite en conexión.
  7. Con 3+ elementos, el mortal repetido en BB/FX debe ir conectado **directamente**; entonces todas las conexiones dan CV.
  8. HD p. 17: si el acro repetido de BB/FX es **con apoyo de manos**, el repetido no sirve para la conexión siguiente (BB: D + X(mismo) + C → solo D+X).
  9. FX: si un mortal puede contar en una conexión directa o en una indirecta, se elige la más favorable, pero no se usa para los dos principios (HD p. 15).
- **Estado:** PARCIAL. Hay 1, 3, 4 y 5 (`used`). Faltan: 1 (filas sin catálogo con letra manual reciben CV), 6 (danza repetida da CV: BB `2.305> 2.305` da 0.10 hoy), 8 y 9. La regla 5 bloquea mal las excepciones de BB-16.
- **Pruebas:** BB `2.305> 2.305 6.405` → CV **0** (hoy 0.10). BB `5.202> 5.202> 5.512 6.405` → CV **0** (B+B nada; el 2.º flic-flac no sirve para la siguiente) y SB 0.10 (hoy CV 0.10).

### GEN-15 · Conexión directa / indirecta
- **Cita:** CoP §7.4.1 (p. 25).
- **Regla:** directa = sin pausa, paso extra, pie en la viga, pérdida de equilibrio, extensión visible de pierna/cadera antes del 2.º despegue ni balanceo extra de brazos. Indirecta solo en FX acro: elementos con vuelo y apoyo de manos (rondada, flic-flac…) entre mortales. El orden es libre salvo que la fórmula diga "this order only".
- **Estado:** N/C (lo marca el juez con `c`/`ind`). OK.

### GEN-16 · Bono de salida (DMT) +0.20
- **Cita:** CoP §7.4.3 (p. 26); §13.4 b) (p. 55); JR §7.4 (p. 183).
- **Regla:** +0.20 por salida de valor D o más, sin caída. FX: además, la última línea sin caída y **más de dos líneas**. Junior: nunca.
- **Estado:** OK en UB/BB (no se da si la salida no tiene DV por `nv`, repetición o raíz → FALTA ese caso). MAL en FX (FX-05).
- **Detección:** UB/BB: última fila con `e.g===6`, letra del catálogo ≥ D (`vr>=.4`), sin `caida`/`nv`, con DV.
- **Pruebas:** UB `3.404 6.406` → bono 0.20; `3.404 6.406(nv)` → 0 y sin −0.50 (GEN-18).

### GEN-17 · Ejercicio corto
- **Cita:** CoP §6.3 (p. 21); JR §6.3 (p. 182); HD pp. 10-11.
- **Regla:** sénior: 7+ elementos sin descuento; 5-6 → −4.00; 3-4 → −6.00; 1-2 → −8.00; 0 → −10.00. Junior: 6+ sin descuento; 5 → −4.00; 3-4 → −6.00; 1-2 → −8.00; 0 → −10.00. **Qué se cuenta (HD):** no cuentan los elementos sin DV (fuera de la tabla o repetidos). **Sí** cuentan: en UB los eliminados por root skill/Tkatchev/Jaeger (si no son repeticiones); en FX los acro después de la última línea; la danza del mismo recuadro. "Sin intento de salida" se resta además del ejercicio corto. No se confunde con los 8 DV (10 acro + 1 danza = 6 DV y sin penalización).
- **Estado:** PARCIAL. Umbrales OK (sénior y JR). El conteo usa `uniq` (deduplicado por recuadro): quita la danza del mismo recuadro y los acro distintos del mismo recuadro; no aplica las exclusiones de UB/FX porque no existen.
- **Detección:** `nCorto` = filas con `k` del catálogo (o letra manual) y con DV posible, sin `nv`, primera aparición de su **identidad** (GEN-05) + filas de danza repetidas por recuadro + tuck turns posteriores + filas UB eliminadas por raíz/Tkatchev/Jaeger + acro FX fuera de líneas.
- **Pruebas:** FX `1.107 1.107 1.101 1.205` → 4 elementos (hoy 3). UB `4.304 4.404 4.504 4.502 6.406` → 5 elementos → −4.00 aunque Ricna no tenga DV.

### GEN-18 · Sin salida −0.50 (y sus excepciones)
- **Cita:** CoP §11.2 (p. 43), §11.7 (p. 46), §12.2 (p. 49), §12.6 (p. 51), §13.2 (p. 55), §13.6 (p. 57); HD pp. 74, 77, 92.
- **Regla:** sin salida: −0.50 (jurado D, de la nota final) y cuentan 7. Si la salida **se intentó** (empezó el mortal) y no cae de pies: sin DV, cuentan 7, **sin** −0.50. UB 6.101/6.102 sin iniciar el ½ giro = sin salida (−0.50). BB: si salta al colchón sin elemento = sin salida. Si vuelve a subir y hace la salida, no hay −0.50. FX: ver FX-04.
- **Estado:** PARCIAL en UB/BB (solo revisa que exista algún `g===6`); FALTA en FX (nunca aplica −0.50).
- **Detección:** UB/BB: no hay fila `g===6` → −0.50. Salida con `nv` → sin DV, sin −0.50, aviso "cuentan 7".
- **Pruebas:** UB `3.404 2.305` → nd 0.50 + corto. UB `3.404 6.406(nv)` → nd sin 0.50; la salida no da DV.

### GEN-19 · Ayuda del entrenador (spotting)
- **Cita:** CoP §9.3 tabla D-jury (p. 37).
- **Regla:** −1.00 de la nota final cada vez. Si ayuda **después** de terminar el elemento: sin CV y sin bono de salida. Si ayuda **para hacerlo**: además sin DV y sin CR.
- **Estado:** FALTA.
- **Detección:** bandera `ayu` (1 o 2) en la fila.
- **Efecto:** nd += 1.00 por fila marcada; `ayu=1` → la fila no da CV ni bono; `ayu=2` → además `nv` (sin DV ni CR).
- **Pruebas:** UB `3.404(ayu=2) 6.406` → nd 1.00, dv 0.40, CR1 no.

### GEN-20 · Elementos después del tiempo límite
- **Cita:** CoP §12.1 b), §13.1 b).
- **Regla:** los elementos hechos después de 90 s sí se reconocen.
- **Estado:** N/C (sin efecto en el editor).

---

## 2. Modificaciones Junior — JR (CoP pp. 182-183)

### JR-01 · Tope de DV 0.50 para F, G, H, I y J
- **Cita:** JR §7.2.
- **Estado:** OK (`if(JR&&v>.5)v=.5`).
- **Pruebas:** UB JR `3.708 6.406` → 0.50 + 0.40 = 0.90 (hoy 0.90).

### JR-02 · El CV usa el DV restringido
- **Cita:** JR §7.4 ("DV restriction will be taken into consideration").
- **Estado:** OK (`cvFIG` recibe `v` ya topado).
- **Pruebas:** BB JR `5.202> 5.612 6.405` → B+F se vuelve B+E = **0.10** (sénior 0.20). Hoy 0.10.

### JR-03 · Sin bono de salida
- **Cita:** JR §7.4. **Estado:** OK.

### JR-04 · Ejercicio corto Junior
- **Cita:** JR §6.3. **Estado:** OK en umbrales; conteo PARCIAL (GEN-17).
- **Pruebas:** JR con 6 elementos con DV → 0; con 5 → −4.00.

### JR-05 · Salto Junior: 2 saltos distintos (pueden ser del mismo grupo), sin bono de direcciones
- **Cita:** JR §10.4 (p. 183).
- **Regla:** en clasificatoria/AA/equipos, 1 salto. Para la final y en la final: 2 saltos **de distinto número** (pueden ser del mismo grupo), promedio, **sin** −2.00 por grupo y **sin** bono de 0.20.
- **Estado:** PARCIAL. No resta por grupo (OK) ni da bono (OK, porque no existe); el salto repetido solo genera aviso (no vale 0, ver VT-05).
- **Pruebas:** JR `4.35 4.34` → promedio 5.20 sin descuento. JR `4.35 5.33` → 5.50 (sin bono). JR `4.35 4.35` → 2.º = 0 → 5.40/2 = **2.70**.

### JR-06 · Salto Junior: un salto en 0 → nota / 2
- **Cita:** JR §10.4.2. **Estado:** FALTA (igual que VT-08).

### JR-07 · Elementos prohibidos para Junior
- **Cita:** JR Sección 14 (p. 183). El CoP no fija la penalización para UB/BB/FX; en salto, un salto prohibido es nulo (CoP §10.4.3).
- **Regla y mapeo al catálogo** (revisado elemento por elemento):

| Regla CoP | Elementos | Seguridad |
|---|---|---|
| VT – entrada o caída lateral | ninguno en la tabla | — |
| VT – doble mortal (adelante y atrás) | `SALTO|2.50` (Produnova), `SALTO|4.62` (Biles) | seguro |
| UB – mortal y salida con despegue de dos pies | entradas con mortal desde el trampolín: `1.207`, `1.307` (variante 1: "Facing HB – salto fwd to hang on HB"; la variante 2, roll fwd, no es mortal), `1.407`, `1.409` (variante Jentsch; González es flic-flac, no), `1.609`, `1.709`; salidas parado en BA: `6.210`, `6.310` | seguro (por variante en 1.307 y 1.409) |
| UB – (dudoso) | `5.607` (contramortal adelante desde apoyo de pies en la barra) | revisar |
| BB – danza con caída a sentada transversal en la viga | `1.305` (las dos variantes: a sentada en split transversal), `1.405` (Dick con ½; en el catálogo está como acro, ver CAT-01), `1.102` (variante 2: tijera a sentada transversal sobre el muslo), `1.105` (variante 2: a sentada en split transversal) | 1.305/1.405 probable; 1.102/1.105 por variante. Confirmar que "cross split sit" cuenta como "cross sit" |
| FX – acro con despegue lateral y/o caída a rol | `3.102` (Hecht roll: cae a rol) | probable |

- **Estado:** PARCIAL. Solo avisa con los marcados `seguro:true` (`SALTO|2.50`, `SALTO|4.62`, `BARRAS|6.210`, `BARRAS|6.310`, `VIGA|1.305`) y **no quita el DV**.
- **Efecto propuesto:** UB/BB/FX: DV 0, sin CR/CV, aviso "Prohibido para Junior (CoP p. 183); el Código no fija penalización adicional: confirmar con el reglamento de la competencia". VT: salto nulo 0.00.
- **Pruebas:** UB JR `1.407 6.406` → dv 0.40 y aviso (hoy 0.80, sin aviso). VT JR `2.50` → 0.00.

### JR-08 · Junior: no hay penalización si hace un salto distinto al anunciado
- **Cita:** JR §10.4.2. **Estado:** N/C (no aplica al editor).

---

## 3. Salto — VT (CoP §10, pp. 39-42; tablas pp. 60-70)

### VT-01 · D = valor del salto
- **Cita:** CoP §7.1 a), §10.5. **Estado:** OK (`e.v`).

### VT-02 · Clasificatoria, AA y equipos: cuenta 1 salto (el 1.º)
- **Cita:** CoP §10.4. **Estado:** OK (`np = vaults[0].v`).

### VT-03 · Final: 2 saltos de grupos distintos, promedio
- **Cita:** CoP §10.4 (p. 40).
- **Estado:** PARCIAL (promedia, pero no aplica VT-04/05/06/08).

### VT-04 · Dos saltos del mismo grupo
- **Cita:** CoP §10.4.2 (p. 41); HD p. 51.
- **Regla:** nota = [NF1 + (NF2 − 2.00)] / 2. En valor D: promedio D − 1.00.
- **Estado:** FALTA en el cálculo (solo aviso; `avg` no cambia).
- **Detección:** `vaults[0].e.g===vaults[1].e.g`, nivel FIG.
- **Pruebas:** FIG `4.35 4.34` → (5.40 + 5.00 − 2.00)/2 = **4.20** (hoy 5.20).

### VT-05 · Repetir el 1.er salto como 2.º = salto nulo
- **Cita:** CoP §10.4.3 (p. 41); HD p. 51.
- **Regla:** el 2.º vale 0.00 → nota = NF1 / 2.
- **Estado:** PARCIAL (aviso).
- **Detección:** mismo `n` en los dos saltos. **Pruebas:** FIG `4.35 4.35` → **2.70** (hoy 5.40).

### VT-06 · Bono de 0.20 por direcciones distintas
- **Cita:** CoP §10.4 (p. 41); HD p. 50.
- **Regla:** +0.20 al promedio si los 2 saltos tienen mortal en el 2.º vuelo en direcciones distintas (adelante/atrás), los dos sin caída. Los tipo "Cuervo" (½ giro y mortal atrás en el 2.º vuelo, tras paloma o rondada con ½) cuentan **adelante**. Junior: no.
- **Estado:** FALTA.
- **Detección:** grupo 1 = sin mortal (nunca hay bono). Grupos 2 y 5 = adelante (incluidos los Cuervo `2.11`, `2.21`, `5.11`, `5.21` y `2.50`). Grupos 3 y 4 = atrás. Bono si uno es de {2, 5} y el otro de {3, 4}, sin `caida` en ninguno, nivel FIG.
- **Pruebas:** `4.35 5.33` → 5.50 + 0.20 = **5.70** (hoy 5.50). `2.11 3.30` → 3.80 + 0.20 = 4.00. `1.00 4.10` → sin bono. JR `4.35 5.33` → 5.50.

### VT-07 · Saltos nulos (0.00)
- **Cita:** CoP §10.4.3 (p. 41); HD p. 51.
- **Regla:** sin fase de apoyo; sin collarín en saltos con rondada; ayuda del entrenador; no cae primero de pies; salto irreconocible o empuja con los pies; salto prohibido (piernas abiertas, pre-elemento prohibido, caída lateral intencional); repetir el 1.º; HD: más de un toque de manos ("caminar" en la mesa).
- **Estado:** FALTA.
- **Detección:** bandera `nulo` por salto.
- **Efecto:** valor 0.00 (y VT-08).

### VT-08 · En la final, un salto en 0 → el otro / 2; si solo hace uno → DNF
- **Cita:** CoP §10.4.2; HD p. 51.
- **Estado:** FALTA.
- **Pruebas:** `4.35 4.34(nulo)` → 5.40/2 = **2.70**.

### VT-09 · Penalizaciones neutrales de salto (jurado D, de la nota final del salto)
- **Cita:** CoP §10.2 (p. 39), §10.4.1-10.4.2 (p. 41); HD pp. 48-50.
- **Regla:** carrera vacía −1.00 (con 1 salto se permite una 2.ª carrera; con 2 saltos, una 3.ª; la siguiente no se permite); carrera de más de 25 m −0.50; carrera sin saltar −1.00; apoyo con una mano −2.00; salir del corredor con un pie/mano −0.10, con dos o con otra parte del cuerpo −0.30 (cada vez); HD: colchón de manos fuera de Yurchenko −0.50.
- **Estado:** FALTA (N/C sin captura: agregar contadores opcionales en `a.p.SALTO[i]`).

---

## 4. Barras asimétricas — UB (CoP §11, pp. 43-46; tablas pp. 72-106)

### UB-01 · 8 DV con la salida; sin salida −0.50
- **Cita:** CoP §11.2. **Estado:** OK (ver GEN-03 y GEN-18 para las excepciones).

### UB-02 · Root skill: máximo 3 elementos de la misma raíz
- **Cita:** CoP §11.2 (pp. 43-44); HD pp. 10-11, 60-61.
- **Regla:** de la misma raíz solo cuentan **3, en orden cronológico**, para DV, CR y CV. La raíz la define la **entrada** del elemento, la **dirección** (adelante/atrás) y el **agarre** (regular, cubital, L) (HD p. 60). Excepciones: kips, gigantes adelante/atrás y casts a parada de manos. Las entradas y salidas cuentan en la raíz. Las repeticiones sin DV **sí** cuentan en el número de la raíz; los elementos sin DV por falla técnica **no**. Los eliminados por la regla del Tkatchev también ocupan lugar (HD p. 61). El 4.º y siguientes: **sin DV, sin CR y sin CV** (si el 4.º va conectado, esa conexión no da CV). Para el ejercicio corto sí cuentan (HD p. 10).
- **Estado:** FALTA.
- **Detección:** tabla de datos `RAIZ_UB` (propuesta; cada fila se puede cambiar a mano con un campo `raiz`). La raíz se combina con `agr` (agarre) cuando el recuadro admite varios.

| Raíz (propuesta) | Elementos (número del CoP) | Notas |
|---|---|---|
| Vuelta libre atrás (clear hip bwd), agarre regular | 2.105, 2.302, 2.305, 2.405, 2.505, 2.306, 2.406, 2.506, 2.606, 2.706, 2.307, 2.407; salidas 6.209, 6.309, 6.409, 6.509, 6.609 | 2.105 y 2.302 empiezan con "hip circle bwd": confirmar si es la misma entrada |
| Vuelta adelante / Weiler | 2.104, 2.404, 2.504 | |
| Stalder atrás | 4.104, 4.304, 4.404, 4.504, 4.302, 4.402, 4.502, 4.602, 4.205, 4.305, 4.405, 4.505 | confirmado con el ejemplo del HD p. 61 (Ricna + stalder 1/1 + stalder) |
| Stalder adelante | 4.101, 4.401, 4.501; salida 6.108 (variante stalder adelante) | |
| Stalder adelante en L | 4.103, 4.403, 4.503 | otra raíz por agarre |
| Vuelta carpada adelante (clear pike fwd) | 4.106, 4.406, 4.506 | |
| Vuelta carpada atrás (clear pike bwd) | 4.107, 4.407, 4.507, 4.208, 4.308, 4.508, 4.608, 4.708 | |
| Sole circle adelante (cubital) | 5.105, 5.305, 5.405 | |
| Sole circle adelante en L | 5.106, 5.306, 5.406 | |
| Sole circle atrás | 5.108, 5.308, 5.408, 5.508, 5.409, 5.509, 5.410, 5.510, 5.610; salidas 6.101, 6.201, 6.301, 6.401, 6.303, 6.403 ("underswing") | el HD p. 60 muestra una salida en la misma raíz; confirmar 5.207, 5.307, 5.607 (underswing con apoyo de pies) |
| Clear underswing / stalder a salida | 6.102, 6.302, 6.402, 6.502 | confirmar raíz (stalder o carpada) |
| Seat circle adelante | 5.101, 5.301 | |
| Rear pike support (Steinemann) | 5.302, 5.402, 5.502, 5.303, 5.403 | |
| Schleudern (dislocación) | 5.104, 5.304, 5.404 | |
| Exentos (kips, gigantes, casts a parada) | 1.101, 1.104, 4.201 (kips); 3.201, 3.301, 3.401, 3.206, 3.306, 3.506, 3.310, 3.410, 3.510 (gigantes); 2.101, 2.201, 2.301, 2.401 (casts) | |
| Sin raíz común (balanceo largo/gigante) | grupo 3 de vuelos (3.402-3.409), salidas de balanceo 6.104-6.608 | se tratan como exentos: su entrada es un gigante o balanceo |

- **Efecto:** contar por raíz en orden de filas (con `nv` no cuenta; repetición sí; eliminado por Tkatchev/Jaeger sí). Desde el 4.º: DV 0, excluido de CR, CV de sus dos conexiones = 0, `why` = "4.º elemento de la raíz X: sin DV, CR ni CV (CoP 11.2)".
- **Pruebas:** UB `4.304 4.404 4.504 4.502 6.406` → Ricna sin DV: dv 0.30+0.40+0.50+0.40 = **1.60**; CR: solo CR4 (stalder 1/1) = 0.50; bono 0.20; D = **2.30**; corto: 5 elementos → −4.00 (hoy D 3.80). HD p. 10: `A A B A X C D X` → 6 DV y 7 para ejercicio corto.

### UB-03 · Solo un "Tkatchev" por línea de la tabla
- **Cita:** CoP §11.2 (p. 44); HD p. 61.
- **Regla:** solo se reconoce un elemento tipo Tkatchev (contramovimiento con paso de la barra en straddle/carpado/extendido, con o sin giro) **por cada línea** de la tabla (mismo grupo y misma fila, es decir, mismos dos últimos dígitos). El siguiente de la misma línea: sin DV (ocupa lugar en la raíz y cuenta para ejercicio corto).
- **Estado:** FALTA.
- **Detección (líneas):** grupo 2 fila 06: `2.506` (Hindorff, Martins; la variante Khorkina no es tipo Tkatchev), `2.606`, `2.706`. Grupo 3 fila 03: `3.403` (Tkatchev, Kononenko, Davydova, Monckton), `3.503`. Grupo 3 fila 09: `3.309`, `3.409` (contravuelos desde balanceo atrás; confirmar si son tipo Tkatchev). Grupo 4 fila 02: `4.502` (Ricna, Derwael/Fenton), `4.602` (Downie). Grupo 4 fila 08: `4.508` (variante Galante; Komova no), `4.608`, `4.708` (Nemour). Grupo 5 fila 10: `5.410` (Ray, Tweddle), `5.510` (Church, Fenton), `5.610` (Nabieva, Derwael). Grupo 5 fila 03: `5.403` (Li Li, contravuelo atrás).
- **Efecto:** DV 0 para el 2.º y siguientes de la misma línea. CR/CV: el HD solo dice "no DV"; propuesta: no dar CR ni CV y avisar "confirmar".
- **Pruebas:** UB `4.502 4.602 3.403 3.503 6.406` → Downie y Tkatchev carpado sin DV: dv 0.50+0.40+0.40 = **1.30**; CR2 0.50; bono 0.20; D = **2.00** (hoy 3.60). `3.403 4.502` → los dos dan DV (líneas distintas).

### UB-04 · Solo un "Jaeger"
- **Cita:** CoP §11.2; HD p. 61.
- **Regla:** solo un Jaeger (con o sin giro) en todo el ejercicio.
- **Estado:** FALTA.
- **Detección:** grupo 3 fila 08: `3.308`, `3.408` (Jaeger abierto, Li Ya, Jaeger carpado), `3.608` (Capuccitti, Minamino), `3.708` (variante Yang; la variante Mo, mortal adelante agrupado sobre la BA, confirmar si es tipo Jaeger).
- **Efecto:** el 2.º sin DV (cuenta para ejercicio corto).
- **Pruebas:** UB `3.308 3.408 6.406` → dv 0.30+0.40 = **0.70**, D = 1.40 (hoy 1.80).

### UB-05 · Variedad de categorías de movimiento
- **Cita:** CoP §11.2 (lista "Circle and Swings / Flights"). Recomendación sin efecto en la nota. **Estado:** N/C.

### UB-06 · CR1: vuelo de barra alta a barra baja
- **Cita:** CoP §11.3 (p. 44), §11.7 Mounts a) (p. 46: "las entradas pueden cumplir CR1").
- **Estado:** MAL. `crAuto` solo detecta `3.307` y `3.407` (la regex excluye "Hang on HB…" y casi todos los vuelos).
- **Detección:** lista estática `UB_VUELO_BA_BI` = 2.306 (Pedrick), 3.304, 3.307, 3.402, 3.502 (Strong), 3.404 (Pak), 3.504 (Pak con 1/1 y Bhardwaj), 3.407 (Ejova), 4.302, 4.402, 4.308 (variante Sayer), 5.202, 5.304 (variante Alt), 5.404 (Zuchold), 5.502 (Teza), 5.307 (variante Hamelin), 5.301 (variante 1: revisar). Entradas: el CoP permite CR1 pero no dice cuáles; candidatas con vuelo que terminan en la BI: 1.208, 1.409, 1.509 (confirmar).
- **Efecto:** CR1 = 0.50 si existe alguna fila con DV de la lista (no eliminada por raíz).
- **Pruebas:** UB `3.404 6.406` → CR1 **sí** (hoy no). `3.402 6.406` → sí.

### UB-07 · CR2: vuelo en la misma barra
- **Cita:** CoP §11.3; HD p. 61 (las entradas del Gr. 1 no cuentan; `1.103` no: contravuelo que no pasa sobre la barra; `2.202` sin soltar las dos manos a la vez se devalúa a A y no cumple CR2).
- **Estado:** MAL. Detecta 36, pero incluye `3.401` (el "hop" de Chusovitina no es vuelo), `4.205, 4.305, 4.405, 4.505` (son de BI a BA: su texto no dice "LB") y la variante no-vuelo de `2.504`; omite `5.307` (Burda).
- **Detección:** lista estática `UB_VUELO_MISMA` = 2.202, 2.302, 2.303 (Caslavska), 2.503 (Comaneci), 2.504 (solo variante Adalsteinsdottir), 2.506, 2.606, 2.706, 3.403, 3.503, 3.604 (Kim), 3.405, 3.505, 3.705, 3.308, 3.408, 3.608, 3.708, 3.309, 3.409, 4.502, 4.602, 4.508 (variante Galante), 4.608, 4.708, 5.403, 5.607, 5.307 (variante Burda), 5.410, 5.510, 5.610.
- **Pruebas:** UB `4.405 6.406` → CR2 **no** (hoy sí). UB `3.401 6.406` → CR2 no y CR4 sí (hoy CR2 sí, CR4 no).

### UB-08 · CR3: agarres distintos (no cast, entrada ni salida)
- **Cita:** CoP §11.3; HD p. 61 (los sole circle adelante cumplen; `3.307` solo con agarre cubital).
- **Regla:** al menos un elemento (no cast, no entrada, no salida) en agarre cubital, L o mixto.
- **Estado:** PARCIAL. Por regex; no detecta `3.206` (gigante adelante en cubital: el texto dice "in reverse, regular or mix grip") ni `5.105`; da por buenas variantes que no se hicieron (2.506, 4.502 por "mixed L grip").
- **Detección:** campo `agr` por fila con valor sugerido desde el texto. Candidatos: 3.206 (si `agr` ≠ reg), 3.506, 3.310, 3.410, 3.510, 4.103, 4.403, 4.503, 5.105, 5.305, 5.405, 5.106, 5.306, 5.406, 5.501 (Adler), 3.604 y 5.607 (terminan en cubital), 5.308 (variante con cambio a cubital), 3.307 (solo `agr=inv`), las variantes "mixed L grip" de 2.506, 2.606, 4.502, 5.410, 5.510, 5.610.
- **Pruebas:** UB `3.206(agr=inv) 6.406` → CR3 **sí** (hoy no). `3.307(agr=reg)` → no.

### UB-09 · CR4: elemento sin vuelo con giro de 360° o más (no entrada)
- **Cita:** CoP §11.3; HD p. 62 (entradas 1.202, 1.310 y 1.410 no cumplen); HD p. 34 (un swing con giro reconocido más bajo cumple CR4 si agarró con las dos manos y los hombros completaron el giro).
- **Estado:** PARCIAL. Omite `3.401` (marcado como vuelo por "Chusovitina") y la variante Godwin de `2.504`.
- **Detección:** lista `UB_GIRO360` = 2.301, 2.401, 2.405, 2.505, 2.504 (variante Godwin), 3.301, 3.401, 3.306, 3.506, 3.410, 3.510, 4.501, 4.503, 4.404, 4.504, 4.506, 4.507, 5.405, 5.406, 5.408, 5.508.
- **Pruebas:** UB `3.401 6.406` → CR4 sí.

### UB-10 · Tabla de CV de barras
- **Cita:** CoP §11.4 (pp. 44-45); HD pp. 62-64.
- **Regla (solo conexiones directas):**
  - **0.10:** D + D (o más). Cada elemento C/D debe tener **vuelo o al menos ½ giro (180°)**.
  - **0.20:** (a) D con **vuelo en la misma barra o de BI a BA** + C o más **en la BA**, **en ese orden**; el C/D debe tener vuelo o ½ giro. (b) E + E, uno con vuelo. (c) F + D, los dos con vuelo (orden libre).
  - **Vuelo (11.4 b):** de BA a BI o al revés; contravuelo sobre la barra, vault, hecht o mortal con reagarre en la misma barra o en la otra; **las salidas son vuelo**. Los cambios de agarre con salto (también con 180°-360°) **no** son vuelo. Los elementos del Gr. 1 (entradas) no son vuelo para CV.
  - Valen conexiones de entrada (ej. D+D = 0.10), dentro del ejercicio y de salida.
  - Un elemento puede ir 2 veces en la misma conexión (la 2.ª sin DV).
  - Sin CV si hay balanceo vacío o intermedio entre los elementos o después del 2.º/último (UB-11), si el 4.º de la raíz va en la conexión (UB-02) o si cae. Con 3+ elementos y caída en el último, sí se da el CV anterior; si cae en un swing (sin DV), no se da el CV anterior (HD p. 64).
- **Estado:** PARCIAL/MAL:
  - D+D no revisa vuelo/½ giro (`4.401> 4.406` da 0.10; debe ser 0).
  - "D vuelo + C" da 0.20 con cualquier vuelo (también BA→BI, como Pak) y sin revisar que el C sea en BA ni que tenga vuelo o giro (solo aviso).
  - `flyUB` excluye las salidas: E + E con salida E da 0.10 (debe ser 0.20).
  - `flyUB` marca como vuelo `3.401` (hop turn) y las variantes no-vuelo de recuadros mixtos.
- **Detección:**
  - `vuelo(e)` = lista `UB_VUELO_BA_BI ∪ UB_VUELO_BI_BA ∪ UB_VUELO_MISMA ∪ salidas (g6)`, por variante.
  - `UB_VUELO_BI_BA` = 2.206, 2.307 (Yarotska), 2.407, 2.406 (Shaposhnikova), 2.403 (Radochla), 4.205, 4.305, 4.405, 4.505, 4.208, 4.308 (variante Zgoba), 4.508 (variante Komova), 5.207, 5.409 (Maloney), 5.509 (Van Leeuwen/Seitz), 5.301 (variante 2).
  - `giro180(e)` = `turnDeg(texto de la variante) >= 180`.
  - `enBA(e)`: elementos del grupo 3 (gigantes/balanceos en BA), grupos 4/5 hechos en BA, y los que dicen "on HB"; si no se sabe, aviso.
- **Efecto (pseudocódigo):**
  ```
  okCD = x => x.v<0.5 ? (vuelo(x)||giro180(x)) : true   // C/D necesitan vuelo o ½ giro
  if (A.v>=.4 && A.vueloMismaOBIaBA && B.v>=.3 && okCD(A) && okCD(B) && enBA(B)) cv=.2
  else if (min>=.5 && (vuelo(A)||vuelo(B))) cv=.2
  else if (min>=.4 && max>=.6 && vuelo(A) && vuelo(B)) cv=.2
  else if (min>=.4 && okCD(A) && okCD(B)) cv=.1
  ```
- **Pruebas:**
  - `4.401> 4.406 6.406` (variantes sin ½) → CV **0** (hoy 0.10).
  - `3.404> 2.305 6.406` (Pak a BI + C en BI) → **0** (hoy 0.20).
  - `5.409> 2.305(var con ½) 6.406` (Maloney + vuelta libre ½ en BA) → **0.20** (hoy 0.20).
  - `4.504> 6.505` (E + salida E) → **0.20** (hoy 0.10).
  - `3.401(var Chusovitina)> 3.403` → D+D = **0.10** (hoy 0.20).
  - `4.504> 2.506` → 0.20; `4.501> 4.504` → 0.10.

### UB-11 · Balanceo vacío o intermedio
- **Cita:** CoP §11.4 d) (p. 45), §11.6 (−0.50 cada uno, jurado E); HD pp. 64-65, 69.
- **Regla:** balanceo vacío = balanceo adelante/atrás sin elemento de la tabla antes de que cambie de dirección (ej. ¾ de gigante, swing ½ bajo la horizontal, después de vuelta atrás). Balanceo intermedio = impulso desde apoyo o balanceo largo innecesario. Efectos: −0.50 (E) cada uno (una sola vez en el mismo lugar) y **sin CV** de la conexión anterior/siguiente. HD (NEW): si el elemento siguiente no está en el CoP (sin DV) se considera balanceo vacío; un gigante que no llega a parada (sin DV) seguido de caída: sin CV.
- **Estado:** FALTA.
- **Detección:** bandera `bv` en la fila → la conexión `i→i+1` no da CV; aviso E "−0.50 balanceo vacío/intermedio". Aviso automático: fila sin catálogo después de una conexión.
- **Pruebas:** UB `4.504>(bv) 2.506` → CV 0 y aviso E −0.50.

### UB-12 · Excepción tipo Shaposhnikova y kip después
- **Cita:** CoP §11.4 d) (p. 45, símbolos); HD p. 64.
- **Regla:** después de elementos tipo Shaposhnikova (con o sin 1/1) y de los 4 elementos ilustrados, el balanceo de regreso **no** es balanceo vacío (la conexión puede dar CV). Pero si después de un tipo Shaposhnikova o de un hecht con ½ giro hace **kip**: −0.50 (balanceo vacío) y sin CV.
- **Identificación** (los símbolos del CoP p. 45 se compararon con la tabla de símbolos p. 172): tipo Shaposhnikova = `2.406`, `2.506` (variante Khorkina), `4.405`, `4.505`, `4.508` (variante Komova), `5.409` (Maloney), `5.509` (Van Leeuwen/Seitz). Los 4 símbolos: `2.407` (vuelta libre atrás en BI con hecht ½ a BA), `3.604` (Kim), `5.607` y, probablemente, `3.708` (variante Mo; confirmar).
- **Estado:** FALTA (N/C sin `bv`).
- **Aviso:** si una fila de esa lista va seguida de una fila que suele ir después de un kip (`2.101, 2.201, 2.301, 2.401, 4.201`), avisar "Si hizo kip después de X: balanceo vacío −0.50 (E) y sin CV (HD p. 64)".

### UB-13 · Deducciones de composición del jurado E que se pueden avisar
- **Cita:** CoP §11.5 (p. 45); HD p. 65.
- **Regla:** más de 2 elementos iguales conectados directamente a la salida −0.10 (calculable). Saltar de BI a BA −0.50; colgar de BA, pies en BI y agarrar BI −0.50 (N/C). Si el elemento se repite (sin DV), no se descuenta por el cambio de barra (HD).
- **Estado:** FALTA.
- **Detección:** en la cadena `c` que termina en la salida, contar filas con la misma identidad > 2 → aviso E −0.10.
- **Pruebas:** UB `2.201> 2.201> 2.201> 6.406` → aviso E −0.10.

### UB-14 · Penalizaciones neutrales de barras
- **Cita:** CoP §11.1 (p. 43); HD p. 59.
- **Regla:** 2.º intento de entrada (sin tocar trampolín ni aparato) −1.00 (D); correr o caminar bajo la BI para entrar −0.30 (D); exceder 30 s después de una caída −0.30; no reanudar en 60 s: ejercicio terminado. Si en el 1.er intento toca el trampolín o el aparato: −1.00 (E), debe empezar y la entrada no tiene valor.
- **Estado:** FALTA (N/C; campos opcionales en `a.p.BARRAS`).

### UB-15 · Caídas en vuelos y salidas
- **Cita:** CoP §11.7 (p. 46); HD pp. 63, 70, 74.
- **Regla:** vuelo con agarre de las dos manos (aunque sea con una y luego la otra sin caer) → DV; sin agarre de las dos → sin DV. Una caída después de un vuelo de BA a BI se considera parte del elemento. Salida: ver GEN-18.
- **Estado:** PARCIAL (falta `nv`, GEN-11).

### UB-16 · Entradas hechas en el ejercicio
- **Cita:** CoP §11.7 Mounts b); HD pp. 70, 74.
- **Regla:** un elemento de entrada hecho en el ejercicio (o al revés) da DV una sola vez. Kip (1.101) y "glide ½ glide kip" (1.101) son distintos; 1.102 es otro número.
- **Estado:** OK por clave; PARCIAL por variantes (GEN-05).

### UB-17 · Reconocimientos específicos del HD (avisos para el juez)
- **Cita:** HD pp. 61, 71-74; NL1 p. 1.
- **Reglas:** Weiler (2.404/2.504) que termina en cast abierto a parada → 1 DV menos; 6.101/6.102 sin iniciar el ½ giro = sin salida; doble mortal atrás extendido (6.406) D solo si mantiene la extensión la mayor parte (si no, carpado 6.305 C, NL1); 3.608, 5.610 y 3.505 con criterios de extensión (si no, carpado); Jaeger carpado cayendo primero con las piernas sobre la barra: sin DV; con despegue de dos pies: sin DV, CR ni CV (HD p. 71).
- **Estado:** N/C (texto de ayuda en el panel del elemento).

### UB-18 · Valores máximos de vuelos BI→BA y giros en parada (HD p. 71)
- Solo para evaluar elementos nuevos (máximo E). **Estado:** N/C.

---

## 5. Viga — BB (CoP §12, pp. 47-52; tablas pp. 108-147)

### BB-01 · 8 DV con la salida; 3 danza / 3 acro; sin salida −0.50
- **Cita:** CoP §12.2 (p. 49); HD p. 77.
- **Estado:** OK (con CAT-01 y GEN-18).

### BB-02 · Qué es danza en viga
- **Cita:** HD p. 77; marcas "(D)" en las tablas.
- **Regla:** danza = grupos 2 y 3 y los marcados "(D)" de los grupos 1 y 4 (1.101, 1.201, 1.401, 1.102, 1.302, 1.402, 1.204, 1.304, 1.105, 1.305, 1.405, 4.101, 4.102). La salida siempre es acro.
- **Estado:** MAL en el catálogo: `VIGA|1.402` y `VIGA|1.405` tienen `tipo:'acro'` (CoP p. 108-109 las marca "(D)"). Ver CAT-01.

### BB-03 · Saltos en posición lateral: +1 DV
- **Cita:** CoP §7.2.1 f) (p. 23); HD p. 85; notas de 2.502/2.507/2.511 en el catálogo.
- **Regla:** los saltos (jumps) hechos en posición lateral valen 1 DV más que en transversal; si hace el mismo en lateral y en transversal, da DV una sola vez (cronológico). Si empieza en una posición y termina en la otra cuenta como transversal (los 90° adicionales no lo hacen distinto). Lateral con giro incompleto = transversal. La caída en lateral debe ser en dos pies. Los elementos de anillo en lateral no se reconocen.
- **Estado:** FALTA.
- **Detección:** bandera `lat` solo en saltos VIGA cuyo texto dice "from cross position": 2.202, 2.302, 2.402, 2.203, 2.303, 2.403, 2.107, 2.207, 2.407, 2.209 (variante 2), 2.409, 2.211, 2.311, 2.411, 2.112, 2.212, 2.412, 2.512. Anillos (2.208, 2.308, 2.408): con `lat` → sin DV.
- **Efecto:** letra + 1 (A→B…); la identidad sigue siendo la misma `k` (lateral y transversal = mismo elemento).
- **Pruebas:** BB `2.202(lat) 6.405` → 0.30 + 0.40. BB `2.202 2.202(lat)` → solo el 1.º (B).

### BB-04 · Mantenimientos y paradas de manos: 2 segundos
- **Cita:** CoP §12.7 Holds a) y c) (p. 52); HD p. 84.
- **Regla:** las paradas de manos sin giro y los mantenimientos marcados "(2 sec.)" deben sostenerse 2 s; si no, y no existe como otro elemento, **1 DV menos o sin DV**. 5.302/5.303 (flic-flac a parada) y similares: 1 DV menos si no sostiene 2 s; si repite y sostiene: sin DV (repetición). Si no llega alineado a parada: sin DV.
- **Estado:** FALTA.
- **Detección:** `en` contiene "2 sec": VIGA 1.210, 1.111, 1.211, 1.311, 1.411, 1.312, 1.313, 1.413, 4.102, 4.202, 4.103, 5.302, 5.303, 5.403, 5.306. Bandera `h2`.
- **Efecto:** `h2` → letra − 1; la repetición posterior queda sin DV (identidad).
- **Pruebas:** BB `5.302(h2) 6.405` → 0.20 + 0.40.

### BB-05 · Mantenimientos con vuelo: solo como último elemento
- **Cita:** CoP §12.3 Note ("Handstands and holds may not be used to fulfill CR"), §12.7 Holds b) (p. 52), SB (p. 50: "except Holds").
- **Regla:** para CR, CV y SB un "hold" acro con vuelo solo puede ir como **último** elemento de una serie acro o mixta. Las paradas y holds sin vuelo no cumplen CR ni sirven para SB.
- **Estado:** MAL. Se excluye con `/hold|position/` sobre `en`: "position" quita por error todos los "from cross/side position" (saltos 2.202…, acro 5.402, 5.405, 5.505) del SB y del CR4, y no detecta los "(2 sec.)" (que no dicen "hold").
- **Detección:** `HOLD_VUELO` = 5.302, 5.303, 5.306, 5.403. `HOLD_SIN_VUELO` = 1.210, 1.111, 1.211, 1.311, 1.411, 1.312, 1.313, 1.413, 4.103, 4.202 (+ 4.102 es danza). Usar **listas**, no regex.
- **Pruebas:** BB `5.302> 5.312 6.405` (hold primero) → sin CV y sin CR3 (hoy 0.10 y CR3). BB `2.202> 2.305> 2.203 6.405` → SB **0.10** (hoy 0, por "position").

### BB-06 · Onodi en tic-toc: solo como último
- **Cita:** HD p. 87.
- **Regla:** la variante tic-toc de 5.401 solo puede ser el último elemento para CR de serie acro y para CV; para SB puede ir en cualquier lugar; es el mismo elemento que el Onodi.
- **Estado:** FALTA. **Detección:** `VIGA|5.401` con `var` = tic-toc.

### BB-07 · Solo un elemento acro antes de la entrada
- **Cita:** CoP §12.7 Mounts a) (p. 51).
- **Estado:** FALTA (aviso). **Detección:** más de una fila antes de la primera fila del grupo 1 → aviso.

### BB-08 · Elementos de entrada en el ejercicio
- **Cita:** CoP §12.7 Mounts b); HD pp. 82-83.
- **Regla:** dan DV una sola vez. Solo pueden hacerse dentro del ejercicio 1.208, 1.308, 1.210, 1.310, 1.311 (desde parada), 1.411, 1.312, 1.412, 1.213, 1.313, 1.413; 1.207 no (empieza en el trampolín).
- **Estado:** PARCIAL (la clave da DV una vez; falta el aviso).
- **Detección:** fila de grupo 1 que no es la primera y no está en la lista → aviso "no puede hacerse en el ejercicio".

### BB-09 · CR1: conexión de 2 elementos de danza distintos, uno con split de 180° o straddle
- **Cita:** CoP §12.3 (p. 49).
- **Regla:** conexión directa de al menos 2 elementos de danza **distintos**; uno de ellos un **leap o jump** con split de 180° (transversal o lateral) o en straddle; en la viga.
- **Estado:** PARCIAL. La regex se puede cumplir con el texto de un **giro** ("held upward in 180° split position", 3.305) en vez del salto; "Sissone" está escrito "sissonne" en la regex.
- **Detección:** lista `BB_SPLIT` = 2.101, 2.301, 2.202, 2.302, 2.402, 2.203, 2.303, 2.403, 2.404, 2.504, 2.305, 2.405, 2.505, 2.206, 2.306, 2.506, 2.108, 2.208, 2.408. Condición: `A.c`, los dos `tipo==='danza'`, distinta `k`, (A o B ∈ `BB_SPLIT`), sin `nv`.
- **Pruebas:** BB `3.305> 2.112 6.405` (giro + wolf jump) → CR1 **no** (hoy sí). BB `2.305> 2.112` → sí.

### BB-10 · CR2: giro (Gr. 3) o rol/flair
- **Cita:** CoP §12.3 (lista de roles/flairs); HD p. 78.
- **Regla:** cualquier giro del Gr. 3, o 1.303, 1.403, 1.304, 1.207, 1.308, 1.514, 4.203, 4.204, 4.304, 4.105, 4.305, 4.206, 4.306, 4.207, 4.307, 5.405, 5.505. 5.405, 5.505, 1.304 y 1.514 solo si rodean la viga; 1.207, 4.203, 4.204 sin parar en hombros o espalda. Los roles solo sirven para CR2 (pero 1.514 y 5.505, que son flic-flac, también cumplen CR4: HD p. 78).
- **Estado:** OK (lista); las condiciones quedan como aviso.

### BB-11 · CR3: serie acro de 2 elementos con vuelo, uno mortal
- **Cita:** CoP §12.3 (p. 49); HD p. 77.
- **Regla:** al menos 2 elementos acro con vuelo (con o sin apoyo de manos) conectados, uno de ellos mortal; pueden ser iguales; con o sin rebote; en la viga (no salida). Hold con vuelo y Onodi en tic-toc solo al final.
- **Estado:** PARCIAL. Usa `/salto/` en el texto: los aéreos (5.408, 5.409, 5.508, 6.101…) no cuentan como mortal; incluye las entradas con vuelo.
- **Detección:** `BB_VUELO` = grupo 5 (todos) + entradas con vuelo (1.4xx-1.7xx con mortal o flic-flac: 1.314, 1.414, 1.514, 1.609, 1.416, 1.516, 1.616, 1.716, 1.317, 1.417, 1.517, 1.518, 1.618, 1.718, 1.619) — para CR3 usar solo las que están "en la viga" (excluir entradas: confirmar con el juez). `BB_MORTAL` = elementos acro con vuelo **sin apoyo de manos**: 5.310-5.613, 5.408, 5.409, 5.508 (aéreos: cuentan como mortal, interpretación; confirmar).
- **Pruebas:** BB `5.202> 5.408 6.405` (flic-flac + rueda aérea) → CR3 **sí** (hoy no). BB `5.202> 5.202> 5.312` → sí.

### BB-12 · CR4: acro en direcciones distintas (adelante/lateral y atrás)
- **Cita:** CoP §12.3 (p. 49 y notas); HD pp. 78, 86 (tic-toc 4.108 = adelante; Garrison 4.210 = atrás).
- **Regla:** acro en la viga (no entrada ni salida; no holds ni paradas; los roles solo CR2) en las dos direcciones.
- **Estado:** MAL: árabe cuenta como las dos direcciones; 4.108 (tic-toc), 4.204, 4.309, 5.401, 5.613 se marcan en las dos; los "from side position" quedan fuera (`position`); los roles cuentan.
- **Detección:** tabla `DIR_BB` (una sola dirección por elemento/variante):
  - Adelante (F): 4.108 (las tres variantes, tic-toc incluido), 4.208, 4.308, 5.201, 5.301, 5.409, 5.310, 5.410, 5.510, 5.611 (árabe).
  - Lateral (S, cuenta como F): 4.107, 5.208, 5.408, 5.508, 5.411, 5.511.
  - Atrás (B): 4.109, 4.209, 4.309, 4.210, 4.310, 5.202-5.207, 5.302-5.307, 5.402-5.407, 5.405, 5.505, 5.312, 5.512, 5.612, 5.712, 5.313, 5.613, y 1.514 (flic-flac con giro, HD p. 78).
  - Sin dirección (no cumplen CR4): holds/paradas (BB-05) y roles (4.203, 4.204, 4.304, 4.105, 4.305, 4.206, 4.306, 4.207, 4.307).
  - Dudosos: 5.401/5.501 (Onodi/Worley: despegue atrás con ½ y paloma adelante) → aviso para el juez.
- **Pruebas:** BB `5.402 5.410 6.405` → CR4 **sí** (hoy no). BB `5.611 6.405` → no (hoy sí). BB `4.108 6.405` → no.

### BB-13 · CV acro (rebote obligatorio)
- **Cita:** CoP §12.4 (p. 49); HD pp. 78-79.
- **Regla:** 2 elementos acro **con vuelo**, incluida la entrada, **excluida la salida**; todas con rebote.
  - **0.10:** C + C; B + D **solo con los dos desplazándose hacia atrás y en ese orden**; B + E.
  - **0.20:** C/D + D o más; B + D **con los dos hacia adelante** (orden libre, porque el CoP no dice "this order only"); B + F.
  - Sin CV ni SB si se agarra de la viga (`agv`).
  - HD p. 79: paloma adelante + mortal atrás → no hay CV (no van en una misma dirección).
- **Estado:** PARCIAL: B+D da 0.10 siempre (con aviso); no revisa dirección ni orden; acepta holds al inicio; no hay `nr`.
- **Detección:** `dirBB` de BB-12; rebote: por defecto sí, bandera `nr` para negarlo.
- **Efecto:**
  ```
  si A o B no tienen vuelo, o B es salida, o A.nr → 0
  si min>=.3 y max>=.4 → .2          // C/D + D o más
  si {B,F} → .2; si {B,D} y los dos F → .2
  si {B,E} → .1; si min>=.3 → .1     // C+C
  si A=B(.2), B=D(.4), los dos B (atrás) → .1
  ```
- **Pruebas:** `5.201> 5.410` (B+D adelante) → **0.20** (hoy 0.10). `5.410> 5.201` → **0.20** (hoy 0.10). `5.202> 5.402` (B+D atrás) → 0.10 (hoy 0.10). `5.402> 5.202` → **0** (hoy 0.10). `5.202> 5.408` (flic-flac + rueda aérea lateral) → **0** (hoy 0.10). `5.202> 5.512` → 0.10.

### BB-14 · CV de danza y mixta
- **Cita:** CoP §12.4 (p. 50); HD p. 79.
- **Regla:** acro solo con vuelo; excluida la salida.
  - **0.10:** C + C o más (danza); A + C (solo giros); B + D (mixta, orden libre).
  - **0.20:** D + D o más (danza o mixta).
  - En los giros se entra con paso a la pierna contraria (no demi-plié en uno o dos pies). Danza + mortal gainer: sin balanceo atrás de la pierna libre. La danza no se repite en conexión.
- **Estado:** PARCIAL: no bloquea la danza repetida; los avisos de giro/gainer no existen.
- **Pruebas:** `2.203> 5.410` (B+D mixta) → 0.10. `2.305> 2.305` → **0**. `3.101> 3.302` (giros A+C) → 0.10 + aviso "entrar con paso a la pierna contraria".

### BB-15 · Bonificación de serie (SB) 0.10
- **Cita:** CoP §12.4 (p. 50); HD pp. 79-80.
- **Regla:** 3 o más elementos conectados (danza, mixta o acro; con o sin rebote), mínimo **B + B + C en cualquier orden**, incluidas entrada y salida (salida mínimo C); además del CV. Acro sin vuelo de mínimo B (no holds). El mismo acro puede repetirse dentro de la serie. **Máximo 0.10 por serie** sin importar cuántos elementos. Si cae en el 3.º, se da el CV de los dos primeros pero no el SB. Sin SB si se agarra de la viga. La danza no se repite.
- **Estado:** PARCIAL/MAL (bug de `position`, ver BB-05; no revisa danza repetida ni `agv`).
- **Pruebas:** `2.202> 2.305> 2.203 6.405` → SB **0.10** (hoy 0). `5.202> 5.202> 5.312 6.405` → SB 0.10. `5.312> 5.312> 5.312(caida)` → CV 0.10 (las dos primeras) y SB 0.

### BB-16 · Los 5 elementos B que pueden repetirse para CV/SB
- **Cita:** CoP §12.4 (p. 50); HD p. 16.
- **Regla:** flic-flac con piernas juntas (5.202), flic-flac con paso (5.204), gainer flic-flac (5.206), rondada (5.208) y paloma adelante (5.201) pueden hacerse **una 2.ª vez** en el ejercicio (también como parte de la salida) para dar CV y SB, pero no DV ni CR.
- **Estado:** MAL. El mapa `used` bloquea la 2.ª conexión si la 1.ª dio CV.
- **Detección:** claves `VIGA|5.201, 5.202, 5.204, 5.206, 5.208` → permitir dos usos en conexiones distintas.
- **Pruebas:** BB `5.202> 5.512 2.305 5.202> 5.512` → la 1.ª B+E = 0.10; la 2.ª: el 5.512 repetido ya no da CV (regla general), así que 0. Con `5.202> 5.512 2.305 5.202> 5.612` → 0.10 + 0.20 (B+F).

### BB-17 · Acro repetido con apoyo de manos dentro de la conexión
- **Cita:** HD p. 17.
- **Regla:** si un acro con apoyo de manos se repite dentro de la conexión, el repetido no sirve para la conexión siguiente (D + X + C: solo D+X; más SB).
- **Estado:** FALTA. **Pruebas:** `5.407> 5.407> 5.312` (D + D repetido + C) → CV 0.20 + 0 + SB 0.10.

### BB-18 · Penalizaciones neutrales de viga
- **Cita:** CoP §12.1 (p. 48); §9.3 (p. 38); HD p. 76.
- **Regla:** más de 90 s: −0.10 (desde 91 s; si la salida cae con el 2.º gong, sin descuento); exceder 10 s tras una caída −0.30; no reanudar en 60 s: terminado; 2.º intento de entrada −1.00 (D). 1.er intento tocando trampolín o viga: −1.00 (E) y la entrada sin valor ("Mount without DV" −0.10, E). Agarrarse de la viga: −0.50 (E), sin CV ni SB.
- **Estado:** FALTA (N/C; campos `a.p.VIGA`).

### BB-19 · Deducciones del jurado E que se pueden avisar
- **Cita:** CoP §12.5 (p. 50); HD p. 80.
- **Regla:** entrada sin DV −0.10 (todas las entradas sin DV cuentan como A, excepto subir una pierna para sentarse, squat on, paso o salto simple a sentada/rodilla o a uno o dos pies).
- **Estado:** FALTA. **Detección:** la 1.ª fila no es del grupo 1 o no tiene DV → aviso E −0.10.

### BB-20 · Reconocimientos específicos (HD pp. 83-88) — texto de ayuda
- 1.314 debe terminar en apoyo facial (si no, sin DV; si la cadera baja de la viga, entrada A). 1.101 sin arabesca → A + 0.10 precisión. 1.105: posición final como se pide o A. 2.108 sissone: caer en un pie (en dos = split jump). 2.208 vs 2.408: un pie = sissone a anillo; dos pies = split jump a anillo. 4.305 dentro de 10° = C; si no, A (sigue cumpliendo CR2). 4.306, 4.307, 4.210 con requisitos propios. 5.201 en conexión con rebote siempre B. 5.408 en uno o dos pies = mismo; rueda aérea gainer = rueda aérea; walkover aéreo gainer = walkover aéreo. 5.411 con una pierna extendida = mortal lateral con deducción. 5.612/5.712: sin devaluación (solo precisión). Salidas gainer 6.207-6.507 al final de la viga deben pasar por el extremo (si no, son laterales). Salidas gainer extendidas con giro: si muestra carpado, deducción, no cambio.
- **Estado:** N/C.

### BB-21 · Salida con caída
- **Cita:** CoP §12.6 (p. 51); HD p. 77.
- **Regla:** sin iniciar el mortal y cae (salta de la viga): sin DV, cuentan 7, −0.50 (D). Inició el mortal y no cae de pies: sin DV, cuentan 7, sin −0.50. Si vuelve a subir y hace la salida: sin −0.50. 6.101 sin iniciar el ½ giro = sin salida.
- **Estado:** PARCIAL (GEN-18).

---

## 6. Suelo — FX (CoP §13, pp. 53-57; tablas pp. 149-169)

### FX-01 · 8 DV con la salida; 3 danza / 3 acro; sin salida −0.50
- **Cita:** CoP §13.2 (p. 55).
- **Estado:** PARCIAL: hay cota de 5 por tipo; no fuerza la salida y **no aplica −0.50** nunca en FX.

### FX-02 · Definición de línea acrobática
- **Cita:** CoP §13.2 (p. 55); HD p. 90.
- **Regla:** una línea es al menos **2 elementos con vuelo conectados directamente, uno de ellos mortal**. Vale la conexión directa o indirecta de mortales, con al menos uno despegando de **dos pies**. Una conexión acro + mixta es una sola línea; una conexión que usa 2 diagonales es una sola línea; 2 mortales (iguales o distintos) conectados directamente son línea. **No** son línea: un mortal o doble mortal solo; elementos no conectados directamente o sin vuelo; solo aéreos o mortales de un pie; elementos sin mortal (rondada + flic-flac). Si no cae de pies de un mortal, sigue siendo línea.
- **Estado:** FALTA (hoy solo existe la casilla manual "Tiene más de 2 líneas").
- **Detección (algoritmo):**
  1. Cadenas = filas consecutivas unidas por `c` o `ind`.
  2. `vueloFX(e)`: FX 3.105, 3.305, 3.106, 3.107, 3.207 (rondada, flic-flac, palomas) y 3.102 (Hecht roll; dudoso) + grupos 4 y 5.
  3. `mortal2pies(e)`: grupos 4 y 5 excepto 4.103 y 4.104 (aéreos) y las filas con `p1`; 4.105 (mortal lateral, "de uno o dos pies") por defecto de un pie.
  4. Una cadena es línea si tiene ≥2 filas con `vueloFX` **y** ≥1 `mortal2pies` **y** al menos dos de esas filas con vuelo son vecinas en la cadena. Una fila suelta de mortal con `pre` (entrada acrobática no capturada) también es línea.
  5. Los elementos de danza dentro de la cadena (conexión mixta) pertenecen a la línea.
- **Pruebas:** `3.106> 3.107> 5.402` → línea. `5.402` solo → no. `3.106> 3.107` → no. `4.104> 4.103` (aéreos) → no. `4.101> 4.202` → línea. `5.402(pre)` → línea.

### FX-03 · Máximo 4 líneas; qué acro cuenta para DV
- **Cita:** CoP §13.2 (p. 55); HD pp. 10-11, 91.
- **Regla:** máximo 4 líneas: la dificultad de las líneas 5.ª y siguientes no cuenta (tampoco la danza de esa línea: sin DV ni CV, HD p. 91). Los acro hechos **después de la última línea que cuenta** no dan DV (sí cuentan para el ejercicio corto). Los acro sueltos **antes** de la última línea sí cuentan. Si **no hay ninguna línea**, los acro sueltos no dan DV (HD p. 11).
- **Estado:** FALTA.
- **Efecto:** `elegibleDV(fila)` = danza que no está en la 5.ª+ línea, **o** acro con índice ≤ último índice de la 4.ª línea (o de la última, si hay menos) y que no está en la 5.ª+ línea; si hay 0 líneas, ningún acro. Los no elegibles: DV 0, `why` correspondiente, sí cuentan para el ejercicio corto.
- **Pruebas:** FX `3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301 4.302` → 4.302 (después de la última línea) sin DV. Resultado esperado completo en FX-04.

### FX-04 · La salida es la última línea que cuenta; sin salida
- **Cita:** CoP §13.2 (p. 55), §13.6 ejemplos 1-5 (p. 57); HD pp. 92-93.
- **Regla:** la salida es la **última línea que cuenta**; se acredita el **mortal de mayor DV** de esa línea, que entra entre los 8. Con **una sola línea** no se acredita salida: −0.50 y cuentan 7 (los elementos de la línea dan DV normal). Si el mortal de la salida es una **repetición** o **no cae de pies**: sin DV, cuentan 7, **sin** −0.50. Si se salta la última línea pero tiene al menos 2: la salida es la última línea hecha. Con 0 líneas: sin salida (−0.50).
- **Estado:** MAL: toma el **último mortal** de toda la rutina (aunque sea suelto) y nunca resta −0.50.
- **Pruebas:**
  - FX1 `3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301 4.302`: 2 líneas; DMT = 5.301 (C); 4.302 sin DV; 2.º RO/FF repetidos sin DV. DV = 5.402 0.40 + 5.301 0.30 + RO 0.10 + FF 0.10 + 2.101 0.10 = **1.00**; CR: CR2 (5.301) + CR3 (5.402) = **1.00** (CR4 no: 4.302 está fuera de las líneas); CV 0; bono 0; corto: 6 elementos (RO, FF, 5.402, 2.101, 5.301, 4.302) → −4.00. D = **2.00** (hoy 2.80: dv 1.30, cr 1.50).
  - FX12 `3.106> 3.107> 5.402 1.101 2.101 1.205`: 1 línea → −0.50; DV = 0.10+0.10+0.40+0.10+0.10+0.20 = 1.00; CR3 0.50; D = 1.50; nd = 0.50 + 4.00.
  - FX `3.106> 3.107> 5.402 3.106> 3.107> 5.402(nv)`: la salida no tiene DV (repetición): cuentan 7, sin −0.50.

### FX-05 · Bono de salida en FX
- **Cita:** CoP §7.4.3, §13.4 b) (p. 55); HD pp. 93-94.
- **Regla:** +0.20 si: el mortal de salida (FX-04) vale D o más; la última línea **sin caída** (ninguna fila de esa línea con `caida`/`nv`); **más de dos líneas**; no Junior. Un mortal con giro incompleto en una línea anterior no quita el bono.
- **Estado:** MAL: la casilla `a.p.lineas` vale "sí" si no se toca; usa el último mortal (no el de mayor valor de la última línea) y solo revisa la caída de ese mortal.
- **Detección:** número de líneas del motor FX-02; quitar la casilla manual (o dejarla solo para anular).
- **Pruebas:**
  - FX2 `3.106> 3.107> 5.402 3.106> 3.107> 5.301 4.101> 4.202 1.205 3.106> 3.107> 5.502` → 4 líneas; DMT 5.502 (E) → bono 0.20; DV = 0.50+0.40+0.30+0.20+0.10 (5 acro) + 0.20 (danza) = **1.70**; CR 1.50 (CR2, CR3, CR4 con 4.101/4.202 en línea); D = **3.40** (hoy 3.40, correcto por coincidencia).
  - FX1 (2 líneas) → sin bono aunque la salida sea D.

### FX-06 · CR1: pasaje de danza
- **Cita:** CoP §13.3 (p. 55); HD p. 91 (NEW); NL1 p. 2.
- **Regla:** dos **leaps o hops** distintos de la tabla, conectados directa o **indirectamente** (pasos de carrera, saltitos, hops, chassé, chainé ½ en dos pies), uno con split de 180° (transversal o lateral) o straddle. Sin jumps (despegue de dos pies) ni giros. Si es el 1.er elemento del pasaje debe caer en **una pierna**. NL1: no se da si hay parada, pose, pasos caminando o saltitos de dos pies entre los dos. HD: no se permite ir y venir.
- **Estado:** PARCIAL: exige `c` (directa) y no tiene forma de marcar la indirecta; la regex excluye cualquier recuadro cuyo texto mencione "jump" aunque su variante sea un hop (1.110, 1.213, 1.214); no revisa la caída en una pierna del 1.º.
- **Detección:**
  - `FX_LEAPHOP` = 1.101, 1.201, 1.301, 1.202, 1.302, 1.402, 1.104, 1.204, 1.304, 1.404, 1.105, 1.205, 1.305, 1.405, 1.309 (variante leap), 1.409, 1.509, 1.111, 1.211, 1.311, 1.112, 1.212, y las variantes "hop" de 1.110, 1.213, 1.313, 1.114, 1.214, 1.514, 1.108, 1.208.
  - `FX_SPLIT` = 1.101, 1.201, 1.301, 1.202, 1.302, 1.402, 1.104, 1.204, 1.304, 1.404, 1.205, 1.305, 1.405, 1.309, 1.409, 1.509.
  - Conexión: `A.c` o `A.pas` (nueva bandera).
  - Caída en una pierna del 1.º: si el texto admite "one or both feet" (1.104, 1.302, 1.402) → aviso "debe caer en una pierna".
- **Pruebas:** FX `1.101(pas) 1.205` → CR1 sí (hoy no, sin `c`). FX `1.107> 1.205` (straddle jump + switch) → no (jump).

### FX-07 · CR2, CR3 y CR4 dentro de líneas
- **Cita:** CoP §13.3 (p. 55: "CR #2, 3 and 4 must be performed within acro lines"); HD p. 92.
- **Regla:** CR2 mortal con giro longitudinal de 360° o más; CR3 mortal con doble rotación transversal; CR4 mortal atrás y mortal adelante (sin aéreos), en la misma línea o en distintas. Todos **dentro de líneas que cuentan**. Un elemento puede cumplir varios. Árabe = adelante; árabe con 180° adicionales = atrás.
- **Estado:** MAL: ignora las líneas; árabe en las dos direcciones; árabes dobles no son adelante; 4.105 (mortal lateral) cuenta como adelante; en recuadros con "½ or 1/1" (4.201, 5.201) da el CR2 aunque la variante sea ½.
- **Detección:**
  - `FX_GIRO360` = 4.201 (variante 1/1), 4.302, 4.402, 4.502, 4.602, 5.201 (variante 1/1), 5.301, 5.401, 5.501, 5.601, 5.502, 5.602, 5.802, 5.1002, 5.803, 5.903, 5.304.
  - `FX_DOBLE` = 4.501, 4.601, 4.505, 4.605, 4.805, 5.402, 5.502, 5.602, 5.802, 5.1002, 5.603, 5.703, 5.803, 5.903.
  - `FX_ADEL` = 4.101, 4.201, 4.202, 4.302, 4.402, 4.502, 4.602, 4.501, 4.601, 4.205, 4.505, 4.605, 4.805.
  - `FX_ATRAS` = todo el grupo 5.
  - Excluidos de CR4: 4.103, 4.104 (aéreos) y 4.105 (lateral).
- **Pruebas:** FX `3.106> 4.205> 4.202` → CR4 **no** (hoy sí). FX `3.106> 3.107> 4.505 3.106> 3.107> 5.402` → CR4 sí y CR3 sí.

### FX-08 · Tablas de CV del suelo
- **Cita:** CoP §13.4 (p. 56); HD pp. 15-16, 93.
- **Regla:**
  - **Indirecta acro** (mortales con elementos de vuelo y apoyo de manos entre ellos): 0.10 = B + D, A + A + D; 0.20 = C + D/E, A + A + E.
  - **Directa acro:** 0.10 = A + D, C + C; 0.20 = A + E, B/C + D.
  - **Mixta (solo en este orden):** 0.10 = mortal D + danza B; mortal E + danza A.
  - **Giros sobre una pierna:** 0.10 = D + B (entrando con paso a la pierna contraria, sin demi-plié). El orden es libre porque el CoP no dice "this order only" (§7.4.1).
  - Los acro para CV son **solo sin apoyo de manos** (las rondadas y flic-flac no entran en la fórmula).
  - El mismo mortal puede repetirse dentro de una conexión (directa o indirecta); con 3+ elementos el repetido debe ir directo. Se elige directa o indirecta según convenga, pero un mortal no se usa en las dos (HD p. 15). El HD permite "absorción" en algunas conexiones directas acro y mixtas (decisión del juez).
  - "O más": se aplica por valor (B+E indirecta = 0.10, interpretación; B/C + E directa = 0.20).
- **Estado:** PARCIAL: solo pares; la indirecta solo funciona si el juez **no** captura la rondada/flic-flac y marca `ind` (lo que rompe la detección de líneas); faltan las triples A+A+D/E; giros B+D (orden inverso) dan 0.
- **Detección:** dentro de cada línea, quitar los elementos del grupo 3 y conectar mortales consecutivos: si entre ellos hubo filas con apoyo de manos → indirecta; si no → directa. Triples: tres mortales A, A, D/E con la conexión entre el 2.º y el 3.º indirecta.
- **Pruebas:** `5.201~ 5.402` → 0.10 (hoy 0.10). `5.104> 5.104> 3.107> 5.402` → A+A+D indirecta = 0.10 (hoy 0). `3.106> 3.107> 5.201> 3.107> 5.402` (con filas de apoyo de manos) → 0.10 (hoy 0). `2.202> 2.402` (giros B+D) → **0.10** (hoy 0). `5.402> 1.205` → 0.10; `1.205> 5.402` → 0.

### FX-09 · Mortal con giro incompleto conectado
- **Cita:** CoP §8.1.2 b); HD p. 20. Ver GEN-12. **Estado:** N/C (aviso).

### FX-10 · Repeticiones en suelo
- **Cita:** CoP §7.2.1; HD p. 92.
- **Regla:** la rondada o el flic-flac repetidos en otra línea no dan DV, pero sí forman línea. Un mortal repetido en otra conexión no da CV.
- **Estado:** OK para el DV por clave (salvo variantes, GEN-05); las líneas deben calcularse con todas las filas, aunque sean repeticiones.

### FX-11 · Reconocimientos específicos (HD p. 98)
- **Regla:** 5.304 (whip con 1/1) solo se reconoce si va conectado (directo o indirecto) con otro mortal atrás; si va solo, es 5.201 (B). Mortal doble extendido: mantener la extensión la mayor parte, si no carpado; si se agarra los muslos en el 2.º mortal = carpado. 1.203 butterfly: el tronco paralelo al suelo.
- **Estado:** FALTA (5.304, calculable).
- **Detección:** `PISO|5.304` sin `c`/`ind` a otro mortal del grupo 5 → tratar como `PISO|5.201` (B) y avisar.
- **Pruebas:** FX `5.304` suelto en una línea con rondada antes (`3.106> 3.107> 5.304`) → B.

### FX-12 · Penalizaciones neutrales de suelo
- **Cita:** CoP §13.1 (p. 54); HD p. 90.
- **Regla:** sin música o música con palabras −1.00 (D); más de 90 s −0.10 (desde 91 s); salir del área con un pie/mano −0.10, con los dos pies/manos u otra parte del cuerpo −0.30 (cada vez; tocar fuera con la rodilla −0.30; salir, volver y salir otra vez = 2 × 0.10).
- **Estado:** FALTA (N/C; campos `a.p.PISO`).

### FX-13 · Deducciones del jurado E que se pueden avisar
- **Cita:** CoP §13.6 (p. 57); HD pp. 95-96.
- **Regla:** empieza directo con línea o elemento acro −0.10; termina con elemento acro (sin coreografía después) −0.10; línea siguiente en la misma diagonal sin coreografía −0.10; más de una línea seguida −0.10 cada una.
- **Estado:** FALTA.
- **Detección:** la 1.ª fila es acro → aviso "si empieza directo con el acro: −0.10 (E)"; la última fila es acro → aviso "si no hay coreografía después del último acro: −0.10 (E)". Las demás son N/C.

### FX-14 · Danza dentro de una 5.ª línea
- **Cita:** HD p. 91. **Regla:** sin DV ni CV. **Estado:** FALTA (va con FX-03).

---

## 7. Penalizaciones neutrales del jurado D (lista completa)

| Aparato | Falta | Valor | Cita | ¿Calculable? |
|---|---|---|---|---|
| UB/BB/FX | Sin salida | −0.50 | §11.2, §12.2, §13.2 | **Sí** (UB/BB hoy; FX falta) |
| UB/BB/FX | Ejercicio corto | −4/−6/−8/−10 (JR distinto) | §6.3 | **Sí** |
| UB/BB/FX | Ayuda del entrenador | −1.00 (+ sin CV/bono, o + sin DV/CR) | §9.3 | Con bandera `ayu` |
| Todos | No presentarse al jurado D antes/después | −0.30 | §9.3 | Campo |
| Todos | Presencia no permitida del ayudante | −0.50 | §9.3 | Campo |
| UB | Correr o caminar bajo la BI para entrar | −0.30 | §11.1 | Campo |
| UB/BB | 2.º intento de entrada | −1.00 | §11.1, §12.1 | Campo |
| UB | Exceder 30 s tras una caída | −0.30 | §11.1 b) | Campo |
| BB | Exceder 10 s tras una caída | −0.30 | §12.1 c) | Campo |
| BB/FX | Tiempo (desde 91 s) | −0.10 | §12.1 b), §13.1 b) | Campo de segundos |
| FX | Fuera del área: un pie/mano | −0.10 cada vez | §13.1 c) | Contador |
| FX | Fuera del área: dos pies/manos o parte del cuerpo | −0.30 cada vez | §13.1 c) | Contador |
| FX | Sin música o con palabras | −1.00 | §13.1 a) | Campo |
| FX | Despegue totalmente fuera del área | sin DV, CV ni CR | §9.3 | Bandera `nv` |
| Todos | Empezar sin señal o con luz roja | nota 0 | §9.3; NL1 | Campo |
| Todos | No empezar a los 30 s de la luz verde | −0.30 | §9.3 | Campo |
| VT | Carrera vacía | −1.00 | §10.2 | Contador |
| VT | Carrera de más de 25 m | −0.50 | §10.4.2 | Campo |
| VT | Carrera sin saltar | −1.00 | §10.4.2 | Campo |
| VT | Apoyo con una mano | −2.00 | §10.4.2 | Campo |
| VT | Corredor: 1 pie/mano / 2 o parte del cuerpo | −0.10 / −0.30 | §10.4.1 | Contador |
| VT | Colchón de manos fuera de Yurchenko | −0.50 | HD p. 48 | Campo |
| VT | Salto nulo | 0.00 | §10.4.3 | Bandera `nulo` |
| Varios (SJ) | Vestimenta, número, bandera, magnesio, muelles, altura, colchón suplementario | −0.30 / −0.50 | §2.4, §9.3 | Fuera del alcance |

---

## 8. Avisos para el jurado E que se pueden dar desde la composición

| ID | Aparato | Aviso | Cita | Disparador |
|---|---|---|---|---|
| E-UB-1 | UB | Balanceo vacío/intermedio −0.50 y sin CV | §11.4 d), §11.6 | Bandera `bv`; fila sin catálogo después de una conexión |
| E-UB-2 | UB | Kip después de un tipo Shaposhnikova o hecht ½ → −0.50 | HD p. 64 | UB-12 |
| E-UB-3 | UB | Más de 2 elementos iguales conectados a la salida −0.10 | §11.5 | UB-13 |
| E-UB-4 | UB | Elemento poco característico (despegue de 2 pies o muslos) −0.50 | §11.6 | Aviso en las entradas/elementos con despegue de pies |
| E-BB-1 | BB | Entrada sin DV −0.10 | §12.5 | BB-19 |
| E-BB-2 | BB | Agarrarse de la viga −0.50 | §12.6 | Bandera `agv` |
| E-BB-3 | BB | Más de un ½ giro en dos pies con piernas extendidas −0.10 | §12.5 | N/C (no son elementos) |
| E-FX-1 | FX | Empieza con acro −0.10 / termina con acro −0.10 | §13.6 | FX-13 |
| E-FX-2 | FX | Líneas seguidas sin coreografía −0.10 | §13.6 | N/C |
| E-BB/FX | BB/FX | Giros: entrar con paso a la pierna contraria (si no, sin CV) | §12.4, §13.4 | Conexión con un giro como 2.º elemento |

---

## 9. Correcciones del catálogo (`elementos_fig_wag.json`)

- **CAT-01:** `VIGA|1.402` y `VIGA|1.405` → `tipo:'danza'` (CoP pp. 108-109, "(D)"). Hoy son `acro`: cambian el conteo 3/3 y el CR1.
- **CAT-02:** `VIGA|2.408` debería tener `rot:'mismo_recuadro_dv_una_vez'` (CoP p. 124 "(*)"). Sin efecto en el cálculo (la regla de danza es general).
- **CAT-03:** `junior.prohibidos_candidatos`: marcar como seguros `BARRAS|1.207, 1.407, 1.609, 1.709` (y `1.307`/`1.409` por variante); agregar `VIGA|1.405` (probable) y dejar `PISO|3.102` como "revisar". Ver JR-07.
- **CAT-04:** agregar a cada recuadro con varias variantes una lista estructurada (`vars:[{t:'…', pos:'t|p|s', giro:360, vuelo:'misma|ba-bi|bi-ba'|null, agr:'reg|inv|L|mix', dir:'F|B|S'}]`). Es la base de GEN-05, UB-06/07/08/09/10, BB-12 y FX-07. Mientras no exista, usar las listas de esta especificación más el selector `var`.
- **CAT-05:** agregar a UB `raiz` (tabla de UB-02) y `linea_tk` / `jaeger` (UB-03/04).

---

## 10. Cambios del Help Desk 2.ª ed. y del Boletín n.º 1 que afectan lo anterior

| Fuente | Cambio o aclaración | Reglas |
|---|---|---|
| HD p. 10-11 | Qué se cuenta para el ejercicio corto (repetidos no; root/Tkatchev sí; acro después de la última línea sí; danza del mismo recuadro sí); "sin salida" se suma al ejercicio corto | GEN-17 |
| HD p. 12 | Deltchev y Gienger son distintos | GEN-05 |
| HD p. 13 | 3 principios de reconocimiento (otro elemento / 1 DV menos / sin DV) | GEN-10 |
| HD p. 14 | El elemento repetido no cumple otro CR | GEN-13 |
| HD p. 15 | Directa o indirecta según convenga, sin usar un mortal para las dos | GEN-14, FX-08 |
| HD p. 16-17 | Repetición en conexión: danza no; acro con apoyo de manos repetido no sirve para la siguiente; mortal repetido directo | GEN-14, BB-17 |
| HD p. 60 | La raíz también depende del agarre; el 4.º conectado no da CV; las repeticiones cuentan en la raíz | UB-02 |
| HD p. 61 | Tkatchev denegado ocupa lugar en la raíz; 1.103 y 2.202 (sin soltar las 2 manos) no cumplen CR2; 3.307 cumple CR3 solo en cubital | UB-02, UB-07, UB-08 |
| HD p. 62 | Entradas con giro no cumplen CR4; ejemplos de CV | UB-09, UB-10 |
| HD p. 63-65 | Caídas y CV en barras; golpe en el aparato no rompe la conexión; balanceos vacíos (NEW: elemento fuera del CoP = balanceo vacío) | UB-10, UB-11 |
| HD p. 74 | 6.101/6.102 sin iniciar el ½ = sin salida; 6.406 extendido | GEN-18, UB-17 |
| HD p. 77-80 | Danza en viga; condiciones de CR2; tabla de CV con dirección; SB máx. 0.10 por serie; caída en el 3.º = sin SB | BB-02, BB-10, BB-13, BB-15 |
| HD p. 82-87 | Entradas que se pueden hacer en el ejercicio; saltos laterales; holds; Onodi tic-toc; tic-toc adelante | BB-03, BB-04, BB-06, BB-08, BB-12 |
| HD p. 90-93 | Definición de línea (mortal de 2 pies; aéreos no); 5.ª línea; CR2-4 en líneas; árabe con 180° = atrás; salida por mayor DV; repetición o caída en la salida = 7 sin −0.50 | FX-02 a FX-07 |
| HD p. 98 | 5.304 solo conectado; 1.101 = jeté en tournant | FX-11, GEN-06 |
| NL1 p. 1 | Empezar sin señal o con luz roja = 0; UB: tras una caída puede usar el trampolín sin deducción; doble mortal atrás extendido D / carpado C | §7, UB-17 |
| NL1 p. 2 | FX CR1: sin paradas, poses, pasos caminando ni saltitos de dos pies | FX-06 |
| NL1 p. 4-9 | Elementos nuevos 2025 (2.706 Zhang, 3.608 Minamino, 3.708 Yang, 6.408 Okamura, BB 6.304 Mordenti, FX 1.509 Prat): **ya están** en el catálogo | — |
| NL1 p. 2 (Youth) | Reglas Youth (bono de salto, CR) | Fuera de alcance (no es Junior) |

---

## 11. Lista de cambios para `editor.js`, por impacto

1. **Motor de líneas acrobáticas de FX** (FX-02, FX-03, FX-04, FX-05, FX-07, FX-14): detectar las líneas; elegibilidad del DV (máx. 4 líneas, nada después de la última, nada sin líneas); salida = mayor DV de la última línea, forzada entre los 8; −0.50 con 0-1 línea; bono solo con >2 líneas y la última sin caída; CR2-4 solo dentro de líneas; quitar la casilla `lineas` (o dejarla solo para anular). Cambia casi todas las notas de suelo.
2. **Root skill, Tkatchev y Jaeger en UB** (UB-02, UB-03, UB-04): tablas de datos + conteo cronológico; 4.º sin DV/CR/CV; ejercicio corto según el HD.
3. **Bug `/hold|position/` en viga** (BB-05, BB-15, BB-12): usar listas de holds; hoy quita el SB de todas las series con saltos "from cross position" y el CR4 de los acro "from side position".
4. **Clasificación de vuelos en UB** (UB-06, UB-07, UB-10): listas BA→BI, BI→BA y misma barra; las salidas son vuelo; quitar 3.401. Arregla CR1 (hoy casi nunca se da), CR2 (falsos positivos) y CV.
5. **Fórmulas de CV de UB** (UB-10): D+D con vuelo o ½ giro; "D vuelo + C" solo con vuelo en la misma barra o BI→BA y el C en BA con vuelo o giro; E+E con salida.
6. **Salto** (VT-04, VT-05, VT-06, VT-07, VT-08, JR-05): −2.00 al 2.º del mismo grupo en el promedio; repetir el 1.º = 0; bono de direcciones (+0.20, Cuervo adelante); banderas de caída/nulo; uno en 0 → /2.
7. **Identidad de elemento por variante** (GEN-05, CAT-04): selector `var`; evita repeticiones falsas en 99 recuadros con varias variantes y da la base para giro, posición, agarre y dirección.
8. **CV acro de viga** (BB-13, BB-16, BB-17): dirección y orden en B+D; sin entrada/salida; holds solo al final; bandera `nr`; repetición permitida de los 5 elementos B; el acro con apoyo repetido no sirve para la siguiente.
9. **Tablas de dirección** (GEN-09, BB-12, FX-07): árabe adelante, tic-toc adelante, sin dobles direcciones; árabes dobles adelante; mortal lateral fuera.
10. **Bandera "sin DV" (`nv`)** y excepciones de la salida (GEN-10, GEN-11, GEN-18, BB-21): caídas sin pies; salida iniciada = 7 sin −0.50.
11. **Elementos prohibidos para Junior** (JR-07, CAT-03): lista ampliada y quitar el DV (salto: nulo).
12. **Un solo giro en cuclillas** (GEN-07).
13. **Conteo del ejercicio corto** según el HD (GEN-17).
14. **CR de viga y suelo**: CR1 de viga con lista de saltos con split (BB-09); CR3 con aéreos como mortal (BB-11); CR1 de suelo con `pas` y hops (FX-06); CR3 de UB con `agr` (UB-08); CR4 de UB con 3.401 (UB-09); el elemento repetido no cumple otro CR (GEN-13).
15. **Saltos laterales en viga +1 DV** (BB-03) y **holds de 2 s** (BB-04).
16. **CV general**: danza repetida en una conexión = 0; filas sin catálogo sin CV/CR (GEN-14); giros de suelo en cualquier orden y triples A+A+D/E indirectas (FX-08); 5.304 suelto = B (FX-11).
17. **Catálogo**: VIGA 1.402 y 1.405 → danza (CAT-01).
18. **Penalizaciones neutrales capturables** (§7): campos por aparato (tiempo, fuera del área, música, 2.º intento, ayuda, etc.), sumados a `nd`.
19. **Avisos del jurado E** (§8): balanceo vacío/kip tras Shaposhnikova, >2 iguales antes de la salida, entrada de viga sin DV, suelo empieza/termina con acro, entrada a giro con paso.
20. **Estructura del resultado**: como en el editor varonil, `res.why[i]` (motivo por fila sin DV), `res.enotes` (avisos E) y `res.ndDet` (detalle de penalizaciones), mostrados en la fila y en la impresión.

---

## 12. Pruebas: resultado actual del editor contra el esperado

Arnés (sin DOM): `/tmp/claude-0/-home-user/3fed70f7-bfd3-5190-ad93-3d26bddac982/scratchpad/scripts/spec/h.js` carga `editor.js` y el catálogo en un `vm`; `t3.js` y `t4.js` corren los casos (`node t3.js`). Notación `T(nombre, aparato, 'n1> n2 …', nivel)`.

| Caso | Rutina | Hoy | Esperado | Reglas |
|---|---|---|---|---|
| UB1 | `4.304 4.404 4.504 4.502 6.406` | D 3.80 (dv 2.10, cr 1.50) | D 2.30 (dv 1.60, cr 0.50), corto −4.00 | UB-02 |
| UB2 | `4.502 4.602 3.403 3.503 6.406` | D 3.60 | D 2.00 (dv 1.30) | UB-03 |
| UB3 | `3.308 3.408 6.406` | D 1.80 | D 1.40 (dv 0.70) | UB-04 |
| UB4 | `4.401> 4.406 6.406` | CV 0.10 | CV 0 | UB-10 |
| UB5 | `3.404> 2.305 6.406` | CV 0.20 | CV 0 | UB-10 |
| UB6 | `5.409> 2.305(½) 6.406` | CV 0.20 | CV 0.20 | UB-10 (OK) |
| UB7 | `4.504> 2.506` / `4.501> 4.504` | 0.20 / 0.10 | 0.20 / 0.10 | UB-10 (OK) |
| UB8 | `3.404 6.406` | CR [0000] | CR1 | UB-06 |
| UB9 | `3.401 6.406` | CR2 | CR4 | UB-07, UB-09 |
| UB10 | `3.206(agr=inv) 6.406` | sin CR3 | CR3 | UB-08 |
| UB11 | `3.405(Deltchev) 3.405(Gienger) 6.406` | 2.º repetido | dv 1.20 | GEN-05 |
| UB16 | `3.401> 3.403 6.406` | CV 0.20 | CV 0.10 | UB-10 |
| UB17 | `4.504> 6.505` | CV 0.10 | CV 0.20 | UB-10 |
| UB12 | `3.404 2.305` | nd 8.50 | nd 8.50 | GEN-18 (OK) |
| UB13 JR | `3.708 6.406` | dv 0.90, bono 0 | igual | JR-01 (OK) |
| UB14 JR | `1.407 6.406` | dv 0.80, sin aviso | dv 0.40 + aviso | JR-07 |
| BB1 | `2.202> 2.305> 2.203 6.405` | SB 0 | SB 0.10 | BB-05/15 |
| BB2b | `5.201> 5.410 6.405` | CV 0.10 | 0.20 | BB-13 |
| BB2c | `5.410> 5.201 6.405` | 0.10 | 0.20 | BB-13 |
| BB2e | `5.402> 5.202 6.405` | 0.10 | 0 | BB-13 |
| BB4 | `5.302> 5.312 6.405` | CV 0.10, CR3 | 0, sin CR3 | BB-05 |
| BB6 | `5.611 6.405` | CR4 | sin CR4 | GEN-09, BB-12 |
| BB7 | `3.207 3.407 6.405` | dv 1.00 | dv 0.60 | GEN-07 |
| BB9 | `5.402 5.410 6.405` | sin CR4 | CR4 | BB-12 |
| BB11 | `2.305> 2.305 6.405` | CV 0.10 | 0 | GEN-14 |
| BB12 | 10 acro + 1 danza | 6 cuentan, dv 2.40 | igual | GEN-04 (OK) |
| BB14 | `5.202> 5.202> 5.512 6.405` | CV 0.10, SB 0.10 | CV 0, SB 0.10 | BB-17 |
| BB15 | `5.202> 5.408 6.405` | CV 0.10, sin CR3 | CV 0, CR3 | BB-11, BB-13 |
| BB JR | `5.202> 5.612 6.405` | CV 0.10 | 0.10 | JR-02 (OK) |
| FX1 | `3.106> 3.107> 5.402 2.101 3.106> 3.107> 5.301 4.302` | D 2.80 | D 2.00, corto −4.00 | FX-03/04/07 |
| FX2 | 4 líneas (ver FX-05) | D 3.40 | D 3.40 | FX-05 (OK por coincidencia) |
| FX12 | `3.106> 3.107> 5.402 1.101 2.101 1.205` | sin −0.50 | −0.50 (1 línea) | FX-04 |
| FX4 | `2.202> 2.402` | CV 0 | 0.10 | FX-08 |
| FX5 | `2.207 2.407` | dv 0.60 | 0.20 | GEN-07 |
| FX6 | `4.205` | CR4 | sin CR4 | GEN-09 |
| FX6b | `4.505 5.402` en líneas | sin CR4 | CR4 | FX-07 |
| FX9 | `1.107 1.107 1.101 1.205` | corto con 3 | 4 elementos | GEN-17 |
| FX10 | `3.106> 4.205> 4.202` | CR4 | sin CR4 | FX-07 |
| VT1 | `4.35 5.33` | prom. 5.50 | 5.70 | VT-06 |
| VT2 | `4.35 4.34` | 5.20 | 4.20 | VT-04 |
| VT4 | `4.35 4.35` | 5.40 | 2.70 | VT-05 |
| VT3 JR | `4.35 5.33` | 5.50 | 5.50 | JR-05 (OK) |
