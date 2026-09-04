import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { heroServices } from "./HeroPinStory";
import { capabilities } from "../data/site";
import Reveal from "./Reveal";

export default function ServicesSection() {
  return (
    <section id="services" className="section dark services-section">
      <div className="section-label">02 — SERVICES</div>
      <Reveal>
        <div className="section-heading light">
          <h2>Services that <em>move</em> business.</h2>
          <p>Offshoring, support, dispatch, scheduling, books and ecommerce — operational work delivered as dependable business support.</p>
        </div>
      </Reveal>

      <div className="service-grid">
        {heroServices.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={i * 0.05}>
              <motion.article className="service-card" whileHover={{ y: -8 }} transition={{ duration: 0.25 }}>
                <div className="service-top"><span>{service.no}</span><Icon size={23} /></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-line" />
                <ChevronRight size={18} />
              </motion.article>
            </Reveal>
          );
        })}
      </div>

      <div className="capability-wrap">
        <span className="micro-label">OPERATIONS WE SUPPORT</span>
        <div className="capability-cloud">{capabilities.map((x) => <span key={x}>{x}</span>)}</div>
      </div>
    </section>
  );
}
