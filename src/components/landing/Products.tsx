'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { featuredProducts } from '@/lib/data';
import { fadeUp, staggerContainer } from '@/lib/animations';

function ProductCard({ product, index }: { product: typeof featuredProducts[0]; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      className="min-w-[340px] max-w-[380px] flex-shrink-0 gradient-border rounded-2xl bg-nexbe-surface/40 p-7 flex flex-col group hover:bg-nexbe-surface/60 transition-colors duration-500"
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-nexbe-text-muted font-medium">{product.brand}</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[2px] bg-nexbe-raspberry/10 text-nexbe-flame border border-nexbe-raspberry/20">
          <Sparkles className="w-3 h-3" />
          {product.badge}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-44 mb-5 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={160}
          className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-xl">{product.name}</h3>
      <p className="text-sm text-nexbe-text-muted mt-1">
        {product.capacity} &middot; {product.chemistry}
      </p>

      {/* Divider */}
      <div className="h-px bg-nexbe-border my-5" />

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {product.features.map((feature) => (
          <li key={feature} className="text-sm text-nexbe-text-muted flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-nexbe-raspberry mt-2 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Price + CTA */}
      <div className="mt-6 pt-5 border-t border-nexbe-border flex items-center justify-between">
        <div>
          <p className="text-xs text-nexbe-text-muted">od</p>
          <p className="font-display font-bold text-xl">
            {product.priceFrom.toLocaleString('pl-PL')} zł
          </p>
        </div>
        <Link
          href="/konfigurator"
          className="btn-primary !py-2.5 !px-4 !text-[13px]"
        >
          Skonfiguruj
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="oferta" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(53, 0, 102, 0.3), transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label mb-6 inline-block">OFERTA</span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-[-0.02em] mt-4">
            Sprawdzone technologie od lidera rynku
          </h2>
          <p className="text-nexbe-text-muted mt-4 max-w-lg mx-auto">
            Wszystkie produkty z portfolio Keno Energy. Pełna gwarancja, wsparcie serwisowe.
          </p>
        </motion.div>

        {/* Horizontal scroll on desktop, vertical on mobile */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 lg:justify-center snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {featuredProducts.map((product, i) => (
            <div key={product.id} className="snap-center">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </motion.div>

        {/* More products link */}
        <motion.p
          className="text-center mt-10 text-sm text-nexbe-text-muted"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Oferujemy też: GoodWe Lynx Home, FoxESS ECS, KSTAR BluE-S i inne.{' '}
          <Link href="/konfigurator" className="text-nexbe-flame hover:underline font-medium">
            Zobacz pełną ofertę →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
