import type { KnowledgeEntry } from '../engine/types';

export const ARKUSZ_KNOWLEDGE: KnowledgeEntry[] = [
  // === CHECKLIST ===
  {
    keywords: ['checklist', 'lista', 'przed montaż', 'przygotow', 'co sprawdzi'],
    question: 'Checklist przed montażem',
    answer: '[ ] Sprawdź moc przyłączeniową (tabliczka rozdzielnicy)\n[ ] Zidentyfikuj typ inwertera (marka, model, moc)\n[ ] Zmierz miejsce na magazyn (min. 0.5 m²)\n[ ] Sprawdź temperaturę pomieszczenia (0-45°C)\n[ ] Zweryfikuj wentylację\n[ ] Sprawdź dostęp do rozdzielnicy\n[ ] Potwierdź kompatybilność inwerter-magazyn\n[ ] Przygotuj narzędzia: wkrętarka, poziomica, multimetr',
    emotion: 'teaching',
    followUp: 'Dopiero po checkliście zaczynaj montaż.',
  },
  {
    keywords: ['po montaż', 'po instalacj', 'konfiguracja', 'uruchomien'],
    question: 'Po montażu',
    answer: '[ ] Skonfiguruj EMS/app producenta\n[ ] Ustaw tryb pracy (self-consumption / backup)\n[ ] Przetestuj island mode\n[ ] Sprawdź komunikację WiFi/LAN\n[ ] Zrób zdjęcia: rozdzielnica, magazyn, połączenia\n[ ] Podpisz protokół montażu z klientem\n[ ] Przeszkol klienta z aplikacji\n[ ] Wyślij raport do biura',
    emotion: 'teaching',
    followUp: 'Protokół montażu jest kluczowy do dotacji.',
  },

  // === PODŁĄCZENIA ===
  {
    keywords: ['podłącz', 'kabel', 'ac', 'dc', 'schemat', 'connect'],
    question: 'Schemat podłączenia',
    answer: 'Typowe podłączenie AC-coupled:\n\n1. Magazyn → przewód AC 3×4mm² → rozdzielnica\n2. Osobny bezpiecznik (wg producenta, zwykle B32A)\n3. Zabezpieczenie przeciwprzepięciowe\n4. Uziemienie PE\n5. Komunikacja: RS485 lub WiFi do inwertera\n\nDC-coupled (Sigenergy):\n1. String PV → magazyn/inwerter all-in-one → rozdzielnica',
    emotion: 'teaching',
    followUp: 'Sprawdź DTR producenta dla dokładnego schematu.',
  },
  {
    keywords: ['przekrój', 'kabel', 'mm2', 'grubość', 'przewód'],
    question: 'Przekroje kabli',
    answer: 'Przekroje wg mocy:\n\n- Do 5 kW: 3×2.5 mm² (B16A)\n- 5-10 kW: 3×4 mm² (B25A)\n- 10-15 kW: 3×6 mm² (B32A)\n- Powyżej 15 kW: 3×10 mm² (B40A)\n\nZawsze sprawdź DTR producenta! Długość trasy wpływa na dobór.',
    emotion: 'teaching',
    followUp: 'W razie wątpliwości — większy przekrój.',
  },

  // === TROUBLESHOOTING ===
  {
    keywords: ['problem', 'błąd', 'nie działa', 'troubleshoot', 'error', 'awaria'],
    question: 'Troubleshooting — ogólne',
    answer: 'Diagnostyka krok po kroku:\n\n1. Sprawdź zasilanie (bezpieczniki, napięcie)\n2. Sprawdź komunikację (WiFi/LAN/RS485)\n3. Sprawdź LED-y na urządzeniu (kody migania)\n4. Restart urządzenia (wyłącz DC → AC → odczekaj 30s → włącz AC → DC)\n5. Sprawdź logi w aplikacji producenta\n6. Sprawdź temperaturę (za gorąco/zimno?)\n\nJeśli nie pomaga → zadzwoń do serwisu: 732 080 101.',
    emotion: 'curious',
    followUp: 'Zanotuj kody błędów — potrzebne do zgłoszenia serwisowego.',
  },
  {
    keywords: ['komunikacja', 'wifi', 'lan', 'rs485', 'offline', 'nie łączy'],
    question: 'Problem: brak komunikacji',
    answer: 'Brak komunikacji magazyn-inwerter:\n\n1. WiFi: sprawdź siłę sygnału (min. -70 dBm). Jeśli słaby → użyj LAN\n2. RS485: sprawdź polaryzację (A→A, B→B), terminacja\n3. LAN: sprawdź kabel (ping), DHCP vs static IP\n4. Restart obu urządzeń\n5. Sprawdź firmware — może wymagać aktualizacji\n\nHuawei: app FusionSolar → diagnostyka\nFoxESS: app FoxCloud → status',
    emotion: 'teaching',
    followUp: 'LAN jest zawsze stabilniejsze niż WiFi.',
  },
  {
    keywords: ['nie ładuje', 'nie magazynuje', 'soc', 'stan naładowan', '0%'],
    question: 'Problem: nie ładuje',
    answer: 'Magazyn nie ładuje? Sprawdź:\n\n1. SoC (stan naładowania) — może być już 100%\n2. Tryb pracy — czy jest na "self-consumption"?\n3. Produkcja PV — czy panele produkują wystarczająco?\n4. Limit mocy ładowania — czy nie jest za niski?\n5. Temperatura — poza zakresem (0-45°C) BMS blokuje\n6. Bezpieczniki DC — czy nie wypadły?\n\nJeśli SoC 0% i nie rośnie → sprawdź napięcie DC na zaciskach.',
    emotion: 'curious',
    followUp: 'Monitoruj SoC przez app producenta.',
  },

  // === ISLAND MODE ===
  {
    keywords: ['island', 'wyspow', 'backup', 'eps', 'szr', '3f', 'awaryjn'],
    question: 'Konfiguracja island mode',
    answer: 'Konfiguracja backup/island:\n\nEPS (Emergency Power Supply):\n- Wybierz obwody krytyczne (światło, lodówka, internet)\n- Podłącz do wyjścia EPS na inwerterze\n- Testuj: wyłącz główny → sprawdź przełączenie\n\nPełny backup 3F (SZR):\n- Wymaga przełącznika SZR\n- Podłączenie za głównym wyłącznikiem\n- Przełączenie w <20ms\n- Testuj pod obciążeniem\n\nOd 2026 dotacja wymaga island mode.',
    emotion: 'teaching',
    followUp: 'Zawsze testuj backup przy klientcie.',
  },

  // === KOMPATYBILNOŚĆ ===
  {
    keywords: ['kompatybil', 'pasuje', 'inwerter', 'falownik', 'współprac'],
    question: 'Kompatybilność',
    answer: 'Matryca kompatybilności:\n\n- Huawei LUNA2000 → Huawei SUN2000 (TYLKO)\n- FoxESS baterie → FoxESS inwertery\n- GoodWe Lynx → GoodWe inwertery hybrydowe\n- Dyness Tower → kompatybilny z wieloma (sprawdź listę)\n- Sigenergy → ALL-IN-ONE (nie potrzebuje osobnego inwertera)\n\nJeśli klient ma inwerter innej marki → może wymagać wymiany lub dodania hybrydowego.',
    emotion: 'teaching',
    followUp: 'Sprawdź model inwertera PRZED montażem.',
  },

  // === WYMIARY ===
  {
    keywords: ['wymiar', 'rozmiar', 'waga', 'kg', 'cm', 'wielkość'],
    question: 'Wymiary magazynów',
    answer: 'Orientacyjne wymiary (sprawdź DTR!):\n\n- Huawei LUNA2000-5: 670×150×600mm, ~60kg\n- Huawei LUNA2000-10: 670×150×960mm, ~114kg\n- FoxESS ECS: 585×370×190mm, ~50kg\n- GoodWe Lynx 6.6: 688×300×550mm, ~75kg\n- Dyness Tower T10: 490×180×920mm, ~100kg\n- Sigenergy 5kWh: 530×180×490mm, ~50kg\n\nZawsze doliczyć 20cm wolnego z każdej strony na wentylację.',
    emotion: 'teaching',
    followUp: 'Sprawdź miejsce PRZED dostawą.',
  },

  // === BEZPIECZEŃSTWO ===
  {
    keywords: ['bhp', 'bezpiecz', 'ochrona', 'prąd', 'porażen'],
    question: 'BHP na montażu',
    answer: 'BEZPIECZEŃSTWO:\n\n- ZAWSZE wyłącz DC i AC przed pracą\n- Używaj rękawic izolacyjnych (1000V DC!)\n- Multimetr: sprawdź napięcie przed dotknięciem\n- Magazyny LiFePO4 = bezpieczne, ale DC może zabić\n- Nie otwieraj obudowy magazynu\n- Nie pracuj w wilgoci\n- Dwuosobowy montaż (ciężkie moduły)\n- Pierwsza pomoc: defibrylator w zasięgu',
    emotion: 'excited',
    followUp: 'Bezpieczeństwo > szybkość. Zawsze.',
  },

  // === ZDJĘCIA ===
  {
    keywords: ['zdjęci', 'foto', 'dokumentac', 'aparat', 'fotka'],
    question: 'Dokumentacja fotograficzna',
    answer: 'Wymagane zdjęcia:\n\n1. Rozdzielnica (przed i po)\n2. Magazyn zamontowany\n3. Połączenia kablowe\n4. Tabliczka znamionowa magazynu\n5. Tabliczka inwertera\n6. Ogólny widok instalacji\n7. Etykieta CE produktu\n\nMin. jakość: wyraźne, dobrze oświetlone. Potrzebne do protokołu i wniosku o dotację.',
    emotion: 'teaching',
    followUp: 'Zrób zdjęcia od razu — nie wracaj po nie.',
  },
];
