import { Clock3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { company } from "../data/site";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="section contact">
      <div className="contact-card">
        <div className="contact-glow" />
        <Reveal>
          <div className="section-label">06 — LET'S WORK</div>
          <h2>Bring us the<br /><em>next challenge.</em></h2>
          <p>
            Need a BPO partner, dispatch team, customer support operation, lead-generation
            team or remote business support? Talk directly with Indigo Tech Solutions.
          </p>
          <div className="contact-actions">
            <a className="primary" href={`mailto:${company.email}`}><Mail size={18} /> Email Indigo</a>
            <a className="secondary dark-secondary" href={`tel:${company.phone}`}><Phone size={17} /> Call us</a>
          </div>
          <div className="contact-meta">
            <span><MapPin size={16} /> {company.location}</span>
            <span><Clock3 size={16} /> Remote operations</span>
            <span><ShieldCheck size={16} /> Business support</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
