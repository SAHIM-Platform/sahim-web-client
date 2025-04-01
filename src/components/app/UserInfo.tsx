import Image from "next/image";
import DateBadge from "./Badge/DateBadge";

interface UserInfoProps {
  name: string;
  photo: string;
  date?: string;
  children?: React.ReactNode;
}

function UserInfo({
  name,
  photo,
  date,
  children
}: UserInfoProps) {
  return (
    <button
      className="flex items-center gap-3 pr-2 pl-1 h-9 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Image
        src={photo}
        alt={name}
        width={32}
        height={32}
        objectFit="cover"
        className="rounded-full ring-2 ring-white"
      />
      <div className="flex flex-col items-start gap-1">
        <span className="text-[14px] font-semibold text-gray-700 leading-none">{name}</span>
        {date && <DateBadge label={date} size="sm" />}
      </div>
      {children}
    </button>
  );
}

export default UserInfo;
