// The yellow sticky note in the margin with a piece of tape on top, like the
// side notes in an old history textbook. Extra real-world tips that are nice
// to know but not needed to move on.
//
// Tilted 1 degree on purpose: a perfectly straight sticky note looks fake.
export function FieldNote({ children }: { children: React.ReactNode }) {
  return (
    <aside
      aria-label="Field note"
      className="relative h-fit rotate-1 rounded-sm border-2 border-ink bg-[#fff3c4] p-4 pt-5 text-sm leading-relaxed shadow-[3px_3px_0_0_var(--ink)]"
    >
      {/* the tape */}
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 bg-[#e8d9b5]/90" />
      <p className="font-display text-base font-black italic text-tomato">Field note</p>
      <p className="mt-1">{children}</p>
    </aside>
  );
}
