// api.js (or wherever BASE lives)
const isBrowser = typeof window !== 'undefined';
const fromEnv =
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE)
    ? process.env.NEXT_PUBLIC_API_BASE
    : undefined;

// In the browser:
//  - on localhost dev, talk directly to your http API
//  - otherwise use the Vercel rewrite prefix (/ock)
export const BASE = isBrowser
  ? (window.location.origin.startsWith('http://localhost')
      ? 'http://api.oneclickkill.net:8080'
      : '/ock')
  // On the server (Node only), allow env override, else fallback
  : (fromEnv || 'http://api.oneclickkill.net:8080');

const bust = () => Date.now();

export const getSummary = () =>
  fetch(`${BASE}/api/snapshot?_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());

export const getLadder = () =>
  fetch(`${BASE}/api/ladder?_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());

// export const getMatches = (limit=5) =>
//   fetch(`${BASE}/api/matches?limit=${limit}&_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());

export async function getPlayerBy(by, { days = 7, limitPairs = 10 } = {}) {
  const url = `${BASE}/api/player?by=${encodeURIComponent(by)}&days=${days}&limitPairs=${limitPairs}`;
  const r = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || `Lookup failed (${r.status})`);
  }
  const json = await r.json();
  return json.player;
}