import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/product';
import { validateProductForm, ValidationErrors } from '../../lib/validation';
import { Category, getCategories } from '../../api/categories';
import { Save, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

export const ProductForm = ({ initialData = {}, onSubmit, isSubmitting, title }: ProductFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price?.toString() || '',
    stock: initialData.stock?.toString() || '',
    category: initialData.category || '',
    thumbnail: initialData.thumbnail || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateProductForm({
      title: formData.title,
      price: formData.price,
      stock: formData.stock,
      category: formData.category
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        thumbnail: formData.thumbnail || 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      });
    } catch (err) {
      setSubmitError('Failed to save product. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <Link href="/products" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {submitError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Product Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    errors.title 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-lg shadow-sm border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                      errors.price 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-slate-700">
                  Stock <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                      errors.stock 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`block w-full rounded-lg shadow-sm sm:text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    errors.category 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="thumbnail"
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="block w-full rounded-lg shadow-sm border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Leave blank for a default placeholder image.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-end space-x-4">
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>
          <strong>Note:</strong> Changes are not permanently stored by DummyJSON API.
          They are simulated for this session.
        </p>
      </div>
    </div>
  );
};
