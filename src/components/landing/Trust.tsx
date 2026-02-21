'use client';

import { motion } from 'framer-motion';
import { NexbeIcon } from '@nexbe/icons';
import { Building2, Users, Warehouse, MapPin } from 'lucide-react';
import { teamMembers, kenoStats } from '@/lib/data';
import { fadeUp, slideFromLeft, slideFromRight, staggerContainer } from '@/lib/animations';

export default function Trust() {
  return (
    <section id="o-nas" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-nexbe-surface/20" />
      <div
        className="absolute top-0 left-[20%] w-[600px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(181, 0, 93, 0.2), transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label mb-6 inline-block">DOŚWIADCZENIE</span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,3rem)] tracking-[-0.02em] mt-4">
            Start-up z DNA liderów rynku OZE
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Block A — Team */}
          <motion.div
            className="gradient-border rounded-2xl bg-nexbe-surface/40 p-8 lg:p-10"
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="font-display font-semibold text-lg mb-8 text-nexbe-text-muted">
              Ludzie, którzy zbudowali polski rynek OZE
            </h3>

            {teamMembers.map((member) => (
              <div key={member.name}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-nexbe-raspberry/15 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-nexbe-raspberry" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg">{member.name}</p>
                    <p className="text-sm text-nexbe-text-muted">{member.role}</p>
                  </div>
                </div>
                <motion.ul
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {member.highlights.map((highlight) => (
                    <motion.li
                      key={highlight}
                      variants={fadeUp}
                      className="flex items-start gap-3 text-sm text-nexbe-text-muted leading-relaxed"
                    >
                      <NexbeIcon name="certyfikat" size={16} variant="inherit" className="text-nexbe-raspberry flex-shrink-0 mt-0.5" />
                      {highlight}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            ))}
          </motion.div>

          {/* Block B — Keno Energy */}
          <motion.div
            className="gradient-border rounded-2xl bg-nexbe-surface/40 p-8 lg:p-10"
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="section-label !text-[9px]">PARTNER TECHNOLOGICZNY</span>
            </div>

            <h3 className="font-display font-bold text-2xl mb-3">KENO ENERGY</h3>
            <p className="text-nexbe-flame font-semibold text-sm mb-8">#1 dystrybutor OZE w Polsce</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {kenoStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-nexbe-border bg-nexbe-bg/50 p-5 text-center"
                >
                  <p className="font-display font-extrabold text-2xl gradient-text">{stat.value}</p>
                  <p className="text-xs text-nexbe-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-nexbe-text-muted leading-relaxed">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-nexbe-raspberry flex-shrink-0 mt-0.5" />
                <p>Największy polski dystrybutor OZE. Producent konstrukcji, rozdzielnic, systemów EMS.</p>
              </div>
              <div className="flex items-start gap-3">
                <Warehouse className="w-4 h-4 text-nexbe-raspberry flex-shrink-0 mt-0.5" />
                <p>Centrum logistyczne 7 000 m² w Gliwicach — wysyłka w 48h.</p>
              </div>
              <div className="flex items-start gap-3">
                <NexbeIcon name="siec-energetyczna" size={16} variant="inherit" className="text-nexbe-raspberry flex-shrink-0 mt-0.5" />
                <p>Obecność w 6 krajach Europy. 500+ certyfikowanych instalatorów.</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-nexbe-raspberry flex-shrink-0 mt-0.5" />
                <p>Sieć serwisowa w całej Polsce. Wsparcie techniczne i logistyczne.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
