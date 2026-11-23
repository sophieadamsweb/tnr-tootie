"use client";

import { useEffect, useState } from "react";

// A "Read aloud" button for each step.
//
// It uses the speech engine that's already built into the browser
// (speechSynthesis), so there's no outside service or API key. It reads the
// step title plus all the text on the page, answer choices included.
// Helpful for dyslexic learners, people reading in a second language, or
// anyone with a trap in one hand.

type Props = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement | null>; // the step's text, to read out
};

export function ReadAloud({ title, contentRef }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  // When this button goes away (you moved to another step), stop talking.
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function startReading() {
    if (!("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    const pageText = contentRef.current?.innerText ?? "";
    const speech = new SpeechSynthesisUtterance(`${title}. ${pageText}`);
    speech.rate = 0.95; // a touch slower than default
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel(); // stop anything already playing
    window.speechSynthesis.speak(speech);
    setSpeaking(true);
  }

  function stopReading() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (unsupported) {
    return <p className="text-sm text-stone-600">Read aloud isn&apos;t available in this browser.</p>;
  }

  return (
    <button
      type="button"
      onClick={speaking ? stopReading : startReading}
      aria-pressed={speaking}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-card px-3 text-sm font-bold aria-pressed:bg-ink aria-pressed:text-white"
    >
      <SpeakerIcon muted={speaking} />
      {speaking ? "Stop" : "Read aloud"}
    </button>
  );
}

// A little speaker. Shows sound waves normally, and an X while it's talking
// (because pressing it then means "stop").
function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
    </svg>
  );
}
