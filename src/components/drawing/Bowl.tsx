import { INK } from "./colors";

// A food bowl. Used in the yard and inside the trap.
// x and y are the center of the bottom of the bowl.
export function Bowl({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* the food, a little mound */}
      <path d={`M${x - 20} ${y} q20 -14 40 0`} fill="#d97706" stroke={INK} strokeWidth="1.5" />
      {/* the bowl */}
      <ellipse cx={x} cy={y} rx="21" ry="5" fill="#b45309" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}
