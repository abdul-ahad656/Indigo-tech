import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASE = "INDIGO TECH SOLUTION";

// Wave timing windows [start, spread] in seconds
// Matches the requested progression:
//   wave 0:  0 – 0.5 s   (first few letters)
//   wave 1:  0.45 – 1.6 s (more letters enter)
//   wave 2:  1.35 – 2.6 s (most of phrase falling)
//   wave 3:  2.3 – 3.4 s  (final letters)
const WAVES = [
  { start: 0,    spread: 0.50 },
  { start: 0.45, spread: 1.15 },
  { start: 1.35, spread: 1.25 },
  { start: 2.30, spread: 1.10 },
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
    const waveIdx = Math.min(Math.floor(shuffledIdx / total * WAVES.length), WAVES.length - 1);
    const w = WAVES[waveIdx];

    return {
      char,
      id: `${char}-${origIdx}`,
      left:        5  + Math.random() * 88,          // 5 – 93 % horizontal
      delay:       w.start + Math.random() * w.spread,
      duration:    2.2 + Math.random() * 1.4,        // 2.2 – 3.6 s per letter
      drift:       (Math.random() - 0.5) * 64,        // ±32 px horizontal drift
      rotateStart: (Math.random() - 0.5) * 44,        // ±22 °
      rotateEnd:   (Math.random() - 0.5) * 44,        // ±22 °
      scale:       0.88 + Math.random() * 0.28,       // 0.88 – 1.16
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

  // True randomization — different on every mount
  const letters = useMemo(() => buildLetters(), []);

  const sequenceEnd = useMemo(
    () => Math.max(...letters.map((l) => l.delay + l.duration)) + 0.3,
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
      // Clamp to 4.8 s so the user is never waiting too long
      const wait = Math.min(sequenceEnd * 1000, 4800);
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
                  y: "-14vh",
                  x: 0,
                  opacity: 0,
                  rotate: item.rotateStart,
                  scale: item.scale,
                }}
                animate={{
                  y: "115vh",
                  x: item.drift,
                  // Quick fade-in at entry, solid through fall, quick fade at exit
                  opacity: [0, 1, 1, 0],
                  rotate: item.rotateEnd,
                  scale: item.scale,
                }}
                transition={{
                  delay:    item.delay,
                  duration: item.duration,
                  // Gravity-like: starts gently, accelerates, slight resistance at end
                  ease: [0.4, 0, 0.75, 0.9],
                  opacity: {
                    duration: item.duration,
                    times:    [0, 0.07, 0.82, 1],
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
