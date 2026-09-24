import apiClient from '../lib/axios';
import { AuthResponse } from '../types/auth';

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};
