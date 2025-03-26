"use client";

import { cn } from "@/utils/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("w-full max-w-screen-2xl mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;