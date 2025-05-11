import { cn } from '@/utils/utils';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  contentFirst?: boolean;
  className?: string;
  contentClassName?: string;
}

function Card({
  title,
  description,
  imageSrc,
  imageAlt,
  contentFirst = false,
  className,
  contentClassName
}: CardProps) {
  const content = (
    <div className={cn(
      "flex flex-col justify-center text-right space-y-3 flex-1",
      contentClassName
    )}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  const image = (
    <div className="flex-1">
      <Image
        src={imageSrc}
        alt={imageAlt}
        height={500}
        width={500}
        className="object-contain w-full h-full rounded-xl shadow-md"
        quality={90}
      />
    </div>
  );

  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center gap-6 md:gap-12",
      contentFirst ? "md:flex-row" : "md:flex-row-reverse",
      className
    )}>
      {content}
      {image}
    </div>
  );
}

export default Card;
