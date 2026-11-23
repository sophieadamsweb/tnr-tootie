// The green "right" / red "wrong" box that explains an answer.
//
// It's a "live region": when the text inside changes, screen readers read it
// out automatically. Right and wrong are shown with a color AND a ✓ or ✕ AND
// words, so nobody has to rely on color alone.
//
// On phones and tablets the result shows up in the ResultPanel above the
// Back/Next bar instead, so this box is hidden there. It's only hidden from
// eyes, though ("sr-only"): screen readers still hear it, and it stays the
// ONE place each result is announced from.

type Result = "right" | "wrong" | null;

export const STYLES = {
  right: "border-[#15803d] bg-[#ecf8ef] text-[#14532d]",
  wrong: "border-[#be123c] bg-[#fdf0f2] text-[#881337]",
  empty: "border-transparent bg-stone-100 text-stone-600",
};

// Below lg (1024px) the box is visually hidden, but screen readers still get it.
const HIDE_ON_SMALL_SCREENS = "max-lg:sr-only";

type Props = {
  result: Result; // null means they haven't answered yet
  heading?: string; // optional bold line, e.g. "Not quite. Toward the door"
  children?: React.ReactNode; // the explanation
  emptyText?: string; // what to show before they answer (leave out to show nothing)
};

export function Feedback({ result, heading, children, emptyText }: Props) {
  // Before they answer: an empty live region (so it's ready to announce),
  // with optional placeholder text.
  if (result === null) {
    if (!emptyText) return <div role="status" aria-live="polite" />;
    return (
      <div role="status" aria-live="polite" className={`rounded-xl border-2 p-4 ${STYLES.empty} ${HIDE_ON_SMALL_SCREENS}`}>
        <p>{emptyText}</p>
      </div>
    );
  }

  const symbol = result === "right" ? "✓ " : "✕ ";
  return (
    <div role="status" aria-live="polite" className={`rounded-xl border-2 p-4 ${STYLES[result]} ${HIDE_ON_SMALL_SCREENS}`}>
      {heading && (
        <p className="font-bold">
          <span aria-hidden="true">{symbol}</span>
          {heading}
        </p>
      )}
      <div className={heading ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
