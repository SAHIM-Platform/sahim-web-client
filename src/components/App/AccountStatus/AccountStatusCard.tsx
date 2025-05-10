import { Info, PartyPopper, Clock, AlertCircle } from "lucide-react";
import { ApprovalStatus } from "@/types";

interface StatusVariant {
  icon: React.ReactNode;
  title: string;
  description?: string;
  className: string;
}

interface AccountStatusCardProps {
  approvalStatus: ApprovalStatus;
}

const STATUS_VARIANTS: Record<ApprovalStatus, StatusVariant> = {
  [ApprovalStatus.APPROVED]: {
    icon: <Info className="text-primary w-10 h-10" />,
    title: "تم قبول طلب تسجيل حسابك",
    className: "border-blue-200 bg-blue-50",
  },
  [ApprovalStatus.PENDING]: {
    icon: <Clock className="text-amber-500 w-10 h-10" />,
    title: "طلب تسجيل حسابك قيد المراجعة",
    description: "قد تستغرق عملية التحقق بعض الوقت. يمكنك الضغط على زر التحديث للتحقق من حالة طلبك، أو العودة لاحقاً.\nللاستفسار عن تفاصيل عملية التحقق، يرجى التواصل مع الدعم الفني.",
    className: "border-amber-200 bg-amber-50",
  },
  [ApprovalStatus.REJECTED]: {
    icon: <AlertCircle className="text-red-500 w-10 h-10" />,
    title: "تم رفض طلب تسجيل حسابك",
    description: "يمكنك الضغط على زر التحديث للتحقق من حالة طلبك، أو العودة لاحقاً.\nللاستفسار عن أسباب الرفض وتفاصيل عملية التحقق، يرجى التواصل مع الدعم الفني.",
    className: "border-red-200 bg-red-50",
  },
};

export default function AccountStatusCard({ approvalStatus }: AccountStatusCardProps) {
  const variant = STATUS_VARIANTS[approvalStatus];

  return (
    <div className={`rounded-xl border p-8 w-full shadow-sm ${variant.className}`}>
      <div className="flex flex-col items-center space-y-4">
        {variant.icon}
        <p className="text-gray-500 text-md">حالة الحساب</p>
        <div className="flex gap-2">
          <h1 className="text-xl font-semibold text-gray-800">{variant.title}</h1>
          {approvalStatus === ApprovalStatus.APPROVED && <PartyPopper />}
        </div>
        {variant.description && (
          <p className="text-gray-500 text-sm whitespace-pre-line">
            {variant.description}
          </p>
        )}
      </div>
    </div>
  );
} 