// Formas de la identidad visual del Rally de Innovación (viewBox 0 0 100 100).
// Una sola definición sirve para el HTML (SVG) y para el carnet (canvas).

const r2 = (n) => Math.round(n * 100) / 100;
const rad = (g) => (g * Math.PI) / 180;
const par = (p) => p.join(' ');

// Gira una lista de puntos (con origen en el centro 50,50) y devuelve coordenadas absolutas.
function girar(puntos, grados) {
  const c = Math.cos(rad(grados));
  const s = Math.sin(rad(grados));
  return puntos.map(([x, y]) => [r2(50 + x * c - y * s), r2(50 + x * s + y * c)]);
}

// Un pétalo de la "X": delgado en el centro, ancho y redondeado en la punta.
function petalo(grados) {
  const local = [
    [0, 0], [10, -6], [24, -14], [38, -13],
    [46, -12.5], [47, -3], [47, 0],
    [47, 3], [46, 12.5], [38, 13],
    [24, 14], [10, 6],
  ];
  const p = girar(local, grados);
  return (
    `M${par(p[0])}C${par(p[1])} ${par(p[2])} ${par(p[3])}` +
    `C${par(p[4])} ${par(p[5])} ${par(p[6])}` +
    `C${par(p[7])} ${par(p[8])} ${par(p[9])}` +
    `C${par(p[10])} ${par(p[11])} ${par(p[0])}Z`
  );
}

// Una barra del asterisco, de punta a punta, con extremos rectos.
function barra(grados) {
  const p = girar([[-44, -4.5], [44, -4.5], [44, 4.5], [-44, 4.5]], grados);
  return `M${par(p[0])}L${par(p[1])}L${par(p[2])}L${par(p[3])}Z`;
}

function estrella(puntas, radioExterior, radioInterior) {
  const pts = [];
  for (let i = 0; i < puntas * 2; i++) {
    const radio = i % 2 === 0 ? radioExterior : radioInterior;
    const ang = -Math.PI / 2 + (i * Math.PI) / puntas;
    pts.push([r2(50 + radio * Math.cos(ang)), r2(50 + radio * Math.sin(ang))]);
  }
  return `M${pts.map(par).join('L')}Z`;
}

export const FORMAS = {
  circulo: { d: 'M6 50a44 44 0 1 0 88 0a44 44 0 1 0 -88 0Z', evenodd: false },
  equis: { d: [45, 135, 225, 315].map(petalo).join(''), evenodd: false },
  cuadrado: { d: 'M8 8H92V92H8Z', evenodd: false },
  triangulo: { d: 'M50 8L95 90H5Z', evenodd: false },
  estrella: { d: estrella(12, 46, 38), evenodd: false },
  anillo: {
    d: 'M6 50a44 44 0 1 0 88 0a44 44 0 1 0 -88 0ZM23 50a27 27 0 1 1 54 0a27 27 0 1 1 -54 0Z',
    evenodd: true,
  },
  rombo: { d: 'M50 4L96 50L50 96L4 50Z', evenodd: false },
  asterisco: { d: [0, 45, 90, 135].map(barra).join(''), evenodd: false },
};

// Orden original de las formas en la identidad del Rally.
export const ORDEN_FORMAS = [
  'circulo', 'equis', 'cuadrado', 'triangulo', 'estrella', 'anillo', 'rombo', 'asterisco',
];

// Paleta del Rally (HEX oficiales).
export const COLORES = {
  petroleo: '#065D79',
  lima: '#C7DB41',
  morado: '#BD80E5',
  naranja: '#FD8446',
  rosado: '#F54787',
  celeste: '#71D1EB',
  amarillo: '#FFD54D',
  verde: '#A9D87D',
  coral: '#F7737B',
  blanco: '#FFFFFF',
  tinta: '#151D33', // azul marino del logo de UNICA, para texto
};

export const COLOR_FORMA = {
  circulo: COLORES.morado,
  equis: COLORES.celeste,
  cuadrado: COLORES.lima,
  triangulo: COLORES.rosado,
  estrella: COLORES.naranja,
  anillo: COLORES.verde,
  rombo: COLORES.amarillo,
  asterisco: COLORES.coral,
};

// SVG para el HTML. "giro" sirve para la versión invertida del triángulo.
export function formaSVG(id, { color = COLOR_FORMA[id], clase = '', giro = 0 } = {}) {
  const f = FORMAS[id];
  const regla = f.evenodd ? ' fill-rule="evenodd"' : '';
  const transf = giro ? ` transform="rotate(${giro} 50 50)"` : '';
  return (
    `<svg class="forma ${clase}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">` +
    `<path d="${f.d}" fill="${color}"${regla}${transf}/></svg>`
  );
}

// Dibujo en canvas, centrado en (cx, cy) y con lado "tam".
export function trazarForma(ctx, id, cx, cy, tam, color = COLOR_FORMA[id], giro = 0) {
  const f = FORMAS[id];
  ctx.save();
  ctx.translate(cx - tam / 2, cy - tam / 2);
  ctx.scale(tam / 100, tam / 100);
  if (giro) {
    ctx.translate(50, 50);
    ctx.rotate(rad(giro));
    ctx.translate(-50, -50);
  }
  ctx.fillStyle = color;
  ctx.fill(new Path2D(f.d), f.evenodd ? 'evenodd' : 'nonzero');
  ctx.restore();
}
