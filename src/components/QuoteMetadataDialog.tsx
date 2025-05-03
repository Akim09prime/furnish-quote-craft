
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface QuoteMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metadata: { beneficiary: string; title: string }) => void;
  defaultValues: { beneficiary: string; title: string };
}

const QuoteMetadataDialog: React.FC<QuoteMetadataDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultValues,
}) => {
  const [beneficiary, setBeneficiary] = React.useState(defaultValues.beneficiary);
  const [title, setTitle] = React.useState(defaultValues.title);

  React.useEffect(() => {
    if (isOpen) {
      setBeneficiary(defaultValues.beneficiary);
      setTitle(defaultValues.title);
    }
  }, [isOpen, defaultValues]);

  const handleSave = () => {
    onSave({
      beneficiary,
      title,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informații ofertă</DialogTitle>
          <DialogDescription>
            Introduceți detaliile pentru această ofertă
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titlu
            </Label>
            <Input
              id="title"
              className="col-span-3"
              placeholder="ex: Mobilier Apartament"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="beneficiary" className="text-right">
              Beneficiar
            </Label>
            <Input
              id="beneficiary"
              className="col-span-3"
              placeholder="Numele clientului"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={handleSave}>
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteMetadataDialog;
