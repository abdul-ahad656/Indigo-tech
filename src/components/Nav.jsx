import { navLinks } from "../data/site";

export default function Nav({ scrolled, open, setOpen, onNavigate }) {
  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <button className="brand" onClick={() => onNavigate("top")} aria-label="Go home">
        <img src="/assets/indigo-logo.jpg" alt="Indigo Tech Solutions logo" />
        <span>Indigo</span>
      </button>

      <div className="nav-end">
        <button className="nav-talk" onClick={() => onNavigate("contact")}>Let's talk</button>
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
        {navLinks.map(([id, label]) => (
          <button key={id} onClick={() => onNavigate(id)}>{label}</button>
        ))}
      </div>
    </nav>
  );
}
