'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ErrorAlert from '@/components/Form/ErrorAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import ERROR_MESSAGES from '@/utils/constants/ERROR_MESSAGES';
import Divider from '@/components/Divider';
import { Edit2, Save, X, Trash2, Mail, Hash, Shield, Building2, GraduationCap } from 'lucide-react';
import { Profile, userRoleLabels } from '@/types';
import UserPhoto from '@/components/UserPhoto';
import { userService } from '@/services/userService';
import validateProfileForm from '@/utils/api/profile/validateProfileForm';
import Modal from '@/components/Modal/Modal';
import { AuthMethod } from '@/utils/api/signup/validateSignupForm';
import Image from 'next/image';
import { useAuth, useAuthRedirect } from '@/hooks';
import { isSuperAdminByRole } from '@/utils/role';

export default function ProfilePage() {
  const router = useRouter();
  const { auth, setAuth } = useAuth();
  const isLoading = useAuthRedirect();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    photoPath: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await userService.getProfile();
        if (result.success && result.data?.user) {
          setProfile(result.data.user);
          setFormData({
            name: result.data.user.name || '',
            username: result.data.user.username || '',
            photoPath: result.data.user.photoPath || '',
          });
        } else {
          setError(result.error?.message || ERROR_MESSAGES.profile.DEFAULT);
          toast.error(result.error?.message || ERROR_MESSAGES.profile.DEFAULT);
        }
      } catch {
        setError(ERROR_MESSAGES.profile.DEFAULT);
        toast.error(ERROR_MESSAGES.profile.DEFAULT);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (auth.loading || isLoading || isLoadingProfile) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (!profile) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      const validationErrors = validateProfileForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setError(Object.values(validationErrors)[0]);
        toast.error(Object.values(validationErrors)[0]);
        setIsSubmitting(false);
        return;
      }

      const result = await userService.updateProfile(formData);

      if (result.success && result.data?.user) {
        setProfile(result.data.user);
        setAuth((prev) => ({
          ...prev,
          user: {
            ...prev.user!,
            ...(result.data?.user || {}),
          },
        }));

        toast.success('تم تحديث الملف الشخصي بنجاح');
        setIsEditing(false);
      } else {
        const errorMessage = 'حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch {
      const errorMessage = 'حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      setDeleteError('الرجاء إدخال كلمة المرور');
      return;
    }

    try {
      setIsDeletingAccount(true);
      const result = await userService.deleteProfile({ password: deletePassword });

      if (result.success) {
        setIsRedirecting(true);
        setAuth({
          accessToken: undefined,
          user: undefined,
          loading: false,
        });
        toast.success('تم حذف الحساب بنجاح');
        router.push('/');
      } else {
        const errorMessage = 'حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى';
        setDeleteError(errorMessage);
        toast.error(errorMessage);
      }
    } catch {
      const errorMessage = 'حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = formData.name.trim() !== '' && formData.username.trim() !== '';
  const ReadOnlyField = ({
    label,
    value,
    icon: Icon,
    authMethod
  }: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    authMethod?: AuthMethod;
  }) => (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <p className="text-base font-medium text-gray-900 mt-0.5">{value}</p>
          {authMethod === AuthMethod.OAUTH_GOOGLE && (
            <Image
              src="/icons8-google.svg"
              className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 inline-block me-2 opacity-80"
              alt="Google Icon"
              width={20}
              height={20}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (isRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (error && !isSubmitting) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error} />
        <Button
          onClick={() => {
            window.location.reload();
            router.refresh();
          }}
          variant="outline"
          color="secondary"
        >
          تحديث حالة الحساب
        </Button>
      </div>
    );
  }

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
              <UserPhoto photoPath={profile.photoPath || ''} name={profile.name} size={80} />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500 mt-1">@{profile.username}</p>
              </div>
            </div>

            <Divider label="" borderColor="gray-100" />

            <div className="space-y-8">
              {profile.email && (
                <ReadOnlyField
                  label="البريد الإلكتروني"
                  value={profile.email}
                  icon={Mail}
                  authMethod={profile.authMethod}
                />
              )}
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

                <Input
                  label="رابط الصورة الشخصية"
                  placeholder="أدخل رابط الصورة الشخصية"
                  value={formData.photoPath}
                  onChange={(e) => handleChange('photoPath', e.target.value)}
                  fullWidth
                />
              </div>

              <div className="space-y-4">
                {profile.email && (
                  <ReadOnlyField
                    label="البريد الإلكتروني"
                    value={profile.email}
                    icon={Mail}
                    authMethod={profile.authMethod}
                  />
                )}
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
                  setError('');
                  setFormData({
                    name: profile.name || '',
                    username: profile.username || '',
                    photoPath: profile.photoPath || '',
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

      {!isSuperAdminByRole(profile.role) && (
        <>
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
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:border-red-700 hover:text-red-600 hover:shadow-none"
              icon={<Trash2 className="w-4 h-4" />}
              iconPosition="start"
            >
              حذف الحساب
            </Button>
          </div>
        </>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isDeletingAccount) {
            setShowDeleteModal(false);
            setDeletePassword('');
            setDeleteError('');
          }
        }}
        title="حذف الحساب"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء. الرجاء إدخال كلمة المرور للتأكيد.
          </p>

          <Input
            type="password"
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            fullWidth
            required
            disabled={isDeletingAccount}
          />

          {deleteError && <ErrorAlert message={deleteError} />}

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 hover:shadow-none"
              icon={<Trash2 className="w-4 h-4" />}
              iconPosition="start"
              isLoading={isDeletingAccount}
              loadingText="جاري حذف الحساب..."
              disabled={!deletePassword || isDeletingAccount}
            >
              حذف الحساب
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isDeletingAccount) {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError('');
                }
              }}
              icon={<X className="w-4 h-4" />}
              iconPosition="start"
              disabled={isDeletingAccount}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
