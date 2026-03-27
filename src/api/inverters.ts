import { apiClient } from './client';
import type { InverterPriceItem, InverterPriceFilters, InverterPriceHistoryItem } from '@/types/inverter';
import type { PaginatedResponse } from '@/types/api';

export async function fetchInverterPricesCurrent(
  filters: InverterPriceFilters
): Promise<PaginatedResponse<InverterPriceItem>> {
  const { data } = await apiClient.post('/inverters/backend/inverters_prices_current/', filters);
  return data;
}

export async function fetchInverterPriceHistory(
  inverterId: number,
  params?: { date_min?: string; date_max?: string }
): Promise<InverterPriceHistoryItem[]> {
  const { data } = await apiClient.post('/inverters/backend/inverters_prices/', {
    inverter_id: inverterId,
    ...params,
  });
  return data;
}

export async function fetchInverterBrands(): Promise<string[]> {
  const { data } = await apiClient.get('/inverters/backend/brands');
  return data;
}

export async function fetchInverterSuppliers(): Promise<string[]> {
  const { data } = await apiClient.get('/inverters/backend/suppliers');
  return data;
}
