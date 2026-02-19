'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { faqItems } from '@/lib/data';
import { fadeUp, staggerContainer } from '@/lib/animations';

function FaqItem({ item, isOpen, toggle }: { item: typeof faqItems[0]; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-nexbe-border">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-display font-semibold text-[15px] pr-6 text-nexbe-text group-hover:text-nexbe-flame transition-colors">
          {item.question}
        </span>
        <motion.span
          className="flex-shrink-0 w-8 h-8 rounded-full border border-nexbe-border flex items-center justify-center"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-4 h-4 text-nexbe-text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-nexbe-text-muted leading-relaxed max-w-[600px]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
          {/* Left */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-label mb-6 inline-block">FAQ</span>
            <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.5rem)] tracking-[-0.02em] mt-4">
              Najczęstsze pytania
            </h2>
            <p className="text-nexbe-text-muted mt-4 max-w-sm leading-relaxed">
              Nie znalazłeś odpowiedzi? Porozmawiaj z nami — chętnie pomożemy.
            </p>
            <a href="#kontakt" className="btn-primary mt-8 inline-flex">
              Zadaj pytanie
            </a>
          </motion.div>

          {/* Right — Accordion */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqItems.map((item, i) => (
              <motion.div key={item.question} variants={fadeUp}>
                <FaqItem
                  item={item}
                  isOpen={openIndex === i}
                  toggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
