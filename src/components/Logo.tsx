import { cn } from '@/utils/utils';
import Image from "next/image";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => (
	<div className={cn("w-[50px] h-auto", className)}>
		<Image
			alt="SAHIM Login"
			className="h-full w-full object-cover"
			width={1920}
			height={1080}
			priority
			quality={100}
			src="/sahim-logo.png"
		/>
	</div>
);

export default Logo;