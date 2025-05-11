'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import Logo from './Logo';
import Container from './Container';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks';
import UserDropdownMenu from './OnlyApp/AppNavbar/UserDropdownMenu';

const navItems = [
  { label: 'عن المنصة', href: '/about' },
  { label: 'أسئلة شائعة', href: '/faq' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <Container medium>
        <div className="px-2 md:px-3 py-2 md:py-3 bg-white/80 backdrop-blur-sm border rounded-md">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-1 md:gap-2">
                <Logo widthSize="sm" />
                <span className="text-md font-semibold text-secondary">ساهم</span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden sm:flex flex-1 justify-center">
              <div className="flex items-center gap-4 md:gap-8">
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
            </div>

            {/* Desktop CTA or User Menu */}
            <div className="hidden sm:block flex-shrink-0">
              {isAuthenticated ? (
                <UserDropdownMenu />
              ) : (
                <Button
                  href="/signup"
                  variant="primary"
                  size="sm"
                >
                  أنشئ حساب
                </Button>
              )}
            </div>

            {/* Mobile Menu Button and User Menu */}
            <div className="sm:hidden flex flex-1 justify-end items-center gap-2">
              {isAuthenticated && <UserDropdownMenu />}
              <button
                className="p-2 -mr-2 text-gray-600"
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
                {!isAuthenticated && (
                  <Button
                    href="/signup"
                    variant="primary"
                    size="sm"
                    className="mt-2"
                  >
                    أنشئ حساب
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
