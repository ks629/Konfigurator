'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sun, Battery, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { fadeUp, ease } from '@/lib/animations';

type Situation = 'have-pv' | 'plan-pv' | 'upgrade' | null;

const situations = [
  { id: 'have-pv' as const, icon: Sun, label: 'Mam fotowoltaikę', desc: 'Chcę dodać magazyn do istniejącej instalacji' },
  { id: 'plan-pv' as const, icon: Battery, label: 'Planuję fotowoltaikę', desc: 'Chcę system PV + magazyn od razu' },
  { id: 'upgrade' as const, icon: RefreshCw, label: 'Wymiana falownika', desc: 'Chcę wymienić falownik na hybrydowy' },
];

const consumptionOptions = [
  { value: 200, label: '200 kWh' },
  { value: 350, label: '350 kWh' },
  { value: 500, label: '500 kWh' },
  { value: 700, label: '700 kWh' },
  { value: 900, label: '800+ kWh' },
];

function estimateSavings(monthlyKwh: number): { savings: number; capacity: number } {
  const annual = monthlyKwh * 12;
  const savingsRate = 0.55;
  const energyPrice = 1.12;
  const savings = Math.round(annual * savingsRate * energyPrice * 0.45);
  const capacity = monthlyKwh <= 300 ? 10 : monthlyKwh <= 500 ? 12 : monthlyKwh <= 700 ? 15 : 20;
  return { savings, capacity };
}

export default function MiniConfigurator() {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState<Situation>(null);
  const [consumption, setConsumption] = useState<number | null>(null);

  const result = consumption ? estimateSavings(consumption) : null;

  const handleSituation = (s: Situation) => {
    setSituation(s);
    setStep(2);
  };

  const handleConsumption = (kwh: number) => {
    setConsumption(kwh);
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSituation(null);
    setConsumption(null);
  };

  return (
    <section id="mini-konfigurator" className="relative py-24 lg:py-32">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(181, 0, 93, 0.15), transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="relative max-w-[700px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label mb-6 inline-block">
            <Zap className="w-3 h-3 text-nexbe-flame" />
            SZYBKI KALKULATOR
          </span>
          <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.5rem)] tracking-[-0.02em] mt-4">
            Sprawdź w 30 sekund, ile zaoszczędzisz
          </h2>
        </motion.div>

        <motion.div
          className="gradient-border rounded-2xl bg-nexbe-surface/50 p-8 lg:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ boxShadow: '0 0 80px rgba(181, 0, 93, 0.08)' }}
        >
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-nexbe-border">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #B5005D, #FF004E)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: step >= s ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-nexbe-text-muted text-sm mb-6">Krok 1 z 3</p>
                <h3 className="font-display font-semibold text-xl mb-6">Jaka jest Twoja sytuacja?</h3>
                <div className="space-y-3">
                  {situations.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSituation(s.id)}
                      className="w-full text-left p-4 rounded-xl border border-nexbe-border bg-nexbe-bg/50 hover:border-nexbe-raspberry/40 hover:bg-nexbe-surface/60 transition-all duration-300 group flex items-center gap-4"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-nexbe-raspberry/10 flex items-center justify-center group-hover:bg-nexbe-raspberry/20 transition-colors">
                        <s.icon className="w-5 h-5 text-nexbe-raspberry" />
                      </span>
                      <div>
                        <p className="font-semibold text-nexbe-text text-sm">{s.label}</p>
                        <p className="text-xs text-nexbe-text-muted mt-0.5">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-nexbe-text-muted text-sm mb-6">Krok 2 z 3</p>
                <h3 className="font-display font-semibold text-xl mb-6">Ile energii zużywasz miesięcznie?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {consumptionOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleConsumption(opt.value)}
                      className="p-4 rounded-xl border border-nexbe-border bg-nexbe-bg/50 hover:border-nexbe-raspberry/40 hover:bg-nexbe-surface/60 transition-all duration-300 text-center"
                    >
                      <p className="font-display font-bold text-lg text-nexbe-text">{opt.label}</p>
                      <p className="text-xs text-nexbe-text-muted mt-1">/miesiąc</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm text-nexbe-text-muted hover:text-nexbe-text transition-colors"
                >
                  ← Wróć
                </button>
              </motion.div>
            )}

            {/* Step 3 — Result */}
            {step === 3 && result && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-nexbe-raspberry/10 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-nexbe-flame" />
                </div>

                <p className="text-nexbe-text-muted text-sm mb-2">Szacowane roczne oszczędności</p>
                <p className="font-display font-extrabold text-5xl gradient-text mb-2">
                  {result.savings.toLocaleString('pl-PL')} zł
                </p>
                <p className="text-nexbe-text-muted text-sm mb-6">
                  Rekomendowana pojemność: <span className="font-semibold text-nexbe-text">{result.capacity} kWh</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/konfigurator" className="btn-primary justify-center">
                    Zobacz szczegółową konfigurację
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button onClick={reset} className="btn-secondary justify-center text-sm">
                    Oblicz ponownie
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
