
// Type definitions for the database structure
export type Product = {
  id: string;
  cod: string;
  pret: number;
  [key: string]: any;
};

export type Subcategory = {
  name: string;
  products: Product[];
  fields: {
    name: string;
    type: "select" | "text" | "number" | "boolean";
    options?: string[];
  }[];
};

export type Category = {
  name: string;
  subcategories: Subcategory[];
};

export type Database = {
  categories: Category[];
};

export type QuoteItem = {
  id: string;
  categoryName: string;
  subcategoryName: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  productDetails: Record<string, any>;
};

export type Quote = {
  items: QuoteItem[];
  laborPercentage: number;
  subtotal: number;
  laborCost: number;
  total: number;
  beneficiary: string;
  title: string;
};
