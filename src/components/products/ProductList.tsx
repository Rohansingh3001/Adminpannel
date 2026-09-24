import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types/product';
import { Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onDelete: (id: number) => Promise<boolean>;
}

export const ProductList = ({ products, onDelete }: ProductListProps) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
    setDeleteConfirmId(null);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white border-t border-slate-200 py-12 flex flex-col items-center justify-center">
        <div className="rounded-full bg-slate-100 p-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No products found</h3>
        <p className="mt-1 text-slate-500 text-sm max-w-sm text-center">
          We couldn't find any products matching your current search and filter criteria. Try adjusting them.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent overflow-hidden">
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setDeleteConfirmId(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        Are you sure you want to delete this product? This action cannot be undone (simulated).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(deleteConfirmId)}
                  className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirmId(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white/80 backdrop-blur-md mx-6 mb-6 mt-4">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative rounded-md overflow-hidden bg-slate-100">
                      <img src={product.thumbnail} alt={product.title} className="object-cover h-full w-full" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{product.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-[200px]">{product.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                  ₹{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-amber-400 mr-1">★</span>
                    {product.rating}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`${product.stock < 10 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-3">
                    <Link href={`/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors" title="View Details">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link href={`/products/${product.id}/edit`} className="text-emerald-600 hover:text-emerald-900 transition-colors" title="Edit Product">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button onClick={() => setDeleteConfirmId(product.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete Product">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-slate-50">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-48 w-full bg-slate-100 relative">
              <img src={product.thumbnail} alt={product.title} className="object-cover h-full w-full" />
              <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-white/90 text-indigo-800 shadow-sm backdrop-blur-sm">
                {product.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{product.brand}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-slate-900">₹{product.price.toFixed(2)}</span>
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <span className="text-amber-400 mr-1 text-lg">★</span>
                  {product.rating}
                </div>
              </div>
              
              <div className="flex items-center text-sm mb-4">
                <span className="text-slate-500 mr-2">Stock:</span>
                <span className={`${product.stock < 10 ? 'text-red-600 font-bold' : 'text-slate-900 font-medium'}`}>
                  {product.stock} units
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <Link href={`/products/${product.id}`} className="flex flex-col items-center justify-center p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Eye className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">View</span>
                </Link>
                <Link href={`/products/${product.id}/edit`} className="flex flex-col items-center justify-center p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                  <Edit className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Edit</span>
                </Link>
                <button onClick={() => setDeleteConfirmId(product.id)} className="flex flex-col items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
