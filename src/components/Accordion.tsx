'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isLast?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false, className, isLast }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "bg-white rounded-xl shadow-sm transition-all duration-200 cursor-pointer",
        "hover:shadow-md border border-gray-100",
        !isLast && "mb-5",
        className
      )}
    >
      <div
        className="flex items-center justify-between w-full p-4 sm:p-5 text-right"
        role="button"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-semibold text-gray-900">{title}</span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ease-out shrink-0",
            isOpen && "transform rotate-180"
          )} 
        />
      </div>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm sm:text-base text-gray-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          defaultOpen={index === 0}
          isLast={index === items.length - 1}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
} 