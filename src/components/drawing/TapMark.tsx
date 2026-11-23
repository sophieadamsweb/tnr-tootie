// The green ✓ or red ✕ circle that pops up where you tapped on the "Bait it"
// step. Same idea as the mirrors game.
export function TapMark({ x, y, isRight }: { x: number; y: number; isRight: boolean }) {
  const color = isRight ? "#15803d" : "#be123c";

  // A check mark is two short lines; an X is two crossed lines.
  const checkMark = `M${x - 9} ${y} l6 7 l13 -14`;
  const xMark = `M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16`;

  return (
    <g className="pop" aria-hidden="true">
      <circle cx={x} cy={y} r="22" fill={color} stroke="#fff" strokeWidth="3" />
      <path
        d={isRight ? checkMark : xMark}
        fill="none"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
