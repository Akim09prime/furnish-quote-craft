
import { initialDB } from "../data/initialDB";

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

// DB operations
const DB_KEY = "furniture-quote-db";

export const loadDatabase = (): Database => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved database, using initial DB", e);
      return initialDB;
    }
  }
  return initialDB;
};

export const saveDatabase = (db: Database): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const exportDatabaseJSON = (): string => {
  return JSON.stringify(loadDatabase(), null, 2);
};

export const importDatabaseJSON = (json: string): boolean => {
  try {
    const data = JSON.parse(json) as Database;
    if (!data.categories) {
      throw new Error("Invalid database structure");
    }
    saveDatabase(data);
    return true;
  } catch (e) {
    console.error("Failed to import database", e);
    return false;
  }
};

// Helper functions for working with the database
export const getCategoryByName = (db: Database, name: string): Category | undefined => {
  return db.categories.find(c => c.name === name);
};

export const getSubcategoryByName = (category: Category, name: string): Subcategory | undefined => {
  return category.subcategories.find(s => s.name === name);
};

export const getProductById = (subcategory: Subcategory, id: string): Product | undefined => {
  return subcategory.products.find(p => p.id === id);
};

export const addProduct = (db: Database, categoryName: string, subcategoryName: string, product: Omit<Product, "id">): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  const newProduct: Product = {
    ...product,
    id: Date.now().toString(), // Simple ID generation
  };

  category.subcategories[subcategoryIndex].products.push(newProduct);
  return newDb;
};

export const updateProduct = (db: Database, categoryName: string, subcategoryName: string, product: Product): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  const productIndex = category.subcategories[subcategoryIndex].products.findIndex(p => p.id === product.id);
  if (productIndex === -1) return db;

  category.subcategories[subcategoryIndex].products[productIndex] = product;
  return newDb;
};

export const deleteProduct = (db: Database, categoryName: string, subcategoryName: string, productId: string): Database => {
  const newDb = { ...db };
  const category = getCategoryByName(newDb, categoryName);
  if (!category) return db;

  const subcategoryIndex = category.subcategories.findIndex(s => s.name === subcategoryName);
  if (subcategoryIndex === -1) return db;

  category.subcategories[subcategoryIndex].products = category.subcategories[subcategoryIndex].products.filter(p => p.id !== productId);
  return newDb;
};

// Quote calculation
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
};

// Helper function to create a new empty quote
export const createNewQuote = (): Quote => ({
  items: [],
  laborPercentage: 0,
  subtotal: 0,
  laborCost: 0,
  total: 0,
});

// Quote storage functions
const QUOTE_KEY = "furniture-quote-current";

export const loadQuote = (): Quote => {
  const saved = localStorage.getItem(QUOTE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved quote, creating new one", e);
      return createNewQuote();
    }
  }
  return createNewQuote();
};

export const saveQuote = (quote: Quote): void => {
  localStorage.setItem(QUOTE_KEY, JSON.stringify(quote));
};

// Function to recalculate quote totals
export const recalculateQuote = (quote: Quote): Quote => {
  const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
  const laborCost = (subtotal * quote.laborPercentage) / 100;
  const total = subtotal + laborCost;

  return {
    ...quote,
    subtotal,
    laborCost,
    total,
  };
};

// Function to add item to quote
export const addItemToQuote = (quote: Quote, item: Omit<QuoteItem, "id">): Quote => {
  const newItem = {
    ...item,
    id: Date.now().toString(), // Simple ID generation
    total: item.pricePerUnit * item.quantity,
  };

  const newQuote = {
    ...quote,
    items: [...quote.items, newItem],
  };

  return recalculateQuote(newQuote);
};

// Function to update item in quote
export const updateQuoteItem = (quote: Quote, itemId: string, updates: Partial<QuoteItem>): Quote => {
  const index = quote.items.findIndex(i => i.id === itemId);
  if (index === -1) return quote;

  const updatedItem = {
    ...quote.items[index],
    ...updates,
  };

  // Recalculate the total for this item
  updatedItem.total = updatedItem.pricePerUnit * updatedItem.quantity;

  const newQuote = {
    ...quote,
    items: [
      ...quote.items.slice(0, index),
      updatedItem,
      ...quote.items.slice(index + 1),
    ],
  };

  return recalculateQuote(newQuote);
};

// Function to remove item from quote
export const removeQuoteItem = (quote: Quote, itemId: string): Quote => {
  const newQuote = {
    ...quote,
    items: quote.items.filter(i => i.id !== itemId),
  };

  return recalculateQuote(newQuote);
};

// Function to update labor percentage
export const setLaborPercentage = (quote: Quote, percentage: number): Quote => {
  const newQuote = {
    ...quote,
    laborPercentage: percentage,
  };

  return recalculateQuote(newQuote);
};
