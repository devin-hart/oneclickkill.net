// src/api.js
// const BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const BASE = process.env.NEXT_PUBLIC_API_BASE || '/ock';

const bust = () => Date.now();

export const getSummary = () =>
  fetch(`${BASE}/api/summary?_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());

export const getLadder = () =>
  fetch(`${BASE}/api/ladder?_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());

// export const getMatches = (limit=5) =>
//   fetch(`${BASE}/api/matches?limit=${limit}&_=${bust()}`, { cache: 'no-store' }).then(r=>r.json());
