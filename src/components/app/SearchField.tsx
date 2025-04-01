import { Search } from "lucide-react";
import Input from "../Input";

interface SearchFieldProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder?: string;
}

function SearchField({
  searchQuery,
  setSearchQuery,
  placeholder,
}: SearchFieldProps) {
  return (
    <Input
      startIcon={<Search className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      inputSize='default'
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  )
}

export default SearchField;
