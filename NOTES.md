# Notes

Included in this document are my working notes on how this take home test
has been put together and why. Read top to bottom and you'll have toured 
the whole codebase within one file. Magic! Every file I've touched also has 
comments saying the same things right where they apply.

## The big picture

Three kinds of files:

- **Words** (`src/content/`): this file has every everything the learner reads. 
No React, no logic - pretty much all content except one small function that 
figures out which zone a tap landed in.
- **Decisions** (`src/lib/`): "given what the learner has done, what should
  the drawing show?" These are plain functions you can test (without a browser).
- **Things you see** (`src/components/`): the page, the steps, the drawing. All
of the actual interactive content.

How a render works:

1. `Lesson.tsx` holds all of the content the learner has covered (step, parts seen, bait,
   checklist, answers).
2. It calls `getTrapState()` to turn that into a description of the picture.
3. `TrapDiagram` draws that description.
4. The current step's file shows the text and buttons.

Nothing about the picture is stored. It's worked out fresh every time, so it
can't drift out of sync with what the learner has done.

## src/content/lesson.ts

Every word in the lesson, so wording changes never touch UI code.

- **STEPS**: the nine steps in order. This includes all aptions, paw prints, field notes and
  the Next button which all key off these ids.
- **StepId**: this is built automatically from STEPS. Because captions and field notes
  use it, TypeScript has a lot to say if a step is missing either one.
- **CAPTIONS**: "Fig. 3." style captions under the drawing are taken care of here, like a textbook.
- **FIELD_NOTES**: the yellow sticky notes. Conversational real-world tips that are informative and nice to  know but not needed to move on, so the main text stays short n snappy.
- **NEXT_HINTS**: what to say next to help move on past a grayed-out Next button.
- **RESULT_HEADINGS**: the bold "Nice." / "Not quite." line on top of a result.
  The Feedback boxes and the phone result panel both read it, so they match.
  Explanations don't open with "Yes." because the heading already says it.
- **TRAP_PARTS**: the five tappable parts. `what` it does, plus a `tip`.
- **BAIT_ZONES**: back / plate / door / outside, each with an explanation.
  The wrong answers are where the learning happens, so they get real reasons.
- **zoneForPoint**: turns a tap into a zone. Named constants for the trap
  walls and plate edges, then three plain `if`s.
- **BAIT_FALLBACK**: the same zones as buttons, for keyboard and screen
  reader users who can't tap a picture.
- **MEET_TOOTIE, SETUP_TASKS, CAUGHT_SCENARIO, AFTER_STEPS**: copy for those steps.
- **RECAP_QUESTIONS**: the three "Check yourself" questions, pulled from
  different earlier steps. The right answer is in a different position each
  time so you can't just guess the pattern.
- **YOUR_TURN**: the real-world ending. Get certified (that's what unlocks
  discounted spay/neuter), book a clinic spot before you trap because the
  free and low-cost ones go fast, and have a backup vet.

`lesson.test.ts` checks the zone edges and that the content can't break: one
right answer per question, feedback on every answer, fallback spots in the
right zones.

## src/lib/trapState.ts

The "what should the picture show?" file.

- **TrapState**: the description the drawing reads: door open, newspaper,
  towel, sheet, bowl position, tap mark, where Tootie is, ear tip, SNAP, which
  part glows.
- **YARD_SCENE / EMPTY_TRAP_SCENE**: two starting pictures. Each step starts
  from one and changes a few things.
- **getTrapState**: one `if` per step, top to bottom in lesson order. Easy to
  find "what does the Set it step show?"
- **getBowlX**: where the food bowl goes, nudged inward so it never pokes
  through the cage.
- **describeTrap**: the picture in words for screen readers. Updates whenever
  the picture does.

`trapState.test.ts` walks through the lesson like a learner would.

## src/components/Lesson.tsx

The main component, split into labeled sections:

- **What the learner has done so far**: plain `useState`s, one per thing.
- **Moving focus**: on a new step, scroll to the top and put keyboard focus on
  the heading, so screen reader and keyboard users know the page changed.
  Skipped on first load.
- **Right or wrong?**: worked out fresh each render, never stored.
- **Things the learner can do**: one small named function per action
  (goNext, selectPart, tapTrap, stepBackAndWait, startOver...).
- **The page**: header with paws, the drawing as a captioned figure, the step
  text with a field note, and Back/Next pinned to the bottom. On desktop the
  drawing is on the left with the text and field note on the right. On phones
  it's stacked, with the field note at the bottom (tablets keep it in the margin).
  On really short screens the nav unpins so it doesn't cover the trap.
  On phones and tablets the header squeezes onto one small line so the trap
  starts near the top, and results show in the ResultPanel above Back/Next.
- **getPanelResult**: what the result panel says for whatever the learner
  just did on this step. Headings come from RESULT_HEADINGS.
- **canMoveOn**: a `switch` saying what each step needs before Next unlocks.
  You have to do the thing, but never get it right on the first try.

## src/components/steps/

One file per step, named after it. Each one just shows that page's text and
buttons, and reports back what the learner did. Things worth knowing:

- **BaitStep**: has the keyboard-friendly buttons for the three food spots.
- **SetStep**: checklist in any order (like real life), then "Step back and
  wait." Checkboxes lock once Tootie is on her way.
- **CaughtStep / CheckStep**: native radio buttons, so arrow keys work for
  free. Each answer shows a Feedback box (on phones and tablets, in the
  ResultPanel instead).
- **TurnStep**: the link opens in a new tab and says so for screen readers.

## src/components/drawing/

- **TrapDiagram**: draws the trap or the yard from a TrapState. SVG draws in
  order, later on top: ground, yard or floor stuff, Tootie, the cage over her,
  towels, then tap marks. Small pieces (Ground, Yard, Cage, Door, Newspaper)
  are their own little functions at the bottom of the file.
- **Tapping**: the browser gives screen coordinates, `getScreenCTM()` turns
  them into drawing coordinates, so taps are accurate at any size.
- **Fit to height**: the drawing's width is capped by screen height so the
  whole trap fits on a phone held sideways.
- **Tootie**: drawn facing left (into the trap), flipped in the yard to face
  her food. The name tag isn't flipped so the text reads right.
- **PartMarkers**: real `<button>`s on top of the drawing, so keyboard, touch
  and screen readers just work. 44px, and placed so none overlap on a 320px phone.
- **TapMark, SnapBurst, Bowl**: small single-purpose drawings. The SNAP star
  is a hardcoded list of points, no math.

## src/components/ui/

- **Feedback**: green/right or red/wrong box. Color plus ✓/✕ plus words, so
  it doesn't rely on color. It's a live region so screen readers announce it.
  Hidden visually on phones and tablets (the ResultPanel shows it there), but
  screen readers still hear it, so each result is announced exactly once.
- **ResultPanel**: Duolingo-style panel that slides up from the Back/Next bar
  on phones and tablets: ✓/✕ heading, the first sentence, the rest behind
  "More", and a close button. Not a live region on purpose, so nothing gets
  read out twice. Appears without sliding when reduce motion is on.
- **FieldNote**: the sticky note. Tilted 1° because straight looks fake.
- **PawProgress**: paw prints with hidden text ("Completed: Meet Tootie") for
  screen readers.
- **ReadAloud**: uses the browser's built-in speech, no API. Stops when you
  change steps. Shows a note instead if the browser can't do it.
- **Stamp**: says "Trapper in Training," not "Certified," because the lesson
  tells you to go get real certification.

## src/app/

- **globals.css**: the palette (warm paper, brown ink, pine, mustard, tomato,
  all checked for WCAG AA contrast), the animations, and the reduce-motion
  rules that turn them all off.
- **layout.tsx**: fonts come from npm and get bundled, so nothing loads from
  Google and the build works offline.
