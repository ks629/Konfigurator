# CLAUDE.md — Konfigurator NEXBE

## Deploy
- **Repo produkcyjne**: `ks629/Konfigurator` (GitHub) — JEDYNE źródło prawdy
- **NIE deployuj** z `NEXBE/05_Aplikacje_Web/konfigurator_app/` — archiwalne, niekompletne
- **Vercel projekt**: `konfigurator-tjgo` → `konfigurator.nexbe.pl`
- **Vercel scope**: `kamils-projects-77a292f6`
- **Deploy ręczny** (jeśli auto-deploy nie działa): `npx vercel --prod --yes`
- **Push do GitHub**: `GIT_ASKPASS=$(which gh) GH_TOKEN=$(gh auth token) git push origin main`

## Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript (strict mode wyłączony na buildzie)
- Tailwind CSS + custom nexbe tokens
- Framer Motion (animacje)
- shadcn/ui (komponenty)
- Zustand (state management, persist middleware)
- React Hook Form + Zod (walidacja formularzy)
- Sonner (toast notifications)

## Struktura kluczowa
- `src/app/konfigurator/page.tsx` — 5-krokowy wizard (główny komponent)
- `src/components/landing/ContactForm.tsx` — formularz kontaktowy na landing (RHF + Zod)
- `src/lib/validations.ts` — schematy Zod
- `src/lib/calculations.ts` — kalkulacja ROI
- `src/data/products.ts` — dane produktowe (nie hardcoduj w komponentach)
- `src/nexbe-icons/` — lokalne ikony (@nexbe/icons wskazuje tutaj przez tsconfig paths)
- `src/hooks/useConfigurator.ts` — Zustand store konfiguratora

## Konwencje
- Wszystkie teksty po polsku
- Dark-first design (nie dodawaj jasnego tła)
- Kolory brand: #350066 (plum), #B5005D (raspberry), #FF004E (flame)
- Dane w `lib/data.ts`, nie w komponentach
- Server Components domyślnie, `"use client"` tylko gdy potrzebny
- Formularze: React Hook Form + Zod (nie ręczny useState)

## Env vars (Vercel)
- `ADMIN_PASSWORD` — hasło do panelu admin
- `ADMIN_TOKEN_SECRET` — JWT secret dla admin auth
