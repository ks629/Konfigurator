import type { KnowledgeEntry } from '../engine/types';

export const SHARED_KNOWLEDGE: KnowledgeEntry[] = [
  // === POWITANIE ===
  {
    keywords: ['hej', 'cześć', 'czesc', 'elo', 'siema', 'witam', 'dzień dobry', 'hello', 'hi', 'dobry', 'heej', 'hejka'],
    question: 'Powitanie',
    answer: 'Cześć! Jestem NEXBI — Twój asystent NEXBE. Jak mogę Ci pomóc?',
    emotion: 'waving',
    followUp: 'Zapytaj mnie o cokolwiek — postaram się pomóc.',
  },
  {
    keywords: ['kim jesteś', 'co umiesz', 'czat', 'bot', 'robot', 'ai', 'asystent', 'nexbi'],
    question: 'Kim jesteś?',
    answer: 'Jestem NEXBI — wirtualny asystent NEXBE. Znam się na magazynach energii, dotacjach, technologii LiFePO4 i ekosystemie OZE.',
    emotion: 'happy',
    followUp: 'Zapytaj o dotacje, produkty, oszczędności lub montaż.',
  },
  {
    keywords: ['pomóż', 'pomoc', 'help', 'nie rozumiem', 'wytłumacz', 'wyjaśnij'],
    question: 'Potrzebuję pomocy',
    answer: 'Jasne, chętnie pomogę! Mogę wyjaśnić dotacje, produkty, montaż, pojemności i wiele więcej.',
    emotion: 'waving',
    followUp: 'Napisz o czym chcesz się dowiedzieć.',
  },
  {
    keywords: ['dziękuję', 'dziekuje', 'dzięki', 'dzieki', 'thx', 'thanks'],
    question: 'Podziękowanie',
    answer: 'Nie ma za co! Cieszę się że mogłem pomóc.',
    emotion: 'happy',
    followUp: 'Jeśli będziesz mieć więcej pytań — wróć kiedy chcesz.',
  },
  {
    keywords: ['do widzenia', 'pa', 'nara', 'bye', 'na razie', 'koniec'],
    question: 'Pożegnanie',
    answer: 'Do zobaczenia! Gdyby pojawiły się pytania — wróć tutaj kiedy chcesz.',
    emotion: 'waving',
    followUp: 'Powodzenia!',
  },

  // === NEXBE / FIRMA ===
  {
    keywords: ['nexbe', 'firma', 'kto to', 'dlaczego', 'keno', 'doświadcz', 'zaufan', 'dlaczego wy', 'czemu nexbe'],
    question: 'Dlaczego NEXBE?',
    answer: 'NEXBE to część Grupy KENO — #1 OZE w Polsce, 14 lat doświadczenia, 38 000+ projektów. Zero pośredników = najlepsze ceny. Oficjalny dystrybutor Huawei. 5 marek magazynów. Realizacja 7-14 dni.',
    emotion: 'happy',
    followUp: 'Przekonaj się sam — sprawdź naszą ofertę.',
    showLeadPrompt: true,
  },
  {
    keywords: ['gwarancja', 'serwis', 'awaria', 'wsparcie', 'pomoc techniczn', 'reklamacj'],
    question: 'Gwarancja i serwis',
    answer: 'Każdy magazyn ma gwarancję producenta 10-15 lat. Serwis na miejscu, monitoring 24/7, reakcja w 24-48h. Obsługujemy gwarancje bezpośrednio z producentem.',
    emotion: 'teaching',
    followUp: 'Pełna gwarancja i serwis w cenie instalacji.',
  },
  {
    keywords: ['kontakt', 'telefon', 'zadzwon', 'numer', 'mail', 'email', 'napisz', 'połącz'],
    question: 'Kontakt',
    answer: 'Zadzwoń: 732 080 101 (pon-pt, 8:00-16:00)\nNapisz: magazyny@nexbe.pl\nKonfigurator: konfigurator.nexbe.pl',
    emotion: 'waving',
    followUp: 'Albo zostaw numer — oddzwonimy w ciągu 24h.',
    scrollTarget: '#kontakt',
    showLeadPrompt: true,
  },
  {
    keywords: ['wizyta', 'spotkanie', 'adres', 'siedziba', 'biuro', 'jawczyce', 'sadowa'],
    question: 'Siedziba',
    answer: 'Sadowa 19D, 05-850 Jawczyce (k/Warszawy). Pon-pt, 8:00-16:00. Zapraszamy!',
    emotion: 'happy',
    followUp: 'Chcesz nas odwiedzić? Zostaw numer — umówimy wizytę.',
    showLeadPrompt: true,
  },

  // === TECHNOLOGIA ===
  {
    keywords: ['lifepo', 'bateria', 'ogniw', 'technologia', 'litow', 'lfp', 'nmc'],
    question: 'Technologia LiFePO4',
    answer: 'Wszystkie nasze magazyny używają ogniw LiFePO4:\n\n- 6 000+ cykli (20+ lat)\n- Zerowe ryzyko zapłonu\n- Praca -20°C do +55°C\n- Po 10 latach: 80%+ pojemności',
    emotion: 'teaching',
    followUp: 'Chcesz więcej szczegółów technicznych?',
  },
  {
    keywords: ['bezpiecz', 'niebezpiecz', 'pożar', 'zapłon', 'eksploz', 'ryzyko'],
    question: 'Bezpieczeństwo',
    answer: 'Ogniwa LiFePO4 mają zerowe ryzyko zapłonu. Certyfikaty CE, IEC 62619. System BMS monitoruje każdą celę 24/7. Ochrona przed przeładowaniem, przegrzaniem i zwarciem.',
    emotion: 'teaching',
    followUp: 'Bezpieczeństwo to priorytet.',
  },
];
