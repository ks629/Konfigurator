'use client';

import Link from 'next/link';
import { Battery, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Battery className="h-8 w-8 text-primary" />
          <span className="font-heading text-2xl text-primary">NEXBE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/konfigurator" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Konfigurator
          </Link>
          <Link href="/#jak-dziala" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Jak to dziala
          </Link>
          <Link href="/#kontakt" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Kontakt
          </Link>
          <Button asChild>
            <Link href="/konfigurator">Rozpocznij konfiguracje</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-3">
          <Link href="/konfigurator" className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Konfigurator
          </Link>
          <Link href="/#jak-dziala" className="block text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Jak to dziala
          </Link>
          <Button asChild className="w-full">
            <Link href="/konfigurator" onClick={() => setMobileMenuOpen(false)}>
              Rozpocznij konfiguracje
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
