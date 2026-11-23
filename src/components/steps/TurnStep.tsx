import { YOUR_TURN } from "@/content/lesson";
import { Stamp } from "../ui/Stamp";

// Step 9: how to go from this lesson to a real trap. The part nobody tells
// you: trapping is the easy bit, getting a clinic spot is the hard bit.
export function TurnStep() {
  return (
    <>
      <p>{YOUR_TURN.intro}</p>

      <ol className="space-y-3">
        {YOUR_TURN.items.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-mustard font-display font-black"
            >
              {index + 1}
            </span>
            <div>
              <p className="font-bold">{item.title}</p>
              <p>{item.body}</p>
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-bold text-pine underline underline-offset-4"
                >
                  {item.link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <Stamp />
        <p className="min-w-48 flex-1">
          <span className="font-bold">You&apos;re ready.</span> Bait past the plate, cover the back, step away, and cover
          the trap the second the door drops.
        </p>
      </div>
    </>
  );
}
