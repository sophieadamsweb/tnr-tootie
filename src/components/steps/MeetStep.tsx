import { MEET_TOOTIE } from "@/content/lesson";

// Step 1: meet Tootie. Just a story, no task. Starting with a cat you care
// about gives the whole lesson a reason before any equipment shows up.
export function MeetStep() {
  return (
    <>
      {MEET_TOOTIE.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p className="rounded-xl border-2 border-ink bg-[#fff3c4] p-3 font-bold">{MEET_TOOTIE.question}</p>
    </>
  );
}
