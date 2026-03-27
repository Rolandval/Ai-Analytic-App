import { apiClient } from './client';
import type { SolarPanelPriceItem, SolarPanelPriceFilters, SolarPanelPriceHistoryItem } from '@/types/solarPanel';
import type { PaginatedResponse } from '@/types/api';

export async function fetchSolarPanelPricesCurrent(
  filters: SolarPanelPriceFilters
): Promise<PaginatedResponse<SolarPanelPriceItem>> {
  const { data } = await apiClient.post('/solar_panels/backend/solar_panels_prices_current/', filters);
  return data;
}

export async function fetchSolarPanelPriceHistory(
  panelId: number,
  params?: { date_min?: string; date_max?: string }
): Promise<SolarPanelPriceHistoryItem[]> {
  const { data } = await apiClient.post('/solar_panels/backend/solar_panels_prices/', {
    solar_panel_id: panelId,
    ...params,
  });
  return data;
}

export async function fetchSolarPanelBrands(): Promise<string[]> {
  const { data } = await apiClient.get('/solar_panels/backend/brands');
  return data;
}

export async function fetchSolarPanelSuppliers(): Promise<string[]> {
  const { data } = await apiClient.get('/solar_panels/backend/suppliers');
  return data;
}
