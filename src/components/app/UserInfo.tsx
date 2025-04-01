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
      className="flex items-center gap-2 pr-2 pl-1 h-9 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Image
        src={photo}
        alt={name}
        width={32}
        height={32}
        objectFit="cover"
        className="rounded-full ring-2 ring-white"
      />
      <div className="space-y-1">
        <span className="text-[14px] font-medium text-gray-700">{name}</span>
        {date && <DateBadge label={date} />}
      </div>
      {children}
    </button>
  );
}

export default UserInfo;
