'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/mazzampr' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/mazzampr/' },
    { name: 'Email', href: 'mailto:mohazzampriyanto@gmail.com' },
  ];

  const footerLinks = [
    { name: 'Work', href: '/projects' },
    { name: 'Experience', href: '/#experiences' },
    { name: 'Articles', href: '/articles' },
  ];

  return (
    <footer className="relative bg-brand-black border-t border-brand-gray">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/moazz-logo.png"
                alt="Moazz Logo"
                className="w-8 h-8 group-hover:animate-spin-slow transition-transform"
              />
              <span className="font-display font-bold text-2xl text-brand-white">
                MOAZZ
              </span>
            </div>
            <p className="text-brand-white/60 text-sm leading-relaxed">
              Creative developer & designer crafting digital experiences that matter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg text-brand-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand-white/60 hover:text-brand-blue transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-display font-bold text-lg text-brand-white mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-white/60 hover:text-brand-blue transition-colors text-sm"
                  >
                    {link.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-brand-gray border border-brand-blue/20 rounded-none p-8 mb-12 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-white mb-4">
            Let's Build Something{' '}
            <span className="text-brand-blue">Amazing</span>
          </h2>
          <p className="text-brand-white/60 mb-6 max-w-2xl mx-auto">
            Have a project in mind? Let's collaborate and create something extraordinary together.
          </p>
          <a
            href="mailto:hello@moazz.dev"
            className="inline-block px-8 py-4 bg-brand-blue text-brand-black font-bold btn-brutal"
          >
            Get In Touch
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8 border-t border-brand-gray">
          <p className="text-brand-white/40 text-sm">
            © {currentYear} MOAZZ. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-50" />
    </footer>
  );
}
