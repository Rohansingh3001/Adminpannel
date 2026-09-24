import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../types/product';
import { getProducts, searchProducts, getProductsByCategory, deleteProduct } from '../api/products';
import { getCategories, Category } from '../api/categories';
import axios from 'axios';

interface UseProductsOptions {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  sort: string;
  order: string;
}

export const useProducts = ({ page, pageSize, search, category, sort, order }: UseProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Cancel previous request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const skip = (page - 1) * pageSize;
      let data;

      if (search) {
        data = await searchProducts(search, pageSize, skip, sort, order, abortController.signal);
      } else if (category) {
        data = await getProductsByCategory(category, pageSize, skip, sort, order);
      } else {
        data = await getProducts(pageSize, skip, sort, order);
      }

      // Check if this is still the active request
      if (!abortController.signal.aborted) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        setError('Something went wrong. We couldn\'t load the products.');
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, pageSize, search, category, sort, order]);

  useEffect(() => {
    fetchProducts();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const removeProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      // Optimistically remove from state
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotal(prev => prev - 1);
      return true;
    } catch (err) {
      console.error('Failed to delete product', err);
      return false;
    }
  };

  return {
    products,
    total,
    categories,
    loading,
    error,
    refetch: fetchProducts,
    removeProduct
  };
};
