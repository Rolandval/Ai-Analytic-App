import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { SupplierPriceRow } from '@/components/products/SupplierPriceRow';
import { PriceLineChart } from '@/components/charts/PriceLineChart';
import { useThemeStore } from '@/store/themeStore';
import { formatPrice } from '@/lib/formatters';
import { fetchInverterPricesCurrent, fetchInverterPriceHistory } from '@/api/inverters';

export default function InverterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const inverterId = Number(id);

  const { data: pricesData, isLoading } = useQuery({
    queryKey: ['inverters', 'detail', inverterId],
    queryFn: () => fetchInverterPricesCurrent({ page: 1, page_size: 50 }),
    enabled: !!inverterId,
    select: (data) => data.items.filter((item) => item.inverter_id === inverterId),
  });

  const { data: historyData } = useQuery({
    queryKey: ['inverters', 'history', inverterId],
    queryFn: () => fetchInverterPriceHistory(inverterId),
    enabled: !!inverterId,
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
      <Header title={product?.full_name ?? 'Inverter'} subtitle={product ? `${product.power}W ${product.inverter_type}` : ''} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {bestPrice !== undefined && (
          <Card>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>Best Price</Text>
            <Text style={{ fontSize: 32, fontWeight: '700', color: colors.success }}>{formatPrice(bestPrice)}</Text>
          </Card>
        )}
        {chartData.length > 0 && (
          <Card>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>Price History</Text>
            <PriceLineChart data={chartData} />
          </Card>
        )}
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>Supplier Prices ({sortedPrices.length})</Text>
        <View style={{ gap: 8 }}>
          {sortedPrices.map((sp, i) => (
            <SupplierPriceRow key={`${sp.supplier}-${i}`} supplier={sp.supplier} status={sp.supplier_status}
              price={sp.price} availability={sp.availability} date={sp.date} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
