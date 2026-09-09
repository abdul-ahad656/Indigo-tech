import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import { heroServices } from "./HeroPinStory";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STRIP_COUNT = 7;

export default function AboutServicesJourney() {
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
      root.classList.add("strip-journey--static");
      return () => root.classList.remove("strip-journey--static");
    }

    const ctx = gsap.context(() => {
      const pin = root.querySelector(".strip-pin");
      const blinds = root.querySelector(".strip-blinds");
      const bands = root.querySelectorAll(".strip-band");
      const stage = root.querySelector(".strip-services-stage");
      const intro = root.querySelector(".strip-intro");
      const label = root.querySelector(".strip-content-label");
      const title = root.querySelector(".strip-content-title");
      const lede = root.querySelector(".strip-content-lede");
      const carousel = root.querySelector(".strip-carousel");
      const viewport = root.querySelector(".strip-carousel-viewport");
      const track = root.querySelector(".strip-carousel-track");
      const cards = root.querySelectorAll(".service-card-slide");

      gsap.set(bands, { scaleY: 0, transformOrigin: "50% 50%" });
      gsap.set(blinds, { gap: "5vh" });
      gsap.set(stage, { autoAlpha: 0 });
      gsap.set(intro, {
        top: "50%",
        yPercent: -50,
        left: "50%",
        xPercent: -50,
        x: 0,
        width: "min(720px, 86vw)",
        textAlign: "center",
        alignItems: "center",
      });
      gsap.set(lede, { marginLeft: "auto", marginRight: "auto", textAlign: "center" });
      gsap.set([label, title, lede], { y: 36, autoAlpha: 0 });
      gsap.set(title, { scale: 0.96, transformOrigin: "center center" });
      gsap.set(carousel, {
        top: "50%",
        yPercent: -50,
        autoAlpha: 0,
        left: "36%",
        right: "0%",
        xPercent: 18,
        x: 0,
      });
      if (track) gsap.set(track, { x: 0 });
      if (cards.length) gsap.set(cards, { autoAlpha: 0.4 });

      const getCarouselTravel = () => {
        if (!track || !viewport) return window.innerWidth;
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight * 3.6 + getCarouselTravel() * 0.85}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1) Hold finished About
      tl.to({}, { duration: 0.1 }, 0);

      // 2) Dark strips expand over About
      tl.to(
        bands,
        {
          scaleY: 1,
          duration: 0.28,
          stagger: { each: 0.01, from: "center" },
        },
        0.1
      );
      tl.to(blinds, { gap: 0, duration: 0.28 }, 0.1);

      // 3) Services intro appears centered in this viewport
      tl.to(stage, { autoAlpha: 1, duration: 0.08 }, 0.34);
      tl.to(label, { y: 0, autoAlpha: 1, duration: 0.1 }, 0.36);
      tl.to(
        title,
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.16,
        },
        0.38
      );
      tl.to(lede, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.46);
      tl.to({}, { duration: 0.08 }, 0.54);

      // 4) Intro slides left — carousel enters from the right (same viewport)
      tl.to(
        intro,
        {
          left: "5vw",
          xPercent: 0,
          x: 0,
          yPercent: -50,
          width: "min(340px, 32vw)",
          textAlign: "left",
          alignItems: "flex-start",
          duration: 0.22,
        },
        0.56
      );
      tl.to(
        lede,
        {
          marginLeft: 0,
          marginRight: 0,
          textAlign: "left",
          duration: 0.22,
        },
        0.56
      );
      tl.to(
        [label, title],
        {
          textAlign: "left",
          duration: 0.22,
        },
        0.56
      );
      tl.to(
        title,
        {
          scale: 0.7,
          transformOrigin: "left center",
          duration: 0.22,
        },
        0.56
      );
      tl.to(
        carousel,
        {
          autoAlpha: 1,
          xPercent: 0,
          x: 0,
          yPercent: -50,
          duration: 0.22,
        },
        0.58
      );
      tl.to(
        cards,
        {
          autoAlpha: 1,
          stagger: 0.04,
          duration: 0.18,
        },
        0.6
      );

      // 5) Carousel advances while text stays on the left
      tl.to(
        track,
        {
          x: () => -getCarouselTravel(),
          duration: 0.42,
        },
        0.72
      );
      tl.to({}, { duration: 0.08 }, 0.92);
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
    <div ref={rootRef} className="strip-journey">
      <div className="strip-pin">
        <div className="strip-about-plane">
          <AboutSection />
        </div>

        <div className="strip-overlay" aria-hidden="true">
          <div className="strip-blinds">
            {Array.from({ length: STRIP_COUNT }, (_, i) => (
              <div key={i} className="strip-band" />
            ))}
          </div>
        </div>

        <div className="strip-services-stage">
          <div className="strip-intro">
            <p className="strip-content-label">02 — Services</p>
            <h2 className="strip-content-title" id="services-heading">
              Services that
              <br />
              <em>move</em> business.
            </h2>
            <p className="strip-content-lede">
              Offshoring, support, dispatch, scheduling, books and ecommerce, and operational work
              delivered as dependable business support.
            </p>
          </div>

          <div className="strip-carousel">
            <div className="strip-carousel-viewport">
              <div className="strip-carousel-track" role="list">
                {heroServices.map((service, i) => {
                  const isActive = focusIndex === i;
                  return (
                    <article
                      key={service.title}
                      role="listitem"
                      className={["service-card-slide", isActive ? "is-active" : ""]
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
        </div>
      </div>

      <div id="services" className="services-chapter">
        <ServicesSection />
      </div>
    </div>
  );
}
