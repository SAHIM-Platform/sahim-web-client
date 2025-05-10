import { Crown, GraduationCap, Shield, Building2, Trash2 } from "lucide-react";
import { UserRole, Department, userRoleLabels, departmentLabels } from "@/types";
import { cn } from "@/utils/utils";
import Tooltip from "@/components/Tooltip";

interface AuthorRoleBadgeProps {
  role?: UserRole;
  department?: Department;
  className?: string;
  isDeleted?: boolean;
}

const AuthorRoleBadge = ({ role, department, className, isDeleted }: AuthorRoleBadgeProps) => {
  if (isDeleted) {
    return (
      <Tooltip content="مستخدم محذوف">
        <Trash2 className="w-3.5 h-3.5 text-red-400" />
      </Tooltip>
    );
  }
  if (!role) return null;

  const getRoleIcon = () => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />;
      case UserRole.ADMIN:
        return <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />;
      case UserRole.STUDENT:
        return <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-start gap-2 sm:gap-2.5", className)}>
      <Tooltip content={userRoleLabels[role]}>
        <div className="flex items-center">
          {getRoleIcon()}
        </div>
      </Tooltip>
      {role === UserRole.STUDENT && department && (
        <Tooltip content={departmentLabels[department]}>
          <div className="flex items-center">
            <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default AuthorRoleBadge; 