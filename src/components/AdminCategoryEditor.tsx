
import React, { useState } from 'react';
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
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const saveChanges = () => {
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

  const addNewProduct = () => {
    // Validate required fields
    if (!newProduct.cod || newProduct.pret === undefined) {
      toast.error("Completează codul și prețul");
      return;
    }

    // Add product to database
    const productToAdd = { ...newProduct, pret: Number(newProduct.pret) };
    const updatedDb = addProduct(database, category.name, subcategory.name, productToAdd);
    
    // Reset form and update UI
    setNewProduct({ cod: '', pret: 0 });
    setShowNewProductForm(false);
    onDatabaseUpdate(updatedDb);
    toast.success("Produs adăugat");
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

            {subcategory.fields.map(field => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">{field.name}</label>
                
                {field.type === 'select' && field.options && (
                  <Select 
                    value={newProduct[field.name] || ""} 
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
            <Button onClick={addNewProduct}>
              Adaugă Produs
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={subcategory.fields.length + 3} className="text-center py-4">
                  Nu există produse în această subcategorie
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
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
                          value={product[field.name] || ""} 
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
