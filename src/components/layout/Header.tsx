import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { getInitials } from '@/lib/formatters';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { colors } = useThemeStore();
  const { userEmail } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          {subtitle && <Text style={{ fontSize: 12, color: '#cbd5e1' }}>{subtitle}</Text>}
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#ffffff' }}>{title}</Text>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            {userEmail ? getInitials(userEmail) : '?'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
