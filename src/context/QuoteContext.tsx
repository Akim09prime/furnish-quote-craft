
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Database, 
  Category,
  Quote, 
  loadDatabase, 
  loadQuote, 
  saveQuote, 
  addItemToQuote,
  updateQuoteItem,
  removeQuoteItem, 
  setLaborPercentage,
  updateQuoteMetadata,
  addManualPalItem,
  initialDB
} from '@/lib/db';

type QuoteContextType = {
  database: Database | null;
  selectedCategory: string | null;
  category: Category | null;
  quote: Quote | null;
  quoteType: 'client' | 'internal';
  loadingError: string | null;
  setSelectedCategory: (categoryName: string | null) => void;
  handleSelectCategory: (categoryName: string) => void;
  handleAddToQuote: (item: {
    categoryName: string;
    subcategoryName: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    productDetails: Record<string, any>;
  }) => void;
  handleUpdateQuantity: (itemId: string, quantity: number) => void;
  handleRemoveItem: (itemId: string) => void;
  handleUpdateLabor: (percentage: number) => void;
  handleUpdateMetadata: (metadata: { beneficiary: string; title: string }) => void;
  handleAddManualItem: (description: string, quantity: number, price: number, categoryName: string) => void;
  handleQuoteTypeChange: (type: 'client' | 'internal') => void;
};

const QuoteContext = createContext<QuoteContextType | null>(null);

export const useQuoteContext = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuoteContext must be used within a QuoteProvider');
  }
  return context;
};

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteType, setQuoteType] = useState<'client' | 'internal'>('internal');
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Initialize database and quote on mount with improved error handling
  useEffect(() => {
    try {
      console.log("Starting database load");
      
      // Check for initialDB structure first - useful for debugging
      console.log("Initial DB available:", !!initialDB);
      console.log("Initial DB categories:", initialDB?.categories?.map(c => c.name) || "No categories in initialDB");
      
      // Try loading database
      const db = loadDatabase();
      console.log("Database loaded:", !!db);
      
      if (!db) {
        console.error("Database failed to load - falling back to initialDB");
        setDatabase(initialDB);
        setLoadingError("Eroare la încărcarea bazei de date - folosind setările implicite");
      } else {
        // Log detailed information about the loaded database
        console.log("Categories in loaded database:", db?.categories?.map(c => c.name) || "No categories");
        console.log("Categories count:", db?.categories?.length || 0);
        
        // Make sure database is properly loaded
        if (!db.categories || db.categories.length === 0) {
          console.error("Database loaded but has no categories - fallback to initialDB");
          setDatabase(initialDB);
          setLoadingError("Baza de date nu conține categorii - folosind setările implicite");
        } else {
          setDatabase(db);
        }
      }

      // Load quote data
      const savedQuote = loadQuote();
      setQuote(savedQuote);
    } catch (error) {
      console.error("Critical error loading database or quote:", error);
      setLoadingError("Eroare critică la încărcarea datelor");
      
      // Fall back to initialDB as last resort
      setDatabase(initialDB);
      setQuote(loadQuote());
    }
  }, []);

  // Update category when selection changes
  useEffect(() => {
    if (database && selectedCategory) {
      const cat = database.categories.find(c => c.name === selectedCategory);
      setCategory(cat || null);
    } else {
      setCategory(null);
    }
  }, [selectedCategory, database]);

  // Handle category selection
  const handleSelectCategory = (categoryName: string) => {
    console.log("Selected category:", categoryName);
    setSelectedCategory(categoryName);
  };

  // Add item to quote
  const handleAddToQuote = (item: {
    categoryName: string;
    subcategoryName: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    productDetails: Record<string, any>;
  }) => {
    if (quote) {
      // Calculate total before adding to quote
      const total = item.quantity * item.pricePerUnit;
      const quoteItem = {
        ...item,
        total: total
      };
      
      const updatedQuote = addItemToQuote(quote, quoteItem);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quote) {
      const updatedQuote = updateQuoteItem(quote, itemId, { quantity });
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    if (quote) {
      const updatedQuote = removeQuoteItem(quote, itemId);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Update labor percentage
  const handleUpdateLabor = (percentage: number) => {
    if (quote) {
      const updatedQuote = setLaborPercentage(quote, percentage);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Handle metadata updates
  const handleUpdateMetadata = (metadata: { beneficiary: string; title: string }) => {
    if (quote) {
      const updatedQuote = updateQuoteMetadata(quote, metadata);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Handle manual PAL or MDF entry
  const handleAddManualItem = (description: string, quantity: number, price: number, categoryName: string) => {
    if (quote) {
      const updatedQuote = addManualPalItem(quote, description, quantity, price, categoryName);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  // Handle quote type change
  const handleQuoteTypeChange = (type: 'client' | 'internal') => {
    setQuoteType(type);
  };

  const value = {
    database,
    selectedCategory,
    category,
    quote,
    quoteType,
    loadingError,
    setSelectedCategory,
    handleSelectCategory,
    handleAddToQuote,
    handleUpdateQuantity,
    handleRemoveItem,
    handleUpdateLabor,
    handleUpdateMetadata,
    handleAddManualItem,
    handleQuoteTypeChange,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};
