'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { NexbiEmotion, NexbiCostume } from '../engine/types';

interface Props {
  size?: number;
  emotion?: NexbiEmotion;
  costume?: NexbiCostume;
  className?: string;
  enableEyeTracking?: boolean;
}

const EMOTIONS: Record<NexbiEmotion, {
  mouth: string;
  eyeScale: number;
  blush: number;
}> = {
  happy: { mouth: 'M118,190 Q130,203 142,190', eyeScale: 1, blush: 0.15 },
  curious: { mouth: 'M122,194 Q130,196 138,194', eyeScale: 1.15, blush: 0.05 },
  teaching: { mouth: 'M120,192 Q130,198 140,192', eyeScale: 1.05, blush: 0.1 },
  excited: { mouth: 'M115,188 Q130,208 145,188', eyeScale: 1.2, blush: 0.25 },
  sleeping: { mouth: 'M122,196 Q130,194 138,196', eyeScale: 0.08, blush: 0.15 },
  waving: { mouth: 'M116,189 Q130,205 144,189', eyeScale: 1.1, blush: 0.2 },
  thinking: { mouth: 'M122,194 Q130,192 138,196', eyeScale: 1.05, blush: 0.05 },
};

let globalCounter = 0;
function useStableId() {
  const ref = useRef('');
  if (!ref.current) ref.current = `nexbi-${++globalCounter}`;
  return ref.current;
}

export default function NexbiCharacter({
  size = 80,
  emotion = 'happy',
  costume,
  className = '',
  enableEyeTracking = false,
}: Props) {
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const idPrefix = useStableId();

  useEffect(() => {
    if (emotion === 'sleeping') return;
    const blink = () => {
      setBlinkPhase(true);
      setTimeout(() => setBlinkPhase(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [emotion]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!svgRef.current || emotion === 'sleeping') return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height * 0.4);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxMove = 3;
    setEyeOffset({
      x: (dx / Math.max(dist, 1)) * Math.min(dist * 0.015, maxMove),
      y: (dy / Math.max(dist, 1)) * Math.min(dist * 0.015, maxMove),
    });
  }, [emotion]);

  useEffect(() => {
    if (!enableEyeTracking) return;
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [enableEyeTracking, handleMouseMove]);

  const em = EMOTIONS[emotion];
  const id = idPrefix;

  return (
    <motion.svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 260 400"
      fill="none"
      className={className}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <linearGradient id={`${id}-energy`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF004E" />
          <stop offset="100%" stopColor="#B5005D" />
        </linearGradient>
        <clipPath id={`${id}-bodyClip`}>
          <rect x="80" y="100" width="100" height="215" rx="24" />
        </clipPath>
      </defs>

      <motion.g
        animate={
          emotion === 'sleeping'
            ? { y: [0, 3, 0], rotate: [0, 1.5, 0] }
            : emotion === 'excited'
              ? { y: [0, -12, 0], scale: [1, 1.02, 1] }
              : emotion === 'curious'
                ? { y: [0, -4, 0], rotate: [0, 3, 0] }
                : emotion === 'teaching'
                  ? { y: [0, -2, 0], rotate: [0, -2, 0] }
                  : { y: [0, -3, 0] }
        }
        transition={{
          duration: emotion === 'excited' ? 0.6 : emotion === 'sleeping' ? 4 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
          ...(emotion === 'excited' && { repeatType: 'reverse' as const }),
        }}
        style={{ transformOrigin: '130px 300px' }}
      >
        {/* Legs */}
        <motion.g
          animate={emotion === 'excited' ? { y: [0, 8, 0] } : {}}
          transition={emotion === 'excited' ? { duration: 0.6, repeat: Infinity, repeatType: 'reverse' } : {}}
        >
          <rect x="100" y="312" width="20" height="36" rx="10" fill="#2A0050" />
          <rect x="90" y="340" width="36" height="18" rx="9" fill="#350066" />
          <rect x="140" y="312" width="20" height="36" rx="10" fill="#2A0050" />
          <rect x="134" y="340" width="36" height="18" rx="9" fill="#350066" />
        </motion.g>

        {/* Left arm */}
        <motion.g
          animate={
            emotion === 'excited'
              ? { rotate: [15, 35, 15] }
              : emotion === 'curious'
                ? { rotate: -10, x: -5 }
                : emotion === 'teaching'
                  ? { rotate: 15 }
                  : emotion === 'sleeping'
                    ? { rotate: -5, y: 10 }
                    : emotion === 'happy'
                      ? { rotate: [0, 8, 0] }
                      : {}
          }
          transition={{ duration: emotion === 'excited' ? 0.6 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '38px 185px' }}
        >
          <rect x="28" y="185" width="20" height="50" rx="10" fill="#350066" transform="rotate(-12,38,185)" />
          <circle cx="24" cy="242" r="17" fill="#45007A" />
        </motion.g>

        {/* Right arm */}
        <motion.g
          animate={
            emotion === 'waving'
              ? { rotate: [0, -30, 15, -30, 0] }
              : emotion === 'excited'
                ? { rotate: [-15, -35, -15] }
                : emotion === 'curious'
                  ? { rotate: 10, x: 5 }
                  : emotion === 'teaching'
                    ? { rotate: -45, y: -10 }
                    : emotion === 'sleeping'
                      ? { rotate: 5, y: 10 }
                      : emotion === 'happy'
                        ? { rotate: [0, -8, 0] }
                        : {}
          }
          transition={
            emotion === 'waving'
              ? { duration: 0.5, repeat: 4, ease: 'easeInOut' }
              : { duration: emotion === 'excited' ? 0.6 : 1.5, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: '222px 185px' }}
        >
          <rect x="212" y="185" width="20" height="50" rx="10" fill="#350066" transform="rotate(12,222,185)" />
          <circle cx="236" cy="242" r="17" fill="#45007A" />
        </motion.g>

        {/* Body */}
        <rect x="80" y="100" width="100" height="215" rx="24" fill="#350066" />

        {/* Battery fill */}
        <g clipPath={`url(#${id}-bodyClip)`} opacity="0.35">
          <motion.rect x="80" y="265" width="100" height="50" fill="#FF004E" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0 }} />
          <motion.rect x="80" y="215" width="100" height="50" fill="#FF004E" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
          <motion.rect x="80" y="165" width="100" height="50" fill="#B5005D" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.0 }} />
          <motion.rect x="80" y="100" width="100" height="65" fill="#B5005D" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
          <motion.circle cx="110" cy="290" r="3" fill="#FF004E" animate={{ opacity: [0, 0.5, 0.3, 0], y: [0, -160] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="145" cy="285" r="2.5" fill="#B5005D" animate={{ opacity: [0, 0.5, 0.3, 0], y: [0, -160] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} />
          <motion.circle cx="125" cy="295" r="2" fill="#FF004E" animate={{ opacity: [0, 0.5, 0.3, 0], y: [0, -160] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }} />
        </g>

        {/* NEXBI text */}
        <text x="130" y="272" textAnchor="middle" fill="#F0E8FF" fontFamily="'Space Grotesk', sans-serif" fontSize="16" fontWeight="700" letterSpacing="3" opacity="0.85">NEXBI</text>

        {/* Antenna */}
        <rect x="127" y="68" width="6" height="34" rx="3" fill="#45007A" />
        <motion.circle cx="130" cy="64" r="6" fill="#FF004E" animate={{ scale: [0.7, 1, 0.7], opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '130px 64px' }} />

        {/* Face */}
        <g>
          {/* Left eye */}
          <g style={{ transformOrigin: '112px 158px', transform: `scaleY(${blinkPhase ? 0.05 : em.eyeScale})`, transition: 'transform 0.1s ease' }}>
            <rect x="94" y="138" width="36" height="40" rx="16" fill="#0D0019" />
            <rect x="98" y="142" width="28" height="32" rx="12" fill="#FF004E" transform={enableEyeTracking ? `translate(${eyeOffset.x * 0.5},${eyeOffset.y * 0.5})` : undefined} />
            <circle cx="112" cy="153" r="7" fill="#fff" transform={enableEyeTracking ? `translate(${eyeOffset.x},${eyeOffset.y})` : undefined} />
            <circle cx="116" cy="149" r="3" fill="#fff" opacity="0.5" />
          </g>

          {/* Right eye */}
          <g style={{ transformOrigin: '148px 158px', transform: `scaleY(${blinkPhase ? 0.05 : em.eyeScale})`, transition: 'transform 0.1s ease' }}>
            <rect x="130" y="138" width="36" height="40" rx="16" fill="#0D0019" />
            <rect x="134" y="142" width="28" height="32" rx="12" fill="#FF004E" transform={enableEyeTracking ? `translate(${eyeOffset.x * 0.5},${eyeOffset.y * 0.5})` : undefined} />
            <circle cx="148" cy="153" r="7" fill="#fff" transform={enableEyeTracking ? `translate(${eyeOffset.x},${eyeOffset.y})` : undefined} />
            <circle cx="152" cy="149" r="3" fill="#fff" opacity="0.5" />
          </g>

          {/* Mouth */}
          <path d={em.mouth} fill="none" stroke="#FF004E" strokeWidth="3" strokeLinecap="round" />

          {/* Cheek blush */}
          <circle cx="92" cy="180" r="8" fill={`rgba(255,0,78,${em.blush})`} />
          <circle cx="168" cy="180" r="8" fill={`rgba(255,0,78,${em.blush})`} />

          {/* Sleeping Zzz */}
          {emotion === 'sleeping' && (
            <>
              <motion.text x="170" y="130" fill="#B5005D" fontSize="14" fontWeight="700" opacity="0" animate={{ opacity: [0, 0.7, 0], y: [130, 110] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>z</motion.text>
              <motion.text x="185" y="115" fill="#B5005D" fontSize="18" fontWeight="700" opacity="0" animate={{ opacity: [0, 0.5, 0], y: [115, 90] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>Z</motion.text>
              <motion.text x="200" y="95" fill="#B5005D" fontSize="22" fontWeight="700" opacity="0" animate={{ opacity: [0, 0.4, 0], y: [95, 65] }} transition={{ duration: 2, repeat: Infinity, delay: 1.0 }}>Z</motion.text>
            </>
          )}
        </g>
      </motion.g>
    </motion.svg>
  );
}
