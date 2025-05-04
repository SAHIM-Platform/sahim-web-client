import { useState, FormEvent } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import ErrorAlert from "@/components/Form/ErrorAlert";
import { GraduationCap, Building2, GraduationCap as GraduationCap2, UserCheck } from "lucide-react";
import { departmentLabels, Level, Department } from "@/types";
import validateSignupForm, { AuthMethod, SignupFormData } from "@/utils/api/signup/validateSignupForm";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

interface CompleteSignupFormData {
  academicNumber: string;
  department: Department;
  studyLevel: Level;
}

interface UserParams {
  email: string;
  username: string;
  name: string;
  picture?: string;
}

interface CompleteSignupFormProps {
  userParams: UserParams;
}

export default function CompleteSignupForm({ userParams }: CompleteSignupFormProps) {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState<Partial<CompleteSignupFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof CompleteSignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    const validationErrors = validateSignupForm({ ...formData, [field]: value });
    const academicErrors = {
      ...(validationErrors.academicNumber && { academicNumber: validationErrors.academicNumber }),
      ...(validationErrors.department && { department: validationErrors.department }),
      ...(validationErrors.studyLevel && { studyLevel: validationErrors.studyLevel }),
    };

    if (Object.keys(academicErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...academicErrors }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    const validationErrors = validateSignupForm(formData);
    const academicErrors = {
      ...(validationErrors.academicNumber && { academicNumber: validationErrors.academicNumber }),
      ...(validationErrors.department && { department: validationErrors.department }),
      ...(validationErrors.studyLevel && { studyLevel: validationErrors.studyLevel }),
    };

    if (Object.keys(academicErrors).length > 0) {
      setErrors(academicErrors);
      setIsLoading(false);
      return;
    }

    try {
      const completeData: SignupFormData = {
        email: userParams.email,
        username: userParams.username,
        authMethod: AuthMethod.OAUTH_GOOGLE,
        academicNumber: formData.academicNumber || '', 
        department: formData.department as Department,
        studyLevel: Number(formData.studyLevel),
        name: userParams.name
      };

      const result = await signup(completeData);

      if (!result.success) {
        if (result.error?.fields) {
          setErrors(result.error.fields.reduce<Record<string, string>>((acc, field) => ({
            ...acc,
            [field]: result.error?.message || ''
          }), {}));
        }
        setFormError(result.error?.message || "حدث خطأ أثناء إنشاء الحساب");
      }
      if (result.success) {
        router.push('/account-status'); 
      }
    } catch (error) {
      console.error("Complete signup error:", error);
      setFormError("حدث خطأ غير متوقع أثناء إكمال معلومات الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <Input
        type="text"
        placeholder="الرقم الأكاديمي"
        label="الرقم الأكاديمي"
        required
        value={formData.academicNumber || ''}
        onChange={(e) => handleChange('academicNumber', e.target.value)}
        error={errors.academicNumber}
        startIcon={<GraduationCap className="w-[18px] h-[18px]" />}
      />
      <Select
        options={Object.entries(departmentLabels).map(([value, label]) => ({
          value,
          label
        }))}
        placeholder="اختر القسم"
        label="القسم"
        required
        value={formData.department || ''}
        onChange={(e) => handleChange('department', e.target.value)}
        error={errors.department}
        startIcon={<Building2 className="w-[18px] h-[18px]" />}
      />
      <Select
        options={Object.values(Level)
          .filter((v): v is number => typeof v === "number")
          .map((level) => ({
            value: level.toString(),
            label: `المستوى ${level}`
          }))}
        placeholder="اختر المستوى"
        label="المستوى الدراسي"
        required
        value={formData.studyLevel?.toString() || ''}
        onChange={(e) => handleChange('studyLevel', e.target.value)}
        error={errors.studyLevel}
        startIcon={<GraduationCap2 className="w-[18px] h-[18px]" />}
      />

      {formError && <ErrorAlert message={formError} />}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading || Object.keys(errors).length > 0}
        icon={<UserCheck className="w-4 h-4" />}
        iconPosition="end"
      >
        إكمال التسجيل
      </Button>
    </form>
  );
} 