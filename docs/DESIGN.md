# Design notes

The long version of the README: why I picked this topic, how the lesson teaches, how the code is organized, and how I tested it. File-by-file notes are in [NOTES.md](../NOTES.md).

## Why this topic

Growing up in NYC meant seeing community cats everywhere, and caring for them is unavoidable (at least for me!). It becomes very clear quickly that accessible care is hard to access for these animals, and they usually get the short end of the stick because of it. I quickly got TNR certified and started to tackle the cat colonies in my own neighborhood. The first time I set a trap I had a lot of questions nobody had answered for me: where does the food go, what do I do when it snaps shut and the cat is losing it, why is everyone covering their traps with towels/sheets. A lot of this information is presented very plainly or even outdated, therefore it's hard to consume and not very engaging. 

It's a real skill with a physical tool, a sequence that matters, and a couple of moments where your instinct is exactly wrong. That makes it a perfect fit for a short interactive lesson, and this is actually something I'd genuinely use for outreach.

## The lesson

Nine short steps. Each one asks you to do one thing!

| # | Step | What you do |
|---|------|-------------|
| 1 | Meet Tootie | Meet the cat you've been feeding. She isn't fixed, you care about her, so what's next? |
| 2 | Why we trap | What TNR is and why it starts with getting the cat into a trap. |
| 3 | Meet the trap | The trap is our best friend here. Tap the numbered parts to learn what each one does. Explore three to move on. |
| 4 | Bait it | Tap anywhere inside the trap to drop the food. A green ✓ or red ✕ lands where you tapped, and each wrong spot explains why it fails. |
| 5 | Set it | Actually setting the trap: line the floor, cover the back, hook the door, then step back and watch Tootie walk in. SNAP!! |
| 6 | You caught one | Tootie is thrashing. This is stressful and scary, what do you do first? |
| 7 | What happens next | The meat and potatoes. Tootie's trip to the clinic, recovery, ear tip, then back home. |
| 8 | Check yourself | Three quick questions pulled from earlier steps. |
| 9 | Your turn | How to go from this lesson to a real trap: certification, clinic spots, a backup vet. |

## How it teaches

The order is on purpose:

1. **Hook.** Start with a cat you care about, not equipment. Most people get into TNR because of one specific cat.
2. **Concept.** A short "why" so the rest has a point.
3. **Explore.** Poke at the trap before you're asked to use it.
4. **Practice.** Make real decisions (where the food goes, how to set it) and see the result on the trap.
5. **Scenario.** The panicky moment, where the instinctive answers (check on them, comfort them) are the wrong ones.
6. **Recall.** A short quiz mixing earlier steps. Pulling an answer out of memory makes it stick way better than rereading.
7. **Transfer.** Concrete next steps for doing it for real.

Wrong answers never block you or cost you anything. They explain *why* it's wrong and let you try again. Next only unlocks once you've done the thing, so you can't click through without engaging, but there are no scores, timers or penalties.

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # page shell + fonts (bundled from npm, no Google requests)
│   ├── page.tsx                # renders <Lesson />, that's it
│   └── globals.css             # colors, fonts, animations, reduce-motion rules
├── content/
│   ├── lesson.ts               # every word in the lesson, plus "which zone did you tap?"
│   └── lesson.test.ts          # makes sure the content can't break (one right answer, etc.)
├── lib/
│   ├── trapState.ts            # "what should the drawing show right now?" Plain functions, no React
│   └── trapState.test.ts       # tests that read like the lesson: yard, bait, snap, home
└── components/
    ├── Lesson.tsx              # remembers what you've done, picks the step, lays out the page
    ├── steps/                  # one file per step: the text and buttons for that page
    │   ├── MeetStep.tsx
    │   ├── WhyStep.tsx
    │   ├── PartsStep.tsx
    │   ├── BaitStep.tsx
    │   ├── SetStep.tsx
    │   ├── CaughtStep.tsx
    │   ├── AfterStep.tsx
    │   ├── CheckStep.tsx
    │   └── TurnStep.tsx
    ├── drawing/                # the picture at the top of every step
    │   ├── TrapDiagram.tsx     # the trap (or yard), drawn from a simple description
    │   ├── Tootie.tsx
    │   ├── PartMarkers.tsx     # the numbered buttons on "Meet the trap"
    │   ├── TapMark.tsx         # the ✓ / ✕ where you tapped
    │   ├── SnapBurst.tsx
    │   ├── Bowl.tsx
    │   └── colors.ts
    └── ui/                     # small reusable bits
        ├── Feedback.tsx        # green right / red wrong explanation box
        ├── FieldNote.tsx       # the yellow sticky note
        ├── PawProgress.tsx     # paw print progress
        ├── ReadAloud.tsx
        ├── ResultPanel.tsx     # phones/tablets: the result slides up above Back/Next
        └── Stamp.tsx
docs/
├── preview.png                 # screenshot for the README
└── DESIGN.md                   # this file
NOTES.md                        # my working notes: every file, what it does and why
```

The idea: **words** live in `content/`, **decisions** live in `lib/`, and **things you see** live in `components/`. Each file does one job, and you can read any of them top to bottom without needing the others open. I wanted this to be almost ELI5 in every aspect - I could put this down and anyone could pick it up.

## How it works

1. `Lesson.tsx` here we keep track of what you've done: which step you're on, which parts you've tapped, where you dropped the food, your checklist and your answers. 
2. Every time something changes, it asks `getTrapState()` in `lib/trapState.ts`: "given all that, what should the picture show?" That returns a plain description like *door open, towel on, Tootie outside*.
3. `TrapDiagram` here we draw exactly that description. It never needs to know which step you're on thanks to everything we've done above to prepare.
4. The current step's file in `steps/` shows the text and buttons for that page.

Since the picture is always worked out fresh from what you've already accomplished, it's less likely to get out of sync. Seeing the wrong content / a misconfigured state can take you out of the experience, so I wanted to avoid that at all costs. Go back three steps and forward again - the trap still has your newspaper, towel and bowl in the right place. 

A few other details:
- **Tapping the trap.** The browser tells us where on the *screen* you tapped; `getScreenCTM()` converts that to where in the *drawing* you tapped, so it's accurate at any screen size. `zoneForPoint()` then says back / plate / door / outside. This adds a layer of interactivity that feels genuine - much nicer than clicking predetermined points.
- **Content is data.** All copy, questions, feedback and captions live in `lesson.ts`. Changing wording or adding a question doesn't touch any UI code, and TypeScript complains if a step is missing its caption or field note. In theory multiple people could be working on this together without stepping on any toes.
- **Boring on purpose.** Plain `if` statements over clever one-liners, one component per file, and a comment on everything explaining what it's for. Again my goal for all of this was something easy to understand, it should be possible for anyone to pick up and run with it.

## Accessibility

- Every interactive thing is a real `<button>`, checkbox or radio, so keyboard, touch and screen readers all work. The part markers are buttons layered over the SVG, not clickable shapes inside it.
- Tap-anywhere has a keyboard equivalent: the same three zones as buttons under the drawing.
- The drawing has a text description that updates as the trap changes ("the door is propped open, food is at the back...").
- Moving between steps sends focus to the new heading, so screen reader and keyboard users start at the top.
- Feedback is announced through live regions, and right/wrong uses ✓/✕ plus text, not just color.
- On phones and tablets the result of a tap slides up in a panel above Back/Next, so you never scroll to see how you did. The feedback box in the page is only hidden visually there, and the panel isn't a live region, so screen readers hear each result once, not twice. The panel has a close button, and with reduced motion on it just appears.
- Text and UI colors meet WCAG AA contrast.
- Animations (cat walk, door snap, pulses) turn off with `prefers-reduced-motion`.
- **Read aloud** button on every step, using the browser's built-in speech. Helpful for dyslexic learners, ESL folks, or anyone who'd rather listen.
- On short screens (phone sideways, 200% zoom) the drawing scales to fit and the nav unpins so it doesn't cover the trap.

## Testing

- **Unit tests** (`npm test`, 20 tests):
  - `zoneForPoint` including the exact edges of the trip plate.
  - `getTrapState` walking through the lesson: yard, bait, door open, snap, covered, home with an ear tip.
  - Content checks: exactly one right answer per question, every answer has feedback, the keyboard fallback spots land in the zones they claim. These matter because the copy is meant to be edited by people who aren't devs.
- **Manual + automated QA** before submitting:
  - Ran the full lesson at 9 screen sizes, from a 320px phone to 1920px desktop, including landscape and 200% zoom.
  - Completed it keyboard-only.
  - Ran it with reduced motion on.
  - Ran an axe accessibility scan (WCAG 2.2 AA + best practices): 0 automated violations detected.
  - Tried edge cases: taps right on zone borders, Back mid-animation, double-clicking, spamming Next, and Start over fully resetting.

## Decisions and tradeoffs

- **One page at a time, like a field guide.** Each step is a single "page" with the drawing as a captioned figure, short text, and a field note for extra real-world tips. On desktop the drawing is on the left with the text and field note on the right; on phones it's stacked, drawing on top and the field note at the bottom. I took inspiration from one of my favorite childhood textbooks - Joy Hakim's *A History of US* and DK-style labeled diagrams: friendly enough to feel like a kids' book, plain enough to stay readable. 
- **Learn by doing.** Interactive steps ask learners to act on the trap, which reflects what they've done.
- **Free placement over multiple choice.** Dropping the food anywhere makes it a real decision instead of picking from three answers. The tradeoff is it doesn't work without a pointer, hence the button fallback.
- **A character instead of "the cat."** Tootie gives you someone to care about and turns nine steps into one story.
- **Single page, local state.** No routing, no persistence, no state library. Everything lives in plain `useState` in one place, and each step is its own small file. Reloading starts you over.
- **Fonts bundled from npm.** Fraunces and Nunito come from `@fontsource`, so the build works offline and nothing third-party loads at runtime.
- **Light theme only.** A warm paper palette fit the field guide idea better than supporting dark mode in the time I had.
