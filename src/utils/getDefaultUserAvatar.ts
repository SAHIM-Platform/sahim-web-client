import { UserRole } from "@/types";
import { DEFAULT_AVATARS } from "@/utils/constants/DEFAULT_AVATARS";

export function getDefaultUserAvatar(role: UserRole) {
  return DEFAULT_AVATARS[role as keyof typeof DEFAULT_AVATARS];
}

