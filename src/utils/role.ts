import { Profile, UserRole } from "@/types";

/**
 * Checks if the user is a student based on their role.
 * @param user - The user profile to check.
 * @returns True if the user is a student, false otherwise.
 */
export function isStudent(user: Profile) {
  return isStudentByRole(user.role);
}

/**
 * Checks if the user is an admin based on their role.
 * @param user - The user profile to check.
 * @returns True if the user is an admin, false otherwise.
 */
export function isAdmin(user: Profile) {
  return isAdminByRole(user.role);
}

/**
 * Checks if the user is a super admin based on their role.
 * @param user - The user profile to check.
 * @returns True if the user is a super admin, false otherwise.
 */
export function isSuperAdmin(user: Profile) {
  return isSuperAdminByRole(user.role);
}

/**
 * Checks if the user is either an admin or a super admin based on their role.
 * @param user - The user profile to check.
 * @returns True if the user is an admin or a super admin, false otherwise.
 */
export function isAdminOrSuperAdmin(user: Profile) {
  return isAdmin(user) || isSuperAdmin(user);
}

/**
 * Checks if the role is that of a student.
 * @param role - The role to check.
 * @returns True if the role is that of a student, false otherwise.
 */
export function isStudentByRole(role: string | undefined) {
  if (!role) return false;
  return role === UserRole.STUDENT;
}

/**
 * Checks if the role is that of an admin.
 * @param role - The role to check.
 * @returns True if the role is that of an admin, false otherwise.
 */
export function isAdminByRole(role: UserRole | undefined) {
  if (!role) return false;
  return role === UserRole.ADMIN;
}

/**
 * Checks if the role is that of a super admin.
 * @param role - The role to check.
 * @returns True if the role is that of a super admin, false otherwise.
 */
export function isSuperAdminByRole(role: UserRole | undefined) {
  if (!role) return false;
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Checks if the role is that of either an admin or a super admin.
 * @param role - The role to check.
 * @returns True if the role is that of an admin or a super admin, false otherwise.
 */
export function isAdminOrSuperAdminByRole(role: UserRole | undefined) {
  if (!role) return false;
  return isAdminByRole(role) || isSuperAdminByRole(role);
}