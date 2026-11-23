"use client";

import { useState } from "react";
import type { TrapPartId } from "@/content/lesson";
import type { TrapState } from "@/lib/trapState";
import { Bowl } from "./Bowl";
import { HIGHLIGHT, INK, METAL, PLATE, TOWEL, WIRE } from "./colors";
import { SnapBurst } from "./SnapBurst";
import { TapMark } from "./TapMark";
import { Tootie } from "./Tootie";

// The picture at the top of every step: a box trap from the side, or Tootie's
// yard. It doesn't know which step you're on. It just draws whatever `scene`
// says (see src/lib/trapState.ts for how that gets decided).
//
// Coordinates: the drawing is 600 wide and 280 tall. The door is on the right
// at x=540, the back wall is on the left at x=60, the floor is at y=230.
//
// SVG draws things in order, later things on top. So it goes: ground, yard or
// floor stuff, Tootie, the cage (so she's inside it), towels, then the tap marks.

// How far Tootie is slid to the right in each spot. "outside" is off the edge
// of the picture, so she can walk in. The walking itself is a CSS transition
// on the .cat-walk class.
const CAT_SLIDE = {
  inside: 0,
  yard: 200,
  outside: 620,
};

type Props = {
  scene: TrapState;
  description: string; // the words a screen reader reads for this picture
  onTap?: (x: number, y: number) => void; // only passed on the "Bait it" step
  children?: React.ReactNode; // the part markers on the "Meet the trap" step
  canPetTootie?: boolean; // only true on the first and last steps
};

// How long one happy hop takes. Matches the .tootie-hop animation in globals.css.
const HOP_MS = 900;

export function TrapDiagram({ scene, description, onTap, children, canPetTootie = false }: Props) {
  // Is Tootie doing her happy hop right now? (Eyes closed, hopping.)
  const [hopping, setHopping] = useState(false);

  // Clicking Tootie: she closes her eyes and hops, then goes back to normal.
  // Clicks in the middle of a hop are ignored, so she finishes one before
  // starting the next.
  function petTootie() {
    if (hopping) return;
    setHopping(true);
    window.setTimeout(() => setHopping(false), HOP_MS);
  }

  // Is this part the one that should glow?
  function glows(part: TrapPartId) {
    return scene.highlight === part;
  }

  // When you tap the drawing, the browser tells us where on the *screen* you
  // tapped. We need where in the *drawing* you tapped (0-600, 0-280).
  // getScreenCTM() is the browser's own "drawing to screen" conversion, and
  // .inverse() flips it around to go "screen to drawing".
  function handleClick(event: React.MouseEvent<SVGSVGElement>) {
    if (!onTap) return;
    const conversion = event.currentTarget.getScreenCTM();
    if (!conversion) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(conversion.inverse());
    onTap(Math.round(point.x), Math.round(point.y));
  }

  return (
    // On short screens (a laptop, or a phone held sideways) the drawing could
    // eat the whole screen and push the instructions out of sight. This caps
    // the width so the drawing is never taller than about 38% of the screen
    // height, leaving room for the words underneath. 600 / 280 is the drawing's shape.
    <div className="relative mx-auto w-full select-none" style={{ maxWidth: "calc(38svh * 600 / 280)" }}>
      <svg
        viewBox="0 0 600 280"
        className={onTap ? "block h-auto w-full sardine-cursor" : "block h-auto w-full"}
        role="img"
        aria-label={description}
        onClick={handleClick}
      >
        <Ground />

        {!scene.showTrap && <Yard />}

        {scene.showTrap && scene.newspaper && <Newspaper />}
        {scene.showTrap && scene.bowlX !== null && <Bowl x={scene.bowlX} y={222} />}

        {/* trip plate, drawn before Tootie so she stands on top of it */}
        {scene.showTrap && (
          <path
            d="M160 226 L260 218 L262 224 L162 232 Z"
            fill={glows("plate") ? HIGHLIGHT : PLATE}
            stroke={INK}
            strokeWidth="2"
          />
        )}

        {/* Tootie. She's drawn facing left (walking into the trap). In the yard
            we flip her so she faces her food bowl. Her name tag sits outside the
            flip so the text doesn't come out backwards. */}
        <g className="cat-walk" style={{ transform: `translateX(${CAT_SLIDE[scene.cat]}px)` }} aria-hidden="true">
          {/* The happy hop moves this inner group, so it never fights with the walk */}
          <g className={hopping ? "tootie-hop" : undefined}>
            {scene.cat === "yard" ? (
              <g transform="translate(388 0) scale(-1 1)">
                <Tootie earTipped={scene.earTipped} eyesClosed={hopping} />
              </g>
            ) : (
              // key: when she moves to a new spot, React draws a fresh Tootie, which
              // restarts her blink timer. Her first blink is ~5 seconds later, long
              // after the 1.4 second walk is over, so she never blinks mid-walk.
              <Tootie key={scene.cat} earTipped={scene.earTipped} />
            )}
            {scene.cat === "yard" && <NameTag />}
          </g>
        </g>

        {scene.cat === "yard" && scene.earTipped && <EarTipLabel />}

        {scene.showTrap && (
          <>
            <Cage />

            {/* handle and the flat guard plate under it */}
            <rect x="250" y="58" width="100" height="14" rx="2" fill={glows("handle") ? HIGHLIGHT : METAL} stroke={INK} strokeWidth="2" />
            <path d="M272 58 V36 H328 V58" fill="none" stroke={glows("handle") ? HIGHLIGHT : INK} strokeWidth="5" strokeLinejoin="round" />

            {/* trigger rod, from the trip plate up to the latch */}
            <path d="M210 222 L520 74" stroke={glows("rod") ? HIGHLIGHT : INK} strokeWidth={glows("rod") ? 5 : 3} />

            {/* latch */}
            <path d="M512 70 q8 -18 20 -6" fill="none" stroke={glows("latch") ? HIGHLIGHT : INK} strokeWidth="5" strokeLinecap="round" />

            <Door open={scene.doorOpen} glowing={glows("door")} />

            {/* towel over the back half */}
            {scene.backCovered && !scene.fullyCovered && (
              <path d="M48 62 H300 q6 30 -4 60 q10 30 0 60 q8 26 -2 56 H48 Z" fill={TOWEL} opacity="0.94" stroke={INK} strokeWidth="2" />
            )}

            {/* sheet over the whole trap, after the catch */}
            {scene.fullyCovered && (
              <path d="M44 52 Q300 30 556 52 L566 238 Q300 250 34 238 Z" fill={TOWEL} stroke={INK} strokeWidth="2.5" />
            )}
          </>
        )}

        {scene.snap && <SnapBurst />}

        {/* The key makes React treat every new tap as a brand new mark, so the
            pop-in animation plays again each time. */}
        {scene.tapMark && (
          <TapMark
            key={`${scene.tapMark.x}-${scene.tapMark.y}`}
            x={scene.tapMark.x}
            y={scene.tapMark.y}
            isRight={scene.tapMark.isRight}
          />
        )}
      </svg>

      {/* The thing you click to pet Tootie. Like the part markers, it's a real
          <button> on top of the drawing (not part of the picture), so keyboards
          and screen readers can pet her too. It's see-through and covers her
          and her name tag in the yard. Numbers are percent of the drawing. */}
      {canPetTootie && scene.cat === "yard" && (
        <button
          type="button"
          onClick={petTootie}
          aria-label="Pet Tootie"
          title="Pet Tootie"
          className="absolute cursor-pointer rounded-2xl"
          style={{ left: "49.5%", top: "37%", width: "31%", height: "46%" }}
        />
      )}

      {/* Tells screen readers what happened, since they can't see the hop */}
      {canPetTootie && (
        <p role="status" aria-live="polite" className="sr-only">
          {hopping ? "Tootie closes her eyes and does a happy hop." : ""}
        </p>
      )}

      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Smaller pieces of the drawing
// ---------------------------------------------------------------------------

// Dirt along the bottom, with a few dashes so it reads as ground and not a gray bar.
function Ground() {
  return (
    <g>
      <rect x="0" y="236" width="600" height="44" fill="#efe3c8" />
      <path d="M0 236 H600" stroke={INK} strokeWidth="2.5" />
      <path d="M40 252 h18 M70 266 h12" stroke="#d9c7a3" strokeWidth="2" strokeLinecap="round" />
      <path d="M150 252 h18 M180 266 h12" stroke="#d9c7a3" strokeWidth="2" strokeLinecap="round" />
      <path d="M290 252 h18 M320 266 h12" stroke="#d9c7a3" strokeWidth="2" strokeLinecap="round" />
      <path d="M410 252 h18 M440 266 h12" stroke="#d9c7a3" strokeWidth="2" strokeLinecap="round" />
      <path d="M520 252 h18 M550 266 h12" stroke="#d9c7a3" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// Tootie's yard: the porch, her food, her water and some grass.
function Yard() {
  return (
    <g aria-hidden="true">
      {/* porch */}
      <rect x="0" y="150" width="72" height="86" fill="#e2cfae" stroke={INK} strokeWidth="2.5" />
      <path d="M0 150 H84 L72 134 H0 Z" fill="#c9ae84" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 175 h44 M14 200 h44" stroke="#c9ae84" strokeWidth="2" />

      {/* food and water */}
      <Bowl x={490} y={232} />
      <ellipse cx="540" cy="232" rx="16" ry="4.5" fill="#7cc0f0" stroke={INK} strokeWidth="2" />

      {/* grass tufts */}
      <path d="M120 236 l4 -13 l3 13 l4 -10 l3 10" fill="none" stroke="#5f8f4e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M335 236 l4 -13 l3 13 l4 -10 l3 10" fill="none" stroke="#5f8f4e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M575 236 l4 -13 l3 13 l4 -10 l3 10" fill="none" stroke="#5f8f4e" strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

// "Tootie" name tag over her head. Lives inside her walking group so it moves with her.
function NameTag() {
  return (
    <g>
      <rect x="162" y="104" width="64" height="24" rx="12" fill="#fff3c4" stroke={INK} strokeWidth="2" />
      <text x="194" y="121" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily="Nunito Variable, sans-serif">
        Tootie
      </text>
    </g>
  );
}

// A field-guide style label pointing at the ear tip. It waits 1.3 seconds
// before appearing so Tootie has time to walk home first.
function EarTipLabel() {
  return (
    <g className="pop" style={{ animationDelay: "1.3s", animationFillMode: "both" }} aria-hidden="true">
      <path d="M468 140 L520 96" stroke={INK} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="468" cy="140" r="3" fill={INK} />
      <text x="524" y="92" fontSize="15" fontStyle="italic" fontWeight="600" fill={INK} fontFamily="Fraunces Variable, serif">
        ear tip
      </text>
    </g>
  );
}

// Newspaper on the trap floor: a light strip with a few gray "text" lines.
function Newspaper() {
  const textLines = [];
  for (let i = 0; i < 18; i++) {
    const x = 78 + i * 25;
    textLines.push(<line key={i} x1={x} y1="225" x2={x + 14} y2="225" stroke="#bdb3a2" strokeWidth="1.5" />);
  }
  return (
    <g>
      <rect x="66" y="222" width="466" height="10" fill="#f7f1e3" stroke="#cbbfa6" />
      {textLines}
    </g>
  );
}

// The wire box: an outline plus evenly spaced vertical and horizontal wires.
function Cage() {
  const wires = [];
  for (let i = 0; i < 19; i++) {
    const x = 84 + i * 24;
    wires.push(<line key={`up-${i}`} x1={x} y1="70" x2={x} y2="230" />);
  }
  for (let i = 0; i < 4; i++) {
    const y = 102 + i * 32;
    wires.push(<line key={`across-${i}`} x1="60" y1={y} x2="540" y2={y} />);
  }
  return (
    <g stroke={WIRE} strokeWidth="2" fill="none">
      <rect x="60" y="70" width="480" height="160" stroke={INK} strokeWidth="3" />
      {wires}
    </g>
  );
}

// The front door. It's hinged at the top right corner. When the trap is set
// it swings up (rotates -78 degrees), and when it trips it drops back to 0.
// The CSS on .trap-door makes that drop fast so it feels like a snap.
function Door({ open, glowing }: { open: boolean; glowing: boolean }) {
  const bars = [];
  for (let i = 0; i < 6; i++) {
    const y = 92 + i * 24;
    bars.push(<line key={i} x1="534" y1={y} x2="546" y2={y} stroke={INK} strokeWidth="1" />);
  }
  return (
    <g
      className="trap-door"
      style={{
        transformOrigin: "540px 70px",
        transform: open ? "rotate(-78deg)" : "rotate(0deg)",
      }}
    >
      <rect x="534" y="70" width="12" height="160" fill={glowing ? HIGHLIGHT : METAL} stroke={INK} strokeWidth="2" />
      {bars}
    </g>
  );
}
