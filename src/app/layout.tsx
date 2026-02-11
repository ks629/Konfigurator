import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
});

const openSans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Konfigurator Magazynu Energii | NEXBE',
  description:
    'Dobierz magazyn energii do swojej instalacji PV. Kalkulator oszczednosci, dotacje, raty. Bezplatny audyt.',
  openGraph: {
    title: 'Sprawdz ile zaoszczedzisz z magazynem energii',
    description:
      'Konfigurator magazynu energii NEXBE - dobierz system, oblicz oszczednosci, uzyskaj dotacje.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
