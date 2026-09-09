import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Two-row layout built dynamically once font loads
const ROWS = [
  ["I","N","D","I","G","O"," ","T","E","C","H"],
  ["S","O","L","U","T","I","O","N"],
];
const ROW_Y = [0.6, -0.6];
const SZ    = 1.0;    // font size (letter height)
const DEPTH = 0.28;   // extrusion depth
const FALL  = 1.25;   // fall duration (s)
const FONT  = "/fonts/helvetiker_bold.typeface.json";

// Lerp helper
const lp = (a, b, t) => a + (b - a) * t;

export default function LoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  const reduced = useMemo(
    () => typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // ── Three.js setup (runs once after canvas mounts) ─────────
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = document.documentElement.clientWidth  || 1280;
    const H = document.documentElement.clientHeight || 720;

    canvas.width  = W;
    canvas.height = H;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 8;

    const scene = new THREE.Scene();

    // Lights for realistic 3D look
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const d1 = new THREE.DirectionalLight(0xffffff, 2.0);
    d1.position.set(4, 8, 6); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xaa88ff, 0.7);
    d2.position.set(-6, 4, -4); scene.add(d2);
    const d3 = new THREE.DirectionalLight(0x6644bb, 0.35);
    d3.position.set(0, -5, 3); scene.add(d3);
    const pt = new THREE.PointLight(0xffffff, 1.0);
    pt.position.set(0, 5, 8); scene.add(pt);

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#9B7FE8"),
      emissive: new THREE.Color("#3B1C90"),
      emissiveIntensity: 0.35,
      metalness: 0.6,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    let rafId;
    const loader = new FontLoader();
    loader.load(FONT, (font) => {
      // ── Compute exact character advance widths from font data ──
      const res    = font.data.resolution; // e.g. 1000
      const glyphs = font.data.glyphs;
      const spaceAdv = (glyphs[" "]?.ha ?? glyphs["A"]?.ha ?? 500) / res * SZ;

      function adv(char) {
        if (char === " ") return spaceAdv;
        const g = glyphs[char];
        return g ? (g.ha / res) * SZ : SZ * 0.6;
      }

      // ── Build per-row layout with tight, accurate spacing ─────
      const allItems = [];
      ROWS.forEach((chars, ri) => {
        const totalW = chars.reduce((s, c) => s + adv(c), 0);
        let x = -totalW / 2;
        chars.forEach(char => {
          const a = adv(char);
          if (char !== " ") {
            allItems.push({ char, targetX: x + a / 2, targetY: ROW_Y[ri], advance: a });
          }
          x += a;
        });
      });

      // ── Randomise drop order ───────────────────────────────────
      const total = allItems.length;
      const order = Array.from({ length: total }, (_, i) => i);
      for (let k = order.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [order[k], order[j]] = [order[j], order[k]];
      }
      order.forEach((origIdx, rank) => {
        allItems[origIdx].delay = rank * 0.12;
      });

      // ── Create one Three.js group per letter ──────────────────
      const groups = allItems.map(item => {
        const geom = new TextGeometry(item.char, {
          font, size: SZ, depth: DEPTH, curveSegments: 10,
          bevelEnabled: true, bevelThickness: 0.03,
          bevelSize: 0.018, bevelSegments: 5,
        });
        // Centre glyph on group origin
        geom.translate(-item.advance * 0.5, -SZ * 0.5, -DEPTH / 2);

        const g = new THREE.Group();
        g.userData = {
          item,
          startY: 9 + Math.random() * 5,
          rx0: (Math.random() - 0.5) * Math.PI * 3,
          ry0: (Math.random() - 0.5) * Math.PI * 3,
          rz0: (Math.random() - 0.5) * Math.PI * 1.5,
        };
        g.position.set(item.targetX, g.userData.startY, 0);
        g.visible = false;
        g.add(new THREE.Mesh(geom, mat));
        scene.add(g);
        return g;
      });

      // ── Exit timing based on animation sequence length ────────
      const sequenceEnd = Math.max(...allItems.map(l => l.delay)) + FALL + 1.0;
      const wait = Math.min(sequenceEnd * 1000, 7000);
      const fadeTimer = setTimeout(() => setFading(true), wait);
      const doneTimer = setTimeout(() => onComplete?.(), wait + 640);
      // Store timers so cleanup can clear them
      canvas._fadeTimer = fadeTimer;
      canvas._doneTimer = doneTimer;

      // ── Animation loop ────────────────────────────────────────
      const clock = new THREE.Clock();
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        const elapsed = clock.getElapsedTime();
        groups.forEach(g => {
          const { item, startY, rx0, ry0, rz0 } = g.userData;
          const dt = elapsed - item.delay;
          if (dt <= 0) { g.visible = false; return; }
          g.visible = true;
          const t = Math.min(dt / FALL, 1);
          const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
          g.position.y = lp(startY, item.targetY, e);
          g.rotation.x = lp(rx0, 0, e);
          g.rotation.y = lp(ry0, 0, e);
          g.rotation.z = lp(rz0, 0, e);
        });
        renderer.render(scene, camera);
      };
      tick();
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(canvas._fadeTimer);
      clearTimeout(canvas._doneTimer);
      mat.dispose();
      renderer.dispose();
    };
  }, [reduced, onComplete]);

  // Reduced-motion timing
  useEffect(() => {
    if (!reduced) return;
    const t = setTimeout(() => onComplete?.(), 700);
    return () => clearTimeout(t);
  }, [onComplete, reduced]);

  if (reduced) {
    return (
      <div className="loading-screen loading-screen--reduced" role="status" aria-live="polite">
        <span className="loading-screen-static">INDIGO TECH SOLUTION</span>
      </div>
    );
  }

  return (
    <div
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 0.64s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        aria-hidden="true"
      />
      <span className="loading-screen-sr">INDIGO TECH SOLUTION</span>
    </div>
  );
}
