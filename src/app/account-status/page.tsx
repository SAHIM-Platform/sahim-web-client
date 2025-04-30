"use client";

import useStudentGuard from "@/hooks/useStudentGuard";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import useLogout from "@/hooks/useLogout";
import AccountStatusNavbar from "@/components/app/AccountStatus/AccountStatusNavbar";
import AccountStatusCard from "@/components/app/AccountStatus/AccountStatusCard";
import AccountStatusActions from "@/components/app/AccountStatus/AccountStatusActions";
import AccountStatusFooter from "@/components/app/AccountStatus/AccountStatusFooter";
import { ApprovalStatus } from "@/types";

export default function AccountStatusPage() {
  const isLoading = useStudentGuard();
  const { auth } = useAuth();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const router = useRouter();

  if (isLoading) {
    return (
      <LoadingSpinner size="xl" color="primary" fullScreen={true} />
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = () => {
    window.location.reload();
    router.refresh();
  };

  // Default to PENDING if approvalStatus is undefined
  const approvalStatus = auth.user?.approvalStatus ?? ApprovalStatus.PENDING;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AccountStatusNavbar onLogout={handleLogout} isLoggingOut={isLoggingOut} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Container narrow>
          <div className="flex flex-col gap-8 items-center justify-center w-full">
            <AccountStatusCard approvalStatus={approvalStatus} />
            <AccountStatusActions 
              approvalStatus={approvalStatus} 
              onRefresh={handleRefresh}
            />
          </div>
        </Container>

        <AccountStatusFooter />
      </div>
    </div>
  );
}