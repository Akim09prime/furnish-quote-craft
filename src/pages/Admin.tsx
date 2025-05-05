import React, { useState, useEffect } from 'react';
import { Database, loadDatabase, saveDatabase } from '@/lib/db';
import { initialDB } from '@/data/initialDB';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { checkCloudinaryAvailability } from '@/lib/cloudinary';

const Admin = () => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  const loadDatabaseData = () => {
    setIsLoading(true);
    const db = loadDatabase();
    setDatabase(db);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDatabaseData();
    // Verificare Cloudinary
    checkCloudinary();
  }, []);
  
  const checkCloudinary = async () => {
    setCloudinaryStatus('checking');
    try {
      const isAvailable = await checkCloudinaryAvailability();
      
      if (isAvailable) {
        console.log("Cloudinary API este disponibil");
        toast.success("Cloudinary API este disponibil - folosim cloud name 'demo' și preset 'ml_default'", {
          duration: 3000
        });
        setCloudinaryStatus('available');
      } else {
        console.error("Cloudinary API nu răspunde cum trebuie");
        toast.error("Cloudinary API nu răspunde cum trebuie. Verificați configurația actualizată: cloud name 'demo' și preset 'ml_default'.", {
          duration: 5000
        });
        setCloudinaryStatus('unavailable');
      }
    } catch (error) {
      console.error("Eroare la verificarea Cloudinary:", error);
      toast.error("Nu se poate accesa Cloudinary API. Verificați conexiunea la internet și setările Cloudinary.", {
        duration: 5000
      });
      setCloudinaryStatus('unavailable');
    }
  };

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
          <div className="flex gap-2">
            {cloudinaryStatus === 'unavailable' && (
              <Button 
                variant="outline" 
                onClick={checkCloudinary}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Verifică Cloudinary
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleResetDatabase}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reset la valorile inițiale
            </Button>
          </div>
        </div>
        
        <AdminPanel 
          database={database} 
          onDatabaseUpdate={handleDatabaseUpdate} 
          cloudinaryStatus={cloudinaryStatus}
        />
      </div>
    </div>
  );
};

export default Admin;
