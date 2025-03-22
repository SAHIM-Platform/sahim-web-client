import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import Divider from "./Divider";
import Image from "next/image";

const Form = () => {
  return (
    <div className="w-[400px] max-w-full flex flex-col justify-center items-center text-center gap-10 p-[35px] rounded-lg shadow-md bg-white">

      <div className=" space-y-8  text-center"> 
        <Logo className="mx-auto" />
        {/* I made the logo smaller */}
        <div className="space-y-4">  
          <h1 className="mb-2 font-medium text-2xl">مرحباً بك مجدد في ساهم</h1>
          <p className="mb-4 text-xs">من فضلك، أدخل بيانات حسابك لتسجيل الدخول</p> 
          {/* text got smaller  */}
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="space-y-4 w-full">

          <form className="flex flex-col space-y-4 w-full">
            <Input type="text" placeholder="البريد الإلكتروني" />
            <Input type="password" placeholder="كلمة المرور" />
            <Button fullWidth variant='primary'>تسجيل الدخول</Button>
          </form>
 
          <p className="text-xs   text-gray-700">
            ليس لديك حساب؟ <a href="#" className="text-primary font-medium">أنشئ حساب</a>
          </p>
        </div>

        <Divider />

        <Button variant="outline" fullWidth>
          سجل الدخول بواسطة جوجل
          <Image
            src="/icons8-google.svg"
            className="w-[18px] h-[18px] inline-block ml-2"
            alt="Google Icon"
            width={24}  // 
            height={24} //  
          />
        </Button>
      </div>
    </div >
  );
};

export default Form;