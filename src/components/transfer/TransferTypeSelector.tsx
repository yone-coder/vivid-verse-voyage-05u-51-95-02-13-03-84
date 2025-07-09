
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TransferTypeSelectorProps {
  transferType: 'international' | 'national';
  onTransferTypeChange: (value: 'international' | 'national') => void;
  disableNavigation?: boolean;
}

const TransferTypeSelector: React.FC<TransferTypeSelectorProps> = ({ 
  transferType, 
  onTransferTypeChange,
  disableNavigation = false 
}) => {
  const navigate = useNavigate();

  const handleValueChange = (value: string) => {
    const newTransferType = value as 'international' | 'national';
    onTransferTypeChange(newTransferType);
    
    if (!disableNavigation) {
      // Unify navigation to a single multi-step page, passing type in state.
      navigate('/transfer', { 
        state: { transferType: newTransferType } 
      });
    }
  };

  return (
    <Tabs value={transferType} onValueChange={handleValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="international">International</TabsTrigger>
        <TabsTrigger value="national">National</TabsTrigger>
      </TabsList>
      <TabsContent value="international">
        <p className="text-xs text-gray-600 text-center pt-2">
          Send money internationally to Haiti from anywhere in the world.
        </p>
      </TabsContent>
      <TabsContent value="national">
        <p className="text-xs text-gray-600 text-center pt-2">
          Transfer money locally within Haiti.
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default TransferTypeSelector;
