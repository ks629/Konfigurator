import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dane do zamówienia | NEXBE',
};

export default function DaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
