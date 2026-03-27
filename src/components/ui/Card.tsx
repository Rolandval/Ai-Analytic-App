import { View, Pressable, type ViewProps } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface CardProps extends ViewProps {
  onPress?: () => void;
}

export function Card({ children, onPress, style, ...props }: CardProps) {
  const { colors } = useThemeStore();

  const content = (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
