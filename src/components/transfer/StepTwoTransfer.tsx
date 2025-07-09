
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  commune: string;
  email?: string;
  moncashPhoneNumber?: string;
}

interface StepTwoTransferProps {
  receiverDetails: ReceiverDetails;
  onDetailsChange: (details: ReceiverDetails) => void;
  transferDetails?: {
    deliveryMethod: string;
  };
}

const StepTwoTransfer: React.FC<StepTwoTransferProps> = ({ 
  receiverDetails, 
  onDetailsChange,
  transferDetails 
}) => {
  const handleInputChange = (field: keyof ReceiverDetails, value: string) => {
    console.log(`Updating ${field} with value:`, value);
    const updatedDetails = {
      ...receiverDetails,
      [field]: value,
    };
    console.log('Updated details:', updatedDetails);
    onDetailsChange(updatedDetails);
  };

  const haitiDepartments = [
    "Artibonite",
    "Centre",
    "Grand'Anse",
    "Nippes",
    "Nord",
    "Nord-Est",
    "Nord-Ouest",
    "Ouest",
    "Sud",
    "Sud-Est"
  ];

  const communesByDepartment: Record<string, string[]> = {
    "Artibonite": ["Gonaïves", "Saint-Marc", "Dessalines", "Gros-Morne", "Ennery", "L'Estère", "Petite-Rivière-de-l'Artibonite", "Verrettes", "La Chapelle", "Marchand-Dessalines"],
    "Centre": ["Hinche", "Mirebalais", "Lascahobas", "Belladère", "Savanette", "Boucan-Carré", "Thomassique", "Cerca-la-Source", "Thomonde", "Baptiste", "Cerca-Carvajal", "Maïssade"],
    "Grand'Anse": ["Jérémie", "Abricots", "Anse-d'Hainault", "Corail", "Dame-Marie", "Les Irois", "Marfranc", "Moron", "Pestel", "Roseaux", "Beaumont", "Chambellan"],
    "Nippes": ["Miragoâne", "Anse-à-Veau", "Arnaud", "Asile", "Barradères", "Fond-des-Nègres", "Grand-Boucan", "Petit-Trou-de-Nippes", "Plaisance-du-Sud", "L'Azile", "Baradères"],
    "Nord": ["Cap-Haïtien", "Fort-Dauphin", "Grande-Rivière-du-Nord", "Quartier-Morin", "Limonade", "Plaine-du-Nord", "Dondon", "Saint-Raphaël", "Bahon", "Borgne", "Capotille", "La Victoire", "Limbe", "Milot", "Ouanaminthe", "Pignon", "Pilate", "Port-Margot", "Ranquitte", "Terrier-Rouge"],
    "Nord-Est": ["Fort-Liberté", "Ouanaminthe", "Trou-du-Nord", "Terrier-Rouge", "Capotille", "Mont-Organisé", "Sainte-Suzanne", "Caracol", "Ferrier", "Mombin-Crochu", "Vallières"],
    "Nord-Ouest": ["Port-de-Paix", "Bassin-Bleu", "Bombardopolis", "Chansolme", "Jean-Rabel", "Môle-Saint-Nicolas", "Saint-Louis-du-Nord", "Anse-à-Foleur", "La Tortue"],
    "Ouest": ["Port-au-Prince", "Delmas", "Pétionville", "Carrefour", "Cité Soleil", "Tabarre", "Croix-des-Bouquets", "Kenscoff", "Gressier", "Léogâne", "Grand-Goâve", "Petit-Goâve", "Arcahaie", "Cabaret", "Cornillon", "Fonds-Verrettes", "Ganthier", "La Plaine", "Thomazeau", "Pointe-à-Raquette"],
    "Sud": ["Les Cayes", "Aquin", "Saint-Louis-du-Sud", "Cavaillon", "Chardonnières", "Chantal", "Côteaux", "Port-à-Piment", "Roche-à-Bateau", "Torbeck", "Arniquet", "Campin", "Maniche", "Port-Salut", "Saint-Jean-du-Sud"],
    "Sud-Est": ["Jacmel", "Marigot", "Cayes-Jacmel", "Bainet", "Côtes-de-Fer", "Grand-Gosier", "Anse-à-Pitres", "Belle-Anse", "Thiotte", "La Vallée", "Banatte", "Corail-Sourd"]
  };

  const handleDepartmentChange = (value: string) => {
    console.log('Department change handler called with:', value);
    console.log('Current receiverDetails before change:', receiverDetails);
    
    // Update department and reset commune
    const updatedDetails = {
      ...receiverDetails,
      department: value,
      commune: '' // Reset commune when department changes
    };
    
    console.log('Updated details after department change:', updatedDetails);
    onDetailsChange(updatedDetails);
  };

  const handleCommuneChange = (value: string) => {
    console.log('Commune change handler called with:', value);
    handleInputChange('commune', value);
  };

  console.log('StepTwoTransfer render - receiverDetails:', receiverDetails);

  const isMonCashOrNatCash = transferDetails?.deliveryMethod === 'moncash' || transferDetails?.deliveryMethod === 'natcash';
  const paymentMethod = transferDetails?.deliveryMethod === 'moncash' ? 'MonCash' : 'NatCash';

  return (
    <div className="p-1">
      <div className="max-w-2xl mx-auto">
        <div className="mb-3 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Receiver Details</h2>
          <p className="text-gray-600">Please provide the recipient's information</p>
        </div>
        
        <div className="space-y-2">
            {/* Personal Information Card */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-sm p-2 space-y-2">
              <h3 className="text-lg font-medium text-gray-800 mb-1 pb-1 border-b border-blue-100">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-medium text-gray-700">
                  What's their full name?
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={receiverDetails.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={receiverDetails.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Conditionally render regular phone number field - hide for MonCash/NatCash */}
              {!isMonCashOrNatCash && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-base font-medium text-gray-700">
                    What's their phone number?
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 rounded-l-lg">
                      <span className="text-sm text-gray-600 font-medium">+509</span>
                    </div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      value={receiverDetails.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* MonCash/NatCash Phone Number Field */}
              {isMonCashOrNatCash && (
                <div className="space-y-2">
                  <Label htmlFor="moncashPhoneNumber" className="text-base font-medium text-gray-700">
                    What's their {paymentMethod} phone number?
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 rounded-l-lg">
                      <span className="text-sm text-gray-600 font-medium">+509</span>
                    </div>
                    <Input
                      id="moncashPhoneNumber"
                      type="tel"
                      placeholder={`Enter ${paymentMethod} phone number`}
                      value={receiverDetails.moncashPhoneNumber || ''}
                      onChange={(e) => handleInputChange('moncashPhoneNumber', e.target.value)}
                      className="rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notice about account eligibility */}
                  <div className="flex items-start space-x-2 p-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>
                        Please ensure the {paymentMethod} phone number is eligible to receive payments and the account is upgraded. 
                        Unverified or basic accounts may not be able to receive transfers.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Information Card */}
            <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl border border-purple-100 shadow-sm p-2 space-y-2">
              <h3 className="text-lg font-medium text-gray-800 mb-1 pb-1 border-b border-purple-100">Location Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="text-base font-medium text-gray-700">
                  Which department are they in?
                </Label>
                <Select 
                  value={receiverDetails.department || ""} 
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {haitiDepartments.map((dept) => (
                      <SelectItem 
                        key={dept} 
                        value={dept}
                      >
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commune" className="text-base font-medium text-gray-700">
                  Which city or commune are they in?
                </Label>
                <Select 
                  value={receiverDetails.commune || ""} 
                  onValueChange={handleCommuneChange}
                  disabled={!receiverDetails.department}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100">
                    <SelectValue placeholder={receiverDetails.department ? "Select commune" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {receiverDetails.department && communesByDepartment[receiverDetails.department]?.map((commune) => (
                      <SelectItem 
                        key={commune} 
                        value={commune}
                      >
                        {commune}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwoTransfer;
