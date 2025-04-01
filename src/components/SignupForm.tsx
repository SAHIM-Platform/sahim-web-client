"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Logo from "./Logo";
import Divider from "./Divider";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building2, GraduationCap as GraduationCap2 } from "lucide-react";
import { departmentLabels } from "@/types";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-[520px] flex flex-col justify-center items-center text-right gap-5 sm:gap-8 p-6 sm:p-8 lg:p-10 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-3 sm:space-y-5 text-right w-full">
        <Logo className="mx-auto" />
        <div className="space-y-1.5 sm:space-y-2 text-center">
          <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-800 tracking-tight">إنشاء حساب جديد</h1>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 font-normal break-words">من فضلك، أدخل بياناتك لإنشاء حساب جديد</p>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-4 w-full">
          <form className="flex flex-col space-y-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="الاسم"
                label="الاسم"
                required
                startIcon={<User className="w-[18px] h-[18px]" />}
              />
              <Input
                type="text"
                placeholder="الرقم الأكاديمي"
                label="الرقم الأكاديمي"
                required
                startIcon={<GraduationCap className="w-[18px] h-[18px]" />}
              />
            </div>
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              label="البريد الإلكتروني"
              required
              startIcon={<Mail className="w-[18px] h-[18px]" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                label="كلمة المرور"
                required
                startIcon={<Lock className="w-[18px] h-[18px]" />}
                endIcon={
                  showPassword ? (
                    <Eye
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(false);
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(true);
                      }}
                    />
                  )
                }
              />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                label="تأكيد كلمة المرور"
                required
                startIcon={<Lock className="w-[18px] h-[18px]" />}
                endIcon={
                  showConfirmPassword ? (
                    <Eye
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(false);
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(true);
                      }}
                    />
                  )
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                options={Object.entries(departmentLabels).map(([value, label]) => ({
                  value,
                  label
                }))}
                placeholder="اختر القسم"
                label="القسم"
                required
                startIcon={<Building2 className="w-[18px] h-[18px]" />}
              />
              <Select
                options={[1, 2, 3, 4, 5].map((level) => ({
                  value: level.toString(),
                  label: `المستوى ${level}`
                }))}
                placeholder="اختر المستوى"
                label="المستوى الدراسي"
                required
                startIcon={<GraduationCap2 className="w-[18px] h-[18px]" />}
              />
            </div>
            <div className="pt-1 sm:pt-2">
              <Button fullWidth variant="primary">
                إنشاء حساب
              </Button>
            </div>
          </form>

          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 text-center">
            لديك حساب بالفعل؟{" "}
            <Link href="/" className="text-primary font-medium hover:underline hover:underline-offset-4 transition-all">
              سجل الدخول
            </Link>
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <Divider />

          <Button variant="outline" fullWidth>
            <Image
              src="/icons8-google.svg"
              className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 inline-block me-2 opacity-80"
              alt="Google Icon"
              width={20}
              height={20}
            />
            أنشئ حساب بواسطة جوجل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
