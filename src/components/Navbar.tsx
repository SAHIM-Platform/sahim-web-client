import Link from 'next/link';
import { Button } from './Button';
import Logo from './Logo';
import Container from './Container';

const navItems = [
  { label: 'عن المنصة', href: '/about' },
  { label: 'أسئلة شائعة', href: '/faq' },
];

function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <Container medium>
        <div className="px-2 md:px-3 py-2 md:py-3 bg-white border rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 md:gap-2">
                <Logo widthSize="sm" />
                <Link href="/" className="text-md font-semibold text-secondary">ساهم</Link>
              </div>
            </div>

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

            <Button
              href="/signup"
              variant="primary"
              size="sm"
            >
              أنشئ حساب
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
