import Image from "next/image";
import DateBadge from "./Badge/DateBadge";

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
    <div
      className="flex items-center gap-3"
    >
      {photo && (photoAlt || name) && <Image
        src={photo}
        alt={name as string || photoAlt as string}
        width={32}
        height={32}
        className="rounded-full ring-2 ring-white object-cover"
      />}
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
