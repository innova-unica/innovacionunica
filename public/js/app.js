// Flujo del quiz: inicio, 8 preguntas, resultado y carnet.

import { PERFIL, PREGUNTAS, TEXTOS, CONFIG, calcular } from './data.js';
import { ORDEN_FORMAS, COLOR_FORMA, formaSVG } from './formas.js';
import { dibujarCarnet, nombreArchivo, descripcionCarnet } from './carnet.js';

const $ = (selector) => document.querySelector(selector);
const pantallas = {
  inicio: $('#pantalla-inicio'),
  preguntas: $('#pantalla-preguntas'),
  resultado: $('#pantalla-resultado'),
};
const estado = { indice: 0, respuestas: [], orden: [], resultado: null };
const PAUSA = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 380;

$('#credito').textContent = TEXTOS.credito;

function anunciar(texto) {
  $('#anuncios').textContent = texto;
}

function mostrar(nombre, aEnfocar) {
  Object.entries(pantallas).forEach(([clave, el]) => {
    el.hidden = clave !== nombre;
  });
  document.body.dataset.pantalla = nombre;
  window.scrollTo({ top: 0 });
  if (aEnfocar) aEnfocar.focus({ preventScroll: true });
}

const mayuscula = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------- Inicio ---------- */
$('#formas-arriba').innerHTML = ORDEN_FORMAS.map(
  (id, i) => `<span style="--i:${i}">${formaSVG(id)}</span>`,
).join('');
$('#formas-abajo').innerHTML = [...ORDEN_FORMAS]
  .reverse()
  .map(
    (id, i) =>
      `<span style="--i:${i + 8}">${formaSVG(id, { giro: id === 'triangulo' ? 180 : 0 })}</span>`,
  )
  .join('');

$('#boton-empezar').addEventListener('click', empezar);

/* ---------- Preguntas ---------- */
function barajar(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function empezar() {
  estado.indice = 0;
  estado.respuestas = [];
  estado.resultado = null;
  // El orden de las opciones se mezcla para que la posición no influya.
  estado.orden = PREGUNTAS.map((q) => barajar(q.opciones.length));
  pintarPregunta();
  mostrar('preguntas', $('#enunciado'));
}

function pintarProgreso() {
  $('#progreso').innerHTML = ORDEN_FORMAS.map((id, i) => {
    const e = i < estado.indice ? 'hecha' : i === estado.indice ? 'actual' : 'pendiente';
    const actual = e === 'actual' ? ' aria-current="step"' : '';
    return `<li class="paso" data-estado="${e}"${actual}>${formaSVG(id)}</li>`;
  }).join('');
}

function pintarPregunta() {
  const q = PREGUNTAS[estado.indice];
  const colorPregunta = COLOR_FORMA[ORDEN_FORMAS[estado.indice]];
  pintarProgreso();
  $('#contador').textContent = `Pregunta ${estado.indice + 1} de ${PREGUNTAS.length}`;
  $('#boton-atras').hidden = estado.indice === 0;
  $('#enunciado').textContent = q.enunciado;

  const lista = $('#opciones');
  lista.innerHTML = '';
  estado.orden[estado.indice].forEach((indiceOpcion) => {
    const li = document.createElement('li');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'opcion';
    boton.style.setProperty('--sombra', colorPregunta);
    boton.setAttribute('aria-pressed', 'false');
    boton.textContent = q.opciones[indiceOpcion].texto;
    boton.addEventListener('click', () => elegir(boton, indiceOpcion));
    li.appendChild(boton);
    lista.appendChild(li);
  });
  anunciar(`Pregunta ${estado.indice + 1} de ${PREGUNTAS.length}. ${q.enunciado}`);
}

let bloqueado = false;
function elegir(boton, indiceOpcion) {
  if (bloqueado) return;
  bloqueado = true;
  boton.setAttribute('aria-pressed', 'true');
  setTimeout(() => {
    estado.respuestas[estado.indice] = indiceOpcion;
    bloqueado = false;
    if (estado.indice < PREGUNTAS.length - 1) {
      estado.indice += 1;
      pintarPregunta();
      $('#enunciado').focus({ preventScroll: true });
    } else {
      terminar();
    }
  }, PAUSA);
}

$('#boton-atras').addEventListener('click', () => {
  if (estado.indice === 0 || bloqueado) return;
  estado.indice -= 1;
  estado.respuestas.length = estado.indice;
  pintarPregunta();
  $('#enunciado').focus({ preventScroll: true });
});

/* ---------- Resultado ---------- */
function contarPerfil(id) {
  // Solo se envía el perfil principal, sin nombre ni respuestas. Si falla, el quiz sigue igual.
  try {
    fetch(CONFIG.apiPerfiles, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ perfil: id }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {
    /* sin conexión: no pasa nada */
  }
}

function terminar() {
  estado.resultado = calcular(estado.respuestas);
  contarPerfil(estado.resultado.principal);
  pintarResultado(estado.resultado);
  mostrar('resultado', $('#perfil-titulo'));
  anunciar(`Tu perfil principal es ${PERFIL[estado.resultado.principal].nombre}.`);
}

function pintarResultado(res) {
  const p = PERFIL[res.principal];
  const s = PERFIL[res.secundario];
  const c = PERFIL[res.complemento];
  const acento = COLOR_FORMA[p.forma];
  const complementoIgualSecundario = res.secundario === res.complemento;

  const lineaComplemento = complementoIgualSecundario
    ? TEXTOS.complementoIgual
    : `<strong>${TEXTOS.complemento(c.nombre)}</strong> ${p.razonComplemento}`;

  pantallas.resultado.innerHTML = `
    <div class="reveal">
      ${formaSVG(p.forma)}
      <div>
        <p class="chico">Tu perfil principal</p>
        <h2 id="perfil-titulo" tabindex="-1">${p.nombre}</h2>
        <p class="frase">“${p.frase}”</p>
      </div>
    </div>

    <p class="descripcion">${p.descripcion}</p>

    <section class="valor" style="--acento:${acento}" aria-labelledby="valor-titulo">
      <h3 id="valor-titulo">Sos valioso en un proyecto porque…</h3>
      <p>${mayuscula(p.valor)}</p>
      <h4>Podés aportar</h4>
      <p>${p.aportes}</p>
    </section>

    <div class="fila-forma">
      ${formaSVG(s.forma)}
      <p><strong>Con toque de ${s.nombre}:</strong> ${s.toque}</p>
    </div>

    <div class="fila-forma">
      ${formaSVG(c.forma)}
      <p>${lineaComplemento}</p>
    </div>

    <p class="equipo">${TEXTOS.equipo}</p>

    <section class="carnet" aria-labelledby="carnet-titulo">
      <h3 id="carnet-titulo">Llevate tu carnet de Futuro innovador UNICA</h3>
      <label for="nombre">Tu nombre en el carnet (opcional)</label>
      <input id="nombre" type="text" maxlength="24" autocomplete="off" autocapitalize="words" enterkeyhint="done" />
      <p class="nota" style="margin-top:0">El nombre se queda en tu celular: no se envía ni se guarda.</p>
      <canvas id="vista-carnet" class="vista-carnet" width="1080" height="1920" role="img"></canvas>
      <div class="acciones">
        <button class="boton" id="boton-descargar" type="button">Descargar carnet</button>
        <button class="boton boton-secundario" id="boton-compartir" type="button" hidden>Compartir</button>
      </div>
      <p class="nota" id="mensaje-carnet" role="status" style="margin-top:0"></p>
    </section>

    <p><button class="boton-texto" id="boton-reiniciar" type="button">Volver a empezar</button></p>
  `;

  const canvas = $('#vista-carnet');
  const entrada = $('#nombre');
  let temporizador;

  const redibujar = () =>
    dibujarCarnet(canvas, {
      perfil: p,
      secundario: s,
      nombre: entrada.value,
      hashtag: CONFIG.hashtag,
    }).then(() => {
      canvas.setAttribute('aria-label', descripcionCarnet(p, entrada.value));
    });

  redibujar();
  entrada.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(redibujar, 180);
  });

  const comoArchivo = () =>
    new Promise((resolver) => {
      canvas.toBlob((blob) => resolver(new File([blob], nombreArchivo(p), { type: 'image/png' })), 'image/png');
    });

  $('#boton-descargar').addEventListener('click', async () => {
    clearTimeout(temporizador);
    await redibujar();
    const archivo = await comoArchivo();
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = archivo.name;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    $('#mensaje-carnet').textContent = 'Listo: tu carnet quedó guardado como imagen.';
  });

  // "Compartir" solo aparece si el dispositivo puede compartir imágenes (por ejemplo, un celular).
  const prueba = new File([''], 'prueba.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [prueba] })) {
    const compartir = $('#boton-compartir');
    compartir.hidden = false;
    compartir.addEventListener('click', async () => {
      clearTimeout(temporizador);
      await redibujar();
      const archivo = await comoArchivo();
      try {
        await navigator.share({
          files: [archivo],
          title: TEXTOS.carnetTitulo,
          text: 'Descubrí mi forma de innovar.',
        });
      } catch (error) {
        if (error && error.name !== 'AbortError') {
          $('#mensaje-carnet').textContent = 'No se pudo compartir. Probá con Descargar carnet.';
        }
      }
    });
  }

  $('#boton-reiniciar').addEventListener('click', () => {
    mostrar('inicio', $('#principal'));
    anunciar('Volviste al inicio.');
  });
}
