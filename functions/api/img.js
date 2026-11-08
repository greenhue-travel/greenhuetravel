export async function onRequestGet({ request, env }) {
  const u = new URL(request.url); const id = u.searchParams.get('id') || ''; const n = u.searchParams.get('n') || '0';
  if (!env.REVIEWS || !/^[a-z0-9]+$/.test(id) || !/^\d$/.test(n)) return new Response('not found', { status: 404 });
  // only serve approved or admin
  const admin = u.searchParams.get('k') && env.ADMIN_KEY && u.searchParams.get('k') === env.ADMIN_KEY;
  if (!admin) { const l = await env.REVIEWS.list({ prefix: 'ok:', limit: 1000 }); if (!l.keys.some(k => k.name.endsWith(':' + id))) return new Response('not found', { status: 404 }); }
  const v = await env.REVIEWS.get(`img:${id}:${n}`, 'arrayBuffer');
  if (!v) return new Response('not found', { status: 404 });
  return new Response(v, { headers: { 'content-type': 'image/jpeg', 'cache-control': admin ? 'no-store' : 'public, max-age=86400' } });
}
