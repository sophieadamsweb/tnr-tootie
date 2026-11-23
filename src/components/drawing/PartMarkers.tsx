import { TRAP_PARTS, type TrapPartId } from "@/content/lesson";

// Here we are working on the numbered circles you tap on the "Meet the trap" step.
//
// Each of these is an actual <button> that's sitting on top of the drawing 
// instead of being shapes inside it. 
//
// With this approach keyboards, screen readers, and touch devices all can
// play with zero extra effort or tools.
//
// Positions are percentages of the drawing's width and height, so they stay
// lined up at any screen size. I nudged them by hand until none of them
// overlapped, even on a tiny 320px phone.
const POSITIONS: Record<TrapPartId, { x: number; y: number }> = {
  door: { x: 93, y: 66 },
  plate: { x: 35, y: 79 },
  rod: { x: 66, y: 48 },
  latch: { x: 86, y: 22 },
  handle: { x: 44, y: 16 },
};

type Props = {
  seenParts: TrapPartId[];
  activePart: TrapPartId | null;
  onSelect: (part: TrapPartId) => void;
};

export function PartMarkers({ seenParts, activePart, onSelect }: Props) {
  return (
    <>
      {TRAP_PARTS.map((part, index) => {
        const number = index + 1;
        const isActive = activePart === part.id;
        const isSeen = seenParts.includes(part.id);

        // Three looks: the one you're reading (yellow), ones you've seen
        // (teal with a check), and ones you haven't (white, pulsing).
        let look = "bg-card text-ink hotspot-pulse";
        let symbol: string | number = number;
        if (isActive) {
          look = "bg-mustard text-ink";
        } else if (isSeen) {
          look = "bg-pine text-white";
          symbol = "✓";
        }

        let label = `${number}. ${part.name}`;
        if (isSeen) label += " (seen)";

        return (
          <button
            key={part.id}
            type="button"
            onClick={() => onSelect(part.id)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={`hotspot absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[2.5px] border-ink font-display text-lg font-black shadow-[2px_2px_0_0_var(--ink)] ${look}`}
            style={{ left: `${POSITIONS[part.id].x}%`, top: `${POSITIONS[part.id].y}%` }}
          >
            <span aria-hidden="true">{symbol}</span>
          </button>
        );
      })}
    </>
  );
}
