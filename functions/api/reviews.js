import { json, TRIPS, b64ToBytes } from './_util.js';
// POST: submit (pending). GET ?trip=: approved list
export async function onRequestPost({ request, env }) {
  if (!env.REVIEWS) return json({ ok: false, error: 'not_ready' }, 503);
  let b; try { b = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const trip = String(b.trip || ''); const name = String(b.name || '').trim().slice(0, 20);
  const text = String(b.text || '').trim().slice(0, 600); const photos = Array.isArray(b.photos) ? b.photos.slice(0, 5) : [];
  if (!TRIPS[trip]) return json({ ok: false, error: 'trip' }, 400);
  if (!name || (!text && !photos.length)) return json({ ok: false, error: 'empty' }, 400);
  if (!b.agree) return json({ ok: false, error: 'agree' }, 400);
  if (b.hp) return json({ ok: true }); // honeypot
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const n = [];
  for (let i = 0; i < photos.length; i++) {
    const p = String(photos[i]);
    if (!/^data:image\/jpeg;base64,/.test(p) || p.length > 2_200_000) continue;
    await env.REVIEWS.put(`img:${id}:${n.length}`, b64ToBytes(p), { metadata: { type: 'image/jpeg' } });
    n.push(n.length);
  }
  const rec = { id, trip, name, text, photos: n.length, at: new Date().toISOString(), status: 'pending' };
  await env.REVIEWS.put(`pending:${id}`, JSON.stringify(rec));
  return json({ ok: true });
}
export async function onRequestGet({ request, env }) {
  if (!env.REVIEWS) return json({ ok: true, items: [] });
  const trip = new URL(request.url).searchParams.get('trip') || '';
  const prefix = trip ? `ok:${trip}:` : 'ok:';
  const list = await env.REVIEWS.list({ prefix, limit: 200 });
  const items = [];
  for (const k of list.keys) { const v = await env.REVIEWS.get(k.name, 'json'); if (v) items.push(v); }
  items.sort((a, b) => (a.at < b.at ? 1 : -1));
  return json({ ok: true, items, trips: TRIPS });
}
