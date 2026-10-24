import test from 'node:test';
import assert from 'node:assert/strict';
import { PERFILES, PREGUNTAS, calcular } from '../public/js/data.js';

// Recorre las 3^8 = 6.561 combinaciones posibles de respuestas.
function* combinaciones() {
  const total = 3 ** PREGUNTAS.length;
  for (let n = 0; n < total; n++) {
    const r = [];
    let m = n;
    for (let q = 0; q < PREGUNTAS.length; q++) {
      r.push(m % 3);
      m = Math.floor(m / 3);
    }
    yield r;
  }
}

test('hay 6 perfiles y 8 preguntas con 3 opciones cada una', () => {
  assert.equal(PERFILES.length, 6);
  assert.equal(PREGUNTAS.length, 8);
  PREGUNTAS.forEach((p) => assert.equal(p.opciones.length, 3));
});

test('cada perfil aparece 4 veces como respuesta directa y 4 como apoyo', () => {
  const directa = {};
  const apoyo = {};
  PREGUNTAS.forEach((p) =>
    p.opciones.forEach((op) => {
      directa[op.principal] = (directa[op.principal] || 0) + 1;
      apoyo[op.apoyo] = (apoyo[op.apoyo] || 0) + 1;
      assert.notEqual(op.principal, op.apoyo, 'una opción no puede apoyar a su propio perfil');
    }),
  );
  PERFILES.forEach((p) => {
    assert.equal(directa[p.id], 4, `${p.id} directa`);
    assert.equal(apoyo[p.id], 4, `${p.id} apoyo`);
  });
});

test('las parejas de complemento son simétricas', () => {
  const mapa = Object.fromEntries(PERFILES.map((p) => [p.id, p.complemento]));
  PERFILES.forEach((p) => assert.equal(mapa[mapa[p.id]], p.id));
});

test('cada pregunta no repite el perfil principal entre sus opciones', () => {
  PREGUNTAS.forEach((p) => {
    const ids = p.opciones.map((op) => op.principal);
    assert.equal(new Set(ids).size, 3);
  });
});

test('la distribución coincide con la simulación publicada en el documento', () => {
  const principal = {};
  const pares = new Set();
  let total = 0;
  for (const r of combinaciones()) {
    const res = calcular(r);
    principal[res.principal] = (principal[res.principal] || 0) + 1;
    pares.add(`${res.principal}>${res.secundario}`);
    assert.notEqual(res.principal, res.secundario);
    total++;
  }
  assert.equal(total, 6561);
  assert.equal(pares.size, 30, 'se alcanzan las 30 combinaciones');
  const pct = (id) => Math.round((1000 * principal[id]) / total) / 10;
  assert.deepEqual(
    {
      experimentador: pct('experimentador'),
      estratega: pct('estratega'),
      antropologo: pct('antropologo'),
      saltador: pct('saltador'),
      narrador: pct('narrador'),
      colaborador: pct('colaborador'),
    },
    { experimentador: 18.9, estratega: 18.3, antropologo: 17.9, saltador: 15.3, narrador: 14.9, colaborador: 14.7 },
  );
});

test('la suma de puntos siempre es 24', () => {
  for (const r of combinaciones()) {
    const { puntos } = calcular(r);
    assert.equal(Object.values(puntos).reduce((a, b) => a + b, 0), 24);
  }
});

test('el resultado es estable: mismas respuestas, mismo resultado', () => {
  const r = [0, 1, 2, 0, 1, 2, 0, 1];
  assert.deepEqual(calcular(r), calcular([...r]));
});

test('el complemento sale del perfil principal', () => {
  for (const r of combinaciones()) {
    const res = calcular(r);
    const p = PERFILES.find((x) => x.id === res.principal);
    assert.equal(res.complemento, p.complemento);
  }
});
