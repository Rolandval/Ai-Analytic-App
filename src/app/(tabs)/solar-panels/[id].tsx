import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { SupplierPriceRow } from '@/components/products/SupplierPriceRow';
import { PriceLineChart } from '@/components/charts/PriceLineChart';
import { useThemeStore } from '@/store/themeStore';
import { formatPrice } from '@/lib/formatters';
import { fetchSolarPanelPricesCurrent, fetchSolarPanelPriceHistory } from '@/api/solarPanels';

export default function SolarPanelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeStore();
  const panelId = Number(id);

  const { data: pricesData, isLoading } = useQuery({
    queryKey: ['solarPanels', 'detail', panelId],
    queryFn: () => fetchSolarPanelPricesCurrent({ page: 1, page_size: 50 }),
    enabled: !!panelId,
    select: (data) => data.items.filter((item) => item.solar_panel_id === panelId),
  });

  const { data: historyData } = useQuery({
    queryKey: ['solarPanels', 'history', panelId],
    queryFn: () => fetchSolarPanelPriceHistory(panelId),
    enabled: !!panelId,
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
      <Header title={product?.full_name ?? 'Solar Panel'} subtitle={product ? `${product.power}W ${product.panel_type}` : ''} />
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
