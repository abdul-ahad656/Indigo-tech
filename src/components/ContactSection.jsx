import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { company } from "../data/site";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="section contact">
      <div className="contact-card">
        <div className="contact-glow" />
        <Reveal>
          <div className="section-label">05 · START A DESK</div>
          <h2>Tell us what<br /><em>is breaking.</em></h2>
          <p>
            Dispatch backlog, inbox pile-up, calendars slipping, books behind.
            Email or call and we will say whether we can take the seat.
          </p>
          <div className="contact-actions">
            <a className="primary" href={`mailto:${company.email}`}><Mail size={18} /> Email Indigo</a>
            <a className="secondary dark-secondary" href={`tel:${company.phone}`}><Phone size={17} /> Call the desk</a>
          </div>
          <div className="contact-meta">
            <span><MapPin size={16} /> {company.location}</span>
            <span><Clock3 size={16} /> Remote coverage</span>
            <span><ShieldCheck size={16} /> Named account lead</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
