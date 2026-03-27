import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuthStore();
  const { colors } = useThemeStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          {/* Logo area */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={{ width: 64, height: 64, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
            >
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>AI</Text>
            </LinearGradient>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>AI Analytic</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              Monitor prices. Analyze markets.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />

            {error ? (
              <View style={{ backgroundColor: colors.dangerBg, padding: 12, borderRadius: 8 }}>
                <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
              </View>
            ) : null}

            <Button title="Login" onPress={handleSubmit(onSubmit)} loading={loading} />

            <Pressable onPress={() => router.push('/(auth)/register')} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: colors.accent, fontSize: 14 }}>
                Don't have an account? <Text style={{ fontWeight: '600' }}>Register</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
