// This file answers one question: "what should the drawing show right now?"
//
// It's plain functions, no React. You give it where the learner is and what
// they've done so far, and it gives back a simple description of the picture
// (door open? towel on? where's the cat?). The drawing component just draws
// whatever this says. Keeping it separate means it's easy to read and easy to test.

import { BAIT_ZONES, zoneForPoint, type BaitZoneId, type SetupId, type StepId, type TrapPartId } from "@/content/lesson";

// ---------------------------------------------------------------------------
// Shapes of the data
// ---------------------------------------------------------------------------

// Where the learner tapped to drop the food, and which zone that landed in.
export type BaitPick = {
  x: number;
  y: number;
  zone: BaitZoneId;
};

// The "Set it" checklist: one true/false per task.
export type SetupChecklist = Record<SetupId, boolean>;

// Where the trap is in its little story on the "Set it" step.
// idle = not sprung yet, walking = Tootie on her way in, tripped = door is down.
export type TrapPhase = "idle" | "walking" | "tripped";

// Everything we know about the learner's progress that affects the drawing.
export type LessonProgress = {
  step: StepId;
  activePart: TrapPartId | null;
  bait: BaitPick | null;
  setup: SetupChecklist;
  phase: TrapPhase;
  coveredTheTrap: boolean; // did they pick "cover the trap" on the "You caught one" step?
};

// Everything the drawing needs to know to draw itself.
export type TrapState = {
  showTrap: boolean; // false = we're in Tootie's yard, no trap in sight
  doorOpen: boolean;
  newspaper: boolean;
  backCovered: boolean; // towel over the back half
  fullyCovered: boolean; // sheet over the whole trap
  bowlX: number | null; // where the food bowl sits inside the trap, or null for no bowl
  tapMark: { x: number; y: number; isRight: boolean } | null; // the ✓ or ✕ where they tapped
  cat: "yard" | "outside" | "inside";
  earTipped: boolean;
  snap: boolean; // show the SNAP! burst
  highlight: TrapPartId | null; // which trap part glows yellow
};

// ---------------------------------------------------------------------------
// Starting scenes. Each step below starts from one of these and changes a few things.
// ---------------------------------------------------------------------------

// Tootie in her yard. No trap.
const YARD_SCENE: TrapState = {
  showTrap: false,
  doorOpen: false,
  newspaper: false,
  backCovered: false,
  fullyCovered: false,
  bowlX: null,
  tapMark: null,
  cat: "yard",
  earTipped: false,
  snap: false,
  highlight: null,
};

// An empty trap with the door closed. Tootie is off to the side, out of view.
const EMPTY_TRAP_SCENE: TrapState = {
  ...YARD_SCENE,
  showTrap: true,
  cat: "outside",
};

// ---------------------------------------------------------------------------
// The main function
// ---------------------------------------------------------------------------

export function getTrapState(progress: LessonProgress): TrapState {
  const { step, activePart, bait, setup, phase, coveredTheTrap } = progress;
  const bowlX = getBowlX(bait);

  if (step === "meet") {
    return YARD_SCENE;
  }

  if (step === "why") {
    return EMPTY_TRAP_SCENE;
  }

  if (step === "parts") {
    return { ...EMPTY_TRAP_SCENE, highlight: activePart };
  }

  if (step === "bait") {
    let tapMark = null;
    if (bait) {
      const zone = BAIT_ZONES.find((z) => z.id === bait.zone);
      tapMark = { x: bait.x, y: bait.y, isRight: zone?.correct === true };
    }
    return { ...EMPTY_TRAP_SCENE, bowlX, tapMark };
  }

  if (step === "set") {
    return {
      ...EMPTY_TRAP_SCENE,
      bowlX,
      newspaper: setup.newspaper,
      backCovered: setup.cover,
      doorOpen: setup.doorSet && phase !== "tripped",
      cat: phase === "idle" ? "outside" : "inside",
      snap: phase === "tripped",
    };
  }

  if (step === "caught") {
    return {
      ...EMPTY_TRAP_SCENE,
      bowlX: bowlX ?? 105, // they can't get here without good bait, but just in case
      newspaper: true,
      backCovered: true,
      cat: "inside",
      fullyCovered: coveredTheTrap,
    };
  }

  // "after", "check" and "turn": the clinic visit is done. Tootie is home with her ear tip.
  return { ...YARD_SCENE, earTipped: true };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Where the food bowl goes. No bait, or a tap outside the trap, means no bowl.
// Otherwise it goes where they tapped, nudged inward so it never pokes through
// the side of the cage.
export function getBowlX(bait: BaitPick | null): number | null {
  if (!bait) return null;
  if (bait.zone === "outside") return null;

  const LEFT_WALL = 84;
  const RIGHT_WALL = 516;
  if (bait.x < LEFT_WALL) return LEFT_WALL;
  if (bait.x > RIGHT_WALL) return RIGHT_WALL;
  return bait.x;
}

// Writes out what the drawing shows, in words, for screen readers. It updates
// every time the drawing does, so someone who can't see the picture still
// gets "the door is propped open, the food is at the back..."
export function describeTrap(t: TrapState): string {
  if (!t.showTrap) {
    if (t.earTipped) {
      return "Tootie, a gray cat, is back in the yard by the porch. The tip of one ear has a small flat notch, the ear tip.";
    }
    return "Tootie, a gray cat, sits in a yard next to a bowl of food and a dish of water, near the porch.";
  }

  const sentences = ["Side view of a wire box trap. The door is on the right, the back is on the left."];

  if (t.doorOpen) {
    sentences.push("The door is propped open.");
  } else {
    sentences.push("The door is closed.");
  }

  if (t.newspaper) {
    sentences.push("Newspaper lines the floor.");
  }

  if (t.bowlX !== null) {
    const zone = zoneForPoint(t.bowlX, 200);
    if (zone === "back") sentences.push("Food is placed at the back, past the trip plate.");
    if (zone === "plate") sentences.push("Food is placed on the trip plate.");
    if (zone === "door") sentences.push("Food is placed toward the door.");
  }

  if (t.fullyCovered) {
    sentences.push("The whole trap is covered with a sheet.");
  } else if (t.backCovered) {
    sentences.push("A towel covers the back half.");
  }

  if (t.cat === "inside") {
    sentences.push("Tootie is inside.");
  }

  return sentences.join(" ");
}
