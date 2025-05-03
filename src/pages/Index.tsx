import React, { useEffect, useState } from 'react';
import { 
  Database, 
  loadDatabase, 
  Quote, 
  loadQuote, 
  saveQuote, 
  addItemToQuote,
  updateQuoteItem,
  removeQuoteItem, 
  setLaborPercentage,
  Category,
  QuoteItem as QuoteItemType,
  addManualPalItem
} from '@/lib/db';
import CategorySelector from '@/components/CategorySelector';
import ProductSelector from '@/components/ProductSelector';
import QuoteItem from '@/components/QuoteItem';
import QuoteSummary from '@/components/QuoteSummary';
import Header from '@/components/Header';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  // Initialize database and quote on mount
  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);

    const savedQuote = loadQuote();
    setQuote(savedQuote);
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
      const quoteItem: Omit<QuoteItemType, "id"> = {
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

  // Handle manual PAL or MDF entry
  const handleAddManualItem = (description: string, quantity: number, price: number, categoryName: string) => {
    if (quote) {
      const updatedQuote = addManualPalItem(quote, description, quantity, price, categoryName);
      setQuote(updatedQuote);
      saveQuote(updatedQuote);
    }
  };

  if (!database || !quote) {
    return <div className="h-screen flex items-center justify-center">Încărcare...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 space-y-8 print:col-span-2">
          <div className="print:hidden">
            {!selectedCategory ? (
              <CategorySelector
                database={database}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
            ) : category ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-gray-500 hover:text-furniture-purple"
                  >
                    Schimbă categoria
                  </button>
                </div>
                <ProductSelector 
                  category={category}
                  onAddToQuote={handleAddToQuote}
                  onAddManualItem={handleAddManualItem}
                />
              </div>
            ) : null}
          </div>
          
          <div className="print:block">
            <div className="print:mb-8">
              <h2 className="text-2xl font-bold mb-4 print:text-3xl print:text-center">
                Ofertă Mobilier
              </h2>
              <p className="text-gray-500 print:text-center print:text-lg">
                Data: {new Date().toLocaleDateString('ro-RO')}
              </p>
            </div>
            
            {quote.items.length > 0 ? (
              <div className="space-y-4 print:mt-8">
                <h3 className="text-xl font-medium print:text-2xl print:mb-4">
                  Produse în ofertă
                </h3>
                <table className="w-full hidden print:table">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Cod</th>
                      <th className="text-left py-2">Categorie</th>
                      <th className="text-left py-2">Specificații</th>
                      <th className="text-right py-2">Preț/buc</th>
                      <th className="text-right py-2">Cant.</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.productDetails.cod}</td>
                        <td className="py-2">{item.categoryName}</td>
                        <td className="py-2">
                          {Object.entries(item.productDetails)
                            .filter(([key]) => !['id', 'cod', 'pret'].includes(key))
                            .map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                        </td>
                        <td className="py-2 text-right">{item.pricePerUnit.toFixed(2)} RON</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right font-medium">{item.total.toFixed(2)} RON</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
                  {quote.items.map(item => (
                    <QuoteItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg print:hidden">
                <p className="text-gray-500">
                  Nu există produse în ofertă. Selectează produse pentru a le adăuga.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 print:col-span-1 print:mt-0">
          <div className="sticky top-20 print:static">
            <QuoteSummary 
              quote={quote} 
              onUpdateLabor={handleUpdateLabor} 
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
