import { cn } from '@/utils/utils';
import Image from "next/image";
import Link from 'next/link';

interface LogoProps {
	className?: string;
	widthSize?: 'sm' | 'default';
}

const Logo = ({ className, widthSize = 'default' }: LogoProps) => (
	<Link
		href="/"
		className={cn(
			'relative block',
			widthSize == 'default' && `w-12 h-12`,
			widthSize == 'sm' && `w-7 h-7`,
			className
		)}
	>
		<Image
			alt="SAHIM Login"
			className="h-full w-full object-cover"
			fill
			objectFit='contain'
			priority
			quality={100}
			src="/sahim-logo.png"
		/>
	</Link>
);

export default Logo;