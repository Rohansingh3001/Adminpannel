import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination = ({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  // Fallback if there are no items
  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-slate-200 rounded-b-xl gap-4">
      <div className="flex items-center text-sm text-slate-700">
        <p>
          Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{total}</span> results
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-700">
          <label htmlFor="pageSize">Rows per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
            className="border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium ${
              page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">
            Page {page} of {totalPages}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || total === 0}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium ${
              page === totalPages || total === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};
