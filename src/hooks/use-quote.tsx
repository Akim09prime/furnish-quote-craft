
import { useState, useEffect, useCallback } from 'react';
import {
  Quote,
  loadQuote,
  saveQuote,
  updateQuoteItem,
  removeQuoteItem,
  setLaborPercentage,
  updateQuoteMetadata,
  addManualPalItem,
  addFurnitureDesignToQuote,
  addFurnitureSetToQuote,
} from "@/lib/db";
import { FurnitureDesign } from '@/components/FurnitureSetManager';
import { toast } from 'sonner';

export function useQuote() {
  const [quote, setQuote] = useState<Quote>(() => loadQuote());

  // Persist quote to storage whenever it changes
  useEffect(() => {
    console.log("Saving quote:", quote);
    saveQuote(quote);
  }, [quote]);

  // Handler for updating quote items
  const handleUpdateQuoteItem = useCallback((itemId: string, updates: any) => {
    setQuote(prevQuote => {
      const updatedQuote = updateQuoteItem(prevQuote, itemId, updates);
      console.log("Updated quote item:", itemId, updates, updatedQuote);
      return updatedQuote;
    });
  }, []);

  // Handler for removing items
  const handleRemoveItem = useCallback((itemId: string) => {
    setQuote(prevQuote => {
      const updatedQuote = removeQuoteItem(prevQuote, itemId);
      console.log("Removed quote item:", itemId, updatedQuote);
      return updatedQuote;
    });
  }, []);

  // Handler for updating labor percentage
  const handleUpdateLabor = useCallback((percentage: number) => {
    setQuote(prevQuote => {
      const updatedQuote = setLaborPercentage(prevQuote, percentage);
      console.log("Updated labor:", percentage, updatedQuote);
      return updatedQuote;
    });
  }, []);

  // Handler for updating quantity
  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    setQuote(prevQuote => {
      const item = prevQuote.items.find(i => i.id === itemId);
      if (!item) return prevQuote;

      const updatedQuote = updateQuoteItem(prevQuote, itemId, { 
        quantity, 
        total: item.pricePerUnit * quantity 
      });
      console.log("Updated quantity:", itemId, quantity, updatedQuote);
      return updatedQuote;
    });
  }, []);

  // Handler for updating metadata
  const handleUpdateQuoteMetadata = useCallback((metadata: { beneficiary: string; title: string }) => {
    setQuote(prevQuote => {
      const updatedQuote = updateQuoteMetadata(prevQuote, metadata);
      console.log("Updated metadata:", metadata, updatedQuote);
      return updatedQuote;
    });
  }, []);

  // Handler for adding manual items
  const handleAddManualItem = useCallback((description: string, quantity: number, pricePerUnit: number) => {
    setQuote(prevQuote => {
      const updatedQuote = addManualPalItem(prevQuote, description, quantity, pricePerUnit);
      console.log("Added manual item:", description, quantity, pricePerUnit, updatedQuote);
      toast.success(`Produs adăugat: ${description}`);
      return updatedQuote;
    });
  }, []);

  // Handler for importing furniture designs
  const handleImportFurnitureDesign = useCallback((design: FurnitureDesign, cost: number) => {
    console.log('Adding furniture design to quote:', design, cost);
    setQuote(prevQuote => {
      const updatedQuote = addFurnitureDesignToQuote(prevQuote, design, cost);
      console.log("Added furniture design:", design, cost, updatedQuote);
      toast.success(`Design mobilier adăugat: ${design.name}`);
      return updatedQuote;
    });
  }, []);

  // Handler for importing furniture sets
  const handleImportFurnitureSet = useCallback((setName: string, designs: FurnitureDesign[], costs: Map<string, number>) => {
    console.log('Adding furniture set to quote:', setName, designs);
    setQuote(prevQuote => {
      const updatedQuote = addFurnitureSetToQuote(prevQuote, setName, designs, costs);
      console.log("Added furniture set:", setName, designs, costs, updatedQuote);
      toast.success(`Set de mobilier adăugat: ${setName}`);
      return updatedQuote;
    });
  }, []);

  // Handler for adding item to quote
  const handleAddItemToQuote = useCallback((categoryName: string, subcategoryName: string, productId: string, quantity: number, productDetails: any) => {
    setQuote(prevQuote => {
      const newItem = {
        id: Date.now().toString(),
        categoryName,
        subcategoryName,
        productId,
        quantity,
        pricePerUnit: productDetails.pret,
        productDetails,
        total: productDetails.pret * quantity,
      };

      const updatedQuote = {
        ...prevQuote,
        items: [...prevQuote.items, newItem],
      };
      console.log("Added item to quote:", newItem, updatedQuote);
      toast.success(`Produs adăugat: ${productDetails.cod || productDetails.name}`);
      return updatedQuote;
    });
  }, []);

  return {
    quote,
    setQuote,
    handleUpdateQuoteItem,
    handleRemoveItem,
    handleUpdateLabor,
    handleUpdateQuantity,
    handleUpdateQuoteMetadata,
    handleAddManualItem,
    handleImportFurnitureDesign,
    handleImportFurnitureSet,
    handleAddItemToQuote,
  };
}
