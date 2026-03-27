import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchInverterPricesCurrent,
  fetchInverterPriceHistory,
  fetchInverterBrands,
  fetchInverterSuppliers,
} from '@/api/inverters';
import type { InverterPriceFilters } from '@/types/inverter';

export function useInverterPrices(filters: Omit<InverterPriceFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['inverters', 'prices', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchInverterPricesCurrent({ ...filters, page: pageParam, page_size: filters.page_size ?? 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });
}

export function useInverterPriceHistory(inverterId: number, dateRange?: { date_min?: string; date_max?: string }) {
  return useQuery({
    queryKey: ['inverters', 'history', inverterId, dateRange],
    queryFn: () => fetchInverterPriceHistory(inverterId, dateRange),
    enabled: !!inverterId,
  });
}

export function useInverterBrands() {
  return useQuery({
    queryKey: ['inverters', 'brands'],
    queryFn: fetchInverterBrands,
    staleTime: 1000 * 60 * 60,
  });
}

export function useInverterSuppliers() {
  return useQuery({
    queryKey: ['inverters', 'suppliers'],
    queryFn: fetchInverterSuppliers,
    staleTime: 1000 * 60 * 60,
  });
}
