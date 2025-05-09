import { useAuth } from "@/hooks";
import { ApprovalStatus, UserRole } from "@/types";

export function useCurrentUserInfo() {
  const { auth } = useAuth();
  const userName = auth.user?.name || "مستخدم";
  const username = auth.user?.username;
  const role: UserRole | undefined = auth.user?.role;
  const photoPath = auth.user?.photoPath;
  const approvalStatus: ApprovalStatus | undefined = auth.user?.approvalStatus;

  return {
    userName,
    username,
    role,
    photoPath,
    approvalStatus,
  }
}