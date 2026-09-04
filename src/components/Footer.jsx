import { ArrowUp } from "lucide-react";
import { company } from "../data/site";

export default function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="footer-brand">
        <img src="/assets/indigo-logo.jpg" alt="Indigo" />
        <span>{company.name}</span>
      </div>
      <span>BPO · Logistics · Customer Experience · Business Growth</span>
      <button onClick={() => onNavigate("top")}><ArrowUp size={16} /> Back to top</button>
    </footer>
  );
}
