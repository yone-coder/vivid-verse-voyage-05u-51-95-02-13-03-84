
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
   <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Receiver Details</h2>
          <p className="text-gray-600">Please provide the recipient's information</p>
        </div>

        <div className="space-y-4">
          {/* Personal Information Card */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2 pb-2 border-b border-blue-100">Personal Information</h3>

            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-base font-medium text-gray-700">
                What's their full name?
              </Label>
              <div className="grid grid-cols-2 gap-3">
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

            {/* Regular phone number field - hide for MonCash/NatCash */}
            {!isMonCashOrNatCash && (
              <PhoneInput
                id="phoneNumber"
                label="What's their phone number?"
                placeholder="Enter phone number"
                value={receiverDetails.phoneNumber || ''}
                onChange={(value) => handleInputChange('phoneNumber', value)}
                helperText="Enter a valid Haiti mobile number"
                isRequired={true}
                showValidation={true}
              />
            )}

            {/* MonCash/NatCash Phone Number Field */}
            {isMonCashOrNatCash && (
              <div className="space-y-4">
                <PhoneInput
                  id="moncashPhoneNumber"
                  label={`What's their ${paymentMethod} phone number?`}
                  placeholder={`Enter ${paymentMethod} phone number`}
                  value={receiverDetails.moncashPhoneNumber || ''}
                  onChange={(value) => handleInputChange('moncashPhoneNumber', value)}
                  helperText={`Enter the phone number linked to their ${paymentMethod} account`}
                  isRequired={true}
                  showValidation={true}
                />

                {/* Notice about account eligibility */}
                <div className="flex items-start space-x-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
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
        </div>
      </div>
    </div>
  );
};

export default StepTwoTransfer;
