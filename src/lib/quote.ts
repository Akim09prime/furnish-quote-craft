
import { Quote, QuoteItem } from './types';

// Helper function to create a new empty quote
export const createNewQuote = (): Quote => ({
  items: [],
  laborPercentage: 0,
  subtotal: 0,
  laborCost: 0,
  total: 0,
  beneficiary: "",
  title: ""
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

// Function to add a manual item to the quote (PAL or MDF)
export const addManualPalItem = (
  quote: Quote, 
  description: string, 
  quantity: number, 
  pricePerUnit: number,
  categoryName: string = "PAL" // Default to PAL for backward compatibility
): Quote => {
  const newItem = {
    id: Date.now().toString(),
    categoryName: categoryName,
    subcategoryName: "Manual",
    productId: "manual-" + Date.now(),
    quantity,
    pricePerUnit,
    total: pricePerUnit * quantity,
    productDetails: {
      cod: `MANUAL-${categoryName}-${Date.now().toString().slice(-6)}`,
      pret: pricePerUnit,
      description
    }
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

// Function to update beneficiary and title
export const updateQuoteMetadata = (quote: Quote, metadata: { beneficiary?: string, title?: string }): Quote => {
  return {
    ...quote,
    beneficiary: metadata.beneficiary !== undefined ? metadata.beneficiary : quote.beneficiary,
    title: metadata.title !== undefined ? metadata.title : quote.title
  };
};
