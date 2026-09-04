import { MessageCircle } from "lucide-react";
import { feedback } from "../data/site";
import Reveal from "./Reveal";

export default function FeedbackSection() {
  return (
    <section id="feedback" className="section feedback-section">
      <div className="section-label">05 — CLIENT FEEDBACK</div>
      <Reveal>
        <div className="section-heading">
          <h2>Built on<br /><em>responsiveness.</em></h2>
          <p>Replace the sample cards below with verified client testimonials before publishing them as real feedback.</p>
        </div>
      </Reveal>
      <div className="feedback-grid">
        {feedback.map((item, i) => (
          <Reveal key={item.person} delay={i * 0.08}>
            <article className="feedback-card">
              <MessageCircle size={23} />
              <p>“{item.quote}”</p>
              <div><strong>{item.person}</strong><span>{item.role}</span></div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
