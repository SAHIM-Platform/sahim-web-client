import DateBadge from "./Badge/DateBadge";
import UserPhoto from "../UserPhoto";
import { getDisplayName } from "@/utils/getDisplayName";
import { UserRole } from "@/types";
import Link from "next/link";

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
  username?: string;
  linkToProfile?: boolean;
}

function UserInfo({
  name,
  role,
  photoPath,
  date,
  children,
  hideDetailsOnSmallScreens = false,
  size = "default",
  isDeleted = false,
  username,
  linkToProfile = false,
}: UserInfoProps) {
  const isSmall = size === "sm";
  const displayName = isDeleted || !name ? "مستخدم محذوف" : getDisplayName(name);
  const displayPhotoPath = isDeleted ? undefined : photoPath;
  const profileLink = username ? `/${username}` : undefined;

  const content = (
    <>
      <UserPhoto
        name={displayName}
        size={isSmall ? 24 : 32}
        className="ring-2 ring-white"
        photoPath={displayPhotoPath}
        role={role}
      />
      <div
        className={`flex flex-col items-start ${!isSmall ? 'gap-1' : ''} ${hideDetailsOnSmallScreens ? "hidden sm:block" : ""}`}
      >
        <span
          className={`${isSmall ? "text-xs" : "text-[14px]"} font-semibold text-gray-700 leading-none flex items-center gap-1`}
        >
          {displayName}
        </span>
        {date && <DateBadge label={date} size="xs" />}
      </div>
    </>
  );

  return (
    <div className={`flex items-center gap-3`}>
      <div className={`flex items-center ${!isSmall ? 'gap-3' : 'gap-2'}`}>
        {linkToProfile && !isDeleted && profileLink ? (
          <Link href={profileLink} className="flex items-center gap-2 group cursor-pointer">
            {content}
          </Link>
        ) : (
          content
        )}
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
