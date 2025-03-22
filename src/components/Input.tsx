import React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  type?: string;
  placeholder?: string;
  className?: string;
}

const inputVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none placeholder:text-base placeholder:font-light",
  {
    variants: {
      variant: {
        primary: "border border-gray-300 bg-transparent text-right",
        error: "border-red-500 bg-transparent text-right",
      },
      inputSize: {
        default: "px-[30PX] py-[10px] text-lg",
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

const Input: React.FC<InputProps> = ({ 
  type = "text", 
  placeholder, 
  className,
  variant,
  inputSize,
  fullWidth,
  ...props 
}) => {
  return (
    <input
      type={type}
      className={cn(
        inputVariants({ variant, inputSize, fullWidth }),
        className
      )}
      placeholder={placeholder}
      {...props}
    />
  );
};

export { Input, inputVariants };
export default Input;
