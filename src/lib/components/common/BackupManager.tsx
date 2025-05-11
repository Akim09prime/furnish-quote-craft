import React from 'react';
import { Database } from '@/lib/db';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { RefreshCw, Save } from 'lucide-react';

interface BackupManagerProps {
  database: Database;
  onRestore?: (backup: Database) => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({ database, onRestore }) => {
  const BACKUP_KEY = "furniture-quote-db-backups";
  
  const createBackup = () => {
    try {
      const newBackup = {
        date: new Date().toISOString(),
        database: database
      };
      
      // Get existing backups
      const savedBackups = localStorage.getItem(BACKUP_KEY);
      let existingBackups = [];
      
      if (savedBackups) {
        existingBackups = JSON.parse(savedBackups);
      }
      
      // Add new backup
      existingBackups.push(newBackup);
      
      // Keep only the last 10 backups
      const limitedBackups = existingBackups.slice(-10);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_KEY, JSON.stringify(limitedBackups));
      
      toast.success("Backup creat cu succes", {
        description: `Backup creat la ${new Date().toLocaleTimeString()}`
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Eroare la crearea backup-ului");
    }
  };
  
  return (
    <div>
      <Button 
        onClick={createBackup} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Creează Backup
      </Button>
    </div>
  );
};

export default BackupManager;
