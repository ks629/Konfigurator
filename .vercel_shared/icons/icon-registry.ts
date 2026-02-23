import type { NexbeIconName, NexbeLineIconName, NexbiMiniIconName, NexbeBrandIconName } from './types';

export interface IconMeta {
  name: NexbeIconName;
  label: string;
  category: string;
  type: 'line' | 'nexbi' | 'brand';
}

// ─── Line Icons Registry ───────────────────────────────────────────

export const LINE_ICONS: Record<NexbeLineIconName, { label: string; category: string }> = {
  // Produkty
  'magazyn-energii':    { label: 'Magazyn energii',    category: 'Produkty' },
  'fotowoltaika':       { label: 'Panel słoneczny',    category: 'Produkty' },
  'ladowarka-ev':       { label: 'Ładowarka EV',       category: 'Produkty' },
  'auto-elektryczne':   { label: 'Auto elektryczne',   category: 'Produkty' },
  'falownik':           { label: 'Falownik AC/DC',     category: 'Produkty' },
  'retrofit':           { label: 'Retrofit / upgrade',  category: 'Produkty' },
  'pompa-ciepla':       { label: 'Pompa ciepła',       category: 'Produkty' },
  'smart-ems':          { label: 'Smart EMS',          category: 'Produkty' },
  'instalacja-pv':      { label: 'Instalacja PV',      category: 'Produkty' },
  'system-hybrydowy':   { label: 'System hybrydowy',   category: 'Produkty' },
  // Finanse
  'dotacja':            { label: 'Dotacja',            category: 'Finanse' },
  'moj-prad':           { label: 'Mój Prąd',          category: 'Finanse' },
  'oszczednosci':       { label: 'Oszczędności',       category: 'Finanse' },
  'raty':               { label: 'Raty',               category: 'Finanse' },
  'roi':                { label: 'ROI',                category: 'Finanse' },
  'kalkulator':         { label: 'Kalkulator',         category: 'Finanse' },
  'ulga-termomodernizacyjna': { label: 'Ulga termomod.', category: 'Finanse' },
  'bezplatna-wycena':   { label: 'Bezpłatna wycena',   category: 'Finanse' },
  // Energia/Tech
  'energia-sloneczna':  { label: 'Energia słoneczna',  category: 'Energia' },
  'energia-nocna':      { label: 'Energia nocna',      category: 'Energia' },
  'siec-energetyczna':  { label: 'Sieć energetyczna',  category: 'Energia' },
  'blackout-ochrona':   { label: 'Ochrona blackout',   category: 'Energia' },
  'monitoring-247':     { label: 'Monitoring 24/7',     category: 'Energia' },
  'bateria-lfp':        { label: 'Bateria LFP',        category: 'Energia' },
  'zywotnosc':          { label: 'Żywotność',          category: 'Energia' },
  'pojemnosc-kwh':      { label: 'Pojemność kWh',      category: 'Energia' },
  'co2-redukcja':       { label: 'Redukcja CO₂',       category: 'Energia' },
  // Zaufanie
  'certyfikat':         { label: 'Certyfikat',         category: 'Zaufanie' },
  'gwiazdki-opinie':    { label: 'Opinie 5★',          category: 'Zaufanie' },
  'gwarancja':          { label: 'Gwarancja',          category: 'Zaufanie' },
  'instalatorzy':       { label: 'Instalatorzy',       category: 'Zaufanie' },
  'partner-keno':       { label: 'Partnerstwo',        category: 'Zaufanie' },
  'forbes-30u30':       { label: 'Forbes 30u30',       category: 'Zaufanie' },
  // Nowe v1.1
  'dom-energia':        { label: 'Dom z energią',      category: 'Energia' },
  'v2h':                { label: 'Vehicle-to-Home',    category: 'Energia' },
  'taryfa-dynamiczna':  { label: 'Taryfa dynamiczna',  category: 'Finanse' },
  'dokumenty':          { label: 'Dokumenty',          category: 'Ogólne' },
  'klient':             { label: 'Klient',             category: 'Ogólne' },
  'zespol':             { label: 'Zespół',             category: 'Ogólne' },
  'szkolenie':          { label: 'Szkolenie',          category: 'Ogólne' },
  'baza-wiedzy':        { label: 'Baza wiedzy',        category: 'Ogólne' },
};

// ─── NEXBi Mini Icons Registry ─────────────────────────────────────

export const NEXBI_ICONS: Record<NexbiMiniIconName, { label: string; category: string }> = {
  'nexbi-konfiguracja':  { label: 'Konfiguracja',  category: 'Proces' },
  'nexbi-doradca':       { label: 'Doradca',       category: 'Proces' },
  'nexbi-wycena':        { label: 'Wycena',        category: 'Proces' },
  'nexbi-umowa':         { label: 'Umowa',         category: 'Proces' },
  'nexbi-dostawa':       { label: 'Dostawa',       category: 'Proces' },
  'nexbi-montaz':        { label: 'Montaż',        category: 'Proces' },
  'nexbi-uruchomienie':  { label: 'Uruchomienie',  category: 'Proces' },
  'nexbi-serwis':        { label: 'Serwis',        category: 'Proces' },
  'nexbi-naukowiec':     { label: 'Naukowiec',     category: 'Edukacja' },
  'nexbi-ekolog':        { label: 'Ekolog',        category: 'Edukacja' },
  'nexbi-superhero':     { label: 'Superhero',     category: 'Edukacja' },
  'nexbi-pomysl':        { label: 'Pomysł',        category: 'Edukacja' },
  'nexbi-pytanie':       { label: 'Pytanie',       category: 'Edukacja' },
  'nexbi-ok':            { label: 'OK / Kciuk',    category: 'Edukacja' },
  'nexbi-powitanie':     { label: 'Powitanie',     category: 'Edukacja' },
  'nexbi-prezentacja':   { label: 'Prezentacja',   category: 'Edukacja' },
  'nexbi-telefon':       { label: 'Telefon',       category: 'Kontakt' },
  'nexbi-chat':          { label: 'Chat',          category: 'Kontakt' },
  'nexbi-formularz':     { label: 'Formularz',     category: 'Kontakt' },
};

// ─── Brand Illustrated Icons Registry ─────────────────────────────

export const BRAND_ICONS: Record<NexbeBrandIconName, { label: string; category: string }> = {
  // Produkty
  'brand-auto-elektryczne':      { label: 'Auto elektryczne',       category: 'Produkty' },
  'brand-magazyn-energii':       { label: 'Magazyn energii',        category: 'Produkty' },
  'brand-magazyn-energii-alt':   { label: 'Magazyn energii (alt)',  category: 'Produkty' },
  'brand-panel-fotowoltaiczny':  { label: 'Panel fotowoltaiczny',   category: 'Produkty' },
  'brand-stacja-ladowania':      { label: 'Stacja ładowania',       category: 'Produkty' },
  'brand-stacja-ladowania-alt':  { label: 'Stacja ładowania (alt)', category: 'Produkty' },
  'brand-dom-z-panelem':         { label: 'Dom z panelem',          category: 'Produkty' },
  'brand-slonce':                { label: 'Słońce / energia',       category: 'Produkty' },
  'brand-slonce-wtyczka':        { label: 'Słońce + wtyczka',       category: 'Produkty' },
  'brand-technologia':           { label: 'Technologia',            category: 'Produkty' },
  'brand-technologia-alt':       { label: 'Technologia (alt)',      category: 'Produkty' },
  // Proces
  'brand-konsultacje':           { label: 'Konsultacje',            category: 'Proces' },
  'brand-montaz':                { label: 'Montaż',                 category: 'Proces' },
  'brand-umowa':                 { label: 'Umowa',                  category: 'Proces' },
  'brand-projekt':               { label: 'Projekt',                category: 'Proces' },
  'brand-kalendarz':             { label: 'Kalendarz',              category: 'Proces' },
  'brand-zegar':                 { label: 'Zegar / termin',         category: 'Proces' },
  'brand-zegar-alt':             { label: 'Zegar (alt)',            category: 'Proces' },
  // Finanse
  'brand-finansowanie':          { label: 'Finansowanie',           category: 'Finanse' },
  'brand-finansowanie-alt':      { label: 'Finansowanie (alt)',     category: 'Finanse' },
  'brand-wykres':                { label: 'Wykres / ROI',           category: 'Finanse' },
  // Zaufanie
  'brand-certyfikat':            { label: 'Certyfikat',             category: 'Zaufanie' },
  'brand-rekomendacje':          { label: 'Rekomendacje',           category: 'Zaufanie' },
  'brand-rekomendacje-alt':      { label: 'Rekomendacje (alt)',     category: 'Zaufanie' },
  'brand-rekomendacje-check':    { label: 'Rekomendacje ✓',        category: 'Zaufanie' },
  'brand-wspolpraca':            { label: 'Współpraca',             category: 'Zaufanie' },
  // Zespół
  'brand-pracownik':             { label: 'Pracownik',              category: 'Zespół' },
  'brand-pracownik-alt':         { label: 'Pracownik (alt)',        category: 'Zespół' },
  'brand-inzynier':              { label: 'Inżynier',              category: 'Zespół' },
  'brand-inzynier-alt':          { label: 'Inżynier (alt)',        category: 'Zespół' },
  'brand-opieka':                { label: 'Opieka / serwis',       category: 'Zespół' },
  'brand-call-center':           { label: 'Call center',            category: 'Zespół' },
};

// ─── All icons combined ────────────────────────────────────────────

export const ALL_ICONS: IconMeta[] = [
  ...Object.entries(LINE_ICONS).map(([name, meta]) => ({
    name: name as NexbeIconName,
    type: 'line' as const,
    ...meta,
  })),
  ...Object.entries(NEXBI_ICONS).map(([name, meta]) => ({
    name: name as NexbeIconName,
    type: 'nexbi' as const,
    ...meta,
  })),
  ...Object.entries(BRAND_ICONS).map(([name, meta]) => ({
    name: name as NexbeIconName,
    type: 'brand' as const,
    ...meta,
  })),
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function isNexbiIcon(name: string): name is NexbiMiniIconName {
  return name.startsWith('nexbi-');
}

export function isBrandIcon(name: string): name is NexbeBrandIconName {
  return name.startsWith('brand-');
}
