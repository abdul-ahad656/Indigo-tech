import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { heroServices } from "./HeroPinStory";
import { capabilities } from "../data/site";
import Reveal from "./Reveal";

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  const focusIndex = hovered ?? active;

  return (
    <section className="section services-section" aria-labelledby="services-heading">
      <div className="services-shell">
        <div className="services-index-head">
          <p className="services-index-kicker">The work we take on</p>
          <p className="services-index-count" aria-hidden="true">
            <span>{String(heroServices.length).padStart(2, "0")}</span>
            offerings
          </p>
        </div>

        <div className="services-index" role="list">
          {heroServices.map((service, i) => {
            const isActive = focusIndex === i;

            return (
              <Reveal key={service.title} delay={i * 0.04}>
                <article
                  role="listitem"
                  className={["service-row", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    type="button"
                    className="service-row-trigger"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setActive(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="service-row-no">{service.no}</span>
                    <span className="service-row-body">
                      <span className="service-row-title">{service.title}</span>
                      <span className="service-row-text">{service.text}</span>
                    </span>
                    <span className="service-row-arrow" aria-hidden="true">
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

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
