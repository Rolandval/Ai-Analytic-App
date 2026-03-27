import { Tabs } from 'expo-router';
import { TabBar } from '@/components/layout/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="batteries" />
      <Tabs.Screen name="solar-panels" />
      <Tabs.Screen name="inverters" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
