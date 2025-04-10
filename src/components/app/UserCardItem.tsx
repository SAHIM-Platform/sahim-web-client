'use client';

import Button from "../Button";
import { Check, X, Trash2 } from "lucide-react";
import { Admin, Student } from "@/types";

interface UserCardItemProps {
  student?: Student;
  admin?: Admin;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const UserCardItem = ({
  student,
  admin,
  onApprove,
  onReject,
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

  const handleEdit = () => {
    return;
  };

  const handleDelete = () => {
    return;
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
        </div>

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
      </div>
    );
  }

  // Render admin card
  if (admin) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 p-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <h3 className="text-base font-semibold text-gray-900">{admin.name}</h3>
          <p className="font-light">اسم المستخدم: <span className="font-normal">{admin.username}</span></p>
          <p className="font-light">البريد الإلكتروني: <span className="font-normal">{admin.email}</span></p>
          <p className="font-light">تاريخ الإنشاء: <span className="font-normal">{admin.created_at}</span></p>
        </div>

        <div className="flex items-center gap-2 sm:mt-0 mt-3">
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            color="secondary"
            icon={<Trash2 className="w-4 h-4" />}
            className="text-red-600 hover:border-red-100 hover:bg-red-50 border border-red-50 hover:shadow-none"
          >
            حذف
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default UserCardItem;
