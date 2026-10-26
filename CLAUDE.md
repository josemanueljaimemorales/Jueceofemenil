# Jueceo GAF MEX — guía para Claude

App web sin build para jueces de Gimnasia Artística Femenil; hermana de Jueceo GAV MEX (mismo esquema). También sirve
para probar ajustes del editor femenil antes de pasarlos a la app oficial `APPBKA` (`modulos/femenil/rutinas/`).
La app es la carpeta `app/`; hoy se publica con GitHub Pages desde `main` (la raíz redirige a `app/`). Responder en
español, claro y sin relleno. Ver README.md.

- Sin Firebase ni usuarios. Rutinas solo en el equipo del juez (`localStorage` `jueceofem_rutinas`, distinta de la de
  BKA porque comparten el dominio github.io); nada de rutinas en la nube. Sin nombres de clubes ni del administrador en la app.
- Licencias como Jueceo GAV (`apps-script/Codigo.gs`, `app/app.js`, `app/admin.*`), pero **apagadas** mientras
  `api` esté vacía en `app/config.js` (Manu pidió la app sin contraseñas): la app abre directo y no muestra "Enviar sugerencia".
  Claves locales `jueceogaf_*`. La contraseña del panel (`CLAVE_ADMIN`) vive solo en Apps Script: nunca en el repo ni en mensajes.
- `app/editor.js`/`app/editor.css` vienen de `APPBKA/modulos/femenil/rutinas/editor.*`. Diferencias a conservar aquí:
  sin nube ni `cliente/acceso.js`, `iniciarEditor(datos)` en lugar de `init()` (app.js carga `datos/*.json`), inicio
  (`renderMenu`) con documentos, imprimir todas / Excel / sugerencia, impresión sin logos. Al pasar un ajuste a BKA
  copiar el cálculo/buscador/vistas y `datos/`, no estas diferencias.
- Documentos del inicio en `app/config.js` (`JUECEO.docs`): Código GAF en español (`app/docs/`), inglés y boletines WAG
  de la FIG, Rules & Policies de USAG (enlaces oficiales).
- Rutina de ejemplo: `app/datos/ejemplo.json` (atleta EJEMPLO, no es una gimnasta real), una vez por equipo.
- Al cambiar JS/CSS, subir el `?v=` en `app/index.html`/`app/admin.html` y `CACHE` en `app/sw.js`.
- Probar pantalla y PDF/impresión (fondo blanco, sin etiquetas de prueba) y los cálculos con casos límite antes de publicar.
