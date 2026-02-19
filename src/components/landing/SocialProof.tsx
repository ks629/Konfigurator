'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '@/lib/data';
import { staggerContainer, counterVariant } from '@/lib/animations';

function Counter({ value, prefix, suffix, duration = 2 }: { value: number; prefix?: string; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const stepTime = Math.max(Math.floor((duration * 1000) / end), 10);
    const increment = Math.max(Math.ceil(end / (duration * 60)), 1);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-display font-extrabold text-[clamp(2.5rem,4vw,3.5rem)] gradient-text tabular-nums">
      {prefix}{count.toLocaleString('pl-PL')}{suffix}
    </span>
  );
}

export default function SocialProof() {
  return (
    <section className="relative py-16 border-y border-nexbe-border">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-nexbe-surface/30" />

      <motion.div
        className="relative max-w-[1320px] mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={counterVariant} className="text-center space-y-2">
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-sm font-semibold text-nexbe-text">{stat.label}</p>
              <p className="text-xs text-nexbe-text-muted">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
