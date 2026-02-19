'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HouseCrossSectionSVG } from '@/components/home/HouseCrossSectionSVG';
import ContactForm from '@/components/landing/ContactForm';
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Calculator,
  BadgePercent,
  BatteryCharging,
  Home as HomeIcon,
  Star,
  Clock,
  Award,
  Banknote,
  ShieldCheck,
  Battery,
  Gauge,
  ShieldAlert,
  CheckCircle2,
  Smartphone,
  Repeat2,
  Timer,
  ChevronRight,
  Trophy,
  Sparkles,
  Phone,
  TrendingDown,
  Crown,
  Cpu,
  Wifi,
  BarChart3,
  Sun,
  Plug,
  MonitorSmartphone,
  PackageCheck,
  Truck,
  MapPin,
  Users,
  Building2,
  Brain,
  Globe,
  Activity,
  Layers,
  Settings,
  Power,
  LineChart,
  Send,
} from 'lucide-react';

/* ============================================================
   STATIC DATA — Hi-Tech Energy Configurator
   ============================================================ */

/* ----- Product card data with Economy/Premium split ----- */
type ProductCardData = {
  brand: string;
  model: string;
  image: string;
  tier: 'economy' | 'premium';
  rating: number;
  reviewCount: number;
  popularityRank: number;
  popularLabel?: string;
  capacityRange: string;
  powerRange: string;
  hoursForHome: string;
  warranty: number;
  eps: boolean;
  cycles: string;
  dod: string;
  chemistry: string;
  certifications: string[];
  norms: string[];
  appName: string;
  description: string;
  type: 'AC' | 'DC';
};

const productCards: ProductCardData[] = [
  {
    brand: 'FoxESS',
    model: 'ECS',
    image: '/products/foxess-ecs.png',
    tier: 'economy',
    rating: 4.5,
    reviewCount: 127,
    popularityRank: 3,
    capacityRange: '10.24–23.04',
    powerRange: '5.2–11.6',
    hoursForHome: '9–19',
    warranty: 10,
    eps: true,
    cycles: '6 000+',
    dod: '90%',
    chemistry: 'LFP (LiFePO4)',
    certifications: ['CE', 'TUV Rheinland', 'IEC 62619', 'UN 38.3'],
    norms: ['PN-EN 62619', 'IEC 61000-6-1', 'IEC 62040-1'],
    appName: 'FoxESS App',
    description: 'Kompaktowy magazyn all-in-one z wbudowanym falownikiem.',
    type: 'AC',
  },
  {
    brand: 'GoodWe',
    model: 'Lynx Home U',
    image: '/products/goodwe-lynx.png',
    tier: 'economy',
    rating: 4.4,
    reviewCount: 89,
    popularityRank: 4,
    capacityRange: '10–20',
    powerRange: '6–12',
    hoursForHome: '8–17',
    warranty: 10,
    eps: true,
    cycles: '6 000+',
    dod: '90%',
    chemistry: 'LFP (LiFePO4)',
    certifications: ['CE', 'TUV SUD', 'IEC 62619', 'UN 38.3'],
    norms: ['PN-EN 62619', 'IEC 62040-1', 'EN 50549-1'],
    appName: 'SEMS Portal',
    description: 'Modularny magazyn energii z inteligentnym zarz\u0105dzaniem.',
    type: 'AC',
  },
  {
    brand: 'GoodWe/Dyness',
    model: 'Tower T10',
    image: '/products/dyness-tower.png',
    tier: 'economy',
    rating: 4.6,
    reviewCount: 156,
    popularityRank: 2,
    popularLabel: 'Bestseller',
    capacityRange: '10.66–21.31',
    powerRange: '6.39–12.78',
    hoursForHome: '9–18',
    warranty: 10,
    eps: true,
    cycles: '6 000+',
    dod: '95%',
    chemistry: 'LFP (LiFePO4)',
    certifications: ['CE', 'TUV Rheinland', 'IEC 62619', 'UN 38.3', 'UL 1973'],
    norms: ['PN-EN 62619', 'IEC 62040-1', 'EN 50549-1'],
    appName: 'SEMS Portal',
    description: 'Wie\u017cowy magazyn Dyness z falownikiem GoodWe.',
    type: 'AC',
  },
  {
    brand: 'Huawei',
    model: 'LUNA2000',
    image: '/products/huawei-luna.png',
    tier: 'premium',
    rating: 4.8,
    reviewCount: 312,
    popularityRank: 1,
    popularLabel: '#1 w Polsce',
    capacityRange: '10–20',
    powerRange: '5–10',
    hoursForHome: '8–17',
    warranty: 10,
    eps: true,
    cycles: '6 000+',
    dod: '100%',
    chemistry: 'LFP (LiFePO4)',
    certifications: ['CE', 'TUV Rheinland', 'IEC 62619', 'UN 38.3', 'UL 1973'],
    norms: ['PN-EN 62619', 'IEC 61000-6-1', 'IEC 62040-1', 'VDE-AR-E 2510-50'],
    appName: 'FusionSolar App',
    description: 'Flagowy magazyn od lidera technologii.',
    type: 'DC',
  },
  {
    brand: 'Sigenergy',
    model: 'SigenStor AI',
    image: '/products/sigenergy.png',
    tier: 'premium',
    rating: 4.9,
    reviewCount: 78,
    popularityRank: 5,
    popularLabel: 'Nowo\u015b\u0107 2025',
    capacityRange: '5–25',
    powerRange: '5–25',
    hoursForHome: '4–21',
    warranty: 10,
    eps: true,
    cycles: '8 000+',
    dod: '95%',
    chemistry: 'LFP (LiFePO4)',
    certifications: ['CE', 'TUV SUD', 'IEC 62619', 'UN 38.3'],
    norms: ['PN-EN 62619', 'IEC 61000-6-1', 'IEC 62040-1'],
    appName: 'SigenStor App',
    description: 'System all-in-one nowej generacji z AI.',
    type: 'DC',
  },
];

const economyProducts = productCards.filter(p => p.tier === 'economy');
const premiumProducts = productCards.filter(p => p.tier === 'premium');

/* ---- 5 Steps data ---- */
const configuratorSteps = [
  {
    num: '01',
    title: 'Typ instalacji',
    desc: 'Okre\u015bl czy masz ju\u017c fotowoltaik\u0119 (retrofit AC) czy planujesz now\u0105 instalacj\u0119 (DC hybrydowa).',
    icon: Plug,
    color: '#B5005D',
  },
  {
    num: '02',
    title: 'Dane fotowoltaiki',
    desc: 'Podaj moc instalacji PV, orientacj\u0119 paneli i roczn\u0105 produkcj\u0119 energii.',
    icon: Sun,
    color: '#FF004E',
  },
  {
    num: '03',
    title: 'Zu\u017cycie energii',
    desc: 'Wpisz miesi\u0119czne zu\u017cycie pr\u0105du, wybierz profil u\u017cytkownika i operatora energii.',
    icon: BarChart3,
    color: '#B5005D',
  },
  {
    num: '04',
    title: 'Potrzeby dodatkowe',
    desc: 'Zaznacz czy potrzebujesz backup EPS, \u0142adowark\u0119 EV, inteligentne zarz\u0105dzanie energi\u0105.',
    icon: Settings,
    color: '#FF004E',
  },
  {
    num: '05',
    title: 'Rekomendacja AI',
    desc: 'Otrzymujesz spersonalizowan\u0105 rekomendacj\u0119 z kalkulacj\u0105 oszcz\u0119dno\u015bci i opcj\u0105 dofinansowania.',
    icon: Brain,
    color: '#B5005D',
  },
];

/* ---- KENO EMS features ---- */
const kenoFeatures = [
  {
    icon: Activity,
    title: 'Monitoring 24/7',
    desc: 'Produkcja PV, zu\u017cycie domu i stan baterii w czasie rzeczywistym na dowolnym urz\u0105dzeniu.',
  },
  {
    icon: Brain,
    title: 'Inteligentne \u0142adowanie',
    desc: 'AI automatycznie decyduje kiedy \u0142adowa\u0107 i roz\u0142adowywa\u0107 magazyn dla maksymalnych oszcz\u0119dno\u015bci.',
  },
  {
    icon: LineChart,
    title: 'Arbitra\u017c cenowy',
    desc: 'System kupuje tani pr\u0105d w nocy i zu\u017cywa go w szczycie cenowym \u2014 optymalizacja net-billingu.',
  },
  {
    icon: Power,
    title: 'Backup awaryjny',
    desc: 'Automatyczne przej\u015bcie na zasilanie bateryjne podczas awarii sieci \u2014 prze\u0142\u0105czenie w <20ms.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Aplikacja mobilna',
    desc: 'Pe\u0142na kontrola z telefonu: sterowanie priorytetami, harmonogramy \u0142adowania EV, powiadomienia push.',
  },
  {
    icon: Layers,
    title: 'Integracja EV',
    desc: 'Zarz\u0105dzanie \u0142adowark\u0105 samochodu elektrycznego \u2014 \u0142adowanie z nadwy\u017cek PV lub w taniej taryfie.',
  },
];

/* ---- Why Nexbe USPs ---- */
/* Educational content — replaces "Dlaczego Nexbe" */
const educationalSections = [
  {
    icon: BatteryCharging,
    title: 'Dlaczego warto mieć magazyn energii?',
    items: [
      'Wykorzystujesz 80-90% produkowanej energii zamiast 25-30% bez magazynu',
      'Oszczędzasz 2000-4000 zł rocznie na rachunkach za prąd',
      'Uniezależniasz się od rosnących cen energii (wzrost ~5% rocznie)',
      'Zyskujesz zasilanie awaryjne — Twój dom działa nawet podczas blackoutu',
      'Zwiększasz wartość nieruchomości o 3-5%',
    ],
  },
  {
    icon: Repeat2,
    title: 'Systemy rozliczeń — co musisz wiedzieć?',
    items: [
      'Net-billing (od 04.2022) — sprzedajesz nadwyżki po cenie RCE (~0.28 zł/kWh), kupujesz po ~1.12 zł/kWh. Magazyn pozwala zużyć energię samemu zamiast sprzedawać ze stratą.',
      'Net-metering (do 03.2022) — rozliczenie ilościowe 1:0.8. Tracisz 20% energii oddanej do sieci. Magazyn minimalizuje straty.',
      'Z magazynem w net-billingu oszczędzasz nawet 3x więcej niż bez niego — bo unikasz sprzedaży po niskiej cenie RCE.',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'Co to jest zasilanie awaryjne (EPS)?',
    items: [
      'EPS (Emergency Power Supply) to automatyczne przełączenie na zasilanie bateryjne w momencie awarii sieci',
      'Twój dom działa normalnie — lodówka, ogrzewanie, Internet, oświetlenie — nawet gdy cała okolica jest bez prądu',
      'Magazyn 10 kWh zapewnia 12-18h zasilania typowego gospodarstwa domowego',
      'Przełączenie trwa 10-20 ms — niewidoczne dla urządzeń elektronicznych',
      'W Polsce w 2025 było ponad 1500 przerw w dostawie prądu — zabezpiecz swój dom',
    ],
  },
];

/* ---- Product card component — dark theme ---- */
function ProductCard({ product, index }: { product: ProductCardData; index: number }) {
  const isPremium = product.tier === 'premium';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
        isPremium ? 'bg-gradient-to-br from-amber-400/30 to-orange-400/20' : 'bg-gradient-to-br from-[#B5005D]/20 to-[#FF004E]/10'
      }`} />

      <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        isPremium
          ? 'bg-gradient-to-b from-[#1f0e3a] to-[#0d0520] border-2 border-amber-500/40 ring-1 ring-amber-400/20'
          : 'bg-gradient-to-b from-[#150830] to-[#0f0520] border border-white/10 hover:border-[#B5005D]/40'
      }`}>
        {/* Popular label — ribbon style */}
        {product.popularLabel && (
          <div className={`absolute top-3 -left-1 z-20 px-4 py-1 text-xs font-bold text-white shadow-md ${
            product.popularLabel === '#1 w Polsce'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500'
              : product.popularLabel === 'Bestseller'
                ? 'bg-gradient-to-r from-[#B5005D] to-[#8B0048]'
                : 'bg-gradient-to-r from-[#FF004E] to-[#CC003E]'
          }`} style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}>
            {product.popularLabel === '#1 w Polsce' && <Trophy className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {product.popularLabel === 'Bestseller' && <Star className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {product.popularLabel === 'Nowo\u015b\u0107 2025' && <Sparkles className="h-3 w-3 inline mr-1 -mt-0.5" />}
            {product.popularLabel}
          </div>
        )}

        {/* Image area */}
        <div className={`relative h-52 flex items-center justify-center p-6 overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-br from-amber-900/20 via-[#0d0520] to-amber-900/10'
            : 'bg-gradient-to-br from-[#0f0520] via-[#150830] to-[#B5005D]/5'
        }`}>
          {/* Decorative glow */}
          <div className={`absolute top-4 right-4 w-32 h-32 rounded-full blur-3xl ${isPremium ? 'bg-amber-500/15' : 'bg-[#B5005D]/10'}`} />
          <div className={`absolute bottom-0 left-4 w-24 h-24 rounded-full blur-2xl ${isPremium ? 'bg-orange-500/10' : 'bg-[#FF004E]/8'}`} />

          <Image
            src={product.image}
            alt={`${product.brand} ${product.model}`}
            width={200}
            height={180}
            className="object-contain h-full w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(0,212,255,0.15)] relative z-10"
          />

          {/* Type badge */}
          <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm z-10 ${
            product.type === 'DC' ? 'bg-[#B5005D]/20 text-[#B5005D] border border-[#B5005D]/30' : 'bg-[#FF004E]/20 text-[#FF004E] border border-[#FF004E]/30'
          }`}>
            {product.type === 'DC' ? 'DC hybrydowy' : 'AC retrofit'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 space-y-3">
          {/* Brand + model + rating */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading text-lg text-white leading-tight">{product.brand}</h3>
              <p className="text-xs text-gray-400">{product.model}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-3 w-3 ${s <= Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">{product.rating} ({product.reviewCount})</p>
            </div>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5 bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Battery className={`h-3.5 w-3.5 ${isPremium ? 'text-amber-400' : 'text-[#B5005D]'}`} />
                <span className="text-[10px] text-gray-400">Pojemność</span>
              </div>
              <p className="font-heading text-sm text-white">{product.capacityRange} <span className="text-[10px] font-normal text-gray-400">kWh</span></p>
            </div>
            <div className="rounded-xl p-2.5 bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Gauge className={`h-3.5 w-3.5 ${isPremium ? 'text-amber-400' : 'text-[#B5005D]'}`} />
                <span className="text-[10px] text-gray-400">Moc ciągła</span>
              </div>
              <p className="font-heading text-sm text-white">{product.powerRange} <span className="text-[10px] font-normal text-gray-400">kW</span></p>
            </div>
            <div className="rounded-xl p-2.5 bg-[#FF004E]/5 border border-[#FF004E]/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Timer className="h-3.5 w-3.5 text-[#FF004E]" />
                <span className="text-[10px] text-gray-400">Zasilanie domu</span>
              </div>
              <p className="font-heading text-sm text-white">{product.hoursForHome} <span className="text-[10px] font-normal text-gray-400">godzin</span></p>
            </div>
            <div className="rounded-xl p-2.5 bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Repeat2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] text-gray-400">Żywotność</span>
              </div>
              <p className="font-heading text-sm text-white">{product.cycles} <span className="text-[10px] font-normal text-gray-400">cykli</span></p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-1.5">
            {product.eps && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-[#FF004E]/10 text-[#FF004E] px-2 py-1 rounded-lg font-medium border border-[#FF004E]/20">
                <ShieldAlert className="h-3 w-3" />Backup EPS
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] bg-[#B5005D]/10 text-[#B5005D] px-2 py-1 rounded-lg font-medium border border-[#B5005D]/20">
              <Award className="h-3 w-3" />{product.warranty} lat gwarancji
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded-lg font-medium border border-purple-500/20">
              <Smartphone className="h-3 w-3" />{product.appName}
            </span>
          </div>

          {/* Certifications */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[9px] text-gray-500 mb-1 font-semibold uppercase tracking-wider">Certyfikaty</p>
            <div className="flex flex-wrap gap-1">
              {product.certifications.map(c => (
                <span key={c} className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-md font-semibold border border-white/5">{c}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3">
            <Button asChild size="sm" className={`w-full h-10 font-heading text-sm tracking-wide transition-all duration-300 ${
              isPremium
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30'
                : 'bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white shadow-md shadow-[#B5005D]/20 hover:shadow-lg hover:shadow-[#B5005D]/30'
            }`}>
              <Link href="/konfigurator">
                Skonfiguruj
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default function Home() {
  return (
    <div className="nexbe-dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      {/* ==================== HERO — Hi-Tech Dark ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0520] via-[#1a0a35] to-[#0f0520] min-h-[750px] md:min-h-[900px]">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Animated glow orbs */}
        <div className="absolute top-20 left-[15%] w-[400px] h-[400px] bg-[#B5005D]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-[#FF004E]/8 rounded-full blur-[150px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#350066]/30 rounded-full blur-[200px]" />

        {/* Energy flow lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 750" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B5005D" stopOpacity="0" />
              <stop offset="50%" stopColor="#B5005D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#B5005D" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF004E" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF004E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF004E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Flowing energy paths */}
          <path d="M-100,200 Q300,100 500,300 T900,200 T1540,350" stroke="url(#lineGrad1)" strokeWidth="1.5" fill="none">
            <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M-100,200 Q300,100 500,300 T900,200 T1540,350;M-100,250 Q300,350 500,150 T900,300 T1540,200;M-100,200 Q300,100 500,300 T900,200 T1540,350" />
          </path>
          <path d="M-100,500 Q400,400 700,550 T1200,450 T1540,550" stroke="url(#lineGrad2)" strokeWidth="1" fill="none">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M-100,500 Q400,400 700,550 T1200,450 T1540,550;M-100,450 Q400,550 700,400 T1200,550 T1540,400;M-100,500 Q400,400 700,550 T1200,450 T1540,550" />
          </path>

          {/* Floating energy particles */}
          {[
            { cx: 200, cy: 150, r: 2, dur: '6s', delay: '0s' },
            { cx: 500, cy: 300, r: 3, dur: '8s', delay: '1s' },
            { cx: 800, cy: 200, r: 2, dur: '7s', delay: '2s' },
            { cx: 1100, cy: 400, r: 2.5, dur: '9s', delay: '0.5s' },
            { cx: 350, cy: 500, r: 2, dur: '7s', delay: '3s' },
            { cx: 900, cy: 550, r: 3, dur: '6s', delay: '1.5s' },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#FF004E" opacity="0">
              <animate attributeName="opacity" values="0;0.35;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${p.cy};${p.cy - 80};${p.cy}`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        {/* Hex grid pattern — subtle */}
        <div className="absolute top-10 right-10 w-[300px] h-[300px] opacity-[0.04] hidden lg:block" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15V37L30 52L0 37V15Z' fill='none' stroke='%23350066' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 52px',
        }} />

        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B5005D]/10 text-[#B5005D] text-sm font-medium mb-6 backdrop-blur-sm border border-[#B5005D]/20">
                <Cpu className="h-4 w-4" />
                Konfigurator AI magazynu energii
              </span>

              <h1 className="font-heading text-3xl md:text-5xl lg:text-[3.5rem] leading-tight text-white">
                Skonfiguruj swój{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">magazyn energii</span>
                <br />z pomocą AI w{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF004E] to-[#B5005D]">5 krokach</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
                Narzędzie, które <strong className="text-white">dobiera</strong>, <strong className="text-white">edukuje</strong>, <strong className="text-white">doradza</strong> i <strong className="text-white">kalkuluje oszczędności</strong>. Sprawdź dofinansowanie do 16 000 zł i ulgę podatkową.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button asChild size="lg" className="text-lg px-8 h-14 w-full sm:w-auto bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white transition-all shadow-lg shadow-[#B5005D]/25 hover:shadow-xl hover:shadow-[#B5005D]/30">
                <Link href="/konfigurator">
                  <Zap className="h-5 w-5 mr-2" />
                  Konfigurator Magazynu z AI
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" className="text-base px-6 h-14 w-full sm:w-auto bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 transition-all">
                <a href="#kontakt">
                  <Send className="h-5 w-5 mr-2" />
                  Zostaw kontakt — oddzwonimy
                </a>
              </Button>
            </motion.div>

            {/* Subsidy info */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center justify-center pt-3">
              <a href="#dotacje" className="inline-flex items-center gap-2 text-sm text-[#FF004E] hover:text-[#FF004E]/80 transition-colors animate-pulse hover:animate-none">
                <BadgePercent className="h-4 w-4" />
                Dofinansowanie do 16 000 zł — sprawdź Mój Prąd 7.0
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-8 pt-10 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B5005D] animate-pulse" />
                Inteligentny konfigurator AI
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF004E] animate-pulse" style={{ animationDelay: '0.5s' }} />
                5 marek do wyboru
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '1s' }} />
                Kalkulacja oszcz&#281;dno&#347;ci
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
                Dofinansowanie do 16 000 z&#322;
              </span>
            </motion.div>

            {/* House cross-section with energy flow */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <HouseCrossSectionSVG />
            </motion.div>
          </div>
        </div>

        {/* Wave separator */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z" fill="#0f0520" />
        </svg>
      </section>

      {/* ==================== 5 KROK&Oacute;W KONFIGURATORA ==================== */}
      <section className="py-20 md:py-28 bg-[#0f0520] relative overflow-hidden" id="jak-dziala">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B5005D]/10 text-[#B5005D] text-sm font-medium mb-5 border border-[#B5005D]/20">
              <Calculator className="h-4 w-4" />
              Jak to dzia&#322;a
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mb-4">
              Dobierz idealny magazyn w{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">5 krokach</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nasz konfigurator AI przeprowadzi Ci&#281; przez ca&#322;y proces — od analizy potrzeb po spersonalizowan&#261; rekomendacj&#281; z kalkulacj&#261; oszcz&#281;dno&#347;ci.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3">
              {configuratorSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  {/* Connector line (desktop) */}
                  {i < configuratorSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#B5005D]/20 to-transparent translate-x-1/2 z-0" />
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#B5005D]/30 transition-all hover:bg-white/[0.04]">
                    {/* Step number */}
                    <div className="text-[10px] font-bold text-gray-600 mb-2 tracking-wider">{step.num}</div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all group-hover:scale-110`} style={{
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                      border: `1px solid ${step.color}30`,
                    }}>
                      <step.icon className="h-7 w-7" style={{ color: step.color }} />
                    </div>

                    <h3 className="font-heading text-sm text-white mb-1.5">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white shadow-lg shadow-[#B5005D]/20">
                  <Link href="/konfigurator">
                    Rozpocznij konfigurację
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <a href="#kontakt" className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/40">
                  lub zostaw kontakt — oddzwonimy
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== RANKING PRODUKT&Oacute;W ==================== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0f0520] to-[#1a0a35] relative overflow-hidden" id="produkty">
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#B5005D]/10 to-[#FF004E]/10 text-[#B5005D] text-sm font-medium mb-5 border border-[#B5005D]/20">
              <Trophy className="h-4 w-4 text-amber-400" />
              Ranking Magazyn&oacute;w Energii 2025
            </div>
            <h2 className="font-heading text-2xl md:text-4xl text-white mb-3">
              Dobierz magazyn idealny dla{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">Twojego domu</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Por&oacute;wnaj 5 topowych rozwi&#261;za&#324;. Wszystkie z dotacj&#261; <strong className="text-white">M&oacute;j Pr&#261;d 6.0</strong>, certyfikatami UE i gwarancj&#261; 10 lat.
            </p>
          </motion.div>

          {/* ---- ECONOMY SECTION ---- */}
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#B5005D]/15 rounded-2xl blur-xl" />
                <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B5005D]/20 to-[#8B0048]/20 border border-[#B5005D]/30 text-white">
                  <TrendingDown className="h-5 w-5 text-[#B5005D]" />
                  <div>
                    <span className="font-heading text-base leading-none">Economy</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Najlepszy stosunek ceny do jako&#347;ci</p>
                  </div>
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#B5005D]/20 to-transparent rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {economyProducts.map((p, i) => (
                <ProductCard key={p.brand} product={p} index={i} />
              ))}
            </div>
          </div>

          {/* ---- ARROW DIVIDER ---- */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex items-center justify-center gap-4 my-14">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-amber-400/30" />
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/15 rounded-full blur-xl" />
              <div className="relative flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-white shadow-lg shadow-amber-500/10">
                <ChevronRight className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="font-heading text-sm tracking-wide">PREMIUM</span>
                <Crown className="h-5 w-5 text-amber-400" />
                <span className="font-heading text-sm tracking-wide">KLASA</span>
                <ChevronRight className="h-4 w-4 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-amber-400/30" />
          </motion.div>

          {/* ---- PREMIUM SECTION ---- */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/5 via-amber-500/3 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/15 rounded-2xl blur-xl" />
                  <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-white">
                    <Crown className="h-5 w-5 text-amber-400" />
                    <div>
                      <span className="font-heading text-base leading-none">Premium</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Najwy&#380;sza technologia, AI, pe&#322;na integracja</p>
                    </div>
                  </div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/20 to-transparent rounded-full" />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {premiumProducts.map((p, i) => (
                  <ProductCard key={p.brand} product={p} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
              {[
                { icon: Smartphone, title: 'Podgl\u0105d w aplikacji', desc: 'Monitoruj produkcj\u0119, zu\u017cycie i stan baterii 24/7', color: '#B5005D' },
                { icon: Shield, title: 'Bezpieczna technologia LFP', desc: 'LiFePO4 nie ulega samozap\u0142onowi \u2014 bezpieczna w domu', color: '#FF004E' },
                { icon: BadgePercent, title: 'Kwalifikacja do dotacji', desc: 'Wszystkie produkty spe\u0142niaj\u0105 wymagania M\u00f3j Pr\u0105d 6.0', color: 'rgb(251, 191, 36)' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                    <item.icon className="h-6 w-6" style={{ color: item.color }} />
                  </div>
                  <p className="text-sm font-heading text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500 mt-6">
              Kompletny zestaw: magazyn + falownik hybrydowy 10 kW + EMS + backup SZR + monta&#380; i uruchomienie.
              <strong className="text-gray-300"> Nie wiesz, co wybra&#263;? Nasz konfigurator dobierze najlepsze rozwi&#261;zanie.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== DOFINANSOWANIA ==================== */}
      <section className="py-20 md:py-28 bg-[#0f0520] relative overflow-hidden" id="dotacje">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF004E]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#B5005D]/5 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF004E]/10 text-[#FF004E] text-sm font-medium mb-5 border border-[#FF004E]/20">
              <BadgePercent className="h-4 w-4" />
              Dofinansowanie 2025/2026
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mb-4">
              Odzyskaj nawet{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF004E] to-[#B5005D]">50% koszt&oacute;w</span>{' '}
              inwestycji
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dwa programy, kt&oacute;re mo&#380;na &#322;&#261;czy&#263;. Pomagamy w kompletnej dokumentacji — od wniosku po rozliczenie.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Two subsidy cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* M&oacute;j Pr&#261;d 6.0 */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#B5005D]/5 to-transparent border border-[#B5005D]/20 hover:border-[#B5005D]/40 transition-all">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-[#B5005D] bg-[#B5005D]/10 px-3 py-1 rounded-full border border-[#B5005D]/20">
                  NFO&#346;IGW
                </div>
                <Banknote className="h-10 w-10 text-[#B5005D] mb-4" />
                <h3 className="font-heading text-xl text-white mb-1">M&oacute;j Pr&#261;d 6.0</h3>
                <p className="text-3xl font-heading text-[#B5005D] mb-4">do 16 000 z&#322;</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#B5005D] shrink-0 mt-0.5" />
                    Dotacja na magazyn energii dla prosument&oacute;w w net-billingu
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#B5005D] shrink-0 mt-0.5" />
                    {`Pokrywa do 30% koszt\u00f3w kwalifikowanych (maks. 800 z\u0142/kWh)`}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#B5005D] shrink-0 mt-0.5" />
                    Wymaga pojemno&#347;ci 10–20 kWh i przej&#347;cia na net-billing
                  </li>
                </ul>
              </motion.div>

              {/* Ulga termomodernizacyjna */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#FF004E]/5 to-transparent border border-[#FF004E]/20 hover:border-[#FF004E]/40 transition-all">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-[#FF004E] bg-[#FF004E]/10 px-3 py-1 rounded-full border border-[#FF004E]/20">
                  PIT
                </div>
                <HomeIcon className="h-10 w-10 text-[#FF004E] mb-4" />
                <h3 className="font-heading text-xl text-white mb-1">Ulga termomodernizacyjna</h3>
                <p className="text-3xl font-heading text-[#FF004E] mb-4">nawet 32% odliczenia</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FF004E] shrink-0 mt-0.5" />
                    Odlicz koszt magazynu od podatku PIT (pula do 53 000 z&#322;)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FF004E] shrink-0 mt-0.5" />
                    Oszcz&#281;dno&#347;&#263; 12% lub 32% w zale&#380;no&#347;ci od progu podatkowego
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FF004E] shrink-0 mt-0.5" />
                    Dotyczy w&#322;a&#347;cicieli dom&oacute;w jednorodzinnych — &#322;&#261;czy si&#281; z M&oacute;j Pr&#261;d
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Combined calculation example */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#B5005D]/5 via-white/[0.02] to-[#FF004E]/5 border border-white/10">
              <h3 className="font-heading text-lg text-white mb-6 text-center">
                {`Przyk\u0142adowa kalkulacja \u2014 magazyn 15 kWh za `}
                <span className="text-[#B5005D]">{`~34 000 z\u0142 brutto`}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{`Cena wyj\u015bciowa`}</p>
                  <p className="text-xl font-heading text-white">{`34 000 z\u0142`}</p>
                  <p className="text-[10px] text-gray-600">{`brutto z monta\u017cem`}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#B5005D]/5 border border-[#B5005D]/20">
                  <p className="text-xs text-[#B5005D] mb-1">{`M\u00f3j Pr\u0105d 6.0`}</p>
                  <p className="text-xl font-heading text-[#B5005D]">{`-10 200 z\u0142`}</p>
                  <p className="text-[10px] text-gray-500">{`30% \u00d7 34 000 z\u0142`}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FF004E]/5 border border-[#FF004E]/20">
                  <p className="text-xs text-[#FF004E] mb-1">{`Ulga 32%`}</p>
                  <p className="text-xl font-heading text-[#FF004E]">{`-7 616 z\u0142`}</p>
                  <p className="text-[10px] text-gray-500">{`32% \u00d7 23 800 z\u0142`}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30">
                  <p className="text-xs text-amber-400 mb-1">{`P\u0142acisz realnie`}</p>
                  <p className="text-2xl font-heading text-amber-400">{`~16 200 z\u0142`}</p>
                  <p className="text-[10px] text-gray-500">{`oszcz\u0119dno\u015b\u0107 52%`}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-600 text-center mt-4">
                {`* Kalkulacja: pr\u00f3g podatkowy 32%, dotacja = 30% ceny brutto (maks. 800 z\u0142/kWh, do 16 000 z\u0142). Ulga liczona od kwoty po dotacji. Rzeczywista oszcz\u0119dno\u015b\u0107 zale\u017cy od indywidualnej sytuacji.`}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-[#FF004E]/10 border-2 border-[#FF004E]/50 text-[#FF004E] hover:bg-[#FF004E]/20 shadow-lg shadow-[#FF004E]/10 animate-pulse hover:animate-none">
                  <Link href="/konfigurator">
                    <Calculator className="h-5 w-5 mr-2" />
                    Oblicz swoją dotację w konfiguratorze
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <a href="#kontakt" className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/40">
                  Wolisz porozmawiać? Zostaw numer
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== KENO EMS ==================== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0f0520] to-[#1a0a35] relative overflow-hidden">
        {/* Glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B5005D]/3 rounded-full blur-[250px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left — text */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B5005D]/10 text-[#B5005D] text-sm font-medium mb-5 border border-[#B5005D]/20">
                  <Cpu className="h-4 w-4" />
                  W ka&#380;dej instalacji NEXBE
                </span>
                <h2 className="font-heading text-2xl md:text-4xl text-white mb-4">
                  KENO EMS —{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">m&oacute;zg Twojego domu</span>{' '}
                  energetycznego
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Inteligentny system zarz&#261;dzania energi&#261; (EMS) optymalizuje przep&#322;ywy mi&#281;dzy panelami PV, magazynem, domem i sieci&#261; — automatycznie, 24/7.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {kenoFeatures.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#B5005D]/20 transition-all"
                    >
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-[#B5005D]/10 border border-[#B5005D]/20 flex items-center justify-center">
                        <f.icon className="h-4 w-4 text-[#B5005D]" />
                      </div>
                      <div>
                        <h4 className="font-heading text-xs text-white mb-0.5">{f.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right — dashboard mockup */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="absolute -inset-8 bg-[#B5005D]/5 rounded-3xl blur-3xl" />
                  <div className="relative rounded-2xl border-[6px] border-gray-700/60 bg-[#0a0418] p-1 shadow-2xl shadow-black/40">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-t-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400/80" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
                        <div className="w-2 h-2 rounded-full bg-green-400/80" />
                      </div>
                      <div className="flex-1 bg-gray-700/40 rounded-md px-3 py-0.5 text-[9px] text-gray-500 text-center">
                        ems.nexbe.pl/dashboard
                      </div>
                    </div>

                    {/* Dashboard content */}
                    <div className="bg-gradient-to-br from-[#0d0520] to-[#0a0418] p-4 rounded-b-lg space-y-3">
                      {/* Top stats */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Produkcja PV', val: '18.2', unit: 'kWh dzi\u015b', color: '#fbbf24' },
                          { label: 'Zu\u017cycie', val: '12.4', unit: 'kWh dzi\u015b', color: '#B5005D' },
                          { label: 'Bateria', val: '87%', unit: '13.05 kWh', color: '#FF004E' },
                          { label: 'Sie\u0107', val: '0.2', unit: 'kW import', color: '#9B59B6' },
                        ].map(s => (
                          <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                            <p className="text-[8px] text-gray-500 mb-0.5">{s.label}</p>
                            <p className="text-base font-heading" style={{ color: s.color }}>{s.val}</p>
                            <p className="text-[7px] text-gray-600">{s.unit}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chart + sidebar */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[8px] text-gray-500 font-semibold">Przep&#322;yw energii — dzi&#347;</p>
                            <div className="flex gap-2 text-[7px]">
                              <span className="text-amber-400">&#9679; PV</span>
                              <span className="text-[#B5005D]">&#9679; Dom</span>
                              <span className="text-[#FF004E]">&#9679; Bat.</span>
                            </div>
                          </div>
                          <div className="flex items-end gap-[2px] h-14">
                            {[20,35,55,80,95,100,90,75,85,70,55,30,25,40,60,80,90,85,70,50,35,20,15,10].map((h, i) => (
                              <div key={i} className="flex-1 flex flex-col gap-[1px] justify-end h-full">
                                <div className="bg-amber-400/60 rounded-[1px]" style={{ height: `${h * 0.6}%` }} />
                                <div className="bg-[#B5005D]/40 rounded-[1px]" style={{ height: `${Math.max(10, h * 0.3)}%` }} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-1 text-[6px] text-gray-600">
                            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-[#FF004E]/5 rounded-xl p-2 border border-[#FF004E]/10">
                            <p className="text-[8px] text-gray-500">Oszcz&#281;dno&#347;ci</p>
                            <p className="text-base font-heading text-[#FF004E]">+342 z&#322;</p>
                            <p className="text-[7px] text-gray-600">ten miesi&#261;c</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                            <p className="text-[8px] text-gray-500">Autokonsumpcja</p>
                            <p className="text-base font-heading text-[#B5005D]">89%</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                            <p className="text-[8px] text-gray-500">Status</p>
                            <p className="text-[9px] font-bold text-[#FF004E] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF004E] animate-pulse" />
                              Online
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WIEDZA O MAGAZYNACH ENERGII ==================== */}
      <section className="py-20 md:py-28 bg-[#0f0520] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B5005D]/4 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-[#350066]/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-sm font-medium mb-5 border border-white/10">
              <Brain className="h-4 w-4 text-[#B5005D]" />
              Baza wiedzy
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mb-4">
              Wszystko, co musisz wiedzieć o{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">magazynach energii</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Poznaj kluczowe zagadnienia, które pomogą Ci podjąć najlepszą decyzję o inwestycji w magazyn energii.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {educationalSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#B5005D]/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#B5005D]/10 border border-[#B5005D]/20 flex items-center justify-center mb-5">
                  <section.icon className="h-6 w-6 text-[#B5005D]" />
                </div>
                <h3 className="font-heading text-lg text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-[#B5005D] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FORMULARZ KONTAKTOWY ==================== */}
      <ContactForm />

      {/* ==================== SOCIAL PROOF NUMBERS ==================== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#1a0a35] via-[#0f0520] to-[#1a0a35] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { val: '200+', label: 'Instalacji magazyn\u00f3w', color: '#B5005D' },
              { val: '98%', label: 'Zadowolonych klient\u00f3w', color: '#FF004E' },
              { val: '10 lat', label: 'Gwarancji na produkty', color: '#fbbf24' },
              { val: '48h', label: 'Czas wysy\u0142ki sprz\u0119tu', color: '#9B59B6' },
            ].map(item => (
              <div key={item.val}>
                <div className="text-3xl md:text-4xl font-heading" style={{ color: item.color }}>{item.val}</div>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 md:py-28 bg-[#0f0520] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B5005D]/3 via-transparent to-[#FF004E]/3" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl md:text-4xl mb-4 text-white">
              Nie wiesz, od czego zacząć?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5005D] to-[#FF004E]">Pomożemy.</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Skonfiguruj magazyn z AI w 2 minuty lub po prostu zostaw kontakt — odezwiemy się w 24h z bezpłatną wyceną.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8 h-14 bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white shadow-lg shadow-[#B5005D]/25">
                <Link href="/konfigurator">
                  <Zap className="h-5 w-5 mr-2" />
                  Konfigurator AI
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 h-14 bg-white/5 border-2 border-[#FF004E]/40 text-white hover:bg-[#FF004E]/10 transition-all">
                <a href="#kontakt">
                  <Send className="h-5 w-5 mr-2" />
                  Zostaw kontakt
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 h-14 border-white/20 text-white hover:bg-white/5">
                <Link href="tel:+48732080101">
                  <Phone className="h-5 w-5 mr-2" />
                  Zadzwoń do nas
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
