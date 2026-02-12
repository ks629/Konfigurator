import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-[#230045] text-white" id="kontakt">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading text-xl text-white">Nexbe</span>
              <span className="text-xs text-gray-300 border-l border-gray-500 pl-2 ml-1">energia na życie</span>
            </div>
            <p className="text-sm text-gray-300">
              Integrator 360° magazynów energii. Kompleksowe rozwiązania
              dla prosumentów i firm.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>kontakt@nexbe.pl</p>
              <p>+48 732 080 101</p>
              <p>
                <a href="https://nexbe.pl" target="_blank" rel="noopener noreferrer" className="hover:text-[#B5005D] transition-colors">
                  nexbe.pl
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-2">ul. Sadowa 19D, 05-850 Jawczyce</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm mb-4">Informacje</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <Link href="/polityka-prywatnosci" className="block hover:text-[#B5005D] transition-colors">
                Polityka prywatności
              </Link>
              <Link href="/regulamin" className="block hover:text-[#B5005D] transition-colors">
                Regulamin
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} NEXBE Sp. z o.o. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
