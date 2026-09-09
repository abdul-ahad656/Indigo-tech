import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

// Two-row layout: "INDIGO TECH" / "SOLUTION"
// Row layout constants tuned for helvetiker_bold at SZ=1.0
const ROWS = [["I","N","D","I","G","O"," ","T","E","C","H"], ["S","O","L","U","T","I","O","N"]];
const SZ    = 1.0;    // font size (letter height)
const DEPTH = 0.28;   // extrusion depth
const ADV   = 0.77;   // advance width per char at SZ=1.0
const GAP   = 0.55;   // word gap (space char)
const ROW_Y_TOP    = 0.7;   // y of top row centre
const ROW_Y_BOTTOM = -0.7;  // y of bottom row centre
const FONT  = "/fonts/helvetiker_bold.typeface.json";

function rowWidth(chars) {
  let w = 0;
  chars.forEach(c => { w += c === " " ? GAP : ADV; });
  return w;
}

function buildLayout() {
  const all = [];
  let total = 0;
  ROWS.forEach(row => { row.forEach(c => { if (c !== " ") total++; }); });

  // Randomize drop order across all non-space letters
  const order = Array.from({ length: total }, (_, i) => i);
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [order[k], order[j]] = [order[j], order[k]];
  }
  const dropDelay = new Array(total);
  order.forEach((origIdx, rank) => { dropDelay[origIdx] = rank * 0.12; });

  let letterIdx = 0;
  const rows = ROWS.map((chars, ri) => {
    const rw = rowWidth(chars);
    let x = -rw / 2;
    const targetY = ri === 0 ? ROW_Y_TOP : ROW_Y_BOTTOM;
    const items = [];

    chars.forEach(char => {
      if (char === " ") {
        x += GAP;
        return;
      }
      items.push({
        char,
        targetX: x + ADV / 2,
        targetY,
        delay: dropDelay[letterIdx],
      });
      x += ADV;
      letterIdx++;
    });
    return items;
  });

  return rows.flat();
}

function Letter({ char, targetX, targetY, delay }) {
  const groupRef = useRef();
  const startY   = useMemo(() => 9 + Math.random() * 5, []);
  const initRotX = useMemo(() => (Math.random() - 0.5) * Math.PI * 3, []);
  const initRotY = useMemo(() => (Math.random() - 0.5) * Math.PI * 3, []);
  const initRotZ = useMemo(() => (Math.random() - 0.5) * Math.PI * 1.5, []);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const elapsed = clock.elapsedTime - delay;
    if (elapsed <= 0) { g.visible = false; return; }
    g.visible = true;
    const t = Math.min(elapsed / 1.2, 1);
    const e = 1 - Math.pow(1 - t, 3);
    g.position.y = THREE.MathUtils.lerp(startY, targetY, e);
    g.rotation.x = THREE.MathUtils.lerp(initRotX, 0, e);
    g.rotation.y = THREE.MathUtils.lerp(initRotY, 0, e);
    g.rotation.z = THREE.MathUtils.lerp(initRotZ, 0, e);
  });

  return (
    <group ref={groupRef} position={[targetX, startY, 0]} visible={false}>
      <Text3D
        font={FONT}
        size={SZ}
        height={DEPTH}
        curveSegments={10}
        bevelEnabled
        bevelThickness={0.03}
        bevelSize={0.018}
        bevelSegments={5}
        position={[-ADV * 0.42, -SZ * 0.5, -DEPTH / 2]}
      >
        {char}
        <meshPhysicalMaterial
          color="#9B7FE8"
          emissive="#3B1C90"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.1}
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 6]}   intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, 4, -4]}  intensity={0.6} color="#aa88ff" />
      <directionalLight position={[0, -5, 3]}   intensity={0.3} color="#6644bb" />
      <pointLight       position={[0, 5, 8]}    intensity={0.8} color="#ffffff" />
      {items.map((item, i) => (
        <Letter
          key={`${item.char}-${i}`}
          char={item.char}
          targetX={item.targetX}
          targetY={item.targetY}
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
    () => Math.max(...items.map((l) => l.delay)) + 1.2 + 1.0,
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
      const wait = Math.min(sequenceEnd * 1000, 7000);
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
      <div className="loading-screen loading-screen--reduced" role="status" aria-live="polite">
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
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}
            onCreated={({ gl }) => gl.setSize(window.innerWidth, window.innerHeight)}
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
