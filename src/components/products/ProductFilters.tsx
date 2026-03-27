import { View, Text, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/themeStore';

interface FilterConfig {
  key: string;
  label: string;
  type: 'segment' | 'range';
  options?: { label: string; value: string }[];
}

interface ProductFiltersProps {
  filters: Record<string, any>;
  onChangeFilter: (key: string, value: any) => void;
  onReset: () => void;
  onApply: () => void;
  filterConfig: FilterConfig[];
}

export const ProductFilters = forwardRef<BottomSheet, ProductFiltersProps>(
  ({ filters, onChangeFilter, onReset, onApply, filterConfig }, ref) => {
    const { colors } = useThemeStore();
    const snapPoints = useMemo(() => ['70%'], []);

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) onApply();
    }, [onApply]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>
            Filters
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ gap: 14 }}>
              {filterConfig.map((cfg) => {
                if (cfg.type === 'segment' && cfg.options) {
                  return (
                    <View key={cfg.key}>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>{cfg.label}</Text>
                      <SegmentedControl
                        options={cfg.options}
                        value={
                          Array.isArray(filters[cfg.key])
                            ? filters[cfg.key]?.[0] ?? '__all__'
                            : filters[cfg.key] ?? '__all__'
                        }
                        onChange={(v) => {
                          if (v === '__all__') {
                            onChangeFilter(cfg.key, undefined);
                          } else if (cfg.key === 'supplier_status' || cfg.key === 'electrolyte') {
                            onChangeFilter(cfg.key, [v]);
                          } else {
                            onChangeFilter(cfg.key, v);
                          }
                        }}
                      />
                    </View>
                  );
                }

                if (cfg.type === 'range') {
                  return (
                    <View key={cfg.key}>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>{cfg.label}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Input
                            placeholder="Min"
                            keyboardType="numeric"
                            value={filters[`${cfg.key}_min`]?.toString() ?? ''}
                            onChangeText={(v) => onChangeFilter(`${cfg.key}_min`, v ? Number(v) : undefined)}
                          />
                        </View>
                        <Text style={{ color: colors.textMuted }}>—</Text>
                        <View style={{ flex: 1 }}>
                          <Input
                            placeholder="Max"
                            keyboardType="numeric"
                            value={filters[`${cfg.key}_max`]?.toString() ?? ''}
                            onChangeText={(v) => onChangeFilter(`${cfg.key}_max`, v ? Number(v) : undefined)}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }

                return null;
              })}
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, paddingBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Button title="Reset" variant="outline" onPress={onReset} />
            </View>
            <View style={{ flex: 2 }}>
              <Button title="Apply Filters" onPress={onApply} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
