
import React, { useState, useEffect } from 'react';
import { Database, loadDatabase, saveDatabase } from '@/lib/db';
import { initialDB } from '@/data/initialDB';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Admin = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDatabaseData = () => {
    setIsLoading(true);
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  const handleDatabaseUpdate = (updatedDb: Database) => {
    try {
      // First ensure we save to localStorage
      saveDatabase(updatedDb);
      
      // Then update the state
      setDatabase(updatedDb);
      
      // Show success message
      toast.success("Baza de date a fost actualizată");
      console.log("Database updated:", updatedDb);
    } catch (error) {
      console.error("Error updating database:", error);
      toast.error("Eroare la actualizarea bazei de date");
    }
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('furniture-quote-db'); // Remove the saved database
    toast.info("Resetarea bazei de date...");
    
    // Force reset using initialDB
    saveDatabase(initialDB);
    
    setTimeout(() => {
      loadDatabaseData(); // Reload database from initialDB
      toast.success("Baza de date a fost resetată la valorile implicite");
    }, 500);
  };

  if (isLoading || !database) {
    return <div className="h-screen flex items-center justify-center">Încărcare...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Administrare</h1>
          <Button 
            variant="outline" 
            onClick={handleResetDatabase}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset la valorile inițiale
          </Button>
        </div>
        <AdminPanel database={database} onDatabaseUpdate={handleDatabaseUpdate} />
      </div>
    </div>
  );
};

export default Admin;
