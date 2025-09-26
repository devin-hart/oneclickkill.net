// PlayerModal.jsx
import { useEffect } from "react";
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

  const Sparkline = ({ data }) => {
    const max = Math.max(1, ...data.map(d => d.c));
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 4, alignItems: "end", height: 60 }}>
        {data.map((d, i) => (
          <div key={i} title={`${new Date(d.t).getHours()}:00 — ${d.c}`} style={{ height: `${(d.c / max) * 100}%`, background: "var(--fg, #cbd5e1)" }} />
        ))}
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
