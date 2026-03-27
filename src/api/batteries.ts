import { apiClient } from './client';
import type { BatteryPriceItem, BatteryPriceFilters, BatteryPriceHistoryItem } from '@/types/battery';
import type { PaginatedResponse } from '@/types/api';

export async function fetchBatteryPricesCurrent(
  filters: BatteryPriceFilters
): Promise<PaginatedResponse<BatteryPriceItem>> {
  const { data } = await apiClient.post('/batteries/backend/batteries_prices_current/', filters);
  return data;
}

export async function fetchBatteryPriceHistory(
  batteryId: number,
  params?: { date_min?: string; date_max?: string }
): Promise<BatteryPriceHistoryItem[]> {
  const { data } = await apiClient.post('/batteries/backend/batteries_prices/', {
    battery_id: batteryId,
    ...params,
  });
  return data;
}

export async function fetchBatteryBrands(): Promise<string[]> {
  const { data } = await apiClient.get('/batteries/backend/brands');
  return data;
}

export async function fetchBatterySuppliers(): Promise<string[]> {
  const { data } = await apiClient.get('/batteries/backend/suppliers');
  return data;
}
