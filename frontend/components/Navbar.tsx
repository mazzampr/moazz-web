'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-brand-gray">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/images/moazz-logo.png"
              alt="Moazz Logo"
              className="w-8 h-8 group-hover:animate-spin-slow transition-transform"
            />
            <span className="font-display font-bold text-2xl text-brand-white group-hover:text-brand-blue transition-colors">
              MOAZZ
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/projects"
              className="font-medium hover:text-brand-blue transition-colors"
            >
              Work
            </Link>
            <Link
              href="/#experience"
              className="font-medium hover:text-brand-blue transition-colors"
            >
              Experience
            </Link>
            <Link
              href="/articles"
              className="font-medium hover:text-brand-blue transition-colors"
            >
              Articles
            </Link>
            <Link
              href="#contact"
              className="px-6 py-3 bg-brand-white text-brand-black font-medium btn-brutal"
            >
              Let's Talk
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-brand-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-brand-white transition-all ${isMenuOpen ? 'opacity-0' : ''
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-brand-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 flex flex-col gap-4">
            <Link
              href="#work"
              className="font-medium hover:text-brand-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="#experience"
              className="font-medium hover:text-brand-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Experience
            </Link>
            <Link
              href="#articles"
              className="font-medium hover:text-brand-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="mailto:mohazzampriyanto@gmail.com"
              className="px-6 py-3 bg-brand-blue text-brand-black font-medium btn-brutal text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Let's Talk
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
