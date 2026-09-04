import { team } from "../data/site";
import Reveal from "./Reveal";

export default function TeamSection() {
  return (
    <section id="team" className="section team-section">
      <div className="section-label">04 — LEADERSHIP</div>
      <Reveal>
        <div className="section-heading">
          <h2>People behind<br /><em>the operation.</em></h2>
          <p>A focused leadership team combining operational, financial and general management responsibilities.</p>
        </div>
      </Reveal>
      <div className="team-grid">
        {team.map((member, i) => (
          <Reveal key={member.name} delay={i * 0.08}>
            <article className="team-card">
              <div className="team-photo">
                <img
                  src={member.photo}
                  alt={member.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add("no-photo");
                  }}
                />
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
  );
}
