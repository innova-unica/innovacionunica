import { getStore } from '@netlify/blobs';
import { manejar } from '../lib/contador.mjs';

export default async (request) => manejar(request, getStore('perfiles'));

export const config = { path: '/api/perfiles' };
