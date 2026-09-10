import { useState } from "react";
import Reveal from "./Reveal";

const NX = {
  hub: { cx: 218, cy: 192, r: 17, main: true,   label: "Core Engine",      desc: "AI orchestration layer"  },
  a:   { cx: 88,  cy: 82,  r: 8,                label: "AI Models",        desc: "Predictive intelligence" },
  b:   { cx: 246, cy: 50,  r: 7,                label: "Analytics",        desc: "Real-time insights"      },
  c:   { cx: 398, cy: 84,  r: 9,                label: "Automation",       desc: "Workflow automation"     },
  d:   { cx: 74,  cy: 196, r: 7,                label: "Data Ops",         desc: "Pipeline management"     },
  e:   { cx: 352, cy: 164, r: 12, accent: true, label: "Intelligence Hub", desc: "Decision support"        },
  f:   { cx: 468, cy: 190, r: 6,                label: "API Layer",        desc: "System integration"      },
  g:   { cx: 110, cy: 318, r: 8,                label: "BPO Services",     desc: "Human operations"        },
  h:   { cx: 266, cy: 326, r: 10,               label: "Operations",       desc: "24/7 monitoring"         },
  i:   { cx: 418, cy: 308, r: 7,                label: "Integration",      desc: "Cross-platform sync"     },
  j:   { cx: 482, cy: 102, r: 6,                label: "Cloud Infra",      desc: "Scalable deployment"     },
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
  { id: "p1", s: "hub", e: "a", dur: "3s",   begin: "0s"   },
  { id: "p2", s: "hub", e: "b", dur: "4s",   begin: "1.3s" },
  { id: "p3", s: "hub", e: "e", dur: "2.6s", begin: "0.6s" },
  { id: "p4", s: "hub", e: "h", dur: "3.7s", begin: "1.8s" },
  { id: "p5", s: "e",   e: "c", dur: "4.3s", begin: "0.9s" },
  { id: "p6", s: "e",   e: "i", dur: "5.1s", begin: "2.2s" },
  { id: "p7", s: "h",   e: "g", dur: "4.8s", begin: "2.5s" },
  { id: "p8", s: "c",   e: "j", dur: "5.5s", begin: "1.5s" },
];

const BADGES = [
  { x: 18,  y: 134, label: "UPTIME",    value: "99.9%",   accent: "#00f5d4" },
  { x: 348, y: 18,  label: "ACCURACY",  value: "97.4%",   accent: "#b38cff" },
  { x: 338, y: 232, label: "RESPONSE",  value: "< 2 min", accent: "#5a3db0" },
  { x: 18,  y: 336, label: "OPS / DAY", value: "12K+",    accent: "#ffc53d" },
];

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
            <span className="vnet-legend-dot" style={{ background: "#5a3db0" }} />
            Core nodes
            <span className="vnet-legend-dot" style={{ background: "#00f5d4", marginLeft: 8 }} />
            Data flow
            <span className="vnet-legend-dot" style={{ background: "#c4bcec", marginLeft: 8 }} />
            Services
          </div>
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
              <stop offset="0%" stopColor="#a78ef5" />
              <stop offset="100%" stopColor="#5e3dc8" />
            </radialGradient>
            <filter id="vglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="vglow-sm" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Dot grid */}
          <g opacity="0.1">
            {Array.from({ length: 63 }, (_, i) => {
              const col = i % 9;
              const row = Math.floor(i / 9);
              return <circle key={i} cx={col * 65 + 20} cy={row * 58 + 20} r="1.5" fill="#5a3db0" />;
            })}
          </g>

          {/* Hub orbit ring */}
          <circle
            cx={NX.hub.cx} cy={NX.hub.cy} r="34"
            fill="none" stroke="#5a3db0" strokeWidth="1"
            strokeOpacity="0.2" strokeDasharray="4 8"
            className="vhub-orbit"
          />

          {/* Edges */}
          {EDGES.map(([s, e]) => {
            const active  = edgeActive([s, e]);
            const dimmed  = edgeDimmed([s, e]);
            return (
              <line
                key={`${s}${e}`}
                x1={NX[s].cx} y1={NX[s].cy}
                x2={NX[e].cx} y2={NX[e].cy}
                stroke={active ? "#b38cff" : "#9b8de0"}
                strokeWidth={active ? 2 : 1}
                strokeOpacity={dimmed ? 0.05 : active ? 0.9 : hovered ? 0.18 : 0.28}
                strokeDasharray={active ? "0" : "5 4"}
                style={{ transition: "stroke-opacity 0.2s ease, stroke-width 0.2s ease" }}
              />
            );
          })}

          {/* Pulse rings */}
          {Object.entries(NX).filter(([, n]) => n.main || n.accent).map(([id, n]) => (
            <circle
              key={`ring-${id}`}
              cx={n.cx} cy={n.cy} r={n.r}
              fill="none"
              stroke={n.main ? "#5a3db0" : "#b38cff"}
              strokeWidth="1.5"
              className={n.main ? "vring vring-hub" : "vring vring-acc"}
            />
          ))}

          {/* Nodes */}
          {Object.entries(NX).map(([id, n]) => {
            const isHov    = hovered === id;
            const connected = isConnected(id);
            const dimmed    = hovered && !isHov && !connected;
            const ttX = Math.max(4, Math.min(n.cx - 48, 540 - 100));
            const ttBelow = n.cy - n.r - 42 < 10;
            const ttY = ttBelow ? n.cy + n.r + 8 : n.cy - n.r - 42;
            return (
              <g
                key={id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Larger invisible hit area */}
                <circle cx={n.cx} cy={n.cy} r={n.r + 10} fill="transparent" />

                <circle
                  cx={n.cx} cy={n.cy}
                  r={isHov ? n.r * 1.28 : n.r}
                  fill={n.main ? "url(#vhub)" : n.accent ? "url(#vacc)" : isHov ? "url(#vhov)" : "#ddd8f5"}
                  stroke={n.main ? "#8a68f0" : n.accent ? "#c4a3ff" : isHov ? "#b38cff" : "#c4bcec"}
                  strokeWidth={n.main || n.accent ? 2 : 1.5}
                  opacity={dimmed ? 0.25 : 1}
                  filter={n.main || n.accent || isHov ? "url(#vglow)" : undefined}
                  style={{ transition: "r 0.18s ease, opacity 0.18s ease" }}
                />

                {/* Hover tooltip */}
                {isHov && (
                  <g>
                    <rect
                      x={ttX} y={ttY}
                      width="98" height="30" rx="7"
                      fill="#0b0820" fillOpacity="0.9"
                    />
                    <text
                      x={ttX + 49} y={ttY + 12}
                      textAnchor="middle"
                      fontSize="9" fontWeight="600" fill="#f3efff"
                      fontFamily="DM Mono, monospace" letterSpacing="0.05em"
                    >{NX[id].label}</text>
                    <text
                      x={ttX + 49} y={ttY + 24}
                      textAnchor="middle"
                      fontSize="7.5" fill="#9b93b8"
                      fontFamily="DM Mono, monospace" letterSpacing="0.04em"
                    >{NX[id].desc}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Data packets */}
          {PACKETS.map(({ id, s, e, dur, begin }) => {
            const onActive = hovered === s || hovered === e;
            const onOther  = hovered && !onActive;
            return (
              <circle
                key={id}
                r={onActive ? 4.5 : 3}
                fill="#00f5d4"
                filter="url(#vglow-sm)"
                opacity={onOther ? 0.2 : 1}
                style={{ transition: "opacity 0.2s ease" }}
              >
                <animateMotion
                  dur={dur}
                  begin={begin}
                  repeatCount="indefinite"
                  path={`M${NX[s].cx},${NX[s].cy} L${NX[e].cx},${NX[e].cy}`}
                />
              </circle>
            );
          })}

          {/* Metric badges */}
          {BADGES.map((b, i) => (
            <g key={i} className="vbadge" style={{ "--vbadge-delay": `${i * 0.28}s` }}>
              <rect x={b.x} y={b.y} width="94" height="44" rx="9"
                fill="white" fillOpacity="0.96"
                stroke={b.accent} strokeWidth="1.5"
              />
              <rect x={b.x} y={b.y} width="4" height="44" rx="2" fill={b.accent} />
              <text x={b.x + 12} y={b.y + 16} fontSize="7.5" fill="#8e86a8"
                fontFamily="DM Mono, monospace" letterSpacing="0.1em">{b.label}</text>
              <text x={b.x + 12} y={b.y + 34} fontSize="15" fontWeight="700" fill="#0b0820"
                fontFamily="Inter Tight, Inter, sans-serif" letterSpacing="-0.04em">{b.value}</text>
            </g>
          ))}
        </svg>

        <div className="video-caption">
          <span>INDIGO / DIGITAL OPERATIONS</span>
          <span className="vcap-live"><span className="vcap-dot" />LIVE NETWORK</span>
        </div>
      </Reveal>
    </section>
  );
}
