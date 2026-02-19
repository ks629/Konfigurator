import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Linkedin } from 'lucide-react';

const offerLinks = [
  { label: 'Magazyny energii', href: '#oferta' },
  { label: 'Fotowoltaika', href: '#', muted: true },
  { label: 'Ładowarki EV', href: '#', muted: true },
  { label: 'Smart EMS', href: '#', muted: true },
];

const companyLinks = [
  { label: 'Zespół', href: '#o-nas' },
  { label: 'Keno Energy', href: '#o-nas' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Polityka prywatności', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-nexbe-border bg-nexbe-deep/50">
      <div className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/logo-white-claim.svg" alt="Nexbe — energia na życie" width={140} height={40} />
            <div className="text-sm text-nexbe-text-muted leading-relaxed mt-4">
              <p>NEXBE Sp. z o.o.</p>
              <p>ul. Sadowa 19D</p>
              <p>05-850 Jawczyce</p>
              <p className="mt-2">NIP: 7011261848</p>
            </div>
          </div>

          {/* Oferta */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide">Oferta</h4>
            <ul className="space-y-3">
              {offerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors ${
                      link.muted
                        ? 'text-nexbe-text-muted/40 cursor-default'
                        : 'text-nexbe-text-muted hover:text-nexbe-text'
                    }`}
                  >
                    {link.label}
                    {link.muted && <span className="ml-2 text-[10px] opacity-50">wkrótce</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Firma */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide">Firma</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-nexbe-text-muted hover:text-nexbe-text transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 tracking-wide">Kontakt</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:kontakt@nexbe.pl" className="text-sm text-nexbe-text-muted hover:text-nexbe-text transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4 text-nexbe-raspberry" />
                  kontakt@nexbe.pl
                </a>
              </li>
              <li>
                <a href="tel:+48732080101" className="text-sm text-nexbe-text-muted hover:text-nexbe-text transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4 text-nexbe-raspberry" />
                  +48 732 080 101
                </a>
              </li>
              <li>
                <a href="https://nexbe.pl" target="_blank" rel="noopener" className="text-sm text-nexbe-text-muted hover:text-nexbe-text transition-colors flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-nexbe-raspberry" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-nexbe-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-nexbe-text-muted">
          <p>&copy; 2026 NEXBE Sp. z o.o. Wszelkie prawa zastrzeżone.</p>
          <p>Partner technologiczny: Keno Energy Sp. z o.o.</p>
        </div>
      </div>
    </footer>
  );
}
