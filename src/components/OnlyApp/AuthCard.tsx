import Logo from '@/components/Logo';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="w-full max-w-[450px] flex flex-col justify-center items-center text-right gap-6 sm:gap-8 p-6 sm:p-8 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-4 sm:space-y-5 text-right w-full">
        <Logo className="mx-auto" link="/about" />
        <div className="space-y-2 sm:space-y-3 text-center">
          <h1 className="font-semibold text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-gray-500 font-normal break-words">{description}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
} 