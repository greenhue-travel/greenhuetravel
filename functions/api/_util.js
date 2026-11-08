export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
export const TRIPS = {
  '2026-12-haiphong': '2026.12 제1회 그린휴 단독 여행 · 하이퐁',
  '2026-12-awards': '2026.12 소노 회원 골프 어워즈 · 하이퐁',
  'etc': '지난 그린휴 여행'
};
export function b64ToBytes(dataUrl) {
  const b64 = dataUrl.split(',')[1] || '';
  const bin = atob(b64); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
export function isAdmin(request, env) {
  const k = request.headers.get('x-admin-key') || '';
  return !!env.ADMIN_KEY && k === env.ADMIN_KEY;
}
