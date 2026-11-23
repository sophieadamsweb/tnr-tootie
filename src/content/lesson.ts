// All the words live here. I wanted the lesson copy editable without digging
// through JSX, so if a TNR group ever wants to reword something (or I find a
// fact that's off), it's one file. The components just read from this.
// TNR facts are from my own trapping, but double check before publishing.

// The nine steps, in order. Everything else (progress paws, captions, field
// notes, the Next gating) keys off these ids, so adding a step starts here.
export const STEPS = [
  { id: "meet", title: "Meet Tootie" },
  { id: "why", title: "Why we trap" },
  { id: "parts", title: "Meet the trap" },
  { id: "bait", title: "Bait it" },
  { id: "set", title: "Set it" },
  { id: "caught", title: "You caught one" },
  { id: "after", title: "What happens next" },
  { id: "check", title: "Check yourself" },
  { id: "turn", title: "Your turn" },
] as const;

// StepId is "meet" | "why" | "parts" | ... built automatically from the list
// above. Because CAPTIONS and FIELD_NOTES below use it, TypeScript complains
// if any step is missing a caption or a field note. Cheap insurance.
export type StepId = (typeof STEPS)[number]["id"];

// Captions under the drawing, like "Fig. 3" in an old history textbook. Small
// thing, but it makes the drawing feel like part of the lesson, not decoration.
export const CAPTIONS: Record<StepId, string> = {
  meet: "Tootie at home in the yard. Dinner is served.",
  why: "A box trap. Humane, simple, and where every TNR starts.",
  parts: "A box trap from the side. Cats go in through the door on the right.",
  bait: "Tap inside the trap to drop the food.",
  set: "The trap, getting ready for company.",
  caught: "The door is locked. Now what?",
  after: "Back home, fixed, and wearing a brand new ear tip.",
  check: "Same Tootie, same trap. Let's see what stuck.",
  turn: "Tootie's done. Who's next?",
};

// The yellow sticky-note sidebar, one per step. Inspired by the margin notes in
// A History of US: extra real-world stuff that's useful but not required to
// move on, so the main text can stay short.
export const FIELD_NOTES: Record<StepId, string> = {
  meet: "Community cats are outdoor cats without an owner. Some are friendly strays, some are feral and want nothing to do with people. Both can be TNR'd.",
  why: "Cats can get pregnant as young as four months old and can have several litters a year. Fixing one cat now prevents a lot of kittens later.",
  parts: "Practice at home first. Set the trap and trip the plate with your hand a few times so nothing surprises you outside.",
  bait: "Stinky works. Tuna, sardines or mackerel carry a long way, and a little drizzle of the juice toward the back helps lead them in.",
  set: "Never set a trap and forget about it. Watch from a distance or check it often so a cat is never stuck out in the weather.",
  caught: "Loud and scary is normal for the first minute. Almost every cat settles down once it's dark inside the trap.",
  after: "The ear tip is done while the cat is already under anesthesia for surgery. It's the universal sign that a community cat is fixed.",
  check: "No grades, no timer. Pulling something back out of your own memory is what makes it stick, which is why this is a quiz and not a summary.",
  turn: "Most clinics want cats dropped off first thing in the morning, so a lot of trappers set their traps the evening before. Ask your clinic what they prefer.",
};

// The little hint next to a grayed-out Next button, saying what's left to do.
// Steps with nothing to do don't need one.
export const NEXT_HINTS: Partial<Record<StepId, string>> = {
  parts: "Explore three parts to continue.",
  bait: "Find the right spot for the food.",
  set: "Set the trap, then step back.",
  caught: "Pick the right first move.",
  check: "Get all three right to finish.",
};

// The bold line on top of a result, after the ✓ or ✕. Bait it also adds the
// spot you picked, like "Not quite. Toward the door". The step's Feedback box
// and the result panel on phones both read from here, so they always match.
// The explanations below skip saying "Yes." again, since this already did.
export const RESULT_HEADINGS = {
  bait: { right: "Nice.", wrong: "Not quite." },
  caught: { right: "Yes.", wrong: "Not that one." },
  check: { right: "Yes.", wrong: "Not quite." },
};

// The five parts you can tap on the "Meet the trap" step. "what" is what it
// does, "tip" is the thing I wish someone had told me before my first trap.
export type TrapPartId = "door" | "plate" | "rod" | "latch" | "handle";

export type TrapPart = {
  id: TrapPartId;
  name: string;
  what: string;
  tip: string;
};

export const TRAP_PARTS: TrapPart[] = [
  {
    id: "door",
    name: "Front door",
    what: "Swings up and hooks open while the trap is set. When the trap trips, it drops and locks shut.",
    tip: "Always test the door a few times before you go out. A sticky door means a missed cat.",
  },
  {
    id: "plate",
    name: "Trip plate",
    what: "The metal plate on the floor near the back. When the cat steps on it, it pulls the rod and releases the door.",
    tip: "The cat has to walk all the way past the plate to reach the food, which is the whole trick.",
  },
  {
    id: "rod",
    name: "Trigger rod",
    what: "Connects the trip plate to the door latch along the top of the trap.",
    tip: "If the rod is bent, the trap can trip too early or not at all. Check it every time.",
  },
  {
    id: "latch",
    name: "Door latch",
    what: "Holds the door up until the rod releases it, then locks the door closed so the cat can't push it open.",
    tip: "Once it's locked, the only way the door opens is when you open it on purpose.",
  },
  {
    id: "handle",
    name: "Handle and guard",
    what: "The flat plate on top keeps your fingers away from the cat while you carry the trap.",
    tip: "Carry it level and slow. A calm ride makes for a calmer cat.",
  },
];

// Where the food can land. "outside" isn't a real answer, it's there so a tap
// that misses the trap still gets a friendly response instead of nothing.
export type BaitZoneId = "back" | "plate" | "door" | "outside";

export type BaitZone = {
  id: BaitZoneId;
  label: string;
  correct: boolean;
  feedback: string;
};

// Each zone explains WHY it works or doesn't. The wrong answers are where the
// actual learning is, so they get real explanations, not just "wrong."
// Zones run along the trap floor in SVG x coordinates; the plate is ~x 160-262.
export const BAIT_ZONES: BaitZone[] = [
  {
    id: "back",
    label: "At the back, past the plate",
    correct: true,
    feedback:
      "To reach the food, Tootie has to walk all the way in and step on the plate. Their whole body is inside when the door drops.",
  },
  {
    id: "plate",
    label: "On the trip plate",
    correct: false,
    feedback:
      "Close, but Tootie might stretch from in front of the plate to reach it. The door could also land on their tail.",
  },
  {
    id: "door",
    label: "Toward the door",
    correct: false,
    feedback:
      "Tootie can grab a bite without ever stepping on the trip plate, then leave with a full belly and a new trick.",
  },
  {
    id: "outside",
    label: "Outside the trap",
    correct: false,
    feedback: "The food needs to go inside the trap. Tap somewhere inside the cage.",
  },
];

// Turns a tap on the drawing into a zone.
//
// The drawing is 600 wide and 280 tall. These numbers are where the trap's
// walls and the trip plate sit in it.
const TRAP_LEFT = 60;
const TRAP_RIGHT = 540;
const TRAP_TOP = 70;
const TRAP_FLOOR = 236;
// The plate really runs from about x=160 to x=262. I gave it a few extra
// pixels on each side so a tap right on its edge still counts as "on the plate".
const PLATE_START = 158;
const PLATE_END = 266;

export function zoneForPoint(x: number, y: number): BaitZoneId {
  const insideTrap = x >= TRAP_LEFT && x <= TRAP_RIGHT && y >= TRAP_TOP && y <= TRAP_FLOOR;
  if (!insideTrap) return "outside";
  if (x < PLATE_START) return "back"; // left of the plate
  if (x <= PLATE_END) return "plate";
  return "door"; // right of the plate
}

// Tap-anywhere is great with a mouse or finger and useless with a keyboard or
// screen reader, so these become buttons under the drawing. Same zones, same
// feedback, just a fixed spot in each one for the bowl.
export const BAIT_FALLBACK: { id: "back" | "plate" | "door"; x: number }[] = [
  { id: "door", x: 470 },
  { id: "plate", x: 212 },
  { id: "back", x: 105 },
];

// The opener. Starting with a cat you already care about gives the lesson a
// "why" before any trap stuff, and it's how most people actually get into TNR.
export const MEET_TOOTIE = {
  title: "Meet Tootie",
  paragraphs: [
    "Tootie is your neighbor, just not the usual kind. Tootie lives in your yard, naps under the porch, and shows up at the back door around dinnertime.",
    "You've been leaving out food and fresh water, and Tootie has started sticking around. But Tootie isn't fixed, and spring is coming. One cat can turn into a whole colony fast.",
  ],
  question: "So you're feeding Tootie. What's the next step?",
};

// The "Set it" checklist. Any order, because that's how it works in real life,
// but you need all three before you can step back.
export type SetupId = "newspaper" | "cover" | "doorSet";

export const SETUP_TASKS: { id: SetupId; label: string; why: string }[] = [
  {
    id: "newspaper",
    label: "Line the floor with newspaper",
    why: "Wire floors feel strange under paws. Keep it flat so the plate still moves.",
  },
  {
    id: "cover",
    label: "Drape a towel over the back half",
    why: "A covered end looks like a safe little tunnel instead of a cage.",
  },
  {
    id: "doorSet",
    label: "Hook the door open",
    why: "Lift the door and set the latch. Now the trap is live.",
  },
];

// The panic moment. Two wrong answers are the instinctive ones (check on them,
// comfort them), which is exactly why they're worth teaching against.
export type ScenarioChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export const CAUGHT_SCENARIO: { prompt: string; choices: ScenarioChoice[] } = {
  prompt:
    "The door just snapped shut. Tootie is thrashing and you can hear the trap rattling. What do you do first?",
  choices: [
    {
      id: "open",
      label: "Open the door a crack to check they're okay",
      correct: false,
      feedback:
        "Never open the trap. A scared cat will bolt, and you might not get another chance to help Tootie.",
    },
    {
      id: "cover",
      label: "Cover the whole trap with a sheet or towel",
      correct: true,
      feedback:
        "Darkness calms them down fast. Most cats settle within a minute once they can't see out.",
    },
    {
      id: "pet",
      label: "Put your fingers through to soothe them",
      correct: false,
      feedback:
        "Even friendly cats bite when they're scared. Keep your hands out and let the cover do the calming.",
    },
  ],
};

// What happens after the catch. Not interactive on purpose: by now you've done
// the hard part, so it's a calm wrap-up you can read once.
export const AFTER_STEPS: string[] = [
  "Keep the trap covered and move it somewhere quiet, warm and dry.",
  "Don't open the trap or offer food. Your clinic will tell you when the cat should stop eating before surgery.",
  "Bring them to your clinic or TNR program in the trap.",
  "After surgery the cat gets an ear tip, a small notch that tells everyone they're already fixed.",
  "Once they've recovered, release them in the exact spot you trapped them. That's their home.",
];

// "Check yourself": three quick questions pulled from earlier steps. Recalling
// something is way better for memory than rereading it, and mixing steps
// together means you can't just answer from whatever you read last.
export type RecapQuestion = {
  id: string;
  prompt: string;
  choices: ScenarioChoice[];
};

export const RECAP_QUESTIONS: RecapQuestion[] = [
  {
    id: "plate",
    prompt: "What actually makes the door drop?",
    choices: [
      {
        id: "bump",
        label: "The cat bumping into the door",
        correct: false,
        feedback: "The door only drops when the latch lets go, and the latch is connected to the plate.",
      },
      {
        id: "step",
        label: "The cat stepping on the trip plate",
        correct: true,
        feedback: "The plate pulls the rod, the rod releases the latch, and the door drops.",
      },
      {
        id: "weight",
        label: "The weight of the food",
        correct: false,
        feedback: "The food doesn't weigh enough to do anything. It's just there to get them past the plate.",
      },
    ],
  },
  {
    id: "towel",
    prompt: "Why drape a towel over the back half before you set the trap?",
    choices: [
      {
        id: "tunnel",
        label: "So the back looks like a safe, dark tunnel",
        correct: true,
        feedback: "A covered end feels like a hiding spot, so they're more willing to walk all the way in.",
      },
      {
        id: "warm",
        label: "To keep the food warm",
        correct: false,
        feedback: "Nice thought, but the towel is for the cat, not the food.",
      },
      {
        id: "neighbors",
        label: "To hide the trap from the neighbors",
        correct: false,
        feedback: "The neighbors might appreciate it, but the cat is who you're trying to convince.",
      },
    ],
  },
  {
    id: "eartip",
    prompt: "You spot a cat with a flat, straight notch on one ear. What does that tell you?",
    choices: [
      {
        id: "fight",
        label: "They got in a fight",
        correct: false,
        feedback: "Fight injuries look ragged. A straight, flat tip is done on purpose.",
      },
      {
        id: "owned",
        label: "They belong to someone",
        correct: false,
        feedback: "An ear tip means fixed, not owned. Plenty of ear-tipped cats are community cats.",
      },
      {
        id: "fixed",
        label: "They've already been fixed",
        correct: true,
        feedback: "That's an ear tip. No need to trap this one unless they look sick or hurt.",
      },
    ],
  },
];

// "Your turn": getting from this lesson to an actual trap. This is the part
// nobody tells you up front: the trapping is the easy bit, getting a clinic
// spot is the hard bit. Drafted from my own experience trapping in NYC.
export const YOUR_TURN = {
  intro:
    "Tootie's done. Odds are there's another cat in your yard who isn't. Here's how to go from this lesson to a real trap.",
  items: [
    {
      title: "Get TNR certified",
      body: "Local nonprofits run free or low-cost trainings. In NYC that's groups like Neighborhood Cats. Being certified is what gets you access to discounted spay/neuter through partner clinics.",
      link: { href: "https://www.neighborhoodcats.org/learn-more/intro-workshops", label: "Find a TNR workshop" },
    },
    {
      title: "Book a clinic spot before you trap",
      body: "Free and low-cost spots (the ASPCA has some in NYC) are limited and go fast. Lock one in first so Tootie isn't stuck in a trap waiting for an opening.",
    },
    {
      title: "Have a backup vet",
      body: "Find a local vet who'll see community cats. When the clinic spots run out, and they will, paying out of pocket at a vet you trust beats waiting.",
    },
    {
      title: "Not in NYC?",
      body: "Search for a TNR or community cat program near you. Most cities have one, and they're the best place to start.",
    },
  ],
};
