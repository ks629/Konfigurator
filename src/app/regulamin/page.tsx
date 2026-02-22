import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Regulamin | Nexbe Konfigurator',
  robots: 'noindex, nofollow',
};

export default function RegulaminPage() {
  return (
    <div className="nexbe-dark min-h-screen bg-[#0f0520] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl text-white mb-2">
          Regulamin
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Ostatnia aktualizacja: 18 lutego 2026
        </p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">1. Postanowienia ogólne</h2>
            <p>
              Regulamin określa zasady korzystania z serwisu konfigurator.nexbe.pl,
              prowadzonego przez NEXBE Sp. z o.o., ul. Sadowa 19D, 05-850 Jawczyce,
              NIP: 1182267842, KRS: 0001082041.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">2. Zakres usług</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Konfiguracja systemu magazynowania energii za pomocą Konfiguratora AI</li>
              <li>Kalkulacja oszczędności i dofinansowań</li>
              <li>Złożenie zapytania ofertowego</li>
              <li>Pobranie spersonalizowanej oferty PDF</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">3. Charakter informacyjny</h2>
            <p>
              Kalkulacje i ceny prezentowane w Konfiguratorze mają charakter orientacyjny
              i nie stanowią oferty w rozumieniu art. 66 Kodeksu Cywilnego.
              Ostateczna cena ustalana jest w indywidualnej umowie.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">4. Prawa autorskie</h2>
            <p>
              Treści, grafiki i oprogramowanie stanowią własność NEXBE Sp. z o.o.
              i podlegają ochronie prawnej.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">5. Reklamacje</h2>
            <p>
              Reklamacje: <strong className="text-white">kontakt@nexbe.pl</strong>.
              Rozpatrywane w 14 dni roboczych.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              NEXBE Sp. z o.o. | ul. Sadowa 19D, 05-850 Jawczyce | NIP: 1182267842 | kontakt@nexbe.pl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
