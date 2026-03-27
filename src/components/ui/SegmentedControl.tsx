import { View, Text, Pressable } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  const { colors } = useThemeStore();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 2,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderRadius: 6,
              alignItems: 'center',
              backgroundColor: isActive ? colors.accent : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#ffffff' : colors.textMuted,
              }}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
