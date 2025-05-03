
import React, { useState } from 'react';
import { Database, exportDatabaseJSON, importDatabaseJSON } from '@/lib/db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminCategoryEditor from './AdminCategoryEditor';

interface AdminPanelProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ database, onDatabaseUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [jsonExport, setJsonExport] = useState("");
  const [jsonImport, setJsonImport] = useState("");

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Administrare Bază de Date</h1>
        <p className="text-gray-500">
          Modifică produsele și prețurile sau exportă/importă baza de date
        </p>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Editare Produse</TabsTrigger>
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
              <AdminCategoryEditor 
                database={database}
                category={category}
                subcategory={subcategory}
                onDatabaseUpdate={onDatabaseUpdate}
              />
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
