// Tests for the lesson content and the one bit of real logic in it.
// The content checks are here because the copy is meant to be edited by
// non-devs (hi, future TNR volunteers). If someone accidentally marks two
// answers right or none, these catch it before a learner does.
import { describe, expect, it } from "vitest";
import {
  BAIT_FALLBACK,
  BAIT_ZONES,
  CAPTIONS,
  CAUGHT_SCENARIO,
  FIELD_NOTES,
  RECAP_QUESTIONS,
  STEPS,
  zoneForPoint,
} from "./lesson";

describe("zoneForPoint", () => {
  it("puts taps in the right zone, back to front", () => {
    expect(zoneForPoint(100, 200)).toBe("back");
    expect(zoneForPoint(210, 200)).toBe("plate");
    expect(zoneForPoint(470, 200)).toBe("door");
  });

  it("handles the edges of the trip plate", () => {
    expect(zoneForPoint(157, 200)).toBe("back");
    expect(zoneForPoint(158, 200)).toBe("plate");
    expect(zoneForPoint(266, 200)).toBe("plate");
    expect(zoneForPoint(267, 200)).toBe("door");
  });

  it("treats anything outside the cage as outside", () => {
    expect(zoneForPoint(59, 200)).toBe("outside");
    expect(zoneForPoint(541, 200)).toBe("outside");
    expect(zoneForPoint(300, 69)).toBe("outside");
    expect(zoneForPoint(300, 237)).toBe("outside");
  });
});

describe("bait content", () => {
  it("has exactly one right answer, and it's the back", () => {
    const right = BAIT_ZONES.filter((z) => z.correct);
    expect(right.map((z) => z.id)).toEqual(["back"]);
  });

  it("keyboard fallback spots land in the zone they claim", () => {
    for (const f of BAIT_FALLBACK) expect(zoneForPoint(f.x, 200)).toBe(f.id);
  });

  it("every zone explains itself", () => {
    for (const z of BAIT_ZONES) expect(z.feedback.length).toBeGreaterThan(20);
  });
});

describe("questions", () => {
  const all = [CAUGHT_SCENARIO, ...RECAP_QUESTIONS];
  it("each has exactly one right answer", () => {
    for (const q of all) expect(q.choices.filter((c) => c.correct)).toHaveLength(1);
  });
  it("every choice has feedback, right or wrong", () => {
    for (const q of all) for (const c of q.choices) expect(c.feedback).toBeTruthy();
  });
  // The heading already says "Yes." with a ✓, and phones only show the first
  // sentence, so an explanation that opens with "Yes." would waste it.
  it("no explanation opens with a filler word like Yes. or Exactly.", () => {
    const explanations = BAIT_ZONES.map((z) => z.feedback);
    for (const q of all) for (const c of q.choices) explanations.push(c.feedback);
    for (const text of explanations) expect(text).not.toMatch(/^(Yes|Yep|Exactly|Correct|Right|Nope|No)\./);
  });
});

describe("steps", () => {
  it("every step has a caption and a field note", () => {
    for (const s of STEPS) {
      expect(CAPTIONS[s.id]).toBeTruthy();
      expect(FIELD_NOTES[s.id]).toBeTruthy();
    }
  });
});
