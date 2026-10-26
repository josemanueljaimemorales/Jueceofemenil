# Jueceo femenil — guía para Claude

App de **prueba** del editor de rutinas femenil (GAF). Independiente de BKA: aquí se prueban ajustes y, cuando funcionan
y Manu los aprueba, se pasan a la app oficial `APPBKA` (`modulos/femenil/rutinas/`). Se publica con GitHub Pages desde `main`.
Responder en español, claro y sin relleno.

- Viene de `APPBKA/modulos/femenil/rutinas` (editor.js, editor.css, datos/, fuentes/). Diferencias a conservar aquí:
  - Sin contraseñas ni usuarios (no hay `cliente/acceso.js` ni scripts de Firebase en `index.html`).
  - Sin nube: `FB_CONFIG=null`; las rutinas se guardan solo en el equipo, `localStorage` con la clave `jueceofem_rutinas`
    (distinta de la de BKA porque las dos apps comparten el dominio github.io).
  - Sin enlace "← GAF" ni botón "Mi cuenta".
- Al pasar un ajuste a BKA: copiar el cálculo/buscador/vistas y los `datos/`, pero no estas diferencias (BKA usa su
  Firebase `bkaapp-f61f4`, `cliente/acceso.js` con usuarios, y la clave `rutinasFemBKA_estado`). Subir el `?v=` de los
  archivos cambiados en el `index.html` de cada app.
- Probar pantalla y PDF/impresión (fondo blanco, sin etiquetas de prueba) y los cálculos con casos límite antes de publicar.
