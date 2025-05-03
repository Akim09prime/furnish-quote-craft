
import React, { useState } from 'react';
import { Database, exportDatabaseJSON, importDatabaseJSON, loadDatabase } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { fetchFilteredFeroShopDB } from '@/lib/feroshop';

interface ExportImportTabProps {
  database: Database;
  onDatabaseUpdate: (db: Database) => void;
}

const ExportImportTab: React.FC<ExportImportTabProps> = ({ database, onDatabaseUpdate }) => {
  const [jsonExport, setJsonExport] = useState("");
  const [jsonImport, setJsonImport] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAutoImport = async () => {
    try {
      setIsLoading(true);
      const json = await fetchFilteredFeroShopDB();
      // Filter for accesorii if needed
      const db = JSON.parse(json);
      const accessories = {
        ...db,
        products: db.products.filter((p: any) => p.categorySlug === 'accesorii')
      };
      
      if (importDatabaseJSON(JSON.stringify(accessories))) {
        onDatabaseUpdate(loadDatabase());
        toast.success('Accesorii importate cu succes');
      } else {
        toast.error('Structura JSON invalidă');
      }
    } catch (e) {
      toast.error(`Eroare la import: ${e instanceof Error ? e.message : 'Eroare necunoscută'}`);
    } finally {
      setIsLoading(false);
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExportDB}>Generează JSON</Button>
            <Button onClick={handleAutoImport} disabled={isLoading}>
              {isLoading ? 'Se importă...' : 'Importă Accesorii'}
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
  );
};

export default ExportImportTab;
