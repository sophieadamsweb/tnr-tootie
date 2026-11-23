import { FUR, INK } from "./colors";

// Tootie, drawn facing left. Gray with a white chest and white socks.
// If earTipped is true, one ear gets a flat top: that's the TNR ear tip.
// If eyesClosed is true, her eyes become happy little upside-down U's (^ ^),
// like a cat that's just been petted.
export function Tootie({ earTipped, eyesClosed = false }: { earTipped: boolean; eyesClosed?: boolean }) {
  return (
    <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
      {/* tail: a thick dark line with a thinner gray line on top, so it gets an outline */}
      <path d="M246 198 C 282 196, 288 160, 268 146" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M246 198 C 282 196, 288 160, 268 146" fill="none" stroke={FUR} strokeWidth="8" strokeLinecap="round" />

      {/* four legs, each with a white sock */}
      <Leg x={150} />
      <Leg x={170} />
      <Leg x={214} />
      <Leg x={232} />

      {/* body and white chest */}
      <ellipse cx="196" cy="198" rx="56" ry="26" fill={FUR} />
      <ellipse cx="158" cy="204" rx="14" ry="15" fill="#fff" strokeWidth="0" />

      {/* ears, drawn before the head so the head covers their bottoms */}
      {earTipped ? (
        <path d="M120 168 L118 150 L128 147 L138 158 Z" fill={FUR} />
      ) : (
        <path d="M120 168 L117 140 L138 158 Z" fill={FUR} />
      )}
      <path d="M140 158 L159 140 L158 168 Z" fill={FUR} />

      {/* head */}
      <circle cx="138" cy="180" r="24" fill={FUR} />

      {/* eyes: open (with a little white shine), or closed and happy */}
      {eyesClosed ? (
        <path d="M123 180 q5 -7 10 0 M141 180 q5 -7 10 0" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        // The open eyes blink every few seconds (see .tootie-blink in globals.css)
        <g className="tootie-blink">
          <ellipse cx="128" cy="178" rx="4" ry="5" fill={INK} stroke="none" />
          <ellipse cx="146" cy="178" rx="4" ry="5" fill={INK} stroke="none" />
          <circle cx="129.5" cy="176" r="1.5" fill="#fff" stroke="none" />
          <circle cx="147.5" cy="176" r="1.5" fill="#fff" stroke="none" />
        </g>
      )}

      {/* nose */}
      <path d="M133 188 h8 l-4 4 Z" fill="#f4a3a8" stroke="none" />

      {/* whiskers */}
      <path d="M126 192 l-20 -2 M126 195 l-19 4 M148 192 l20 -2 M148 195 l19 4" strokeWidth="1.2" />
    </g>
  );
}

function Leg({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="208" width="12" height="22" rx="5" fill={FUR} />
      <ellipse cx={x + 6} cy="228" rx="7" ry="3.5" fill="#fff" strokeWidth="2" />
    </g>
  );
}
