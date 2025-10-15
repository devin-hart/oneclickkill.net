// Dashboard.jsx
import { useEffect, useState, useRef } from 'react';
import { getSummary, getLadder, getPlayerBy } from '../api';
import { bestPlayerName } from '../utils/q3';
import Q3Table from './Q3Table';
import ServerCard from './ServerCard';
import PlayerSearch from "./PlayerSearch";
import PlayerModal from "./PlayerModal";
import Q3Name from "./Q3Name";

/* ---------- tiny skeleton styles ---------- */
const skeletonCSS = `
@keyframes q3-shimmer {0%{background-position:-200% 0}100%{background-position:200% 0}}
.q3-skel {background:linear-gradient(90deg,#222 0%,#333 50%,#222 100%);
  background-size:400% 100%; animation:q3-shimmer 1.2s infinite; }
`;
const Skeleton = ({ w='100%', h=14, style }) =>
  <div className="q3-skel" style={{ width: w, height: h, ...style }} />;

const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString() : '—';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [ladder, setLadder] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [playerErr, setPlayerErr] = useState("");
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerRefreshedAt, setPlayerRefreshedAt] = useState(0);
  const pollRef = useRef(null);

  useEffect(() => {
    let timer;
    const load = async (first = false) => {
      try {
        if (!first) setRefreshing(true);
        const [s, l] = await Promise.all([getSummary(), getLadder()]);
        setSummary(s);
        setLadder(l);
        setErr("");
        setLastUpdated(Date.now());
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    load(true);
    timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  // open player modal by name (colors ok)
  const openPlayer = async (name) => {
    try {
      setPlayerErr("");
      setPlayerLoading(true);
      const p = await getPlayerBy(name, { days: 7, limitPairs: 10 });
      setPlayerData(p);
      setPlayerModalOpen(true);
      setPlayerRefreshedAt(Date.now());
      clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const np = await getPlayerBy(name, { days: 7, limitPairs: 10 });
          setPlayerData(np);
          setPlayerRefreshedAt(Date.now());
        } catch (intervalErr) {
          console.warn("Failed to refresh player data", intervalErr);
        }
      }, 12000);
    } catch (e) {
      setPlayerErr(e.message || "Player not found");
      setPlayerModalOpen(true);
      setPlayerData(null);
    } finally {
      setPlayerLoading(false);
    }
  };

  const players =
    summary?.current_match?.players || summary?.current_match?.top5 || [];

  const matchColumns = [
    {
      header: "Player",
      render: (p) => (
        <a
          onClick={() => openPlayer(bestPlayerName(p))}
          className="linklike"
          title="View player"
        >
          <Q3Name value={bestPlayerName(p)} />
        </a>
      ),
    },
    { header: "Kills", key: "kills", align: "right" },
    { header: "Deaths", key: "deaths", align: "right" },
    {
      header: "KDR",
      render: (p) => (typeof p.kd === "number" ? p.kd.toFixed(2) : p.kd),
      align: "right",
    },
  ];
  const ladderRows = (ladder?.players || [])
    .slice()
    .sort(
      (a, b) =>
        Number(b.kills) - Number(a.kills) ||
        Number(b.kd) - Number(a.kd) ||
        Number(a.deaths) - Number(b.deaths)
    )
    .slice(0, 25)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const ladderColumns = [
    { key: "rank", header: "Rank", align: "right" },
    {
      header: "Player",
      render: (row) => (
        <a
          onClick={() => openPlayer(bestPlayerName(row))}
          className="linklike"
          title="View player"
        >
          <Q3Name value={bestPlayerName(row)} />
        </a>
      ),
    },
    { key: "kills", header: "Kills", align: "right" },
    { key: "deaths", header: "Deaths", align: "right" },
    { key: "kd", header: "KDR", align: "right" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <PlayerSearch
          loading={playerLoading}
          onSubmit={async (name) => {
            try {
              setPlayerErr("");
              setPlayerLoading(true);
              const p = await getPlayerBy(name, { days: 7, limitPairs: 10 });
              setPlayerData(p);
              setPlayerModalOpen(true);
              setPlayerRefreshedAt(Date.now());
              // start light polling while modal is open
              clearInterval(pollRef.current);
              pollRef.current = setInterval(async () => {
                try {
                  const np = await getPlayerBy(name, {
                    days: 7,
                    limitPairs: 10,
                  });
                  setPlayerData(np);
                  setPlayerRefreshedAt(Date.now());
                } catch (intervalErr) {
                  console.warn("Failed to refresh player data", intervalErr);
                }
              }, 12000);
            } catch (e) {
              setPlayerErr(e.message || "Player not found");
              setPlayerModalOpen(true);
              setPlayerData(null);
            } finally {
              setPlayerLoading(false);
            }
          }}
        />
        {playerErr && (
          <div style={{ marginTop: 6, color: "#ef4444", fontSize: 12 }}>
            {playerErr}
          </div>
        )}
      </div>
      <style>{skeletonCSS}</style>

      {/* status / timestamp / error */}
      <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Server Status</h2>
        <small style={{ opacity: 0.7 }}>
          Last updated: {fmtTime(lastUpdated)} {refreshing ? "⟳" : ""}
        </small>
      </div>

      {err && (
        <div style={{ color: "crimson", margin: "6px 0 12px" }}>{err}</div>
      )}

      {/* first-load skeletons */}
      {loading ? (
        <div>
          <Skeleton w="60%" h={18} />
          <div style={{ height: 6 }} />
          <Skeleton w="40%" />
          <div style={{ height: 6 }} />
          <Skeleton w="30%" />
          <ol style={{ marginTop: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                style={{ listStyle: "decimal inside", margin: "4px 0" }}
              >
                <Skeleton w="70%" />
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <>
          <ServerCard
            hostname={summary?.live?.hostname || "OneClickKill.net"}
            map={
              summary?.live?.mapname || summary?.current_match?.map || "unknown"
            }
            players={
              summary?.live?.player_count ??
              summary?.current_match?.players?.length ??
              0
            }
            updatedAt={lastUpdated}
            source={summary?.source === "udp" ? "Live" : "Down"}
          />

          {players.length ? (
            <Q3Table columns={matchColumns} rows={players} />
          ) : (
            <div style={{ opacity: 0.8, marginTop: 8 }}>No match yet.</div>
          )}

          <section style={{ marginTop: 24, marginBottom: 24 }}>
            <h2>Ladder (top 25)</h2>
            {ladder?.players?.length ? (
              <Q3Table columns={ladderColumns} rows={ladderRows} />
            ) : (
              <div style={{ opacity: 0.8 }}>No ladder data yet.</div>
            )}
          </section>
        </>
      )}
      <PlayerModal
        open={playerModalOpen}
        onClose={() => {
          setPlayerModalOpen(false);
          setPlayerData(null);
          setPlayerErr("");
          clearInterval(pollRef.current);
        }}
        player={playerData}
        refreshedAt={playerRefreshedAt}
      />
    </div>
  );
}
