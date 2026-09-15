import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, animate } from "framer-motion";

const DURATION = 2.5;
const EXIT_MS = 0.85;
const RING_FILL_COLOR = "#4b1596";
const CHIP_FILL_COLOR = "#9a6ae0";
const WORDS = ["STAFF", "COVER", "DELIVER"];

/**
 * Exact 2D projection of public/models/logo.glb
 *  -  ring: outer R=0.907, inner R=0.618, open on the left (−90° → +90° via +X)
 *  -  chips 1-17: world centers & half-extents from the GLB
 * viewBox maps world (−1..1) → (0..200), Y flipped for SVG.
 */
const RING_FILL =
  "M 100 190.7 A 90.7 90.7 0 0 0 100 9.3 L 100 38.2 A 61.8 61.8 0 0 1 100 161.8 Z";

const RING_STROKE = "M 100 176.25 A 76.25 76.25 0 0 0 100 23.75";

const CHIPS = [
  { i: 1, x: 128, y: 62.4, s: 42.4, rx: 6.78 },
  { i: 2, x: 101.28, y: 100.08, s: 41.2, rx: 6.59 },
  { i: 3, x: 62.56, y: 59.6, s: 39.12, rx: 6.26 },
  { i: 4, x: 20.88, y: 59.6, s: 31.6, rx: 5.06 },
  { i: 5, x: 17.92, y: 104.24, s: 37.44, rx: 5.99 },
  { i: 6, x: 52.16, y: 23.36, s: 31.6, rx: 5.06 },
  { i: 7, x: 32.56, y: 40, s: 19.12, rx: 3.06 },
  { i: 8, x: 9.6, y: 88.8, s: 17.44, rx: 2.79 },
  { i: 9, x: 56.32, y: 153.36, s: 31.6, rx: 5.06 },
  { i: 10, x: 33.36, y: 145.84, s: 18.24, rx: 2.92 },
  { i: 11, x: 65.44, y: 103.36, s: 21.6, rx: 3.46 },
  { i: 12, x: 86.47, y: 11.83, s: 12.1, rx: 1.94 },
  { i: 13, x: 89.1, y: 43.26, s: 9.32, rx: 1.49 },
  { i: 14, x: 67.02, y: 136.14, s: 9.32, rx: 1.49 },
  { i: 15, x: 86.37, y: 137.57, s: 13.98, rx: 2.24 },
  { i: 16, x: 89.15, y: 164.11, s: 8.42, rx: 1.35 },
  { i: 17, x: 51.73, y: 53.81, s: 6.54, rx: 1.1 },
];

function CropMarks() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
        <span key={pos} className={`absolute h-3.5 w-3.5 ${pos}`}>
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#8a8a8a]" />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#8a8a8a]" />
        </span>
      ))}
    </div>
  );
}

function IndigoMarkSvg({ progress }) {
  const draw = Math.min(1, progress / 0.68);
  const fillOpacity = Math.max(0, Math.min(1, (progress - 0.28) / 0.62));

  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ring stroke draw (matches GLB ring thickness) */}
      <motion.path
        d={RING_STROKE}
        stroke={RING_FILL_COLOR}
        strokeWidth="28.9"
        strokeLinecap="butt"
        fill="none"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{
          pathLength: draw,
          opacity: Math.max(0, 1 - fillOpacity * 1.15),
        }}
        transition={{ duration: 0.04, ease: "linear" }}
      />

      {/* Solid ring fill once stroke has mostly drawn */}
      <motion.path
        d={RING_FILL}
        fill={RING_FILL_COLOR}
        initial={{ opacity: 0 }}
        animate={{ opacity: fillOpacity }}
        transition={{ duration: 0.04, ease: "linear" }}
      />

      {/* Chips 1-17  -  exact GLB positions / sizes */}
      {CHIPS.map((chip) => (
        <motion.rect
          key={chip.i}
          x={chip.x}
          y={chip.y}
          width={chip.s}
          height={chip.s}
          rx={chip.rx}
          ry={chip.rx}
          stroke={CHIP_FILL_COLOR}
          strokeWidth="1.4"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: draw, fill: CHIP_FILL_COLOR, fillOpacity }}
          transition={{ duration: 0.04, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

function formatPct(value) {
  const n = Math.round(value);
  if (n >= 100) return "100";
  return String(Math.max(0, n)).padStart(2, "0");
}

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progress = useMotionValue(0);

  useMotionValueEvent(progress, "change", (latest) => {
    setPct(latest * 100);
  });

  useEffect(() => {
    document.documentElement.classList.add("preloader-active");
    document.body.classList.add("preloader-active");

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      progress.set(1);
      const t = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 300);
      return () => {
        clearTimeout(t);
        document.documentElement.classList.remove("preloader-active");
        document.body.classList.remove("preloader-active");
      };
    }

    const controls = animate(progress, 1, {
      duration: DURATION,
      ease: [0.22, 0.61, 0.36, 1],
      onComplete: () => {
        setExiting(true);
        window.setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, EXIT_MS * 1000);
      },
    });

    return () => {
      controls.stop();
      document.documentElement.classList.remove("preloader-active");
      document.body.classList.remove("preloader-active");
    };
  }, [onComplete, progress]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove("preloader-active");
        document.body.classList.remove("preloader-active");
      }}
    >
      {visible && (
        <motion.div
          key="indigo-preloader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${formatPct(pct)} percent`}
          className="fixed inset-0 z-[300] flex touch-none items-center justify-center bg-[#E5E5E5]"
          initial={{ opacity: 1, y: 0 }}
          animate={
            exiting
              ? { opacity: 0, y: "-8%", transition: { duration: EXIT_MS, ease: [0.4, 0, 0.2, 1] } }
              : { opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: "-10%", transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div className="flex w-[min(86vw,360px)] flex-col items-center gap-[clamp(1.25rem,3vh,2rem)]">
            <div className="relative grid aspect-square w-[min(58vw,240px)] place-items-center">
              <CropMarks />
              <div className="relative aspect-square w-[86%]">
                <IndigoMarkSvg progress={pct / 100} />
              </div>
            </div>

            <p className="flex flex-wrap items-center justify-center gap-x-[clamp(0.65rem,2vw,1.35rem)] gap-y-1 font-['DM_Mono',ui-monospace,monospace] text-[clamp(9px,1.05vw,11px)] font-medium uppercase tracking-[0.28em] text-[#2a2a2a]">
              {WORDS.map((word, i) => (
                <React.Fragment key={word}>
                  {i > 0 && (
                    <span className="tracking-normal opacity-40" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.08, duration: 0.45, ease: "easeOut" }}
                  >
                    {word}
                  </motion.span>
                </React.Fragment>
              ))}
            </p>

            <motion.div
              className="min-h-[1.2em] font-['DM_Mono',ui-monospace,monospace] text-[clamp(12px,1.4vw,14px)] font-medium tabular-nums tracking-[0.2em] text-[#1A1A1A]"
              aria-hidden="true"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              {formatPct(pct)}
            </motion.div>
          </div>

          <span className="sr-only">Indigo Tech Solutions</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
