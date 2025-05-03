import React, { useState, useEffect } from 'react';
import { Database, exportDatabaseJSON, importDatabaseJSON, loadDatabase } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FileText, Upload, Database as DatabaseIcon, Archive, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ExportImportTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

// Format to store backups
interface DatabaseBackup {
  date: string;
  database: Database;
}

const BACKUP_KEY = "furniture-quote-db-backups";

const ExportImportTab: React.FC<ExportImportTabProps> = ({ database, onDatabaseUpdate }) => {
  const [jsonExport, setJsonExport] = useState("");
  const [jsonImport, setJsonImport] = useState("");
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  
  // Load backups on component mount
  useEffect(() => {
    loadBackups();
  }, []);
  
  // Function to load backups from localStorage
  const loadBackups = () => {
    try {
      const savedBackups = localStorage.getItem(BACKUP_KEY);
      if (savedBackups) {
        const parsedBackups = JSON.parse(savedBackups) as DatabaseBackup[];
        setBackups(parsedBackups);
      }
    } catch (error) {
      console.error("Error loading backups:", error);
    }
  };
  
  // Function to create a backup of the current database
  const createBackup = (db: Database) => {
    try {
      const newBackup: DatabaseBackup = {
        date: new Date().toISOString(),
        database: db
      };
      
      // Get existing backups
      const existingBackups = [...backups];
      
      // Add new backup
      existingBackups.push(newBackup);
      
      // Keep only the last 10 backups
      const limitedBackups = existingBackups.slice(-10);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_KEY, JSON.stringify(limitedBackups));
      
      // Update state
      setBackups(limitedBackups);
      
      console.log("Backup created:", newBackup.date);
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };
  
  // Function to restore from a backup
  const restoreFromBackup = (backup: DatabaseBackup) => {
    try {
      // Import the database from the backup
      const success = importDatabaseJSON(JSON.stringify(backup.database));
      if (success) {
        onDatabaseUpdate(backup.database);
        toast.success(`Baza de date restaurată din ${format(new Date(backup.date), 'dd MMM yyyy HH:mm:ss')}`);
      } else {
        toast.error("Eroare la restaurarea bazei de date");
      }
    } catch (error) {
      console.error("Error restoring from backup:", error);
      toast.error("Eroare la restaurarea bazei de date");
    }
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

    try {
      // Create a backup before importing
      createBackup(loadDatabase());
      
      const success = importDatabaseJSON(jsonImport);
      if (success) {
        onDatabaseUpdate(JSON.parse(jsonImport));
        toast.success("Baza de date importată cu succes");
        setJsonImport("");
      } else {
        toast.error("Eroare la import. Verifică formatul JSON");
      }
    } catch (error) {
      toast.error("Eroare la importul bazei de date");
      console.error("Import error:", error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonExport);
    toast.success("Copiat în clipboard");
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryName: string, subcategoryName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Create a backup before importing
      createBackup(loadDatabase());
      
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
        e.target.value = '';
        return;
      }
      
      if (!data || data.length === 0) {
        toast.error("Nu s-au găsit date în fișier sau formatul este incorect");
        return;
      }
      
      console.log("Imported data:", data);
      
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
      
      // Get existing products
      const existingProducts = updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products;
      
      // Map the data to products
      const newProducts = data.map((row: any) => {
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
      
      if (newProducts.length === 0) {
        toast.error("Nu s-au găsit produse valide în fișier");
        return;
      }
      
      // Check for existing products and only add new ones
      const alreadyExistingCount = {count: 0};
      const productsToAdd = newProducts.filter(newProduct => {
        const productExists = existingProducts.some(existingProduct => 
          existingProduct.cod === newProduct.cod
        );
        
        if (productExists) {
          alreadyExistingCount.count++;
          return false;
        }
        return true;
      });
      
      // Check if we actually have any new products to add
      if (productsToAdd.length === 0) {
        toast.error(`Toate produsele din acest fișier (${alreadyExistingCount.count}) există deja în baza de date.`);
        e.target.value = '';
        return;
      }
      
      // Add new products
      const updatedProducts = [...existingProducts, ...productsToAdd];
      
      // Replace existing products with updated list
      updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products = updatedProducts;
      
      // Save the database
      importDatabaseJSON(JSON.stringify(updatedDb));
      onDatabaseUpdate(loadDatabase());
      
      toast.success(
        `Import reușit: ${productsToAdd.length} produse noi adăugate în ${categoryName}/${subcategoryName}. ${alreadyExistingCount.count} produse existau deja.`
      );
      
      // Reset input
      e.target.value = '';
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(`Eroare la procesarea fișierului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
      e.target.value = '';
    }
  };

  return (
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
            <Button onClick={handleExportDB} className="flex items-center gap-2">
              <DatabaseIcon className="h-4 w-4" />
              Generează JSON
            </Button>
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Bază de Date</CardTitle>
            <CardDescription>
              Importă baza de date din format JSON, CSV sau Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Import JSON:
              </label>
              <Textarea 
                value={jsonImport} 
                onChange={e => setJsonImport(e.target.value)}
                placeholder="Paste JSON here..." 
                rows={5}
              />
              <Button onClick={handleImportDB} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importă JSON
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Arhivă Backup</CardTitle>
              <CardDescription>Restaurează baza de date din arhiva de backup</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span>Vezi arhiva</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Arhiva de Backup</DialogTitle>
                </DialogHeader>
                {backups.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Categorii</TableHead>
                          <TableHead>Total Produse</TableHead>
                          <TableHead>Acțiuni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backups.slice().reverse().map((backup, index) => {
                          // Calculate total products
                          const totalProducts = backup.database.categories.reduce((total, category) => {
                            return total + category.subcategories.reduce((subTotal, subcategory) => {
                              return subTotal + subcategory.products.length;
                            }, 0);
                          }, 0);

                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {format(new Date(backup.date), 'dd MMM yyyy HH:mm:ss')}
                                </div>
                              </TableCell>
                              <TableCell>
                                {backup.database.categories.map(c => c.name).join(', ')}
                              </TableCell>
                              <TableCell>{totalProducts}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => restoreFromBackup(backup)}
                                >
                                  Restaurează
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nu există backup-uri disponibile
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Import CSV/Excel pentru categorii</CardTitle>
          <CardDescription>
            Adaugă produse noi în subcategorii din fișiere CSV sau Excel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {database.categories.map((category) => (
            <div key={category.name} className="mb-6">
              <h4 className="font-medium text-md mb-2">{category.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.subcategories.map((subcategory) => (
                  <Card key={subcategory.name} className="p-3">
                    <CardTitle className="text-sm">{subcategory.name}</CardTitle>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{subcategory.products.length} produse</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.csv,.xlsx,.xls';
                            input.onchange = (e) => {
                              handleFileUpload(e as any, category.name, subcategory.name);
                            };
                            input.click();
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportImportTab;
