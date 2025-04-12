'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "./Form/ErrorAlert";
import Button from "./Button";
import SearchField from "./app/SearchField";
import Select from "./Select";
import Divider from "./Divider";
import UsersBadge from "./app/Badge/UsersBadge";
import UserCardItem from "./app/UserCardItem";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { Student, ApprovalStatus } from "@/types";
import { fetchStudents, searchStudents } from "@/services/admin/studentService";

interface StudentsListingProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const StudentsListing = ({
  onApprove,
  onReject,
}: StudentsListingProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const loadStudents = async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      if (query) {
        result = await searchStudents(query, selectedStatus || undefined);
      } else {
        result = await fetchStudents(selectedStatus || undefined);
      }

      if (result.success && result.data) {
        setStudents(result.data);
      } else {
        setError(result.error?.message || "فشل تحميل بيانات الطلاب");
        toast.error(result.error?.message || "فشل تحميل بيانات الطلاب");
      }
    } catch (err) {
      setError("فشل تحميل بيانات الطلاب");
      toast.error("فشل تحميل بيانات الطلاب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedStatus]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        loadStudents(searchQuery);
      } else {
        loadStudents();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleRetry = () => {
    loadStudents(searchQuery);
  };

  const statusOptions = [
    { value: "", label: "جميع الحالات" },
    { value: ApprovalStatus.PENDING, label: "قيد الانتظار" },
    { value: ApprovalStatus.APPROVED, label: "تمت الموافقة" },
    { value: ApprovalStatus.REJECTED, label: "مرفوض" },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              جميع الطلاب
            </h1>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
              تصفح جميع حسابات الطلاب المسجلين
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="ابحث عن طالب"
            />

            <div className="w-48">
              <Select
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value as ApprovalStatus || null)}
                placeholder="حالة الموافقة"
                options={statusOptions}
              />
            </div>
          </div>

          <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

          <div className="flex items-center justify-between pt-3 mt-3">
            <UsersBadge>
              <span>
                {students.length}
                {students.length === 1 ? " طالب" : " طلاب"}
              </span>
            </UsersBadge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}
              className="text-[13px] text-gray-600"
              icon={<ArrowUpDown className="w-4 h-4" />}
            >
              {sortOrder === "recent" ? "الأحدث أولاً" : "الأقدم أولاً"}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="space-y-4">
          <ErrorAlert message={error} />
          <Button
            onClick={handleRetry}
            variant="outline"
            icon={<RefreshCw className="w-4" />}
            color="secondary"
          >
            إعادة المحاولة
          </Button>
        </div>
      ) : isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            لا يوجد حسابات لطلاب حالياً.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {students
            .sort((a, b) => {
              const aNumber = a.academicNumber || '';
              const bNumber = b.academicNumber || '';
              return sortOrder === "recent"
                ? bNumber.localeCompare(aNumber)
                : aNumber.localeCompare(bNumber);
            })
            .map((student) => (
              <UserCardItem
                key={student.id}
                onApprove={onApprove}
                onReject={onReject}
                student={student}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default StudentsListing;
