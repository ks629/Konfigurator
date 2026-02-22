'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { OrderProgressBar } from '@/components/configurator/OrderProgressBar';
import { useOrder } from '@/hooks/useOrder';
import { formatCurrency } from '@/lib/calculations';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { Banknote, ArrowLeft, Clock, Check, Shield, Lock } from 'lucide-react';
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm text-xs font-medium">
              <Banknote className="h-3.5 w-3.5" />
              Raty
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-white">
              WNIOSEK O RATY
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Złóż wniosek o finansowanie ratalne — decyzja w 24h
            </p>
          </motion.div>

          {/* Order Progress Bar */}
          <OrderProgressBar currentStep={3} paymentLabel="Wniosek o raty" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-lg mx-auto"
          >
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-8 space-y-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto"
              >
                <Clock className="h-8 w-8 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="font-heading text-xl text-white">Formularz ratalny</h2>
                <p className="text-sm text-muted-foreground">
                  Integracja z partnerem finansowym zostanie uruchomiona w Fazie 4.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kwota do sfinansowania</span>
                  <span className="text-white font-bold">{formatCurrency(order.finanse.po_dotacjach)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kwota brutto</span>
                  <span className="text-white">{formatCurrency(order.finanse.razem_brutto)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Dane klienta zapisane
                </div>
                <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Zamówienie {order.numer} zarejestrowane
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Skontaktujemy się z Tobą na <strong className="text-white">{order.klient?.email}</strong> z wnioskiem ratalnym.
              </p>
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
