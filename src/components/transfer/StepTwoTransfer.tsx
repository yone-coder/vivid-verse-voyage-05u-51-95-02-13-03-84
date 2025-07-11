import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, User, Phone, MapPin, Mail } from 'lucide-react';

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
    const updatedDetails = {
      ...receiverDetails,
      [field]: value,
    };
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
    const updatedDetails = {
      ...receiverDetails,
      department: value,
      commune: '' // Reset commune when department changes
    };
    onDetailsChange(updatedDetails);
  };

  const handleCommuneChange = (value: string) => {
    handleInputChange('commune', value);
  };

  const isMonCashOrNatCash = transferDetails?.deliveryMethod === 'moncash' || transferDetails?.deliveryMethod === 'natcash';
  const paymentMethod = transferDetails?.deliveryMethod === 'moncash' ? 'MonCash' : 'NatCash';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Receiver Details</h2>
          <p className="text-lg text-gray-600">Please provide the recipient's information</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>

            {/* Full Name Fields */}
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                What's their full name? <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={receiverDetails.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={receiverDetails.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Number Fields */}
            {!isMonCashOrNatCash && (
              <div className="space-y-3">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  What's their phone number? <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-4 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 rounded-l-lg">
                    <span className="text-sm text-gray-700 font-medium">+509</span>
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={receiverDetails.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="h-12 rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* MonCash/NatCash Phone Number */}
            {isMonCashOrNatCash && (
              <div className="space-y-3">
                <Label htmlFor="moncashPhoneNumber" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  What's their {paymentMethod} phone number? <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-4 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 rounded-l-lg">
                    <span className="text-sm text-gray-700 font-medium">+509</span>
                  </div>
                  <Input
                    id="moncashPhoneNumber"
                    type="tel"
                    placeholder={`Enter ${paymentMethod} phone number`}
                    value={receiverDetails.moncashPhoneNumber || ''}
                    onChange={(e) => handleInputChange('moncashPhoneNumber', e.target.value)}
                    className="h-12 rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Important Notice */}
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
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

            {/* Email Field (Optional) */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email address (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={receiverDetails.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Selection */}
              <div className="space-y-3">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select value={receiverDetails.department} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {haitiDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Commune Selection */}
              <div className="space-y-3">
                <Label htmlFor="commune" className="text-sm font-medium text-gray-700">
                  Commune <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={receiverDetails.commune} 
                  onValueChange={handleCommuneChange}
                  disabled={!receiverDetails.department}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder={receiverDetails.department ? "Select commune" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {receiverDetails.department && communesByDepartment[receiverDetails.department]?.map((commune) => (
                      <SelectItem key={commune} value={commune}>
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
    </div>
  );
};

export default StepTwoTransfer;
