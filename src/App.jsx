import React from "react";
import Hero3DLogo from "./components/Hero3DLogo";
import HeroPinStory from "./components/HeroPinStory";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AboutServicesJourney from "./components/AboutServicesJourney";
import FeedbackSection from "./components/FeedbackSection";
import ContactSection from "./components/ContactSection";

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [onPage, setOnPage] = React.useState(false);
  const glowRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setOnPage(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const onMove = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
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
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      <Nav scrolled={scrolled} open={open} setOpen={setOpen} onNavigate={go} onPage={onPage} />

      <main id="top">
        <Hero3DLogo>
          <HeroPinStory onContact={() => go("contact")} />
        </Hero3DLogo>

        <div className="page-stack">
          <AboutServicesJourney />
          <FeedbackSection />
          <ContactSection />
        </div>
      </main>

      <Footer onNavigate={go} />
    </div>
  );
}
