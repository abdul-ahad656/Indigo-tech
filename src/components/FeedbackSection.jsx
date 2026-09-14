import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { feedback, feedbackCategories } from "../data/site";

const SPRING = { type: "spring", stiffness: 280, damping: 24, mass: 0.85 };

/** Deterministic scatter slots (% of canvas) — reshuffled per filter */
const SLOT_BANK = [
  { left: 2, top: 6, rotate: -4, w: 300 },
  { left: 36, top: 2, rotate: 3, w: 280 },
  { left: 68, top: 10, rotate: -2, w: 290 },
  { left: 10, top: 42, rotate: 2.5, w: 270 },
  { left: 42, top: 38, rotate: -3.5, w: 310 },
  { left: 72, top: 48, rotate: 4, w: 275 },
  { left: 22, top: 68, rotate: -1.5, w: 295 },
];

const FILTER_OFFSETS = {
  All: [0, 1, 2, 3, 4, 5, 6],
  Enterprise: [1, 3, 5, 0, 2, 4, 6],
  Design: [2, 4, 6, 1, 3, 5, 0],
  Growth: [4, 0, 5, 2, 6, 1, 3],
};

function useIsDesktop() {
  const [desktop, setDesktop] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 900px)").matches : true
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => setDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return desktop;
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={1.6}
          className={i < rating ? "fill-[#FFC53D] text-[#FFC53D]" : "text-white/20"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  index,
  layout,
  zIndex,
  desktop,
  reduceMotion,
  onFront,
  dragConstraints,
}) {
  const bobDuration = 3.6 + (index % 5) * 0.45;

  return (
    <motion.article
      layout={false}
      drag={desktop && !reduceMotion}
      dragConstraints={dragConstraints}
      dragElastic={0.14}
      dragMomentum
      dragTransition={{ bounceStiffness: 320, bounceDamping: 22, power: 0.18 }}
      whileDrag={reduceMotion ? undefined : { scale: 1.05, zIndex: 50, cursor: "grabbing" }}
      onPointerDown={() => onFront(item.id)}
      onDragStart={() => onFront(item.id)}
      initial={
        reduceMotion
          ? false
          : desktop
            ? { opacity: 0, scale: 0.88, rotate: layout.rotate - 10 }
            : { opacity: 0, y: 28 }
      }
      animate={
        desktop
          ? {
              opacity: 1,
              left: `${layout.left}%`,
              top: `${layout.top}%`,
              rotate: layout.rotate,
              scale: 1,
            }
          : { opacity: 1, y: 0 }
      }
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
      transition={SPRING}
      className={`group touch-none select-none ${
        desktop
          ? "absolute cursor-grab active:cursor-grabbing"
          : "relative w-full"
      }`}
      style={
        desktop
          ? {
              width: `min(${layout.w}px, 86vw)`,
              zIndex,
            }
          : { zIndex: "auto" }
      }
      aria-label={`Review by ${item.person}`}
    >
      <motion.div
        className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6"
        style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px ${item.accent}22` }}
        animate={
          reduceMotion || !desktop
            ? undefined
            : { y: [0, -7, 0] }
        }
        transition={
          reduceMotion || !desktop
            ? undefined
            : { duration: bobDuration, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }
        }
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-40 blur-2xl"
          style={{ background: item.accent }}
          aria-hidden="true"
        />

        <div className="relative z-[1] flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <Stars rating={item.rating} />
            <span
              className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3EFFF]"
              style={{ boxShadow: `0 0 18px ${item.accent}33` }}
            >
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }}
                aria-hidden="true"
              />
              {item.metric}
            </span>
          </div>

          <blockquote className="font-serif-accent m-0 text-[1.15rem] leading-[1.35] tracking-[-0.015em] text-[#F4F4F5] md:text-[1.25rem]">
            <span className="text-white/30" aria-hidden="true">
              “
            </span>
            {item.quote}
            <span className="text-white/30" aria-hidden="true">
              ”
            </span>
          </blockquote>

          <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#A1A1AA]">
            {item.tag}
          </span>

          <footer className="mt-1 flex items-center gap-3 border-t border-white/10 pt-4">
            <div
              className="testimonials-avatar-ring shrink-0"
              style={{ "--avatar-accent": item.accent }}
              aria-hidden="true"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-full font-display text-[12px] font-semibold text-[#09090B]"
                style={{ background: item.accent }}
              >
                {item.initials}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <strong className="font-display truncate text-[0.9rem] font-semibold tracking-[-0.03em] text-[#FAFAFA]">
                  {item.person}
                </strong>
                {item.verified && (
                  <BadgeCheck size={14} className="shrink-0 text-[#00F5D4]" aria-label="Verified" />
                )}
              </div>
              <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-[#71717A]">
                {item.role} · {item.company}
              </span>
            </div>
          </footer>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function FeedbackSection() {
  const [filter, setFilter] = React.useState("All");
  const [zOrder, setZOrder] = React.useState(() => feedback.map((f) => f.id));
  const [hint, setHint] = React.useState({ show: false, x: 0, y: 0 });
  const canvasRef = React.useRef(null);
  const reduceMotion = useReducedMotion();
  const desktop = useIsDesktop();

  const visible = React.useMemo(() => {
    if (filter === "All") return feedback;
    return feedback.filter((item) => item.category === filter);
  }, [filter]);

  const layouts = React.useMemo(() => {
    const order = FILTER_OFFSETS[filter] || FILTER_OFFSETS.All;
    return visible.map((item, i) => {
      const slot = SLOT_BANK[order[i % order.length] % SLOT_BANK.length];
      // slight per-filter nudge so reshuffles feel distinct
      const nudge = (filter.charCodeAt(0) + i * 7) % 5;
      return {
        ...slot,
        left: Math.min(78, Math.max(0, slot.left + (nudge - 2))),
        top: Math.min(72, Math.max(0, slot.top + ((i * 3) % 5) - 2)),
      };
    });
  }, [visible, filter]);

  const bringToFront = React.useCallback((id) => {
    setZOrder((prev) => [...prev.filter((x) => x !== id), id]);
  }, []);

  const zIndexFor = (id) => 20 + zOrder.indexOf(id);

  const onCanvasMove = (event) => {
    if (!desktop) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHint({
      show: true,
      x: event.clientX - rect.left + 18,
      y: event.clientY - rect.top + 18,
    });
  };

  return (
    <section
      id="feedback"
      className="testimonials-section relative overflow-hidden bg-[#09090B] px-[5vw] py-[100px] text-[#FAFAFA] md:py-[120px]"
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-mesh pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
      <div className="testimonials-noise pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden="true" />

      <div className="relative z-[1] mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#71717A]">
              04 — Client Feedback
            </p>
            <motion.h2
              id="testimonials-heading"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={SPRING}
              className="font-display m-0 text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold leading-[0.92] tracking-[-0.07em]"
            >
              Voices from the
              <br />
              <em className="not-italic text-[#B38CFF]">floating floor</em>
            </motion.h2>
          </div>

          <div
            className="testimonials-dock flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl"
            role="tablist"
            aria-label="Filter reviews by category"
          >
            {feedbackCategories.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F5D4] ${
                    active
                      ? "bg-white text-[#09090B]"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={canvasRef}
          className={`testimonials-canvas relative ${
            desktop ? "h-[min(820px,92vh)] min-h-[640px]" : "flex flex-col gap-4"
          }`}
          onPointerMove={onCanvasMove}
          onPointerLeave={() => setHint((h) => ({ ...h, show: false }))}
        >
          {desktop && hint.show && !reduceMotion && (
            <div
              className="pointer-events-none absolute z-[100] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#09090B]/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#E4E4E7] shadow-lg backdrop-blur-md md:block"
              style={{ left: hint.x, top: hint.y }}
              aria-hidden="true"
            >
              Drag or Click
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <TestimonialCard
                key={`${item.id}-${filter}`}
                item={item}
                index={i}
                layout={layouts[i]}
                zIndex={zIndexFor(item.id)}
                desktop={desktop}
                reduceMotion={reduceMotion}
                onFront={bringToFront}
                dragConstraints={canvasRef}
              />
            ))}
          </AnimatePresence>

          {desktop && (
            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#52525B]">
              Drag cards · Filter to reshuffle
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
