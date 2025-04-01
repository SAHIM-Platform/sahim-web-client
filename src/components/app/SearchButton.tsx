import { cn } from "@/utils/utils";
import { Search } from "lucide-react";

interface SearchButtonProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  placeholder?: string;
  useKeyboardShortcuts?: boolean;
  fullWidth?: boolean
}

function SearchButton({
  isSearchFocused,
  setIsSearchFocused,
  placeholder,
  fullWidth
}: SearchButtonProps) {
  return (
    <div className={cn(
      'flex-1',
      fullWidth ? 'w-full' : 'max-w-xl min-w-[400px]'
    )}>
      <button
        onClick={() => setIsSearchFocused(true)}
        className={cn(
          "bg-white w-full h-10 flex items-center gap-3 px-4 rounded-lg border",
          "hover:bg-gray-100/80 transition-colors",
          "text-gray-500",
          isSearchFocused ? "border-primary" : "border-gray-200"
        )}
      >
        <Search className="w-5 h-5" />
        <span className="flex-1 text-right">{placeholder}</span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <kbd className="py-0.5 px-1.5 rounded bg-white font-medium text-gray-500 shadow-sm border border-gray-100">/</kbd>
          للبحث السريع
        </div>
      </button>
    </div>
  )
}

export default SearchButton;