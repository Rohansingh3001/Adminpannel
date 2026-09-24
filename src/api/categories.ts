import apiClient from '../lib/axios';

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/products/categories');
  return response.data;
};
