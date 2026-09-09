import { capabilities } from "../data/site";

/** Capabilities footer for Services — carousel lives in the About→Services pin viewport */
export default function ServicesSection() {
  return (
    <section className="section services-section" aria-label="Operations we support">
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
