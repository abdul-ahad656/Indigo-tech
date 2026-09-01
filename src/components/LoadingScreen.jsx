import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEXT = "INDIGO TECH SOLUTION";

function seededRand(seed) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function buildFallingLetters(chars) {
  let order = 0;

  return chars
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => char !== " ")
    .map(({ char, index }) => {
      const r = (n) => seededRand(index * 17 + n + order++);
      const group = Math.floor(r(0) * 6);
      const groupOffset = group * 0.22;

      return {
        char,
        index,
        left: 4 + r(1) * 92,
        delay: groupOffset + r(2) * 0.55,
        duration: 2.35 + r(3) * 1.65,
        drift: (r(4) - 0.5) * 72,
        rotateStart: (r(5) - 0.5) * 50,
        rotateEnd: (r(6) - 0.5) * 50,
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

  const letters = useMemo(() => buildFallingLetters(TEXT.split("")), []);

  const sequenceEnd = useMemo(
    () => Math.max(...letters.map((l) => l.delay + l.duration), 0) + 0.35,
    [letters]
  );

  useEffect(() => {
    if (reduced) {
      const timer = window.setTimeout(() => onComplete?.(), 600);
      return () => window.clearTimeout(timer);
    }

    let pageReady = document.readyState === "complete";
    let exitTimer;
    let completeTimer;

    const finish = () => {
      setExiting(true);
      completeTimer = window.setTimeout(() => onComplete?.(), 520);
    };

    const scheduleExit = () => {
      if (!pageReady) return;
      const wait = Math.max(sequenceEnd * 1000, 2200);
      exitTimer = window.setTimeout(finish, wait);
    };

    const onLoad = () => {
      pageReady = true;
      scheduleExit();
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, reduced, sequenceEnd]);

  if (reduced) {
    return (
      <div className="loading-screen loading-screen--reduced" role="status" aria-live="polite">
        <span className="loading-screen-sr">{TEXT}</span>
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
          transition={{ duration: 0.52, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="loading-screen-canvas" aria-hidden="true">
            {letters.map((item) => (
              <motion.span
                key={`${item.char}-${item.index}`}
                className="loading-screen-letter"
                style={{ left: `${item.left}%` }}
                initial={{
                  y: "-12vh",
                  x: 0,
                  opacity: 0,
                  rotate: item.rotateStart,
                }}
                animate={{
                  y: "112vh",
                  x: item.drift,
                  opacity: [0, 0.96, 0.96, 0],
                  rotate: item.rotateEnd,
                }}
                transition={{
                  delay: item.delay,
                  duration: item.duration,
                  ease: [0.45, 0.05, 0.55, 0.95],
                  opacity: {
                    duration: item.duration,
                    times: [0, 0.06, 0.78, 1],
                    ease: "linear",
                  },
                }}
              >
                {item.char}
              </motion.span>
            ))}
          </div>

          <span className="loading-screen-sr">{TEXT}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
