"use client";

import React, { Component, Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/logo.glb";

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

function matchLogoMaterial(material, name = "") {
  const mat = material.clone();
  const key = name.toLowerCase();
  const isChip = key.includes("chip");
  const isRing = key.includes("ring");
  const target = isChip ? "#7c4ae0" : isRing ? "#380080" : "#4a1498";
  if (mat.color) mat.color.set(target);
  if ("emissive" in mat) {
    mat.emissive.set(isChip ? "#5a3db0" : "#2a0066");
    mat.emissiveIntensity = isChip ? 0.14 : 0.06;
  }
  if ("roughness" in mat) mat.roughness = 0.4;
  if ("metalness" in mat) mat.metalness = 0.22;
  return mat;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#b38cff", "#1c1736", 0.42]} />
      <ambientLight intensity={0.36} color="#7a58c8" />
      <directionalLight position={[4.2, 5.4, 6]} intensity={1.35} color="#ffffff" />
      <directionalLight position={[-5.5, 1.8, -3.8]} intensity={0.55} color="#5a3db0" />
      <pointLight position={[0.2, 0.4, 3.2]} intensity={0.4} color="#9050e8" />
    </>
  );
}

function IndigoMark({ onReady }) {
  const { scene } = useGLTF(MODEL_PATH);
  const { viewport } = useThree();
  const spinRef = useRef(null);
  const mark = useMemo(() => {
    const group = new THREE.Group();
    scene.children.forEach((child) => group.add(child.clone(true)));
    group.traverse((child) => {
      if (!child.isMesh) return;
      const name = `${child.name} ${child.parent?.name || ""}`;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => matchLogoMaterial(material, name));
      } else if (child.material) {
        child.material = matchLogoMaterial(child.material, name);
      }
    });
    return group;
  }, [scene]);

  const scale = Math.max(0.52, Math.min(viewport.width || 4, viewport.height || 3) * 0.2);

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

  return (
    <group ref={spinRef} scale={scale} position={[0, 0, 0]}>
      <primitive object={mark} />
    </group>
  );
}

function Scene({ onReady }) {
  return (
    <>
      <Lights />
      <IndigoMark onReady={onReady} />
    </>
  );
}

function FallbackMark() {
  return (
    <div className="hero-3d-fallback">
      <div className="hero-3d-fallback-core" aria-hidden="true" />
    </div>
  );
}

function HeroGuides() {
  return (
    <svg className="hero-guides" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="hero-guides-rings" fill="none">
        <ellipse cx="720" cy="450" rx="168" ry="126" />
        <ellipse cx="720" cy="450" rx="248" ry="186" />
        <ellipse cx="720" cy="450" rx="340" ry="255" />
      </g>
      <g className="hero-guides-ticks">
        <line x1="720" y1="292" x2="720" y2="318" />
        <line x1="720" y1="582" x2="720" y2="608" />
        <line x1="512" y1="450" x2="538" y2="450" />
        <line x1="902" y1="450" x2="928" y2="450" />
      </g>
    </svg>
  );
}

export default function Hero3DLogo({ children }) {
  const [ready, setReady] = useState(false);
  const onReady = React.useCallback(() => setReady(true), []);

  return (
    <section className="hero hero-3d" aria-label="Indigo 3D mark">
      <div className="hero-3d-stage">
        <div className="hero-3d-frame">
          <HeroGuides />

          <HeroErrorBoundary fallback={<FallbackMark />}>
            <div className="hero-3d-canvas-wrap">
              <Canvas
                className="hero-3d-canvas"
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                camera={{ position: [0, 0, 3.7], fov: 38, near: 0.1, far: 50 }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "transparent" }}
              >
                <Suspense fallback={null}>
                  <Scene onReady={onReady} />
                </Suspense>
              </Canvas>
              {!ready && <LoaderOverlay />}
            </div>
          </HeroErrorBoundary>

          {children}
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(MODEL_PATH);
