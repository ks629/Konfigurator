import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import NexbiLoader from '@/components/NexbiLoader';
import './globals.css';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://konfigurator.nexbe.pl'),
  title: 'Konfigurator Magazynu Energii | Nexbe',
  description:
    'Dobierz magazyn energii do swojej instalacji PV. Kalkulator oszczędności, dotacje Mój Prąd do 16 000 zł, raty. Bezpłatny audyt.',
  openGraph: {
    title: 'Sprawdź ile zaoszczędzisz z magazynem energii | Nexbe',
    description:
      'Konfigurator magazynu energii Nexbe — dobierz system, oblicz oszczędności, uzyskaj dotacje.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://konfigurator.nexbe.pl',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
        <NexbiLoader />
      </body>
    </html>
  );
}
