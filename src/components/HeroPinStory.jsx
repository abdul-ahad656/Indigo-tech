import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Calculator, CalendarClock, Headphones, Route, ShoppingBag, Users } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const heroServices = [
  {
    no: "01",
    icon: Users,
    title: "Offshoring / Outsourcing",
    text: "You need coverage without standing up a full local team. We staff the desk, write the SOPs, and report against the same queue rules your managers already use."
  },
  {
    no: "02",
    icon: Headphones,
    title: "Customer Support",
    text: "Phone, chat, and email. We take the tickets, chase the follow-ups, and keep the tone close to how you already talk to customers."
  },
  {
    no: "03",
    icon: Route,
    title: "Dispatch Operations",
    text: "Jobs, drivers, loads, field techs: one desk watching the board. Fewer missed windows when someone is actually sitting on the exceptions."
  },
  {
    no: "04",
    icon: CalendarClock,
    title: "Scheduling for Service Companies",
    text: "HVAC, plumbing, roofing, and similar trades. We book, confirm, and reshuffle when a tech runs late so the calendar stays honest."
  },
  {
    no: "05",
    icon: Calculator,
    title: "Financial Management",
    text: "Day-to-day books in Zoho, QuickBooks, or Xero. Invoices, reconciliations, AR follow-ups: enough clarity that month-end is not a scramble."
  },
  {
    no: "06",
    icon: ShoppingBag,
    title: "Ecommerce Stores",
    text: "Catalog, checkout, and the daily order desk after launch. We stay on the live store so product and ops are not two separate fires."
  }
];

const heroWords = ["desks.", "queues.", "handoffs."];
const LIGHT = { wght: 250 };
const HEAVY = { wght: 780 };

function useReducedMotion() {
  return React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

function VariableLine({ parts, active, from, to, staggerFrom = "first", className }) {
  const reduced = useReducedMotion();
  const chars = parts.flatMap((part) =>
    Array.from(part.text).map((ch) => ({ ch, className: part.className || "" }))
  );
  const count = chars.length;
  const settings = active && !reduced ? to : from;

  return (
    <span className={className}>
      {chars.map((item, i) => {
        const order = staggerFrom === "last" ? count - 1 - i : i;
        return (
          <span
            key={`${item.ch}-${i}`}
            className={`hero-var-char ${item.className}`.trim()}
            style={{
              fontVariationSettings: `'wght' ${settings.wght}`,
              transitionDelay: reduced ? "0s" : `${order * 0.01}s`
            }}
          >
            {item.ch === " " ? "\u00a0" : item.ch}
          </span>
        );
      })}
    </span>
  );
}

function HeroWord({ active }) {
  const [index, setIndex] = React.useState(0);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % heroWords.length), 2800);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <VariableLine
      key={heroWords[index]}
      className="hero-word"
      parts={[{ text: heroWords[index] }]}
      active={active}
      from={HEAVY}
      to={LIGHT}
      staggerFrom="last"
    />
  );
}

function HeroLockup() {
  const [hot, setHot] = React.useState(false);

  return (
    <h1
      className={`hero-lockup${hot ? " is-hot" : ""}`}
      tabIndex={0}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <VariableLine
        className="hero-lockup-line"
        parts={[{ text: "Remote ops, done." }]}
        active={hot}
        from={LIGHT}
        to={HEAVY}
      />
      <span className="hero-lockup-line">
        <VariableLine
          parts={[{ text: "Clearer " }]}
          active={hot}
          from={HEAVY}
          to={LIGHT}
          staggerFrom="last"
        />
        <HeroWord active={hot} />
      </span>
    </h1>
  );
}

function FillWords({ text }) {
  return text.split(/(\s+)/).map((chunk, i) =>
    /^\s+$/.test(chunk) ? (
      chunk
    ) : (
      <span key={i} className="hero-fill-word">
        {chunk}
      </span>
    )
  );
}

const manifestoLines = [
  "Indigo runs remote operations desks:",
  "dispatch, support, scheduling, books,",
  "so your in-house team is not buried in the queue."
];

export function HeroImpact() {
  return (
    <div className="hero-scene hero-scene-impact" aria-hidden="true">
      <div className="hero-marquee">
        <span>Dispatch + Support + Books + Dispatch + Support + Books +</span>
        <span>Dispatch + Support + Books + Dispatch + Support + Books +</span>
      </div>
      <p className="hero-impact-kicker">SOPs first. Then people on the board.</p>
      <p className="hero-impact-foot">Handoffs you can audit.</p>
    </div>
  );
}

export default function HeroPinStory({ onContact, onAbout }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const trigger = document.querySelector(".hero-3d");
    const root = rootRef.current;
    if (!trigger || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const intro = q(".hero-scene-intro");
      const manifesto = q(".hero-scene-manifesto");
      const about = q(".hero-scene-about");
      const fillWords = q(".hero-fill-word");
      const impact = document.querySelector(".hero-scene-impact");

      const vh = window.innerHeight;
      const theme = getComputedStyle(document.querySelector(".hero-3d-frame") || document.documentElement);
      const fillIdle = theme.getPropertyValue("--text-tertiary").trim() || "#8e86a8";
      const fillActive = theme.getPropertyValue("--text-brand").trim() || "#b38cff";
      gsap.set(manifesto, { y: 0 });
      gsap.set(about, { y: vh * 1.15 });
      gsap.set(fillWords, { color: fillIdle, fontWeight: 200 });
      if (impact) gsap.set(impact, { y: vh * 1.05, autoAlpha: 0.15 });

      const stack = document.querySelector(".page-stack");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger,
          start: "top top",
          endTrigger: stack || trigger,
          end: stack ? "top top" : "bottom top",
          scrub: 0.45
        }
      });

      tl.to(intro, { y: -vh, duration: 0.12 }, 0);
      tl.to(manifesto, { y: -vh, duration: 0.14 }, 0);
      tl.to(fillWords, {
        color: fillActive,
        fontWeight: 800,
        stagger: { each: 0.01, from: "start" },
        duration: 0.06,
        ease: "none"
      }, 0.08);
      tl.to(manifesto, { y: -vh * 2, duration: 0.12 }, 0.22);
      tl.to(about, { y: 0, duration: 0.12 }, 0.22);
      tl.to(about, { y: -vh, duration: 0.12 }, 0.36);
      if (impact) {
        tl.to(impact, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.36);
      }
      tl.to({}, { duration: 0.55 }, 0.48);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="hero-overlay">
      <div className="hero-scene hero-scene-intro">
        <div className="hero-intro-copy">
          <HeroLockup />
          <button type="button" className="hero-cta" onClick={onContact}>
            Talk about your desk <ArrowUpRight size={14} />
          </button>
        </div>
        <button type="button" className="hero-scroll" onClick={onAbout}>
          Scroll
        </button>
      </div>

      <div className="hero-scene hero-scene-manifesto">
        <p>
          {manifestoLines.map((line) => (
            <span key={line} className="hero-fill-line">
              <FillWords text={line} />
            </span>
          ))}
        </p>
      </div>

      <div className="hero-scene hero-scene-about">
        <p className="hero-about-left">We write the process before we hire the seat. Otherwise the desk drifts.</p>
        <p className="hero-about-right">
          Most of the work is unglamorous: tickets answered, loads updated, invoices chased.
          That is the point. Steady coverage beats a slide deck.
        </p>
      </div>
    </div>
  );
}
