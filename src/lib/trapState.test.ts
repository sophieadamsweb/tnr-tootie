// Tests for "what should the drawing show?" These read like a story of the
// lesson: yard, empty trap, bait, set, caught, home again.
import { describe, expect, it } from "vitest";
import { describeTrap, getBowlX, getTrapState, type LessonProgress } from "./trapState";

// A learner who hasn't done anything yet. Each test changes what it needs.
const fresh: LessonProgress = {
  step: "meet",
  activePart: null,
  bait: null,
  setup: { newspaper: false, cover: false, doorSet: false },
  phase: "idle",
  coveredTheTrap: false,
};

describe("getTrapState", () => {
  it("starts in the yard with no trap", () => {
    const scene = getTrapState(fresh);
    expect(scene.showTrap).toBe(false);
    expect(scene.cat).toBe("yard");
  });

  it("highlights the part you tapped on Meet the trap", () => {
    const scene = getTrapState({ ...fresh, step: "parts", activePart: "rod" });
    expect(scene.highlight).toBe("rod");
  });

  it("drops the bowl and shows a check for a tap at the back", () => {
    const scene = getTrapState({ ...fresh, step: "bait", bait: { x: 100, y: 200, zone: "back" } });
    expect(scene.bowlX).toBe(100);
    expect(scene.tapMark?.isRight).toBe(true);
  });

  it("shows an X for a tap by the door", () => {
    const scene = getTrapState({ ...fresh, step: "bait", bait: { x: 470, y: 200, zone: "door" } });
    expect(scene.tapMark?.isRight).toBe(false);
  });

  it("opens the door once it's hooked, and slams it when the trap trips", () => {
    const setup = { newspaper: true, cover: true, doorSet: true };
    const ready = getTrapState({ ...fresh, step: "set", setup });
    expect(ready.doorOpen).toBe(true);
    expect(ready.cat).toBe("outside");

    const tripped = getTrapState({ ...fresh, step: "set", setup, phase: "tripped" });
    expect(tripped.doorOpen).toBe(false);
    expect(tripped.cat).toBe("inside");
    expect(tripped.snap).toBe(true);
  });

  it("covers the whole trap only after the right answer", () => {
    expect(getTrapState({ ...fresh, step: "caught" }).fullyCovered).toBe(false);
    expect(getTrapState({ ...fresh, step: "caught", coveredTheTrap: true }).fullyCovered).toBe(true);
  });

  it("sends Tootie home with an ear tip at the end", () => {
    for (const step of ["after", "check", "turn"] as const) {
      const scene = getTrapState({ ...fresh, step });
      expect(scene.cat).toBe("yard");
      expect(scene.earTipped).toBe(true);
    }
  });
});

describe("getBowlX", () => {
  it("has no bowl without bait, or with a tap outside the trap", () => {
    expect(getBowlX(null)).toBe(null);
    expect(getBowlX({ x: 580, y: 260, zone: "outside" })).toBe(null);
  });

  it("keeps the bowl inside the cage walls", () => {
    expect(getBowlX({ x: 62, y: 200, zone: "back" })).toBe(84);
    expect(getBowlX({ x: 538, y: 200, zone: "door" })).toBe(516);
  });
});

describe("describeTrap", () => {
  it("describes what a sighted learner would see", () => {
    const scene = getTrapState({
      ...fresh,
      step: "set",
      bait: { x: 100, y: 200, zone: "back" },
      setup: { newspaper: true, cover: true, doorSet: true },
    });
    const text = describeTrap(scene);
    expect(text).toContain("The door is propped open.");
    expect(text).toContain("Food is placed at the back");
    expect(text).toContain("A towel covers the back half.");
  });
});
