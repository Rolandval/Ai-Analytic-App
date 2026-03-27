import { View, Pressable, Text } from 'react-native';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Battery, Sun, Zap, User } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons: Record<string, typeof Home> = {
  index: Home,
  batteries: Battery,
  'solar-panels': Sun,
  inverters: Zap,
  profile: User,
};

const labels: Record<string, string> = {
  index: 'Home',
  batteries: 'Batteries',
  'solar-panels': 'Panels',
  inverters: 'Inverters',
  profile: 'Profile',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.tabBarBg,
        borderTopWidth: 1,
        borderTopColor: colors.tabBarBorder,
        paddingBottom: insets.bottom || 8,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const Icon = icons[route.name] || Home;
        const label = labels[route.name] || route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            {isFocused && (
              <View style={{ width: 20, height: 3, backgroundColor: colors.tabBarActive, borderRadius: 2, marginBottom: 2 }} />
            )}
            <Icon size={20} color={isFocused ? colors.tabBarActive : colors.tabBarInactive} />
            <Text style={{ fontSize: 10, color: isFocused ? colors.tabBarActive : colors.tabBarInactive }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
