import { json, isAdmin } from '../_util.js';
export async function onRequestGet({ request, env }) {
  if (!isAdmin(request, env)) return json({ ok: false }, 401);
  const out = {};
  for (const pre of ['pending:', 'ok:']) {
    const l = await env.REVIEWS.list({ prefix: pre, limit: 500 }); out[pre.slice(0, -1)] = [];
    for (const k of l.keys) { const v = await env.REVIEWS.get(k.name, 'json'); if (v) out[pre.slice(0, -1)].push({ key: k.name, ...v }); }
  }
  return json({ ok: true, ...out });
}
