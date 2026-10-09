import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import CapabilitiesTicker from "./CapabilitiesTicker";
import VideoSection from "./VideoSection";
import { heroServices } from "./HeroPinStory";

export default function AboutServicesJourney() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const focusIndex = hovered ?? active;

  return (
    <div className="strip-journey strip-journey--static">
      <div className="strip-pin">
        <div className="strip-about-plane">
          <AboutSection />
        </div>

        <div className="strip-services-stage" id="services">
          <div className="strip-intro">
            <p className="strip-content-label">02 / WHAT WE RUN</p>
            <div className="strip-intro-head">
              <h2 className="strip-content-title" id="services-heading">
                Desks we
                <br />
                <em>actually</em> run.
              </h2>
              <p className="strip-content-lede">
                Offshoring, support, dispatch, trade scheduling, bookkeeping, and store ops.
                Same idea each time: a staffed queue with a clear owner.
              </p>
            </div>
          </div>

          <div className="service-grid" role="list">
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

      <div className="services-exit">
        <div className="services-exit-track">
          <div className="services-exit-sticky">
            <div className="services-exit-panel">
              <ServicesSection />
            </div>
            <div className="services-exit-under">
              <CapabilitiesTicker />
              <VideoSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
