import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { heroServices } from "./HeroPinStory";
import { capabilities } from "../data/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesSection() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const focusIndex = hovered ?? active;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 900px)").matches;

    if (reduced || narrow) {
      root.classList.add("services-carousel--static");
      return () => root.classList.remove("services-carousel--static");
    }

    const ctx = gsap.context(() => {
      const pin = root.querySelector(".services-carousel-pin");
      const viewport = root.querySelector(".services-carousel-viewport");
      const track = root.querySelector(".services-carousel-track");
      const cards = root.querySelectorAll(".service-card-slide");

      if (!pin || !viewport || !track) return;

      const getTravel = () => {
        const extra = Math.max(0, track.scrollWidth - viewport.clientWidth);
        // Start off-screen to the right, then slide across
        return extra + window.innerWidth * 0.55;
      };

      gsap.set(track, { x: () => window.innerWidth * 0.55 });
      gsap.set(cards, { autoAlpha: 0.35 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${Math.max(getTravel() * 1.15, window.innerHeight * 2.2)}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        track,
        {
          x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth),
          duration: 1,
        },
        0
      );

      tl.to(
        cards,
        {
          autoAlpha: 1,
          stagger: { each: 0.08, from: "start" },
          duration: 0.35,
        },
        0
      );
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="section services-section services-carousel"
      aria-labelledby="services-heading"
    >
      <div className="services-carousel-pin">
        <div className="services-shell services-carousel-head">
          <p className="services-index-kicker">The work we take on</p>
          <p className="services-index-count" aria-hidden="true">
            <span>{String(heroServices.length).padStart(2, "0")}</span>
            offerings
          </p>
        </div>

        <div className="services-carousel-viewport">
          <div className="services-carousel-track" role="list">
            {heroServices.map((service, i) => {
              const isActive = focusIndex === i;

              return (
                <article
                  key={service.title}
                  role="listitem"
                  className={[
                    "service-card-slide",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    type="button"
                    className="service-card-slide-inner"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setActive(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="service-row-no">{service.no}</span>
                    <span className="service-card-slide-title">{service.title}</span>
                    <span className="service-card-slide-text">{service.text}</span>
                    <span className="service-row-arrow" aria-hidden="true">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="services-shell">
        <div className="capability-wrap">
          <span className="micro-label">OPERATIONS WE SUPPORT</span>
          <div className="capability-cloud">
            {capabilities.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
