import { View, Text } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface PriceTrendCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

export function PriceTrendCard({ title, value, change, positive }: PriceTrendCardProps) {
  const { colors } = useThemeStore();

  return (
    <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12 }}>
      <Text style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{value}</Text>
      <Text style={{ fontSize: 11, color: positive ? colors.success : colors.danger, marginTop: 2 }}>
        {change}
      </Text>
    </View>
  );
}
