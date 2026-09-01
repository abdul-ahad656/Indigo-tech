import React from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll } from "framer-motion";
import Hero3DLogo from "./components/Hero3DLogo";
import {
  ArrowDown, ArrowUp, BriefcaseBusiness, ChevronRight, Clock3, Globe,
  Headphones, Mail, MapPin, MessageCircle, Phone, Route, ShieldCheck,
  Target, Users, Zap
} from "lucide-react";
import "./styles.css";

/* ================================================================
   INDIGO TECH SOLUTIONS — EDIT YOUR CONTACT DETAILS HERE
   ================================================================ */
const company = {
  name: "Indigo Tech Solutions",
  shortName: "ITS",
  tagline: "Smart Solutions. Stronger Businesses. Better Opportunities.",
  location: "Lahore, Pakistan",
  phone: "+1 (410) 888 0019",
  email: "hello@indigotech.com",
  linkedin: "https://www.linkedin.com/company/indigo-tech-solutions/",
};

/* ================================================================
   TEAM PHOTOS
   Put your real photos in: public/assets/team/
   Then keep these exact filenames OR change the src values below.
   ================================================================ */
const team = [
  {
    name: "Hafiz Abdullah Ather",
    fallback: "HA",
    bio: "Leads company strategy, client operations, logistics, dispatch, BPO delivery and business development."
  },
  {
    name: "Alman Ahmad",
    fallback: "AA",
    bio: "Oversees financial planning, reporting, commercial discipline and operational growth support."
  },
  {
    name: "Umair Gondal",
    fallback: "UG",
    bio: "Coordinates day-to-day operations, teams, service quality and execution across client accounts."
  }
];

const services = [
  {
    no: "01", icon: Headphones, title: "Client Acquisition & Support",
    text: "Professional customer communication, inbound and outbound support, order handling, issue resolution and client relationship management."
  },
  {
    no: "02", icon: BriefcaseBusiness, title: "Business Process Outsourcing",
    text: "Flexible BPO support for businesses that need reliable people, structured processes, responsive communication and scalable operations."
  },
  {
    no: "03", icon: Route, title: "Logistics / Truck Dispatch & Freight Brokerage",
    text: "Streamlining freight operations through reliable truck dispatching, carrier coordination, load management, and cost-effective transportation solutions."
  },
  {
    no: "04", icon: Target, title: "Customer Support & Dispatch Operations",
    text: "Providing responsive customer support and efficient dispatch coordination to ensure smooth, timely, and reliable service delivery."
  },
  {
    no: "05", icon: Zap, title: "Appointment Scheduling",
    text: "Seamlessly schedule and manage client appointments with Indigo Tech Solutions for efficient, hassle-free service coordination."
  },
  {
    no: "06", icon: Users, title: "Talent Hiring & Recruitment",
    text: "Recruitment support and talent sourcing designed to help growing businesses build dependable remote and operational teams."
  }
];

const capabilities = [
  "Dispatch Services", "Appointment Scheduling", "Accounts Receivable", "Plumbing and HVAC scheduling",
  "Customer Support", "Order Management", "Freight Brokerage", "Email & Chat Support",
  "Business Development", "Technical Support", "CRM Operations",
  "Startup bookkeeping", "Truck and auto dispatch", "Carrier Management", "Remote BPO"
];

/* These are clearly marked sample placeholders. Replace them with verified client feedback before publishing. */
const feedback = [
  {
    quote: "Indigo's team brought structure to our day-to-day customer operations and kept communication consistent from start to finish.",
    person: "Sample Client — replace before publishing",
    role: "Operations / Customer Support"
  },
  {
    quote: "The dispatch support helped us stay organized across loads, carriers and shipment updates while keeping our customers informed.",
    person: "Sample Client — replace before publishing",
    role: "Logistics / Dispatch"
  },
  {
    quote: "What stood out was the responsiveness. The team treated every task as an operational responsibility rather than just another ticket.",
    person: "Sample Client — replace before publishing",
    role: "BPO"
  }
];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const heroWords = ["businesses.", "operations.", "outcomes."];

function HeroWord() {
  const [index, setIndex] = React.useState(0);
  const reduced = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    if (reduced) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % heroWords.length), 2800);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <span key={heroWords[index]} className="hero-word">
      {heroWords[index]}
    </span>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!event.target.closest(".nav")) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site">
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />

      <nav className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <button className="brand" onClick={() => go("top")} aria-label="Go home">
          <img src="/assets/indigo-logo.jpg" alt="Indigo Tech Solutions logo" />
          <span>Indigo</span>
        </button>

        <div className="nav-end">
          <button className="nav-talk" onClick={() => go("contact")}>Let's talk</button>
          <button
            className="nav-menu"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "Close ×" : "Menu ="}
          </button>
        </div>

        <div className={`nav-panel ${open ? "open" : ""}`}>
          {[
            ["about", "Company"], ["services", "Services"], ["team", "Team"],
            ["feedback", "Feedback"], ["contact", "Contact"]
          ].map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>{label}</button>
          ))}
        </div>
      </nav>

      <main id="top">
        <Hero3DLogo>
          <div className="hero-overlay">
            <h1 className="hero-headline">
              Smart solutions.<br />
              Stronger <HeroWord />
            </h1>

            <div className="hero-bottom">
              <button className="hero-scroll" onClick={() => go("about")} aria-label="Scroll to about">
                <ArrowDown size={16} />
              </button>

              <div className="hero-hint">
                <span>Scroll to explode</span>
                <span>Dare to watch the mark.</span>
              </div>

              <div className="hero-meta">
                <div className="hero-est">
                  <span className="hero-est-mark">
                    <Globe size={15} />
                    <b>Lahore</b>
                  </span>
                  <span>Remote operations. Reliable delivery.</span>
                </div>
                <p>BPO, logistics, dispatch, and customer support built for clarity, scale and impact.</p>
              </div>
            </div>
          </div>
        </Hero3DLogo>

        <section className="ticker" aria-label="Indigo services">
          {[...capabilities, ...capabilities].map((x, i) => <span key={i}>{x}<b>✦</b></span>)}
        </section>

        <section id="about" className="section about">
          <div className="section-label">01 — THE COMPANY</div>
          <div className="about-grid">
            <Reveal className="sticky-title"><h2>Built to<br/><em>operate.</em></h2></Reveal>
            <Reveal delay={0.08}>
              <p className="large-copy">
                Indigo Tech Solutions is a BPO and business services company built around
                reliable execution, responsive communication and practical operational support.
              </p>
              <p className="body-copy">
                Our capabilities bring together hands-on experience in logistics dispatch,
                freight coordination, customer support, lead generation, business development,
                technical support and process management — delivered as services for businesses
                that need dependable remote operations.
              </p>
              <div className="stat-row">
                <div><strong>BPO</strong><span>Core operations</span></div>
                <div><strong>360°</strong><span>Business support</span></div>
                <div><strong>Remote</strong><span>Delivery model</span></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="services" className="section dark services-section">
          <div className="section-label">02 — SERVICES</div>
          <Reveal>
            <div className="section-heading light">
              <h2>Services that <em>move</em> business.</h2>
              <p>From customer contact to logistics execution, Indigo turns operational work into dependable business support.</p>
            </div>
          </Reveal>

          <div className="service-grid">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={i * 0.05}>
                  <motion.article className="service-card" whileHover={{ y: -8 }} transition={{ duration: 0.25 }}>
                    <div className="service-top"><span>{service.no}</span><Icon size={23}/></div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <div className="service-line" />
                    <ChevronRight size={18}/>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>

          <div className="capability-wrap">
            <span className="micro-label">OPERATIONS WE SUPPORT</span>
            <div className="capability-cloud">{capabilities.map(x => <span key={x}>{x}</span>)}</div>
          </div>
        </section>

        <section className="video-section">
          <div className="video-copy">
            <Reveal>
              <div className="section-label">03 — TECHNOLOGY IN MOTION</div>
              <h2>Human operations.<br/><em>Tech-enabled.</em></h2>
              <p>
                Add your own technology or BPO showreel here. The website is already wired
                for a muted, looping background video with an animated fallback layer.
              </p>
              <div className="video-note"><Zap size={16}/> Recommended: 8–15 second MP4, 16:9, compressed for web.</div>
            </Reveal>
          </div>
          <Reveal className="video-frame" delay={0.08}>
            <video autoPlay muted loop playsInline poster="/assets/company-banner.png">
              <source src="/videos/tech-showreel.mp4" type="video/mp4" />
            </video>
            <div className="video-fallback">
              <div className="scanline" />
              <div className="circuit circuit-a" /><div className="circuit circuit-b" />
              <div className="video-center"><img src="/assets/indigo-logo.jpg" alt="Indigo"/><span>INDIGO SYSTEMS / ONLINE</span></div>
            </div>
            <div className="video-caption"><span>INDIGO / DIGITAL OPERATIONS</span><span>LIVE LOOP</span></div>
          </Reveal>
        </section>

        <section id="team" className="section team-section">
          <div className="section-label">04 — LEADERSHIP</div>
          <Reveal>
            <div className="section-heading">
              <h2>People behind<br/><em>the operation.</em></h2>
              <p>A focused leadership team combining operational, financial and general management responsibilities.</p>
            </div>
          </Reveal>
          <div className="team-grid">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <article className="team-card">
                  <div className="team-photo">
                    <img src={member.photo} alt={member.name} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add("no-photo"); }} />
                    <span className="photo-fallback">{member.fallback}</span>
                    <span className="photo-label">TEAM / 0{i + 1}</span>
                  </div>
                  <div className="team-info">
                    <span className="role">{member.role}</span>
                    <h3>{member.name}</h3>
                    <p>{member.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="feedback" className="section feedback-section">
          <div className="section-label">05 — CLIENT FEEDBACK</div>
          <Reveal>
            <div className="section-heading">
              <h2>Built on<br/><em>responsiveness.</em></h2>
              <p>Replace the sample cards below with verified client testimonials before publishing them as real feedback.</p>
            </div>
          </Reveal>
          <div className="feedback-grid">
            {feedback.map((item, i) => (
              <Reveal key={item.person} delay={i * 0.08}>
                <article className="feedback-card">
                  <MessageCircle size={23}/>
                  <p>“{item.quote}”</p>
                  <div><strong>{item.person}</strong><span>{item.role}</span></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-card">
            <div className="contact-glow" />
            <Reveal>
              <div className="section-label">06 — LET'S WORK</div>
              <h2>Bring us the<br/><em>next challenge.</em></h2>
              <p>
                Need a BPO partner, dispatch team, customer support operation, lead-generation
                team or remote business support? Talk directly with Indigo Tech Solutions.
              </p>
              <div className="contact-actions">
                <a className="primary" href={`mailto:${company.email}`}><Mail size={18}/> Email Indigo</a>
                <a className="secondary dark-secondary" href={`tel:${company.phone}`}><Phone size={17}/> Call us</a>
              </div>
              <div className="contact-meta">
                <span><MapPin size={16}/> {company.location}</span>
                <span><Clock3 size={16}/> Remote operations</span>
                <span><ShieldCheck size={16}/> Business support</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img src="/assets/indigo-logo.jpg" alt="Indigo"/><span>{company.name}</span></div>
        <span>BPO · Logistics · Customer Experience · Business Growth</span>
        <button onClick={() => go("top")}><ArrowUp size={16}/> Back to top</button>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
