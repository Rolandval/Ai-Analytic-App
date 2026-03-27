import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import type { BatteryPriceFilters } from '@/types/battery';
import type { SolarPanelPriceFilters } from '@/types/solarPanel';
import type { InverterPriceFilters } from '@/types/inverter';

type BatteryFilterState = Omit<BatteryPriceFilters, 'page' | 'page_size'>;
type SolarPanelFilterState = Omit<SolarPanelPriceFilters, 'page' | 'page_size'>;
type InverterFilterState = Omit<InverterPriceFilters, 'page' | 'page_size'>;

interface FilterState {
  battery: BatteryFilterState;
  solarPanel: SolarPanelFilterState;
  inverter: InverterFilterState;
  setBatteryFilters: (filters: Partial<BatteryFilterState>) => void;
  setSolarPanelFilters: (filters: Partial<SolarPanelFilterState>) => void;
  setInverterFilters: (filters: Partial<InverterFilterState>) => void;
  resetBatteryFilters: () => void;
  resetSolarPanelFilters: () => void;
  resetInverterFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      battery: {},
      solarPanel: {},
      inverter: {},
      setBatteryFilters: (filters) =>
        set((state) => ({ battery: { ...state.battery, ...filters } })),
      setSolarPanelFilters: (filters) =>
        set((state) => ({ solarPanel: { ...state.solarPanel, ...filters } })),
      setInverterFilters: (filters) =>
        set((state) => ({ inverter: { ...state.inverter, ...filters } })),
      resetBatteryFilters: () => set({ battery: {} }),
      resetSolarPanelFilters: () => set({ solarPanel: {} }),
      resetInverterFilters: () => set({ inverter: {} }),
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
