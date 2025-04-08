import DateBadge from "./Badge/DateBadge";
import UserPhoto from "../UserPhoto";

interface UserInfoProps {
  name?: string;
  photo?: string;
  photoAlt?: string;
  date?: string;
  children?: React.ReactNode;
  hideDetailsOnSmallScreens?: boolean;
}

function UserInfo({
  name,
  photo,
  photoAlt,
  date,
  children,
  hideDetailsOnSmallScreens = false,
}: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      {(name || photoAlt) && (
        <UserPhoto
          name={name || photoAlt || ''}
          size={32}
          className="ring-2 ring-white"
        />
      )}
      {(name || photoAlt) && 
      <div className={`flex flex-col items-start gap-1 ${hideDetailsOnSmallScreens ? "hidden sm:block" : ""}`}>
        {name && <span className="text-[14px] font-semibold text-gray-700 leading-none">{name}</span>}
        {date && <DateBadge label={date} size="sm" />}
      </div>}
      {children && (
        <div className={hideDetailsOnSmallScreens? "hidden sm:block" : ""}>
          {children}
        </div>)
      }
    </div>
  );
}

export default UserInfo;
