import apiClient from '../lib/axios';
import { Product, ProductsResponse } from '../types/product';

export const getProducts = async (limit: number, skip: number, sortBy?: string, order?: string): Promise<ProductsResponse> => {
  let url = `/products?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
  }
  const response = await apiClient.get<ProductsResponse>(url);
  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  let url = `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
  }
  // Simulate delay to test race conditions if desired by adding it to query or using a dummy param:
  // url += `&delay=2000`; (not supported out-of-box by dummyjson search, but they have /products?delay=1000)
  const response = await apiClient.get<ProductsResponse>(url, { signal });
  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string
): Promise<ProductsResponse> => {
  let url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
  }
  const response = await apiClient.get<ProductsResponse>(url);
  return response.data;
};

export const getProduct = async (id: number | string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await apiClient.post<Product>('/products/add', productData);
  return response.data;
};

export const updateProduct = async (id: number | string, productData: Partial<Product>): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
  const response = await apiClient.delete<Product & { isDeleted: boolean; deletedOn: string }>(`/products/${id}`);
  return response.data;
};
