import { X } from "lucide-react";
import Overlay from "../Overlay";
import { useEffect } from "react";
import { cn } from "@/utils/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <div className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl mt-20 p-4 bg-white rounded-xl shadow-xl border border-gray-200 z-[60]",
        sizeClasses[size]
      )}>
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1 hover:bg-gray-200/50 rounded-full"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
        {title && (
          <h2 className="text-xl font-semibold mb-4 pt-2">{title}</h2>
        )}
        <div className={!title ? "pt-12" : undefined}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;