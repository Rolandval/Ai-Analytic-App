import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'ai-analytic-app' });

export const mmkvStorage = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};
