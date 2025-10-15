// PlayerSearch.jsx
import { useState, useRef, useEffect } from "react";

export default function PlayerSearch({ onSubmit, placeholder = "Search player name...", loading = false }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.setAttribute("autocomplete", "off"); }, []);

  const submit = (e) => {
    e.preventDefault();
    const s = q.trim();
    if (!s) return;
    onSubmit(s);
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input
        ref={ref}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="ock-input"
        disabled={loading}
        aria-busy={loading}
      />
      <button type="submit" className="ock-btn" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
