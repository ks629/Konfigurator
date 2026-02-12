'use client';

/* ==========================================================================
   Energy Flow Animation — simple, reliable SVG with text labels + emoji icons
   Layout: Sun → PV panels → Inverter → House / Battery / Grid
   ========================================================================== */

export function EnergyFlowAnimation() {
  /* ---- Node positions (viewBox: 800 x 380) ---- */
  const nodes = {
    sun:      { x: 80,  y: 55,  r: 28, label: 'Słońce',          emoji: '☀️', color: '#FF8C00', sublabel: '' },
    pv:       { x: 80,  y: 175, r: 32, label: 'Panele PV',       emoji: '⚡',  color: '#FF8C00', sublabel: 'fotowoltaiczne' },
    inv:      { x: 310, y: 175, r: 34, label: 'Falownik',        emoji: '🔌',  color: '#350066', sublabel: 'hybrydowy' },
    battery:  { x: 310, y: 330, r: 32, label: 'Magazyn',         emoji: '🔋',  color: '#B5005D', sublabel: 'energii' },
    grid:     { x: 80,  y: 330, r: 28, label: 'Sieć',            emoji: '🏭',  color: '#5a4478', sublabel: 'energetyczna' },
    house:    { x: 560, y: 100, r: 40, label: 'Dom',             emoji: '🏠',  color: '#350066', sublabel: '' },
    ev:       { x: 560, y: 310, r: 30, label: 'Ładowarka EV',    emoji: '🚗',  color: '#00A651', sublabel: '' },
    monitor:  { x: 730, y: 175, r: 28, label: 'Monitoring',      emoji: '📱',  color: '#0066CC', sublabel: 'aplikacja' },
  };

  /* ---- Connection lines ---- */
  const connections = [
    { from: 'sun',  to: 'pv',      color: '#FF8C00' },
    { from: 'pv',   to: 'inv',     color: '#FF8C00' },
    { from: 'inv',  to: 'house',   color: '#B5005D' },
    { from: 'inv',  to: 'battery', color: '#B5005D' },
    { from: 'inv',  to: 'grid',    color: '#5a4478' },
    { from: 'house', to: 'ev',     color: '#00A651' },
    { from: 'house', to: 'monitor', color: '#0066CC' },
  ];

  /* ---- Animated dot paths (relative) ---- */
  const dotPaths = [
    // Sun → PV
    { startX: nodes.sun.x, startY: nodes.sun.y + nodes.sun.r, path: `M 0 0 L 0 ${nodes.pv.y - nodes.pv.r - nodes.sun.y - nodes.sun.r}`, color: '#FF8C00', dur: 1.4, delays: [0, 0.7] },
    // PV → Inverter
    { startX: nodes.pv.x + nodes.pv.r, startY: nodes.pv.y, path: `M 0 0 L ${nodes.inv.x - nodes.inv.r - nodes.pv.x - nodes.pv.r} 0`, color: '#FF8C00', dur: 1.6, delays: [0.3, 1.1, 1.9] },
    // Inverter → House
    { startX: nodes.inv.x + nodes.inv.r, startY: nodes.inv.y, path: `M 0 0 L ${nodes.house.x - nodes.house.r - nodes.inv.x - nodes.inv.r} ${nodes.house.y - nodes.inv.y}`, color: '#B5005D', dur: 1.8, delays: [0.6, 2.0] },
    // Inverter → Battery (charge)
    { startX: nodes.inv.x, startY: nodes.inv.y + nodes.inv.r, path: `M 0 0 L 0 ${nodes.battery.y - nodes.battery.r - nodes.inv.y - nodes.inv.r}`, color: '#B5005D', dur: 1.6, delays: [0.4, 1.8] },
    // Battery → Inverter (discharge, red)
    { startX: nodes.battery.x + 8, startY: nodes.battery.y - nodes.battery.r, path: `M 0 0 L 0 ${-(nodes.battery.y - nodes.battery.r - nodes.inv.y - nodes.inv.r)}`, color: '#FF004E', dur: 2.2, delays: [3.0, 5.0] },
    // House → EV
    { startX: nodes.house.x, startY: nodes.house.y + nodes.house.r + 4, path: `M 0 0 L 0 ${nodes.ev.y - nodes.ev.r - nodes.house.y - nodes.house.r - 4}`, color: '#00A651', dur: 2.0, delays: [1.5, 3.5] },
    // House → Monitor
    { startX: nodes.house.x + nodes.house.r, startY: nodes.house.y + 10, path: `M 0 0 L ${nodes.monitor.x - nodes.monitor.r - nodes.house.x - nodes.house.r} ${nodes.monitor.y - nodes.house.y - 10}`, color: '#0066CC', dur: 2.0, delays: [2.0, 4.2] },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <svg
        viewBox="0 0 800 380"
        className="w-full h-auto"
        style={{ minHeight: '260px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ---- Dashed connection lines ---- */}
        {connections.map(({ from, to, color }, i) => {
          const f = nodes[from as keyof typeof nodes];
          const t = nodes[to as keyof typeof nodes];
          return (
            <line
              key={`line-${i}`}
              x1={f.x}
              y1={f.y}
              x2={t.x}
              y2={t.y}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="8 5"
              opacity="0.25"
            />
          );
        })}

        {/* ---- Animated energy dots ---- */}
        {dotPaths.flatMap((dp, i) =>
          dp.delays.map((delay, j) => (
            <g key={`dotg-${i}-${j}`} transform={`translate(${dp.startX}, ${dp.startY})`}>
              <circle r="5" fill={dp.color} opacity="0">
                <animateMotion
                  dur={`${dp.dur}s`}
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                  path={dp.path}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.85;0.85;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${dp.dur}s`}
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                />
              </circle>
            </g>
          ))
        )}

        {/* ---- Path labels ---- */}
        {/* ładowanie label */}
        <rect x={nodes.inv.x + 14} y={(nodes.inv.y + nodes.battery.y) / 2 - 10} width="68" height="20" rx="10" fill="#B5005D" opacity="0.08" />
        <text x={nodes.inv.x + 48} y={(nodes.inv.y + nodes.battery.y) / 2 + 4} textAnchor="middle" fill="#B5005D" fontSize="9" fontWeight="600">
          ładowanie
        </text>
        {/* rozładowanie label */}
        <rect x={nodes.inv.x - 92} y={(nodes.inv.y + nodes.battery.y) / 2 - 10} width="78" height="20" rx="10" fill="#FF004E" opacity="0.08" />
        <text x={nodes.inv.x - 53} y={(nodes.inv.y + nodes.battery.y) / 2 + 4} textAnchor="middle" fill="#FF004E" fontSize="9" fontWeight="600">
          rozładowanie
        </text>

        {/* ---- Nodes ---- */}
        {Object.entries(nodes).map(([key, node]) => (
          <g key={key}>
            {/* Pulse ring */}
            <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke={node.color} strokeWidth="1" opacity="0.15">
              <animate attributeName="r" values={`${node.r + 4};${node.r + 10};${node.r + 4}`} dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.04;0.15" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* White circle background */}
            <circle cx={node.x} cy={node.y} r={node.r} fill="white" stroke={node.color} strokeWidth="2.5" />
            {/* Emoji icon */}
            <text
              x={node.x}
              y={node.y + (node.r * 0.15)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={node.r * 0.75}
              style={{ userSelect: 'none' }}
            >
              {node.emoji}
            </text>
            {/* Label */}
            <text
              x={node.x}
              y={node.y + node.r + 16}
              textAnchor="middle"
              fill="#230045"
              fontSize="11"
              fontWeight="700"
            >
              {node.label}
            </text>
            {/* Sublabel */}
            {node.sublabel && (
              <text
                x={node.x}
                y={node.y + node.r + 28}
                textAnchor="middle"
                fill="#5a4478"
                fontSize="9"
              >
                {node.sublabel}
              </text>
            )}
          </g>
        ))}

        {/* ---- Appliance boxes under house ---- */}
        {['AGD', 'TV', 'Światło'].map((label, i) => {
          const bx = nodes.house.x - 60 + i * 60;
          const by = nodes.house.y + 58;
          return (
            <g key={label}>
              <rect x={bx - 24} y={by - 12} width="48" height="24" rx="6" fill="#350066" opacity="0.06" stroke="#350066" strokeWidth="0.5" />
              <text x={bx} y={by + 4} textAnchor="middle" fill="#350066" fontSize="9" fontWeight="600">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
