import type { KnowledgeEntry } from '../engine/types';

export const KONFIGURATOR_KNOWLEDGE: KnowledgeEntry[] = [
  // === DOTACJE ===
  {
    keywords: ['dotacja', 'mój prąd', 'dofinansowanie', 'dopłata', 'subsydi', '16 000', '16000', 'moj prad', 'program'],
    question: 'Dotacja Mój Prąd 7.0',
    answer: 'Dotacja Mój Prąd 7.0 to do 16 000 zł na magazyn energii — nawet 50% kosztów kwalifikowanych.\n\nProgram NFOŚiGW, budżet 1 mld zł na lata 2026-2030. Wymogi: magazyn min. 10 kWh, island mode, EMS. Wszystkie nasze systemy to spełniają.',
    emotion: 'teaching',
    followUp: 'Sprawdź ile zaoszczędzisz po dotacji w konfiguratorze — policzy automatycznie.',
    showLeadPrompt: true,
    suggestConfigurator: true,
  },
  {
    keywords: ['kto może', 'warunki', 'wymagania', 'kwalifikuje', 'mogę', 'uprawnion', 'kryteria'],
    question: 'Warunki dotacji',
    answer: 'Musisz mieć:\n\n- Instalację PV 2-50 kWp\n- Przyłączoną do sieci w net-billingu\n- Magazyn min. 10 kWh z island mode i EMS\n- Montaż przez certyfikowaną firmę\n\nW NEXBE ogarniamy cały proces.',
    emotion: 'teaching',
    followUp: 'Masz PV? Zostaw numer — sprawdzimy za darmo czy kwalifikujesz się.',
    showLeadPrompt: true,
  },
  {
    keywords: ['ulga', 'termomoderniz', 'pit', 'odliczen', 'podatkow'],
    question: 'Ulga termomodernizacyjna',
    answer: 'Ulga podatkowa w PIT: odliczasz 12-32% kosztów magazynu od podatku. Pula: 53 000 zł. Sumuje się z dotacją NFOŚiGW — razem to poważna oszczędność!',
    emotion: 'teaching',
    followUp: 'Nasz ekspert pomoże policzyć oba dofinansowania razem.',
    showLeadPrompt: true,
  },

  // === OSZCZĘDNOŚCI ===
  {
    keywords: ['oszczędnoś', 'zaoszczędz', 'ile zaoszczędz', 'zysk', 'zwrot', 'roi', 'opłac', 'kalkulacj'],
    question: 'Oszczędności z magazynu',
    answer: 'Typowa rodzina z PV 6-10 kWp oszczędza 3 500-6 800 zł rocznie. Bez magazynu zużywasz ~30% produkcji — z magazynem ~80%. Zwrot z dotacją: 3-6 lat. System pracuje 20+ lat.',
    emotion: 'excited',
    followUp: 'Wpisz swoje dane w konfiguratorze — pokaże dokładną oszczędność roczną.',
    showLeadPrompt: true,
    suggestConfigurator: true,
  },
  {
    keywords: ['rachunek', 'prąd', 'opłata', 'koszt energi', 'net-billing', 'drogi prąd'],
    question: 'Wpływ na rachunek',
    answer: 'Rachunki spadają o 70-90%. W net-billingu sprzedajesz za ~0,28 zł/kWh, kupujesz za ~1,12 zł/kWh. Z magazynem zamiast oddawać prąd za grosze — zatrzymujesz go na wieczór.',
    emotion: 'teaching',
    followUp: 'Konfigurator policzy ile tracisz bez magazynu.',
    suggestConfigurator: true,
  },
  {
    keywords: ['kiedy się zwróci', 'ile lat zwrot', 'opłacalnoś', 'zwrot inwestycj'],
    question: 'Czas zwrotu',
    answer: 'Net-billing + dotacja → 3-5 lat\nBez dotacji → 7-9 lat\nZ pompą ciepła/EV → nawet 3-4 lata\n\nPo zwrocie — darmowa energia przez 14-16 lat.',
    emotion: 'teaching',
    followUp: 'Sprawdź kalkulację 20-letnią w konfiguratorze.',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },

  // === CENY ===
  {
    keywords: ['cena', 'kosztuje', 'ile kosztuje', 'cennik', 'pricing', 'kwota', 'rata', 'budżet', 'ile płac'],
    question: 'Cena magazynu',
    answer: 'Cena zależy od instalacji PV, zużycia i wybranego systemu. Nie podaję liczb bez kontekstu — to byłoby nieuczciwe.\n\nDlatego mamy konfigurator — w 2 minuty dostaniesz dokładną cenę brutto, cenę po dotacji i kalkulację ROI.',
    emotion: 'teaching',
    followUp: 'Sprawdź cenę w konfiguratorze — to 2 minuty.',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },
  {
    keywords: ['raty', 'finansow', 'leasing', 'kredyt', 'spłat', 'płatnoś'],
    question: 'Raty i finansowanie',
    answer: 'Finansowanie przez Inbank: RRSO 9,9%, 12-60 miesięcy, bez zaliczki, od ~149 zł/msc. Dla firm — leasing z odliczeniem VAT.',
    emotion: 'happy',
    followUp: 'Konfigurator policzy Twoją ratę.',
    suggestConfigurator: true,
  },

  // === PRODUKTY ===
  {
    keywords: ['produkt', 'marka', 'który', 'polecac', 'najlepszy', 'jaki magazyn', 'ofert', 'model', 'porówn'],
    question: 'Marki magazynów',
    answer: '5 topowych marek:\n\n- Sigenergy — premium all-in-one z AI\n- Huawei LUNA2000 — globalny bestseller\n- FoxESS — najlepsza cena/kWh\n- GoodWe Lynx — modułowa rozbudowa\n- Dyness Tower — kompaktowy design\n\nWszystkie z LiFePO4, gwarancja 10-15 lat.',
    emotion: 'happy',
    followUp: 'Konfigurator dobierze optymalny model pod Twoje dane.',
    suggestConfigurator: true,
    scrollTarget: '#produkty',
  },
  {
    keywords: ['sigenergy', 'premium', 'all-in-one'],
    question: 'Sigenergy',
    answer: 'Sigenergy — premium all-in-one: wbudowany inwerter + magazyn + AI. 5-20 kWh, gwarancja 15 lat. System sam uczy się zużycia i optymalizuje.',
    emotion: 'teaching',
    followUp: 'Sprawdź wycenę Sigenergy w konfiguratorze.',
    suggestConfigurator: true,
  },
  {
    keywords: ['huawei', 'luna', 'luna2000'],
    question: 'Huawei LUNA2000',
    answer: 'Huawei LUNA2000 — globalny bestseller, miliony instalacji. 5-30 kWh modułowy, LiFePO4, 6 000+ cykli, gwarancja 10 lat. NEXBE jest oficjalnym dystrybutorem.',
    emotion: 'teaching',
    followUp: 'Sprawdź Huawei w konfiguratorze.',
    suggestConfigurator: true,
  },
  {
    keywords: ['foxess', 'fox ess'],
    question: 'FoxESS',
    answer: 'FoxESS — najlepsza relacja cena/kWh. 5.2-11.6 kWh, LiFePO4, gwarancja 10 lat. Solidne rozwiązanie bez przepłacania.',
    emotion: 'happy',
    followUp: 'FoxESS ma świetną cenę. Sprawdź w konfiguratorze.',
    suggestConfigurator: true,
  },
  {
    keywords: ['goodwe', 'good we', 'lynx'],
    question: 'GoodWe Lynx',
    answer: 'GoodWe Lynx — modułowy 6.6-13.2 kWh, dokładasz moduły w przyszłości. LiFePO4, gwarancja 10 lat.',
    emotion: 'happy',
    followUp: 'GoodWe to rozbudowywalny wybór.',
    suggestConfigurator: true,
  },
  {
    keywords: ['dyness', 'tower'],
    question: 'Dyness Tower',
    answer: 'Dyness Tower — wieżowy design, minimum miejsca. 4.8-14.4 kWh modułowy, LiFePO4, gwarancja 10 lat.',
    emotion: 'happy',
    followUp: 'Idealny do małych pomieszczeń.',
    suggestConfigurator: true,
  },

  // === POJEMNOŚĆ ===
  {
    keywords: ['kwh', 'pojemność', 'jaka pojemnoś', 'ile kwh', 'wielkość', 'dobór'],
    question: 'Dobór pojemności',
    answer: 'Orientacyjnie:\n\nPV 3-5 kW → 5 kWh\nPV 5-8 kW → 5-10 kWh\nPV 8-12 kW → 10-15 kWh\nPV 12+ kW → 15+ kWh\n\nOd 2026 dotacja wymaga min. 10 kWh. Najdokładniej dobierzesz w konfiguratorze.',
    emotion: 'teaching',
    followUp: 'Sprawdź optymalną pojemność w konfiguratorze.',
    suggestConfigurator: true,
  },

  // === MONTAŻ ===
  {
    keywords: ['montaż', 'instalacja', 'jak wyglada montaż', 'montażyst', 'instalator'],
    question: 'Montaż',
    answer: 'Cały proces 7-14 dni:\n\n1. Rozmowa z ekspertem\n2. Audyt techniczny (2-3 dni)\n3. Oferta i zamówienie\n4. Dostawa 48h\n5. Montaż 1 dzień (4-6h)\n\nPod klucz — dostarczamy, instalujemy, konfigurujemy, szkolimy.',
    emotion: 'teaching',
    followUp: 'Chcesz bezpłatny audyt? Zostaw numer.',
    showLeadPrompt: true,
  },

  // === OBIEKCJE ===
  {
    keywords: ['drogi', 'za drogo', 'nie stać', 'drogie', 'tani', 'za dużo'],
    question: 'Za drogi?',
    answer: 'Rozumiem. Ale po dotacji 16 000 zł + uldze termomodernizacyjnej realna inwestycja jest zaskakująco niska. A ile tracisz BEZ magazynu? Jeśli oddajesz prąd za 0,28 zł i kupujesz za 1,12 zł — to kilka tysięcy rocznie.',
    emotion: 'teaching',
    followUp: 'Sprawdź cenę po dotacji w konfiguratorze.',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },
  {
    keywords: ['wart', 'sens', 'czy warto', 'czy się opłac'],
    question: 'Czy warto?',
    answer: 'Tak, jeśli masz PV. Bez magazynu zużywasz ~30% — z magazynem ~80%. Różnica: 3 500-5 000 zł/rok. Zwrot 3-6 lat z dotacją. System pracuje 20+ lat.',
    emotion: 'teaching',
    followUp: 'Policz w konfiguratorze ile zyskasz.',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },

  // === KONFIGURATOR ===
  {
    keywords: ['konfigurator', 'kalkulator', 'online', 'narzędzie', 'oblicz', 'policz', 'wycena'],
    question: 'Konfigurator',
    answer: 'Nasz konfigurator w 2 minuty:\n\n- Dobierze optymalny magazyn\n- Pokaże cenę brutto i po dotacji\n- Policzy roczną oszczędność i ROI na 20 lat\n- Wygeneruje ofertę PDF\n\nBez rejestracji. Wpisujesz moc PV i rachunek.',
    emotion: 'excited',
    followUp: 'Spróbuj — zajmuje 2 minuty.',
    suggestConfigurator: true,
  },

  // === POTWIERDZENIE / NIEZDECYDOWANIE ===
  {
    keywords: ['tak', 'chcę', 'chce', 'jasne', 'ok', 'okej', 'pewnie', 'proszę', 'dawaj', 'super'],
    question: 'Potwierdzenie',
    answer: 'Świetnie! Najszybciej sprawdzisz w konfiguratorze — wpisujesz dane, a on policzy wszystko w 2 minuty. Albo zostaw numer, a ekspert zadzwoni.',
    emotion: 'excited',
    followUp: 'Konfigurator online czy rozmowa z ekspertem?',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },
  {
    keywords: ['nie wiem', 'nie jestem pewn', 'zastanow', 'później', 'hmm'],
    question: 'Niezdecydowany',
    answer: 'Rozumiem — magazyn to inwestycja na 20+ lat. Najczęściej blokuje brak konkretnych liczb. Konfigurator w 2 minuty pokaże kalkulację pod Twój dom. Rozmowa z ekspertem jest bez zobowiązań.',
    emotion: 'teaching',
    followUp: 'Nie musisz decydować teraz. Ale warto poznać konkretne liczby.',
    suggestConfigurator: true,
    showLeadPrompt: true,
  },
];
