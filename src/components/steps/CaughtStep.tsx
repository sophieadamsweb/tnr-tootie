import { CAUGHT_SCENARIO, RESULT_HEADINGS } from "@/content/lesson";
import { Feedback } from "../ui/Feedback";

// Step 6: the door just dropped and Tootie is freaking out. What do you do?
// The wrong answers are the instinctive ones (check on them, comfort them),
// which is exactly why this is worth practicing.
type Props = {
  choice: string | null;
  onChoose: (choiceId: string) => void;
};

export function CaughtStep({ choice, onChoose }: Props) {
  const chosen = CAUGHT_SCENARIO.choices.find((c) => c.id === choice);

  let result: "right" | "wrong" | null = null;
  let heading: string | undefined;
  if (chosen && chosen.correct) {
    result = "right";
    heading = RESULT_HEADINGS.caught.right;
  }
  if (chosen && !chosen.correct) {
    result = "wrong";
    heading = RESULT_HEADINGS.caught.wrong;
  }

  return (
    <>
      <p>{CAUGHT_SCENARIO.prompt}</p>

      <fieldset className="space-y-2">
        <legend className="sr-only">Choose what to do</legend>
        {CAUGHT_SCENARIO.choices.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-stone-300 p-3 has-[:checked]:border-ink"
          >
            <input
              type="radio"
              name="caught"
              className="mt-1 h-5 w-5 accent-pine"
              checked={choice === option.id}
              onChange={() => onChoose(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <Feedback result={result} heading={heading} emptyText="Nothing yet. Give it a try.">
        {chosen && <p>{chosen.feedback}</p>}
      </Feedback>
    </>
  );
}
