import DateBadge from "./Badge/DateBadge";
import UserPhoto from "../UserPhoto";
import { getDisplayName } from "@/utils/getDisplayName";
import { UserRole } from "@/types";
interface UserInfoProps {
  name?: string;
  photoPath?: string;
  photoAlt?: string;
  date?: string;
  children?: React.ReactNode;
  hideDetailsOnSmallScreens?: boolean;
  size?: "default" | "sm";
  role?: UserRole;
  isDeleted?: boolean;
}

function UserInfo({
  name,
  role,
  photoPath,
  photoAlt,
  date,
  children,
  hideDetailsOnSmallScreens = false,
  size = "default",
  isDeleted = false,
}: UserInfoProps) {
  const isSmall = size === "sm";
  const displayName = isDeleted ? "مستخدم محذوف" : name || photoAlt || '';
  const displayPhotoPath = isDeleted ? undefined : photoPath;

  return (
    <div className={`flex items-center gap-3`}>
      <div className={`flex items-center ${!isSmall ? 'gap-3' : 'gap-2'}`}>
        <UserPhoto
          name={displayName}
          size={isSmall ? 24 : 32}
          className="ring-2 ring-white"
          photoPath={displayPhotoPath}
          role={role}
        />
        <div
          className={`flex flex-col items-start ${!isSmall ? 'gap-1' : ''} ${hideDetailsOnSmallScreens ? "hidden sm:block" : ""
            }`}
        >
          <span
            className={`${isSmall ? "text-xs" : "text-[14px]"
              } font-semibold text-gray-700 leading-none`}
          >
            {displayName}
          </span>
          {date && <DateBadge label={date} size="xs" />}
        </div>
      </div>
      {children && (
        <div className={hideDetailsOnSmallScreens ? "hidden sm:block" : ""}>
          {children}
        </div>
      )}
    </div>
  );
}

export default UserInfo;
