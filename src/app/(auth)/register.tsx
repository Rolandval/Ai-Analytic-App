import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { register } = useAuthStore();
  const { colors } = useThemeStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setLoading(true);
    try {
      await register(data.email, data.password);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>Create Account</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              Join AI Analytic platform
            </Text>
          </View>

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
                  placeholder="Min 6 characters"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Repeat password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {error ? (
              <View style={{ backgroundColor: colors.dangerBg, padding: 12, borderRadius: 8 }}>
                <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
              </View>
            ) : null}

            <Button title="Register" onPress={handleSubmit(onSubmit)} loading={loading} />

            <Pressable onPress={() => router.back()} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: colors.accent, fontSize: 14 }}>
                Already have an account? <Text style={{ fontWeight: '600' }}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
