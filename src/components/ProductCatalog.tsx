
import React from 'react';
import { useQuoteContext } from '@/context/QuoteContext';
import CategorySelector from '@/components/CategorySelector';
import ProductSelector from '@/components/ProductSelector';

const ProductCatalog: React.FC = () => {
  const { 
    database, 
    selectedCategory, 
    handleSelectCategory, 
    category, 
    setSelectedCategory,
    handleAddToQuote,
    handleAddManualItem
  } = useQuoteContext();

  if (!selectedCategory) {
    return (
      <CategorySelector
        database={database}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
    );
  } else if (category) {
    return (
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
    );
  }

  return null;
};

export default ProductCatalog;
