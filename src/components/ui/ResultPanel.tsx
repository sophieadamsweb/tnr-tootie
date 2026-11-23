import { useState } from "react";
import { STYLES } from "./Feedback";

// The result panel that slides up from the Back/Next bar on phones and
// tablets, like Duolingo's. When you tap the drawing or pick an answer, the
// result shows up right above your thumb, so you never have to scroll to
// find out how you did.
//
// It's only for eyes. Screen readers already hear the result from the
// Feedback box in the step (still there, just hidden on small screens), so
// this panel is NOT a live region. If it were, every result would be read
// out twice.
//
// On big screens (lg and up) it's hidden: the drawing and the words sit side
// by side there, so the result is already right next to the drawing.

export type PanelResult = {
  id: string; // changes when there's a new result, which folds "More" back up
  tone: "right" | "wrong" | "info"; // green ✓, red ✕, or plain (Meet the trap)
  label?: string; // optional small line on top, e.g. "Question 2"
  heading: string; // the bold line, e.g. "Not quite. Toward the door"
  text: string; // the explanation. The first sentence shows, the rest is behind "More"
  extra?: React.ReactNode; // optional bit that goes behind "More" too, after the text
};

const INFO_STYLE = "border-ink bg-card text-ink";

type Props = {
  result: PanelResult;
  onClose: () => void;
};

export function ResultPanel({ result, onClose }: Props) {
  let look = INFO_STYLE;
  if (result.tone === "right") look = STYLES.right;
  if (result.tone === "wrong") look = STYLES.wrong;

  return (
    // Sits right on top of the Back/Next bar. On really short screens that
    // bar isn't stuck to the bottom, so the panel sticks to the bottom itself.
    <div
      className={`result-panel absolute inset-x-0 bottom-[calc(100%+2.5px)] border-t-[2.5px] lg:hidden [@media(max-height:500px)]:fixed [@media(max-height:500px)]:bottom-0 ${look}`}
    >
      {/* Never taller than about half the screen. If "More" has a lot to say, it scrolls. */}
      <div className="mx-auto flex max-h-[45svh] max-w-3xl items-start gap-3 overflow-y-auto px-4 py-3 sm:px-6">
        {/* key: a brand new result starts with "More" folded up again */}
        <PanelText key={result.id} result={result} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-current bg-card/60 text-lg font-bold"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}

// The words inside the panel, plus the "More" button.
function PanelText({ result }: { result: PanelResult }) {
  const [showMore, setShowMore] = useState(false);
  const { first, rest } = splitFirstSentence(result.text);
  const hasMore = rest !== "" || result.extra !== undefined;

  let symbol = "";
  if (result.tone === "right") symbol = "✓ ";
  if (result.tone === "wrong") symbol = "✕ ";

  return (
    <div className="min-w-0 flex-1">
      {result.label && <p className="text-xs font-extrabold uppercase tracking-[0.14em]">{result.label}</p>}
      <p className={result.tone === "info" ? "font-display text-lg font-bold" : "font-bold"}>
        <span aria-hidden="true">{symbol}</span>
        {result.heading}
      </p>
      <p className="mt-1">{first}</p>

      {showMore && (
        <div className="mt-2 space-y-2">
          {rest !== "" && <p>{rest}</p>}
          {result.extra}
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
          className="mt-1 min-h-11 font-bold underline underline-offset-4"
        >
          {showMore ? "Less" : "More"}
        </button>
      )}
    </div>
  );
}

// Cuts the explanation after its first sentence: "A. B. C." becomes "A." and "B. C."
function splitFirstSentence(text: string): { first: string; rest: string } {
  const end = text.indexOf(". ");
  if (end === -1) {
    return { first: text, rest: "" };
  }
  return { first: text.slice(0, end + 1), rest: text.slice(end + 2) };
}
