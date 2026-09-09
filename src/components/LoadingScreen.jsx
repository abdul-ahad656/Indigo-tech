import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASE = "INDIGO TECH SOLUTION";

function buildLetters() {
  // Preserve order so letters land in place and spell the phrase.
  const chars = PHRASE.split("");

  // Randomize the DROP ORDER (which letter lands first) without
  // touching visual order — each letter still knows its own position.
  const dropOrder = chars.map((_, i) => i);
  for (let k = dropOrder.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [dropOrder[k], dropOrder[j]] = [dropOrder[j], dropOrder[k]];
  }

  const perLetterGap = 0.09; // seconds between drops
  const fallDuration = 1.15;

  return chars.map((char, i) => {
    const order = dropOrder.indexOf(i);
    return {
      char,
      id: `${char}-${i}`,
      isSpace: char === " ",
      delay: order * perLetterGap,
      duration: fallDuration,
      // 3D tumble while falling
      rotateXStart: -180 + Math.random() * 360,
      rotateYStart: -180 + Math.random() * 360,
      rotateZStart: -90 + Math.random() * 180,
      // Random horizontal drift on the way down (settles to 0)
      driftX: (Math.random() - 0.5) * 60,
      // Start depth (far from viewer) so it grows as it falls
      startZ: -600 - Math.random() * 400,
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

  const letters = useMemo(() => buildLetters(), []);

  const sequenceEnd = useMemo(
    () => Math.max(...letters.map((l) => l.delay + l.duration)) + 0.9,
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
      const wait = Math.min(sequenceEnd * 1000, 6000);
      exitTimer = setTimeout(finish, wait);
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule);
    }

    return () => {
      window.removeEventListener("load", schedule);
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
        <span className="loading-screen-static">{PHRASE}</span>
      </div>
    );
  }

  // Split phrase into words so we can wrap each word and prevent line breaks
  // inside a word while still spacing them apart.
  const words = [];
  let currentWord = [];
  letters.forEach((item) => {
    if (item.isSpace) {
      if (currentWord.length) words.push(currentWord);
      currentWord = [];
    } else {
      currentWord.push(item);
    }
  });
  if (currentWord.length) words.push(currentWord);

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
          <div className="loading-screen-stage" aria-hidden="true">
            <div className="loading-screen-phrase">
              {words.map((word, wi) => (
                <span key={`w-${wi}`} className="loading-screen-word">
                  {word.map((item) => (
                    <motion.span
                      key={item.id}
                      className="loading-screen-letter"
                      initial={{
                        y: "-70vh",
                        x: item.driftX,
                        z: item.startZ,
                        opacity: 0,
                        rotateX: item.rotateXStart,
                        rotateY: item.rotateYStart,
                        rotateZ: item.rotateZStart,
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        z: 0,
                        opacity: 1,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0,
                      }}
                      transition={{
                        delay: item.delay,
                        duration: item.duration,
                        ease: [0.22, 1, 0.36, 1],
                        opacity: {
                          delay: item.delay,
                          duration: 0.28,
                          ease: "linear",
                        },
                      }}
                    >
                      {item.char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          <span className="loading-screen-sr">{PHRASE}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
