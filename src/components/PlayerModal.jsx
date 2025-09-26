// PlayerModal.jsx
import { useEffect, useState } from "react";
import Q3Table from "./Q3Table";
import Q3Name from "./Q3Name";

export default function PlayerModal({ open, onClose, player, refreshedAt }) {
  if (!open) return null;
  const esc = (e) => e.key === "Escape" && onClose();
  useEffect(() => { document.addEventListener("keydown", esc); return () => document.removeEventListener("keydown", esc); }, []);

  const t = player?.totals || {};
  const rail = t.rail || { kills: 0, deaths: 0 };
  const gaunt = t.gauntlet || { kills: 0, deaths: 0 };
  const nem = player?.nemesis || { most_killed: [], killed_by: [], bots: { most_killed: [], killed_by: [] } };
  const fmt = (ms) => (ms ? new Date(ms).toLocaleString() : "—");

const Sparkline = ({ data = [] }) => {
  const max = Math.max(1, ...data.map(d => d.c));
  const W = 560, H = 80, pad = 10;
  const barW = (W - pad * 2) / 24 - 2;

  const [tip, setTip] = useState(null); // {x,y,text}
  const hourLabel = (ms) => `${String(new Date(ms).getHours()).padStart(2, "0")}:00`;

  return (
    <div className="ock-spark-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="ock-spark-svg" role="img" aria-label="Last 24h activity">
        {[0,6,12,18,24].map((i) => {
          const x = pad + (i / 24) * (W - pad * 2);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={H - 22} y2={H - 20} className="ock-spark-tick" />
              <text x={x} y={H - 6} textAnchor="middle" className="ock-spark-label">{i}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = Math.round(((d.c || 0) / max) * (H - 28));
          const x = pad + i * ((W - pad * 2) / 24);
          const y = H - 28 - h;
          return (
            <rect
              key={i}
              x={x} y={y} width={barW} height={h}
              className="ock-spark-bar"
              onMouseEnter={(e) =>
                setTip({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, text: `${hourLabel(d.t)} — ${d.c} frags` })
              }
              onMouseLeave={() => setTip(null)}
            />
          );
        })}
        {(() => {
          const avg = data.length ? data.reduce((a,b)=>a+(b.c||0),0)/data.length : 0;
          const y = H - 28 - ((avg / max) * (H - 28));
          return <line x1={pad} x2={W - pad} y1={y} y2={y} className="ock-spark-avg" />;
        })()}
      </svg>

      {tip && (
        <div className="ock-spark-tip" style={{ left: tip.x + 8, top: tip.y - 28 }}>
          {tip.text}
        </div>
      )}
    </div>
  );
};


  const cols = [
    { key: 'name', header: 'Name', render: (r) => <Q3Name name={r.name} /> },
    { key: 'count', header: 'Count', align: 'right' },
  ];

  return (
<div className="ock-modal-overlay">
  <div className="ock-modal">
    <div className="flex-row space-between align-center mb-12">
      <div>
        <div className="title-lg">
          <Q3Name name={player?.name || ""} />{" "}
          {player?.is_bot ? <span className="ock-chip">Bot</span> : null}
        </div>
        <div className="ock-modal-sub">
          First seen: {fmt(player?.first_seen)} · Last seen: {fmt(player?.last_seen)}
          {player?.model ? ` · last model: ${player.model}` : ""}
          {player?.hmodel ? ` / ${player.hmodel}` : ""}
        </div>
      </div>
      <button onClick={onClose} className="ock-btn">Close</button>
    </div>

    {/* Totals */}
    <div className="grid-6 gap-8 mb-12">
      {[
        { k: "Kills", v: t.kills ?? 0 },
        { k: "Deaths", v: t.deaths ?? 0 },
        { k: "KD", v: t.kd ?? 0 },
        { k: "Suicides", v: t.suicides ?? 0 },
        { k: "Rail K/D", v: `${rail.kills ?? 0}/${rail.deaths ?? 0}` },
        { k: "Gauntlet K/D", v: `${gaunt.kills ?? 0}/${gaunt.deaths ?? 0}` },
      ].map((c) => (
        <div key={c.k} className="ock-card">
          <div className="ock-modal-sub">{c.k}</div>
          <div className="ock-num value-lg">{c.v}</div>
        </div>
      ))}
    </div>

    {/* Nemesis */}
    <div className="grid-2 gap-12 mb-12">
      <div>
        <div className="section-title">Humans</div>
        <div className="grid-2 gap-8">
          <div>
            <div className="label-sm mb-4">Most killed</div>
            <Q3Table columns={cols} rows={nem.most_killed || []} />
          </div>
          <div>
            <div className="label-sm mb-4">Killed by</div>
            <Q3Table columns={cols} rows={nem.killed_by || []} />
          </div>
        </div>
      </div>
      <div>
        <div className="section-title">Bots</div>
        <div className="grid-2 gap-8">
          <div>
            <div className="label-sm mb-4">Most killed</div>
            <Q3Table columns={cols} rows={nem.bots?.most_killed || []} />
          </div>
          <div>
            <div className="label-sm mb-4">Killed by</div>
            <Q3Table columns={cols} rows={nem.bots?.killed_by || []} />
          </div>
        </div>
      </div>
    </div>

    {/* Activity */}
    <div className="mb-8">
      <div className="section-title mb-6">Activity (last 24h)</div>
      <Sparkline data={player?.sparkline_24h || []} />
    </div>

    <div className="ock-modal-sub mt-10">
      Updated {refreshedAt ? new Date(refreshedAt).toLocaleTimeString() : ""}
    </div>
  </div>
</div>

  );
}
