'use client';

import { useState, useEffect } from 'react';
import { getProduct } from '../../../api/products';
import { Product } from '../../../types/product';
import { ArrowLeft, AlertCircle, Edit, ShoppingCart, Tag, MapPin, Package, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(params.id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6 max-w-md">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <Link 
          href={`/products/${product.id}/edit`} 
          className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Images */}
          <div className="bg-slate-100 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <img 
              src={product.images?.[0] || product.thumbnail} 
              alt={product.title} 
              className="max-h-96 object-contain drop-shadow-xl"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-8 md:p-10">
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-5 w-5 fill-current mr-1" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-slate-500 ml-1 text-sm font-medium">({product.reviews?.length || 0} reviews)</span>
              </div>
              <div className="text-slate-500 text-sm font-medium">{product.brand}</div>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="ml-3 text-lg text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">-{product.discountPercentage}%</span>
              )}
            </div>
            
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex items-start">
                <Package className="h-6 w-6 text-slate-400 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Stock Status</h4>
                  <p className={`text-sm mt-1 font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="h-6 w-6 text-slate-400 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">SKU</h4>
                  <p className="text-sm text-slate-500 mt-1 font-mono">{product.sku}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {product.reviews.map((review, index) => (
              <div key={index} className="px-8 py-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{review.reviewerName}</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-3 pl-13 ml-13 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
