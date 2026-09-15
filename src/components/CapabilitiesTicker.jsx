import { capabilities } from "../data/site";

export default function CapabilitiesTicker() {
  return (
    <section className="ticker" aria-label="Indigo desks">
      <div className="ticker-track">
        {[...capabilities, ...capabilities].map((x, i) => (
          <span key={i}>{x}<b>✦</b></span>
        ))}
      </div>
    </section>
  );
}
