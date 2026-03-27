import { Pressable, Text, ActivityIndicator, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/themeStore';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'gradient' | 'outline' | 'ghost';
  loading?: boolean;
}

export function Button({ title, variant = 'gradient', loading, disabled, style, ...props }: ButtonProps) {
  const { colors } = useThemeStore();
  const isDisabled = disabled || loading;

  // Flatten the consumer-provided style so it's always a plain ViewStyle (no callback)
  const flatStyle = StyleSheet.flatten(style as ViewStyle) ?? {};

  if (variant === 'gradient') {
    return (
      <Pressable
        disabled={isDisabled}
        style={[{ opacity: isDisabled ? 0.5 : 1 }, flatStyle]}
        {...props}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center' }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      style={[
        {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignItems: 'center',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
          opacity: isDisabled ? 0.5 : 1,
        },
        flatStyle,
      ]}
      {...props}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}
