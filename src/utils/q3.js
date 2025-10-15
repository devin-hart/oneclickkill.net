const PALETTE = {
  0: "#000000",
  1: "#ff0000",
  2: "#00ff00",
  3: "#ffff00",
  4: "#0000ff",
  5: "#00ffff",
  6: "#ff00ff",
  7: "#ffffff",
  8: "#ffa500",
  9: "#999999",
};

export const DEFAULT_COLOR = "#ffffff";

export function parseQ3Colored(value = "", defaultColor = DEFAULT_COLOR) {
  const segments = [];
  let color = defaultColor;
  let buffer = "";

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char === "^" && i + 1 < value.length) {
      const next = value[i + 1];
      // handle ^xRRGGBB custom colors
      if ((next === "x" || next === "X") && i + 7 < value.length) {
        const hex = value.slice(i + 2, i + 8);
        if (/^[0-9a-fA-F]{6}$/.test(hex)) {
          if (buffer) {
            segments.push({ text: buffer, color });
            buffer = "";
          }
          color = `#${hex}`;
          i += 7;
          continue;
        }
      }

      if (/^[0-9]$/.test(next)) {
        if (buffer) {
          segments.push({ text: buffer, color });
          buffer = "";
        }
        color = PALETTE[next] ?? color;
        i += 1;
        continue;
      }
    }

    buffer += char;
  }

  if (buffer) {
    segments.push({ text: buffer, color });
  }

  return segments;
}

export function stripQ3Colors(value = "") {
  return value
    .replace(/\^[0-9]/g, "")
    .replace(/\^x[0-9a-fA-F]{6}/g, "")
    .replace(/\^X[0-9a-fA-F]{6}/g, "");
}

export function bestPlayerName(player, fallback = "UnnamedPlayer") {
  return (
    player?.colored ??
    player?.name_colored ??
    player?.name ??
    fallback
  );
}
