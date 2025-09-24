import { useEffect, useState } from 'react';
import { getSummary, getLadder, getMatches } from '../api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [ladder, setLadder] = useState(null);
  const [matches, setMatches] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let t;
    const load = async () => {
      try {
        const [s, l, m] = await Promise.all([
          getSummary(),
          getLadder(),
          getMatches(5),
        ]);
        setSummary(s);
        setLadder(l);
        setMatches(m);
        setErr('');
      } catch (e) {
        setErr(e.message || 'error');
      }
    };
    load();
    t = setInterval(load, 5000); // poll live every 5s
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1>OneClickKill — Live</h1>
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}

      <section>
        <h2>Server</h2>
        {summary?.live ? (
          <div>
            <div><strong>{summary.live.hostname}</strong></div>
            <div>Map: {summary.live.mapname}</div>
            <div>Players: {summary.live.player_count}</div>
          </div>
        ) : <div>…</div>}
      </section>

      <section>
        <h2>Current Match (top 5)</h2>
        {summary?.current_match?.top5?.length ? (
          <ol>
            {summary.current_match.top5.map(p => (
              <li key={p.name}>{p.name} — {p.kills}/{p.deaths} (KD {p.kd})</li>
            ))}
          </ol>
        ) : <div>No match yet</div>}
      </section>

      <section>
        <h2>Ladder (top 5)</h2>
        {ladder?.players?.length ? (
          <ol>
            {ladder.players.slice(0, 5).map(p => (
              <li key={p.name}>{p.name} — {p.kills}/{p.deaths} (KD {p.kd})</li>
            ))}
          </ol>
        ) : <div>…</div>}
      </section>

      <section>
        <h2>Recent Matches</h2>
        {matches?.matches?.length ? (
          <ul>
            {matches.matches.map(m => (
              <li key={m.id}>#{m.id} — {m.map} — frags: {m.frags ?? 0}</li>
            ))}
          </ul>
        ) : <div>…</div>}
      </section>
    </div>
  );
}
