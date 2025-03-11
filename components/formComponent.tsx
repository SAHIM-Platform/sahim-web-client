import Button from "./btnComponent";
import Input from "./inputComponent";
import Logo from "./LogoComponent"; 
import Divider from "./DividerComponent";
// import Divider from "./dividerComponent"; 
// import Test from "./test" ;
import Image from "next/image";

const Form = () => {
  return (
    
    <div className="w-96   my-auto  flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white md:mb-24">
       <Logo />  
       <h1 className="mb-2 font-bold text-xl text-center">مرحبا بك مجدد في ساهم</h1>
        <p className="mb-4 text-sm text-center">من فضلك، أدخل بيانات حسابك لتسجيل الدخول</p>
 
        <form className="flex flex-col space-y-4">
          <Input type="text" className="w-80 border border-gray-300 rounded-full px-4 py-2 text-right placeholder:text-xs" placeholder="البريد الإلكتروني" />
          <Input type="password" className="w-80 border border-gray-300 rounded-full px-4 py-2 text-right placeholder:text-xs" placeholder="كلمة المرور" />
          <Button className="w-80  bg-primary rounded-full px-4 py-2 border hover:bg-secondary 
           hover:border-gray-400 mb-3 flex justify-center items-center"> تسجيل الدخول </Button>

           {/* <button className="mt-5  text-white rounded-full px-4 py-2 "></button> */}
        </form>
        <p className="text-xs mt-3 text-gray-600">
          ليس لديك حساب؟ <a href="#" className="text-primary">إنشئ حساب</a>
        </p>  
<Divider/> 
<Button className="w-80 rounded-full px-4 py-2 border border-gray-300 hover:border-gray-400 mb-3 flex justify-center items-center">
          سجل الدخول بواسطة جوجل
          <Image 
            src="/icons8-google.svg" 
            className="w-7 h-7 inline-block ml-2" 
            alt="Google Icon" 
            width={28}  // 
            height={28} //  
            />
        </Button>
      </div>  

     
     
  );
};

export default Form;