import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown, ArrowUpRight, Calculator, CalendarClock, Globe, Headphones,
  Route, ShoppingBag, Users
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const heroServices = [
  {
    no: "01",
    icon: Users,
    title: "Offshoring / Outsourcing",
    text: "Scale operations with trained remote teams instead of building a full in-house department. We set the process, staff the work, and keep delivery accountable from day one."
  },
  {
    no: "02",
    icon: Headphones,
    title: "Customer Support",
    text: "Inbound, outbound, chat and email support that stays on-brand and on-time. We handle tickets, follow-ups and customer conversations so your team can stay on growth work."
  },
  {
    no: "03",
    icon: Route,
    title: "Dispatch Operations",
    text: "Coordinate jobs, drivers, loads and field teams from one reliable desk. Live updates, tighter routing and fewer missed windows for companies that cannot afford delay."
  },
  {
    no: "04",
    icon: CalendarClock,
    title: "Scheduling for Service Companies",
    text: "Book, confirm and reshuffle appointments for HVAC, plumbing, roofing and other trade businesses. Calendars stay full, technicians stay informed, and customers stay notified."
  },
  {
    no: "05",
    icon: Calculator,
    title: "Financial Management",
    text: "Day-to-day bookkeeping and reporting in Zoho, QuickBooks and Xero. Invoices, reconciliations and clean books so you always know where the money sits."
  },
  {
    no: "06",
    icon: ShoppingBag,
    title: "Ecommerce Stores",
    text: "We build and run ecommerce stores that can take orders. Catalog setup, checkout, customer handling and daily operations sit with one team from launch through live trading."
  }
];

const heroWords = ["businesses.", "operations.", "outcomes."];

function HeroWord() {
  const [index, setIndex] = React.useState(0);
  const reduced = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    if (reduced) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % heroWords.length), 2800);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <span key={heroWords[index]} className="hero-word">
      {heroWords[index]}
    </span>
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
  "Indigo is an operations partner helping",
  "businesses run smarter through people, process,",
  "and technology.",
];

export function HeroImpact() {
  return (
    <div className="hero-scene hero-scene-impact" aria-hidden="true">
      <div className="hero-marquee">
        <span>Operate + Support + Scale + Operate + Support + Scale +</span>
        <span>Operate + Support + Scale + Operate + Support + Scale +</span>
      </div>
      <p className="hero-impact-kicker">Focused vision. Measured execution.</p>
      <p className="hero-impact-foot">✦ From idea to outcome.</p>
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
      gsap.set(manifesto, { y: 0 });
      gsap.set(about, { y: vh * 1.15 });
      gsap.set(fillWords, { color: "#8f88a8" });
      if (impact) gsap.set(impact, { y: vh * 1.05, autoAlpha: 0.15 });

      const stack = document.querySelector(".page-stack");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger,
          start: "top top",
          endTrigger: stack || trigger,
          end: stack ? "top top" : "bottom top",
          scrub: 0.45,
        },
      });

      tl.to(intro, { y: -vh, duration: 0.12 }, 0);
      tl.to(manifesto, { y: -vh, duration: 0.14 }, 0);
      tl.to(fillWords, {
        color: "#4d2fc4",
        stagger: { each: 0.01, from: "start" },
        duration: 0.06,
        ease: "none",
      }, 0.08);
      tl.to(manifesto, { y: -vh * 2, duration: 0.12 }, 0.22);
      tl.to(about, { y: 0, duration: 0.12 }, 0.22);
      tl.to(about, { y: -vh, duration: 0.12 }, 0.36);
      if (impact) {
        tl.to(impact, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.36);
      }
      /* Hold final hero frame while About slides over */
      tl.to({}, { duration: 0.55 }, 0.48);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="hero-overlay">
      <div className="hero-scene hero-scene-intro">
        <h1 className="hero-headline">
          Smart solutions.<br />
          Stronger <HeroWord />
        </h1>
        <div className="hero-intro-links">
          <button type="button" onClick={onContact}>Discuss your project <ArrowUpRight size={14} /></button>
          <button type="button" onClick={onContact}>Book a 30-minute call <ArrowUpRight size={14} /></button>
        </div>
        <div className="hero-bottom">
          <button className="hero-scroll" onClick={onAbout} aria-label="Scroll to about">
            <ArrowDown size={16} />
          </button>
          <div className="hero-meta">
            <div className="hero-est">
              <span className="hero-est-mark">
                <Globe size={15} />
                <b>Lahore</b>
              </span>
              <span>Remote operations. Reliable delivery.</span>
            </div>
            <p>BPO, logistics, dispatch, and customer support built for clarity, scale and impact.</p>
          </div>
        </div>
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
        <p className="hero-about-left">We design for longevity. Clarity first, craft always, built to scale.</p>
        <p className="hero-about-right">
          Our mission is to make operations feel human by delivering support that is
          reliable, purposeful, and meaningful to growing teams.
        </p>
      </div>
    </div>
  );
}
