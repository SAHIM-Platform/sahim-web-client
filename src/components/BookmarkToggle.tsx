import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/utils/utils";

interface BookmarkToggleProps {
  className?: string;
}
const BookmarkToggle: React.FC<BookmarkToggleProps> = ({ className = "" }) => {
  const [Bookmarked, setBookmarked] = useState(false);
  const handleToggle = () => {
    setBookmarked((prev) => !prev);
  };
  return (
    <button onClick={handleToggle} className={` ${className}`}>
      <Bookmark
        className={cn(
          "w-5 h-5",
          Bookmarked && "text-primary fill-primary"
        )}
      />
    </button>
  );
};

export default BookmarkToggle;
