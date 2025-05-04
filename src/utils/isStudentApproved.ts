import { ApprovalStatus } from "@/types";

export function isStudentApproved(approvalStatus: ApprovalStatus | undefined) {
  if (!approvalStatus) return false;
  return approvalStatus === ApprovalStatus.APPROVED;
}