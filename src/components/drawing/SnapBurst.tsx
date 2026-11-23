import { INK } from "./colors";

// The comic-book "SNAP!" that pops up when the trap door drops.
// The star shape is just a list of points going around in a circle,
// alternating far out and close in, which makes the spiky edge.
const STAR_POINTS =
  "522,104 493,111 513,126 482,123 487,143 463,130 452,149 441,130 417,143 422,123 391,126 411,111 " +
  "382,104 411,97 391,82 422,85 417,65 441,78 452,59 463,78 487,65 482,85 513,82 493,97";

export function SnapBurst() {
  return (
    <g className="pop" aria-hidden="true">
      <polygon points={STAR_POINTS} fill="#f2b134" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <text
        x="452"
        y="113"
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fill={INK}
        fontFamily="Fraunces Variable, serif"
        transform="rotate(-6 452 104)"
      >
        SNAP!
      </text>
    </g>
  );
}
