'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { OrderProgressBar } from '@/components/configurator/OrderProgressBar';
import { useOrder } from '@/hooks/useOrder';
import { formatCurrency } from '@/lib/calculations';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { Banknote, ArrowLeft, CheckCircle2, Check, Shield, Lock, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function RatyPage() {
  const router = useRouter();
  const { order } = useOrder();

  useEffect(() => {
    if (!order) {
      router.replace('/konfigurator');
    }
  }, [order, router]);

  if (!order) {
    return (
      <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Przekierowywanie...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      <main className="flex-1 relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <Link
            href="/zamowienie/dane"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do formularza
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 mb-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Zamówienie złożone
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-white">
              WNIOSEK O RATY PRZYJĘTY
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Wysłaliśmy potwierdzenie na {order.klient?.email}
            </p>
          </motion.div>

          {/* Order Progress Bar */}
          <OrderProgressBar currentStep={3} paymentLabel="Potwierdzenie" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-lg mx-auto"
          >
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-8 space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="font-heading text-xl text-white">
                  Dziękujemy, {order.klient?.imie || 'Kliencie'}!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Zamówienie nr <strong className="text-white font-mono">{order.numer}</strong> zostało zarejestrowane.
                  Nasz doradca skontaktuje się z Tobą w ciągu 24h.
                </p>
              </div>

              {/* Installment breakdown */}
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="h-4 w-4 text-[#B5005D]" />
                  <span className="text-sm font-medium text-white">Finansowanie ratalne</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kwota do sfinansowania</span>
                  <span className="text-white font-bold">{formatCurrency(order.finanse.po_dotacjach)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Szacunkowa rata (120 mies.)</span>
                  <span className="text-white">od {formatCurrency(Math.round(order.finanse.po_dotacjach / 120))}/mies.</span>
                </div>
              </div>

              {/* Status checks */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Dane klienta zapisane
                </div>
                <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Potwierdzenie wysłane na email
                </div>
                <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Zamówienie {order.numer} zarejestrowane
                </div>
              </div>

              {/* Next steps */}
              <div className="text-left bg-white/5 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Co dalej?</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-[#B5005D] mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Doradca zadzwoni w ciągu <strong className="text-white">24h</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-[#B5005D] mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Wniosek ratalny wyślemy na <strong className="text-white">{order.klient?.email}</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mt-6">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Szyfrowanie SSL
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Zgodne z RODO
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                38 000+ projektów
              </span>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
