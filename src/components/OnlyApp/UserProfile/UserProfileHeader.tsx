import { UserRole, userRoleLabels } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import DiscussionsBadge from '@/components/OnlyApp/Badge/DiscussionsBadge';
import { Settings } from 'lucide-react';

interface UserProfileHeaderProps {
  name: string;
  username: string;
  role: UserRole;
  photoPath?: string;
  threadsCount: number;
  showSettings?: boolean;
}

export default function UserProfileHeader({
  name,
  username,
  role,
  photoPath,
  threadsCount,
  showSettings = false,
}: UserProfileHeaderProps) {
  return (
    <div className="relative flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
      {/* Profile Picture and Settings */}
      {photoPath && (
        <div className="relative flex items-center justify-between">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <Image
              src={photoPath}
              alt={name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
} 