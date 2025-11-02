import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OperatingHours } from '../components/OperatingHours';
import { ContactActions } from '../components/ContactActions';
import { MedicineDetailsModal } from '../components/MedicineDetailsModal';
import { apiClient } from '../services/api';
import type { Pharmacy } from '../types';
import { useLoading } from '../hooks/useLoading';

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
  const { startLoading, stopLoading } = useLoading({ delay: 1000 });
  
  const pharmacyName = routePharmacyName || propPharmacyName || '';
  const onBack = propOnBack || (() => navigate(-1));
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch pharmacy data
  useEffect(() => {
    const fetchPharmacy = async () => {
      if (!pharmacyName) return;
      
      startLoading('Loading pharmacy details...');
      setLoading(true);
      setError(false);

      try {
        const response = await apiClient.getPharmacyByName(pharmacyName);
        if (response.ok && response.data) {
          const pharmacyData = response.data;
          const transformedPharmacy: Pharmacy = {
            id: pharmacyData._id || pharmacyData.id,
            name: pharmacyData.name,
            address: pharmacyData.address,
            latitude: pharmacyData.latitude,
            longitude: pharmacyData.longitude,
            phone: pharmacyData.phone,
            email: pharmacyData.email,
            isVerified: pharmacyData.isVerified || false,
            openHours: pharmacyData.openHours || {},
          };
          setPharmacy(transformedPharmacy);

          // Fetch medicines for this pharmacy
          const medicinesResponse = await apiClient.getMedicines(transformedPharmacy.id);
          if (medicinesResponse.ok && medicinesResponse.data) {
            const inventoryData = medicinesResponse.data.map((med: any) => ({
              medicine: med.name,
              status: (med.quantity || 0) > 10 ? 'in_stock' : (med.quantity || 0) > 0 ? 'low_stock' : 'out_of_stock',
              lastUpdated: med.updatedAt || med.createdAt || new Date().toISOString(),
              quantity: med.quantity || 0,
            }));
            setInventory(inventoryData);
          }
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching pharmacy:', error);
        setError(true);
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    fetchPharmacy();
  }, [pharmacyName, startLoading, stopLoading]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">Loading pharmacy details...</div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        <div className="max-w-6xl mx-auto p-lg relative z-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            className="text-white mb-lg"
          >
            Back
          </Button>
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-md">Pharmacy Not Found</h2>
            <p className="text-neutral-600 mb-lg">
              The pharmacy "{pharmacyName}" could not be found.
            </p>
            <Button variant="primary" onClick={onBack}>
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {backgroundElements}
      
      {/* Enhanced Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-lg py-lg">
          <div className="flex items-center gap-lg">
            <button
              onClick={onBack}
              className="group flex items-center justify-center w-11 h-11 bg-white/15 hover:bg-white/25 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-sm flex-shrink-0 hover:scale-105 hover:shadow-xl hover:shadow-white/25 hover:border-white/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft 
                size={20} 
                strokeWidth={2.5} 
                className="transition-transform duration-300 group-hover:-translate-x-0.5" 
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-md flex-wrap">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
                  {pharmacy.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm mb-xs">
                    <h1 className="text-2xl md:text-3xl font-bold text-white truncate drop-shadow-sm">
                      {pharmacy.name}
                    </h1>
                    {pharmacy.isVerified && (
                      <div className="flex items-center gap-xs bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-400/30 flex-shrink-0">
                        <CheckCircle size={18} className="text-emerald-300" fill="currentColor" />
                        <span className="text-xs font-semibold text-emerald-100">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-white/80 font-medium truncate">
                    <MapPin size={14} className="inline mr-1" />
                    {pharmacy.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-lg relative z-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
          <Card padding="lg" className="bg-white/95 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-sm mb-lg pb-lg border-b border-neutral-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Contact Information</h2>
            </div>
            <div className="space-y-md">
              {pharmacy.phone && (
                <div className="flex items-start gap-md p-md rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-1">Phone</div>
                    <a 
                      href={`tel:${pharmacy.phone}`}
                      className="text-base font-semibold text-neutral-900 hover:text-primary transition-colors"
                    >
                      {pharmacy.phone}
                    </a>
                  </div>
                </div>
              )}
              {pharmacy.email && (
                <div className="flex items-start gap-md p-md rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-1">Email</div>
                    <a 
                      href={`mailto:${pharmacy.email}`}
                      className="text-base font-semibold text-neutral-900 hover:text-primary transition-colors break-all"
                    >
                      {pharmacy.email}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-md p-md rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-1">Address</div>
                  <p className="text-base font-semibold text-neutral-900">
                    {pharmacy.address}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Actions */}
            <div className="mt-xl pt-lg border-t border-neutral-200">
              <ContactActions
                phone={pharmacy.phone}
                email={pharmacy.email}
                address={pharmacy.address}
                pharmacyName={pharmacy.name}
                size="md"
                layout="horizontal"
                showLabels={true}
              />
            </div>
          </Card>

          <Card padding="lg" className="bg-white/95 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-sm mb-lg pb-lg border-b border-neutral-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Opening Hours</h2>
            </div>
            {pharmacy.openHours && Object.keys(pharmacy.openHours).length > 0 ? (
              <OperatingHours 
                hours={pharmacy.openHours} 
                showStatus={true}
                compact={false}
              />
            ) : (
              <div className="text-center py-xl">
                <Clock size={48} className="text-neutral-300 mx-auto mb-md" />
                <p className="text-neutral-600 font-medium">Opening hours not available</p>
              </div>
            )}
          </Card>
        </div>

        <Card padding="lg" className="bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-sm mb-lg pb-lg border-b border-neutral-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">📦</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Current Inventory</h2>
            {inventory.length > 0 && (
              <div className="ml-auto">
                <Badge variant="info">
                  {inventory.length} {inventory.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
            )}
          </div>
          {inventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-200 bg-neutral-50">
                    <th className="text-left p-md text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Medicine
                    </th>
                    <th className="text-center p-md text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Quantity
                    </th>
                    <th className="text-center p-md text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right p-md text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedMedicine(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="p-md">
                        <div className="text-base font-semibold text-neutral-900">
                          {item.medicine}
                        </div>
                      </td>
                      <td className="p-md text-center">
                        <span className="text-base font-bold text-neutral-700">
                          {item.quantity || 0}
                        </span>
                      </td>
                      <td className="p-md text-center">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="p-md text-sm text-neutral-600 text-right font-medium">
                        {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-2xl">
              <div className="text-6xl mb-md opacity-50">📦</div>
              <p className="text-neutral-600 font-medium text-lg">No inventory data available</p>
              <p className="text-neutral-500 text-sm mt-sm">Check back later for updated inventory</p>
            </div>
          )}
        </Card>

        {/* Map */}
        <Card padding="lg" className="mt-lg bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-sm mb-lg pb-lg border-b border-neutral-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Location</h2>
          </div>
          <div className="h-[400px] rounded-xl overflow-hidden relative bg-gradient-to-br from-background-secondary to-neutral-200 shadow-lg border border-neutral-200">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBW-fSpIT-yWFeYfOF0VIBlBHuEr12o4Cs&q=${encodeURIComponent(pharmacy.address)}`}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${pharmacy.name}`}
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
