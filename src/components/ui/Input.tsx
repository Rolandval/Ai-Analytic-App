import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useThemeStore();

  return (
    <View style={{ gap: 4 }}>
      {label && (
        <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textSecondary }}>{label}</Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 14,
            color: colors.textPrimary,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text style={{ fontSize: 12, color: colors.danger }}>{error}</Text>
      )}
    </View>
  );
}
