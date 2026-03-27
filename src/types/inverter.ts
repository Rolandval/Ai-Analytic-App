export interface InverterPriceItem {
  id: number;
  inverter_id: number;
  full_name: string;
  brand: string;
  power: number;
  inverter_type: string;
  generation: string;
  string_count: number | null;
  supplier: string;
  supplier_status: string;
  price: number;
  availability: number | null;
  date: string;
}

export interface InverterPriceFilters {
  full_name?: string;
  brands?: string[];
  suppliers?: string[];
  power_min?: number;
  power_max?: number;
  price_min?: number;
  price_max?: number;
  inverter_type?: string;
  generation?: string;
  supplier_status?: string[];
  date_min?: string;
  date_max?: string;
  price_sort?: 'asc' | 'desc';
  page: number;
  page_size: number;
}

export interface InverterPriceHistoryItem {
  id: number;
  inverter_id: number;
  price: number;
  date: string;
  supplier: string;
}
