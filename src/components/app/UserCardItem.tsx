'use client';

import Button from "../Button";
import { Check, X } from "lucide-react";
import { Student } from "@/types";

interface UserCardItemProps {
  student: Student;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const UserCardItem: React.FC<UserCardItemProps> = ({
  student,
  onApprove,
  onReject,
}) => {
  const handleApprove = () => {
    onApprove(student.id);
  };

  const handleReject = () => {
    const confirmed = window.confirm("هل أنت متأكد من رفض الطالب؟");
    if (confirmed) {
      onReject(student.id);
    }
  };

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
          icon={<Check className="w-5 h-5" />}
        >
          موافقة
        </Button>

        <Button
          onClick={handleReject}
          variant="outline"
          size="sm"
          color="secondary"
          icon={<X className="w-5 h-5" />}
          className="text-red-600 hover:border-red-700 hover:text-red-600 hover:shadow-none"
        >
          رفض
        </Button>
      </div>
    </div>
  );
};

export default UserCardItem;
