import React from "react";
import { ArrowUpRight, Calculator, CalendarClock, Headphones, Route, ShoppingBag, Users } from "lucide-react";

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

export default function HeroPinStory({ onContact }) {
  return (
    <div className="hero-overlay">
      <div className="hero-scene hero-scene-intro">
        <div className="hero-intro-copy">
          <HeroLockup />
          <button type="button" className="hero-cta" onClick={onContact}>
            Start your desk <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
