import Image from "next/image";
import { cn } from "@/utils/utils";
import { UserRole } from "@/types";
import { getUserAvatar } from "@/utils/getUserAvatar";

interface UserPhotoProps {
  name: string;
  size?: number;
  className?: string;
  photoPath?: string;
  role?: UserRole;
}

function UserPhoto({ name, size = 40, className, photoPath, role }: UserPhotoProps) {
  return (
    <div className={cn("relative rounded-full overflow-hidden", className)}>
      <Image
        src={getUserAvatar(photoPath, role)}
        alt={name}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
}

export default UserPhoto; 