// ✅ leave BASE empty in prod; Vercel will proxy /api to your server
const BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function getSummary() {
  const r = await fetch(`${BASE}/api/summary`, { cache: 'no-store' });
  if (!r.ok) throw new Error('summary failed'); 
  return r.json();
}
export async function getLadder() {
  const r = await fetch(`${BASE}/api/ladder`);
  if (!r.ok) throw new Error('ladder failed');
  return r.json();
}
export async function getMatches(limit = 5) {
  const r = await fetch(`${BASE}/api/matches?limit=${limit}`);
  if (!r.ok) throw new Error('matches failed');
  return r.json();
}
