import test from 'node:test';
import assert from 'node:assert/strict';
import { manejar, PERFILES_VALIDOS } from '../netlify/lib/contador.mjs';

function almacenFalso() {
  const datos = new Map();
  return {
    datos,
    async set(k, v) { datos.set(k, v); },
    async *list() {
      const claves = [...datos.keys()];
      for (let i = 0; i < claves.length; i += 2) {
        yield { blobs: claves.slice(i, i + 2).map((key) => ({ key })) };
      }
    },
  };
}
const post = (cuerpo) => new Request('http://x/api/perfiles', { method: 'POST', body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo) });
const get = () => new Request('http://x/api/perfiles');

test('POST válido guarda una fila anónima y GET cuenta', async () => {
  const s = almacenFalso();
  let n = 0;
  const op = { ahora: () => 1, id: () => `id${n++}` };
  for (const p of ['saltador', 'saltador', 'narrador']) assert.equal((await manejar(post({ perfil: p }), s, op)).status, 201);
  assert.deepEqual([...s.datos.values()], ['1', '1', '1']);
  const r = await manejar(get(), s);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  const j = await r.json();
  assert.equal(j.total, 3);
  assert.equal(j.counts.saltador, 2);
  assert.equal(j.counts.narrador, 1);
  assert.deepEqual(Object.keys(j.counts), PERFILES_VALIDOS);
});

test('rechaza perfiles inválidos, JSON roto y otros métodos', async () => {
  const s = almacenFalso();
  assert.equal((await manejar(post({ perfil: 'hacker' }), s)).status, 400);
  assert.equal((await manejar(post('no json'), s)).status, 400);
  assert.equal((await manejar(post({}), s)).status, 400);
  assert.equal((await manejar(new Request('http://x', { method: 'DELETE' }), s)).status, 405);
  assert.equal(s.datos.size, 0);
});

test('GET en almacén vacío devuelve ceros', async () => {
  const j = await (await manejar(get(), almacenFalso())).json();
  assert.equal(j.total, 0);
});
