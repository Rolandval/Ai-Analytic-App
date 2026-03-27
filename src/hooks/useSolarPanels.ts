import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchSolarPanelPricesCurrent,
  fetchSolarPanelPriceHistory,
  fetchSolarPanelBrands,
  fetchSolarPanelSuppliers,
} from '@/api/solarPanels';
import type { SolarPanelPriceFilters } from '@/types/solarPanel';

export function useSolarPanelPrices(filters: Omit<SolarPanelPriceFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['solarPanels', 'prices', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchSolarPanelPricesCurrent({ ...filters, page: pageParam, page_size: filters.page_size ?? 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });
}

export function useSolarPanelPriceHistory(panelId: number, dateRange?: { date_min?: string; date_max?: string }) {
  return useQuery({
    queryKey: ['solarPanels', 'history', panelId, dateRange],
    queryFn: () => fetchSolarPanelPriceHistory(panelId, dateRange),
    enabled: !!panelId,
  });
}

export function useSolarPanelBrands() {
  return useQuery({
    queryKey: ['solarPanels', 'brands'],
    queryFn: fetchSolarPanelBrands,
    staleTime: 1000 * 60 * 60,
  });
}

export function useSolarPanelSuppliers() {
  return useQuery({
    queryKey: ['solarPanels', 'suppliers'],
    queryFn: fetchSolarPanelSuppliers,
    staleTime: 1000 * 60 * 60,
  });
}
