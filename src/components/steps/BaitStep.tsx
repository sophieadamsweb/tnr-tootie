import { BAIT_FALLBACK, BAIT_ZONES, RESULT_HEADINGS } from "@/content/lesson";
import type { BaitPick } from "@/lib/trapState";
import { Feedback } from "../ui/Feedback";

// Step 4: where does the food go?
//
// The main way to answer is tapping the drawing (handled in Lesson.tsx).
// Tapping a picture doesn't work with a keyboard or screen reader, so the
// same three spots are also here as plain buttons.
type Props = {
  bait: BaitPick | null;
  onPick: (pick: BaitPick) => void;
};

export function BaitStep({ bait, onPick }: Props) {
  const zone = BAIT_ZONES.find((z) => z.id === bait?.zone);

  let result: "right" | "wrong" | null = null;
  let heading: string | undefined;
  if (zone && zone.correct) {
    result = "right";
    heading = `${RESULT_HEADINGS.bait.right} ${zone.label}`;
  }
  if (zone && !zone.correct) {
    result = "wrong";
    heading = `${RESULT_HEADINGS.bait.wrong} ${zone.label}`;
  }

  return (
    <>
      <p>
        Tootie walks in through the door on the right. Where should the food go? Tap or click inside the trap to drop
        it.
      </p>

      <div>
        <p id="bait-buttons-label" className="text-sm text-stone-700">
          Or pick a spot:
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="bait-buttons-label">
          {BAIT_FALLBACK.map((spot) => {
            const spotZone = BAIT_ZONES.find((z) => z.id === spot.id);
            return (
              <button
                key={spot.id}
                type="button"
                aria-pressed={bait?.zone === spot.id}
                onClick={() => onPick({ x: spot.x, y: 200, zone: spot.id })}
                className="min-h-11 rounded-full border-2 border-ink bg-card px-4 text-sm font-bold aria-pressed:bg-ink aria-pressed:text-white"
              >
                {spotZone?.label}
              </button>
            );
          })}
        </div>
      </div>

      <Feedback
        result={result}
        heading={heading}
        emptyText="Nothing yet. Give it a try."
      >
        {zone && <p>{zone.feedback}</p>}
        {zone && !zone.correct && <p className="mt-2 text-sm">Try another spot.</p>}
      </Feedback>
    </>
  );
}
