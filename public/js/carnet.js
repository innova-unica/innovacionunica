// Carnet "Futuro innovador UNICA": imagen vertical de 1080 × 1920 (formato historias),
// generada en el navegador. El nombre nunca sale del celular de la persona.

import { TEXTOS } from './data.js';
import { ORDEN_FORMAS, COLORES, COLOR_FORMA, trazarForma } from './formas.js';

export const ANCHO = 1080;
export const ALTO = 1920;

const TITULO = '"Bricolage Grotesque", "Outfit", system-ui, sans-serif';
const TEXTO = '"Outfit", system-ui, sans-serif';

const imagenes = new Map();
function cargarImagen(src) {
  if (!imagenes.has(src)) {
    imagenes.set(
      src,
      new Promise((resolver, rechazar) => {
        const im = new Image();
        im.onload = () => resolver(im);
        im.onerror = rechazar;
        im.src = src;
      }),
    );
  }
  return imagenes.get(src);
}

async function fuentesListas() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`800 80px ${TITULO}`),
      document.fonts.load(`500 40px ${TEXTO}`),
      document.fonts.load(`600 40px ${TEXTO}`),
    ]);
  } catch (_) {
    /* si una fuente no carga, el carnet se dibuja con la tipografía del sistema */
  }
}

function rectRedondeado(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ancho(ctx, texto, fuente) {
  ctx.font = fuente;
  return ctx.measureText(texto).width;
}

// Mayor tamaño (entre tamMax y tamMin) con el que el texto cabe en maxAncho.
function tamanoQueCabe(ctx, texto, peso, familia, maxAncho, tamMax, tamMin) {
  let t = tamMax;
  while (t > tamMin && ancho(ctx, texto, `${peso} ${t}px ${familia}`) > maxAncho) t -= 2;
  return t;
}

function partirEnLineas(ctx, texto, fuente, maxAncho) {
  const palabras = texto.split(' ');
  const lineas = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (actual && ancho(ctx, prueba, fuente) > maxAncho) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

// Parte un nombre largo en dos líneas lo más parejas posible.
function partirEnDos(ctx, texto, fuente) {
  const palabras = texto.split(' ');
  let mejor = [texto];
  let mejorAncho = Infinity;
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(' ');
    const b = palabras.slice(i).join(' ');
    const w = Math.max(ancho(ctx, a, fuente), ancho(ctx, b, fuente));
    if (w < mejorAncho) {
      mejorAncho = w;
      mejor = [a, b];
    }
  }
  return mejor;
}

export function nombreArchivo(perfil) {
  return `futuro-innovador-unica-${perfil.id}.png`;
}

export function descripcionCarnet(perfil, nombre) {
  const quien = nombre.trim() ? `de ${nombre.trim()}` : 'tuyo';
  return `Carnet Futuro innovador UNICA ${quien}. Perfil principal: ${perfil.nombre}.`;
}

export async function dibujarCarnet(canvas, { perfil, secundario, nombre = '', hashtag = '' }) {
  await fuentesListas();
  const logo = await cargarImagen('assets/logos/unica-dorado.png').catch(() => null);

  canvas.width = ANCHO;
  canvas.height = ALTO;
  const ctx = canvas.getContext('2d');
  const color = COLOR_FORMA[perfil.forma];
  const nombreLimpio = nombre.trim();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Fondo
  ctx.fillStyle = COLORES.petroleo;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Formas que se asoman por los bordes
  trazarForma(ctx, 'estrella', 1010, 150, 230);
  trazarForma(ctx, 'equis', 55, 190, 190);
  trazarForma(ctx, 'cuadrado', 18, 960, 150);
  trazarForma(ctx, 'rombo', 1068, 1110, 170);
  trazarForma(ctx, 'circulo', 40, 1560, 150);
  trazarForma(ctx, 'asterisco', 1050, 1600, 150);

  // Logo de UNICA (variante dorada sobre azul petróleo)
  if (logo) {
    const logoAncho = 430;
    const logoAlto = (logoAncho * logo.naturalHeight) / logo.naturalWidth;
    ctx.drawImage(logo, (ANCHO - logoAncho) / 2, 62, logoAncho, logoAlto);
  }

  // Tarjeta con sombra plana del color del perfil
  const cx = 100;
  const cy = 300;
  const cw = 880;
  const ch = 1340;
  ctx.fillStyle = color;
  rectRedondeado(ctx, cx, cy + 20, cw, ch, 56);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  rectRedondeado(ctx, cx, cy, cw, ch, 56);
  ctx.fill();

  // Ranura del cordón
  ctx.fillStyle = '#DCE8EC';
  rectRedondeado(ctx, ANCHO / 2 - 70, cy + 34, 140, 22, 11);
  ctx.fill();

  // Rótulo "Futuro innovador UNICA"
  const rotulo = TEXTOS.carnetTitulo;
  const fRotulo = `800 38px ${TITULO}`;
  const wRotulo = ancho(ctx, rotulo, fRotulo) + 96;
  ctx.fillStyle = COLORES.petroleo;
  rectRedondeado(ctx, (ANCHO - wRotulo) / 2, cy + 92, wRotulo, 80, 40);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = fRotulo;
  ctx.fillText(rotulo, ANCHO / 2, cy + 92 + 53);

  // Forma del perfil
  const tamForma = nombreLimpio ? 300 : 370;
  const topForma = cy + 212;
  trazarForma(ctx, perfil.forma, ANCHO / 2, topForma + tamForma / 2, tamForma, color);
  let y = topForma + tamForma + 70;

  // Nombre (opcional)
  if (nombreLimpio) {
    const t = tamanoQueCabe(ctx, nombreLimpio, 800, TITULO, 780, 80, 44);
    ctx.fillStyle = COLORES.tinta;
    ctx.font = `800 ${t}px ${TITULO}`;
    ctx.fillText(nombreLimpio, ANCHO / 2, y);
    y += 62;
  }

  // "Mi forma de innovar"
  ctx.fillStyle = '#3F5463';
  ctx.font = `500 36px ${TEXTO}`;
  ctx.fillText('Mi forma de innovar', ANCHO / 2, y);
  y += 24;

  // Nombre del perfil: una línea si cabe, dos si es largo
  ctx.fillStyle = COLORES.petroleo;
  const peso = 800;
  const unaLinea = tamanoQueCabe(ctx, perfil.nombre, peso, TITULO, 780, 112, 88);
  let lineasPerfil;
  let tamPerfil;
  if (ancho(ctx, perfil.nombre, `${peso} ${unaLinea}px ${TITULO}`) <= 780) {
    lineasPerfil = [perfil.nombre];
    tamPerfil = unaLinea;
  } else {
    tamPerfil = 92;
    lineasPerfil = partirEnDos(ctx, perfil.nombre, `${peso} ${tamPerfil}px ${TITULO}`);
  }
  ctx.font = `${peso} ${tamPerfil}px ${TITULO}`;
  lineasPerfil.forEach((linea, i) => {
    ctx.fillText(linea, ANCHO / 2, y + tamPerfil * 0.9 + i * tamPerfil * 0.98);
  });
  y += tamPerfil * 0.9 + (lineasPerfil.length - 1) * tamPerfil * 0.98 + 52;

  // Frase del perfil
  ctx.fillStyle = COLORES.tinta;
  const fFrase = `500 42px ${TEXTO}`;
  const lineasFrase = partirEnLineas(ctx, `“${perfil.frase}”`, fFrase, 740);
  ctx.font = fFrase;
  lineasFrase.forEach((linea, i) => ctx.fillText(linea, ANCHO / 2, y + i * 54));
  y += (lineasFrase.length - 1) * 54 + 62;

  // Perfil secundario
  const textoToque = `Con toque de ${secundario.nombre}`;
  const fToque = `600 34px ${TEXTO}`;
  const tamToque = 54;
  const wToque = tamToque + 20 + ancho(ctx, textoToque, fToque) + 70;
  const colorToque = COLOR_FORMA[secundario.forma];
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = colorToque;
  rectRedondeado(ctx, (ANCHO - wToque) / 2, y, wToque, 88, 44);
  ctx.fill();
  ctx.restore();
  trazarForma(ctx, secundario.forma, (ANCHO - wToque) / 2 + 28 + tamToque / 2, y + 44, tamToque, colorToque);
  ctx.fillStyle = COLORES.tinta;
  ctx.font = fToque;
  ctx.textAlign = 'left';
  ctx.fillText(textoToque, (ANCHO - wToque) / 2 + 28 + tamToque + 20, y + 55);
  ctx.textAlign = 'center';

  // Línea de cierre dentro de la tarjeta
  ctx.fillStyle = COLORES.petroleo;
  ctx.font = `800 52px ${TITULO}`;
  ctx.fillText(TEXTOS.carnetLinea, ANCHO / 2, cy + ch - 62);

  // Fuera de la tarjeta: hashtag y nota de orientación
  if (hashtag) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 54px ${TITULO}`;
    ctx.fillText(hashtag, ANCHO / 2, 1738);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = `400 28px ${TEXTO}`;
  ctx.fillText('Orientación y juego, no un diagnóstico.', ANCHO / 2, hashtag ? 1782 : 1740);
  ctx.fillText('Perfiles inspirados en IDEO y en Carla Johnson.', ANCHO / 2, hashtag ? 1818 : 1778);

  // Fila de formas del Rally al pie
  const lado = 60;
  const sep = 34;
  const total = ORDEN_FORMAS.length * lado + (ORDEN_FORMAS.length - 1) * sep;
  ORDEN_FORMAS.forEach((id, i) => {
    trazarForma(ctx, id, (ANCHO - total) / 2 + lado / 2 + i * (lado + sep), 1868, lado);
  });
}
