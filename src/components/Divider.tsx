"use client";

interface DividerProps {
  label?: string;
  heavy?: boolean;
  className?: string;
}

const Divider = ({ heavy, className, label = 'أو' }: DividerProps) => {
  return (
    <div className={`relative w-full ${className || ''}`}>
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full ${heavy ? 'border-t-2' : 'border-t'} border-gray-200/80`} />
      </div>
      {label && <div className="relative flex justify-center text-sm">
        <span className="px-3 sm:px-4 text-[12px] sm:text-[13px] text-gray-400 bg-white/80 backdrop-blur-sm">{label}</span>
      </div>}
    </div>
  );
};

export default Divider;