import React from "react";
import { motion, useScroll } from "framer-motion";
import Hero3DLogo from "./components/Hero3DLogo";
import HeroPinStory, { HeroImpact } from "./components/HeroPinStory";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CapabilitiesTicker from "./components/CapabilitiesTicker";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import VideoSection from "./components/VideoSection";
import TeamSection from "./components/TeamSection";
import FeedbackSection from "./components/FeedbackSection";
import ContactSection from "./components/ContactSection";

export default function App() {
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />

      <Nav scrolled={scrolled} open={open} setOpen={setOpen} onNavigate={go} />

      <main id="top">
        <Hero3DLogo back={<HeroImpact />}>
          <HeroPinStory onContact={() => go("contact")} onAbout={() => go("about")} />
        </Hero3DLogo>

        <div className="page-stack">
          <AboutSection />
          <CapabilitiesTicker />
          <ServicesSection />
          <VideoSection />
          <TeamSection />
          <FeedbackSection />
          <ContactSection />
        </div>
      </main>

      <Footer onNavigate={go} />
    </div>
  );
}
