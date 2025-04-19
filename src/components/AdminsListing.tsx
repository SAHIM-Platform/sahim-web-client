'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "./Form/ErrorAlert";
import Button from "./Button";
import SearchField from "./app/SearchField";
import Divider from "./Divider";
import UsersBadge from "./app/Badge/UsersBadge";
import UserCardItem from "./app/UserCardItem";
import { ArrowUpDown, RefreshCw, UserPlus } from "lucide-react";
import { Admin } from "@/types";
import { adminService } from "@/services/admin/adminService";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";

export default function AdminsListing() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.getAdmins();
      
      if (!result.success) {
        const errorMessage = ERROR_MESSAGES.adminListing.DEFAULT;
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setAdmins(result.data || []);
    } catch {
      setError(ERROR_MESSAGES.adminListing.LOAD_FAILED);
      toast.error(ERROR_MESSAGES.adminListing.LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const result = await adminService.deleteAdmin(id);

      if (!result.success) {
        toast.error(ERROR_MESSAGES.adminListing.DELETE_FAILED);
        return;
      }

      toast.success("تم حذف المشرف بنجاح");
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch {
      toast.error(ERROR_MESSAGES.adminListing.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleRetry = () => {
    loadAdmins();
  };

  const processedAdmins = admins.filter((admin) => {
    const matchesSearch = searchQuery
      ? admin.name.includes(searchQuery) ||
      admin.email.includes(searchQuery) ||
      admin.username.includes(searchQuery)
      : true;

    return matchesSearch;
  });

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
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
              جميع المشرفين
            </h1>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
              تصفح جميع حسابات المشرفين
            </p>
          </div>
          <Button
            href="/admin/new"
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-5 h-5" />}
            className="shadow-sm"
          >
            إضافة مشرف جديد
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <SearchField
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="ابحث عن مشرف"
          />

          <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

          <div className="flex items-center justify-between pt-3 mt-3">
            <UsersBadge>
              <span>
                {processedAdmins.length}
                {processedAdmins.length === 1 ? " مشرف" : " مشرفين"}
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

      {processedAdmins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            لا يوجد حسابات لمشرفين حالياً.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {processedAdmins
            .sort((a, b) => {
              const dateA = new Date(a.created_at || 0);
              const dateB = new Date(b.created_at || 0);
              return sortOrder === "recent"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
            })
            .map((admin) => (
              <UserCardItem
                key={admin.id}
                admin={admin}
                onDelete={() => handleDeleteAdmin(admin.id)}
                isDeleting={isDeleting}
                isProcessing={isDeleting}
              />
            ))}
        </div>
      )}
    </div>
  );
} 