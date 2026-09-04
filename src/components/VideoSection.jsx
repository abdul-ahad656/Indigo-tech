import { Zap } from "lucide-react";
import Reveal from "./Reveal";

export default function VideoSection() {
  return (
    <section className="video-section">
      <div className="video-copy">
        <Reveal>
          <div className="section-label">03 — TECHNOLOGY IN MOTION</div>
          <h2>Human operations.<br /><em>Tech-enabled.</em></h2>
          <p>
            Add your own technology or BPO showreel here. The website is already wired
            for a muted, looping background video with an animated fallback layer.
          </p>
          <div className="video-note"><Zap size={16} /> Recommended: 8–15 second MP4, 16:9, compressed for web.</div>
        </Reveal>
      </div>
      <Reveal className="video-frame" delay={0.08}>
        <video autoPlay muted loop playsInline poster="/assets/company-banner.png">
          <source src="/videos/tech-showreel.mp4" type="video/mp4" />
        </video>
        <div className="video-fallback">
          <div className="scanline" />
          <div className="circuit circuit-a" /><div className="circuit circuit-b" />
          <div className="video-center"><img src="/assets/indigo-logo.jpg" alt="Indigo" /><span>INDIGO SYSTEMS / ONLINE</span></div>
        </div>
        <div className="video-caption"><span>INDIGO / DIGITAL OPERATIONS</span><span>LIVE LOOP</span></div>
      </Reveal>
    </section>
  );
}
