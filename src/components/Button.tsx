import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-white border border border-primary hover:bg-primary hover:text-white",
        outline: "bg-transparent border hover:border-primary",
      },
      size: {
        lg: "px-[45PX] py-[15px] text-lg font-semibold",
        default: "px-[30PX] py-[10px] text-sm font-semibold",
        sm: "px-[21PX] py-[7px] text-xs font-semibold",
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false
    }
  }
);

const Button = ({
  children,
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, buttonVariants };
export default Button;