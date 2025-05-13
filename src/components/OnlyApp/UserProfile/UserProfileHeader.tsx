import { Department, departmentLabels, UserRole, userRoleLabels } from '@/types';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import UserPhoto from '@/components/UserPhoto';

interface UserProfileHeaderProps {
  name: string;
  username: string;
  role: UserRole;
  photoPath?: string;
  threadsCount: number;
  showSettings?: boolean;
  department?: Department;
}

export default function UserProfileHeader({
  name,
  username,
  role,
  photoPath,
  showSettings = false,
  department,
}: UserProfileHeaderProps) {
  return (
    <div className="relative flex flex-col gap-6 border-b border-gray-200 pb-6 mb-6">
      {/* Profile Picture and Settings */}
      {photoPath && (
        <UserPhoto 
          photoPath={photoPath}
          name={name}
          role={role}
          size={110}
        />
      )}

      {/* User Info */}
      <div>
        <div className="flex gap-3 items-center">
          <h1 className="text-2xl font-bold">{name}</h1>
          {showSettings && (
            <Link
              href="/profile-settings"
              className=""
              title="إعدادات الحساب"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <span style={{ direction: 'ltr' }}>@{username}</span>
          <div className="w-1 h-1 rounded-full bg-gray-400" />
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
            {userRoleLabels[role]}
          </span>
          {role === UserRole.STUDENT && department && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                {departmentLabels[department]}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 