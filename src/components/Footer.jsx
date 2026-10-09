import { company } from "../data/site";

export default function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="footer-brand">
        <img src="/assets/indigo-logo.jpg" alt="" />
        <span>
          {company.name}
          <small>BPO · DISPATCH · SUPPORT</small>
        </span>
      </div>
      <p>© {new Date().getFullYear()} Indigo Tech Solutions. All rights reserved.</p>
      <button type="button" onClick={() => onNavigate("top")}>
        Back to top ↑
      </button>
    </footer>
  );
}
