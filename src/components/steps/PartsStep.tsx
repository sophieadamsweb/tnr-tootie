import { TRAP_PARTS, type TrapPartId } from "@/content/lesson";

// Step 3: explore the trap. The numbered markers live on the drawing (see
// drawing/PartMarkers.tsx). This is the text side: instructions, and a box
// that shows info about whichever part you tapped last.
// On phones and tablets that box is hidden (screen readers still hear it) and
// the part info shows in the ResultPanel above the Back/Next bar instead.
type Props = {
  activePart: TrapPartId | null;
  seenCount: number;
};

export function PartsStep({ activePart, seenCount }: Props) {
  const part = TRAP_PARTS.find((p) => p.id === activePart);

  return (
    <>
      <p>
        Tap the numbered markers to see what each part does. Parts you&apos;ve explored turn into a check. Look at at
        least three to continue.
      </p>

      {/* live region, so screen readers read the part info when it changes */}
      <div role="status" aria-live="polite" className="rounded-xl bg-stone-100 p-4 max-lg:sr-only lg:min-h-28">
        {part ? (
          <>
            <p className="font-display text-lg font-bold">{part.name}</p>
            <p className="mt-1">{part.what}</p>
            <p className="mt-2 text-sm text-[#174f46]">
              <span className="font-bold">Tip:</span> {part.tip}
            </p>
          </>
        ) : (
          <p className="text-stone-600">Pick a part on the trap to start.</p>
        )}
      </div>

      <p className="text-sm text-stone-600">
        {seenCount} of {TRAP_PARTS.length} parts explored
      </p>
    </>
  );
}
