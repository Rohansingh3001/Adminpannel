import { Search, Info } from 'lucide-react';
import { Category } from '../../api/categories';
import { useState, useEffect } from 'react';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  order: string;
  onOrderChange: (order: string) => void;
  categories: Category[];
}

export const Filters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  order,
  onOrderChange,
  categories
}: FiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search when URL changes externally (e.g. back button)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-t-xl border-b border-slate-200 space-y-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[150px] flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
            >
              <option value="">Sort By...</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
            
            <button
              onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
              disabled={!sortBy}
              className={`px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium ${!sortBy ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              title="Toggle Sort Order"
            >
              {order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      {localSearch && selectedCategory && (
        <div className="flex items-start text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
          <Info className="h-4 w-4 mr-1 flex-shrink-0" />
          <p>
            Note: The API does not natively support searching and filtering by category simultaneously. 
            Currently, search results take precedence over the category filter.
          </p>
        </div>
      )}
    </div>
  );
};
