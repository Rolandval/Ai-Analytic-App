import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  color?: 'success' | 'danger' | 'warning' | 'accent' | 'muted';
}

const colorMap = {
  success: { bg: '#065f4620', text: '#22c55e' },
  danger: { bg: '#7f1d1d20', text: '#ef4444' },
  warning: { bg: '#78350f20', text: '#f59e0b' },
  accent: { bg: '#1e3a8a20', text: '#3b82f6' },
  muted: { bg: '#1e293b', text: '#94a3b8' },
};

export function Badge({ label, color = 'muted' }: BadgeProps) {
  const scheme = colorMap[color];

  return (
    <View style={{ backgroundColor: scheme.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: scheme.text }}>{label}</Text>
    </View>
  );
}
