
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import FurnitureDesigner from '@/components/FurnitureDesigner';
import PageHeader from '@/lib/components/common/PageHeader';
import { FurnitureDesign } from '@/components/FurnitureSetManager';
import { toast } from 'sonner';

const Designer = () => {
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<FurnitureDesign | null>(null);
  const [designs, setDesigns] = useState<FurnitureDesign[]>([]);

  // Load existing designs from localStorage
  useEffect(() => {
    const savedDesigns = localStorage.getItem('furniture-designs');
    if (savedDesigns) {
      try {
        setDesigns(JSON.parse(savedDesigns));
      } catch (e) {
        console.error('Error loading designs', e);
      }
    }
  }, []);

  // Save designs to localStorage
  const saveDesigns = (updatedDesigns: FurnitureDesign[]) => {
    localStorage.setItem('furniture-designs', JSON.stringify(updatedDesigns));
    setDesigns(updatedDesigns);
  };

  // Handle new design creation
  const handleCreateDesign = () => {
    setCurrentDesign(null);
    setIsDesignerOpen(true);
  };

  // Handle design save
  const handleSaveDesign = (design: FurnitureDesign) => {
    let updatedDesigns: FurnitureDesign[];
    
    if (designs.some(d => d.id === design.id)) {
      // Update existing design
      updatedDesigns = designs.map(d => d.id === design.id ? design : d);
      toast.success('Design actualizat cu succes!');
    } else {
      // Add new design
      updatedDesigns = [...designs, design];
      toast.success('Design nou creat cu succes!');
    }
    
    saveDesigns(updatedDesigns);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Designer Mobilier"
        description="Proiectează și vizualizează piese de mobilier personalizate"
      />
      
      <div className="mt-6">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleCreateDesign}
        >
          Creează mobilier nou
        </button>
        
        <FurnitureDesigner 
          isOpen={isDesignerOpen}
          onClose={() => setIsDesignerOpen(false)}
          design={currentDesign}
          onSave={handleSaveDesign}
        />
      </div>
    </AppLayout>
  );
};

export default Designer;
