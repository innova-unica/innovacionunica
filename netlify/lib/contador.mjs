// Contador anónimo de perfiles. Cada persona que termina el quiz suma una fila
// con una clave única: no hay nombres, ni respuestas, ni identificadores.

import { randomUUID } from 'node:crypto';

export const PERFILES_VALIDOS = ['antropologo', 'experimentador', 'colaborador', 'narrador', 'estratega', 'saltador'];

const CABECERAS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

const responder = (estado, cuerpo) => new Response(JSON.stringify(cuerpo), { status: estado, headers: CABECERAS });

export async function contar(store) {
  const counts = Object.fromEntries(PERFILES_VALIDOS.map((p) => [p, 0]));
  for await (const pagina of store.list({ paginate: true })) {
    for (const { key } of pagina.blobs) {
      const perfil = key.split('/')[0];
      if (perfil in counts) counts[perfil] += 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { total, counts };
}

export async function manejar(request, store, { ahora = Date.now, id = randomUUID } = {}) {
  if (request.method === 'GET') {
    return responder(200, await contar(store));
  }
  if (request.method === 'POST') {
    let datos;
    try {
      datos = await request.json();
    } catch (_) {
      return responder(400, { error: 'Cuerpo inválido' });
    }
    const perfil = datos && datos.perfil;
    if (!PERFILES_VALIDOS.includes(perfil)) {
      return responder(400, { error: 'Perfil desconocido' });
    }
    await store.set(`${perfil}/${ahora()}-${id()}`, '1');
    return responder(201, { ok: true });
  }
  return new Response(JSON.stringify({ error: 'Método no permitido' }), {
    status: 405,
    headers: { ...CABECERAS, allow: 'GET, POST' },
  });
}
