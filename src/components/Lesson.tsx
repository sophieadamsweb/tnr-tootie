"use client";

import { useEffect, useRef, useState } from "react";
import {
  BAIT_ZONES,
  CAPTIONS,
  CAUGHT_SCENARIO,
  FIELD_NOTES,
  NEXT_HINTS,
  RECAP_QUESTIONS,
  RESULT_HEADINGS,
  STEPS,
  TRAP_PARTS,
  zoneForPoint,
  type SetupId,
  type StepId,
  type TrapPartId,
} from "@/content/lesson";
import { describeTrap, getTrapState, type BaitPick, type SetupChecklist, type TrapPhase } from "@/lib/trapState";
import { PartMarkers } from "./drawing/PartMarkers";
import { TrapDiagram } from "./drawing/TrapDiagram";
import { AfterStep } from "./steps/AfterStep";
import { BaitStep } from "./steps/BaitStep";
import { CaughtStep } from "./steps/CaughtStep";
import { CheckStep } from "./steps/CheckStep";
import { MeetStep } from "./steps/MeetStep";
import { PartsStep } from "./steps/PartsStep";
import { SetStep } from "./steps/SetStep";
import { TurnStep } from "./steps/TurnStep";
import { WhyStep } from "./steps/WhyStep";
import { FieldNote } from "./ui/FieldNote";
import { PawProgress } from "./ui/PawProgress";
import { ReadAloud } from "./ui/ReadAloud";
import { ResultPanel, type PanelResult } from "./ui/ResultPanel";

// The whole lesson lives here: it remembers what you've done, decides what
// the drawing shows, and lays out the page. Each step's text and buttons live
// in their own file in ./steps.

const EMPTY_CHECKLIST: SetupChecklist = { newspaper: false, cover: false, doorSet: false };

export function Lesson() {
  // ---------------------------------------------------------------------------
  // What the learner has done so far
  // ---------------------------------------------------------------------------
  const [stepIndex, setStepIndex] = useState(0); // 0 = first step
  const [seenParts, setSeenParts] = useState<TrapPartId[]>([]); // parts tapped on "Meet the trap"
  const [activePart, setActivePart] = useState<TrapPartId | null>(null); // the part being read about right now
  const [bait, setBait] = useState<BaitPick | null>(null); // where they dropped the food
  const [setup, setSetup] = useState<SetupChecklist>(EMPTY_CHECKLIST); // the "Set it" checklist
  const [phase, setPhase] = useState<TrapPhase>("idle"); // idle, walking, or tripped
  const [caughtChoice, setCaughtChoice] = useState<string | null>(null); // answer on "You caught one"
  const [recapAnswers, setRecapAnswers] = useState<Record<string, string>>({}); // answers on "Check yourself"
  const [lastRecapQuestion, setLastRecapQuestion] = useState<string | null>(null); // the question answered most recently
  const [panelOpen, setPanelOpen] = useState(false); // is the result panel showing? (phones and tablets only)

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  // ---------------------------------------------------------------------------
  // Moving focus when the step changes
  // ---------------------------------------------------------------------------
  // When you go to a new step, jump to the top and put keyboard focus on the
  // new heading. Otherwise keyboard and screen reader users would be left on
  // the Next button, with no clue the page changed. We skip this on the very
  // first load so the page doesn't grab focus as soon as it opens.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // the step's text, for Read aloud
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  // ---------------------------------------------------------------------------
  // Right or wrong? Worked out fresh every time, never stored.
  // ---------------------------------------------------------------------------
  const baitZone = BAIT_ZONES.find((zone) => zone.id === bait?.zone);
  const baitIsRight = baitZone?.correct === true;

  const caughtAnswer = CAUGHT_SCENARIO.choices.find((choice) => choice.id === caughtChoice);
  const caughtIsRight = caughtAnswer?.correct === true;

  const recapRightCount = countRightRecapAnswers(recapAnswers);

  // What the result panel should say right now (null = nothing to show)
  const panelResult = getPanelResult(step.id, {
    activePart,
    baitZoneId: bait?.zone ?? null,
    caughtChoice,
    lastRecapQuestion,
    recapAnswers,
  });

  const canGoNext = canMoveOn(step.id, {
    seenPartsCount: seenParts.length,
    baitIsRight,
    trapTripped: phase === "tripped",
    caughtIsRight,
    recapAllRight: recapRightCount === RECAP_QUESTIONS.length,
  });

  // What the drawing should show (see src/lib/trapState.ts)
  const scene = getTrapState({
    step: step.id,
    activePart,
    bait,
    setup,
    phase,
    coveredTheTrap: caughtIsRight,
  });

  // ---------------------------------------------------------------------------
  // Things the learner can do
  // ---------------------------------------------------------------------------
  // Changing steps also closes the result panel, so an old result never
  // shows up on a new step.
  function goNext() {
    setStepIndex(stepIndex + 1);
    setPanelOpen(false);
  }

  function goBack() {
    setStepIndex(stepIndex - 1);
    setPanelOpen(false);
  }

  // Every action below that gives a result also opens the result panel.
  // If it's already open, it just swaps in the new result.
  function selectPart(part: TrapPartId) {
    setActivePart(part);
    setPanelOpen(true);
    if (!seenParts.includes(part)) {
      setSeenParts([...seenParts, part]);
    }
  }

  // Tapping the drawing on the "Bait it" step drops the food there.
  function tapTrap(x: number, y: number) {
    pickBait({ x, y, zone: zoneForPoint(x, y) });
  }

  // Dropping the food, from a tap on the drawing or one of the spot buttons.
  function pickBait(pick: BaitPick) {
    setBait(pick);
    setPanelOpen(true);
  }

  function chooseCaught(choiceId: string) {
    setCaughtChoice(choiceId);
    setPanelOpen(true);
  }

  function toggleTask(task: SetupId, done: boolean) {
    setSetup({ ...setup, [task]: done });
  }

  // "Step back and wait": Tootie walks in, and 1.6 seconds later the door drops.
  // If the learner's device asks for reduced motion, there's no walk to watch,
  // so we skip straight to the door being shut.
  function stepBackAndWait() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setPhase("tripped");
      return;
    }
    setPhase("walking");
    window.setTimeout(() => setPhase("tripped"), 1600);
  }

  function answerRecap(questionId: string, choiceId: string) {
    setRecapAnswers({ ...recapAnswers, [questionId]: choiceId });
    setLastRecapQuestion(questionId);
    setPanelOpen(true);
  }

  // Wipe everything and go back to step 1. Tootie walks back to her yard.
  function startOver() {
    setStepIndex(0);
    setSeenParts([]);
    setActivePart(null);
    setBait(null);
    setSetup(EMPTY_CHECKLIST);
    setPhase("idle");
    setCaughtChoice(null);
    setRecapAnswers({});
    setLastRecapQuestion(null);
    setPanelOpen(false);
  }

  // ---------------------------------------------------------------------------
  // The page
  // ---------------------------------------------------------------------------
  let caption = CAPTIONS[step.id];
  if (step.id === "set" && phase === "tripped") caption = "Snap. The door drops and locks.";

  return (
    // On big screens (lg, 1024px and up) the page gets wider so the drawing
    // and the words can sit side by side. Phones and tablets stay stacked.
    <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-3 sm:px-6 lg:max-w-6xl lg:pt-6 [@media(max-height:500px)]:pb-0">
      {/* On phones and tablets the header is squeezed onto one small line
          (paws next to it, or just under it) so the trap starts near the top
          of the screen. Big screens get the full-size two-line version. */}
      <header className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:mb-4 lg:items-end lg:gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 lg:block">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tomato lg:text-sm">
            TNR Basics<span className="max-sm:hidden"> · A field guide</span>
          </p>
          <h1 className="font-display text-2xl font-black leading-tight lg:text-4xl">Catching the Cat</h1>
        </div>
        <PawProgress stepIndex={stepIndex} />
      </header>

      {/* On phones and tablets: drawing on top, words underneath.
          On big screens: drawing on the left, words on the right, so when you
          tap the drawing the result shows up right next to it.
          (overflow-clip, not overflow-hidden, because hidden would stop the
          drawing from sticking in place while you scroll.) */}
      <article className="overflow-clip rounded-2xl border-[2.5px] border-ink bg-card shadow-[6px_6px_0_0_var(--ink)] lg:grid lg:grid-cols-2">
        {/* The drawing, like a figure in a textbook, with a caption under it.
            On big screens it sticks to the top of the screen, so it stays in
            view when a step has lots of text (like "Check yourself"). */}
        <figure className="border-b-[2.5px] border-ink bg-[#fffaf0] px-3 pb-3 pt-3 sm:px-6 lg:sticky lg:top-4 lg:self-start lg:border-b-0 lg:py-6">
          <TrapDiagram
            scene={scene}
            description={describeTrap(scene)}
            onTap={step.id === "bait" ? tapTrap : undefined}
            canPetTootie={step.id === "meet" || step.id === "turn"}
          >
            {step.id === "parts" && (
              <PartMarkers seenParts={seenParts} activePart={activePart} onSelect={selectPart} />
            )}
          </TrapDiagram>
          <figcaption className="mt-2 font-display text-sm italic text-stone-700">
            <span className="font-bold not-italic">Fig. {stepIndex + 1}.</span> {caption}
          </figcaption>
        </figure>

        {/* The words. On tablets the field note sits in the margin. On phones,
            and on big screens where this is the right-hand column, it drops
            below the text. */}
        <div className="grid content-start gap-6 p-5 sm:p-6 md:grid-cols-[1fr_13rem] lg:grid-cols-1 lg:border-l-[2.5px] lg:border-ink">
          <section aria-labelledby="step-heading">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-stone-600">
                Step {stepIndex + 1} of {STEPS.length}
              </p>
              {/* key={step.id} gives each step a fresh button, which also stops any reading in progress */}
              <ReadAloud key={step.id} title={step.title} contentRef={contentRef} />
            </div>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-3xl font-black outline-none">
              {step.title}
            </h2>

            <div ref={contentRef} className="mt-4 space-y-4 text-[1.05rem] leading-relaxed">
              {step.id === "meet" && <MeetStep />}
              {step.id === "why" && <WhyStep />}
              {step.id === "parts" && <PartsStep activePart={activePart} seenCount={seenParts.length} />}
              {step.id === "bait" && <BaitStep bait={bait} onPick={pickBait} />}
              {step.id === "set" && <SetStep setup={setup} phase={phase} onToggle={toggleTask} onStepBack={stepBackAndWait} />}
              {step.id === "caught" && <CaughtStep choice={caughtChoice} onChoose={chooseCaught} />}
              {step.id === "after" && <AfterStep />}
              {step.id === "check" && <CheckStep answers={recapAnswers} onAnswer={answerRecap} rightCount={recapRightCount} />}
              {step.id === "turn" && <TurnStep />}
            </div>
          </section>

          <FieldNote>{FIELD_NOTES[step.id]}</FieldNote>
        </div>
      </article>

      {/* Back and Next, stuck to the bottom of the screen so they're always in
          thumb reach. On really short screens (phone sideways, 200% zoom) a
          stuck bar would cover the trap, so there it just sits under the card.
          (The blur only turns on when the bar is stuck. On short screens it
          would also trap the result panel inside the bar.) */}
      <nav
        aria-label="Lesson navigation"
        className="fixed inset-x-0 bottom-0 z-10 border-t-[2.5px] border-ink bg-paper/95 [@media(max-height:500px)]:static [@media(max-height:500px)]:mt-4 [@media(max-height:500px)]:border-t-0 [@media(max-height:500px)]:bg-transparent [@media(min-height:501px)]:backdrop-blur"
      >
        {/* The result panel rides on top of this bar (phones and tablets only) */}
        {panelOpen && panelResult && <ResultPanel result={panelResult} onClose={() => setPanelOpen(false)} />}

        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:max-w-6xl">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="rounded-xl border-2 border-ink bg-card px-4 py-2.5 font-bold disabled:invisible"
          >
            Back
          </button>

          {/* When Next is grayed out, say why. A disabled button with no explanation is the worst. */}
          {!canGoNext && (
            <p id="next-hint" className="flex-1 text-center text-sm text-stone-700">
              {NEXT_HINTS[step.id]}
            </p>
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={startOver}
              className="rounded-xl border-2 border-ink bg-pine px-6 py-2.5 font-bold text-white shadow-[3px_3px_0_0_var(--ink)]"
            >
              Start over
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-describedby={canGoNext ? undefined : "next-hint"}
              className="rounded-xl border-2 border-ink bg-pine px-6 py-2.5 font-bold text-white shadow-[3px_3px_0_0_var(--ink)] disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none"
            >
              Next
            </button>
          )}
        </div>
      </nav>

      {/* Extra room at the bottom while the result panel is open, so the
          panel never hides the end of the page. Phones and tablets only. */}
      {panelOpen && panelResult && <div aria-hidden="true" className="h-[45svh] lg:hidden" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Can the learner move on from this step? You have to actually do the thing,
// but you never have to get it right on the first try. Wrong answers explain
// and let you try again.
function canMoveOn(
  stepId: StepId,
  progress: {
    seenPartsCount: number;
    baitIsRight: boolean;
    trapTripped: boolean;
    caughtIsRight: boolean;
    recapAllRight: boolean;
  },
): boolean {
  switch (stepId) {
    case "parts":
      return progress.seenPartsCount >= 3;
    case "bait":
      return progress.baitIsRight;
    case "set":
      return progress.trapTripped;
    case "caught":
      return progress.caughtIsRight;
    case "check":
      return progress.recapAllRight;
    default:
      return true; // reading-only steps
  }
}

// How many "Check yourself" questions are currently answered correctly.
function countRightRecapAnswers(answers: Record<string, string>): number {
  let count = 0;
  for (const question of RECAP_QUESTIONS) {
    const picked = question.choices.find((choice) => choice.id === answers[question.id]);
    if (picked?.correct) count++;
  }
  return count;
}

// What the result panel should say, for whatever the learner just did on this
// step. Returns null when there's nothing to show yet.
function getPanelResult(
  stepId: StepId,
  done: {
    activePart: TrapPartId | null;
    baitZoneId: string | null;
    caughtChoice: string | null;
    lastRecapQuestion: string | null;
    recapAnswers: Record<string, string>;
  },
): PanelResult | null {
  // Meet the trap: no right or wrong, just what the part does, with the tip behind "More"
  if (stepId === "parts") {
    const part = TRAP_PARTS.find((p) => p.id === done.activePart);
    if (!part) return null;
    return {
      id: part.id,
      tone: "info",
      heading: part.name,
      text: part.what,
      extra: (
        <p className="text-sm">
          <span className="font-bold">Tip:</span> {part.tip}
        </p>
      ),
    };
  }

  // Bait it
  if (stepId === "bait") {
    const zone = BAIT_ZONES.find((z) => z.id === done.baitZoneId);
    if (!zone) return null;
    if (zone.correct) {
      return { id: zone.id, tone: "right", heading: `${RESULT_HEADINGS.bait.right} ${zone.label}`, text: zone.feedback };
    }
    return {
      id: zone.id,
      tone: "wrong",
      heading: `${RESULT_HEADINGS.bait.wrong} ${zone.label}`,
      text: zone.feedback,
      extra: <p className="text-sm">Try another spot.</p>,
    };
  }

  // You caught one
  if (stepId === "caught") {
    const chosen = CAUGHT_SCENARIO.choices.find((c) => c.id === done.caughtChoice);
    if (!chosen) return null;
    if (chosen.correct) {
      return { id: chosen.id, tone: "right", heading: RESULT_HEADINGS.caught.right, text: chosen.feedback };
    }
    return { id: chosen.id, tone: "wrong", heading: RESULT_HEADINGS.caught.wrong, text: chosen.feedback };
  }

  // Check yourself: whichever question was answered last
  if (stepId === "check") {
    const index = RECAP_QUESTIONS.findIndex((q) => q.id === done.lastRecapQuestion);
    if (index === -1) return null;
    const question = RECAP_QUESTIONS[index];
    const picked = question.choices.find((c) => c.id === done.recapAnswers[question.id]);
    if (!picked) return null;
    const label = `Question ${index + 1}`;
    if (picked.correct) {
      return { id: `${question.id}-${picked.id}`, tone: "right", label, heading: RESULT_HEADINGS.check.right, text: picked.feedback };
    }
    return { id: `${question.id}-${picked.id}`, tone: "wrong", label, heading: RESULT_HEADINGS.check.wrong, text: picked.feedback };
  }

  // Every other step has nothing to tap for a result
  return null;
}
