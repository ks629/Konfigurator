'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Zap } from 'lucide-react';
import { fadeUp, staggerContainer, ease } from '@/lib/animations';

const EnergyOrb = lazy(() => import('./EnergyOrb'));

function OrbFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-64 h-64 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, #B5005D 0%, #350066 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(240,232,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(240,232,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        {/* Orbs */}
        <div
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(53, 0, 102, 0.3), transparent 70%)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(181, 0, 93, 0.15), transparent 70%)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255, 0, 78, 0.06), transparent 60%)', filter: 'blur(120px)' }}
        />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Text */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="section-label">
                <Zap className="w-3 h-3 text-nexbe-flame" />
                Partner Keno Energy — #1 dystrybutor OZE w Polsce
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.03em]"
              variants={fadeUp}
            >
              MAGAZYN ENERGII
              <br />
              <span className="gradient-text">BEZ POŚREDNIKÓW.</span>
              <br />
              NAJLEPSZA CENA
              <br />
              W POLSCE.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-nexbe-text-muted max-w-[540px] leading-relaxed"
              variants={fadeUp}
            >
              Kupujesz bezpośrednio od lidera rynku. Montaż w 14 dni
              — tylko sprawdzeni instalatorzy. 100% online. Zero presji.
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-wrap gap-4" variants={fadeUp}>
              <Link href="/konfigurator" className="btn-primary text-base">
                Konfiguruj swój magazyn
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#oferta" className="btn-secondary text-base">
                Zobacz ofertę
                <ChevronDown className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right — 3D Orb (desktop) / Fallback (mobile) */}
          <motion.div
            className="hidden md:block relative h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
          >
            <Suspense fallback={<OrbFallback />}>
              <EnergyOrb />
            </Suspense>
          </motion.div>

          {/* Mobile fallback glow */}
          <div className="md:hidden flex items-center justify-center h-40">
            <div
              className="w-48 h-48 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(181, 0, 93, 0.3) 0%, rgba(53, 0, 102, 0.2) 40%, transparent 70%)',
                filter: 'blur(30px)',
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center gap-2 text-nexbe-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <ChevronDown className="w-5 h-5" style={{ animation: 'scroll-hint 2s ease-in-out infinite' }} />
        </motion.div>
      </div>
    </section>
  );
}
