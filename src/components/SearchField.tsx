interface SearchFieldProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  error?: string | null;
}

export default function SearchField({ searchQuery, setSearchQuery, onSearch, error }: SearchFieldProps) {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={searchQuery}
        // onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="ابحث عن مناقشة..."
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 