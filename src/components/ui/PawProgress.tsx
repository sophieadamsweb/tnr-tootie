import { STEPS } from "@/content/lesson";

// Progress shown as a row of paw prints, one per step.
//   done     = filled teal
//   current  = bigger and yellow
//   upcoming = just an outline
//
// Each paw also has hidden text ("Completed: Meet Tootie") so screen readers
// get the real progress instead of "image, image, image".

type PawStatus = "done" | "current" | "upcoming";

const PAW_FILL: Record<PawStatus, string> = {
  done: "var(--pine)",
  current: "var(--mustard)",
  upcoming: "transparent",
};

const SCREEN_READER_PREFIX: Record<PawStatus, string> = {
  done: "Completed: ",
  current: "Current: ",
  upcoming: "Upcoming: ",
};

export function PawProgress({ stepIndex }: { stepIndex: number }) {
  return (
    <nav aria-label="Lesson progress">
      <ol className="flex items-center gap-1.5">
        {STEPS.map((step, index) => {
          let status: PawStatus = "upcoming";
          if (index < stepIndex) status = "done";
          if (index === stepIndex) status = "current";

          return (
            <li key={step.id} aria-current={status === "current" ? "step" : undefined}>
              <span className="sr-only">
                {SCREEN_READER_PREFIX[status]}
                {step.title}
              </span>
              <Paw status={status} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Paw({ status }: { status: PawStatus }) {
  const size = status === "current" ? 30 : 22;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
      <g fill={PAW_FILL[status]} stroke="var(--ink)" strokeWidth="1.6">
        {/* the big pad, then four toes */}
        <ellipse cx="12" cy="16" rx="5.2" ry="4.4" />
        <ellipse cx="5" cy="10" rx="2.2" ry="2.8" />
        <ellipse cx="9.5" cy="5.6" rx="2.2" ry="2.8" />
        <ellipse cx="14.5" cy="5.6" rx="2.2" ry="2.8" />
        <ellipse cx="19" cy="10" rx="2.2" ry="2.8" />
      </g>
    </svg>
  );
}
