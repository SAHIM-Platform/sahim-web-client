export interface CategoryBadgeProps {
  name: string
  maxChars?: number;
}

function CategoryBadge({ name, maxChars = 15 }: CategoryBadgeProps) {
  return (
    <span className="px-1.5 py-0.5 rounded-full bg-primary/5 text-primary text-[12px] font-medium border border-primary/10">

      {maxChars && name.length > maxChars
        ? `${name.substring(0, maxChars)}...`
        : name}
    </span>
  )
}

export default CategoryBadge;