import react from "react" ;  
import Image from "next/image";
const Logo = () => {
    return (      <div className="logo mb-6">
<Image 
      src="/SAHIM_Logo.png" 
      className="w-12 h-16" 
      alt="Logo" 
      width={48}  
      height={64} 
      />
</div> );

} ;
export default Logo;