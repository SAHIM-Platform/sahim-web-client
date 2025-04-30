import Button from "@/components/Button";
import { ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { ApprovalStatus } from "@/types";
import { FrontendRoutes } from "@/data/routes";

interface ActionVariant {
  primaryButton: {
    icon: React.ReactNode;
    text: string;
    href: string;
  };
  showRefreshButton?: boolean;
}

interface AccountStatusActionsProps {
  approvalStatus: ApprovalStatus;
  onRefresh: () => void;
}

const ACTION_VARIANTS: Record<ApprovalStatus, ActionVariant> = {
  [ApprovalStatus.APPROVED]: {
    primaryButton: {
      icon: <ArrowLeft className="w-5 h-5" />,
      text: "المتابعة إلى الصفحة الرئيسية",
      href: `${FrontendRoutes.Explore}`,
    },
  },
  [ApprovalStatus.PENDING]: {
    primaryButton: {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "التواصل مع الدعم الفني",
      href: `${FrontendRoutes.Support}`,
    },
    showRefreshButton: true,
  },
  [ApprovalStatus.REJECTED]: {
    primaryButton: {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "التواصل مع الدعم الفني",
      href: `${FrontendRoutes.Support}`,
    },
    showRefreshButton: true,
  },
};

export default function AccountStatusActions({ approvalStatus, onRefresh }: AccountStatusActionsProps) {
  const variant = ACTION_VARIANTS[approvalStatus];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
      {variant.showRefreshButton && (
        <Button
          size="lg"
          variant="outline"
          icon={<RefreshCw className="w-5 h-5" />}
          iconPosition="end"
          onClick={onRefresh}
          className="w-full md:w-auto"
        >
          تحديث حالة الحساب
        </Button>
      )}

      <Button
        size="lg"
        icon={variant.primaryButton.icon}
        iconPosition="end"
        href={variant.primaryButton.href}
        className="w-full md:w-auto"
      >
        {variant.primaryButton.text}
      </Button>
    </div>
  );
} 