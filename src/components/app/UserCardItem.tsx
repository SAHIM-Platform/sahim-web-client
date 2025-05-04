'use client';

import { useState } from "react";
import Button from "../Button";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { Admin, Student, ApprovalStatus } from "@/types";
import DateBadge from "./Badge/DateBadge";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import toast from "react-hot-toast";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

interface UserCardItemProps {
  student?: Student;
  admin?: Admin;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onDelete?: () => Promise<void>;
  isProcessing: boolean;
}

const UserCardItem = ({
  student,
  admin,
  onApprove,
  onReject,
  onDelete,
  isProcessing,
}: UserCardItemProps) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAction = async (type: "approve" | "reject") => {
    setActionType(type);
    try {
      if (type === "approve" && student && onApprove) {
        await onApprove(Number(student.id));
        setIsApproveModalOpen(false);
      } else if (type === "reject" && student && onReject) {
        await onReject(Number(student.id));
        setIsRejectModalOpen(false);
      }
    } finally {
      setActionType(null);
    }
  };

  const isActionLoading = (type: "approve" | "reject") => isProcessing && actionType === type;

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete();
      }
    } catch {
      toast.error(RESPONSE_MESSAGES.comment.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleDelete = () => {
    if (!admin && onDelete) {
      toast.error(RESPONSE_MESSAGES.comment.FORBIDDEN);
      return;
    }
    setIsDeleting(false);
    setIsDeleteModalOpen(true);
  };

  const getStatusText = (status?: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING:
        return "قيد الانتظار";
      case ApprovalStatus.APPROVED:
        return "تمت الموافقة";
      case ApprovalStatus.REJECTED:
        return "مرفوض";
      default:
        return "غير معروف";
    }
  };

  const getStatusColor = (status?: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING:
        return "text-amber-500";
      case ApprovalStatus.APPROVED:
        return "text-primary";
      case ApprovalStatus.REJECTED:
        return "text-red-600";
      default:
        return "";
    }
  };

  // Render student card
  if (student) {
    return (
      <>
        <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 p-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <h3 className="text-base font-semibold text-gray-900">{student.name}</h3>
            <p className="font-light">الرقم الأكاديمي: <span className="font-normal">{student.student?.academicNumber}</span></p>
            <p className="font-light">المستوى الدراسي: <span className="font-normal">{student.student?.studyLevel}</span></p>
            <p className="font-light">القسم: <span className="font-normal">{student.student?.department}</span></p>
            <p className="font-light">حالة الموافقة: <span className={`font-normal ${getStatusColor(student.student?.approvalStatus)}`}>{getStatusText(student.student?.approvalStatus)}</span></p>
          </div>

          {student.student?.approvalStatus === ApprovalStatus.PENDING && (
            <div className="flex items-center gap-2 sm:mt-0 mt-3">
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                size="sm"
                icon={isActionLoading("approve") ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                disabled={isProcessing}
              >
                {isActionLoading("approve") ? "جاري الموافقة..." : "موافقة"}
              </Button>

              <Button
                onClick={() => setIsRejectModalOpen(true)}
                variant="outline"
                size="sm"
                color="secondary"
                icon={isActionLoading("reject") ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                className="text-red-600 hover:border-red-700 hover:text-red-600 hover:shadow-none"
                disabled={isProcessing}
              >
                {isActionLoading("reject") ? "جاري الرفض..." : "رفض"}
              </Button>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={() => handleAction("approve")}
          title="تأكيد الموافقة"
          message="هل أنت متأكد من الموافقة على هذا الطالب؟"
          confirmText="موافقة"
          confirmButtonVariant="success"
          isLoading={isActionLoading("approve")}
        />

        <ConfirmModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={() => handleAction("reject")}
          title="تأكيد الرفض"
          message="هل أنت متأكد من رفض هذا الطالب؟"
          confirmText="رفض"
          confirmButtonVariant="danger"
          isLoading={isActionLoading("reject")}
        />
      </>
    );
  }

  // Render admin card
  if (admin) {
    return (
      <>
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 p-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 text-sm text-gray-700">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-gray-900">{admin.name}</h3>
            <DateBadge label={admin.created_at} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-light">اسم المستخدم: <span className="font-normal">{admin.username}</span></p>
            <p className="font-light">البريد الإلكتروني: <span className="font-normal">{admin.email}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:mt-0 mt-3">
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            color="secondary"
            icon={<Trash2 className="w-4 h-4" />}
            className="text-red-600 hover:border-red-100 hover:bg-red-50 border border-red-50 hover:shadow-none"
            disabled={isDeleting}
          >
            {isDeleting ? "جاري الحذف..." : "حذف"}
          </Button>
        </div>
      </div>
      <ConfirmModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleDeleteConfirm}
      title="حذف مشرف"
      message="هل أنت متأكد من حذف المشرف؟"
      confirmText="حذف"
      confirmButtonVariant="danger"
      isLoading={isDeleting}
    />
    </>
    );
  }

  return null;
};

export default UserCardItem;
