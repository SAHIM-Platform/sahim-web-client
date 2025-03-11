import Image from "next/image";
import Logo from "../../components/LogoComponent"; 
import Input from "../../components/inputComponent"; 
import Button from "../../components/btnComponent"; 
import Form from "../../components/formComponent";
export default function Home() {
  return ( <main>

    <div className=" container  mx-auto   grid  items-center justify-items-center  p-8  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Form/>
       
      
      {/* <p className=" border-4  font-sans">شرف احمد </p>  */} 
      
      

    </div> 
            </main>
  );
}
