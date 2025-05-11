
import React, { useEffect, useState } from 'react';
import { Category, Subcategory, Product, Database } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

export interface ProductSelectorProps {
  database: Database;
  onAddToQuote?: (item: {
    categoryName: string;
    subcategoryName: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    productDetails: Record<string, any>;
  }) => void;
  onAddManualItem?: (description: string, quantity: number, price: number, categoryName: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ database, onAddToQuote, onAddManualItem }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Initialize selected category
  useEffect(() => {
    if (database && database.categories && database.categories.length > 0) {
      setSelectedCategory(database.categories[selectedCategoryIndex]);
    }
  }, [database, selectedCategoryIndex]);
  
  // Define if manual entry should be shown
  const showManualEntry = selectedCategory ? 
    (selectedCategory.name === "PAL" || selectedCategory.name === "MDF") : 
    false;

  // Handle subcategory selection
  useEffect(() => {
    if (selectedSubcategory && selectedCategory) {
      const sub = selectedCategory.subcategories.find(s => s.name === selectedSubcategory);
      setSubcategory(sub || null);
      setFilters({});
      setSelectedProduct(null);
      setFilteredProducts(sub?.products || []);
    }
  }, [selectedSubcategory, selectedCategory]);

  // Handle filter changes
  useEffect(() => {
    if (!subcategory) return;
    
    const filtered = subcategory.products.filter(product => {
      return Object.entries(filters).every(([key, value]) => {
        // Skip empty filter values
        if (value === "" || value === undefined || value === null || value === "all") return true;
        return product[key] === value;
      });
    });
    
    setFilteredProducts(filtered);
    setSelectedProduct(null);
  }, [filters, subcategory]);

  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Handle add to quote
  const handleAddToQuote = () => {
    if (!selectedProduct || !subcategory || !selectedCategory || !onAddToQuote) return;
    
    onAddToQuote({
      categoryName: selectedCategory.name,
      subcategoryName: subcategory.name,
      productId: selectedProduct.id,
      quantity,
      pricePerUnit: selectedProduct.pret,
      productDetails: { ...selectedProduct }
    });

    toast.success("Produs adăugat în ofertă", {
      description: `${selectedProduct.cod} - ${quantity} buc.`,
    });
  };

  // Form for manual item entry
  const manualForm = useForm({
    defaultValues: {
      description: "",
      quantity: 1,
      price: 0
    }
  });

  const submitManualForm = (data: { description: string; quantity: number; price: number }) => {
    if (onAddManualItem && selectedCategory) {
      onAddManualItem(data.description, data.quantity, data.price, selectedCategory.name);
      manualForm.reset({
        description: "",
        quantity: 1,
        price: 0
      });
      
      toast.success(`${selectedCategory.name} adăugat manual în ofertă`, {
        description: `${data.description}`,
      });
    }
  };

  // Handle category selection
  const handleCategoryChange = (index: number) => {
    setSelectedCategoryIndex(index);
    setSelectedSubcategory("");
    setSubcategory(null);
    setSelectedProduct(null);
  };

  if (!database || !database.categories || database.categories.length === 0) {
    return <div>No categories found in database</div>;
  }

  if (!selectedCategory) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Category</h3>
        <div className="flex flex-wrap gap-2">
          {database.categories.map((category, index) => (
            <Button
              key={category.name}
              variant={selectedCategoryIndex === index ? "default" : "outline"}
              onClick={() => handleCategoryChange(index)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {showManualEntry && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-medium mb-4">Adaugă {selectedCategory.name} manual</h3>
          <Tabs defaultValue="direct">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="direct" className="flex-1">{selectedCategory.name} după model și cantitate</TabsTrigger>
              <TabsTrigger value="price" className="flex-1">{selectedCategory.name} după sumă totală</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct">
              <Form {...manualForm}>
                <form onSubmit={manualForm.handleSubmit(submitManualForm)} className="space-y-4">
                  <FormField
                    control={manualForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere / Model {selectedCategory.name}</FormLabel>
                        <FormControl>
                          <Input placeholder={`ex: ${selectedCategory.name} Alb`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={manualForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Număr foi</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              step="1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={manualForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preț / foaie (RON)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Adaugă la ofertă
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="price">
              <Form {...manualForm}>
                <form onSubmit={manualForm.handleSubmit((data) => {
                  // For total price, we set quantity to 1 and price to the total price
                  submitManualForm({...data, quantity: 1, price: parseFloat(data.price.toString())});
                })} className="space-y-4">
                  <FormField
                    control={manualForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descriere {selectedCategory.name}</FormLabel>
                        <FormControl>
                          <Input placeholder={`ex: ${selectedCategory.name} furnir`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={manualForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suma totală (RON)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Adaugă sumă la ofertă
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-3">Selectează Subcategoria</h2>
        <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Alege subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {selectedCategory.subcategories.map(sub => (
              <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subcategory && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Filtrare Produse</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subcategory.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={`field-${field.name}`}>{field.name}</Label>
                  
                  {field.type === 'select' && field.options && (
                    <Select 
                      value={filters[field.name] || undefined} 
                      onValueChange={(val) => handleFilterChange(field.name, val)}
                    >
                      <SelectTrigger id={`field-${field.name}`}>
                        <SelectValue placeholder={`Alege ${field.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate</SelectItem>
                        {field.options.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === 'boolean' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`field-${field.name}`}
                        checked={!!filters[field.name]} 
                        onCheckedChange={(val) => handleFilterChange(field.name, val)}
                      />
                      <Label htmlFor={`field-${field.name}`}>Da</Label>
                    </div>
                  )}

                  {(field.type === 'text' || field.type === 'number') && (
                    <Input 
                      id={`field-${field.name}`}
                      type={field.type} 
                      value={filters[field.name] || ""} 
                      onChange={(e) => handleFilterChange(field.name, e.target.value)}
                      placeholder={`Introdu ${field.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Produse Disponibile ({filteredProducts.length})</h3>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id}
                    className={`cursor-pointer transition-all ${
                      selectedProduct?.id === product.id 
                        ? 'border-furniture-purple ring-2 ring-furniture-purple/20' 
                        : 'border-gray-200 hover:border-furniture-purple/50 hover:shadow-md'
                    }`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex justify-between">
                        <span>{product.cod}</span>
                        <span className="font-bold text-furniture-purple">{product.pret.toFixed(2)} RON</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm space-y-1">
                        {Object.entries(product).filter(([key]) => !['id', 'cod', 'pret'].includes(key)).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">Nu există produse care să corespundă filtrelor selectate.</p>
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-3">Adaugă în ofertă</h3>
              
              <div className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="quantity">Cantitate</Label>
                  <Input 
                    id="quantity"
                    type="number" 
                    min="1"
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="max-w-[120px]"
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-lg">{(selectedProduct.pret * quantity).toFixed(2)} RON</p>
                </div>
                
                <Button
                  className="flex-1 md:flex-initial"
                  onClick={handleAddToQuote}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adaugă în ofertă
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSelector;
