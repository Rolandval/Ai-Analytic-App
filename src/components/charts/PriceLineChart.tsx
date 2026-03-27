import { View, Text, Pressable } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';
import { useThemeStore } from '@/store/themeStore';
import { useState } from 'react';

interface PriceLineChartProps {
  data: { date: string; price: number }[];
}

const periods = ['7d', '30d', '90d', '1y'] as const;
type Period = typeof periods[number];

const periodDays: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };

export function PriceLineChart({ data }: PriceLineChartProps) {
  const { colors } = useThemeStore();
  const [period, setPeriod] = useState<Period>('30d');

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays[period]);

  const filtered = data
    .filter((d) => new Date(d.date) >= cutoff)
    .map((d) => ({ date: new Date(d.date).getTime(), price: d.price }));

  return (
    <View>
      {/* Period selector */}
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
        {periods.map((p) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: period === p ? colors.accent : colors.background,
            }}
          >
            <Text style={{ fontSize: 11, color: period === p ? '#fff' : colors.textMuted }}>{p}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.length > 1 ? (
        <View style={{ height: 200 }}>
          <CartesianChart
            data={filtered}
            xKey="date"
            yKeys={['price']}
            axisOptions={{
              tickCount: { x: 5, y: 4 },
              labelColor: colors.textMuted,
              lineColor: colors.border,
              labelOffset: { x: 2, y: 4 },
              formatXLabel: (value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              },
              formatYLabel: (value) => `$${value}`,
            }}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  points={points.price}
                  y0={chartBounds.bottom}
                  color={colors.accent + '30'}
                />
                <Line
                  points={points.price}
                  color={colors.accent}
                  strokeWidth={2}
                />
              </>
            )}
          </CartesianChart>
        </View>
      ) : (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textMuted }}>Not enough data for chart</Text>
        </View>
      )}
    </View>
  );
}
