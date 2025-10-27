import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OperatingHours } from '../components/OperatingHours';
import { ContactActions } from '../components/ContactActions';
import { MedicineDetailsModal } from '../components/MedicineDetailsModal';

interface PharmacyProfilePageProps {
  pharmacyName?: string;
  onBack?: () => void;
}

export const PharmacyProfilePage: React.FC<PharmacyProfilePageProps> = ({
  pharmacyName: propPharmacyName,
  onBack: propOnBack,
}) => {
  const { pharmacyName: routePharmacyName } = useParams<{ pharmacyName: string }>();
  const navigate = useNavigate();
  
  const pharmacyName = routePharmacyName || propPharmacyName || '';
  const onBack = propOnBack || (() => navigate(-1));
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mockPharmacy = {
    id: '1', // Default ID since we're using name-based routing
    name: pharmacyName || 'HealthPlus Pharmacy',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'contact@healthplus.com',
    isVerified: true,
    openHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
  };

  const mockInventory = [
    { medicine: 'Paracetamol 500mg', status: 'in_stock', lastUpdated: '2 hours ago' },
    { medicine: 'Ibuprofen 400mg', status: 'in_stock', lastUpdated: '3 hours ago' },
    { medicine: 'Amoxicillin 250mg', status: 'low_stock', lastUpdated: '1 day ago' },
    { medicine: 'Aspirin 75mg', status: 'out_of_stock', lastUpdated: '2 days ago' },
  ];

  // Add animated background elements
  const backgroundElements = (
    <>
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] animate-[float_20s_ease-in-out_infinite] z-1" />
      <div className="absolute top-[20%] -right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-white/10 to-white/5 rounded-full animate-[pulse_4s_ease-in-out_infinite] z-1" />
      <div className="absolute -bottom-[20%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-white/8 to-white/3 rounded-full animate-[float_15s_ease-in-out_infinite] z-1" />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </>
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error'> = {
      in_stock: 'success',
      low_stock: 'warning',
      out_of_stock: 'error',
    };

    const labels: Record<string, string> = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {backgroundElements}
      <div className="bg-transparent text-text-inverse p-xl relative z-2">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            className="text-white mb-lg"
          >
            Back
          </Button>

          <div className="w-32 h-32 rounded-xl bg-white flex items-center justify-center text-5xl font-bold text-primary shadow-xl mx-auto mb-lg">H+</div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-sm mb-md">
              <h1 className="text-4xl font-extrabold text-shadow-lg bg-gradient-to-br from-white to-blue-50 bg-clip-text text-transparent">
                {mockPharmacy.name}
              </h1>
              {mockPharmacy.isVerified && (
                <CheckCircle size={32} fill="white" color="#667eea" />
              )}
            </div>
            <p className="text-lg opacity-95 mb-md font-normal text-shadow-md">
              {mockPharmacy.address}
            </p>
            <Badge variant="success" size="md">Open Now</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-lg relative z-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-neutral-900 mb-lg">Contact Information</h2>
            <div>
              <div className="flex items-center gap-md py-md border-b border-neutral-100">
                <Phone size={20} color="#667eea" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-600 font-medium">Phone</div>
                  <div className="text-base font-semibold text-neutral-900">
                    {mockPharmacy.phone}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-md py-md border-b border-neutral-100">
                <Mail size={20} color="#667eea" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-600 font-medium">Email</div>
                  <div className="text-base font-semibold text-neutral-900">
                    {mockPharmacy.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-md py-md border-b border-neutral-100">
                <MapPin size={20} color="#667eea" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-600 font-medium">Address</div>
                  <div className="text-base font-semibold text-neutral-900">
                    {mockPharmacy.address}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Actions */}
            <div className="mt-lg">
              <ContactActions
                phone={mockPharmacy.phone}
                email={mockPharmacy.email}
                address={mockPharmacy.address}
                pharmacyName={mockPharmacy.name}
                size="md"
                layout="horizontal"
                showLabels={true}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-2xl font-bold text-neutral-900 mb-lg">Opening Hours</h2>
            <OperatingHours 
              hours={mockPharmacy.openHours} 
              showStatus={true}
              compact={false}
            />
          </Card>
        </div>

        <Card padding="lg">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="text-2xl font-bold text-neutral-900">Current Inventory</h2>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="text-left p-md text-sm font-semibold text-neutral-700">
                  Medicine
                </th>
                <th className="text-center p-md text-sm font-semibold text-neutral-700">
                  Status
                </th>
                <th className="text-right p-md text-sm font-semibold text-neutral-700">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map((item, index) => (
                <tr key={index} className="border-b border-neutral-100">
                  <td className="p-md text-base text-neutral-900 font-semibold">
                    {item.medicine}
                  </td>
                  <td className="p-md text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-md text-sm text-neutral-600 text-right font-medium">
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Map */}
        <Card className="mt-lg">
          <div className="h-[500px] rounded-lg overflow-hidden relative bg-gradient-to-br from-background-secondary to-neutral-200">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBW-fSpIT-yWFeYfOF0VIBlBHuEr12o4Cs&q=${encodeURIComponent(mockPharmacy.address)}`}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${mockPharmacy.name}`}
            />
          </div>
        </Card>
      </div>
      
      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMedicine(null);
          }}
        />
      )}
    </div>
  );
};
