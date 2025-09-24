const BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const bust = () => (Date.now());

export async function getSummary() {
  const r = await fetch(`${BASE}/api/summary?_=${bust()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('summary failed');
  return r.json();
}
export async function getLadder() {
  const r = await fetch(`${BASE}/api/ladder?_=${bust()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('ladder failed');
  return r.json();
}
export async function getMatches(limit = 5) {
  const r = await fetch(`${BASE}/api/matches?limit=${limit}&_=${bust()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('matches failed');
  return r.json();
}
