import { Battery } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground" id="kontakt">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Battery className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl text-primary">NEXBE</span>
            </div>
            <p className="text-sm text-gray-400">
              Integrator 360° magazynow energii. Kompleksowe rozwiazania
              dla prosumentow i firm.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>kontakt@nexbe.pl</p>
              <p>+48 XXX-XXX-XXX</p>
              <p>nexbe.pl</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm mb-4">Informacje</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/polityka-prywatnosci" className="block hover:text-primary transition-colors">
                Polityka prywatnosci
              </Link>
              <Link href="/regulamin" className="block hover:text-primary transition-colors">
                Regulamin
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} NEXBE Sp. z o.o. Wszelkie prawa zastrzezone.</p>
        </div>
      </div>
    </footer>
  );
}
