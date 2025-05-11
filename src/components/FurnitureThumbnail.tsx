
import React from 'react';
import { Armchair, BookOpen, Table, Bed, Sofa, ChefHat } from 'lucide-react';

interface FurnitureThumbnailProps {
  type: string;
  color: string;
  size?: number;
}

const FurnitureThumbnail: React.FC<FurnitureThumbnailProps> = ({ 
  type, 
  color, 
  size = 24 
}) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'canapea':
        return <Sofa size={size} />;
      case 'scaun':
        return <Armchair size={size} />;
      case 'biblioteca':
        return <BookOpen size={size} />;
      case 'dulap':
        // Using BookOpen as a replacement for Cabinet since Cabinet is not available
        return <BookOpen size={size} />;
      case 'masa':
        return <Table size={size} />;
      case 'pat':
        return <Bed size={size} />;
      case 'bucatarie':
        return <ChefHat size={size} />;
      default:
        return <BookOpen size={size} />;
    }
  };

  return (
    <div 
      className="flex items-center justify-center rounded-md overflow-hidden" 
      style={{ backgroundColor: color }}
    >
      <div className="text-white">
        {getIcon()}
      </div>
    </div>
  );
};

export default FurnitureThumbnail;
