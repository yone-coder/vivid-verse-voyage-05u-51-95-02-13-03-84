
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PhoneInput from '@/components/ui/phone-input';
import { Separator } from '@/components/ui/separator';

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  commune: string;
  email: string;
  moncashPhoneNumber: string;
}

interface TransferDetails {
  receivingCountry: string;
  deliveryMethod: string;
}

interface StepTwoTransferProps {
  receiverDetails: ReceiverDetails;
  transferDetails: TransferDetails;
  onReceiverDetailsChange: (details: ReceiverDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const HAITI_DEPARTMENTS = [
  'Artibonite',
  'Centre',
  'Grand\'Anse',
  'Nippes',
  'Nord',
  'Nord-Est',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Est'
];

const COMMUNES_BY_DEPARTMENT: Record<string, string[]> = {
  'Artibonite': ['Gonaïves', 'Saint-Marc', 'Dessalines', 'Gros-Morne', 'Ennery'],
  'Centre': ['Hinche', 'Mirebalais', 'Lascahobas', 'Belladère', 'Boucan-Carré'],
  'Grand\'Anse': ['Jérémie', 'Dame-Marie', 'Anse-d\'Hainault', 'Corail', 'Pestel'],
  'Nippes': ['Miragoâne', 'Anse-à-Veau', 'Petit-Goâve', 'Baradères', 'Plaisance-du-Sud'],
  'Nord': ['Cap-Haïtien', 'Fort-Dauphin', 'Grande-Rivière-du-Nord', 'Quartier-Morin', 'Limonade'],
  'Nord-Est': ['Fort-Liberté', 'Ouanaminthe', 'Trou-du-Nord', 'Terrier-Rouge', 'Sainte-Suzanne'],
  'Nord-Ouest': ['Port-de-Paix', 'Saint-Louis-du-Nord', 'Jean-Rabel', 'Môle-Saint-Nicolas', 'Bombardopolis'],
  'Ouest': ['Port-au-Prince', 'Delmas', 'Pétion-Ville', 'Carrefour', 'Croix-des-Bouquets'],
  'Sud': ['Les Cayes', 'Aquin', 'Saint-Louis-du-Sud', 'Cavaillon', 'Port-Salut'],
  'Sud-Est': ['Jacmel', 'Marigot', 'Cayes-Jacmel', 'Bainet', 'Côtes-de-Fer']
};

const StepTwoTransfer: React.FC<StepTwoTransferProps> = ({
  receiverDetails,
  transferDetails,
  onReceiverDetailsChange,
  onNext,
  onBack
}) => {
  console.log('StepTwoTransfer render - receiverDetails:', receiverDetails);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ReceiverDetails, value: string) => {
    const updatedDetails = { ...receiverDetails, [field]: value };
    onReceiverDetailsChange(updatedDetails);
    
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleDepartmentChange = (department: string) => {
    const updatedDetails = { 
      ...receiverDetails, 
      department,
      commune: '' // Reset commune when department changes
    };
    onReceiverDetailsChange(updatedDetails);
    
    if (errors.department) {
      const newErrors = { ...errors };
      delete newErrors.department;
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!receiverDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!receiverDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!receiverDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!receiverDetails.department) {
      newErrors.department = 'Department is required';
    }

    if (!receiverDetails.commune) {
      newErrors.commune = 'Commune is required';
    }

    // MonCash phone validation for cash pickup
    if (transferDetails.deliveryMethod === 'cash-pickup' && !receiverDetails.moncashPhoneNumber.trim()) {
      newErrors.moncashPhoneNumber = 'MonCash phone number is required for cash pickup';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const availableCommunes = receiverDetails.department ? COMMUNES_BY_DEPARTMENT[receiverDetails.department] || [] : [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Receiver Information
        </h2>
        <p className="text-gray-600">
          Enter the details of the person receiving the money
        </p>
      </div>

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={receiverDetails.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={receiverDetails.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <PhoneInput
            value={receiverDetails.phoneNumber}
            onChange={(value) => handleInputChange('phoneNumber', value || '')}
            defaultCountry="HT"
            placeholder="Enter phone number"
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select value={receiverDetails.department} onValueChange={handleDepartmentChange}>
              <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {HAITI_DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          <div>
            <Label htmlFor="commune">Commune *</Label>
            <Select 
              value={receiverDetails.commune} 
              onValueChange={(value) => handleInputChange('commune', value)}
              disabled={!receiverDetails.department}
            >
              <SelectTrigger className={errors.commune ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select commune" />
              </SelectTrigger>
              <SelectContent>
                {availableCommunes.map((commune) => (
                  <SelectItem key={commune} value={commune}>
                    {commune}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.commune && (
              <p className="text-red-500 text-sm mt-1">{errors.commune}</p>
            )}
          </div>
        </div>

        {/* Email (Optional) */}
        <div>
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={receiverDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        {/* MonCash Phone for Cash Pickup */}
        {transferDetails.deliveryMethod === 'cash-pickup' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="moncashPhone">MonCash Phone Number *</Label>
              <PhoneInput
                value={receiverDetails.moncashPhoneNumber}
                onChange={(value) => handleInputChange('moncashPhoneNumber', value || '')}
                defaultCountry="HT"
                placeholder="Enter MonCash phone number"
                className={errors.moncashPhoneNumber ? 'border-red-500' : ''}
              />
              {errors.moncashPhoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.moncashPhoneNumber}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                The receiver will receive the money directly in their MonCash account
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 bg-red-500 hover:bg-red-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepTwoTransfer;
