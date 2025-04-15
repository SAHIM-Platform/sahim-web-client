'use client';

import Button from "../Button";
import { Check, X, Trash2 } from "lucide-react";
import { Admin, Student, ApprovalStatus } from "@/types";
import DateBadge from "./Badge/DateBadge";

interface UserCardItemProps {
  student?: Student;
  admin?: Admin;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const UserCardItem = ({
  student,
  admin,
  onApprove,
  onReject,
  onDelete,
  isDeleting,
}: UserCardItemProps) => {
  const handleApprove = () => {
    if (student && onApprove) {
      onApprove(student.id);
    }
  };

  const handleReject = () => {
    if (student && onReject) {
      const confirmed = window.confirm("هل أنت متأكد من رفض الطالب؟");
      if (confirmed) {
        onReject(student.id);
      }
    }
  };

  const handleDelete = () => {
    if (admin && onDelete) {
      const confirmed = window.confirm("هل أنت متأكد من حذف المشرف؟");
      if (confirmed) {
        onDelete(admin.id);
      }
    }
  };

  const handleEdit = () => {
    return;
  };

  const getStatusText = (status: ApprovalStatus) => {
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

  const getStatusColor = (status: ApprovalStatus) => {
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
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 p-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <h3 className="text-base font-semibold text-gray-900">{student.name}</h3>
          <p className="font-light">الرقم الأكاديمي: <span className="font-normal">{student.academicNumber}</span></p>
          <p className="font-light">المستوى الدراسي: <span className="font-normal">{student.level}</span></p>
          <p className="font-light">القسم: <span className="font-normal">{student.department}</span></p>
          <p className="font-light">حالة الموافقة: <span className={`font-normal ${getStatusColor(student.approvalStatus)}`}>{getStatusText(student.approvalStatus)}</span></p>
        </div>

        {student.approvalStatus === ApprovalStatus.PENDING && (
          <div className="flex items-center gap-2 sm:mt-0 mt-3">
            <Button
              onClick={handleApprove}
              size="sm"
              icon={<Check className="w-4 h-4" />}
            >
              موافقة
            </Button>

            <Button
              onClick={handleReject}
              variant="outline"
              size="sm"
              color="secondary"
              icon={<X className="w-4 h-4" />}
              className="text-red-600 hover:border-red-700 hover:text-red-600 hover:shadow-none"
            >
              رفض
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Render admin card
  if (admin) {
    return (
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
    );
  }

  return null;
};

export default UserCardItem;
