import { View, Text, Switch, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/formatters';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useThemeStore();
  const { userEmail, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Profile" />

      <View style={{ padding: 16, gap: 16 }}>
        {/* User info */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>
                {userEmail ? getInitials(userEmail) : '?'}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                {userEmail ?? 'User'}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>AI Analytic</Text>
            </View>
          </View>
        </Card>

        {/* Theme toggle */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Dark Mode</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                {isDark ? 'Neo-Dark Premium' : 'Clean Light'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* App info */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Version</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted }}>
              {Constants.expoConfig?.version ?? '1.0.0'}
            </Text>
          </View>
        </Card>

        {/* Logout */}
        <Button title="Logout" variant="outline" onPress={handleLogout} />
      </View>
    </View>
  );
}
