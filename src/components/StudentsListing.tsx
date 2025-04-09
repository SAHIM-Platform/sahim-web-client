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
import { ArrowUpDown, RefreshCw, MessageSquare } from "lucide-react";
import { mockStudents } from "@/data/mock-api";
import { Student, departmentLabels } from "@/types";

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
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((res) => setTimeout(res, 500));

      setStudents(mockStudents);
    } catch (err) {
      setError("فشل تحميل بيانات الطلاب");
      toast.error("فشل تحميل بيانات الطلاب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleRetry = () => {
    loadStudents();
  };

  const departmentOptions = [
    { value: "", label: "كل الأقسام" },
    ...Object.entries(departmentLabels).map(([key, label]) => ({
      value: key,
      label,
    })),
  ];

  const processedStudents = students.filter((student) => {
    const matchesSearch = searchQuery
      ? student.name.includes(searchQuery) ||
        student.academicNumber.includes(searchQuery)
      : true;

    const matchesDepartment = selectedDepartment
      ? student.department === selectedDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  if (error) {
    return (
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
    );
  }

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
                value={selectedDepartment || ""}
                onChange={(e) => setSelectedDepartment(e.target.value || null)}
                placeholder="اختر القسم"
                options={departmentOptions}
              />
            </div>
          </div>

          <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

          <div className="flex items-center justify-between pt-3 mt-3">
            <UsersBadge>
              <span>
                {processedStudents.length}
                {processedStudents.length === 1 ? " طالب" : " طلاب"}
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

      {processedStudents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            لا يوجد حسابات لطلاب حالياً.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {processedStudents
            .sort((a, b) => {
              return sortOrder === "recent"
                ? b.academicNumber.localeCompare(a.academicNumber)
                : a.academicNumber.localeCompare(b.academicNumber);
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
