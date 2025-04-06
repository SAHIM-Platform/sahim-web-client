export interface CategoryBadgeProps {
  name: string
}

function CategoryBadge({name}: CategoryBadgeProps) {
  return (
    <span className="px-1.5 py-0.5 rounded-full bg-primary/5 text-primary text-[12px] font-medium border border-primary/10">
      {name}
    </span>
  )
}

export default CategoryBadge;