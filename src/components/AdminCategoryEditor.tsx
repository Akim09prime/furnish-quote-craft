import React, { useState, useRef, useEffect } from 'react';
import { 
  Category, 
  Subcategory, 
  Product,
  updateProduct,
  addProduct,
  deleteProduct,
  Database,
  saveDatabase
} from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Save, Trash2, Upload, Image, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { uploadProductImage, deleteProductImage, storage } from '@/lib/firebase';
import { Progress } from "@/components/ui/progress";

interface AdminCategoryEditorProps {
  database: Database;
  category: Category;
  subcategory: Subcategory;
  onDatabaseUpdate: (db: Database) => void;
}

const AdminCategoryEditor: React.FC<AdminCategoryEditorProps> = ({ 
  database, 
  category, 
  subcategory,
  onDatabaseUpdate
}) => {
  const [products, setProducts] = useState<Product[]>([...subcategory.products]);
  const [newProduct, setNewProduct] = useState<Record<string, any>>({
    cod: '',
    pret: 0
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Reset products list when category or subcategory changes
    setProducts([...subcategory.products]);
  }, [subcategory]);

  // Verify Firebase Storage is available
  useEffect(() => {
    const checkStorage = async () => {
      try {
        if (!storage) {
          console.error("Firebase Storage nu este inițializat în AdminCategoryEditor!");
          toast.error("Eroare: Firebase Storage nu este disponibil");
          setStorageAvailable(false);
          return;
        }
        
        console.log("Firebase Storage este disponibil în AdminCategoryEditor");
        setStorageAvailable(true);
      } catch (error) {
        console.error("Error checking Firebase Storage:", error);
        toast.error("Eroare la verificarea Firebase Storage");
        setStorageAvailable(false);
      }
    };
    
    checkStorage();
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeout) {
        clearTimeout(uploadTimeout);
      }
    };
  }, [uploadTimeout]);

  const handleProductChange = (product: Product, field: string, value: any) => {
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      let updatedDb = { ...database };
      
      // Update existing products
      products.forEach(product => {
        const originalProduct = subcategory.products.find(p => p.id === product.id);
        
        // If product changed, update it
        if (originalProduct && JSON.stringify(originalProduct) !== JSON.stringify(product)) {
          updatedDb = updateProduct(updatedDb, category.name, subcategory.name, product);
        }
      });
      
      saveDatabase(updatedDb);
      onDatabaseUpdate(updatedDb);
      toast.success("Modificările au fost salvate");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Eroare la salvarea modificărilor");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setPreviewUrl(null);
      return;
    }

    console.log("Selected image file:", file.name, file.type, file.size);
    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageChange = (product: Product) => {
    // Store the current product ID
    setUploadingProductId(product.id);
    setUploadError(null);
    setUploadProgress(0);
    
    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUploadState = () => {
    setIsUploading(false);
    setUploadingProductId(null);
    setUploadProgress(0);
    
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (newImageInputRef.current) {
      newImageInputRef.current.value = '';
    }
  };
  
  const cancelUpload = () => {
    toast.info("Încărcarea a fost anulată");
    resetUploadState();
  };

  const handleExistingProductImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingProductId) {
      setUploadingProductId(null);
      return;
    }

    console.log("Selected image for product:", file.name, file.type, file.size);
    
    if (!storageAvailable) {
      toast.error('Firebase Storage nu este disponibil. Încărcarea imaginilor nu este posibilă.');
      setUploadingProductId(null);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      console.log("Încărcarea imaginii pentru produsul cu ID:", uploadingProductId);
      toast.info("Încărcare imagine...", { id: "upload-toast" });
      
      // Create a unique path for the image to avoid caching issues
      const timestamp = Date.now();
      const imagePath = `${category.name}/${subcategory.name}/${timestamp}-product-${uploadingProductId}`;
      
      console.log(`Using image path: ${imagePath}`);
      
      // Upload image to Firebase Storage with the simplified approach
      const imageUrl = await uploadProductImage(
        file, 
        imagePath,
        (progress) => {
          console.log(`Upload progress update: ${progress}%`);
          setUploadProgress(progress);
          if (progress === 100) {
            toast.success("Imagine încărcată", { id: "upload-toast" });
          }
        }
      );
      
      console.log("Imagine încărcată cu succes, URL:", imageUrl);
      
      // Update product with new image URL
      const updatedProducts = products.map(p => {
        if (p.id === uploadingProductId) {
          return { ...p, imageUrl };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Save changes to database
      let updatedDb = { ...database };
      const productToUpdate = updatedProducts.find(p => p.id === uploadingProductId);
      if (productToUpdate) {
        updatedDb = updateProduct(updatedDb, category.name, subcategory.name, productToUpdate);
        saveDatabase(updatedDb);
        onDatabaseUpdate(updatedDb);
      }
      
      toast.success("Imaginea a fost încărcată și salvată");
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      setUploadError(errorMessage);
      toast.error(`Eroare la încărcarea imaginii: ${errorMessage}`);
    } finally {
      resetUploadState();
    }
  };

  const addNewProduct = async () => {
    // Validate required fields
    if (!newProduct.cod || newProduct.pret === undefined) {
      toast.error("Completează codul și prețul");
      return;
    }

    if (selectedImage && !storageAvailable) {
      toast.error('Firebase Storage nu este disponibil. Încărcarea imaginilor nu este posibilă.');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create product with or without image
      const tempProductId = Date.now().toString();
      let imageUrl;

      // Upload image if available
      if (selectedImage && storageAvailable) {
        console.log("Încărcare imagine pentru produsul nou:", selectedImage.name);
        toast.info("Încărcare imagine pentru produs nou...");
        
        // Create a unique path for the image to avoid caching issues
        const timestamp = Date.now();
        const imagePath = `${category.name}/${subcategory.name}/${timestamp}-new-product-${tempProductId}`;
        
        imageUrl = await uploadProductImage(
          selectedImage, 
          imagePath,
          (progress) => {
            setUploadProgress(progress);
          }
        );
        
        console.log("Imagine încărcată cu succes, URL:", imageUrl);
      }
      
      // Add image URL to product if available
      const productToAdd = { 
        ...newProduct, 
        pret: Number(newProduct.pret),
        imageUrl
      };
      
      // Add product to database
      const updatedDb = addProduct(database, category.name, subcategory.name, productToAdd);
      saveDatabase(updatedDb);
      
      // Reset form and update UI
      setNewProduct({ cod: '', pret: 0 });
      setShowNewProductForm(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      onDatabaseUpdate(updatedDb);
      toast.success("Produs adăugat");
    } catch (error) {
      console.error("Error adding product:", error);
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      setUploadError(errorMessage);
      toast.error(`Eroare la adăugarea produsului: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clear the file input to allow selecting the same file again
      if (newImageInputRef.current) {
        newImageInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // First try to delete the image if it exists
      const product = products.find(p => p.id === productId);
      if (product?.imageUrl && storageAvailable) {
        toast.info("Ștergere imagine...");
        
        // Extract the path from the URL
        const urlParts = product.imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        const imagePath = `${category.name}/${subcategory.name}/${fileName}`;
        
        try {
          await deleteProductImage(imagePath);
          console.log("Product image deleted successfully");
        } catch (imageError) {
          console.error("Failed to delete product image:", imageError);
          // Continue with product deletion even if image deletion fails
        }
      }
      
      const updatedDb = deleteProduct(database, category.name, subcategory.name, productId);
      saveDatabase(updatedDb);
      onDatabaseUpdate(updatedDb);
      toast.success("Produs șters");
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Eroare la ștergerea produsului");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">
          Editare {category.name} &gt; {subcategory.name}
        </h3>
        <div className="space-x-2">
          <Button onClick={() => setShowNewProductForm(true)} className="gap-2">
            <PlusCircle size={16} />
            <span>Adaugă Produs</span>
          </Button>
          <Button onClick={saveChanges} className="gap-2">
            <Save size={16} />
            <span>Salvează Schimbările</span>
          </Button>
        </div>
      </div>

      {!storageAvailable && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4">
          <p className="font-bold">Atenție!</p>
          <p>Firebase Storage nu este disponibil. Încărcarea imaginilor nu va funcționa.</p>
        </div>
      )}

      {uploadError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Eroare la încărcarea imaginii:</p>
          <p>{uploadError}</p>
        </div>
      )}

      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleExistingProductImageChange}
      />

      {/* New product form */}
      {showNewProductForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <h4 className="font-medium mb-3">Adaugă Produs Nou</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cod</label>
              <Input 
                value={newProduct.cod || ''} 
                onChange={(e) => handleNewProductChange('cod', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preț</label>
              <Input 
                type="number" 
                value={newProduct.pret || ''} 
                onChange={(e) => handleNewProductChange('pret', parseFloat(e.target.value) || 0)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagine produs</label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  ref={newImageInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                  disabled={!storageAvailable}
                />
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded-md" 
                  />
                </div>
              )}
            </div>

            {/* Add other fields */}
            {subcategory.fields.map(field => (
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
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox 
                      checked={!!newProduct[field.name]} 
                      onCheckedChange={(val) => handleNewProductChange(field.name, val)}
                    />
                    <label className="text-sm">Da</label>
                  </div>
                )}

                {(field.type === 'text' || field.type === 'number') && (
                  <Input 
                    type={field.type} 
                    value={newProduct[field.name] || ""} 
                    onChange={(e) => handleNewProductChange(
                      field.name, 
                      field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowNewProductForm(false);
              setSelectedImage(null);
              setPreviewUrl(null);
            }}>
              Anulează
            </Button>
            <Button 
              onClick={addNewProduct} 
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Se încarcă... {uploadProgress > 0 ? `${uploadProgress}%` : ''}</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Adaugă Produs</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagine</TableHead>
              <TableHead>Cod</TableHead>
              <TableHead>Preț</TableHead>
              {subcategory.fields.map(field => (
                <TableHead key={field.name}>{field.name}</TableHead>
              ))}
              <TableHead className="w-[80px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={subcategory.fields.length + 4} className="text-center py-4">
                  Nu există produse în această subcategorie
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <div className="relative group">
                          <img 
                            src={`${product.imageUrl}?t=${Date.now()}`} 
                            alt={product.cod} 
                            className="h-12 w-12 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100/gray/white?text=Error';
                              console.error("Error loading image:", product.imageUrl);
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProductImageChange(product)} 
                            disabled={!storageAvailable || isUploading}
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/50 rounded-md text-white"
                          >
                            {isUploading && uploadingProductId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload size={16} />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProductImageChange(product)} 
                          disabled={isUploading || !storageAvailable}
                          className="h-12 w-12 flex items-center justify-center"
                        >
                          {isUploading && uploadingProductId === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Image size={16} />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={product.cod}
                      onChange={(e) => handleProductChange(product, 'cod', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.pret}
                      onChange={(e) => handleProductChange(product, 'pret', parseFloat(e.target.value) || 0)}
                      className="h-8 w-24"
                    />
                  </TableCell>
                  
                  {/* Other fields */}
                  {subcategory.fields.map(field => (
                    <TableCell key={field.name}>
                      {field.type === 'select' && field.options && (
                        <Select 
                          value={product[field.name] || ''} 
                          onValueChange={(val) => handleProductChange(product, field.name, val)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {field.type === 'boolean' && (
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={!!product[field.name]} 
                            onCheckedChange={(val) => handleProductChange(product, field.name, val)}
                          />
                        </div>
                      )}

                      {(field.type === 'text' || field.type === 'number') && (
                        <Input 
                          type={field.type} 
                          value={product[field.name] || ""} 
                          onChange={(e) => handleProductChange(
                            product, 
                            field.name, 
                            field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                          )}
                          className="h-8"
                        />
                      )}
                    </TableCell>
                  ))}
                  
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Încărcare imagine...</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cancelUpload} 
              className="h-6 w-6 p-0"
            >
              <span className="sr-only">Anulează</span>
              <RefreshCw size={14} className="text-red-500" />
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <div className="text-xs text-right mt-1">{uploadProgress}%</div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryEditor;
