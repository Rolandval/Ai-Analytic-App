import { View, Text, FlatList, RefreshControl, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState, useCallback, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { useInverterPrices } from '@/hooks/useInverters';
import { useFilterStore } from '@/store/filterStore';
import { useThemeStore } from '@/store/themeStore';
import { useDebounce } from '@/hooks/useDebounce';
import type { InverterPriceItem } from '@/types/inverter';

const inverterFilterConfig = [
  { key: 'inverter_type', label: 'Type', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'on-grid', value: 'on_grid' }, { label: 'off-grid', value: 'off_grid' },
    { label: 'hybrid', value: 'hybrid' }, { label: 'grid-tie', value: 'grid-tie' }
  ]},
  { key: 'generation', label: 'Generation', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: '1G', value: '1G' }, { label: '2G', value: '2G' }, { label: '3G', value: '3G' }
  ]},
  { key: 'supplier_status', label: 'Supplier Status', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Me', value: 'ME' }, { label: 'Supplier', value: 'SUPPLIER' }, { label: 'Competitor', value: 'COMPETITOR' }
  ]},
  { key: 'power', label: 'Power (W)', type: 'range' as const },
  { key: 'price', label: 'Price ($)', type: 'range' as const },
];

export default function InverterListScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { inverter: filters, setInverterFilters, resetInverterFilters } = useFilterStore();
  const [search, setSearch] = useState(filters.full_name ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const queryFilters = useMemo(
    () => ({ ...filters, full_name: debouncedSearch || undefined, page_size: 20 }),
    [filters, debouncedSearch]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useInverterPrices(queryFilters);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const renderItem = useCallback(
    ({ item }: { item: InverterPriceItem }) => (
      <ProductCard
        name={item.full_name}
        specs={`${item.power}W ${item.inverter_type} ${item.generation}`}
        price={item.price}
        onPress={() => router.push(`/(tabs)/inverters/${item.inverter_id}`)}
      />
    ),
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Inverters" subtitle="Current Prices" />
      <View style={{ padding: 12, gap: 8 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search inverters..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <Pressable
            onPress={() => bottomSheetRef.current?.expand()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface,
              borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}
          >
            <SlidersHorizontal size={12} color={colors.textSecondary} />
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>Filters</Text>
          </Pressable>
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={{ padding: 12, gap: 8 }}>{[1,2,3,4].map(i => <Skeleton key={i} width="100%" height={80} />)}</View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.id}-${item.supplier}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={colors.accent} />}
          ListFooterComponent={isFetchingNextPage ? <Skeleton width="100%" height={80} /> : null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>No inverters found</Text>
              <Pressable onPress={resetInverterFilters} style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: colors.accent }}>Clear filters</Text>
              </Pressable>
            </View>
          }
        />
      )}
      <ProductFilters
        ref={bottomSheetRef}
        filters={filters}
        onChangeFilter={(key, value) => setInverterFilters({ [key]: value })}
        onReset={() => { resetInverterFilters(); bottomSheetRef.current?.close(); }}
        onApply={() => bottomSheetRef.current?.close()}
        filterConfig={inverterFilterConfig}
      />
    </View>
  );
}
