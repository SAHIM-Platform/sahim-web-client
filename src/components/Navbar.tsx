'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import Logo from './Logo';
import Container from './Container';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'عن المنصة', href: '/about' },
  { label: 'أسئلة شائعة', href: '/faq' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <Container medium>
      <div className="px-2 md:px-3 py-2 md:py-3 bg-white/80 backdrop-blur-sm border rounded-md">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-1 md:gap-2">
                <Logo widthSize="sm" />
                <span className="text-md font-semibold text-secondary">ساهم</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center gap-4 md:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden sm:block">
              <Button
                href="/signup"
                variant="primary"
                size="sm"
              >
                أنشئ حساب
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 -mr-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="sm:hidden mt-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  href="/signup"
                  variant="primary"
                  size="sm"
                  className="mt-2"
                >
                  أنشئ حساب
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
