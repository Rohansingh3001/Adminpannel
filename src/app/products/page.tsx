'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { parseNumberParam, parseStringParam, parseSortOrder } from '../../utils/urlParams';
import { Filters } from '../../components/filters/Filters';
import { ProductList } from '../../components/products/ProductList';
import { Pagination } from '../../components/pagination/Pagination';
import { RefreshCcw, AlertCircle } from 'lucide-react';

function ProductsDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL
  const urlPage = parseNumberParam(searchParams.get('page'), 1, 1);
  const urlPageSize = parseNumberParam(searchParams.get('pageSize'), 20, 10, 100);
  const urlSearch = parseStringParam(searchParams.get('search'));
  const urlCategory = parseStringParam(searchParams.get('category'));
  const urlSortBy = parseStringParam(searchParams.get('sort'));
  const urlOrder = parseSortOrder(searchParams.get('order'));

  // Local state for search (before debouncing)
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(localSearch, 500);

  // When debounced search changes, update URL and reset page to 1
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, urlSearch]);

  const { products, total, categories, loading, error, refetch, removeProduct } = useProducts({
    page: urlPage,
    pageSize: urlPageSize,
    search: debouncedSearch,
    category: urlCategory,
    sort: urlSortBy,
    order: urlOrder,
  });

  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ pageSize: newSize, page: 1 });
  };

  const handleSearchChange = (query: string) => {
    setLocalSearch(query);
  };

  const handleCategoryChange = (category: string) => {
    // If category is selected, clear search to avoid the DummyJSON API limitation, or just apply it.
    // The PRD says "search results take precedence over the category filter".
    // Let's just update the URL. We might also reset page to 1.
    updateUrlParams({ category, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    updateUrlParams({ sort, page: 1 });
  };

  const handleOrderChange = (order: string) => {
    updateUrlParams({ order, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your products, pricing, and inventory.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Filters
          searchQuery={localSearch}
          onSearchChange={handleSearchChange}
          selectedCategory={urlCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={urlSortBy}
          onSortChange={handleSortChange}
          order={urlOrder}
          onOrderChange={handleOrderChange}
          categories={categories}
        />

        {error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-500 max-w-sm mb-6">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry Request
            </button>
          </div>
        ) : loading && products.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Loading products...</p>
          </div>
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center border-t border-slate-200">
                <div className="bg-white p-3 rounded-xl shadow-lg flex items-center space-x-3 border border-slate-100">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  <span className="text-sm font-medium text-slate-700">Updating...</span>
                </div>
              </div>
            )}
            <ProductList products={products} onDelete={removeProduct} />
            <Pagination
              page={urlPage}
              pageSize={urlPageSize}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ProductsDashboardContent />
    </Suspense>
  );
}
