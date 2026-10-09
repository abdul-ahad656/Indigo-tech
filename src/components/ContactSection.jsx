import { company } from "../data/site";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="contact section-light">
      <div className="section-label">05 / START A DESK</div>
      <div className="contact-grid">
        <Reveal>
          <p className="eyebrow">YOUR NEXT QUEUE STARTS HERE</p>
          <h2>
            Ready when
            <br />
            <em>you are.</em>
          </h2>
          <p>
            Dispatch backlog, inbox pile-up, calendars slipping, books behind.
            Tell us what is breaking and we will say whether we can take the seat.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="contact-panel">
          <a className="contact-link" href={`tel:${company.phone}`}>
            <span>Call</span>
            <strong>{company.phone} ↗</strong>
          </a>
          <a className="contact-link" href={`mailto:${company.email}`}>
            <span>Email</span>
            <strong>{company.email} ↗</strong>
          </a>
          <div className="contact-link">
            <span>Based in</span>
            <strong>{company.location}</strong>
          </div>
          <a className="primary button wide" href={`mailto:${company.email}`}>
            Email Indigo <span>↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
