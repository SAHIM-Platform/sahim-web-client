import { cn } from '@/utils/utils';
import Image from "next/image";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => (
	<div className={cn("w-[72px] h-auto", className)}>
		<Image
			alt="SAHIM Login"
			className="h-full w-full object-cover"
			height={1080}
			priority
			quality={100}
			src="/sahim-logo.png"
			width={1920}
		/>
	</div>
);

export default Logo;