"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 sm:gap-2.5 font-medium select-none",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
    "rtl:space-x-reverse active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-primary/95 to-primary text-white",
          "hover:from-primary hover:to-primary/95",
          "focus-visible:ring-primary/30",
          "shadow-[0_3px_16px_rgb(var(--color-primary-rgb)/0.25)] hover:shadow-[0_6px_24px_rgb(var(--color-primary-rgb)/0.35)]",
          "border border-transparent"
        ].join(" "),
        secondary: [
          "bg-white text-primary border border-primary/20",
          "hover:bg-primary/5 hover:border-primary/30",
          "focus-visible:ring-primary/30",
          "shadow-sm hover:shadow"
        ].join(" "),
        outline: [
          "bg-white/80 border border-gray-200 text-gray-600",
          "hover:bg-white hover:border-gray-300 hover:text-gray-700",
          "focus-visible:ring-gray-200",
          "shadow-sm hover:shadow"
        ].join(" "),
        ghost: [
          "text-primary bg-transparent",
          "hover:bg-primary/5",
          "focus-visible:ring-primary/30",
        ].join(" "),
        link: [
          "text-primary underline-offset-4 hover:underline",
          "focus-visible:ring-primary/30",
          "p-0 h-auto font-normal"
        ].join(" ")
      },
      size: {
        lg: "h-[46px] sm:h-12 px-5 sm:px-6 py-2 sm:py-3 text-[14px] sm:text-[15px] rounded-xl gap-2.5 sm:gap-3",
        default: "h-[42px] sm:h-11 px-4 sm:px-5 py-2 text-[14px] sm:text-[15px] rounded-lg gap-2 sm:gap-2.5",
        sm: "h-9 px-3 sm:px-4 py-1.5 text-sm rounded-md gap-1.5 sm:gap-2",
        icon: "h-[42px] w-[42px] sm:h-11 sm:w-11 p-2 rounded-lg"
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

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  children,
  className,
  variant,
  size,
  fullWidth,
  isLoading,
  loadingText,
  icon,
  iconPosition = "start",
  href,
  target = "_self",
  ...props
}, ref) => {
  if (href) {
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          isLoading && "cursor-wait",
          className
        )}
        {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            {loadingText && <span className="truncate">{loadingText}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === "start" && (
              <span className="inline-flex shrink-0 text-[1.15em]">{icon}</span>
            )}
            <span className="truncate">{children}</span>
            {icon && iconPosition === "end" && (
              <span className="inline-flex shrink-0 text-[1.15em]">{icon}</span>
            )}
          </>
        )}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        isLoading && "cursor-wait",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
          {loadingText && <span className="truncate">{loadingText}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === "start" && (
            <span className="inline-flex shrink-0 text-[1.15em]">{icon}</span>
          )}
          <span className="truncate">{children}</span>
          {icon && iconPosition === "end" && (
            <span className="inline-flex shrink-0 text-[1.15em]">{icon}</span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;