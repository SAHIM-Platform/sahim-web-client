import Link from "next/link";
import { getCategoryUrl } from "@/utils/urls";

export interface CategoryBadgeProps {
  name: string;
  categoryId: number;
  maxChars?: number;
}

function CategoryBadge({ name, categoryId, maxChars = 15 }: CategoryBadgeProps) {
  return (
    <Link 
      href={getCategoryUrl(categoryId)} 
      className="px-1.5 py-0.5 rounded-full bg-primary/5 text-primary text-[12px] font-medium border border-primary/10"
    >
      {maxChars && name.length > maxChars
        ? `${name.substring(0, maxChars)}...`
        : name}
    </Link>
  )
}

export default CategoryBadge;