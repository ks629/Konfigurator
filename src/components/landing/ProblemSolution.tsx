'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { problems, solutions } from '@/lib/data';
import { fadeUp, slideFromLeft, slideFromRight, staggerContainerSlow } from '@/lib/animations';

export default function ProblemSolution() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(53, 0, 102, 0.4), transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label mb-6 inline-block">DLACZEGO NEXBE</span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-[-0.02em] mt-4">
            Koniec z pośrednikami
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem column */}
          <motion.div
            className="rounded-2xl p-8 lg:p-10 border border-nexbe-border bg-nexbe-surface/20"
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="font-display font-semibold text-lg text-nexbe-text-muted mb-8">
              Jak wygląda zakup magazynu energii w Polsce?
            </h3>
            <motion.ul
              className="space-y-5"
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {problems.map((problem) => (
                <motion.li key={problem} variants={fadeUp} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5">
                    <X className="w-4 h-4 text-red-400" />
                  </span>
                  <span className="text-nexbe-text-muted text-[15px] leading-relaxed">{problem}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Solution column */}
          <motion.div
            className="rounded-2xl p-8 lg:p-10 gradient-border bg-nexbe-surface/40"
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="font-display font-semibold text-lg text-nexbe-text mb-8">
              Jak to wygląda z Nexbe?
            </h3>
            <motion.ul
              className="space-y-5"
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {solutions.map((solution) => (
                <motion.li key={solution} variants={fadeUp} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </span>
                  <span className="text-nexbe-text text-[15px] leading-relaxed">{solution}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
