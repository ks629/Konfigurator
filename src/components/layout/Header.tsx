'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f0520]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#0f0520]/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl tracking-tight">
            <span className="text-[#B5005D]">Nexbe</span>
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 border-l border-white/20 pl-2 ml-1">
            energia na życie
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/konfigurator" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Konfigurator
          </Link>
          <Link href="/#jak-dziala" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Jak to działa
          </Link>
          <Link href="/#kontakt" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Kontakt
          </Link>
          <Button asChild className="bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white border-0">
            <Link href="/konfigurator">Rozpocznij konfigurację</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0f0520]/95 backdrop-blur-md p-4 space-y-3">
          <Link href="/konfigurator" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Konfigurator
          </Link>
          <Link href="/#jak-dziala" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Jak to działa
          </Link>
          <Button asChild className="w-full bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white border-0">
            <Link href="/konfigurator" onClick={() => setMobileMenuOpen(false)}>
              Rozpocznij konfigurację
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
