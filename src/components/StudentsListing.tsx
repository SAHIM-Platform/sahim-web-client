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
import { fetchStudents, searchStudents, approveStudent, rejectStudent } from "@/services/admin/studentService";

const StudentsListing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadStudents = async (filters?: { status?: ApprovalStatus; query?: string }) => {
    try {
      setIsLoading(true);
      setIsFiltering(!!filters);
      setError(null);

      let result;
      if (filters?.status || filters?.query) {
        result = await searchStudents({
          status: filters.status,
          query: filters.query
        });
        setStudents(result);
      } else {
        result = await fetchStudents();
        if (result.success && result.data) {
          setStudents(result.data.data);
        } else {
          throw new Error(result.error?.message || 'Failed to fetch students');
        }
      }
    } catch (err) {
      console.error('Student loading error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الطلاب';
      setError(`${errorMessage}. حاول مرة أخرى.`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  const handleApprove = async (studentId: number) => {
    try {
      setIsProcessing(true);
      const result = await approveStudent(studentId);
      
      if (result.success) {
        toast.success(result.message || 'تمت الموافقة على الطالب بنجاح');
        await loadStudents({
          status: selectedStatus || undefined,
          query: searchQuery || undefined
        });
      } else if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error('Approve error:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء الموافقة على الطالب';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (studentId: number) => {
    try {
      setIsProcessing(true);
      const result = await rejectStudent(studentId);
      
      if (result.success) {
        toast.success(result.message || 'تم رفض الطالب بنجاح');
        await loadStudents({
          status: selectedStatus || undefined,
          query: searchQuery || undefined
        });
      } else if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error('Reject error:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء رفض الطالب';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery || selectedStatus) {
        loadStudents({
          status: selectedStatus || undefined,
          query: searchQuery || undefined
        });
      } else {
        loadStudents();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedStatus]);

  const handleRetry = () => {
    loadStudents({
      status: selectedStatus || undefined,
      query: searchQuery || undefined
    });
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
      ) : isLoading || isFiltering ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            {searchQuery || selectedStatus ? "لا توجد نتائج للبحث" : "لا يوجد حسابات لطلاب حالياً."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {students
            .sort((a, b) => {
              const aNumber = a.student?.academicNumber || '';
              const bNumber = b.student?.academicNumber || '';
              return sortOrder === "recent"
                ? bNumber.localeCompare(aNumber)
                : aNumber.localeCompare(bNumber);
            })
            .map((student) => (
              <UserCardItem
                key={student.id}
                student={student}
                onApprove={() => handleApprove(Number(student.id))}
                onReject={() => handleReject(Number(student.id))}
                isProcessing={isProcessing}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default StudentsListing;
