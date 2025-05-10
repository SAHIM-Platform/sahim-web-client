import Link from "next/link";

export default function AccountStatusFooter() {
  return (
    <div className="flex flex-col items-center space-y-2 mt-8">
      <p className="text-sm text-gray-600">
        هل واجهتك مشكلة؟{' '}
        <Link href="/support" className="text-primary underline hover:decoration-transparent">
          تواصل مع الدعم الفني
        </Link>
      </p>
    </div>
  );
} 