"use client";

import React, { Component, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const MODEL_PATH = "/models/logo.glb";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function rand(seed) {
  const n = Math.sin(seed * 9999.12) * 43758.5453;
  return n - Math.floor(n);
}

class HeroErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function LoaderOverlay() {
  const { active, progress } = useProgress();
  if (!active && progress === 100) return null;
  return (
    <div className="hero-3d-loader" role="status" aria-live="polite">
      <span>Loading mark</span>
      <div className="hero-3d-loader-bar">
        <i style={{ width: `${Math.round(progress || 0)}%` }} />
      </div>
    </div>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#f4f0ff", "#351a92", 0.55]} />
      <ambientLight intensity={0.55} color="#f3eeff" />
      <directionalLight position={[4.2, 5.4, 6]} intensity={1.55} color="#ffffff" />
      <directionalLight position={[-5.5, 1.8, -3.8]} intensity={0.85} color="#c4b5fd" />
      <pointLight position={[0.2, 0.4, 3.2]} intensity={0.4} color="#9b7dff" />
    </>
  );
}

function IndigoMark({ triggerRef, onReady }) {
  const { scene } = useGLTF(MODEL_PATH);
  const { viewport } = useThree();
  const spinRef = useRef(null);
  const mark = useMemo(() => {
    const group = new THREE.Group();
    scene.children.forEach((child) => group.add(child.clone(true)));
    return group;
  }, [scene]);

  const scale = Math.max(0.88, Math.min(viewport.width || 4, viewport.height || 3) * 0.33);

  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);

  useLayoutEffect(() => {
    if (spinRef.current) spinRef.current.rotation.set(0.08, -0.38, 0);
  }, []);

  useFrame((_, delta) => {
    const group = spinRef.current;
    if (!group) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    group.rotation.y += delta * 0.22;
  });

  useLayoutEffect(() => {
    const trigger = triggerRef?.current;
    if (!trigger || !mark) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chipsGroup = mark.getObjectByName("chips");
    const ring = mark.getObjectByName("ring");
    const originals = [];

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      const chips = [];
      if (chipsGroup) {
        for (let i = 1; i <= 17; i += 1) {
          const named = chipsGroup.getObjectByName(`chip-${i}`);
          if (named) chips.push(named);
        }
        if (!chips.length) {
          chipsGroup.traverse((child) => {
            if (child.isMesh) chips.push(child);
          });
        }
      }

      chips.forEach((chip, i) => {
        let dx = chip.position.x;
        let dy = chip.position.y;
        let dz = chip.position.z;
        const len = Math.hypot(dx, dy, dz);
        if (len < 1e-6) {
          dx = rand(i + 1) - 0.5;
          dy = rand(i + 7) - 0.5;
          dz = 0.4;
        }
        const inv = 1 / Math.hypot(dx, dy, dz);
        dx *= inv;
        dy *= inv;
        dz *= inv;
        const dist = 1.55 + rand(i + 21) * 1.9;

        originals.push({
          type: "chip",
          mesh: chip,
          x: chip.position.x,
          y: chip.position.y,
          z: chip.position.z,
          rx: chip.rotation.x,
          ry: chip.rotation.y,
          rz: chip.rotation.z,
          ex: chip.position.x + dx * dist,
          ey: chip.position.y + dy * dist,
          ez: chip.position.z + dz * dist + (rand(i + 33) - 0.32) * 1.7,
        });
      });

      let ringState = null;
      if (ring) {
        ringState = {
          type: "ring",
          mesh: ring,
          sx: ring.scale.x,
          sy: ring.scale.y,
          sz: ring.scale.z,
        };
        originals.push(ringState);
      }

      const restore = () => {
        originals.forEach((orig) => {
          if (orig.type === "chip") orig.mesh.position.set(orig.x, orig.y, orig.z);
          if (orig.type === "ring") orig.mesh.scale.set(orig.sx, orig.sy, orig.sz);
        });
      };

      const apply = (t) => {
        const burst = Math.sin(Math.PI * t);
        const k = burst * burst * (3 - 2 * burst);

        originals.forEach((orig) => {
          if (orig.type !== "chip") return;
          orig.mesh.position.set(
            orig.x + (orig.ex - orig.x) * k,
            orig.y + (orig.ey - orig.y) * k,
            orig.z + (orig.ez - orig.z) * k
          );
        });

        if (ringState) {
          const s = 1 + 0.1 * k;
          ringState.mesh.scale.set(ringState.sx * s, ringState.sy * s, ringState.sz * s);
        }
      };

      const progress = { t: 0 };
      gsap.to(progress, {
        t: 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
          onUpdate: (self) => apply(Math.min(1, self.progress / 0.68)),
          onLeave: restore,
          onEnterBack: () => apply(1),
        },
      });
    }, trigger);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      originals.forEach((orig) => {
        if (orig.type === "chip") orig.mesh.position.set(orig.x, orig.y, orig.z);
        if (orig.type === "ring") orig.mesh.scale.set(orig.sx, orig.sy, orig.sz);
      });
    };
  }, [mark, triggerRef]);

  return (
    <group ref={spinRef} scale={scale} position={[0, -0.32, 0]}>
      <primitive object={mark} />
    </group>
  );
}

function HeroArcs() {
  return (
    <svg className="hero-arcs" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <ellipse cx="740" cy="470" rx="240" ry="180" />
      <ellipse cx="740" cy="470" rx="340" ry="250" />
      <ellipse cx="740" cy="480" rx="470" ry="320" />
      <path d="M120 760 Q 740 90 1320 760" />
      <path d="M40 640 Q 740 20 1400 640" />
    </svg>
  );
}

function Scene({ triggerRef, onReady }) {
  return (
    <>
      <Lights />
      <IndigoMark triggerRef={triggerRef} onReady={onReady} />
    </>
  );
}

function FallbackMark() {
  return (
    <div className="hero-3d-fallback">
      <img src="/assets/indigo-logo.jpg" alt="Indigo Tech Solutions" />
    </div>
  );
}

export default function Hero3DLogo({ children, back }) {
  const sectionRef = useRef(null);
  const [ready, setReady] = useState(false);
  const onReady = React.useCallback(() => setReady(true), []);

  return (
    <section ref={sectionRef} className="hero hero-3d" aria-label="Indigo 3D mark">
      <div className="hero-3d-stage">
        <div className="hero-3d-frame">
          <div className="hero-grid" />
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <HeroArcs />
          {back}

          <HeroErrorBoundary fallback={<FallbackMark />}>
            <div className="hero-3d-canvas-wrap">
              <Canvas
                className="hero-3d-canvas"
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                camera={{ position: [0, 0.12, 3.7], fov: 38, near: 0.1, far: 50 }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "transparent" }}
              >
                <Suspense fallback={null}>
                  <Scene triggerRef={sectionRef} onReady={onReady} />
                </Suspense>
              </Canvas>
              {!ready && <LoaderOverlay />}
            </div>
          </HeroErrorBoundary>

          {!ready && <FallbackMark />}

          {children}
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(MODEL_PATH);
