
import React, { useState, useEffect } from 'react';
import { Database, loadDatabase } from '@/lib/db';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';

const Admin = () => {
  const [database, setDatabase] = useState<Database | null>(null);

  useEffect(() => {
    const db = loadDatabase();
    setDatabase(db);
  }, []);

  const handleDatabaseUpdate = (updatedDb: Database) => {
    setDatabase(updatedDb);
  };

  if (!database) {
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
