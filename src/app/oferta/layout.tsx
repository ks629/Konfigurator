import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twoja oferta magazynu energii',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfertaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
