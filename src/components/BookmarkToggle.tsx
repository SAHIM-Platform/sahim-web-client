import { useState } from "react";
import { Bookmark } from "lucide-react";

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
        fill={Bookmarked ? "primary" : "none"}
        color={Bookmarked ? "primary" : "currentColor"}
      />
    </button>
  );
};

export default BookmarkToggle;
