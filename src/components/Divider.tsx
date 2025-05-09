"use client";

import { cn } from "@/utils/utils";

interface DividerProps {
  label?: string;
  heavy?: boolean;
  className?: string;
  borderColor?: string;
}

const Divider = ({ heavy, className, label = 'أو', borderColor }: DividerProps) => {
  return (
    <div className={`relative w-full ${className || ''}`}>
      <div className="absolute inset-0 flex items-center">
        <div className={cn(
          'w-full',
          heavy ? 'border-t-2' : 'border-t',
          borderColor && `border-${borderColor}`
        )} />
      </div>
      {label && <div className="relative flex justify-center text-sm">
        <span className="px-3 sm:px-4 text-[12px] sm:text-[13px] text-gray-400 bg-white/80 backdrop-blur-sm">{label}</span>
      </div>}
    </div>
  );
};

export default Divider;