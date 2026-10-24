// Panel en vivo para el stand. Muestra cuántas personas hay de cada perfil, sin nombres ni ranking.
// ?demo=1 simula actividad (para probar sin conexión). ?url=https://... cambia la dirección del QR.

import { PERFILES, CONFIG } from './data.js';
import { ORDEN_FORMAS, COLOR_FORMA, formaSVG } from './formas.js';
import './vendor/qrcode.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const demo = params.has('demo');
const INTERVALO = 5000;

// Orden fijo (el de las formas del Rally), para que ningún perfil parezca "mejor".
const fichas = PERFILES;
const nombresPlural = (n) => (n === 1 ? 'persona' : 'personas');

$('#rejilla').innerHTML = fichas
  .map(
    (p) => `
    <li class="ficha" id="ficha-${p.id}" data-vacia="true" style="--color:${COLOR_FORMA[p.forma]}">
      ${formaSVG(p.forma, { clase: 'forma' })}
      <span class="nombre">${p.nombre}</span>
      <span class="cuenta" aria-label="${p.nombre}: 0 personas">0</span>
    </li>`,
  )
  .join('');
$('#fila-completo').innerHTML = fichas.map((p) => formaSVG(p.forma)).join('');

// QR hacia el quiz
const destino = params.get('url') || new URL('./', location.href).href;
$('#direccion').textContent = destino.replace(/^https?:\/\//, '').replace(/\/$/, '');
try {
  const qr = window.qrcode(0, 'M');
  qr.addData(destino);
  qr.make();
  $('#qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
} catch (_) {
  $('#qr').textContent = '';
}

let anterior = {};
let completoMostrado = false;

function pintar({ total, counts }) {
  $('#total').textContent = total;
  $('#total-texto').textContent =
    total === 1
      ? 'futuro innovador ya descubrió su forma de innovar'
      : 'futuros innovadores ya descubrieron su forma de innovar';
  for (const p of fichas) {
    const n = counts[p.id] || 0;
    const el = $(`#ficha-${p.id}`);
    el.dataset.vacia = String(n === 0);
    const cuenta = el.querySelector('.cuenta');
    cuenta.textContent = n;
    cuenta.setAttribute('aria-label', `${p.nombre}: ${n} ${nombresPlural(n)}`);
    if (n > (anterior[p.id] || 0) && Object.keys(anterior).length) {
      el.classList.remove('nueva');
      void el.offsetWidth;
      el.classList.add('nueva');
    }
  }
  const completo = fichas.every((p) => (counts[p.id] || 0) >= 1);
  $('#completo').hidden = !completo;
  if (completo && !completoMostrado) $('#estado').textContent = '¡Ya tenemos al equipo completo!';
  completoMostrado = completo;
  anterior = { ...counts };
}

/* ---- Modo demostración ---- */
const simulado = { total: 0, counts: Object.fromEntries(fichas.map((p) => [p.id, 0])) };
function pasoDemo() {
  const p = fichas[Math.floor(Math.random() * fichas.length)];
  simulado.counts[p.id] += 1;
  simulado.total += 1;
  pintar(simulado);
}

/* ---- Datos reales ---- */
async function consultar() {
  try {
    const r = await fetch(CONFIG.apiPerfiles, { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    pintar(await r.json());
    $('#estado').textContent = '';
  } catch (_) {
    $('#estado').textContent =
      'No se pudo leer el conteo. El panel funciona cuando el sitio está publicado con Netlify Functions. Probá con ?demo=1.';
  }
}

if (demo) {
  $('#estado').textContent = 'Modo demostración: los números son simulados.';
  pasoDemo();
  setInterval(pasoDemo, 1200);
} else {
  consultar();
  setInterval(() => !document.hidden && consultar(), INTERVALO);
}
