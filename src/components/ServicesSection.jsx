import { capabilities } from "../data/site";

/** Capabilities block  -  sits on the sliding services exit panel */
export default function ServicesSection() {
  return (
    <section className="services-section" aria-label="Desks we cover">
      <div className="services-shell">
        <div className="capability-wrap">
          <span className="micro-label">DESKS WE COVER</span>
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
