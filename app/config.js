/* Dirección del servidor de licencias: la URL de la "Aplicación web" de Apps Script (termina en /exec).
   Vacía = la app abre sin código de licencia y sin "Enviar sugerencia" (así está por ahora).
   No es secreta (cualquiera que abra la app la ve); el panel de administrador pide además la contraseña CLAVE_ADMIN,
   que vive solo en Apps Script. */
window.JUECEO = {
  // Documentos del inicio. Para cambiar uno, sube el PDF nuevo a docs/ (o pon el enlace oficial) y cambia aquí.
  docs: {
    figES: "docs/Codigo-FIG-GAF-2025-2028-ES.pdf",
    figEN: "https://www.gymnastics.sport/publicdir/rules/files/en_1.1%20-%20WAG%20COP%202025-2028.pdf",
    figNL: "https://www.gymnastics.sport/site/pages/newsletters-wag.php",
    usag: "https://usagym.org/women/rules/"
  },
  api: ""
};
