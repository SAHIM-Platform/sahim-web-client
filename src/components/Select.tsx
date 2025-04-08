"use client";

import React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>, VariantProps<typeof selectVariants> {
  options: Option[];
  label?: string;
  error?: string;
  success?: boolean;
  startIcon?: React.ReactElement<{ className?: string }>;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
}

const selectVariants = cva(
  [
    "inline-flex w-full font-medium select-none appearance-none cursor-pointer",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-50",
    "placeholder:text-gray-400 placeholder:font-normal",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "border bg-white text-gray-800",
          "hover:border-gray-300 hover:bg-white",
          "focus-visible:border-primary/60 focus-visible:ring-primary/20 focus-visible:bg-white",
          "shadow-sm",
        ].join(" "),
        error: [
          "border border-red-500/40 bg-white text-gray-800",
          "hover:border-red-500/60 hover:bg-white",
          "focus-visible:border-red-500/60 focus-visible:ring-red-500/20 focus-visible:bg-white",
          "shadow-sm shadow-red-500/5",
        ].join(" "),
        success: [
          "border border-green-500/40 bg-white text-gray-800",
          "hover:border-green-500/60 hover:bg-white",
          "focus-visible:border-green-500/60 focus-visible:ring-green-500/20 focus-visible:bg-white",
          "shadow-sm shadow-green-500/5",
        ].join(" "),
      },
      selectSize: {
        lg: "h-[46px] sm:h-12 px-4 sm:px-5 py-2 sm:py-3 text-[14px] sm:text-[15px] rounded-xl",
        default: "h-[42px] sm:h-11 px-3 sm:px-4 py-2 text-[14px] sm:text-[15px] rounded-lg",
        sm: "h-9 px-3 py-1.5 text-sm rounded-md",
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }  
    },
    defaultVariants: {
      variant: "primary",
      selectSize: "default",
      fullWidth: true
    }
  }
);

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ 
  options,
  className,
  variant,
  selectSize,
  fullWidth,
  label,
  error,
  success,
  startIcon,
  helperText,
  required,
  optional,
  placeholder,
  ...props 
}, ref) => {
  const StartIcon = startIcon && React.cloneElement(startIcon, {
    className: cn(
      "text-gray-400 transition-colors",
      "group-hover:text-gray-500",
      startIcon.props.className
    ),
  });

  return (
    <div className="w-full space-y-1.5 sm:space-y-2" dir="rtl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[12px] sm:text-[13px] font-medium text-gray-600">
            {label}
            {required && <span className="text-red-500/70 mr-1 text-[10px] sm:text-xs">*</span>}
            {optional && <span className="text-gray-400 mr-1 text-[10px] sm:text-xs">(اختياري)</span>}
          </label>
        </div>
      )}
      
      <div className="relative group">
        {startIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
            {StartIcon}
          </div>
        )}
        
        <select
          ref={ref}
          className={cn(
            selectVariants({ variant: error ? "error" : success ? "success" : variant, selectSize, fullWidth }),
            startIcon && "pr-10 sm:pr-12",
            "pl-10",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="hidden">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {(error || helperText) && (
        <p className={cn(
          "text-[12px] sm:text-[13px]",
          error ? "text-red-500" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
