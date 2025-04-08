import React from "react";

interface UserCardItemProps {
  student: {
    id: number;
    fullName: string;
    academicNumber: string;
    studyLevel: string;
    department: string;
  };
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const UserCardItem: React.FC<UserCardItemProps> = ({
  student,
  onApprove,
  onReject,
}) => {
  return (
    <div className="border rounded-xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
        <p className="text-sm text-gray-600">الرقم الأكاديمي: {student.academicNumber}</p>
        <p className="text-sm text-gray-600">المستوى الدراسي: {student.studyLevel}</p>
        <p className="text-sm text-gray-600">القسم: {student.department}</p>
      </div>

      <div className="flex gap-2 sm:mt-0 mt-2">
        <button
          onClick={() => onApprove(student.id)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          ✅ موافقة
        </button>
        <button
          onClick={() => {
            if (confirm("هل أنت متأكد من رفض الطالب؟")) {
              onReject(student.id);
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          ❌ رفض
        </button>
      </div>
    </div>
  );
};

export default UserCardItem;
