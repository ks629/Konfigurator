import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Konfigurator — dobierz magazyn energii',
  description: 'Skonfiguruj magazyn energii dopasowany do Twojej instalacji PV. Oblicz ROI, sprawdź dotacje Mój Prąd 7.0, zamów online.',
  alternates: {
    canonical: 'https://konfigurator.nexbe.pl/konfigurator',
  },
};

export default function KonfiguratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
