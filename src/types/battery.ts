export interface BatteryPriceItem {
  id: number;
  battery_id: number;
  full_name: string;
  brand: string;
  volume: number;
  c_amps: number;
  region: string;
  polarity: string;
  electrolyte: string;
  supplier: string;
  supplier_status: string;
  price: number;
  availability: number | null;
  date: string;
}

export interface BatteryPriceFilters {
  full_name?: string;
  brands?: string[];
  suppliers?: string[];
  volume_min?: number;
  volume_max?: number;
  c_amps_min?: number;
  c_amps_max?: number;
  price_min?: number;
  price_max?: number;
  region?: string;
  polarity?: string;
  electrolyte?: string[];
  supplier_status?: string[];
  date_min?: string;
  date_max?: string;
  price_sort?: 'asc' | 'desc';
  page: number;
  page_size: number;
}

export interface BatteryPriceHistoryItem {
  id: number;
  battery_id: number;
  price: number;
  date: string;
  supplier: string;
}
