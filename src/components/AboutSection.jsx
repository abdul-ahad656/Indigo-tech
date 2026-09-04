import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="section-label">01 — THE COMPANY</div>
      <div className="about-grid">
        <Reveal className="sticky-title"><h2>Built to<br /><em>operate.</em></h2></Reveal>
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
  );
}
