
import React, { useState } from 'react';
import { Database, exportDatabaseJSON, importDatabaseJSON, loadDatabase } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ExportImportTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const ExportImportTab: React.FC<ExportImportTabProps> = ({ database, onDatabaseUpdate }) => {
  const [jsonExport, setJsonExport] = useState("");
  const [jsonImport, setJsonImport] = useState("");

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
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryName: string, subcategoryName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
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
      
      // Replace existing products
      updatedDb.categories[categoryIndex].subcategories[subcategoryIndex].products = products;
      
      // Save the database
      importDatabaseJSON(JSON.stringify(updatedDb));
      onDatabaseUpdate(loadDatabase());
      
      toast.success(`Import reușit: ${products.length} produse încărcate în ${categoryName}/${subcategoryName}`);
      
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
            <Button onClick={handleImportDB}>Importă JSON</Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Import CSV/Excel pentru categorii:</h3>
            
            {database.categories.map((category) => (
              <div key={category.name} className="mb-4">
                <h4 className="font-medium text-sm">{category.name}</h4>
                <div className="pl-4 space-y-2 mt-2">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.name} className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500">{subcategory.name}:</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          className="text-xs"
                          onChange={(e) => handleFileUpload(e, category.name, subcategory.name)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportImportTab;
