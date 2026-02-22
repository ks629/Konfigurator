import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zamówienie | NEXBE',
  robots: { index: false, follow: false },
};

export default function ZamowienieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
