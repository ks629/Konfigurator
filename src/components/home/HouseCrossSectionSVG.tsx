'use client';

/**
 * Hi-Tech house cross-section SVG illustration
 * Shows energy storage system integrated into a modern home
 * Animated energy flows with glowing effects
 */
export function HouseCrossSectionSVG() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 900 500" className="w-full h-auto" style={{ minHeight: '300px' }}>
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a103a" />
            <stop offset="100%" stopColor="#2d1a5e" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3080" />
            <stop offset="100%" stopColor="#350066" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f6ff" />
            <stop offset="100%" stopColor="#ede8f5" />
          </linearGradient>
          <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a237e" />
            <stop offset="100%" stopColor="#0d1442" />
          </linearGradient>
          <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B5005D" />
            <stop offset="100%" stopColor="#8a0047" />
          </linearGradient>
          <linearGradient id="energyGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF004E" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF004E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF004E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="solarGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFB300" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFB300" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e0f0" />
            <stop offset="100%" stopColor="#d4cae5" />
          </linearGradient>

          {/* Glow filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="900" height="500" fill="url(#skyGrad)" rx="16" />

        {/* Stars */}
        {[
          [80, 30], [150, 55], [250, 20], [380, 45], [520, 25], [650, 50], [750, 30], [830, 55],
          [120, 70], [300, 65], [460, 38], [700, 68], [180, 42], [600, 58],
        ].map(([cx, cy], i) => (
          <circle key={`star-${i}`} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.3 + (i % 3) * 0.2}>
            <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.15};${0.5 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.15}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Ground */}
        <rect x="0" y="420" width="900" height="80" fill="url(#groundGrad)" />

        {/* ===== HOUSE STRUCTURE ===== */}
        {/* House walls (cross-section) */}
        <rect x="200" y="200" width="500" height="220" fill="url(#wallGrad)" stroke="#c4b5d9" strokeWidth="2" rx="3" />

        {/* Wall thickness indicator */}
        <rect x="200" y="200" width="12" height="220" fill="#d4cae5" />
        <rect x="688" y="200" width="12" height="220" fill="#d4cae5" />

        {/* Floor line */}
        <line x1="200" y1="330" x2="700" y2="330" stroke="#c4b5d9" strokeWidth="1.5" strokeDasharray="8 4" />
        <text x="215" y="345" fill="#8a7aaa" fontSize="8" fontWeight="600">PIWNICA / GARAŻ</text>
        <text x="215" y="225" fill="#8a7aaa" fontSize="8" fontWeight="600">PARTER</text>

        {/* Roof */}
        <polygon points="180,200 450,100 720,200" fill="url(#roofGrad)" stroke="#5a3d8a" strokeWidth="2" />

        {/* ===== SOLAR PANELS ON ROOF ===== */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 270 + i * 55;
          const y1 = 200 - ((x - 180) / (450 - 180)) * 100;
          const y2 = 200 - ((x + 45 - 180) / (450 - 180)) * 100;
          const yMid = (y1 + y2) / 2;
          if (x + 45 > 450) return null;
          return (
            <g key={`panel-${i}`}>
              <rect x={x} y={yMid - 5} width="45" height="18" fill="url(#panelGrad)" stroke="#3949ab" strokeWidth="1" rx="1"
                transform={`rotate(${-Math.atan2(100, 270) * (180 / Math.PI)}, ${x + 22}, ${yMid + 4})`} />
              {/* Panel grid lines */}
              <line x1={x + 15} y1={yMid - 4} x2={x + 15} y2={yMid + 12} stroke="#3949ab" strokeWidth="0.5" opacity="0.5"
                transform={`rotate(${-Math.atan2(100, 270) * (180 / Math.PI)}, ${x + 22}, ${yMid + 4})`} />
              <line x1={x + 30} y1={yMid - 4} x2={x + 30} y2={yMid + 12} stroke="#3949ab" strokeWidth="0.5" opacity="0.5"
                transform={`rotate(${-Math.atan2(100, 270) * (180 / Math.PI)}, ${x + 22}, ${yMid + 4})`} />
              {/* Solar shimmer */}
              <rect x={x} y={yMid - 5} width="45" height="18" fill="#FFB300" opacity="0" rx="1"
                transform={`rotate(${-Math.atan2(100, 270) * (180 / Math.PI)}, ${x + 22}, ${yMid + 4})`}>
                <animate attributeName="opacity" values="0;0.15;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
              </rect>
            </g>
          );
        })}

        {/* Sun indicator */}
        <circle cx="100" cy="100" r="25" fill="#FFB300" opacity="0.8" filter="url(#softGlow)">
          <animate attributeName="r" values="23;27;23" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="18" fill="#FFCA28" />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line key={`ray-${i}`} x1={100 + Math.cos(angle * Math.PI / 180) * 30} y1={100 + Math.sin(angle * Math.PI / 180) * 30}
            x2={100 + Math.cos(angle * Math.PI / 180) * 38} y2={100 + Math.sin(angle * Math.PI / 180) * 38}
            stroke="#FFB300" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Solar energy arrow: Sun → Panels */}
        <path d="M 130 115 Q 200 130 280 155" fill="none" stroke="#FFB300" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
        <circle r="4" fill="#FFB300" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M 130 115 Q 200 130 280 155" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ===== BATTERY STORAGE (Basement) ===== */}
        <g>
          {/* Battery unit */}
          <rect x="280" y="350" width="80" height="55" rx="6" fill="url(#batteryGrad)" stroke="#FF004E" strokeWidth="1.5" />
          <rect x="285" y="355" width="70" height="8" rx="2" fill="#FF004E" opacity="0.4" />
          <rect x="285" y="355" width="50" height="8" rx="2" fill="#FF004E" opacity="0.7">
            <animate attributeName="width" values="20;55;35;50" dur="8s" repeatCount="indefinite" />
          </rect>
          {/* Battery charge level bars */}
          {[0, 1, 2, 3].map(i => (
            <rect key={`bar-${i}`} x={290 + i * 16} y={370} width="12" height="28" rx="2" fill="#FF004E" opacity={0.3 + i * 0.15}>
              <animate attributeName="opacity" values={`${0.2 + i * 0.1};${0.5 + i * 0.12};${0.2 + i * 0.1}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            </rect>
          ))}
          <text x="320" y="415" textAnchor="middle" fill="#230045" fontSize="10" fontWeight="700">Magazyn energii</text>
          <text x="320" y="427" textAnchor="middle" fill="#8a7aaa" fontSize="8">15 kWh · LFP</text>
        </g>

        {/* ===== INVERTER (Basement) ===== */}
        <g>
          <rect x="420" y="355" width="55" height="45" rx="4" fill="#350066" stroke="#5a3d8a" strokeWidth="1.5" />
          {/* Display screen */}
          <rect x="428" y="360" width="40" height="20" rx="2" fill="#0d1442" />
          <text x="448" y="374" textAnchor="middle" fill="#00E676" fontSize="8" fontWeight="600">3.2 kW</text>
          {/* Status LED */}
          <circle cx="438" cy="390" r="3" fill="#00E676">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="458" cy="390" r="3" fill="#FFB300" opacity="0.4" />
          <text x="448" y="415" textAnchor="middle" fill="#230045" fontSize="10" fontWeight="700">Falownik</text>
          <text x="448" y="427" textAnchor="middle" fill="#8a7aaa" fontSize="8">hybrydowy 10kW</text>
        </g>

        {/* ===== EMS CONTROLLER ===== */}
        <g>
          <rect x="530" y="360" width="45" height="35" rx="4" fill="#0066CC" stroke="#3388DD" strokeWidth="1" />
          <text x="552" y="373" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">KENO</text>
          <text x="552" y="383" textAnchor="middle" fill="white" fontSize="6">EMS</text>
          {/* Signal waves */}
          <path d="M 575 370 Q 585 365 585 378" fill="none" stroke="#4FC3F7" strokeWidth="1" opacity="0.5">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M 575 370 Q 590 362 590 382" fill="none" stroke="#4FC3F7" strokeWidth="1" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </path>
          <text x="552" y="410" textAnchor="middle" fill="#230045" fontSize="9" fontWeight="700">Keno EMS</text>
        </g>

        {/* ===== ENERGY FLOW LINES ===== */}
        {/* Battery → Inverter */}
        <line x1="360" y1="375" x2="420" y2="375" stroke="#FF004E" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
        <circle r="3" fill="#FF004E" filter="url(#glow)">
          <animateMotion dur="1.5s" repeatCount="indefinite" path="M 360 375 L 420 375" />
        </circle>

        {/* Inverter → EMS */}
        <line x1="475" y1="375" x2="530" y2="375" stroke="#4FC3F7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

        {/* Panels → Inverter (through wall) */}
        <path d="M 350 180 L 350 200 L 448 200 L 448 355" fill="none" stroke="#FFB300" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
        <circle r="3" fill="#FFB300" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 350 180 L 350 200 L 448 200 L 448 355" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Inverter → Home (up) */}
        <path d="M 448 355 L 448 330 L 500 280" fill="none" stroke="#B5005D" strokeWidth="2" strokeDasharray="6 4" opacity="0.35" />
        <circle r="3" fill="#B5005D" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M 448 355 L 448 330 L 500 280" />
        </circle>

        {/* ===== LIVING ROOM (inside house) ===== */}
        {/* Kitchen / appliances area */}
        <g opacity="0.7">
          {/* Fridge */}
          <rect x="230" y="240" width="25" height="45" rx="3" fill="#e0d8ee" stroke="#c4b5d9" strokeWidth="1" />
          <line x1="230" y1="262" x2="255" y2="262" stroke="#c4b5d9" strokeWidth="0.5" />
          {/* Stove/Oven */}
          <rect x="265" y="265" width="30" height="20" rx="2" fill="#e0d8ee" stroke="#c4b5d9" strokeWidth="1" />
          <circle cx="275" cy="275" r="4" fill="none" stroke="#B5005D" strokeWidth="1" opacity="0.5" />
          <circle cx="288" cy="275" r="3" fill="none" stroke="#B5005D" strokeWidth="1" opacity="0.3" />
        </g>

        {/* Living area */}
        <g opacity="0.7">
          {/* Sofa */}
          <rect x="480" y="290" width="60" height="20" rx="4" fill="#d4cae5" stroke="#c4b5d9" strokeWidth="1" />
          <rect x="475" y="285" width="10" height="25" rx="3" fill="#d4cae5" stroke="#c4b5d9" strokeWidth="1" />
          <rect x="535" y="285" width="10" height="25" rx="3" fill="#d4cae5" stroke="#c4b5d9" strokeWidth="1" />
          {/* TV */}
          <rect x="490" y="240" width="40" height="25" rx="2" fill="#0d1442" stroke="#3949ab" strokeWidth="1" />
          <rect x="507" y="265" width="6" height="8" fill="#c4b5d9" />
          {/* TV glow */}
          <rect x="492" y="242" width="36" height="21" rx="1" fill="#4FC3F7" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Lights */}
        {[350, 500, 620].map((cx, i) => (
          <g key={`light-${i}`}>
            <line x1={cx} y1="200" x2={cx} y2="215" stroke="#c4b5d9" strokeWidth="1" />
            <circle cx={cx} cy="218" r="5" fill="#FFF9C4" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy="218" r="10" fill="#FFF9C4" opacity="0.1">
              <animate attributeName="opacity" values="0.05;0.15;0.05" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ===== WINDOW ===== */}
        <rect x="380" y="230" width="50" height="50" rx="2" fill="#1a103a" stroke="#c4b5d9" strokeWidth="2" opacity="0.6" />
        <line x1="405" y1="230" x2="405" y2="280" stroke="#c4b5d9" strokeWidth="1" />
        <line x1="380" y1="255" x2="430" y2="255" stroke="#c4b5d9" strokeWidth="1" />

        {/* ===== EV CHARGER (outside) ===== */}
        <g>
          <rect x="740" y="370" width="30" height="50" rx="4" fill="#350066" stroke="#5a3d8a" strokeWidth="1.5" />
          <circle cx="755" cy="385" r="6" fill="none" stroke="#00E676" strokeWidth="1.5">
            <animate attributeName="strokeOpacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M 753 383 L 757 385 L 753 388" fill="none" stroke="#00E676" strokeWidth="1.5" />
          {/* Cable to car area */}
          <path d="M 755 420 C 755 435 780 440 800 435" fill="none" stroke="#5a3d8a" strokeWidth="2" />
          <text x="755" y="440" textAnchor="middle" fill="#230045" fontSize="9" fontWeight="700">Ładowarka EV</text>
        </g>

        {/* Connection from house to EV */}
        <line x1="700" y1="380" x2="740" y2="380" stroke="#00E676" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

        {/* ===== GRID CONNECTION ===== */}
        <g>
          {/* Power pole simplified */}
          <rect x="140" y="320" width="6" height="100" fill="#5a3d8a" />
          <line x1="130" y1="335" x2="158" y2="335" stroke="#5a3d8a" strokeWidth="2" />
          <line x1="134" y1="350" x2="154" y2="350" stroke="#5a3d8a" strokeWidth="1.5" />
          {/* Wire to house */}
          <path d="M 158 335 Q 180 330 200 340" fill="none" stroke="#5a3d8a" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
          <text x="143" y="440" textAnchor="middle" fill="#230045" fontSize="9" fontWeight="700">Sieć</text>
        </g>

        {/* ===== SMARTPHONE/MONITORING ===== */}
        <g>
          <rect x="790" y="190" width="55" height="90" rx="8" fill="#1a103a" stroke="#5a3d8a" strokeWidth="2" />
          <rect x="795" y="200" width="45" height="65" rx="3" fill="#0d1442" />
          {/* Phone screen content */}
          <text x="817" y="215" textAnchor="middle" fill="#4FC3F7" fontSize="7" fontWeight="600">NEXBE</text>
          <rect x="800" y="222" width="35" height="4" rx="1" fill="#00E676" opacity="0.6" />
          <rect x="800" y="222" width="25" height="4" rx="1" fill="#00E676">
            <animate attributeName="width" values="15;30;20;25" dur="5s" repeatCount="indefinite" />
          </rect>
          <text x="817" y="237" textAnchor="middle" fill="#FFB300" fontSize="6">87% naład.</text>
          <rect x="800" y="242" width="35" height="3" rx="1" fill="#B5005D" opacity="0.3" />
          <text x="817" y="255" textAnchor="middle" fill="#4FC3F7" fontSize="6">+342 zł/msc</text>
          {/* Home button */}
          <circle cx="817" cy="275" r="3" fill="none" stroke="#5a3d8a" strokeWidth="1" />
          {/* WiFi signal from EMS */}
          <path d="M 575 370 Q 680 300 790 240" fill="none" stroke="#4FC3F7" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
          <text x="817" y="300" textAnchor="middle" fill="#230045" fontSize="9" fontWeight="700">Monitoring</text>
          <text x="817" y="312" textAnchor="middle" fill="#8a7aaa" fontSize="7">aplikacja 24/7</text>
        </g>

        {/* ===== LABELS ===== */}
        {/* PV label */}
        <g>
          <rect x="315" y="110" width="95" height="22" rx="11" fill="#FFB300" opacity="0.15" />
          <text x="362" y="125" textAnchor="middle" fill="#FFB300" fontSize="9" fontWeight="700">Panele PV 10kWp</text>
        </g>

        {/* Energy flow legend */}
        <g transform="translate(30, 460)">
          <circle cx="0" cy="0" r="4" fill="#FFB300" />
          <text x="10" y="4" fill="#8a7aaa" fontSize="8">Energia słoneczna</text>
          <circle cx="130" cy="0" r="4" fill="#FF004E" />
          <text x="140" y="4" fill="#8a7aaa" fontSize="8">Energia z magazynu</text>
          <circle cx="280" cy="0" r="4" fill="#00E676" />
          <text x="290" y="4" fill="#8a7aaa" fontSize="8">Ładowanie EV</text>
          <circle cx="400" cy="0" r="4" fill="#4FC3F7" />
          <text x="410" y="4" fill="#8a7aaa" fontSize="8">Komunikacja IoT</text>
        </g>
      </svg>
    </div>
  );
}
