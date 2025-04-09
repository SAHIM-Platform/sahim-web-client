import DateBadge from "./Badge/DateBadge";
import UserPhoto from "../UserPhoto";
import { getDisplayName } from "@/utils/getDisplayName";

interface UserInfoProps {
  name?: string;
  photo?: string;
  photoAlt?: string;
  date?: string;
  children?: React.ReactNode;
  hideDetailsOnSmallScreens?: boolean;
  size?: "default" | "sm";
}

function UserInfo({
  name,
  photo,
  photoAlt,
  date,
  children,
  hideDetailsOnSmallScreens = false,
  size = "default",
}: UserInfoProps) {
  const isSmall = size === "sm";

  return (
    <div className={`flex items-center gap-3`}>
      <div className={`flex items-center ${!isSmall ? 'gap-3' : 'gap-2'}`}>
        {(name || photoAlt) && (
          <UserPhoto
            name={name || photoAlt || ''}
            size={isSmall ? 24 : 32}
            className="ring-2 ring-white"
          />
        )}
        {(name || photoAlt) && (
          <div
            className={`flex flex-col items-start ${!isSmall ? 'gap-1' : ''} ${hideDetailsOnSmallScreens ? "hidden sm:block" : ""
              }`}
          >
            {name && (
              <span
                className={`${isSmall ? "text-xs" : "text-[14px]"
                  } font-semibold text-gray-700 leading-none`}
              >
                {getDisplayName(name)}
              </span>
            )}
            {date && <DateBadge label={date} size="xs" />}
          </div>
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
