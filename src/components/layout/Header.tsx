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
        <Link href="https://magazyny.nexbe.pl" className="flex items-center gap-2">
          <span className="font-heading text-2xl tracking-tight">
            <span className="text-[#B5005D]">Nexbe</span>
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 border-l border-white/20 pl-2 ml-1">
            energia na życie
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#jak-dziala" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Jak to działa
          </Link>
          <Link href="/#produkty" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Produkty
          </Link>
          <Link href="/#dotacje" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Dotacje
          </Link>
          <Link href="/#kontakt" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Kontakt
          </Link>
          <Button asChild className="bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white border-0 shadow-lg shadow-[#B5005D]/20">
            <Link href="/konfigurator">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m0 12v2M4.93 4.93l4.24 4.24m5.66 5.66 4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66 4.24-4.24"/></svg>
                Konfigurator AI
              </span>
            </Link>
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
          <Link href="/#jak-dziala" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Jak to działa
          </Link>
          <Link href="/#produkty" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Produkty
          </Link>
          <Link href="/#dotacje" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Dotacje
          </Link>
          <Link href="/#kontakt" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Zostaw kontakt
          </Link>
          <Button asChild className="w-full bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white border-0">
            <Link href="/konfigurator" onClick={() => setMobileMenuOpen(false)}>
              Konfigurator AI
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
