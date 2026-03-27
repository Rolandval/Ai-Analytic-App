import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { SupplierPriceRow } from '@/components/products/SupplierPriceRow';
import { PriceLineChart } from '@/components/charts/PriceLineChart';
import { useThemeStore } from '@/store/themeStore';
import { formatPrice } from '@/lib/formatters';
import { fetchBatteryPricesCurrent, fetchBatteryPriceHistory } from '@/api/batteries';

export default function BatteryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const batteryId = Number(id);

  const { data: pricesData, isLoading } = useQuery({
    queryKey: ['batteries', 'detail', batteryId],
    queryFn: () => fetchBatteryPricesCurrent({ page: 1, page_size: 50, full_name: undefined }),
    enabled: !!batteryId,
    select: (data) => data.items.filter((item) => item.battery_id === batteryId),
  });

  const { data: historyData } = useQuery({
    queryKey: ['batteries', 'history', batteryId],
    queryFn: () => fetchBatteryPriceHistory(batteryId),
    enabled: !!batteryId,
  });

  const product = pricesData?.[0];
  const sortedPrices = [...(pricesData ?? [])].sort((a, b) => a.price - b.price);
  const bestPrice = sortedPrices[0]?.price;

  const chartData = (historyData ?? []).map((h) => ({ date: h.date, price: h.price }));

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title={product?.full_name ?? 'Battery'}
        subtitle={product ? `${product.volume}Ah ${product.c_amps}A ${product.polarity} ${product.electrolyte}` : ''}
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Best price */}
        {bestPrice !== undefined && (
          <Card>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>Best Price</Text>
            <Text style={{ fontSize: 32, fontWeight: '700', color: colors.success }}>{formatPrice(bestPrice)}</Text>
          </Card>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
              Price History
            </Text>
            <PriceLineChart data={chartData} />
          </Card>
        )}

        {/* Supplier prices */}
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
          Supplier Prices ({sortedPrices.length})
        </Text>
        <View style={{ gap: 8 }}>
          {sortedPrices.map((sp, i) => (
            <SupplierPriceRow
              key={`${sp.supplier}-${i}`}
              supplier={sp.supplier}
              status={sp.supplier_status}
              price={sp.price}
              availability={sp.availability}
              date={sp.date}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
