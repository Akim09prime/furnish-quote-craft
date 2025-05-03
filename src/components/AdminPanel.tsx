
import React, { useState } from 'react';
import { Database, exportDatabaseJSON, importDatabaseJSON, addCategory, deleteCategory, updateSubcategory } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import AdminCategoryEditor from './AdminCategoryEditor';
import AdminCategoryManager from './AdminCategoryManager';

interface AdminPanelProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [jsonExport, setJsonExport] = useState("");
  const [jsonImport, setJsonImport] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTypeOption, setNewTypeOption] = useState<string>("");
  const [showAddType, setShowAddType] = useState<boolean>(false);
  const [newHingeType, setNewHingeType] = useState<string>("");
  const [showAddHingeType, setShowAddHingeType] = useState<boolean>(false);

  const category = database.categories.find(c => c.name === selectedCategory);
  const subcategory = category?.subcategories.find(s => s.name === selectedSubcategory);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("");
  };

  const handleExportDB = () => {
    const json = exportDatabaseJSON();
    setJsonExport(json);
    toast.success("Baza de date exportată");
  };

  const handleImportDB = () => {
    if (!jsonImport.trim()) {
      toast.error("Introdu datele de import");
      return;
    }

    const success = importDatabaseJSON(jsonImport);
    if (success) {
      onDatabaseUpdate(JSON.parse(jsonImport));
      toast.success("Baza de date importată cu succes");
      setJsonImport("");
    } else {
      toast.error("Eroare la import. Verifică formatul JSON");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonExport);
    toast.success("Copiat în clipboard");
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Numele categoriei nu poate fi gol");
      return;
    }

    try {
      const updatedDb = addCategory(database, newCategoryName);
      onDatabaseUpdate(updatedDb);
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success(`Categoria "${newCategoryName}" a fost adăugată`);
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : 'Eroare la adăugarea categoriei'}`);
    }
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) {
      toast.error("Selectați o categorie pentru ștergere");
      return;
    }

    try {
      const updatedDb = deleteCategory(database, selectedCategory);
      onDatabaseUpdate(updatedDb);
      setSelectedCategory("");
      setSelectedSubcategory("");
      toast.success(`Categoria "${selectedCategory}" a fost ștearsă`);
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : 'Eroare la ștergerea categoriei'}`);
    }
  };

  // Function to add a Type option for Glisiere
  const handleAddNewTypeOption = () => {
    if (!newTypeOption.trim()) {
      toast.error("Numele tipului nou nu poate fi gol");
      return;
    }
    
    const accesoriiCategory = database.categories.find(cat => cat.name === "Accesorii");
    if (!accesoriiCategory) {
      toast.error("Categoria Accesorii nu a fost găsită");
      return;
    }
    
    const glisiereSubcategory = accesoriiCategory.subcategories.find(sub => sub.name === "Glisiere");
    if (!glisiereSubcategory) {
      toast.error("Subcategoria Glisiere nu a fost găsită");
      return;
    }
    
    // Find the Type field
    const typeField = glisiereSubcategory.fields.find(field => field.name === "Type");
    if (!typeField || !typeField.options) {
      toast.error("Câmpul Type nu a fost găsit sau nu are opțiuni");
      return;
    }
    
    // Check if option already exists
    if (typeField.options.includes(newTypeOption.trim())) {
      toast.error(`Opțiunea "${newTypeOption}" există deja`);
      return;
    }
    
    // Create updated subcategory with new option
    const updatedSubcategory = {
      ...glisiereSubcategory,
      fields: glisiereSubcategory.fields.map(field => {
        if (field.name === "Type") {
          return {
            ...field,
            options: [...field.options!, newTypeOption.trim()]
          };
        }
        return field;
      })
    };
    
    try {
      // Update the database
      const updatedDb = updateSubcategory(
        database,
        "Accesorii",
        "Glisiere",
        updatedSubcategory
      );
      
      onDatabaseUpdate(updatedDb);
      setNewTypeOption("");
      setShowAddType(false);
      
      toast.success(`Tipul de glisieră "${newTypeOption}" a fost adăugat`);
      
      // Force page refresh to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding type option:", error);
      toast.error("A apărut o eroare la adăugarea tipului de glisieră");
    }
  };

  // New function to add a Tip option for Balamale
  const handleAddNewHingeType = () => {
    if (!newHingeType.trim()) {
      toast.error("Numele tipului nou de balamale nu poate fi gol");
      return;
    }
    
    const accesoriiCategory = database.categories.find(cat => cat.name === "Accesorii");
    if (!accesoriiCategory) {
      toast.error("Categoria Accesorii nu a fost găsită");
      return;
    }
    
    const balamaleSubcategory = accesoriiCategory.subcategories.find(sub => sub.name === "Balamale");
    if (!balamaleSubcategory) {
      toast.error("Subcategoria Balamale nu a fost găsită");
      return;
    }
    
    // Find the Tip field
    const tipField = balamaleSubcategory.fields.find(field => field.name === "Tip");
    if (!tipField || !tipField.options) {
      toast.error("Câmpul Tip nu a fost găsit sau nu are opțiuni");
      return;
    }
    
    // Check if option already exists
    if (tipField.options.includes(newHingeType.trim())) {
      toast.error(`Tipul de balamale "${newHingeType}" există deja`);
      return;
    }
    
    // Create updated subcategory with new option
    const updatedSubcategory = {
      ...balamaleSubcategory,
      fields: balamaleSubcategory.fields.map(field => {
        if (field.name === "Tip") {
          return {
            ...field,
            options: [...field.options!, newHingeType.trim()]
          };
        }
        return field;
      })
    };
    
    try {
      // Update the database
      const updatedDb = updateSubcategory(
        database,
        "Accesorii",
        "Balamale",
        updatedSubcategory
      );
      
      onDatabaseUpdate(updatedDb);
      setNewHingeType("");
      setShowAddHingeType(false);
      
      toast.success(`Tipul de balamale "${newHingeType}" a fost adăugat`);
      
      // Force page refresh to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding hinge type option:", error);
      toast.error("A apărut o eroare la adăugarea tipului de balamale");
    }
  };

  // New function to remove the Gtv product from Glisiere
  const removeGtvProductFromGlisiere = () => {
    const accesoriiCategory = database.categories.find(cat => cat.name === "Accesorii");
    if (!accesoriiCategory) {
      toast.error("Categoria Accesorii nu a fost găsită");
      return;
    }
    
    const glisiereSubcategory = accesoriiCategory.subcategories.find(sub => sub.name === "Glisiere");
    if (!glisiereSubcategory) {
      toast.error("Subcategoria Glisiere nu a fost găsită");
      return;
    }
    
    // Remove the Gtv product
    const updatedProducts = glisiereSubcategory.products.filter(product => 
      product.Type !== "Gtv"
    );
    
    // If no products were removed
    if (updatedProducts.length === glisiereSubcategory.products.length) {
      toast.info("Nu există produse de tip Gtv în subcategoria Glisiere");
      return;
    }
    
    // Create updated subcategory
    const updatedSubcategory = {
      ...glisiereSubcategory,
      products: updatedProducts
    };
    
    try {
      // Update the database
      const updatedDb = updateSubcategory(
        database,
        "Accesorii",
        "Glisiere",
        updatedSubcategory
      );
      
      onDatabaseUpdate(updatedDb);      
      toast.success("Produsele de tip Gtv au fost eliminate din subcategoria Glisiere");
      
      // Force page refresh to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error removing Gtv products:", error);
      toast.error("A apărut o eroare la eliminarea produselor de tip Gtv");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Administrare Bază de Date</h1>
        <p className="text-gray-500">
          Modifică produsele și prețurile sau exportă/importă baza de date
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Editare Produse</TabsTrigger>
          <TabsTrigger value="manage">Gestionare Categorii</TabsTrigger>
          <TabsTrigger value="categories">Categorii</TabsTrigger>
          <TabsTrigger value="glisiere">Tipuri Glisiere</TabsTrigger>
          <TabsTrigger value="balamale">Tipuri Balamale</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categorie</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {database.categories.map(category => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subcategorie</label>
                <Select 
                  value={selectedSubcategory} 
                  onValueChange={setSelectedSubcategory}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {category?.subcategories.map(sub => (
                      <SelectItem key={sub.name} value={sub.name}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {category && subcategory ? (
              <>
                {selectedCategory === "Accesorii" && selectedSubcategory === "Glisiere" && (
                  <div className="mb-4">
                    <Button 
                      variant="destructive" 
                      onClick={removeGtvProductFromGlisiere} 
                      className="gap-2"
                    >
                      <Trash2 size={16} />
                      <span>Șterge produsele Gtv</span>
                    </Button>
                  </div>
                )}
                <AdminCategoryEditor 
                  database={database}
                  category={category}
                  subcategory={subcategory}
                  onDatabaseUpdate={onDatabaseUpdate}
                />
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-10">
                    Selectează o categorie și o subcategorie pentru a începe editarea
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Categorie</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează categoria" />
                </SelectTrigger>
                <SelectContent>
                  {database.categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category ? (
              <AdminCategoryManager
                database={database}
                category={category}
                onDatabaseUpdate={onDatabaseUpdate}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-10">
                    Selectează o categorie pentru a începe gestionarea
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Administrare Categorii</CardTitle>
              <CardDescription>
                Adaugă sau șterge categorii în baza de date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddCategory(!showAddCategory)} variant="outline" className="gap-2">
                    <PlusCircle size={16} />
                    <span>Categorie Nouă</span>
                  </Button>
                </div>

                {showAddCategory && (
                  <div className="border p-4 rounded-md space-y-4">
                    <h3 className="font-medium">Adaugă Categorie Nouă</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nume Categorie</label>
                      <Input 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        placeholder="ex. Glisiere, Balamale, etc."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddCategory} className="gap-2">
                        <Save size={16} />
                        <span>Salvează Categoria</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Nume Categorie</th>
                        <th className="py-3 px-4 w-20">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {database.categories.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center py-4">
                            Nu există categorii
                          </td>
                        </tr>
                      ) : (
                        database.categories.map((cat) => (
                          <tr key={cat.name} className="border-b">
                            <td className="py-3 px-4">{cat.name}</td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  if (selectedCategory === cat.name) {
                                    handleDeleteCategory();
                                  } else {
                                    setSelectedCategory(cat.name);
                                    toast.info(`Selectați "Șterge" din nou pentru a confirma ștergerea categoriei "${cat.name}"`);
                                  }
                                }}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedCategory && (
                  <div className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleDeleteCategory}
                      className="gap-2"
                    >
                      <Trash2 size={16} />
                      <span>Șterge "{selectedCategory}"</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glisiere">
          <Card>
            <CardHeader>
              <CardTitle>Administrare Tipuri de Glisiere</CardTitle>
              <CardDescription>
                Adaugă tipuri noi de glisiere în baza de date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddType(!showAddType)} variant="outline" className="gap-2">
                    <PlusCircle size={16} />
                    <span>Tip Nou de Glisieră</span>
                  </Button>
                </div>

                {showAddType && (
                  <div className="border p-4 rounded-md space-y-4">
                    <h3 className="font-medium">Adaugă Tip Nou de Glisieră</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nume Tip</label>
                      <Input 
                        value={newTypeOption} 
                        onChange={(e) => setNewTypeOption(e.target.value)} 
                        placeholder="ex. Tandem, Legrabox, etc."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddNewTypeOption} className="gap-2">
                        <Save size={16} />
                        <span>Salvează Tip Glisieră</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Display existing types */}
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Tipuri de Glisiere Existente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const accesoriiCategory = database.categories.find(cat => cat.name === "Accesorii");
                        const glisiereSubcategory = accesoriiCategory?.subcategories.find(sub => sub.name === "Glisiere");
                        const typeField = glisiereSubcategory?.fields.find(field => field.name === "Type");
                        
                        if (!typeField || !typeField.options || typeField.options.length === 0) {
                          return (
                            <tr>
                              <td className="text-center py-4">
                                Nu există tipuri de glisiere
                              </td>
                            </tr>
                          );
                        }
                        
                        return typeField.options.map((type) => (
                          <tr key={type} className="border-b">
                            <td className="py-3 px-4">{type}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* New tab for balamale types */}
        <TabsContent value="balamale">
          <Card>
            <CardHeader>
              <CardTitle>Administrare Tipuri de Balamale</CardTitle>
              <CardDescription>
                Adaugă tipuri noi de balamale în baza de date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddHingeType(!showAddHingeType)} variant="outline" className="gap-2">
                    <PlusCircle size={16} />
                    <span>Tip Nou de Balamale</span>
                  </Button>
                </div>

                {showAddHingeType && (
                  <div className="border p-4 rounded-md space-y-4">
                    <h3 className="font-medium">Adaugă Tip Nou de Balamale</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nume Tip</label>
                      <Input 
                        value={newHingeType} 
                        onChange={(e) => setNewHingeType(e.target.value)} 
                        placeholder="ex. Aplicată, Semi-aplicată, Sticlă, etc."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddNewHingeType} className="gap-2">
                        <Save size={16} />
                        <span>Salvează Tip Balamale</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Display existing hinge types */}
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Tipuri de Balamale Existente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const accesoriiCategory = database.categories.find(cat => cat.name === "Accesorii");
                        const balamaleSubcategory = accesoriiCategory?.subcategories.find(sub => sub.name === "Balamale");
                        const tipField = balamaleSubcategory?.fields.find(field => field.name === "Tip");
                        
                        if (!tipField || !tipField.options || tipField.options.length === 0) {
                          return (
                            <tr>
                              <td className="text-center py-4">
                                Nu există tipuri de balamale
                              </td>
                            </tr>
                          );
                        }
                        
                        return tipField.options.map((type) => (
                          <tr key={type} className="border-b">
                            <td className="py-3 px-4">{type}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Bază de Date</CardTitle>
                <CardDescription>
                  Exportă baza de date în format JSON pentru backup sau transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button onClick={handleExportDB}>Generează JSON</Button>
                </div>
                {jsonExport && (
                  <div className="space-y-2">
                    <Textarea value={jsonExport} readOnly rows={10} />
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                        Copiază în clipboard
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Bază de Date</CardTitle>
                <CardDescription>
                  Importă baza de date din format JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Lipește codul JSON al bazei de date
                  </label>
                  <Textarea 
                    value={jsonImport} 
                    onChange={e => setJsonImport(e.target.value)}
                    placeholder="Paste JSON here..." 
                    rows={10}
                  />
                </div>
                <Button onClick={handleImportDB}>Importă Baza de Date</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
