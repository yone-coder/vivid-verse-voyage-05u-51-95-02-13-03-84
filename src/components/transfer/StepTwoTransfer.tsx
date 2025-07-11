
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
   <div className="">
  <div className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Receiver Details</h2>
      <p className="text-gray-500 text-sm">Please provide the recipient's information</p>
    </div>

    {/* Form Section */}
    <div className="space-y-6">
      <div>
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h3>

        {/* Full Name Fields */}
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            What's their full name?
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
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

        {/* Regular Phone Number Field */}
        {!isMonCashOrNatCash && (
          <div className="mt-5 space-y-1">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              What's their phone number?
            </Label>
            <div className="flex mt-1">
              <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-gray-600 text-sm">
                +509
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
          <div className="mt-5 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="moncashPhoneNumber" className="text-sm font-medium text-gray-700">
                What's their {paymentMethod} phone number?
              </Label>
              <div className="flex mt-1">
                <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-gray-600 text-sm">
                  +509
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
            </div>

            {/* Important Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Important Notice</p>
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