import { json, isAdmin } from '../_util.js';
// {action:'approve'|'hide'|'delete', key}
export async function onRequestPost({ request, env }) {
  if (!isAdmin(request, env)) return json({ ok: false }, 401);
  const { action, key } = await request.json();
  const v = await env.REVIEWS.get(key, 'json'); if (!v) return json({ ok: false, error: 'none' }, 404);
  if (action === 'approve') { v.status = 'ok'; await env.REVIEWS.put(`ok:${v.trip}:${v.id}`, JSON.stringify(v)); await env.REVIEWS.delete(key); }
  else if (action === 'hide') { v.status = 'pending'; await env.REVIEWS.put(`pending:${v.id}`, JSON.stringify(v)); await env.REVIEWS.delete(key); }
  else if (action === 'delete') { await env.REVIEWS.delete(key); for (let i = 0; i < (v.photos || 0); i++) await env.REVIEWS.delete(`img:${v.id}:${i}`); }
  return json({ ok: true });
}
