export interface BalimallType {
  meta: {
    code: number;
    status: string;
    message: string | null;
  };
  result: {
    total_order: number;
    nominal_order: number;
    total_orders_by_category: CategoryData[];
    total_nominal_by_category: CategoryData[];
    total_order_by_year: OrderByYear[];
    total_order_by_month: OrderByMonth[];
    total_nominal_by_month: OrderByMonth[];
    states: StateData[];
    merchant: MerchantData[];
  };
}

type CategoryData = {
  category_name: string;
  total_orders: number;
  total_nominal: number;

  [key: string]: string | number; // Opsional jika ada tambahan properti dinamis
};

type StateData = {
  city: string;
  total: number;

  [key: string]: string | number; // Opsional jika ada tambahan properti dinamis
};

type MerchantData = {
  merchant_name: string;
  total_orders: number;
  total_nominal: number;

  [key: string]: string | number; // Opsional jika ada tambahan properti dinamis
};
type OrderByYear = {
  data: {
    total_orders: number;
    total_nominal: number; 
  }
}
type OrderByMonth = {
  [year: string]: {
    [month: string]: number;
  };
};
