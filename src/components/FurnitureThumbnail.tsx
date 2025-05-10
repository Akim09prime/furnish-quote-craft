
import React from 'react';
import { Armchair, BookOpen, Table, Bed } from 'lucide-react';

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
    switch (type) {
      case 'canapea':
        return <Armchair size={size} />;
      case 'scaun':
        return <Armchair size={size} style={{ transform: 'rotate(45deg)' }} />;
      case 'biblioteca':
        return <BookOpen size={size} />;
      case 'dulap':
        return <BookOpen size={size} style={{ transform: 'rotate(90deg)' }} />;
      case 'masa':
        return <Table size={size} />;
      case 'pat':
        return <Bed size={size} />;
      default:
        return <Armchair size={size} />;
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
