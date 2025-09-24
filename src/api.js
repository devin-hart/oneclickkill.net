const BASE = 'http://localhost:3000'; // same-origin behind Nginx; for dev you can set to 'http://localhost:3000'

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
