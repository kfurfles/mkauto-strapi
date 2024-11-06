export interface Car {
  id: number;
  model: string;
  noDeposit: boolean;
  freeDelivery: boolean;
  slug: string;
  compositeName: string;
  enable: boolean;
  seats: string;
  year: number;
  power: number;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  recommended: boolean;
  categories: { name: string; slug: string, url: string }[];
  color: {
    name: string;
    hex: string;
    slug: string;
  };
  brand: {
    name: string;
    url: string
    slug: string;
  };
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
