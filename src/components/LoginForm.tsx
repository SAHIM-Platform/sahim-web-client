"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import Divider from "./Divider";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from 'next/link';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[420px] flex flex-col justify-center items-center text-right gap-5 sm:gap-8 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-3 sm:space-y-5 text-right w-full"> 
        <Logo className="mx-auto" />
        <div className="space-y-1.5 sm:space-y-2 text-center">  
          <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-800 tracking-tight">مرحباً بك مجدداً في ساهم</h1>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 font-normal break-words">من فضلك، أدخل بيانات حسابك لتسجيل الدخول</p>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-4 w-full">
          <form className="flex flex-col space-y-3 w-full">
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              label="البريد الإلكتروني"
              required
              startIcon={<Mail className="w-[18px] h-[18px]" />}
            />
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
            <div className="pt-1 sm:pt-2">
              <Button fullWidth variant="primary">
                تسجيل الدخول
              </Button>
            </div>
          </form>
 
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 text-center">
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline hover:underline-offset-4 transition-all">
              أنشئ حساب
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
            سجل الدخول بواسطة جوجل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;