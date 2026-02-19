'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { processSteps } from '@/lib/data';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="jak-to-dziala" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label mb-6 inline-block">PROCES</span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-[-0.02em] mt-4">
            Od rozmowy do montażu w 7 dni
          </h2>
          <p className="text-nexbe-text-muted mt-4 max-w-md mx-auto">
            Cały proces 100% zdalny. Zero wizyt handlowców.
          </p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          {/* Line background */}
          <div className="absolute top-[52px] left-0 right-0 h-[2px] bg-nexbe-border" />
          {/* Line progress */}
          <motion.div
            className="absolute top-[52px] left-0 h-[2px]"
            style={{
              width: lineWidth,
              background: 'linear-gradient(90deg, #B5005D, #FF004E)',
            }}
          />

          <motion.div
            className="grid grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {processSteps.map((step) => (
              <motion.div key={step.number} variants={fadeUp} className="text-center">
                {/* Circle */}
                <div className="w-[104px] h-[104px] mx-auto rounded-full border-2 border-nexbe-border bg-nexbe-bg flex items-center justify-center relative z-10">
                  <span className="font-display font-extrabold text-3xl gradient-text">
                    {step.number}
                  </span>
                </div>
                {/* Content */}
                <h3 className="font-display font-semibold text-lg mt-6">{step.title}</h3>
                <p className="text-nexbe-flame font-semibold text-sm mt-1">{step.time}</p>
                <p className="text-nexbe-text-muted text-sm mt-1">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex items-start gap-5"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-nexbe-border bg-nexbe-bg flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-extrabold text-xl gradient-text">{step.number}</span>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="w-[2px] h-12 bg-nexbe-border mt-2" />
                )}
              </div>
              <div className="pt-3">
                <h3 className="font-display font-semibold text-base">{step.title}</h3>
                <p className="text-nexbe-flame font-semibold text-sm">{step.time}</p>
                <p className="text-nexbe-text-muted text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
