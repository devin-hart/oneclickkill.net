// Q3Name.jsx — render Quake ^-color codes as spans
import { useMemo } from "react";
import { DEFAULT_COLOR, parseQ3Colored, stripQ3Colors } from "../utils/q3";

export default function Q3Name({
  value = "",
  className,
  defaultColor = DEFAULT_COLOR,
  title = true,
  ...rest
}) {
  const segments = useMemo(
    () => parseQ3Colored(value, defaultColor),
    [value, defaultColor],
  );
  const plain = useMemo(() => stripQ3Colors(value), [value]);

  const titleValue = title === true ? plain : title || undefined;
  const spanProps = {
    className,
    title: title === false ? undefined : titleValue,
    ...rest,
  };

  if (!segments.length) {
    return (
      <span {...spanProps}>
        {value}
      </span>
    );
  }

  return (
    <span {...spanProps}>
      {segments.map((segment, index) => (
        <span key={`${segment.color}-${index}`} style={{ color: segment.color }}>
          {segment.text}
        </span>
      ))}
    </span>
  );
}
