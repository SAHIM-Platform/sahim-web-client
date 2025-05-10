import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={tooltipRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md whitespace-nowrap",
            "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2",
            "after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2",
            "after:border-4 after:border-transparent after:border-t-gray-800",
            "shadow-lg",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 