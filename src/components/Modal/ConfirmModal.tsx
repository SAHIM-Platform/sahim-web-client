import Modal from "./Modal";
import Button from "../Button";
import { Trash2, Check } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "danger" | "secondary" | "success";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد العملية",
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  confirmButtonVariant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const getButtonIcon = () => {
    switch (confirmButtonVariant) {
      case "danger":
        return <Trash2 className="w-4 h-4" />;
      case "success":
        return <Check className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getButtonClassName = () => {
    switch (confirmButtonVariant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 hover:shadow-none";
      case "success":
        return "";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        <p className="text-gray-600">{message}</p>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className={getButtonClassName()}
            icon={getButtonIcon()}
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="جاري التنفيذ..."
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 