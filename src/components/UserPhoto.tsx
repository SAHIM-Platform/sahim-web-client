import Image from "next/image";
import { cn } from "@/utils/utils";

interface UserPhotoProps {
  name: string;
  size?: number;
  className?: string;
  photoPath?: string;
}

function UserPhoto({ name, size = 40, className, photoPath }: UserPhotoProps) {
  // Get first letters of first two words
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0][0].toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const getAvatarUrl = (name: string) => {
    if (photoPath) {
      return process.env.NEXT_PUBLIC_API_URL + photoPath;
    }

    // Generate avatar URL
    const initials = getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=${size}&color=fff`;
  };

  return (
    <div className={cn("relative rounded-full overflow-hidden", className)}>
      <Image
        src={getAvatarUrl(name)}
        alt={name}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
}

export default UserPhoto; 