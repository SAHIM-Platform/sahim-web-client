export interface CategoryBadgeProps {
  name: string
}

function CategoryBadge({name}: CategoryBadgeProps) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary text-[12px] font-medium border border-primary/10">
      {name}
    </span>
  )
}

export default CategoryBadge;