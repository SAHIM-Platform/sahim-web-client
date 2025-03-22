import Image from "next/image";

const Logo = () => (
	<div className="w-32 h-auto">
		<Image
			alt="SAHIM Login"
			className="h-full w-full object-cover"
			height={1080}
			priority
			quality={100}
			src="/login-bg.webp"
			width={1920}
		/>
	</div>
);

export default Logo;