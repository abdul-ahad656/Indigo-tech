import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

const WORDS = ["INDIGO", "TECH", "SOLUTION"];

// Tuned for helvetiker_bold at size SZ=0.65
const SZ    = 0.65;   // letter height (font size)
const DEPTH = 0.20;   // extrusion depth
const ADV   = 0.50;   // advance width per character
const GAP   = 0.45;   // extra space between words
const FONT  = "/fonts/helvetiker_bold.typeface.json";

function buildLayout() {
  const totalWidth =
    WORDS.reduce((s, w) => s + w.length * ADV, 0) +
    (WORDS.length - 1) * GAP;

  // Assign a random drop order so letters arrive scattered
  const total = WORDS.reduce((s, w) => s + w.length, 0);
  const order = Array.from({ length: total }, (_, i) => i);
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [order[k], order[j]] = [order[j], order[k]];
  }
  const dropDelay = new Array(total);
  order.forEach((origIdx, rank) => { dropDelay[origIdx] = rank * 0.11; });

  const items = [];
  let x = -totalWidth / 2;
  let idx = 0;
  WORDS.forEach((word, wi) => {
    word.split("").forEach((char) => {
      items.push({ char, targetX: x + ADV / 2, delay: dropDelay[idx] });
      x += ADV;
      idx++;
    });
    if (wi < WORDS.length - 1) x += GAP;
  });
  return items;
}

// One extruded 3D letter that falls from above with 3-axis tumble
function Letter({ char, targetX, delay }) {
  const groupRef = useRef();
  const startY   = useMemo(() => 8 + Math.random() * 5, []);
  const initRotX = useMemo(() => (Math.random() - 0.5) * Math.PI * 3, []);
  const initRotY = useMemo(() => (Math.random() - 0.5) * Math.PI * 3, []);
  const initRotZ = useMemo(() => (Math.random() - 0.5) * Math.PI * 1.5, []);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const elapsed = clock.elapsedTime - delay;
    if (elapsed <= 0) { g.visible = false; return; }
    g.visible = true;
    const t = Math.min(elapsed / 1.35, 1);
    const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
    g.position.y = THREE.MathUtils.lerp(startY, 0, e);
    g.rotation.x = THREE.MathUtils.lerp(initRotX, 0, e);
    g.rotation.y = THREE.MathUtils.lerp(initRotY, 0, e);
    g.rotation.z = THREE.MathUtils.lerp(initRotZ, 0, e);
  });

  return (
    <group ref={groupRef} position={[targetX, startY, 0]} visible={false}>
      {/* offset so letter is centered on group origin */}
      <Text3D
        font={FONT}
        size={SZ}
        height={DEPTH}
        curveSegments={10}
        bevelEnabled
        bevelThickness={0.022}
        bevelSize={0.014}
        bevelSegments={5}
        position={[-ADV * 0.42, -SZ * 0.5, -DEPTH / 2]}
      >
        {char}
        <meshPhysicalMaterial
          color="#9B7FE8"
          emissive="#3B1C90"
          emissiveIntensity={0.22}
          metalness={0.55}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </Text3D>
    </group>
  );
}

function Scene({ items }) {
  return (
    <>
      {/* Key light */}
      <directionalLight position={[4, 8, 6]}  intensity={1.6} color="#ffffff" />
      {/* Fill light — purple tint for depth */}
      <directionalLight position={[-6, 4, -4]} intensity={0.55} color="#aa88ff" />
      {/* Rim from below to catch the extrusion edge */}
      <directionalLight position={[0, -6, 3]}  intensity={0.3}  color="#6644bb" />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 6, 10]} intensity={0.7} color="#ffffff" />

      {items.map((item, i) => (
        <Letter
          key={`${item.char}-${i}`}
          char={item.char}
          targetX={item.targetX}
          delay={item.delay}
        />
      ))}
    </>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const items = useMemo(() => buildLayout(), []);

  const sequenceEnd = useMemo(
    () => Math.max(...items.map((l) => l.delay)) + 1.35 + 0.9,
    [items]
  );

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => onComplete?.(), 700);
      return () => clearTimeout(t);
    }

    let exitTimer, completeTimer;
    let scheduled = false;

    const finish = () => {
      setExiting(true);
      completeTimer = setTimeout(() => onComplete?.(), 640);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const wait = Math.min(sequenceEnd * 1000, 6500);
      exitTimer = setTimeout(finish, wait);
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule);
    }

    return () => {
      window.removeEventListener("load", schedule);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, reduced, sequenceEnd]);

  if (reduced) {
    return (
      <div
        className="loading-screen loading-screen--reduced"
        role="status"
        aria-live="polite"
      >
        <span className="loading-screen-static">INDIGO TECH SOLUTION</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="loading-screen"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.64, ease: [0.4, 0, 0.2, 1] }}
        >
          <Canvas
            camera={{ position: [0, 0, 10], fov: 65 }}
            gl={{ antialias: true, alpha: true }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene items={items} />
            </Suspense>
          </Canvas>
          <span className="loading-screen-sr">INDIGO TECH SOLUTION</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
