
import React from 'react';
import { Armchair, BookOpen, Table, Bed, Sofa, ChefHat, Inbox, Home, Container, LayoutGrid } from 'lucide-react';

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
        return <Inbox size={size} />; // Using Inbox as a replacement for Cabinet
      case 'masa':
        return <Table size={size} />;
      case 'pat':
        return <Bed size={size} />;
      case 'bucatarie':
        return <ChefHat size={size} />;
      case 'corp': // For generic furniture components
        return <Home size={size} />;
      case 'corp_colt':
        return <LayoutGrid size={size} />;
      case 'corp_suspendat':
        return <Container size={size} />;
      case 'corp_sertar':
        return <Inbox size={size} />;
      default:
        return <Home size={size} />;
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
