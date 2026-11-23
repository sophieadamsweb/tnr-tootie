import { AFTER_STEPS } from "@/content/lesson";

// Step 7: what happens between the trap and home. Nothing to do here on
// purpose. You've done the hard part, so it's a calm read.
export function AfterStep() {
  return (
    <>
      <p>Tootie made it. Here&apos;s what happened between the trap and home:</p>
      <ol className="list-decimal space-y-2 pl-5">
        {AFTER_STEPS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="font-bold">Before you go, a quick check to see what stuck.</p>
    </>
  );
}
