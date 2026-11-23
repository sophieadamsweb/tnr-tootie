import { RECAP_QUESTIONS, RESULT_HEADINGS } from "@/content/lesson";
import { Feedback } from "../ui/Feedback";

// Step 8: three quick questions from earlier steps. Trying to remember an
// answer makes it stick much better than reading a summary. Same rules as the
// rest of the lesson: wrong answers explain, and you can change your answer.
type Props = {
  answers: Record<string, string>; // question id -> chosen answer id
  onAnswer: (questionId: string, choiceId: string) => void;
  rightCount: number;
};

export function CheckStep({ answers, onAnswer, rightCount }: Props) {
  return (
    <>
      <p>Three quick ones from earlier. Get them all right to finish.</p>

      {RECAP_QUESTIONS.map((question, index) => {
        const picked = question.choices.find((c) => c.id === answers[question.id]);

        let result: "right" | "wrong" | null = null;
        let heading: string | undefined;
        if (picked && picked.correct) {
          result = "right";
          heading = RESULT_HEADINGS.check.right;
        }
        if (picked && !picked.correct) {
          result = "wrong";
          heading = RESULT_HEADINGS.check.wrong;
        }

        return (
          <fieldset key={question.id} className="space-y-2 rounded-xl border-2 border-stone-300 p-4">
            <legend className="px-1 font-bold">
              {index + 1}. {question.prompt}
            </legend>

            {question.choices.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 has-[:checked]:bg-stone-100">
                <input
                  type="radio"
                  name={`recap-${question.id}`}
                  className="mt-1 h-5 w-5 accent-pine"
                  checked={answers[question.id] === option.id}
                  onChange={() => onAnswer(question.id, option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}

            <Feedback result={result} heading={heading}>
              {picked && <p>{picked.feedback}</p>}
            </Feedback>
          </fieldset>
        );
      })}

      <p className="text-sm text-stone-600">
        {rightCount} of {RECAP_QUESTIONS.length} right
      </p>
    </>
  );
}
