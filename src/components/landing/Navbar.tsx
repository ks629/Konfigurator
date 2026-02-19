'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Jak to działa', href: '#jak-to-dziala' },
  { label: 'Oferta', href: '#oferta' },
  { label: 'O nas', href: '#o-nas' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontakt', href: '#kontakt' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 glass border-b border-nexbe-border'
            : 'py-5 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="https://magazyny.nexbe.pl" className="flex items-center gap-3 group">
            <Image
              src="/logo-white.svg"
              alt="Nexbe"
              width={110}
              height={32}
              priority
            />
            <span className="hidden sm:inline-flex section-label !py-1 !px-2.5 !text-[9px] !tracking-[2px]">
              <Zap className="w-3 h-3 text-nexbe-flame" />
              ENERGIA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-nexbe-text-muted hover:text-nexbe-text transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/konfigurator"
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-[13px]"
            >
              Konfiguruj
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-nexbe-text"
              aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-nexbe-bg/98 backdrop-blur-xl flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-semibold text-nexbe-text hover:text-nexbe-flame transition-colors"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.4 }}
              >
                <Link
                  href="/konfigurator"
                  className="btn-primary mt-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Konfiguruj magazyn
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
