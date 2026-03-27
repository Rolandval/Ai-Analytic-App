import { apiClient } from './client';
import type { LoginResponse } from '@/types/api';

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const { data } = await apiClient.post<LoginResponse>('/users/login', formData.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

export async function registerApi(email: string, password: string): Promise<void> {
  await apiClient.post('/users/register', { email, password });
}
