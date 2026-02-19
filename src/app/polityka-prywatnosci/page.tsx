import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Polityka Prywatności | Nexbe Konfigurator',
  robots: 'noindex, nofollow',
};

export default function PolitykaPrywatnosciPage() {
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
          Polityka Prywatności
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Ostatnia aktualizacja: 18 lutego 2026
        </p>

        <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">1. Administrator danych osobowych</h2>
            <p>
              Administratorem Twoich danych osobowych jest NEXBE Sp. z o.o. z siedzibą
              przy ul. Sadowa 19D, 05-850 Jawczyce, NIP: 1182267842, KRS: 0001082041.
            </p>
            <p className="mt-2">
              Kontakt: <strong className="text-white">kontakt@nexbe.pl</strong>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">2. Jakie dane zbieramy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Imię i nazwisko</li>
              <li>Adres e-mail</li>
              <li>Numer telefonu</li>
              <li>Kod pocztowy (opcjonalnie)</li>
              <li>Informacje o instalacji PV i zużyciu energii</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">3. Cel przetwarzania</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Przygotowanie oferty magazynu energii (art. 6 ust. 1 lit. b RODO)</li>
              <li>Kontakt w sprawie zapytania (art. 6 ust. 1 lit. f RODO)</li>
              <li>Marketing bezpośredni — za zgodą (art. 6 ust. 1 lit. a RODO)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">4. Twoje prawa</h2>
            <p>Przysługuje Ci prawo do: dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, sprzeciwu, wycofania zgody oraz skargi do Prezesa UODO.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">5. Pliki cookies</h2>
            <p>Strona wykorzystuje cookies do prawidłowego funkcjonowania i analizy ruchu. Zarządzanie cookies dostępne jest w ustawieniach przeglądarki.</p>
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
