import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Battery, Sun, Zap, Users, Search, BarChart3, Bell } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { useThemeStore } from '@/store/themeStore';
import { fetchBatteryPricesCurrent } from '@/api/batteries';
import { fetchSolarPanelPricesCurrent } from '@/api/solarPanels';
import { fetchInverterPricesCurrent } from '@/api/inverters';
import { useState } from 'react';

const statCards = [
  { key: 'batteries', label: 'Batteries', icon: Battery, gradient: ['#065f46', '#059669'] as const, route: '/(tabs)/batteries' },
  { key: 'panels', label: 'Panels', icon: Sun, gradient: ['#1e3a5f', '#2563eb'] as const, route: '/(tabs)/solar-panels' },
  { key: 'inverters', label: 'Inverters', icon: Zap, gradient: ['#3b0764', '#7c3aed'] as const, route: '/(tabs)/inverters' },
  { key: 'suppliers', label: 'Suppliers', icon: Users, gradient: ['#78350f', '#d97706'] as const, route: '/(tabs)/batteries' },
];

export default function DashboardScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const batteries = useQuery({
    queryKey: ['dashboard', 'batteries-count'],
    queryFn: () => fetchBatteryPricesCurrent({ page: 1, page_size: 1 }),
  });
  const panels = useQuery({
    queryKey: ['dashboard', 'panels-count'],
    queryFn: () => fetchSolarPanelPricesCurrent({ page: 1, page_size: 1 }),
  });
  const inverters = useQuery({
    queryKey: ['dashboard', 'inverters-count'],
    queryFn: () => fetchInverterPricesCurrent({ page: 1, page_size: 1 }),
  });

  const counts: Record<string, number> = {
    batteries: batteries.data?.total ?? 0,
    panels: panels.data?.total ?? 0,
    inverters: inverters.data?.total ?? 0,
    suppliers: 0,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([batteries.refetch(), panels.refetch(), inverters.refetch()]);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Dashboard" subtitle="AI Analytic" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Stats grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {statCards.map((card) => (
            <Pressable
              key={card.key}
              onPress={() => router.push(card.route as any)}
              style={{ width: '47%', flexGrow: 1 }}
            >
              <LinearGradient
                colors={[...card.gradient]}
                style={{ borderRadius: 12, padding: 16, minHeight: 90 }}
              >
                <card.icon size={20} color="#fff" style={{ marginBottom: 8, opacity: 0.8 }} />
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>{counts[card.key]}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{card.label}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { icon: Search, label: 'Search', onPress: () => router.push('/(tabs)/batteries') },
            { icon: BarChart3, label: 'Compare', onPress: () => {} },
            { icon: Bell, label: 'Alerts', onPress: () => {} },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                padding: 12,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <action.icon size={18} color={colors.textSecondary} />
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
