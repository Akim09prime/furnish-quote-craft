
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface SaveButtonProps {
  onClick: () => void;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "amber" | "purple" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  label = "Salvează", 
  variant = "default", 
  size = "default",
  className = "",
  disabled = false
}) => {
  const handleSave = () => {
    onClick();
    toast.success(`Datele au fost salvate cu succes`, {
      description: "Modificările au fost aplicate cu succes."
    });
  };
  
  return (
    <Button 
      onClick={handleSave} 
      variant={variant} 
      size={size} 
      className={`transition-all duration-200 hover-scale ${className}`}
      disabled={disabled}
    >
      <Save className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export default SaveButton;
