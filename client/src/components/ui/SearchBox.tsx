import { LucideRefreshCcw, Search } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: (value: string) => void;
  placeholder?: string;
}

const SearchBox = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
}: SearchProps) => {
  const handleClear = () => {
    if (onClear) {
      onClear("");
    } else {
      onChange("");
    }
  };

  return (
    <div className="relative w-full max-w-xs shadow-sm">
      <div className="flex items-center gap-2">
        <input
          id="search-term"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-base-content/15 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="border border-gray-300 rounded-md py-1.25 px-2 flex items-center justify-center cursor-pointer"
            aria-label="Clear search"
          >
            <LucideRefreshCcw className="text-gray-400" />
          </button>
        )}
      </div>

      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
};

export default SearchBox;

// Usage example

//  <SearchBox
//    value={searchQuery}
//    onChange={setSearchQuery}
//    placeholder="Search orders, user, or ID..."
//  />;
