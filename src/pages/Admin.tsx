
import React, { useState, useEffect } from 'react';
import { Database, loadDatabase, saveDatabase } from '@/lib/db';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import { toast } from 'sonner';

const Admin = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  }, []);

  const handleDatabaseUpdate = (updatedDb: Database) => {
    try {
      saveDatabase(updatedDb);
      setDatabase(updatedDb);
      toast.success("Baza de date a fost actualizată");
    } catch (error) {
      console.error("Error updating database:", error);
      toast.error("Eroare la actualizarea bazei de date");
    }
  };

  if (isLoading || !database) {
    return <div className="h-screen flex items-center justify-center">Încărcare...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <AdminPanel database={database} onDatabaseUpdate={handleDatabaseUpdate} />
      </div>
    </div>
  );
};

export default Admin;
