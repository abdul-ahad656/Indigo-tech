import { useState } from "react";
import Reveal from "./Reveal";

const NX = {
  hub: { cx: 218, cy: 192, r: 17, type: "hub",    label: "Core Engine",      desc: "AI orchestration" },
  a:   { cx: 88,  cy: 82,  r: 8,  type: "violet", label: "AI Models",        desc: "Predictive intelligence" },
  b:   { cx: 246, cy: 50,  r: 7,  type: "teal",   label: "Analytics",        desc: "Real-time insights" },
  c:   { cx: 398, cy: 84,  r: 9,  type: "violet", label: "Automation",       desc: "Workflow automation" },
  d:   { cx: 74,  cy: 196, r: 7,  type: "teal",   label: "Data Ops",         desc: "Pipeline management" },
  e:   { cx: 352, cy: 164, r: 12, type: "accent", label: "Intelligence Hub", desc: "Decision support" },
  f:   { cx: 468, cy: 190, r: 6,  type: "blue",   label: "API Layer",        desc: "System integration" },
  g:   { cx: 110, cy: 318, r: 8,  type: "amber",  label: "BPO Services",     desc: "Human operations" },
  h:   { cx: 266, cy: 326, r: 10, type: "amber",  label: "Operations",       desc: "24/7 monitoring" },
  i:   { cx: 418, cy: 308, r: 7,  type: "blue",   label: "Integration",      desc: "Cross-platform sync" },
  j:   { cx: 482, cy: 102, r: 6,  type: "teal",   label: "Cloud Infra",      desc: "Scalable deployment" },
};

const TS = {
  hub:    { fill: "url(#vhub)", stroke: "#8a68f0", hstroke: "#c4a3ff", filter: "url(#vglow)"    },
  accent: { fill: "url(#vacc)", stroke: "#c4a3ff", hstroke: "#e0c8ff", filter: "url(#vglow)"    },
  violet: { fill: "#e4dcff",    stroke: "#9070e0", hstroke: "#c4a3ff", filter: "url(#vglow-sm)" },
  teal:   { fill: "#c8f5ee",    stroke: "#00c8a8", hstroke: "#00f5d4", filter: "url(#vglow-sm)" },
  amber:  { fill: "#fff4cc",    stroke: "#d4a800", hstroke: "#ffc53d", filter: "url(#vglow-sm)" },
  blue:   { fill: "#d8e4ff",    stroke: "#7090e0", hstroke: "#90b4ff", filter: "url(#vglow-sm)" },
};

const ACCENT_COLOR = {
  hub: "#b38cff", accent: "#c4a3ff",
  violet: "#b38cff", teal: "#00f5d4",
  amber: "#ffc53d", blue: "#90b4ff",
};

const EDGES = [
  ["hub","a"], ["hub","b"], ["hub","d"],
  ["hub","e"], ["hub","h"],
  ["e","c"],   ["e","f"],   ["e","i"],
  ["c","j"],   ["a","d"],   ["h","g"],
  ["h","i"],   ["f","j"],
];

const ADJ = {};
Object.keys(NX).forEach(k => { ADJ[k] = new Set(); });
EDGES.forEach(([s, e]) => { ADJ[s].add(e); ADJ[e].add(s); });

const PACKETS = [
  { id: "p1", s: "hub", e: "a", dur: "3s",   begin: "0s",   color: "#b38cff" },
  { id: "p2", s: "hub", e: "b", dur: "4s",   begin: "1.3s", color: "#00f5d4" },
  { id: "p3", s: "hub", e: "e", dur: "2.6s", begin: "0.6s", color: "#c4a3ff" },
  { id: "p4", s: "hub", e: "h", dur: "3.7s", begin: "1.8s", color: "#ffc53d" },
  { id: "p5", s: "e",   e: "c", dur: "4.3s", begin: "0.9s", color: "#b38cff" },
  { id: "p6", s: "e",   e: "i", dur: "5.1s", begin: "2.2s", color: "#90b4ff" },
  { id: "p7", s: "h",   e: "g", dur: "4.8s", begin: "2.5s", color: "#ffc53d" },
  { id: "p8", s: "c",   e: "j", dur: "5.5s", begin: "1.5s", color: "#00f5d4" },
];

const BADGES = [
  { x: 18,  y: 130, label: "UPTIME",    value: "99.9%",   accent: "#00f5d4" },
  { x: 348, y: 14,  label: "ACCURACY",  value: "97.4%",   accent: "#b38cff" },
  { x: 336, y: 228, label: "RESPONSE",  value: "< 2 min", accent: "#7090e0" },
  { x: 18,  y: 294, label: "OPS / DAY", value: "12K+",    accent: "#ffc53d" },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  cx: 18 + (i * 29 + i * i * 7) % 504,
  y0: 40 + (i * 43 + i * 17) % 310,
  r: 1 + (i % 3) * 0.65,
  color: ["#b38cff","#00f5d4","#ffc53d","#90b4ff"][i % 4],
  dur: `${11 + (i % 5) * 2.4}s`,
  delay: `${(i * 1.15) % 11}s`,
}));

export default function VideoSection() {
  const [hovered, setHovered] = useState(null);

  const isConnected = (id) => hovered && (ADJ[hovered].has(id) || id === hovered);
  const edgeActive  = ([s, e]) => hovered && (s === hovered || e === hovered);
  const edgeDimmed  = ([s, e]) => hovered && !edgeActive([s, e]) && !isConnected(s) && !isConnected(e);

  return (
    <section className="video-section">
      <div className="video-copy">
        <Reveal>
          <div className="section-label">03 — TECHNOLOGY IN MOTION</div>
          <h2>Human operations.<br /><em>Tech-enabled.</em></h2>
          <p>
            Intelligent automation, AI models, and real-time analytics — wired
            directly into your operations so your team focuses on decisions,
            not data entry.
          </p>
          <div className="vnet-legend">
            <span className="vnet-legend-item">
              <span className="vnet-legend-dot" style={{ background: "#5a3db0" }} />Core
            </span>
            <span className="vnet-legend-item">
              <span className="vnet-legend-dot" style={{ background: "#00c8a8" }} />Data
            </span>
            <span className="vnet-legend-item">
              <span className="vnet-legend-dot" style={{ background: "#d4a800" }} />Ops
            </span>
            <span className="vnet-legend-item">
              <span className="vnet-legend-dot" style={{ background: "#00f5d4" }} />Flow
            </span>
          </div>
          <p className="vnet-hint">Hover nodes to explore</p>
        </Reveal>
      </div>

      <Reveal className="video-frame" delay={0.08}>
        <div className="vnet-aurora" />

        <svg
          className="ops-network"
          viewBox="0 0 540 380"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Interactive technology network diagram"
        >
          <defs>
            <radialGradient id="vhub" cx="38%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#7c5ce8" />
              <stop offset="100%" stopColor="#3d22a0" />
            </radialGradient>
            <radialGradient id="vacc" cx="38%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#c4a3ff" />
              <stop offset="100%" stopColor="#7c4fd4" />
            </radialGradient>
            <radialGradient id="vhov" cx="38%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#a078f5" />
              <stop offset="100%" stopColor="#5e3dc8" />
            </radialGradient>
            <filter id="vglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="vglow-sm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Floating particles */}
          {PARTICLES.map(p => (
            <circle key={`fp-${p.id}`} cx={p.cx} cy={p.y0} r={p.r} fill={p.color} opacity="0">
              <animate attributeName="cy" values={`${p.y0};${p.y0 - 85}`}
                dur={p.dur} begin={p.delay} repeatCount="indefinite" calcMode="linear" />
              <animate attributeName="opacity" values="0;0.6;0.6;0"
                dur={p.dur} begin={p.delay} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Hub orbit rings */}
          <circle cx={NX.hub.cx} cy={NX.hub.cy} r="28" fill="none"
            stroke="#5a3db0" strokeWidth="0.9" strokeOpacity="0.28" strokeDasharray="3 7"
            className="vhub-orbit" />
          <circle cx={NX.hub.cx} cy={NX.hub.cy} r="46" fill="none"
            stroke="#b38cff" strokeWidth="0.7" strokeOpacity="0.14" strokeDasharray="4 10"
            className="vhub-orbit-slow" />

          {/* Orbiting dots */}
          <circle r="4" fill="#00f5d4" filter="url(#vglow-sm)">
            <animateMotion dur="8s" repeatCount="indefinite"
              path={`M ${218+28},${192} a 28,28 0 0,1 -56,0 a 28,28 0 0,1 56,0`} />
          </circle>
          <circle r="3" fill="#ffc53d" filter="url(#vglow-sm)">
            <animateMotion dur="14s" begin="-4s" repeatCount="indefinite"
              path={`M ${218+46},${192} a 46,46 0 0,0 -92,0 a 46,46 0 0,0 92,0`} />
          </circle>

          {/* Edges */}
          {EDGES.map(([s, e]) => {
            const active = edgeActive([s, e]);
            const dimmed = edgeDimmed([s, e]);
            return (
              <g key={`${s}${e}`}>
                {/* Base flowing dash — always present so SMIL doesn't restart */}
                <line
                  x1={NX[s].cx} y1={NX[s].cy}
                  x2={NX[e].cx} y2={NX[e].cy}
                  stroke="#9b8de0"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                  strokeOpacity={dimmed ? 0.04 : active ? 0 : hovered ? 0.16 : 0.32}
                  style={{ transition: "stroke-opacity 0.2s ease" }}
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-12"
                    dur="1.8s" repeatCount="indefinite" />
                </line>
                {/* Active glow overlay */}
                {active && (
                  <>
                    <line x1={NX[s].cx} y1={NX[s].cy} x2={NX[e].cx} y2={NX[e].cy}
                      stroke="#c4a3ff" strokeWidth="5" strokeOpacity="0.2" filter="url(#vglow-sm)" />
                    <line x1={NX[s].cx} y1={NX[s].cy} x2={NX[e].cx} y2={NX[e].cy}
                      stroke="#f0e8ff" strokeWidth="1.5" strokeOpacity="0.95"
                      strokeDasharray="5 3">
                      <animate attributeName="stroke-dashoffset" from="0" to="-8"
                        dur="0.65s" repeatCount="indefinite" />
                    </line>
                  </>
                )}
              </g>
            );
          })}

          {/* Pulse rings */}
          {["hub","e"].map(id => (
            <circle key={`ring-${id}`} cx={NX[id].cx} cy={NX[id].cy} r={NX[id].r}
              fill="none"
              stroke={id === "hub" ? "#5a3db0" : "#b38cff"}
              strokeWidth="1.5"
              className={id === "hub" ? "vring vring-hub" : "vring vring-acc"}
            />
          ))}

          {/* Nodes */}
          {Object.entries(NX).map(([id, n]) => {
            const isHov     = hovered === id;
            const connected = isConnected(id);
            const dimmed    = hovered && !isHov && !connected;
            const ts        = TS[n.type];
            return (
              <g key={id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle cx={n.cx} cy={n.cy} r={n.r + 12} fill="transparent" />
                <circle
                  cx={n.cx} cy={n.cy}
                  r={isHov ? n.r * 1.32 : n.r}
                  fill={isHov && n.type !== "hub" && n.type !== "accent" ? "url(#vhov)" : ts.fill}
                  stroke={isHov ? ts.hstroke : ts.stroke}
                  strokeWidth={n.type === "hub" || n.type === "accent" ? 2.2 : 1.5}
                  opacity={dimmed ? 0.18 : 1}
                  filter={isHov || n.type === "hub" || n.type === "accent" ? ts.filter : undefined}
                  style={{ transition: "opacity 0.18s ease" }}
                />
              </g>
            );
          })}

          {/* Data packets */}
          {PACKETS.map(({ id, s, e, dur, begin, color }) => {
            const onActive = hovered === s || hovered === e;
            const onOther  = hovered && !onActive;
            return (
              <circle key={id} r={onActive ? 5 : 3.5} fill={color}
                filter="url(#vglow-sm)" opacity={onOther ? 0.12 : 1}
                style={{ transition: "opacity 0.2s ease" }}
              >
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite"
                  path={`M${NX[s].cx},${NX[s].cy} L${NX[e].cx},${NX[e].cy}`} />
              </circle>
            );
          })}

          {/* Metric badges */}
          {BADGES.map((b, i) => (
            <g key={i} className="vbadge" style={{ "--vbadge-delay": `${i * 0.28}s` }}>
              <rect x={b.x} y={b.y} width="98" height="48" rx="11"
                fill="white" fillOpacity="0.97" stroke={b.accent} strokeWidth="1.5" />
              <rect x={b.x} y={b.y} width="4" height="48" rx="2" fill={b.accent} />
              <text x={b.x + 13} y={b.y + 16} fontSize="7.5" fill="#8e86a8"
                fontFamily="DM Mono, monospace" letterSpacing="0.1em">{b.label}</text>
              <text x={b.x + 13} y={b.y + 36} fontSize="17" fontWeight="700" fill="#0b0820"
                fontFamily="Inter Tight, Inter, sans-serif" letterSpacing="-0.055em">{b.value}</text>
            </g>
          ))}

          {/* Tooltip layer — always on top of everything including badges */}
          {hovered && (() => {
            const n = NX[hovered];
            const ttW = 126;
            const ttX = Math.max(4, Math.min(n.cx - ttW / 2, 540 - ttW - 4));
            const ttBelow = n.cy - n.r - 48 < 8;
            const ttY = ttBelow ? n.cy + n.r + 8 : n.cy - n.r - 48;
            const accent = ACCENT_COLOR[n.type];
            return (
              <g pointerEvents="none">
                <rect x={ttX} y={ttY} width={ttW} height="36" rx="9"
                  fill="#0b0820" fillOpacity="0.93" />
                <rect x={ttX} y={ttY} width="4" height="36" rx="2" fill={accent} />
                <text x={ttX + 12} y={ttY + 14.5} fontSize="9.5" fontWeight="600" fill="#f3efff"
                  fontFamily="DM Mono, monospace" letterSpacing="0.04em">{n.label}</text>
                <text x={ttX + 12} y={ttY + 28} fontSize="8.5" fill="#8e86a8"
                  fontFamily="DM Mono, monospace" letterSpacing="0.03em">{n.desc}</text>
              </g>
            );
          })()}
        </svg>

        <div className="video-caption">
          <span>INDIGO / DIGITAL OPERATIONS</span>
          <span className="vcap-live"><span className="vcap-dot" />LIVE NETWORK</span>
        </div>
      </Reveal>
    </section>
  );
}
