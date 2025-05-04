
import React, { useState, useRef } from 'react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Save, Trash2, Upload, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadProductImage } from '@/lib/firebase';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setPreviewUrl(null);
      return;
    }

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Vă rugăm să selectați un fișier imagine');
      return;
    }

    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageChange = (product: Product) => {
    // Trigger file input
    if (fileInputRef.current) {
      // Store the current product ID to associate the uploaded image with it
      fileInputRef.current.dataset.productId = product.id;
      fileInputRef.current.click();
    }
  };

  const handleExistingProductImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Vă rugăm să selectați un fișier imagine');
      return;
    }

    // Get product ID from dataset
    const productId = fileInputRef.current?.dataset.productId;
    if (!productId) return;
    
    setIsUploading(true);

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadProductImage(file, `product-${productId}`);
      
      // Update product with new image URL
      const updatedProducts = products.map(p => {
        if (p.id === productId) {
          return { ...p, imageUrl };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      toast.success("Imaginea a fost încărcată");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Eroare la încărcarea imaginii");
    } finally {
      setIsUploading(false);
    }
  };

  const addNewProduct = async () => {
    // Validate required fields
    if (!newProduct.cod || newProduct.pret === undefined) {
      toast.error("Completează codul și prețul");
      return;
    }

    setIsUploading(true);
    
    try {
      // Create product with or without image
      const tempProductId = Date.now().toString();
      let imageUrl;

      // Upload image if available
      if (selectedImage) {
        imageUrl = await uploadProductImage(selectedImage, `product-${tempProductId}`);
      } else if (previewUrl) {
        // If we have a preview URL (from a data URL), upload it
        imageUrl = await uploadProductImage(previewUrl, `product-${tempProductId}`);
      }
      
      // Add image URL to product if available
      const productToAdd = { 
        ...newProduct, 
        pret: Number(newProduct.pret),
        imageUrl
      };
      
      // Add product to database
      const updatedDb = addProduct(database, category.name, subcategory.name, productToAdd);
      
      // Reset form and update UI
      setNewProduct({ cod: '', pret: 0 });
      setShowNewProductForm(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      onDatabaseUpdate(updatedDb);
      toast.success("Produs adăugat");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Eroare la adăugarea produsului");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedDb = deleteProduct(database, category.name, subcategory.name, productId);
    onDatabaseUpdate(updatedDb);
    toast.success("Produs șters");
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

      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleExistingProductImageChange}
      />

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
                onChange={(e) => handleNewProductChange('pret', parseFloat(e.target.value))} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagine produs</label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
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

            {subcategory.fields.map(field => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">{field.name}</label>
                
                {field.type === 'select' && field.options && (
                  <Select 
                    value={newProduct[field.name] || undefined} 
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
                      field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewProductForm(false)}>
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
                  <span>Se încarcă...</span>
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
                        <img 
                          src={product.imageUrl} 
                          alt={product.cod} 
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProductImageChange(product)} 
                          disabled={isUploading}
                          className="h-12 w-12 flex items-center justify-center"
                        >
                          {isUploading && fileInputRef.current?.dataset.productId === product.id ? (
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
                      onChange={(e) => handleProductChange(product, 'pret', parseFloat(e.target.value))}
                      className="h-8 w-24"
                    />
                  </TableCell>
                  
                  {subcategory.fields.map(field => (
                    <TableCell key={field.name}>
                      {field.type === 'select' && field.options && (
                        <Select 
                          value={product[field.name] || undefined} 
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
                            field.type === 'number' ? parseFloat(e.target.value) : e.target.value
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
    </div>
  );
};

export default AdminCategoryEditor;
