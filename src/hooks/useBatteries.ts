import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchBatteryPricesCurrent,
  fetchBatteryPriceHistory,
  fetchBatteryBrands,
  fetchBatterySuppliers,
} from '@/api/batteries';
import type { BatteryPriceFilters } from '@/types/battery';

export function useBatteryPrices(filters: Omit<BatteryPriceFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['batteries', 'prices', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchBatteryPricesCurrent({ ...filters, page: pageParam, page_size: filters.page_size ?? 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });
}

export function useBatteryPriceHistory(batteryId: number, dateRange?: { date_min?: string; date_max?: string }) {
  return useQuery({
    queryKey: ['batteries', 'history', batteryId, dateRange],
    queryFn: () => fetchBatteryPriceHistory(batteryId, dateRange),
    enabled: !!batteryId,
  });
}

export function useBatteryBrands() {
  return useQuery({
    queryKey: ['batteries', 'brands'],
    queryFn: fetchBatteryBrands,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useBatterySuppliers() {
  return useQuery({
    queryKey: ['batteries', 'suppliers'],
    queryFn: fetchBatterySuppliers,
    staleTime: 1000 * 60 * 60,
  });
}
