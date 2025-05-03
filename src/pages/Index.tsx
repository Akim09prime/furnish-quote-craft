
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import QuoteTypeSelector from '@/components/QuoteTypeSelector';
import ProductCatalog from '@/components/ProductCatalog';
import QuoteDisplay from '@/components/QuoteDisplay';
import QuoteSummary from '@/components/QuoteSummary';
import LoadingState from '@/components/LoadingState';
import { QuoteProvider, useQuoteContext } from '@/context/QuoteContext';

const IndexContent = () => {
  const { 
    database, 
    quote, 
    quoteType,
    loadingError,
    selectedCategory,
    handleQuoteTypeChange, 
    handleUpdateLabor,
    handleUpdateQuantity,
    handleRemoveItem,
    handleUpdateMetadata
  } = useQuoteContext();

  // Show a better loading state or error message
  if (!database || !quote) {
    return <LoadingState loadingError={loadingError} />;
  }

  // Debug check for specific categories
  console.log("Checking 'Accesorii' category:", database.categories.some(c => c.name === "Accesorii"));
  
  // Debug check total number of categories
  console.log("Total categories available:", database.categories.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 space-y-8 print:col-span-2">
          <div className="print:hidden">
            <QuoteTypeSelector 
              quoteType={quoteType} 
              onChangeQuoteType={handleQuoteTypeChange}
            />
            
            <ProductCatalog />
          </div>
          
          <QuoteDisplay />
        </div>

        <div className="lg:col-span-1 print:col-span-1 print:mt-0">
          <div className="sticky top-20 print:static">
            <QuoteSummary 
              quote={quote}
              quoteType={quoteType}
              onUpdateLabor={handleUpdateLabor} 
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateMetadata={handleUpdateMetadata}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <QuoteProvider>
      <IndexContent />
    </QuoteProvider>
  );
};

export default Index;
