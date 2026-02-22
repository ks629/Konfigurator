import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wniosek o raty | NEXBE',
};

export default function RatyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
