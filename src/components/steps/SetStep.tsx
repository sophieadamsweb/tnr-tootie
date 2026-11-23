import { SETUP_TASKS, type SetupId } from "@/content/lesson";
import type { SetupChecklist, TrapPhase } from "@/lib/trapState";

// Step 5: set the trap. Check off three tasks in any order (that's how it
// works in real life), then "Step back and wait" and watch Tootie walk in.
type Props = {
  setup: SetupChecklist;
  phase: TrapPhase;
  onToggle: (task: SetupId, done: boolean) => void;
  onStepBack: () => void;
};

export function SetStep({ setup, phase, onToggle, onStepBack }: Props) {
  const allDone = setup.newspaper && setup.cover && setup.doorSet;

  let buttonText = "Step back and wait";
  if (phase === "walking") buttonText = "Here comes Tootie...";
  if (phase === "tripped") buttonText = "Snap! The door is shut.";

  let statusText = "";
  if (allDone) statusText = "Trap's set. Move away and watch from a distance.";
  if (phase === "tripped") {
    statusText =
      "Tootie walked past the plate to reach the food. The plate dropped, the rod released the latch, and the door locked behind them.";
  }

  return (
    <>
      <p>Get the trap ready. Do these in any order.</p>

      <ul className="space-y-2">
        {SETUP_TASKS.map((task) => (
          <li key={task.id}>
            <label className="flex cursor-pointer gap-3 rounded-xl border-2 border-stone-300 p-3 has-[:checked]:border-pine has-[:checked]:bg-[#e3f1ec]">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-pine"
                checked={setup[task.id]}
                disabled={phase !== "idle"}
                onChange={(event) => onToggle(task.id, event.target.checked)}
              />
              <span>
                <span className="font-bold">{task.label}</span>
                <span className="block text-sm text-stone-600">{task.why}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onStepBack}
        disabled={!allDone || phase !== "idle"}
        className="w-full rounded-xl border-2 border-ink bg-mustard px-4 py-3 font-display text-lg font-black shadow-[3px_3px_0_0_var(--ink)] disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none"
      >
        {buttonText}
      </button>

      <p role="status" aria-live="polite" className="text-sm">
        {statusText}
      </p>
    </>
  );
}
