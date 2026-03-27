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
import { useSolarPanelPrices } from '@/hooks/useSolarPanels';
import { useFilterStore } from '@/store/filterStore';
import { useThemeStore } from '@/store/themeStore';
import { useDebounce } from '@/hooks/useDebounce';
import type { SolarPanelPriceItem } from '@/types/solarPanel';

const solarFilterConfig = [
  { key: 'panel_type', label: 'Panel Type', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Single', value: 'одностороння' }, { label: 'Double', value: 'двостороння' }
  ]},
  { key: 'cell_type', label: 'Cell Type', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'p-type', value: 'p-type' }, { label: 'n-type', value: 'n-type' }
  ]},
  { key: 'panel_color', label: 'Panel Color', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Default', value: 'Default' }, { label: 'All Black', value: 'All Black' }
  ]},
  { key: 'frame_color', label: 'Frame Color', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Black', value: 'black' }, { label: 'Silver', value: 'silver' }
  ]},
  { key: 'supplier_status', label: 'Supplier Status', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Me', value: 'ME' }, { label: 'Supplier', value: 'SUPPLIER' }, { label: 'Competitor', value: 'COMPETITOR' }
  ]},
  { key: 'power', label: 'Power (W)', type: 'range' as const },
  { key: 'price', label: 'Price ($)', type: 'range' as const },
];

export default function SolarPanelListScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { solarPanel: filters, setSolarPanelFilters, resetSolarPanelFilters } = useFilterStore();
  const [search, setSearch] = useState(filters.full_name ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const queryFilters = useMemo(
    () => ({ ...filters, full_name: debouncedSearch || undefined, page_size: 20 }),
    [filters, debouncedSearch]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useSolarPanelPrices(queryFilters);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const renderItem = useCallback(
    ({ item }: { item: SolarPanelPriceItem }) => (
      <ProductCard
        name={item.full_name}
        specs={`${item.power}W ${item.panel_type} ${item.cell_type}`}
        price={item.price}
        onPress={() => router.push(`/(tabs)/solar-panels/${item.solar_panel_id}`)}
      />
    ),
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Solar Panels" subtitle="Current Prices" />
      <View style={{ padding: 12, gap: 8 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search solar panels..." />
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
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>No solar panels found</Text>
              <Pressable onPress={resetSolarPanelFilters} style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: colors.accent }}>Clear filters</Text>
              </Pressable>
            </View>
          }
        />
      )}
      <ProductFilters
        ref={bottomSheetRef}
        filters={filters}
        onChangeFilter={(key, value) => setSolarPanelFilters({ [key]: value })}
        onReset={() => { resetSolarPanelFilters(); bottomSheetRef.current?.close(); }}
        onApply={() => bottomSheetRef.current?.close()}
        filterConfig={solarFilterConfig}
      />
    </View>
  );
}
