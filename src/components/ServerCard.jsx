export default function ServerCard({
  hostname = 'OneClickKill.net',
  map = 'unknown',
  players = 0,
  updatedAt,
  source = 'Live',
}) {
  return (
    <div className="q3-card q3-info">
      <div className="q3-info-head">
        <strong>{hostname}</strong>
        <small>
          Last updated: {updatedAt ? new Date(updatedAt).toLocaleTimeString() : '—'}
        </small>
      </div>

      <div className="q3-info-grid">
        <div className="q3-stat">
          <span className="label">Map</span>
          <span className="value">{map}</span>
        </div>
        <div className="q3-stat">
          <span className="label">Players</span>
          <span className="value">{players}</span>
        </div>
        <div className="q3-stat">
          <span className="label">Source</span>
          <span className="value">{source}</span>
        </div>
      </div>
    </div>
  );
}
