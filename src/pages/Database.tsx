import React, { useState, useEffect, useRef } from 'react';
import { type Database as DBType, loadDatabase, saveDatabase, importDatabaseJSON, exportDatabaseJSON, Product, addProduct, updateProduct, deleteProduct } from '@/lib/db';
import Header from '@/components/Header';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, File, Edit, Plus, Save, Trash2, Import, Database as DatabaseIcon, FileJson } from "lucide-react";
import { toast } from "sonner";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Database = () => {
  const [database, setDatabase] = useState<DBType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentSubcategory, setCurrentSubcategory] = useState<string>("");
  const [newProduct, setNewProduct] = useState<any>({
    cod: '',
    pret: 0,
    descriere: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fullDatabaseInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  }, []);

  // Function to create a backup of the current database
  const createBackup = (db: DBType) => {
    try {
      const BACKUP_KEY = "furniture-quote-db-backups";
      
      const newBackup = {
        date: new Date().toISOString(),
        database: db
      };
      
      // Get existing backups
      const savedBackups = localStorage.getItem(BACKUP_KEY);
      let existingBackups = [];
      
      if (savedBackups) {
        existingBackups = JSON.parse(savedBackups);
      }
      
      // Add new backup
      existingBackups.push(newBackup);
      
      // Keep only the last 10 backups
      const limitedBackups = existingBackups.slice(-10);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_KEY, JSON.stringify(limitedBackups));
      
      console.log("Backup created:", newBackup.date);
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  // Function to save the entire database and update state
  const saveFullDatabase = (updatedDb: DBType) => {
    // Create backup before saving
    createBackup(database || loadDatabase());
    
    // Save to localStorage
    saveDatabase(updatedDb);
    
    // Update state
    setDatabase(updatedDb);
  };

  // Function to save a specific category
  const saveCategoryData = (categoryName: string) => {
    if (!database) return;
    
    console.log(`Saving category: ${categoryName}`);
    
    // Create backup before saving
    createBackup(database);
    
    // Save to localStorage
    saveDatabase(database);
    
    toast.success(`Categoria "${categoryName}" a fost salvată cu succes`, {
      duration: 10000
    });
  };

  // Function to save a specific subcategory
  const saveSubcategoryData = (categoryName: string, subcategoryName: string) => {
    if (!database) return;
    
    // Create backup before saving
    createBackup(database);
    
    // Save to localStorage
    saveDatabase(database);
    
    toast.success(`Subcategoria "${subcategoryName}" din categoria "${categoryName}" a fost salvată cu succes`);
  };

  const handleFileUpload = (categoryName: string) => {
    const fileInput = fileInputRefs.current[categoryName];
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubcategoryFileUpload = (categoryName: string, subcategoryName: string) => {
    const fileInput = fileInputRefs.current[`${categoryName}-${subcategoryName}`];
    if (fileInput) {
      fileInput.click();
    }
  };

  const processFile = (categoryName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let products;
        
        try {
          products = JSON.parse(content);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          toast.error("Eroare la parsarea fișierului JSON. Verificați formatul.");
          return;
        }
        
        if (!Array.isArray(products)) {
          console.error("Invalid format - not an array:", products);
          toast.error("Formatul fișierului nu este valid. Trebuie să fie un array de produse.");
          return;
        }

        console.log("Processed products:", products);
        
        const updatedDb = { ...loadDatabase() };
        const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
        
        if (categoryIndex === -1) {
          toast.error(`Categoria ${categoryName} nu există.`);
          return;
        }

        // Here you would process the products and add them to the appropriate subcategories
        let productsAdded = 0;
        let productsSkipped = 0;
        let duplicatesFound = 0;
        
        products.forEach(product => {
          if (product.subcategory && product.cod && product.pret !== undefined) {
            const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories.findIndex(
              s => s.name === product.subcategory
            );
            
            if (subcategoryIndex !== -1) {
              // Check if product with same code already exists
              const existingProduct = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products
                .find(p => p.cod === product.cod);
                
              if (existingProduct) {
                duplicatesFound++;
                console.warn(`Produsul cu codul "${product.cod}" există deja în subcategoria "${product.subcategory}".`);
              } else {
                // Add product to subcategory
                const newProduct = {
                  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  cod: product.cod,
                  pret: product.pret,
                  descriere: product.descriere || '',
                  ...product
                };
                
                // Remove subcategory field as it's not part of product model
                const { subcategory, ...productWithoutSubcategory } = newProduct;
                
                updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products.push(productWithoutSubcategory);
                productsAdded++;
              }
            } else {
              productsSkipped++;
              console.warn(`Subcategoria "${product.subcategory}" nu există în categoria "${categoryName}".`);
            }
          } else {
            productsSkipped++;
            console.warn("Produs invalid:", product);
          }
        });
        
        if (productsAdded > 0 || duplicatesFound > 0) {
          // Save the updated database
          saveFullDatabase(updatedDb);
          
          // Show appropriate message
          if (duplicatesFound > 0 && productsAdded > 0) {
            toast.success(`${productsAdded} produse adăugate în categoria ${categoryName}. ${duplicatesFound} produse duplicate ignorate.`);
          } else if (duplicatesFound > 0 && productsAdded === 0) {
            toast.warning(`Niciun produs nou adăugat. ${duplicatesFound} produse există deja în baza de date.`);
          } else {
            toast.success(`${productsAdded} produse adăugate în categoria ${categoryName}.`);
          }
        } else {
          if (productsSkipped > 0) {
            toast.warning(`Niciun produs nu a fost adăugat. ${productsSkipped} produse au fost ignorate. Verificați formatul fișierului.`);
          } else {
            toast.warning("Niciun produs nu a fost adăugat. Verificați formatul fișierului.");
          }
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error(`Eroare la procesarea fișierului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
      }
    };
    
    reader.onerror = () => {
      toast.error("Eroare la citirea fișierului.");
    };
    
    reader.readAsText(file);
  };

  const processSubcategoryFile = async (categoryName: string, subcategoryName: string, file: File) => {
    try {
      // Create backup before proceeding
      if (database) {
        createBackup(database);
      }
      
      let data: any[];
      
      if (file.name.endsWith('.csv')) {
        data = await new Promise<any[]>((resolve) => {
          Papa.parse(file, {
            header: true,
            complete: (res) => resolve(res.data),
            error: (error) => {
              console.error("CSV parse error:", error);
              toast.error(`Eroare la parsarea CSV: ${error.message}`);
              resolve([]);
            }
          });
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(ws);
      } else {
        toast.error("Format de fișier neacceptat. Vă rugăm să încărcați un fișier CSV sau Excel.");
        return;
      }
      
      if (!data || data.length === 0) {
        toast.error("Nu s-au găsit date în fișier sau formatul este incorect");
        return;
      }
      
      console.log("Imported data for ", categoryName, subcategoryName, ":", data);
      
      // Find the category and subcategory in the database
      const updatedDb = { ...loadDatabase() };
      const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
      
      if (categoryIndex === -1) {
        toast.error(`Categoria ${categoryName} nu există.`);
        return;
      }
      
      const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories.findIndex(
        s => s.name === subcategoryName
      );
      
      if (subcategoryIndex === -1) {
        toast.error(`Subcategoria ${subcategoryName} nu există în categoria ${categoryName}.`);
        return;
      }
      
      // Get the fields for this subcategory
      const fields = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].fields;
      
      // Map the data to products
      const products = data.map((row: any) => {
        const productData: any = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cod: row['Cod Produs'] || row['cod'] || row['COD'] || '',
          descriere: row['Descriere'] || row['descriere'] || row['DESCRIERE'] || '',
          pret: parseFloat(String(row['Pret'] || row['pret'] || row['PRET'] || 0).replace(',', '.'))
        };
        
        // Map additional fields
        fields.forEach(field => {
          const fieldName = field.name;
          const possibleKeys = [fieldName, fieldName.toLowerCase(), fieldName.toUpperCase()];
          
          // Try to find the field in the row
          for (const key of Object.keys(row)) {
            if (possibleKeys.includes(key) || key.toLowerCase() === fieldName.toLowerCase()) {
              productData[fieldName] = row[key];
              break;
            }
          }
        });
        
        return productData;
      }).filter(product => product.cod && product.pret);
      
      if (products.length === 0) {
        toast.error("Nu s-au găsit produse valide în fișier");
        return;
      }
      
      // Check for duplicates first
      const existingProducts = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products;
      const newProductCodes = products.map(p => p.cod);
      const existingProductCodes = existingProducts.map(p => p.cod);
      
      // Find duplicates
      const duplicates = newProductCodes.filter(code => existingProductCodes.includes(code));
      const uniqueProducts = products.filter(product => !existingProductCodes.includes(product.cod));
      
      // Replace existing products
      if (uniqueProducts.length > 0) {
        const updatedProducts = [...existingProducts, ...uniqueProducts];
        updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products = updatedProducts;
        
        // Save the database
        saveFullDatabase(updatedDb);
        
        if (duplicates.length > 0) {
          toast.success(`Import reușit: ${uniqueProducts.length} produse noi încărcate în ${categoryName}/${subcategoryName}. ${duplicates.length} produse duplicate au fost ignorate.`);
        } else {
          toast.success(`Import reușit: ${uniqueProducts.length} produse încărcate în ${categoryName}/${subcategoryName}`);
        }
      } else {
        toast.warning(`Toate cele ${duplicates.length} produse există deja în baza de date. Niciun produs nou adăugat.`);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(`Eroare la procesarea fișierului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
    }
  };

  const handleFileChange = (categoryName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Processing file ${file.name} for category ${categoryName}`);
      processFile(categoryName, file);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleSubcategoryFileChange = (categoryName: string, subcategoryName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Processing file ${file.name} for ${categoryName}/${subcategoryName}`);
      processSubcategoryFile(categoryName, subcategoryName, file);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleExportDatabase = () => {
    try {
      const jsonData = exportDatabaseJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `furniture-database-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Baza de date exportată cu succes");
    } catch (error) {
      toast.error(`Eroare la exportul bazei de date: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
    }
  };

  const handleImportFullDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Create a backup before importing
        if (database) {
          createBackup(database);
        }
        
        // Import the database
        const success = importDatabaseJSON(content);
        if (success) {
          // Reload database
          const updatedDb = loadDatabase();
          setDatabase(updatedDb);
          toast.success("Baza de date a fost importată cu succes");
        } else {
          toast.error("Eroare la importul bazei de date. Verificați formatul JSON.");
        }
      } catch (error) {
        console.error("Error importing database:", error);
        toast.error(`Eroare la importul bazei de date: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
      }
      
      // Reset file input
      event.target.value = '';
    };
    
    reader.onerror = () => {
      toast.error("Eroare la citirea fișierului.");
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  const handleEditProduct = (categoryName: string, subcategoryName: string, product: Product) => {
    setCurrentCategory(categoryName);
    setCurrentSubcategory(subcategoryName);
    setProductBeingEdited(product);
    setIsEditModalOpen(true);
  };

  const handleAddProduct = (categoryName: string, subcategoryName: string) => {
    setCurrentCategory(categoryName);
    setCurrentSubcategory(subcategoryName);
    
    // Reset new product
    const initialProduct: any = { cod: '', pret: 0, descriere: '' };
    setNewProduct(initialProduct);
    setIsAddModalOpen(true);
  };

  const saveProductChanges = () => {
    if (!database || !productBeingEdited || !currentCategory || !currentSubcategory) return;
    
    // Create a backup first
    createBackup(database);

    // Check if product with same code already exists (and it's not the current product)
    const subcategory = database.categories
      .find(c => c.name === currentCategory)
      ?.subcategories.find(s => s.name === currentSubcategory);
      
    if (subcategory) {
      const duplicateProduct = subcategory.products.find(
        p => p.cod === productBeingEdited.cod && p.id !== productBeingEdited.id
      );
      
      if (duplicateProduct) {
        toast.error(`Un produs cu codul ${productBeingEdited.cod} există deja`);
        return;
      }
    }

    const updatedDb = updateProduct(database, currentCategory, currentSubcategory, productBeingEdited);
    saveDatabase(updatedDb);
    setDatabase(updatedDb);
    setIsEditModalOpen(false);
    toast.success("Produsul a fost actualizat");
  };

  const saveNewProduct = () => {
    if (!database || !currentCategory || !currentSubcategory) return;
    
    // Create a backup first
    createBackup(database);

    if (!newProduct.cod) {
      toast.error("Codul produsului este obligatoriu");
      return;
    }

    if (isNaN(Number(newProduct.pret))) {
      toast.error("Prețul trebuie să fie un număr");
      return;
    }
    
    // Check if product with same code already exists
    const subcategory = database.categories
      .find(c => c.name === currentCategory)
      ?.subcategories.find(s => s.name === currentSubcategory);
      
    if (subcategory) {
      const duplicateProduct = subcategory.products.find(p => p.cod === newProduct.cod);
      
      if (duplicateProduct) {
        toast.error(`Un produs cu codul ${newProduct.cod} există deja`);
        return;
      }
    }

    const productToAdd = {
      ...newProduct,
      pret: Number(newProduct.pret)
    };

    const updatedDb = addProduct(database, currentCategory, currentSubcategory, productToAdd);
    saveDatabase(updatedDb);
    setDatabase(updatedDb);
    setIsAddModalOpen(false);
    toast.success("Produsul a fost adăugat cu succes", {
      duration: 4000
    });
  };

  const handleDeleteProduct = (categoryName: string, subcategoryName: string, productId: string) => {
    if (!database) return;
    
    // Create a backup first
    createBackup(database);
    
    const updatedDb = deleteProduct(database, categoryName, subcategoryName, productId);
    saveDatabase(updatedDb);
    setDatabase(updatedDb);
    toast.success("Produsul a fost șters", {
      duration: 4000
    });
  };

  const handleFieldChange = (product: Product, field: string, value: any) => {
    setProductBeingEdited({
      ...product,
      [field]: value
    });
  };

  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportCategory = (categoryName: string) => {
    try {
      if (!database) return;
      
      const category = database.categories.find(c => c.name === categoryName);
      if (!category) {
        toast.error(`Categoria ${categoryName} nu a fost găsită`);
        return;
      }
      
      // Create a new database with just this category
      const exportDb = {
        categories: [category]
      };
      
      const jsonData = JSON.stringify(exportDb, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${categoryName}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Categoria ${categoryName} a fost exportată cu succes`);
    } catch (error) {
      toast.error(`Eroare la exportul categoriei: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
    }
  };

  const handleImportCategory = (categoryName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!database) return;
        
        const content = e.target?.result as string;
        let importedData;
        
        try {
          importedData = JSON.parse(content);
        } catch (parseError) {
          toast.error("Eroare la parsarea fișierului JSON. Verificați formatul.");
          return;
        }
        
        // Create a backup before importing
        createBackup(database);
        
        // Find the category in imported data
        const importedCategory = importedData.categories?.find((c: any) => c.name === categoryName);
        
        if (!importedCategory) {
          toast.error(`Categoria ${categoryName} nu a fost găsită în fișierul importat.`);
          return;
        }
        
        // Find the category in the current database
        const updatedDb = { ...loadDatabase() };
        const categoryIndex = updatedDb.categories.findIndex(c => c.name === categoryName);
        
        if (categoryIndex === -1) {
          toast.error(`Categoria ${categoryName} nu există în baza de date curentă.`);
          return;
        }
        
        // Merge subcategories from imported data
        let totalNewProducts = 0;
        let totalNewSubcategories = 0;
        
        importedCategory.subcategories.forEach((importedSubcategory: any) => {
          // Find if this subcategory exists in current database
          const subcategoryIndex = updatedDb.categories[categoryIndex].subcategories.findIndex(
            s => s.name === importedSubcategory.name
          );
          
          if (subcategoryIndex === -1) {
            // If subcategory doesn't exist, add it
            updatedDb.categories[categoryIndex].subcategories.push(importedSubcategory);
            totalNewSubcategories++;
            totalNewProducts += importedSubcategory.products.length;
          } else {
            // If subcategory exists, merge products
            const existingProducts = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products;
            
            // Find products that don't already exist
            const newProducts = importedSubcategory.products.filter((importedProduct: any) => {
              return !existingProducts.some(existingProduct => existingProduct.cod === importedProduct.cod);
            });
            
            // Add new products to existing subcategory
            if (newProducts.length > 0) {
              updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products = [
                ...existingProducts,
                ...newProducts
              ];
              totalNewProducts += newProducts.length;
            }
          }
        });
        
        // Save the updated database
        saveDatabase(updatedDb);
        setDatabase(updatedDb);
        
        if (totalNewProducts > 0 || totalNewSubcategories > 0) {
          toast.success(
            `Import reușit: ${totalNewProducts} produse noi și ${totalNewSubcategories} subcategorii noi au fost adăugate în categoria ${categoryName}.`,
            { duration: 6000 }
          );
        } else {
          toast.info("Nu s-au găsit produse sau subcategorii noi pentru import.", { duration: 4000 });
        }
      } catch (error) {
        console.error("Error importing category:", error);
        toast.error(`Eroare la importul categoriei: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
      }
      
      // Reset file input
      event.target.value = '';
    };
    
    reader.onerror = () => {
      toast.error("Eroare la citirea fișierului.");
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  if (isLoading || !database) {
    return <div className="h-screen flex items-center justify-center">Încărcare...</div>;
  }

  // Debug to make sure all categories are present in the database
  console.log("Available categories:", database.categories.map(c => c.name));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Baza de date</h1>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fullDatabaseInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleImportFullDatabase}
            />
            <Button 
              variant="outline"
              onClick={() => fullDatabaseInputRef.current?.click()}
              title="Importă baza de date completă"
            >
              <Import className="mr-2 h-4 w-4" /> Importă baza de date
            </Button>
            <Button onClick={handleExportDatabase} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Exportă baza de date
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {database.categories.map((category) => (
            <Card key={category.name} className="shadow-sm">
              <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log(`Save button clicked for category: ${category.name}`);
                      saveCategoryData(category.name);
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvează {category.name}
                  </Button>
                  
                  <input
                    type="file"
                    ref={(el) => fileInputRefs.current[category.name] = el}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={(e) => handleFileChange(category.name, e)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFileUpload(category.name)}
                  >
                    <Upload className="mr-2 h-4 w-4" /> 
                    Încarcă produse
                  </Button>
                  
                  {/* Export Category Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportCategory(category.name)}
                  >
                    <FileJson className="mr-2 h-4 w-4" /> 
                    Exportă
                  </Button>
                  
                  {/* Import Category Button */}
                  <input
                    type="file"
                    id={`import-${category.name}`}
                    ref={(el) => fileInputRefs.current[`import-${category.name}`] = el}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={(e) => handleImportCategory(category.name, e)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRefs.current[`import-${category.name}`]?.click()}
                  >
                    <Import className="mr-2 h-4 w-4" /> 
                    Importă
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" className="w-full">
                  {category.subcategories.map((subcategory) => (
                    <AccordionItem value={`${category.name}-${subcategory.name}`} key={subcategory.name}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between w-full">
                          <span>{subcategory.name}</span>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveSubcategoryData(category.name, subcategory.name);
                              }}
                              title={`Salvează ${subcategory.name}`}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddProduct(category.name, subcategory.name);
                              }}
                              title={`Adaugă produs manual în ${subcategory.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            
                            <input
                              type="file"
                              ref={(el) => fileInputRefs.current[`${category.name}-${subcategory.name}`] = el}
                              style={{ display: 'none' }}
                              accept=".csv,.xlsx,.xls"
                              onChange={(e) => handleSubcategoryFileChange(category.name, subcategory.name, e)}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubcategoryFileUpload(category.name, subcategory.name);
                              }}
                              title={`Încarcă fișier Excel/CSV pentru ${subcategory.name}`}
                            >
                              <File className="h-4 w-4 mr-1" />
                              <Upload className="h-4 w-4" />
                            </Button>
                            <span className="text-gray-500 font-normal">
                              {subcategory.products.length} produse
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Cod</TableHead>
                                <TableHead>Descriere</TableHead>
                                <TableHead>Preț</TableHead>
                                {subcategory.fields.map(field => (
                                  <TableHead key={field.name}>{field.name}</TableHead>
                                ))}
                                <TableHead className="w-[100px]">Acțiuni</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {subcategory.products.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">
                                    <a 
                                      href={`https://www.feroshop.ro/product/${product.cod}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {product.cod}
                                    </a>
                                  </TableCell>
                                  <TableCell>{product.descriere || '-'}</TableCell>
                                  <TableCell>{product.pret} RON</TableCell>
                                  {subcategory.fields.map(field => (
                                    <TableCell key={field.name}>
                                      {product[field.name] !== undefined ? 
                                        String(product[field.name]) : 
                                        '-'}
                                    </TableCell>
                                  ))}
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleEditProduct(category.name, subcategory.name, product)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleDeleteProduct(category.name, subcategory.name, product.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editare produs</DialogTitle>
          </DialogHeader>
          {productBeingEdited && currentCategory && currentSubcategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cod</label>
                  <Input 
                    value={productBeingEdited.cod} 
                    onChange={(e) => handleFieldChange(productBeingEdited, 'cod', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preț</label>
                  <Input 
                    type="number" 
                    value={productBeingEdited.pret} 
                    onChange={(e) => handleFieldChange(productBeingEdited, 'pret', parseFloat(e.target.value))} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descriere</label>
                <Input 
                  value={productBeingEdited.descriere || ''} 
                  onChange={(e) => handleFieldChange(productBeingEdited, 'descriere', e.target.value)} 
                />
              </div>
              
              {database && (
                database.categories
                  .find(c => c.name === currentCategory)
                  ?.subcategories.find(s => s.name === currentSubcategory)
                  ?.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium">{field.name}</label>
                      
                      {field.type === 'select' && field.options && (
                        <Select 
                          value={productBeingEdited[field.name] || ''} 
                          onValueChange={(val) => handleFieldChange(productBeingEdited, field.name, val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selectează ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === 'boolean' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={!!productBeingEdited[field.name]} 
                            onCheckedChange={(val) => handleFieldChange(productBeingEdited, field.name, val)}
                          />
                          <label className="text-sm">Da</label>
                        </div>
                      )}

                      {(field.type === 'text') && (
                        <Input 
                          value={productBeingEdited[field.name] || ''} 
                          onChange={(e) => handleFieldChange(productBeingEdited, field.name, e.target.value)}
                        />
                      )}
                      
                      {(field.type === 'number') && (
                        <Input 
                          type="number" 
                          value={productBeingEdited[field.name] || ''} 
                          onChange={(e) => handleFieldChange(productBeingEdited, field.name, parseFloat(e.target.value))}
                        />
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Anulare</Button>
            <Button onClick={saveProductChanges}>
              <Save className="h-4 w-4 mr-2" /> Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adaugă produs nou</DialogTitle>
          </DialogHeader>
          {currentCategory && currentSubcategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cod *</label>
                  <Input 
                    value={newProduct.cod} 
                    onChange={(e) => handleNewProductChange('cod', e.target.value)} 
                    placeholder="Cod produs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preț *</label>
                  <Input 
                    type="number" 
                    value={newProduct.pret} 
                    onChange={(e) => handleNewProductChange('pret', e.target.value)} 
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descriere</label>
                <Input 
                  value={newProduct.descriere || ''} 
                  onChange={(e) => handleNewProductChange('descriere', e.target.value)} 
                  placeholder="Descriere produs"
                />
              </div>
              
              {database && (
                database.categories
                  .find(c => c.name === currentCategory)
                  ?.subcategories.find(s => s.name === currentSubcategory)
                  ?.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium">{field.name}</label>
                      
                      {field.type === 'select' && field.options && (
                        <Select 
                          value={newProduct[field.name] || ''} 
                          onValueChange={(val) => handleNewProductChange(field.name, val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selectează ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === 'boolean' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={!!newProduct[field.name]} 
                            onCheckedChange={(val) => handleNewProductChange(field.name, val)}
                          />
                          <label className="text-sm">Da</label>
                        </div>
                      )}

                      {(field.type === 'text') && (
                        <Input 
                          value={newProduct[field.name] || ''} 
                          onChange={(e) => handleNewProductChange(field.name, e.target.value)}
                          placeholder={field.name}
                        />
                      )}
                      
                      {(field.type === 'number') && (
                        <Input 
                          type="number" 
                          value={newProduct[field.name] || ''} 
                          onChange={(e) => handleNewProductChange(field.name, parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Anulare</Button>
            <Button onClick={saveNewProduct}>
              <Save className="h-4 w-4 mr-2" /> Adaugă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Database;
