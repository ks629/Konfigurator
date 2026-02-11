# Konfigurator Magazynu Energii NEXBE

Aplikacja webowa do konfiguracji i ofertowania magazynow energii dla prosumentow z instalacjami PV.

## Stack technologiczny

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4 + shadcn/ui
- **Wykresy**: Recharts
- **Formularze**: React Hook Form + Zod
- **Stan**: Zustand (z persystencja w localStorage)
- **Animacje**: Framer Motion
- **Powiadomienia**: Sonner
- **Testy**: Jest + ts-jest

## Struktura projektu

```
src/
  app/
    page.tsx                 # Landing page
    konfigurator/page.tsx    # Kreator krok po kroku
    oferta/page.tsx          # Podsumowanie oferty
    admin/                   # Panel administracyjny
      page.tsx               # Dashboard
      cennik/page.tsx        # Cennik produktow
      leady/page.tsx         # Lista leadow
      ustawienia/page.tsx    # Parametry kalkulatora
    api/
      calculate/route.ts     # Kalkulacje ROI
      send-offer/route.ts    # Wysylka PDF
      save-lead/route.ts     # Zapis leadow
      calendar/route.ts      # Google Calendar
  components/
    configurator/            # Kroki kreatora (1-5)
    calculator/              # Wykresy, tabele, oszczednosci
    forms/                   # Formularze kontaktowe
    layout/                  # Header, Footer
    ui/                      # shadcn/ui components
  data/
    products.ts              # Baza produktow (AC/DC + falowniki)
    params.ts                # Parametry kalkulatora
  hooks/
    useConfigurator.ts       # Store Zustand
  lib/
    calculations.ts          # Logika kalkulacji ROI
    compatibility.ts         # Macierz kompatybilnosci
    types.ts                 # TypeScript types
    validations.ts           # Schematy Zod
```

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja bedzie dostepna pod http://localhost:3000

## Testy

```bash
npm test
```

## Build produkcyjny

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Push do repozytorium GitHub
2. Polacz repo z Vercel
3. Ustaw zmienne srodowiskowe (`.env.local`)
4. Deploy automatyczny

## Zmienne srodowiskowe

```env
# Google APIs (opcjonalne - do integracji)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALENDAR_ID=
GOOGLE_SHEETS_ID=

# E-mail (opcjonalne - do wysylki ofert)
RESEND_API_KEY=
EMAIL_FROM=oferty@nexbe.pl
EMAIL_TO_LEADS=lead@nexbe.pl

# Admin
ADMIN_PASSWORD=nexbe2025
NEXT_PUBLIC_ADMIN_PASSWORD=nexbe2025

# App
NEXT_PUBLIC_APP_URL=https://konfigurator.nexbe.pl
```

## Flow uzytkownika

1. **Krok 1** - Wybor typu instalacji (Retrofit AC / Hybrid DC / Upgrade)
2. **Krok 2** - Dane instalacji PV (moc, falownik, rok)
3. **Krok 3** - Zuzycie energii (kWh lub rachunek)
4. **Krok 4** - Dodatkowe potrzeby (pompa ciepla, EV, backup)
5. **Krok 5** - Rekomendacja produktu (3 opcje: ekonomiczna/rekomendowana/premium)
6. **Kalkulacja** - ROI, wykres, projekcja 20-letnia, raty
7. **Lead capture** - Formularz kontaktowy z wysylka oferty

## Panel administracyjny

Dostepny pod `/admin` (haslo: `nexbe2025`)

- Dashboard ze statystykami
- Edycja cennika produktow
- Lista i zarzadzanie leadami
- Konfiguracja parametrow kalkulatora
