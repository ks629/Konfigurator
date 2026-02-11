'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Battery,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Calculator,
  FileText,
  CalendarCheck,
  CheckCircle,
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Oszczednosci do 70%',
    desc: 'Zwieksz autokonsumpcje energii i zmniejsz rachunki za prad',
  },
  {
    icon: Shield,
    title: 'Niezaleznosc energetyczna',
    desc: 'Uniezaleznij sie od rosnosych cen energii i awarii sieci',
  },
  {
    icon: Zap,
    title: 'Zasilanie awaryjne',
    desc: 'Chron swoj dom przed blackoutami i przerwami w dostawie pradu',
  },
  {
    icon: Battery,
    title: 'Dotacje do 16 000 zl',
    desc: 'Skorzystaj z programu Moj Prad i ulgi termomodernizacyjnej',
  },
];

const steps = [
  {
    num: '01',
    icon: Calculator,
    title: 'Skonfiguruj system',
    desc: 'Odpowiedz na kilka pytan o swojej instalacji PV i potrzebach energetycznych',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Otrzymaj oferte',
    desc: 'Dobierzemy optymalny magazyn i pokażemy kalkulacje oszczednosci',
  },
  {
    num: '03',
    icon: CalendarCheck,
    title: 'Umow audyt',
    desc: 'Bezplatny audyt techniczny i finalna wycena montazu',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-green-50">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Battery className="h-4 w-4" />
                Integrator 360° magazynow energii
              </span>

              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl leading-tight">
                Ile mozesz{' '}
                <span className="text-primary">zaoszczedzic</span>
                <br />z magazynem energii?
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                Skonfiguruj system w 2 minuty i sprawdz swoja indywidualna
                kalkulacje oszczednosci
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button asChild size="lg" className="text-lg px-8 h-14 w-full sm:w-auto">
                <Link href="/konfigurator">
                  Rozpocznij konfiguracje
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Bezplatnie, bez zobowiazan
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24" id="korzysci">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl text-center mb-12">
            Dlaczego magazyn energii?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <b.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-base mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-muted/30" id="jak-dziala">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl text-center mb-12">
            Jak to dziala?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-5xl font-heading text-primary/20 mb-2">
                  {s.num}
                </div>
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <s.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/konfigurator">
                Rozpocznij konfiguracje
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="font-heading text-2xl md:text-3xl">
              Dlaczego NEXBE?
            </h2>
            <div className="space-y-4 text-left">
              {[
                'Certyfikowany integrator magazynow energii',
                'Pelna obsluga: od doboru po montaz i serwis',
                'Pomoc w uzyskaniu dotacji Moj Prad',
                'Gwarancja producenta do 10 lat',
                'Bezplatny audyt techniczny',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/konfigurator">
                Sprawdz swoja kalkulacje
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
