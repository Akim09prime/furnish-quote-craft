
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import FurnitureDesigner from '@/components/FurnitureDesigner';
import PageHeader from '@/lib/components/common/PageHeader';

const Designer = () => {
  return (
    <AppLayout>
      <PageHeader
        title="Designer Mobilier"
        description="Proiectează și vizualizează piese de mobilier personalizate"
      />
      
      <div className="mt-6">
        <FurnitureDesigner />
      </div>
    </AppLayout>
  );
};

export default Designer;
