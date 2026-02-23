'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landingContactSchema, type LandingContactData } from '@/lib/validations';
import { motion } from 'framer-motion';
import { NexbeIcon } from '@nexbe/icons';
import { Send, Check, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { contactBenefits } from '@/lib/data';
import { fadeUp, slideFromLeft, slideFromRight } from '@/lib/animations';

const capacityOptions = [
  { value: '', label: 'Wybierz pojemność' },
  { value: '10', label: '10 kWh' },
  { value: '12', label: '12 kWh' },
  { value: '15', label: '15 kWh' },
  { value: '20', label: '20 kWh' },
  { value: 'nie-wiem', label: 'Nie wiem jeszcze' },
];

const pvOptions = [
  { value: '', label: 'Masz fotowoltaikę?' },
  { value: 'tak', label: 'Tak, mam PV' },
  { value: 'planuje', label: 'Planuję instalację' },
  { value: 'nie', label: 'Nie' },
];

const benefitIcons: ((cls: string) => React.ReactNode)[] = [
  (cls) => <Clock className={cls} />,
  (cls) => <NexbeIcon name="smart-ems" size={14} variant="inherit" className={cls} />,
  (cls) => <NexbeIcon name="blackout-ochrona" size={14} variant="inherit" className={cls} />,
  (cls) => <Users className={cls} />,
  (cls) => <ArrowRight className={cls} />,
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit: hookFormSubmit, formState: { errors } } = useForm<LandingContactData>({
    resolver: zodResolver(landingContactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      capacity: '',
      hasPV: '',
    },
  });

  const onSubmit = async (data: LandingContactData) => {
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: 'landing-contact-form',
          formData: {
            capacity: data.capacity,
            hasPV: data.hasPV,
          },
          config: {
            installationType: data.hasPV === 'tak' ? 'retrofit' : data.hasPV === 'planuje' ? 'nowa' : 'nieznany',
          },
          product: {
            name: data.capacity ? `Zapytanie ${data.capacity} kWh` : 'Zapytanie ogólne',
          },
          calculation: {},
        }),
      });

      if (!res.ok) throw new Error('Błąd zapisu');

      setSubmitted(true);
    } catch {
      setError('Nie udało się wysłać. Zadzwoń: 732 080 101');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(181, 0, 93, 0.06), transparent 70%)',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6">
        <div className="gradient-border rounded-3xl bg-nexbe-surface/30 p-8 lg:p-14"
          style={{ boxShadow: '0 0 100px rgba(181, 0, 93, 0.06)' }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Benefits */}
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="section-label mb-6 inline-block">BEZPŁATNA WYCENA</span>
              <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.5rem)] tracking-[-0.02em] mt-4">
                Sprawdź, ile zaoszczędzisz
              </h2>
              <p className="text-nexbe-text-muted mt-4 max-w-sm leading-relaxed">
                Zostaw dane — odezwiemy się w ciągu 24h z bezpłatną wyceną magazynu energii dopasowanego do Twojej sytuacji.
              </p>

              <ul className="mt-8 space-y-4">
                {contactBenefits.map((benefit, i) => {
                  const renderIcon = benefitIcons[i] || ((cls: string) => <Check className={cls} />);
                  return (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-nexbe-text-muted">
                      <span className="w-7 h-7 rounded-full bg-nexbe-raspberry/10 flex items-center justify-center flex-shrink-0">
                        {renderIcon('w-3.5 h-3.5 text-nexbe-raspberry')}
                      </span>
                      {benefit}
                    </li>
                  );
                })}
              </ul>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap gap-3">
                {['500+ instalatorów', '10-15 lat gwarancji', '100% online'].map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-nexbe-text-muted border border-nexbe-border bg-nexbe-bg/50">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {!submitted ? (
                <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="text-xs font-semibold text-nexbe-text-muted uppercase tracking-[2px] mb-2 block">
                      Imię i nazwisko *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-3.5 rounded-xl bg-nexbe-bg/80 border border-nexbe-border text-nexbe-text placeholder:text-nexbe-text-muted focus:outline-none focus:border-nexbe-raspberry/50 focus:ring-1 focus:ring-nexbe-raspberry/20 transition-colors text-sm"
                      placeholder="Jan Kowalski"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="text-xs font-semibold text-nexbe-text-muted uppercase tracking-[2px] mb-2 block">
                      Telefon *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3.5 rounded-xl bg-nexbe-bg/80 border border-nexbe-border text-nexbe-text placeholder:text-nexbe-text-muted focus:outline-none focus:border-nexbe-raspberry/50 focus:ring-1 focus:ring-nexbe-raspberry/20 transition-colors text-sm"
                      placeholder="+48 xxx xxx xxx"
                    />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="text-xs font-semibold text-nexbe-text-muted uppercase tracking-[2px] mb-2 block">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3.5 rounded-xl bg-nexbe-bg/80 border border-nexbe-border text-nexbe-text placeholder:text-nexbe-text-muted focus:outline-none focus:border-nexbe-raspberry/50 focus:ring-1 focus:ring-nexbe-raspberry/20 transition-colors text-sm"
                      placeholder="jan@email.pl"
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Selects row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="capacity" className="text-xs font-semibold text-nexbe-text-muted uppercase tracking-[2px] mb-2 block">
                        Pojemność
                      </label>
                      <select
                        id="capacity"
                        {...register('capacity')}
                        className="w-full px-4 py-3.5 rounded-xl bg-nexbe-bg/80 border border-nexbe-border text-nexbe-text focus:outline-none focus:border-nexbe-raspberry/50 focus:ring-1 focus:ring-nexbe-raspberry/20 transition-colors text-sm appearance-none"
                      >
                        {capacityOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="hasPV" className="text-xs font-semibold text-nexbe-text-muted uppercase tracking-[2px] mb-2 block">
                        Masz PV?
                      </label>
                      <select
                        id="hasPV"
                        {...register('hasPV')}
                        className="w-full px-4 py-3.5 rounded-xl bg-nexbe-bg/80 border border-nexbe-border text-nexbe-text focus:outline-none focus:border-nexbe-raspberry/50 focus:ring-1 focus:ring-nexbe-raspberry/20 transition-colors text-sm appearance-none"
                      >
                        {pvOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center mt-2 !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? 'Wysyłanie...' : 'Wyślij zapytanie'}
                  </button>

                  <p className="text-[11px] text-nexbe-text-muted/70 mt-3 leading-relaxed">
                    Wysyłając formularz wyrażasz zgodę na kontakt w celu przedstawienia oferty.
                    Twoje dane są bezpieczne — nie udostępniamy ich podmiotom trzecim.
                  </p>
                </form>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">Dziękujemy!</h3>
                  <p className="text-nexbe-text-muted max-w-sm">
                    Odezwiemy się w ciągu 24h z bezpłatną wyceną dopasowaną do Twojej sytuacji.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
