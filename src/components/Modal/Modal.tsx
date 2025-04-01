import { X } from "lucide-react";
import Overlay from "../Overlay";
import { useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl mt-20 p-4 bg-white rounded-xl shadow-xl border border-gray-200 z-[60]">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1 hover:bg-gray-200/50 rounded-full"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
        <div className="pt-12">
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;