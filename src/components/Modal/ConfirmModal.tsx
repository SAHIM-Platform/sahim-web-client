import Modal from "./Modal";
import Button from "../Button";
import { Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "danger" | "secondary";
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
            className="bg-red-600 hover:bg-red-700 hover:shadow-none"
            icon={<Trash2 className="w-4 h-4" />}
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