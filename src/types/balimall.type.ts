export interface BalimallType {
  totalOrderByDate: OrderByDateItem[];
  states: StatesItem[];
  merchant: MerchantItem[];
  ordersByCategory: OrdersByCategory[];
}

export interface OrderByDateItem {
  date: string;
  total_orders: number;
  total_nominal: number;
}

export type StatesItem = {
  tanggal: string;
  data: StateDataItem[];
  city: string;
  total: number;
  total_nominal: number;
};
export interface StateDataItem {
  city: string;
  total: number;
  total_nominal: number;
}

export interface MerchantItem {
  tanggal: string; // format: YYYY-MM-DD
  data: MerchantDataItem[];
}
export interface MerchantDataItem {
  merchant_name: string;
  total_orders: number;
  total_nominal: number;
}

export interface OrdersByCategory{
  tanggal: string; // format YYYY-MM-DD
  data: OrderCategoryItem[];
}
export interface OrderCategoryItem {
  category_name: string;
  total_orders: number;
  total_nominal: number;
}
