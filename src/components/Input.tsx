"use client";

import React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Check } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  type?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  success?: boolean;
  startIcon?: React.ReactElement<{ className?: string }>;
  endIcon?: React.ReactElement<{ className?: string }>;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
}

const inputVariants = cva(
  [
    "inline-flex w-full font-medium select-none",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-50",
    "placeholder:text-gray-400 placeholder:font-normal",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "border border-gray-200/80 bg-white text-gray-800",
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
      inputSize: {
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
      inputSize: "default",
      fullWidth: true
    }
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  type = "text", 
  placeholder, 
  className,
  variant,
  inputSize,
  fullWidth,
  label,
  error,
  success,
  startIcon,
  endIcon,
  helperText,
  required,
  optional,
  ...props 
}, ref) => {
  const showSuccessIcon = success && !error && !endIcon;
  const showErrorIcon = error && !endIcon;

  const getIconStyles = (isStart = true) => cn(
    "text-gray-400 transition-colors",
    isStart ? "group-hover:text-gray-500" : "hover:text-gray-600"
  );

  return (
    <div className="w-full space-y-1.5 sm:space-y-2" dir="rtl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-[12px] sm:text-[13px] font-medium text-gray-600">
            {label}
            {required && <span className="text-red-500/70 mr-1 text-[10px] sm:text-xs">*</span>}
          </label>
          {optional && (
            <span className="text-[11px] sm:text-xs text-gray-400">اختياري</span>
          )}
        </div>
      )}
      <div className="relative group">
        {startIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
            {React.cloneElement(startIcon, {
              className: cn("w-[18px] h-[18px]", getIconStyles(true), startIcon.props?.className)
            })}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            inputVariants({ 
              variant: error ? "error" : success ? "success" : variant, 
              inputSize, 
              fullWidth 
            }),
            startIcon && "pr-10 sm:pr-11",
            (endIcon || showSuccessIcon || showErrorIcon) && "pl-10 sm:pl-11",
            className
          )}
          placeholder={placeholder}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          required={required}
          {...props}
        />
        {(endIcon || showSuccessIcon || showErrorIcon) && (
          <div className={cn(
            "absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4",
            endIcon && "cursor-pointer"
          )}>
            {endIcon ? (
              React.cloneElement(endIcon, {
                className: cn("w-[18px] h-[18px]", getIconStyles(false), endIcon.props?.className)
              })
            ) : showSuccessIcon ? (
              <Check className="w-[18px] h-[18px] text-green-500" />
            ) : showErrorIcon ? (
              <AlertCircle className="w-[18px] h-[18px] text-red-500/70" />
            ) : null}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p 
          className={cn(
            "text-[11px] sm:text-xs transition-colors",
            error ? "text-red-500/70" : "text-gray-400"
          )}
          id={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input, inputVariants };
export default Input;
