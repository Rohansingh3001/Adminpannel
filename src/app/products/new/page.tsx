'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '../../../components/forms/ProductForm';
import { createProduct } from '../../../api/products';
import { Product } from '../../../types/product';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      const newProduct = await createProduct(data);
      // In a real app, this would persist. Here DummyJSON returns the created item.
      router.push(`/products/${newProduct.id}`);
    } catch (err) {
      console.error(err);
      throw err; // Let the form handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <ProductForm
        title="Add New Product"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
