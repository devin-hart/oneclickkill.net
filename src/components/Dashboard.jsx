// Dashboard.jsx
import { useEffect, useState } from 'react';
import { getSummary, getLadder } from '../api';

/* ---------- Q3 color rendering ---------- */
const Q3_COLORS = {
  '0': '#000000', // black
  '1': '#ff0000', // red
  '2': '#00ff00', // green
  '3': '#ffff00', // yellow
  '4': '#0000ff', // blue
  '5': '#00ffff', // cyan
  '6': '#ff00ff', // magenta
  '7': '#ffffff', // white
  '8': '#ffa500', // orange (OA/E+ often maps ^8 to orange)
  '9': '#999999', // gray (common mapping)
};

// Parse "^" color codes into [{text, color}] segments.
// Supports ^0..^9 and ^xRRGGBB (hex).
const parseQ3Colored = (s = '', defaultColor = '#ffffff') => {
  let color = defaultColor, out = [], buf = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '^' && i + 1 < s.length) {
      // ^xRRGGBB
      if ((s[i + 1] === 'x' || s[i + 1] === 'X') && i + 7 < s.length) {
        const hex = s.slice(i + 2, i + 8);
        if (/^[0-9a-fA-F]{6}$/.test(hex)) {
          if (buf) { out.push({ text: buf, color }); buf = ''; }
          color = `#${hex}`;
          i += 7; // skip ^x + 6 hex
          continue;
        }
      }
      // ^0..^9
      if (/[0-9]/.test(s[i + 1])) {
        if (buf) { out.push({ text: buf, color }); buf = ''; }
        color = Q3_COLORS[s[i + 1]] ?? color;
        i += 1; // skip caret + digit
        continue;
      }
    }
    buf += ch;
  }
  if (buf) out.push({ text: buf, color });
  return out;
};

const stripQ3Colors = (s = '') =>
  s.replace(/\^[0-9]/g, '').replace(/\^x[0-9a-fA-F]{6}/g, '');

const Q3Name = ({ value, className }) => {
  const segs = parseQ3Colored(value);
  if (!segs.length) return <span className={className}>{value}</span>;
  return (
    <span className={className} title={stripQ3Colors(value)}>
      {segs.map((seg, i) => (
        <span key={i} style={{ color: seg.color }}>{seg.text}</span>
      ))}
    </span>
  );
};
/* ---------- /Q3 color rendering ---------- */

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [ladder, setLadder] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let t;
    const load = async () => {
      try {
        const [s, l] = await Promise.all([getSummary(), getLadder()]);
        setSummary(s);
        setLadder(l);
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
            {summary.current_match.top5.map((p, i) => (
              <li key={p.id ?? p.name ?? i}>
                {/* current-match names are clean already; Q3Name handles both */}
                <Q3Name value={p.name} /> — {p.kills}/{p.deaths} (KD {p.kd})
              </li>
            ))}
          </ol>
        ) : <div>No match yet</div>}
      </section>

      <section>
        <h2>Ladder (top 25)</h2>
        {ladder?.players?.length ? (
          <ol>
            {ladder.players.slice(0, 25).map((p, i) => (
              <li key={p.id ?? p.name ?? i}>
                <Q3Name value={p.name_colored || p.name} /> — {p.kills}/{p.deaths} (KD {p.kd})
              </li>
            ))}
          </ol>
        ) : <div>…</div>}
      </section>
    </div>
  );
}
