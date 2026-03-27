import { View, Text, FlatList, RefreshControl, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState, useCallback, useRef } from 'react';
import { SlidersHorizontal, X } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBatteryPrices } from '@/hooks/useBatteries';
import { useFilterStore } from '@/store/filterStore';
import { useThemeStore } from '@/store/themeStore';
import { useDebounce } from '@/hooks/useDebounce';
import type { BatteryPriceItem } from '@/types/battery';

const batteryFilterConfig = [
  { key: 'region', label: 'Region', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'EUROPE', value: 'EUROPE' }, { label: 'ASIA', value: 'ASIA' }
  ]},
  { key: 'polarity', label: 'Polarity', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'L+', value: 'L+' }, { label: 'R+', value: 'R+' }
  ]},
  { key: 'electrolyte', label: 'Electrolyte', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'AGM', value: 'AGM' }, { label: 'EFB', value: 'EFB' }, { label: 'GEL', value: 'GEL' }
  ]},
  { key: 'supplier_status', label: 'Supplier Status', type: 'segment' as const, options: [
    { label: 'All', value: '__all__' }, { label: 'Me', value: 'ME' }, { label: 'Supplier', value: 'SUPPLIER' }, { label: 'Competitor', value: 'COMPETITOR' }
  ]},
  { key: 'volume', label: 'Volume (Ah)', type: 'range' as const },
  { key: 'c_amps', label: 'Cranking Amps (A)', type: 'range' as const },
  { key: 'price', label: 'Price ($)', type: 'range' as const },
];

export default function BatteryListScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { battery: filters, setBatteryFilters, resetBatteryFilters } = useFilterStore();
  const [search, setSearch] = useState(filters.full_name ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const queryFilters = useMemo(
    () => ({ ...filters, full_name: debouncedSearch || undefined, page_size: 20 }),
    [filters, debouncedSearch]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useBatteryPrices(queryFilters);

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
  ).length;

  const renderItem = useCallback(
    ({ item }: { item: BatteryPriceItem }) => (
      <ProductCard
        name={item.full_name}
        specs={`${item.volume}Ah ${item.c_amps}A ${item.polarity} ${item.electrolyte}`}
        price={item.price}
        region={item.region}
        onPress={() => router.push(`/(tabs)/batteries/${item.battery_id}`)}
      />
    ),
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Batteries" subtitle="Current Prices" />

      <View style={{ padding: 12, gap: 8 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search batteries..." />

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {filters.region && (
              <Pressable
                onPress={() => setBatteryFilters({ region: undefined })}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accent + '20',
                  borderWidth: 1, borderColor: colors.accent + '50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}
              >
                <Text style={{ fontSize: 11, color: colors.accentLight }}>{filters.region}</Text>
                <X size={10} color={colors.accentLight} />
              </Pressable>
            )}
            {filters.electrolyte?.map((e) => (
              <Pressable
                key={e}
                onPress={() => setBatteryFilters({ electrolyte: filters.electrolyte?.filter((x) => x !== e) })}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface,
                  borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}
              >
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{e}</Text>
                <X size={10} color={colors.textMuted} />
              </Pressable>
            ))}
            <Pressable
              onPress={() => bottomSheetRef.current?.expand()}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface,
                borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}
            >
              <SlidersHorizontal size={12} color={colors.textSecondary} />
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ padding: 12, gap: 8 }}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} width="100%" height={80} />)}
        </View>
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
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>No batteries found</Text>
              <Pressable onPress={resetBatteryFilters} style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 14, color: colors.accent }}>Clear filters</Text>
              </Pressable>
            </View>
          }
        />
      )}
      <ProductFilters
        ref={bottomSheetRef}
        filters={filters}
        onChangeFilter={(key, value) => setBatteryFilters({ [key]: value })}
        onReset={() => { resetBatteryFilters(); bottomSheetRef.current?.close(); }}
        onApply={() => bottomSheetRef.current?.close()}
        filterConfig={batteryFilterConfig}
      />
    </View>
  );
}
