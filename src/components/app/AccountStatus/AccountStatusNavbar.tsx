import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface AccountStatusNavbarProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function AccountStatusNavbar({ onLogout, isLoggingOut }: AccountStatusNavbarProps) {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Logo widthSize="sm" />
            <Link href="/" className="text-lg font-bold text-secondary">ساهم</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              disabled={isLoggingOut}
              icon={<LogOut className="w-4 h-4" />}
              iconPosition="end"
            >
              {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 