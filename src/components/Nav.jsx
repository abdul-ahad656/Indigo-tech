import { navLinks } from "../data/site";

export default function Nav({ scrolled, open, setOpen, onNavigate, onPage }) {
  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${onPage ? "is-on-page" : ""}`}>
      <button className="brand" onClick={() => onNavigate("top")} aria-label="Go home">
        <img src="/assets/indigo-mark.png" alt="" />
        <span>
          INDIGO
          <small>TECH SOLUTIONS</small>
        </span>
      </button>

      <nav className="nav-links" aria-label="Primary">
        {navLinks.map(([id, label]) => (
          <button key={id} type="button" onClick={() => onNavigate(id)}>
            {label}
          </button>
        ))}
        <button type="button" className="nav-cta" onClick={() => onNavigate("contact")}>
          Start a desk
        </button>
      </nav>

      <div className="nav-end">
        <button className="nav-talk" type="button" onClick={() => onNavigate("contact")}>
          Email us
        </button>
        <button
          className="nav-menu"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close ×" : "Menu"}
        </button>
      </div>

      <div className={`nav-panel ${open ? "open" : ""}`}>
        {navLinks.map(([id, label]) => (
          <button key={id} type="button" onClick={() => onNavigate(id)}>
            {label}
          </button>
        ))}
        <button type="button" className="nav-panel-cta" onClick={() => onNavigate("contact")}>
          Start a desk
        </button>
      </div>
    </header>
  );
}
