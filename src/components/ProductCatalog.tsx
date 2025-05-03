
import React, { useEffect } from 'react';
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

  // Add extra debugging
  useEffect(() => {
    console.log("ProductCatalog - database:", !!database);
    console.log("ProductCatalog - selectedCategory:", selectedCategory);
    console.log("ProductCatalog - category:", category?.name);
  }, [database, selectedCategory, category]);

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

  // Fallback if category is not found
  return (
    <div className="p-4 border border-orange-300 rounded-md bg-orange-50">
      <h3 className="font-bold text-orange-700">Categoria nu este disponibilă</h3>
      <p className="text-sm text-orange-600 mt-2">
        Categoria selectată nu a fost găsită în baza de date.
      </p>
      <button
        onClick={() => setSelectedCategory(null)}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Înapoi la lista de categorii
      </button>
    </div>
  );
};

export default ProductCatalog;
