import { View, Text, Pressable } from 'react-native';
import { MapPin, Users } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { formatPrice } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  name: string;
  specs: string;
  price: number;
  region?: string;
  supplierCount?: number;
  priceChange?: number;
  onPress: () => void;
}

export function ProductCard({ name, specs, price, region, supplierCount, priceChange, onPress }: ProductCardProps) {
  const { colors } = useThemeStore();

  const changeColor = !priceChange ? 'muted' : priceChange > 0 ? 'success' : 'danger';
  const changeText = priceChange
    ? `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(1)}%`
    : '0%';

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }} numberOfLines={1}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
            {specs}
          </Text>
        </View>
        <Badge label={formatPrice(price)} color={changeColor === 'muted' ? 'muted' : changeColor} />
      </View>

      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        {region && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{region}</Text>
          </View>
        )}
        {supplierCount !== undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Users size={10} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{supplierCount} suppliers</Text>
          </View>
        )}
        <Text style={{ fontSize: 11, color: changeColor === 'success' ? colors.success : changeColor === 'danger' ? colors.danger : colors.textMuted }}>
          {changeText}
        </Text>
      </View>
    </Pressable>
  );
}
