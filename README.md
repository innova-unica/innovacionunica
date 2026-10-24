# Futuro innovador UNICA — quiz, carnet y panel en vivo

Quiz de 8 preguntas que da un perfil principal y uno secundario de innovador, un carnet digital descargable (1080×1920) y un panel anónimo para pantalla del stand. No recoge datos personales: el nombre del carnet se queda en el navegador y al panel solo llega el id del perfil.

## Qué hay
- `public/index.html`: el quiz y el carnet. `public/panel.html`: el panel (`?demo=1` simula actividad; `?url=https://tu-sitio` cambia el QR).
- `public/js/data.js`: **todos los textos** (perfiles, preguntas, mensajes) y la puntuación. `CONFIG.hashtag` es el hashtag del carnet (vacío por ahora).
- `public/js/formas.js`: las formas y colores del Rally 2026. `public/assets/`: fuentes y logos.
- `netlify/functions/perfiles.mjs` + `netlify/lib/contador.mjs`: contador anónimo (Netlify Functions + Blobs) en `/api/perfiles`.

## Publicar
1. **Recomendado (Git o CLI):** sube la carpeta a un repositorio y conéctalo a Netlify, o usa `npx netlify deploy --prod`. Así funciona todo, incluido el panel. `netlify.toml` ya trae la configuración.
2. **Solo arrastrando `public/` a Netlify:** funcionan el quiz y el carnet; el panel no contará (no está confirmado que arrastrar publique funciones).

## Probar
- `npm install` y `npm test` (11 pruebas de puntuación y contador).
- `npm start` y abrir http://localhost:8080 (el contador devuelve error en local; el quiz funciona igual).

## Puntuación
Cada respuesta suma +2 al perfil de la opción y +1 a su perfil de apoyo. Principal = más puntos; secundario = el segundo. Los empates se resuelven por selecciones directas y orden fijo. El "te complementás con" está definido por parejas.
