'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ErrorAlert from '@/components/Form/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import useAuthRedirect from '@/hooks/UseAuthRedirect';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import Divider from '@/components/Divider';
import { Edit2, Save, X, Trash2, User, Mail, Hash, Shield, Building2, GraduationCap } from 'lucide-react';
import { Profile, userRoleLabels, UserRole } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { auth, setAuth } = useAuth();

  useAuthRedirect();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    username: auth.user?.username || '',
  });

  if (auth.loading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  if (!auth.user) {
    return null;
  }

  // Cast auth.user to Profile type
  const profile = auth.user as Profile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          name: formData.name,
          username: formData.username,
        },
      }));

      toast.success('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (err) {
      setError(ERROR_MESSAGES.profile.UPDATE_FAILED);
      toast.error(ERROR_MESSAGES.profile.UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAuth({
        accessToken: undefined,
        user: undefined,
        loading: false,
      });
      router.push('/');
      toast.success('تم حذف الحساب بنجاح');
    } catch (err) {
      setError(ERROR_MESSAGES.profile.DELETE_FAILED);
      toast.error(ERROR_MESSAGES.profile.DELETE_FAILED);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = formData.name.trim() !== '' && formData.username.trim() !== '';

  const ReadOnlyField = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <p className="text-base font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-20">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-500">قم بتحديث معلومات ملفك الشخصي أو حذف حسابك</p>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-10 bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500 mt-1">@{profile.username}</p>
              </div>
            </div>

            <Divider label="" borderColor="gray-100" />

            <div className="space-y-8">
              <ReadOnlyField 
                label="البريد الإلكتروني" 
                value={profile.email} 
                icon={Mail}
              />
              {profile.role === 'STUDENT' && (
                <>
                  <ReadOnlyField 
                    label="الرقم الأكاديمي" 
                    value={profile.academicNumber || ''} 
                    icon={Hash}
                  />
                  {profile.department && (
                    <ReadOnlyField 
                      label="القسم" 
                      value={profile.department} 
                      icon={Building2}
                    />
                  )}
                  {profile.level && (
                    <ReadOnlyField 
                      label="المستوى" 
                      value={profile.level} 
                      icon={GraduationCap}
                    />
                  )}
                </>
              )}
              <ReadOnlyField 
                label="الدور" 
                value={userRoleLabels[profile.role]} 
                icon={Shield}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="button" 
                onClick={() => setIsEditing(true)}
                icon={<Edit2 className="w-4 h-4" />}
                iconPosition="start"
              >
                تعديل المعلومات
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="الاسم الكامل"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  fullWidth
                />

                <Input
                  label="اسم المستخدم"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  fullWidth
                />
              </div>

              <div className="space-y-4">
                <ReadOnlyField 
                  label="البريد الإلكتروني" 
                  value={profile.email} 
                  icon={Mail}
                />
                {profile.role === UserRole.STUDENT && (
                  <>
                    <ReadOnlyField 
                      label="الرقم الأكاديمي" 
                      value={profile.academicNumber || ''} 
                      icon={Hash}
                    />
                    {profile.department && (
                      <ReadOnlyField 
                        label="القسم" 
                        value={profile.department} 
                        icon={Building2}
                      />
                    )}
                    {profile.level && (
                      <ReadOnlyField 
                        label="المستوى" 
                        value={profile.level} 
                        icon={GraduationCap}
                      />
                    )}
                  </>
                )}
                <ReadOnlyField 
                  label="الدور" 
                  value={userRoleLabels[profile.role]} 
                  icon={Shield}
                />
              </div>
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                isLoading={isSubmitting}
                loadingText="جاري الحفظ..."
                icon={<Save className="w-4 h-4" />}
                iconPosition="start"
              >
                حفظ التغييرات
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: profile.name || '',
                    username: profile.username || '',
                  });
                }}
                icon={<X className="w-4 h-4" />}
                iconPosition="start"
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </div>

      <Divider label="" />

      <div className="space-y-6 bg-red-50/50 border-2 border-red-200/60 rounded-xl p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">حذف الحساب</h1>
          <p className="text-gray-500">لا يمكنك استرجاع حسابك لاحقاً.</p>
        </div>

        <Button
          type="button"
          variant="outline"
          color="secondary"
          onClick={handleDelete}
          className="text-red-600 hover:border-red-700 hover:text-red-600 hover:shadow-none"
          icon={<Trash2 className="w-4 h-4" />}
          iconPosition="start"
        >
          حذف الحساب
        </Button>
      </div>
    </div>
  );
}
