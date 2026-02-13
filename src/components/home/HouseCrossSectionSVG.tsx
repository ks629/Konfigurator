'use client';

/**
 * Hi-Tech Energy Ecosystem Animation
 * Premium schematic visualization of energy storage system
 * Animated particle flows with glowing nodes — NEXBE brand palette
 */
export function HouseCrossSectionSVG() {
  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* Ambient glow behind SVG */}
      <div className="absolute inset-0 bg-[#B5005D]/5 blur-[80px] rounded-full scale-75" />

      <svg viewBox="0 0 1000 520" className="w-full h-auto relative z-10" style={{ minHeight: '280px' }}>
        <defs>
          {/* ===== GRADIENTS ===== */}
          <linearGradient id="hcs-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f0520" stopOpacity="0" />
            <stop offset="50%" stopColor="#150830" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f0520" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="hcs-nodeGlow-magenta" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B5005D" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#B5005D" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B5005D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hcs-nodeGlow-amber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB300" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#FFB300" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hcs-nodeGlow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#00C853" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hcs-nodeGlow-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#4FC3F7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hcs-nodeGlow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF004E" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#FF004E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF004E" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="hcs-batteryFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#8B0048" />
            <stop offset="100%" stopColor="#FF004E" />
          </linearGradient>

          {/* Filters */}
          <filter id="hcs-glow-sm">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="hcs-glow-md">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="hcs-glow-lg">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1000" height="520" fill="url(#hcs-bg)" rx="20" />

        {/* Circuit board trace grid (very subtle) */}
        <g opacity="0.04">
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`hgrid-${i}`} x1="0" y1={35 * i} x2="1000" y2={35 * i} stroke="#B5005D" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`vgrid-${i}`} x1={50 * i} y1="0" x2={50 * i} y2="520" stroke="#B5005D" strokeWidth="0.5" />
          ))}
        </g>

        {/* ============================================================
            ENERGY FLOW PATHS — drawn as circuit traces
            ============================================================ */}

        {/* PATH: Sun → PV Panels (amber) */}
        <path d="M 130 130 L 130 180 Q 130 195 145 195 L 270 195"
              fill="none" stroke="#FFB300" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: PV → Inverter (amber) */}
        <path d="M 370 195 L 430 195 Q 445 195 445 210 L 445 240 Q 445 255 460 255 L 500 255"
              fill="none" stroke="#FFB300" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: Inverter → Battery (magenta) */}
        <path d="M 500 290 L 500 340 Q 500 355 485 355 L 370 355"
              fill="none" stroke="#B5005D" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: Battery → Home (magenta) */}
        <path d="M 270 355 L 200 355 Q 185 355 185 340 L 185 290"
              fill="none" stroke="#FF004E" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: Inverter → Grid (green) */}
        <path d="M 550 255 L 620 255 Q 635 255 635 240 L 635 170"
              fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: Inverter → EV (green) */}
        <path d="M 550 280 L 620 280 Q 635 280 635 295 L 635 355 Q 635 370 650 370 L 720 370"
              fill="none" stroke="#00C853" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.3" />

        {/* PATH: EMS → Monitoring (blue IoT) */}
        <path d="M 550 420 L 620 420 Q 635 420 635 405 L 635 390 Q 635 375 650 380 L 850 420 Q 870 425 870 405 L 870 180"
              fill="none" stroke="#4FC3F7" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

        {/* ============================================================
            ANIMATED PARTICLES on paths
            ============================================================ */}

        {/* Sun → PV particles (amber) */}
        {[0, 0.5].map((delay, i) => (
          <circle key={`p-sun-${i}`} r="3" fill="#FFB300" filter="url(#hcs-glow-sm)">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${delay}s`}
              path="M 130 130 L 130 180 Q 130 195 145 195 L 270 195" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
        ))}

        {/* PV → Inverter particles (amber) */}
        {[0, 0.7].map((delay, i) => (
          <circle key={`p-pv-inv-${i}`} r="3" fill="#FFB300" filter="url(#hcs-glow-sm)">
            <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay}s`}
              path="M 370 195 L 430 195 Q 445 195 445 210 L 445 240 Q 445 255 460 255 L 500 255" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
        ))}

        {/* Inverter → Battery particles (magenta) */}
        {[0.2, 1].map((delay, i) => (
          <circle key={`p-inv-bat-${i}`} r="3" fill="#B5005D" filter="url(#hcs-glow-sm)">
            <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay}s`}
              path="M 500 290 L 500 340 Q 500 355 485 355 L 370 355" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
        ))}

        {/* Battery → Home particles (red/pink) */}
        {[0.3, 1.2].map((delay, i) => (
          <circle key={`p-bat-home-${i}`} r="3" fill="#FF004E" filter="url(#hcs-glow-sm)">
            <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay}s`}
              path="M 270 355 L 200 355 Q 185 355 185 340 L 185 290" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
        ))}

        {/* Inverter → Grid particles (green) */}
        <circle r="2.5" fill="#00C853" filter="url(#hcs-glow-sm)">
          <animateMotion dur="2s" repeatCount="indefinite"
            path="M 550 255 L 620 255 Q 635 255 635 240 L 635 170" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Inverter → EV particles (green) */}
        <circle r="2.5" fill="#00C853" filter="url(#hcs-glow-sm)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s"
            path="M 550 280 L 620 280 Q 635 280 635 295 L 635 355 Q 635 370 650 370 L 720 370" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>

        {/* IoT signal pulse (blue) */}
        <circle r="2" fill="#4FC3F7" filter="url(#hcs-glow-sm)">
          <animateMotion dur="5s" repeatCount="indefinite"
            path="M 550 420 L 620 420 Q 635 420 635 405 L 635 390 Q 635 375 650 380 L 850 420 Q 870 425 870 405 L 870 180" />
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="5s" repeatCount="indefinite" />
        </circle>


        {/* ============================================================
            NODE: SUN
            ============================================================ */}
        <g>
          <circle cx="130" cy="90" r="50" fill="url(#hcs-nodeGlow-amber)" />
          <circle cx="130" cy="90" r="22" fill="#FFB300" opacity="0.15" />
          <circle cx="130" cy="90" r="16" fill="#FFCA28" opacity="0.8" filter="url(#hcs-glow-md)">
            <animate attributeName="r" values="14;18;14" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="90" r="12" fill="#FFD54F" />
          {/* Sun rays */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <line key={`hcs-ray-${i}`}
              x1={130 + Math.cos(angle * Math.PI / 180) * 20}
              y1={90 + Math.sin(angle * Math.PI / 180) * 20}
              x2={130 + Math.cos(angle * Math.PI / 180) * 28}
              y2={90 + Math.sin(angle * Math.PI / 180) * 28}
              stroke="#FFB300" strokeWidth="2" strokeLinecap="round" opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </line>
          ))}
          <text x="130" y="60" textAnchor="middle" fill="#FFB300" fontSize="10" fontWeight="700" letterSpacing="1">SŁOŃCE</text>
        </g>


        {/* ============================================================
            NODE: PV PANELS
            ============================================================ */}
        <g>
          <circle cx="320" cy="195" r="55" fill="url(#hcs-nodeGlow-amber)" />
          {/* Panel frame */}
          <rect x="270" y="165" width="100" height="60" rx="8" fill="#150830" stroke="#FFB300" strokeWidth="1.5" opacity="0.9" />
          {/* Solar cells grid */}
          {[0, 1, 2].map(row =>
            [0, 1, 2, 3].map(col => (
              <rect key={`cell-${row}-${col}`}
                x={278 + col * 22} y={172 + row * 17}
                width="18" height="13" rx="1.5"
                fill="#1a237e" stroke="#283593" strokeWidth="0.5">
                <animate attributeName="fill" values="#1a237e;#2a3aae;#1a237e"
                  dur={`${2 + (row * 4 + col) * 0.2}s`} repeatCount="indefinite" />
              </rect>
            ))
          )}
          {/* Shimmer effect */}
          <rect x="270" y="165" width="100" height="60" rx="8" fill="#FFB300" opacity="0">
            <animate attributeName="opacity" values="0;0.08;0" dur="3s" repeatCount="indefinite" />
          </rect>
          <text x="320" y="242" textAnchor="middle" fill="#FFB300" fontSize="10" fontWeight="700" letterSpacing="0.5">PANELE PV</text>
          <text x="320" y="254" textAnchor="middle" fill="#8a7aaa" fontSize="8">10 kWp</text>
        </g>


        {/* ============================================================
            NODE: HYBRID INVERTER
            ============================================================ */}
        <g>
          <circle cx="525" cy="270" r="55" fill="url(#hcs-nodeGlow-magenta)" />
          {/* Inverter body */}
          <rect x="485" y="237" width="80" height="65" rx="8" fill="#150830" stroke="#B5005D" strokeWidth="1.5" />
          {/* Display */}
          <rect x="495" y="245" width="60" height="28" rx="4" fill="#0a0418" stroke="#350066" strokeWidth="0.5" />
          {/* Display data */}
          <text x="525" y="256" textAnchor="middle" fill="#FF004E" fontSize="7" fontWeight="600">AC/DC</text>
          <text x="525" y="267" textAnchor="middle" fill="#B5005D" fontSize="11" fontWeight="700">3.2 kW</text>
          {/* LED indicators */}
          <circle cx="505" cy="285" r="3" fill="#00C853" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="515" cy="285" r="3" fill="#FFB300" opacity="0.5" />
          <circle cx="525" cy="285" r="3" fill="#B5005D" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Heat sink lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`hs-${i}`} x1={540 + i * 4} y1="280" x2={540 + i * 4} y2="295" stroke="#350066" strokeWidth="1" opacity="0.4" />
          ))}
          <text x="525" y="318" textAnchor="middle" fill="#B5005D" fontSize="10" fontWeight="700" letterSpacing="0.5">FALOWNIK</text>
          <text x="525" y="330" textAnchor="middle" fill="#8a7aaa" fontSize="8">hybrydowy 10 kW</text>
        </g>


        {/* ============================================================
            NODE: BATTERY STORAGE (hero element — largest)
            ============================================================ */}
        <g>
          <circle cx="320" cy="370" r="70" fill="url(#hcs-nodeGlow-red)" />
          {/* Battery body */}
          <rect x="260" y="330" width="120" height="75" rx="10" fill="#150830" stroke="#FF004E" strokeWidth="2" />
          {/* Inner glow */}
          <rect x="265" y="335" width="110" height="65" rx="7" fill="#B5005D" opacity="0.05" />
          {/* Battery terminals */}
          <rect x="295" y="325" width="15" height="8" rx="2" fill="#FF004E" opacity="0.6" />
          <rect x="330" y="325" width="15" height="8" rx="2" fill="#FF004E" opacity="0.6" />
          {/* Charge level bars */}
          {[0, 1, 2, 3, 4].map(i => (
            <g key={`hcs-bar-${i}`}>
              <rect x={272 + i * 21} y={345} width="17" height="45" rx="3"
                fill="#FF004E" opacity={0.15 + i * 0.05} />
              <rect x={272 + i * 21} y={345 + (45 - (10 + i * 8))} width="17" height={10 + i * 8} rx="3"
                fill="url(#hcs-batteryFill)" opacity={0.5 + i * 0.1}>
                <animate attributeName="height" values={`${8 + i * 6};${12 + i * 8};${8 + i * 6}`}
                  dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${345 + 45 - (8 + i * 6)};${345 + 45 - (12 + i * 8)};${345 + 45 - (8 + i * 6)}`}
                  dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
              </rect>
            </g>
          ))}
          {/* Percentage text */}
          <text x="320" y="404" textAnchor="middle" fill="#FF004E" fontSize="9" fontWeight="600" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
            87%
          </text>
          <text x="320" y="422" textAnchor="middle" fill="#FF004E" fontSize="11" fontWeight="700" letterSpacing="0.5">MAGAZYN ENERGII</text>
          <text x="320" y="435" textAnchor="middle" fill="#8a7aaa" fontSize="8">15 kWh · LFP</text>
        </g>


        {/* ============================================================
            NODE: HOME
            ============================================================ */}
        <g>
          <circle cx="140" cy="260" r="50" fill="url(#hcs-nodeGlow-red)" />
          {/* House shape */}
          <polygon points="140,215 100,245 100,295 180,295 180,245" fill="#150830" stroke="#FF004E" strokeWidth="1.5" />
          <polygon points="140,215 100,245 180,245" fill="#1a0a35" stroke="#FF004E" strokeWidth="1.5" />
          {/* Door */}
          <rect x="128" y="270" width="24" height="25" rx="3" fill="#0a0418" stroke="#5a3d8a" strokeWidth="0.8" />
          <circle cx="147" cy="283" r="1.5" fill="#FFB300" />
          {/* Windows with warm glow */}
          <rect x="108" y="252" width="16" height="12" rx="1.5" fill="#FFB300" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="156" y="252" width="16" height="12" rx="1.5" fill="#FFB300" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
          </rect>
          {/* Window cross lines */}
          <line x1="116" y1="252" x2="116" y2="264" stroke="#5a3d8a" strokeWidth="0.5" />
          <line x1="108" y1="258" x2="124" y2="258" stroke="#5a3d8a" strokeWidth="0.5" />
          <line x1="164" y1="252" x2="164" y2="264" stroke="#5a3d8a" strokeWidth="0.5" />
          <line x1="156" y1="258" x2="172" y2="258" stroke="#5a3d8a" strokeWidth="0.5" />
          <text x="140" y="312" textAnchor="middle" fill="#FF004E" fontSize="10" fontWeight="700" letterSpacing="0.5">DOM</text>
          <text x="140" y="324" textAnchor="middle" fill="#8a7aaa" fontSize="8">zużycie 8 000 kWh/r</text>
        </g>


        {/* ============================================================
            NODE: GRID
            ============================================================ */}
        <g>
          <circle cx="635" cy="130" r="45" fill="url(#hcs-nodeGlow-green)" />
          {/* Pylon shape */}
          <line x1="635" y1="100" x2="635" y2="165" stroke="#00C853" strokeWidth="2.5" opacity="0.7" />
          <line x1="615" y1="115" x2="655" y2="115" stroke="#00C853" strokeWidth="2" opacity="0.6" />
          <line x1="620" y1="130" x2="650" y2="130" stroke="#00C853" strokeWidth="1.5" opacity="0.5" />
          <line x1="625" y1="145" x2="645" y2="145" stroke="#00C853" strokeWidth="1" opacity="0.4" />
          {/* Wires */}
          <line x1="615" y1="115" x2="605" y2="108" stroke="#00C853" strokeWidth="1" opacity="0.3" />
          <line x1="655" y1="115" x2="665" y2="108" stroke="#00C853" strokeWidth="1" opacity="0.3" />
          <text x="635" y="182" textAnchor="middle" fill="#00C853" fontSize="10" fontWeight="700" letterSpacing="0.5">SIEĆ</text>
          <text x="635" y="194" textAnchor="middle" fill="#8a7aaa" fontSize="8">sprzedaż nadwyżek</text>
        </g>


        {/* ============================================================
            NODE: EV CHARGER
            ============================================================ */}
        <g>
          <circle cx="780" cy="370" r="45" fill="url(#hcs-nodeGlow-green)" />
          {/* Charger body */}
          <rect x="758" y="345" width="44" height="55" rx="6" fill="#150830" stroke="#00C853" strokeWidth="1.5" />
          {/* Screen */}
          <rect x="765" y="352" width="30" height="18" rx="3" fill="#0a0418" />
          <text x="780" y="364" textAnchor="middle" fill="#00C853" fontSize="7" fontWeight="600">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            7.4 kW
          </text>
          {/* Plug symbol */}
          <circle cx="780" cy="382" r="8" fill="none" stroke="#00C853" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M 777 380 L 783 382 L 777 384" fill="none" stroke="#00C853" strokeWidth="1.5" />
          {/* Cable */}
          <path d="M 780 400 Q 780 415 795 418 Q 810 420 820 415" fill="none" stroke="#00C853" strokeWidth="2" opacity="0.3" />
          <text x="780" y="415" textAnchor="middle" fill="#00C853" fontSize="10" fontWeight="700" letterSpacing="0.5">ŁADOWARKA</text>
          <text x="780" y="427" textAnchor="middle" fill="#8a7aaa" fontSize="8">EV 7.4 kW</text>
        </g>


        {/* ============================================================
            NODE: KENO EMS
            ============================================================ */}
        <g>
          <circle cx="525" cy="430" r="45" fill="url(#hcs-nodeGlow-blue)" />
          {/* EMS body */}
          <rect x="497" y="408" width="56" height="38" rx="6" fill="#150830" stroke="#4FC3F7" strokeWidth="1.5" />
          <text x="525" y="424" textAnchor="middle" fill="#4FC3F7" fontSize="9" fontWeight="700">KENO</text>
          <text x="525" y="436" textAnchor="middle" fill="#4FC3F7" fontSize="7" opacity="0.7">EMS</text>
          {/* Signal arcs */}
          {[0, 1, 2].map(i => (
            <path key={`sig-${i}`}
              d={`M ${555 + i * 6} ${418 - i * 3} Q ${560 + i * 8} ${413 - i * 4} ${557 + i * 6} ${430 + i * 3}`}
              fill="none" stroke="#4FC3F7" strokeWidth="1" opacity={0.15 + i * 0.1}>
              <animate attributeName="opacity" values={`${0.1 + i * 0.05};${0.4 + i * 0.1};${0.1 + i * 0.05}`}
                dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
          ))}
          {/* Connection to inverter */}
          <path d="M 525 408 L 525 340" fill="none" stroke="#4FC3F7" strokeWidth="1" strokeDasharray="4 3" opacity="0.2" />
          <text x="525" y="462" textAnchor="middle" fill="#4FC3F7" fontSize="10" fontWeight="700" letterSpacing="0.5">KENO EMS</text>
          <text x="525" y="474" textAnchor="middle" fill="#8a7aaa" fontSize="8">monitoring + AI</text>
        </g>


        {/* ============================================================
            NODE: MONITORING APP (smartphone)
            ============================================================ */}
        <g>
          <circle cx="870" cy="140" r="45" fill="url(#hcs-nodeGlow-blue)" />
          {/* Phone body */}
          <rect x="849" y="105" width="42" height="72" rx="7" fill="#150830" stroke="#4FC3F7" strokeWidth="1.5" />
          {/* Screen */}
          <rect x="854" y="115" width="32" height="48" rx="3" fill="#0a0418" />
          {/* Screen content */}
          <text x="870" y="128" textAnchor="middle" fill="#4FC3F7" fontSize="6" fontWeight="600" letterSpacing="0.5">NEXBE</text>
          {/* Battery indicator */}
          <rect x="858" y="133" width="24" height="4" rx="1" fill="#FF004E" opacity="0.3" />
          <rect x="858" y="133" width="18" height="4" rx="1" fill="#FF004E" opacity="0.7">
            <animate attributeName="width" values="12;20;15;18" dur="6s" repeatCount="indefinite" />
          </rect>
          {/* Savings text */}
          <text x="870" y="147" textAnchor="middle" fill="#FFB300" fontSize="6" fontWeight="600">87%</text>
          <text x="870" y="156" textAnchor="middle" fill="#00C853" fontSize="5">+342 zł/msc</text>
          {/* Home button dot */}
          <circle cx="870" cy="170" r="2.5" fill="none" stroke="#5a3d8a" strokeWidth="0.8" />
          <text x="870" y="195" textAnchor="middle" fill="#4FC3F7" fontSize="10" fontWeight="700" letterSpacing="0.5">MONITORING</text>
          <text x="870" y="207" textAnchor="middle" fill="#8a7aaa" fontSize="8">aplikacja 24/7</text>
        </g>


        {/* ============================================================
            FLOW DIRECTION ARROWS on paths
            ============================================================ */}
        {/* Arrow indicators (small triangles along paths) */}
        <polygon points="200,195 208,190 208,200" fill="#FFB300" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="470,255 478,250 478,260" fill="#FFB300" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </polygon>
        <polygon points="430,355 422,350 422,360" fill="#B5005D" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.3s" />
        </polygon>
        <polygon points="185,320 180,328 190,328" fill="#FF004E" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.7s" />
        </polygon>
        <polygon points="635,200 630,208 640,208" fill="#00C853" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.4s" />
        </polygon>
        <polygon points="680,370 688,365 688,375" fill="#00C853" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.6s" />
        </polygon>


        {/* ============================================================
            LEGEND
            ============================================================ */}
        <g transform="translate(40, 495)">
          <circle cx="0" cy="0" r="4" fill="#FFB300" />
          <text x="10" y="4" fill="#8a7aaa" fontSize="8" fontWeight="500">Energia słoneczna</text>
          <circle cx="140" cy="0" r="4" fill="#FF004E" />
          <text x="150" y="4" fill="#8a7aaa" fontSize="8" fontWeight="500">Z magazynu</text>
          <circle cx="250" cy="0" r="4" fill="#00C853" />
          <text x="260" y="4" fill="#8a7aaa" fontSize="8" fontWeight="500">Sieć / EV</text>
          <circle cx="340" cy="0" r="4" fill="#4FC3F7" />
          <text x="350" y="4" fill="#8a7aaa" fontSize="8" fontWeight="500">IoT monitoring</text>
          <circle cx="450" cy="0" r="4" fill="#B5005D" />
          <text x="460" y="4" fill="#8a7aaa" fontSize="8" fontWeight="500">Ładowanie magazynu</text>
        </g>

      </svg>
    </div>
  );
}
