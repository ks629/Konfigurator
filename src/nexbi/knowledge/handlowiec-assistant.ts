import type { KnowledgeEntry } from '../engine/types';

export const HANDLOWIEC_KNOWLEDGE: KnowledgeEntry[] = [
  // === SANDLER METHODOLOGY ===
  {
    keywords: ['sandler', 'pain funnel', 'technik', 'metod', 'sprzedaż'],
    question: 'Sandler Pain Funnel',
    answer: 'Pain Funnel — kluczowe pytania:\n\n1. "Opowiedz mi więcej o tym problemie"\n2. "Od kiedy to trwa?"\n3. "Co już próbowaliście?"\n4. "Ile to kosztuje?" (ból finansowy)\n5. "Co się stanie jeśli nic nie zrobicie?"\n6. "Czy to priorytet?"\n\nNigdy nie prezentuj rozwiązania PRZED zbudowaniem bólu. Klient musi SAM dojść do wniosku że potrzebuje magazynu.',
    emotion: 'teaching',
    followUp: 'Użyj "Negative Reverse" gdy klient mówi "za drogo" — zapytaj "Może rzeczywiście to nie jest dla Państwa?".',
  },
  {
    keywords: ['negative reverse', 'reverse', 'odmowa', 'odmawiaj'],
    question: 'Negative Reverse Selling',
    answer: 'Negative Reverse — gdy klient się waha:\n\n"Rozumiem. Może to rzeczywiście nie jest najlepszy moment?" → klient broni decyzji zakupu.\n\n"Wie Pan co, jeśli rachunek za prąd nie jest duży, to może faktycznie nie warto?" → klient ujawnia prawdziwy ból.\n\nKlucz: NIE naciskaj. Im bardziej odpuszczasz, tym bardziej klient się angażuje.',
    emotion: 'teaching',
    followUp: 'Działa najlepiej po fazie Pain Funnel.',
  },
  {
    keywords: ['reversing', 'pytania', 'odpowiadaj pytaniem'],
    question: 'Reversing',
    answer: 'Reversing — odpowiadaj pytaniem na pytanie:\n\nKlient: "Ile to kosztuje?"\nTy: "To świetne pytanie. Żebym mógł podać konkretną cenę — mogę zapytać ile płaci Pan za prąd?"\n\nKlient: "Czy to się opłaca?"\nTy: "A gdybym pokazał kalkulację pod Pana instalację — to by pomogło w decyzji?"\n\nCel: kontrolujesz rozmowę, zbierasz informacje.',
    emotion: 'teaching',
    followUp: 'Zawsze odwracaj pytanie z szacunkiem.',
  },

  // === OBIEKCJE ===
  {
    keywords: ['obiekcja', 'za drogo', 'drogi', 'cena', 'nie stać'],
    question: 'Obiekcja: za drogo',
    answer: 'Scenariusz "za drogo":\n\n1. EMPATIA: "Rozumiem, to poważna kwota"\n2. PAIN: "Mogę zapytać — ile płaci Pan za prąd rocznie?"\n3. MATH: Policz: rachunek × 12 × 20 lat = koszt BEZ magazynu\n4. REFRAME: "To nie jest wydatek — to zamiana rachunków na inwestycję"\n5. DOTACJA: "Po dotacji 16 000 zł realna kwota to X"\n6. RATY: "Rata od 149 zł/msc — mniej niż tracisz na net-billingu"\n\nNIGDY nie obniżaj ceny. Podnoś wartość.',
    emotion: 'teaching',
    followUp: 'Użyj konfiguratora na spotkaniu — pokaż kalkulację na żywo.',
  },
  {
    keywords: ['poczekam', 'ceny spadn', 'nie teraz', 'później'],
    question: 'Obiekcja: poczekam',
    answer: 'Scenariusz "poczekam":\n\n1. "Rozumiem. A mogę zapytać na co dokładnie czeka Pan?"\n2. Math: "Ceny spadły 40% w 2 lata, ale prąd drożeje 5-8%/rok. Każdy rok bez magazynu = 4 000 zł strat na net-billingu"\n3. Dotacja: "Pula jest ograniczona na dany rok — w 2025 skończyła się w kilka miesięcy"\n4. Negative Reverse: "Może rzeczywiście lepiej poczekać, jeśli rachunek nie jest duży?"\n\nKlucz: pokaż koszt CZEKANIA, nie naciskaj na decyzję.',
    emotion: 'curious',
    followUp: 'Użyj kalkulatora "teraz vs za rok" w konfiguratorze.',
  },
  {
    keywords: ['konkuren', 'columbus', 'inne firmy', 'tańsze', 'lepsza ofert'],
    question: 'Obiekcja: konkurencja',
    answer: 'Vs konkurencja (np. Columbus Energy):\n\n- NEXBE = dystrybutor bezpośredni (Grupa KENO) → 20-30% taniej\n- 5 marek vs 1 u konkurencji → lepszy dobór\n- Realizacja 7-14 dni vs 30-60 dni\n- Jedyna firma z cenami online (transparentność)\n- Concierge: składamy wniosek za klienta\n\nNIGDY nie mów źle o konkurencji. Mów: "Porównajcie oferty — jesteśmy pewni swoich cen".',
    emotion: 'happy',
    followUp: 'Zaproponuj klientowi porównanie ofert. Pewność siebie = profesjonalizm.',
  },
  {
    keywords: ['znajomy', 'lokalny elektryk', 'sąsiad', 'tańszy montaż'],
    question: 'Obiekcja: znajomy zrobi taniej',
    answer: 'Argument kontrowy:\n\n- Brak cen dystrybucyjnych = droższe komponenty\n- Brak gwarancji serwisowej z producentem\n- Ryzyko utraty 16 000 zł dotacji (niezgodność z NFOŚiGW!)\n- Brak EMS i smart konfiguracji\n\nKlucz: "Rozumiem pokusę. Ale jeśli instalacja nie spełni wymogów NFOŚiGW — traci Pan 16 000 zł. My gwarantujemy zgodność."',
    emotion: 'teaching',
    followUp: 'Nie atakuj znajomego — pokaż ryzyko utraty dotacji.',
  },

  // === PRODUKTY QUICK SPECS ===
  {
    keywords: ['sigenergy', 'spec sigenergy', 'dane sigenergy'],
    question: 'Spec: Sigenergy',
    answer: 'SIGENERGY:\n- All-in-one (wbudowany inwerter)\n- 5-20 kWh modułowy\n- AI optymalizacja zużycia\n- Gwarancja: 15 lat\n- USP: "ustaw i zapomnij"\n- Target: klient premium, który nie chce się martwić\n- Cena: najwyższa w ofercie',
    emotion: 'teaching',
    followUp: 'Pozycjonuj jako premium — AI + prostota.',
  },
  {
    keywords: ['huawei', 'luna', 'spec huawei', 'dane huawei'],
    question: 'Spec: Huawei LUNA2000',
    answer: 'HUAWEI LUNA2000:\n- 5-30 kWh modułowy\n- LiFePO4, 6 000+ cykli\n- Wymaga inwertera Huawei SUN2000\n- Gwarancja: 10 lat\n- USP: globalny bestseller, miliony instalacji\n- Target: klient szukający sprawdzonego rozwiązania\n- NEXBE = oficjalny dystrybutor',
    emotion: 'teaching',
    followUp: 'Argument: "najbardziej sprawdzony na świecie".',
  },
  {
    keywords: ['foxess', 'spec foxess', 'dane foxess'],
    question: 'Spec: FoxESS',
    answer: 'FOXESS:\n- 5.2-11.6 kWh\n- LiFePO4, kompaktowy\n- Gwarancja: 10 lat\n- USP: najlepsza cena/kWh\n- Target: klient szukający dobrej ceny\n- Cena: najniższa w ofercie',
    emotion: 'teaching',
    followUp: 'Argument: "solidne rozwiązanie bez przepłacania".',
  },

  // === MARKET ===
  {
    keywords: ['rynek', 'dane rynkowe', 'statystyk', 'trendy'],
    question: 'Dane rynkowe',
    answer: 'Rynek BESS Polska 2025-2026:\n\n- Wzrost 360% r/r\n- 1,5M+ prosumentów (penetracja 3%)\n- NFOŚiGW: 1 mld zł na dotacje 2026-2030\n- Ceny magazynów -40% w 2 lata\n- Ceny prądu +5-8%/rok\n- Net-billing zmniejsza wartość nadwyżki o 55%\n\nOkno sprzedażowe: dotacje + rosnące ceny prądu + dojrzała technologia.',
    emotion: 'excited',
    followUp: 'Użyj tych danych w prezentacji klientowi.',
  },

  // === KALKULACJA ===
  {
    keywords: ['kalkulacj', 'roi', 'policzy', 'oblicz', 'arkusz', 'excel'],
    question: 'Kalkulacja ROI',
    answer: 'Kluczowe wzory:\n\n- Oszczędność = (autokonsumpcja z bat. - bez bat.) × cena zakupu kWh\n- Autokonsumpcja bez bat. ≈ 30%\n- Autokonsumpcja z bat. ≈ 80%\n- Cena zakupu ≈ 1,12 zł/kWh (G11)\n- Cena sprzedaży ≈ 0,28 zł/kWh (RCE)\n- ROI = (cena - dotacja) / oszczędność roczna\n\nNajłatwiej: użyj konfiguratora na spotkaniu z klientem — pokaże wszystko na żywo.',
    emotion: 'teaching',
    followUp: 'Konfigurator generuje też PDF ofertę.',
  },

  // === NET-BILLING ===
  {
    keywords: ['net-billing', 'netbilling', 'rozliczen', 'prosument', 'odkup'],
    question: 'Net-billing',
    answer: 'Net-billing tłumacz klientowi prosto:\n\n"Sprzedajesz za 28 groszy, kupujesz za 1,12 zł. Tracisz 55% wartości swojej energii. Z magazynem — zatrzymujesz prąd na wieczór i zużywasz po pełnej cenie. Różnica 4-krotna."\n\nTo najsilniejszy argument sprzedażowy — konkretne pieniądze.',
    emotion: 'teaching',
    followUp: 'Pokaż klientowi kalkulację na jego danych.',
  },
];
