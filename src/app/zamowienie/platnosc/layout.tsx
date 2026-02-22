import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Płatność | NEXBE',
};

export default function PlatnoscLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
