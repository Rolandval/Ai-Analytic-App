export interface SolarPanelPriceItem {
  id: number;
  solar_panel_id: number;
  full_name: string;
  brand: string;
  power: number;
  panel_type: string;
  cell_type: string;
  panel_color: string;
  frame_color: string;
  supplier: string;
  supplier_status: string;
  price: number;
  price_per_w: number | null;
  availability: number | null;
  date: string;
}

export interface SolarPanelPriceFilters {
  full_name?: string;
  brands?: string[];
  suppliers?: string[];
  power_min?: number;
  power_max?: number;
  price_min?: number;
  price_max?: number;
  panel_type?: string;
  cell_type?: string;
  panel_color?: string;
  frame_color?: string;
  supplier_status?: string[];
  date_min?: string;
  date_max?: string;
  price_sort?: 'asc' | 'desc';
  page: number;
  page_size: number;
}

export interface SolarPanelPriceHistoryItem {
  id: number;
  solar_panel_id: number;
  price: number;
  price_per_w: number | null;
  date: string;
  supplier: string;
}
