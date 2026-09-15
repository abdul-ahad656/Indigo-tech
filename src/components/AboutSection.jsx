import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="section-label">01 · THE COMPANY</div>
      <div className="about-grid">
        <Reveal className="sticky-title"><h2>Built to<br /><em>operate.</em></h2></Reveal>
        <Reveal delay={0.08}>
          <p className="large-copy">
            Indigo Tech Solutions is a remote BPO shop. We sit on dispatch boards,
            support inboxes, calendars, and books for teams that need coverage
            without building another local department.
          </p>
          <p className="body-copy">
            A lot of our day looks the same: exceptions on a freight board, a missed
            appointment callback, an invoice that never left draft. We take those
            desks, document how you want them run, and keep a named lead on the
            account so you are not guessing who owns the queue.
          </p>
          <div className="stat-row">
            <div><strong>BPO</strong><span>Core desks</span></div>
            <div><strong>Remote</strong><span>Delivery model</span></div>
            <div><strong>Named</strong><span>Account lead</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
