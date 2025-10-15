// Q3Name.jsx — render Quake ^-color codes as spans
const PALETTE = {
  0: '#000000', 1: '#ff0000', 2: '#00ff00', 3: '#ffff00',
  4: '#0070ff', 5: '#00ffff', 6: '#ff00ff', 7: '#ffffff',
  8: '#ff9900', 9: '#888888',
};

export default function Q3Name({ name = '' }) {
  const out = [];
  let color = '#ffffff';
  for (let i = 0; i < name.length; ) {
    // ^xRRGGBB
    if (name[i] === '^' && name[i + 1] === 'x' && /^[0-9A-Fa-f]{6}$/.test(name.slice(i + 2, i + 8))) {
      color = `#${name.slice(i + 2, i + 8)}`; i += 8; continue;
    }
    // ^0..^9
    if (name[i] === '^' && /[0-9]/.test(name[i + 1] || '')) {
      color = PALETTE[name[i + 1]] || color; i += 2; continue;
    }
    // text run
    let j = i;
    while (j < name.length && !(name[j] === '^' && (/[0-9]/.test(name[j + 1] || '') || name[j + 1] === 'x'))) j++;
    out.push(<span key={i} style={{ color }}>{name.slice(i, j)}</span>);
    i = j;
  }
  return <>{out.length ? out : name}</>;
}
