"use client";

import { cn } from "@/utils/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

const Container = ({ children, className, narrow }: ContainerProps) => {
  return (
    <div className={cn(
      "w-full mx-auto",
      narrow ? "max-w-[800px]" : "max-w-screen-2xl",
      className
    )}>
      {children}
    </div>
  );
};

export default Container;