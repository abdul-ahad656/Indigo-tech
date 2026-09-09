import { useState } from "react";
import { heroServices } from "./HeroPinStory";
import { capabilities } from "../data/site";
import Reveal from "./Reveal";

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  const focusIndex = hovered ?? active;

  return (
    <section id="services" className="section services-section" aria-labelledby="services-heading">
      <div className="services-shell">
        <div className="section-label">02 — SERVICES</div>

        <div className="services-layout">
          <Reveal className="services-intro sticky-title">
            <h2 id="services-heading">
              Services that
              <br />
              <em>move</em> business.
            </h2>
            <p className="services-lede">
              Offshoring, support, dispatch, scheduling, books and ecommerce — operational work
              delivered as dependable business support.
            </p>
            <div className="services-index-meta" aria-hidden="true">
              <span>{String(heroServices.length).padStart(2, "0")}</span>
              <span>Capabilities</span>
            </div>
          </Reveal>

          <div className="services-index" role="list">
            {heroServices.map((service, i) => {
              const isActive = focusIndex === i;
              const isFeatured = i === 0;
              const isOpen = focusIndex === i;

              return (
                <Reveal key={service.title} delay={i * 0.04}>
                  <article
                    role="listitem"
                    className={[
                      "service-row",
                      isActive ? "is-active" : "",
                      isFeatured ? "is-featured" : "",
                      isOpen ? "is-open" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <button
                      type="button"
                      className="service-row-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`service-panel-${service.no}`}
                      id={`service-trigger-${service.no}`}
                      onClick={() => setActive(i)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                    >
                      <span className="service-row-no">{service.no}</span>
                      <span className="service-row-title">{service.title}</span>
                      <span className="service-row-rule" aria-hidden="true" />
                    </button>

                    <div
                      id={`service-panel-${service.no}`}
                      role="region"
                      aria-labelledby={`service-trigger-${service.no}`}
                      className="service-row-panel"
                    >
                      <div className="service-row-panel-inner">
                        <p>{service.text}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
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
