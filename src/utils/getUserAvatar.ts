import { UserRole } from "@/types";

/**
 * Generates the user avatar URL based on the provided photo path and role.
 * If a photo path is provided, it constructs the avatar URL by appending the path to the NEXT_PUBLIC_API_URL.
 * If no photo path is provided, it returns the default avatar URL for the specified role.
 * 
 * @param photoPath - The path to the user's photo.
 * @param role - The user's role.
 * @returns The URL of the user's avatar.
 */
import { getDefaultUserAvatar } from "./getDefaultUserAvatar";

export function getUserAvatar(photoPath?: string, role?: UserRole) {
  if (!role && !photoPath) {
    return getDefaultUserAvatar(UserRole.STUDENT);
  }

  if (photoPath) {
    return process.env.NEXT_PUBLIC_API_URL + photoPath;
  }

  return getDefaultUserAvatar(role as UserRole);
};