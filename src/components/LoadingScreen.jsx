import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASE = "INDIGO TECH SOLUTION";

// Wave timing windows [start, spread] in seconds
const WAVES = [
  { start: 0,    spread: 0.50 },  // 0 – 0.5 s   (first letters drop)
  { start: 0.45, spread: 1.15 },  // 0.45 – 1.6 s (more enter)
  { start: 1.35, spread: 1.25 },  // 1.35 – 2.6 s (bulk of phrase)
  { start: 2.30, spread: 1.10 },  // 2.3 – 3.4 s  (final letters)
];

function buildLetters() {
  const chars = PHRASE.split("")
    .map((char, i) => ({ char, i }))
    .filter(({ char }) => char !== " ");

  // Fisher-Yates shuffle so each wave gets random characters
  for (let k = chars.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [chars[k], chars[j]] = [chars[j], chars[k]];
  }

  const total = chars.length;

  return chars.map(({ char, i: origIdx }, shuffledIdx) => {
    const waveIdx = Math.min(
      Math.floor((shuffledIdx / total) * WAVES.length),
      WAVES.length - 1
    );
    const w = WAVES[waveIdx];

    // Landing zone: 68–82% down the viewport so letters sit near the bottom
    // but never cause overflow. Variance creates the "pile" effect.
    const landingVh = 68 + Math.random() * 14;

    // Depth: letters start small (far away) and grow as they fall toward the viewer
    const startScale = 0.52 + Math.random() * 0.18;  // 0.52 – 0.70
    const landingScale = 0.94 + Math.random() * 0.22; // 0.94 – 1.16

    return {
      char,
      id: `${char}-${origIdx}`,
      left:        5  + Math.random() * 88,           // 5 – 93 % horizontal
      delay:       w.start + Math.random() * w.spread,
      duration:    1.8 + Math.random() * 1.2,         // 1.8 – 3.0 s per letter
      drift:       (Math.random() - 0.5) * 48,         // ±24 px lateral drift
      rotateStart: (Math.random() - 0.5) * 30,         // ±15 ° initial tilt
      rotateEnd:   (Math.random() - 0.5) * 140,        // ±70 ° final rotation (physical landing)
      startScale,
      landingScale,
      finalY:      `${landingVh}vh`,                   // settles here — does NOT fall off-screen
    };
  });
}

export default function LoadingScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // True randomization — different layout on every page load
  const letters = useMemo(() => buildLetters(), []);

  // After the last letter lands, add a 700 ms pause so the pile is visible
  const sequenceEnd = useMemo(
    () => Math.max(...letters.map((l) => l.delay + l.duration)) + 0.7,
    [letters]
  );

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => onComplete?.(), 700);
      return () => clearTimeout(t);
    }

    let exitTimer, completeTimer;
    let scheduled = false;

    const finish = () => {
      setExiting(true);
      completeTimer = setTimeout(() => onComplete?.(), 640);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      // Never exceed 5.5 s total — enough to see the full pile
      const wait = Math.min(sequenceEnd * 1000, 5500);
      exitTimer = setTimeout(finish, wait);
    };

    const onLoad = () => schedule();

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, reduced, sequenceEnd]);

  if (reduced) {
    return (
      <div
        className="loading-screen loading-screen--reduced"
        role="status"
        aria-live="polite"
      >
        <span className="loading-screen-sr">{PHRASE}</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="loading-screen"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.64, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="loading-screen-canvas" aria-hidden="true">
            {letters.map((item) => (
              <motion.span
                key={item.id}
                className="loading-screen-letter"
                style={{ left: `${item.left}%` }}
                initial={{
                  y:      "-14vh",
                  x:      0,
                  opacity: 0,
                  rotate:  item.rotateStart,
                  scale:   item.startScale,   // starts small (far from viewer)
                }}
                animate={{
                  y:      item.finalY,         // settles at the bottom — stays there
                  x:      item.drift,
                  opacity: [0, 1],             // fades in fast, stays fully visible
                  rotate:  item.rotateEnd,     // lands at random physical orientation
                  scale:   item.landingScale,  // grows as it falls toward the viewer
                }}
                transition={{
                  delay:    item.delay,
                  duration: item.duration,
                  // Ease-out: fast fall with soft physical landing, no bounce
                  ease: [0.22, 1, 0.36, 1],
                  opacity: {
                    delay:    item.delay,
                    duration: 0.35,  // fixed quick fade-in regardless of fall speed
                    ease:     "linear",
                  },
                }}
              >
                {item.char}
              </motion.span>
            ))}
          </div>

          <span className="loading-screen-sr">{PHRASE}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
