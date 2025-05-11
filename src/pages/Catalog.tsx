
import React, { useState, useEffect } from 'react';
import { loadDatabase } from '@/lib/db';
import { useCategories } from '@/lib/hooks/useCategories';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import PageHeader from '@/lib/components/common/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Catalog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  const { 
    categories,
    selectedCategory, setSelectedCategory,
    selectedSubcategory, setSelectedSubcategory,
    subcategories,
    currentSubcategory
  } = useCategories();
  
  useEffect(() => {
    // Load database and initialize
    const init = async () => {
      setIsLoading(true);
      try {
        if (categories.length > 0 && !selectedCategory) {
          setSelectedCategory(categories[0].name);
        }
      } catch (error) {
        console.error("Error initializing catalog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [categories, selectedCategory, setSelectedCategory]);
  
  useEffect(() => {
    // Filter products when subcategory or search term changes
    if (currentSubcategory) {
      let products = [...currentSubcategory.products];
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        products = products.filter(product => 
          product.cod.toLowerCase().includes(search) || 
          (product.name && product.name.toLowerCase().includes(search))
        );
      }
      
      setFilteredProducts(products);
    } else {
      setFilteredProducts([]);
    }
  }, [currentSubcategory, searchTerm]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const getProductDisplayName = (product: any) => {
    if (product.name) return product.name;
    if (product.type) return `${product.type}`;
    return `Produs ${product.cod}`;
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Încărcare...</span>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <PageHeader 
        title="Catalog Produse" 
        description="Explorați toate produsele disponibile în catalog"
      />
      
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {/* Category Select */}
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectează categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Subcategory Select */}
        <Select 
          value={selectedSubcategory} 
          onValueChange={setSelectedSubcategory}
          disabled={subcategories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectează subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.name} value={subcategory.name}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Caută produse..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Products Grid */}
      {currentSubcategory ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {product.imageUrl ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={getProductDisplayName(product)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Fără imagine</span>
                  </div>
                )}
                <CardContent className="pt-4">
                  <h3 className="font-medium text-lg">{getProductDisplayName(product)}</h3>
                  <p className="text-sm text-gray-500 mt-1">Cod: {product.cod}</p>
                  <p className="text-lg font-bold mt-2">{product.pret} RON</p>
                </CardContent>
                <CardFooter className="border-t border-gray-100 pt-4">
                  <Button variant="outline" className="w-full">
                    Vezi detalii
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nu am găsit produse care să corespundă criteriilor.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Selectați o categorie și subcategorie pentru a vedea produsele.</p>
        </div>
      )}
    </AppLayout>
  );
};

export default Catalog;
