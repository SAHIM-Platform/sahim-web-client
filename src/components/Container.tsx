"use client";

import { cn } from "@/utils/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  medium?: boolean;
}

const Container = ({ children, className, narrow, medium }: ContainerProps) => {
  return (
    <div className={cn(
      "w-full mx-auto",
      narrow ? "max-w-[700px]" : (medium ? "max-w-[1024px] px-4" : "max-w-screen-2xl"),
      className
    )}>
      {children}
    </div>
  );
};

export default Container;