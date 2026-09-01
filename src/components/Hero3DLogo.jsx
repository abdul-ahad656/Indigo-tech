"use client";

import React, { Component, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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
    const trigger = triggerRef?.current;
    if (!trigger || !mark) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chipsGroup = mark.getObjectByName("chips");
    const ring = mark.getObjectByName("ring");
    const originals = [];

    const ctx = gsap.context(() => {
      if (prefersReduced || !chipsGroup) return;

      const chips = [];
      for (let i = 1; i <= 17; i += 1) {
        const named = chipsGroup.getObjectByName(`chip-${i}`);
        if (named) chips.push(named);
      }
      if (!chips.length) {
        chipsGroup.traverse((child) => {
          if (child.isMesh) chips.push(child);
        });
      }

      chips.forEach((chip) => {
        originals.push({
          mesh: chip,
          x: chip.position.x,
          y: chip.position.y,
          z: chip.position.z,
          rx: chip.rotation.x,
          ry: chip.rotation.y,
          rz: chip.rotation.z,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      if (ring) {
        const sx = ring.scale.x;
        const sy = ring.scale.y;
        const sz = ring.scale.z;
        tl.to(ring.scale, { x: sx * 1.08, y: sy * 1.08, z: sz * 1.08, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(ring.rotation, { y: 0.28, z: 0.1, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(ring.scale, { x: sx, y: sy, z: sz, duration: 0.5, ease: "power2.inOut" }, 0.5);
        tl.to(ring.rotation, { y: 0, z: 0, duration: 0.5, ease: "power2.inOut" }, 0.5);
      }

      originals.forEach((orig, i) => {
        const { mesh, x, y, z, rx, ry, rz } = orig;
        let dx = x;
        let dy = y;
        let dz = z;
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
        const exploded = {
          x: x + dx * dist,
          y: y + dy * dist,
          z: z + dz * dist + (rand(i + 33) - 0.32) * 1.7,
        };
        const explodedRot = {
          x: rx + (rand(i + 41) - 0.5) * Math.PI * 1.2,
          y: ry + (rand(i + 52) - 0.5) * Math.PI * 1.4,
          z: rz + (rand(i + 63) - 0.5) * Math.PI * 0.95,
        };

        tl.to(mesh.position, { ...exploded, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(mesh.rotation, { ...explodedRot, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(mesh.position, { x, y, z, duration: 0.5, ease: "power2.inOut" }, 0.5);
        tl.to(mesh.rotation, { x: rx, y: ry, z: rz, duration: 0.5, ease: "power2.inOut" }, 0.5);
      });
    }, trigger);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      originals.forEach(({ mesh, x, y, z, rx, ry, rz }) => {
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
      });
    };
  }, [mark, triggerRef]);

  return (
    <group scale={scale} position={[0, -0.32, 0]} rotation={[0.08, -0.38, 0]}>
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
      <color attach="background" args={["#ffffff"]} />
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

export default function Hero3DLogo({ children }) {
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

          <HeroErrorBoundary fallback={<FallbackMark />}>
            <div className="hero-3d-canvas-wrap">
              <Canvas
                className="hero-3d-canvas"
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
                camera={{ position: [0, 0.12, 3.7], fov: 38, near: 0.1, far: 50 }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
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
