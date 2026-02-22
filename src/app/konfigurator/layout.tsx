import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://konfigurator.nexbe.pl/konfigurator',
  },
};

export default function KonfiguratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
