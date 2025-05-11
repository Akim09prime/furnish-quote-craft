
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { 
  loadDatabase, 
  saveDatabase, 
  addCategory, 
  deleteCategory, 
  addSubcategory, 
  updateSubcategory, 
  deleteSubcategory, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  exportDatabaseJSON, 
  importDatabaseJSON, 
  loadQuote, 
  createNewQuote, 
  Material, 
  addMaterial, 
  deleteMaterial, 
  Database 
} from "@/lib/db";
import { initialDB } from "@/data/initialDB";
import CategoryForm from "@/components/CategoryForm";
import SubcategoryForm from "@/components/SubcategoryForm";
import ProductForm from "@/components/ProductForm";
import MaterialForm from "@/components/MaterialForm";
import QuoteSummary from "@/components/QuoteSummary";
import QuoteItemEditor from "@/components/QuoteItemEditor";
import FurnitureSetManager, { FurnitureDesign } from "@/components/FurnitureSetManager";
import FurnitureDesigner from "@/components/FurnitureDesigner";
import { useQuote } from "@/hooks/use-quote";

// Designer page with improved stylings and fixed quote updating
const Designer = () => {
  const [db, setDb] = useState<Database>(initialDB);
  const [quoteType, setQuoteType] = useState<'client' | 'internal'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubcategoryFormOpen, setIsSubcategoryFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
  const [isQuoteItemEditorOpen, setIsQuoteItemEditorOpen] = useState(false);
  const [selectedQuoteItem, setSelectedQuoteItem] = useState<string | null>(null);
  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isFurnitureDesignerOpen, setIsFurnitureDesignerOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<FurnitureDesign[]>(() => {
    const saved = localStorage.getItem('furnitureDesigns');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDesign, setSelectedDesign] = useState<FurnitureDesign | null>(null);
  
  // Use our custom hook for quote management
  const { 
    quote, 
    handleUpdateQuoteItem,
    handleRemoveItem,
    handleUpdateLabor,
    handleUpdateQuantity,
    handleUpdateQuoteMetadata,
    handleAddManualItem,
    handleImportFurnitureDesign,
    handleImportFurnitureSet,
    handleAddItemToQuote
  } = useQuote();

  // Load database on component mount
  useEffect(() => {
    const loadedDb = loadDatabase();
    setDb(loadedDb);
    setMaterials(loadedDb.materials || []);
  }, []);

  // Save database when it changes
  useEffect(() => {
    saveDatabase(db);
  }, [db]);
  
  // Save designs to localStorage
  useEffect(() => {
    localStorage.setItem('furnitureDesigns', JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  // Handler functions for database operations
  const handleAddCategory = (categoryName: string) => {
    try {
      const updatedDb = addCategory(db, categoryName);
      setDb(updatedDb);
      toast.success(`Categoria "${categoryName}" a fost adăugată`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsCategoryFormOpen(false);
    }
  };

  const handleAddSubcategory = (categoryName: string, subcategory: { name: string; adaos: number; fields: { name: string; type: "number" | "boolean" | "select" | "text"; options?: string[] }[] }) => {
    try {
      const updatedDb = addSubcategory(db, categoryName, { ...subcategory, products: [] });
      setDb(updatedDb);
      toast.success(`Subcategoria "${subcategory.name}" a fost adăugată în categoria "${categoryName}"`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubcategoryFormOpen(false);
    }
  };

  const handleUpdateSubcategory = (categoryName: string, oldSubcategoryName: string, updatedSubcategory: any) => {
    try {
      const updatedDb = updateSubcategory(db, categoryName, oldSubcategoryName, updatedSubcategory);
      setDb(updatedDb);
      toast.success(`Subcategoria "${updatedSubcategory.name}" a fost actualizată în categoria "${categoryName}"`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddProduct = (categoryName: string, subcategoryName: string, product: any) => {
    const updatedDb = addProduct(db, categoryName, subcategoryName, product);
    setDb(updatedDb);
    toast.success(`Produsul "${product.cod}" a fost adăugat în subcategoria "${subcategoryName}"`);
    setIsProductFormOpen(false);
  };

  const handleUpdateProduct = (categoryName: string, subcategoryName: string, product: any) => {
    const updatedDb = updateProduct(db, categoryName, subcategoryName, product);
    setDb(updatedDb);
    toast.success(`Produsul "${product.cod}" a fost actualizat în subcategoria "${subcategoryName}"`);
  };

  const handleDeleteCategory = (categoryName: string) => {
    try {
      const updatedDb = deleteCategory(db, categoryName);
      setDb(updatedDb);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      toast.success(`Categoria "${categoryName}" a fost ștearsă`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteSubcategory = (categoryName: string, subcategoryName: string) => {
    try {
      const updatedDb = deleteSubcategory(db, categoryName, subcategoryName);
      setDb(updatedDb);
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      toast.success(`Subcategoria "${subcategoryName}" a fost ștearsă din categoria "${categoryName}"`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteProduct = (categoryName: string, subcategoryName: string, productId: string) => {
    const updatedDb = deleteProduct(db, categoryName, subcategoryName, productId);
    setDb(updatedDb);
    setSelectedProduct(null);
    toast.success(`Produsul a fost șters din subcategoria "${subcategoryName}"`);
  };

  // Method to add a product to quote with validation
  const addProductToQuote = (categoryName: string, subcategoryName: string, productId: string, quantity: number) => {
    const category = db.categories.find(c => c.name === categoryName);
    if (!category) {
      toast.error("Categoria nu a fost găsită");
      return;
    }

    const subcategory = category.subcategories.find(s => s.name === subcategoryName);
    if (!subcategory) {
      toast.error("Subcategoria nu a fost găsită");
      return;
    }

    const product = subcategory.products.find(p => p.id === productId);
    if (!product) {
      toast.error("Produsul nu a fost găsit");
      return;
    }

    handleAddItemToQuote(categoryName, subcategoryName, productId, quantity, product);
  };

  // Handler functions for import/export
  const handleExportDatabase = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "furniture-quote-db.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportDatabase = () => {
    try {
      const success = importDatabaseJSON(importText);
      if (success) {
        const loadedDb = loadDatabase();
        setDb(loadedDb);
        setMaterials(loadedDb.materials || []);
        toast.success("Baza de date a fost importată cu succes");
      } else {
        toast.error("Eroare la importarea bazei de date");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsImportExportDialogOpen(false);
    }
  };

  // Handler functions for materials
  const handleAddMaterial = (material: Material) => {
    setDb(prevDb => {
      const updatedDb = addMaterial(prevDb, material);
      return updatedDb;
    });
    setMaterials(prevMaterials => [...prevMaterials, material]);
    setIsMaterialFormOpen(false);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setDb(prevDb => {
      const updatedDb = deleteMaterial(prevDb, materialId);
      return updatedDb;
    });
    setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== materialId));
  };
  
  const handleLoadDesign = (design: FurnitureDesign) => {
    setSelectedDesign(design);
    setIsFurnitureDesignerOpen(true);
  };
  
  const handleDesignsUpdated = (designs: FurnitureDesign[]) => {
    setSavedDesigns(designs);
  };
  
  const handleSaveDesign = (design: FurnitureDesign) => {
    const existingIndex = savedDesigns.findIndex(d => d.id === design.id);
    
    if (existingIndex !== -1) {
      // Update existing design
      const updatedDesigns = [...savedDesigns];
      updatedDesigns[existingIndex] = design;
      setSavedDesigns(updatedDesigns);
    } else {
      // Add new design
      setSavedDesigns([...savedDesigns, design]);
    }
    
    toast.success("Design salvat cu succes");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 animate-fade-in">
      {/* Left Panel - Database Management */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-semibold">Bază de date</h2>

        {/* Category Management */}
        <Card className="hover-scale">
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Categorii</Label>
              <Button size="sm" onClick={() => setIsCategoryFormOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Adaugă
              </Button>
            </div>
            {db.categories.length === 0 ? (
              <p className="text-sm text-gray-500">Nu există categorii</p>
            ) : (
              <div className="space-y-1">
                {db.categories.map(category => (
                  <div key={category.name} className="flex justify-between items-center">
                    <Button
                      variant="secondary"
                      className={`w-full justify-start ${selectedCategory === category.name ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedSubcategory(null);
                        setSelectedProduct(null);
                      }}
                    >
                      {category.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.name)}
                    >
                      Șterge
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subcategory Management */}
        {selectedCategory && (
          <Card className="hover-scale">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Subcategorii ({selectedCategory})</Label>
                <Button size="sm" onClick={() => setIsSubcategoryFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă
                </Button>
              </div>
              {db.categories.find(c => c.name === selectedCategory)?.subcategories.length === 0 ? (
                <p className="text-sm text-gray-500">Nu există subcategorii</p>
              ) : (
                <div className="space-y-1">
                  {db.categories.find(c => c.name === selectedCategory)?.subcategories.map(subcategory => (
                    <div key={subcategory.name} className="flex justify-between items-center">
                      <Button
                        variant="secondary"
                        className={`w-full justify-start ${selectedSubcategory === subcategory.name ? 'bg-gray-100' : ''}`}
                        onClick={() => {
                          setSelectedSubcategory(subcategory.name);
                          setSelectedProduct(null);
                        }}
                      >
                        {subcategory.name}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubcategory(selectedCategory, subcategory.name)}
                      >
                        Șterge
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Product Management */}
        {selectedCategory && selectedSubcategory && (
          <Card className="hover-scale">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Produse ({selectedSubcategory})</Label>
                <Button size="sm" onClick={() => setIsProductFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă
                </Button>
              </div>
              {db.categories.find(c => c.name === selectedCategory)?.subcategories.find(s => s.name === selectedSubcategory)?.products.length === 0 ? (
                <p className="text-sm text-gray-500">Nu există produse</p>
              ) : (
                <div className="space-y-1">
                  {db.categories.find(c => c.name === selectedCategory)?.subcategories.find(s => s.name === selectedSubcategory)?.products.map(product => (
                    <div key={product.id} className="flex justify-between items-center">
                      <Button
                        variant="secondary"
                        className={`w-full justify-start ${selectedProduct === product.id ? 'bg-gray-100' : ''}`}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        {product.cod} - {product.pret} RON
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(selectedCategory, selectedSubcategory, product.id)}
                      >
                        Șterge
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Material Management */}
        <Card className="hover-scale">
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Materiale</Label>
              <Button size="sm" onClick={() => setIsMaterialFormOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Adaugă
              </Button>
            </div>
            {materials.length === 0 ? (
              <p className="text-sm text-gray-500">Nu există materiale</p>
            ) : (
              <div className="space-y-1">
                {materials.map(material => (
                  <div key={material.id} className="flex justify-between items-center">
                    <div>
                      {material.name} ({material.thickness}mm)
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      Șterge
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import/Export Database */}
        <Card className="hover-scale">
          <CardContent className="space-y-2">
            <Label>Import / Export</Label>
            <div className="flex gap-2">
              <Button className="w-1/2" onClick={handleExportDatabase}>
                Exportă
              </Button>
              <Button className="w-1/2" onClick={() => setIsImportExportDialogOpen(true)}>
                Importă
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Product Details & Quote Item Addition */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-semibold">Detalii Produs</h2>

        {/* Product Details */}
        {selectedCategory && selectedSubcategory && selectedProduct && (
          <Card className="hover-scale">
            <CardContent className="space-y-2">
              <Label>Detalii Produs</Label>
              {Object.entries(db.categories
                .find(c => c.name === selectedCategory)
                ?.subcategories.find(s => s.name === selectedSubcategory)
                ?.products.find(p => p.id === selectedProduct) || {})
                .filter(([key]) => !['id'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              <Separator />
              <div className="flex justify-between">
                <Label htmlFor="quantity">Cantitate</Label>
                <Input
                  id="quantity"
                  type="number"
                  defaultValue={1}
                  min={1}
                  className="w-24"
                  onBlur={(e) => {
                    const quantity = parseInt(e.target.value);
                    if (isNaN(quantity) || quantity < 1) return;
                    addProductToQuote(selectedCategory, selectedSubcategory, selectedProduct, quantity);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Item Addition */}
        <Card className="hover-scale">
          <CardContent className="space-y-2">
            <Label>Adaugă Produs Manual</Label>
            <Input
              id="description"
              type="text"
              placeholder="Descriere"
              className="mb-2"
            />
            <div className="flex gap-2">
              <Input
                id="manual-quantity"
                type="number"
                placeholder="Cantitate"
                defaultValue={1}
                min={1}
                className="w-1/2"
              />
              <Input
                id="manual-price"
                type="number"
                placeholder="Preț/buc"
                defaultValue={0}
                min={0}
                step={0.01}
                className="w-1/2"
              />
            </div>
            <Button 
              className="w-full mt-2"
              onClick={() => {
                const description = (document.getElementById("description") as HTMLInputElement).value;
                const quantity = parseInt((document.getElementById("manual-quantity") as HTMLInputElement).value);
                const pricePerUnit = parseFloat((document.getElementById("manual-price") as HTMLInputElement).value);

                if (!description || isNaN(quantity) || quantity < 1 || isNaN(pricePerUnit) || pricePerUnit < 0) {
                  toast.error("Toate câmpurile trebuie completate corect");
                  return;
                }

                handleAddManualItem(description, quantity, pricePerUnit);
                
                // Reset form fields
                (document.getElementById("description") as HTMLInputElement).value = '';
                (document.getElementById("manual-quantity") as HTMLInputElement).value = '1';
                (document.getElementById("manual-price") as HTMLInputElement).value = '0';
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adaugă în ofertă
            </Button>
          </CardContent>
        </Card>
        
        {/* Furniture Set Manager */}
        <FurnitureSetManager 
          savedDesigns={savedDesigns}
          onLoadDesign={handleLoadDesign}
          onDesignsUpdated={handleDesignsUpdated}
        />
      </div>

      {/* Right Panel - Quote Summary */}
      <div className="w-full md:w-1/3 space-y-4">
        <QuoteSummary 
          quote={quote}
          quoteType={quoteType}
          onUpdateLabor={handleUpdateLabor}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onUpdateMetadata={handleUpdateQuoteMetadata}
          onImportFurnitureDesign={handleImportFurnitureDesign}
          onImportFurnitureSet={handleImportFurnitureSet}
        />
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        onSave={handleAddCategory}
      />

      {/* Subcategory Form Modal */}
      <SubcategoryForm
        isOpen={isSubcategoryFormOpen}
        onClose={() => setIsSubcategoryFormOpen(false)}
        onSave={(subcategory) => handleAddSubcategory(selectedCategory!, subcategory)}
        categoryName={selectedCategory}
      />

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSave={(product) => handleAddProduct(selectedCategory!, selectedSubcategory!, product)}
        categoryName={selectedCategory}
        subcategoryName={selectedSubcategory}
      />

      {/* Material Form Modal */}
      <MaterialForm
        isOpen={isMaterialFormOpen}
        onClose={() => setIsMaterialFormOpen(false)}
        onSave={handleAddMaterial}
      />

      {/* Quote Item Editor Modal */}
      {selectedQuoteItem && (
        <QuoteItemEditor
          isOpen={isQuoteItemEditorOpen}
          onClose={() => setIsQuoteItemEditorOpen(false)}
          quoteItem={quote.items.find(i => i.id === selectedQuoteItem)}
          onSave={handleUpdateQuoteItem}
        />
      )}

      {/* Import/Export Dialog */}
      {isImportExportDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Importă Bază de Date</h2>
            <textarea
              className="w-full h-48 border rounded-md p-2 mb-2"
              placeholder="Lipește aici JSON-ul exportat"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsImportExportDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={handleImportDatabase}>Importă</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Furniture Designer Modal */}
      {isFurnitureDesignerOpen && (
        <FurnitureDesigner 
          isOpen={isFurnitureDesignerOpen}
          onClose={() => setIsFurnitureDesignerOpen(false)}
          design={selectedDesign}
          onSave={handleSaveDesign}
        />
      )}
    </div>
  );
};

export default Designer;
