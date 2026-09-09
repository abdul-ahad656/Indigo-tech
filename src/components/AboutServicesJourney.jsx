import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STRIP_COUNT = 7;

export default function AboutServicesJourney() {
  const rootRef = useRef(null);

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
      const content = root.querySelector(".strip-content");
      const label = root.querySelector(".strip-content-label");
      const title = root.querySelector(".strip-content-title");
      const lede = root.querySelector(".strip-content-lede");

      gsap.set(bands, { scaleY: 0, transformOrigin: "50% 50%" });
      gsap.set(blinds, { gap: "5vh" });
      gsap.set(content, { autoAlpha: 0 });
      gsap.set([label, title, lede], { y: 36, autoAlpha: 0 });
      gsap.set(title, { scale: 0.96, transformOrigin: "center center" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          // Wait until About has fully scrolled through, then freeze
          start: "bottom bottom",
          end: "+=220%",
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
        },
      });

      // 1) Brief hold on the finished About
      tl.to({}, { duration: 0.14 }, 0);

      // 2) Dark strips expand over the pinned About
      tl.to(
        bands,
        {
          scaleY: 1,
          duration: 0.4,
          stagger: { each: 0.012, from: "center" },
        },
        0.14
      );
      tl.to(blinds, { gap: 0, duration: 0.4 }, 0.14);

      // 3) Services details
      tl.to(content, { autoAlpha: 1, duration: 0.1 }, 0.48);
      tl.to(label, { y: 0, autoAlpha: 1, duration: 0.14 }, 0.5);
      tl.to(
        title,
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.22,
        },
        0.54
      );
      tl.to(lede, { y: 0, autoAlpha: 1, duration: 0.16 }, 0.66);
      tl.to({}, { duration: 0.14 }, 0.82);
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="strip-journey">
      <div className="strip-pin">
        {/* About scrolls normally first (sticky title included) */}
        <div className="strip-about-plane">
          <AboutSection />
        </div>

        {/* Covers the visible About viewport only after About finishes */}
        <div className="strip-overlay" aria-hidden="true">
          <div className="strip-blinds">
            {Array.from({ length: STRIP_COUNT }, (_, i) => (
              <div key={i} className="strip-band" />
            ))}
          </div>
        </div>

        <div className="strip-content">
          <p className="strip-content-label">02 — Services</p>
          <h2 className="strip-content-title" id="services-heading">
            Services that
            <br />
            <em>move</em> business.
          </h2>
          <p className="strip-content-lede">
            Offshoring, support, dispatch, scheduling, books and ecommerce — operational work
            delivered as dependable business support.
          </p>
        </div>
      </div>

      <div id="services" className="services-chapter">
        <ServicesSection />
      </div>
    </div>
  );
}
