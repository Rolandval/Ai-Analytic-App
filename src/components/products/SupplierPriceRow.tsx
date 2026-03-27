import { View, Text } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/formatters';

interface SupplierPriceRowProps {
  supplier: string;
  status: string;
  price: number;
  availability: number | null;
  date: string;
}

export function SupplierPriceRow({ supplier, status, price, availability, date }: SupplierPriceRowProps) {
  const { colors } = useThemeStore();

  const statusColor = status === 'ME' ? 'accent' : status === 'SUPPLIER' ? 'success' : 'warning';
  const statusLabel = status === 'ME' ? 'Me' : status === 'SUPPLIER' ? 'Supplier' : 'Competitor';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        gap: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textPrimary }}>{supplier}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{formatDate(date)}</Text>
      </View>
      <Badge label={statusLabel} color={statusColor} />
      {availability !== null && (
        <Text style={{ fontSize: 11, color: colors.textSecondary }}>{availability} pcs</Text>
      )}
      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{formatPrice(price)}</Text>
    </View>
  );
}
