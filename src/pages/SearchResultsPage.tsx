import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, CheckCircle, Plus, MessageCircle, Mail } from 'lucide-react';
import { Card } from '../components/Card';
import { useLoading } from '../hooks/useLoading';
import { NoResultsEmptyState, NetworkErrorEmptyState } from '../components/EmptyState';
import { SortDropdown, pharmacySortOptions, type SortOption } from '../components/SortDropdown';
import { BottomNavigation, createMainNavigation } from '../components/BottomNavigation';
import { FloatingActionButton, createReportActions } from '../components/FloatingActionButton';
import type { Pharmacy } from '../types';

interface SearchResultsPageProps {
  searchQuery: string;
  onPharmacyClick: (pharmacyName: string) => void;
  onBack?: () => void;
}


export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchQuery,
  onPharmacyClick,
  onBack,
}) => {
  const { startLoading, stopLoading } = useLoading({ delay: 1000 });
  const [hasError, setHasError] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  // Simulate loading on component mount
  useEffect(() => {
    startLoading('Searching for pharmacies...');
    const timer = setTimeout(() => {
      stopLoading();
    }, 2000);
    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowBottomNav(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mockPharmacies: Pharmacy[] = [
    {
      id: '1',
      name: 'CVS Pharmacy',
      address: 'Times Square, 42nd Street, New York, NY',
      latitude: 40.7580,
      longitude: -73.9855,
      phone: '+1 (212) 555-0123',
      email: 'contact@cvspharmacy.com',
      isVerified: true,
      openHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '10:00', close: '20:00' }
      }
    },
    {
      id: '2',
      name: 'Walgreens',
      address: '5th Avenue, Manhattan, New York, NY',
      latitude: 40.7505,
      longitude: -73.9934,
      phone: '+1 (212) 555-0456',
      email: 'info@walgreens.com',
      isVerified: true,
      openHours: {
        monday: { open: '07:00', close: '23:00' },
        tuesday: { open: '07:00', close: '23:00' },
        wednesday: { open: '07:00', close: '23:00' },
        thursday: { open: '07:00', close: '23:00' },
        friday: { open: '07:00', close: '23:00' },
        saturday: { open: '08:00', close: '22:00' },
        sunday: { open: '09:00', close: '21:00' }
      }
    },
    {
      id: '3',
      name: 'Rite Aid',
      address: 'Broadway, Upper West Side, New York, NY',
      latitude: 40.7831,
      longitude: -73.9712,
      phone: '+1 (212) 555-0789',
      email: 'support@riteaid.com',
      isVerified: true,
      openHours: {
        monday: { open: '08:30', close: '21:30' },
        tuesday: { open: '08:30', close: '21:30' },
        wednesday: { open: '08:30', close: '21:30' },
        thursday: { open: '08:30', close: '21:30' },
        friday: { open: '08:30', close: '21:30' },
        saturday: { open: '09:00', close: '20:00' },
        sunday: { open: '10:00', close: '19:00' }
      }
    },
    {
      id: '4',
      name: 'Duane Reade',
      address: 'Madison Avenue, Midtown, New York, NY',
      latitude: 40.7614,
      longitude: -73.9776,
      phone: '+1 (212) 555-0321',
      email: 'info@duanereade.com',
      isVerified: true,
      openHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '10:00', close: '20:00' }
      }
    },
    {
      id: '5',
      name: 'Apollo Pharmacy',
      address: 'Lexington Avenue, Upper East Side, New York, NY',
      latitude: 40.7736,
      longitude: -73.9566,
      phone: '+1 (212) 555-0654',
      email: 'contact@apollopharmacy.com',
      isVerified: false,
      openHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { open: '09:00', close: '16:00', closed: true }
      }
    },
    {
      id: '6',
      name: 'MedPlus Pharmacy',
      address: 'Park Avenue, Midtown East, New York, NY',
      latitude: 40.7505,
      longitude: -73.9934,
      phone: '+1 (212) 555-0987',
      email: 'support@medplus.com',
      isVerified: true,
      openHours: {
        monday: { open: '07:30', close: '22:30' },
        tuesday: { open: '07:30', close: '22:30' },
        wednesday: { open: '07:30', close: '22:30' },
        thursday: { open: '07:30', close: '22:30' },
        friday: { open: '07:30', close: '22:30' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '09:00', close: '20:00' }
      }
    },
    {
      id: '7',
      name: 'Health Plus',
      address: 'Brooklyn Bridge, Brooklyn, NY',
      latitude: 40.7061,
      longitude: -73.9969,
      phone: '+1 (718) 555-0123',
      email: 'info@healthplus.com',
      isVerified: false,
      openHours: {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '20:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '16:00', closed: true }
      }
    },
    {
      id: '8',
      name: 'Quick Meds',
      address: 'Queens Boulevard, Queens, NY',
      latitude: 40.7282,
      longitude: -73.7949,
      phone: '+1 (718) 555-0456',
      isVerified: true,
      openHours: {
        monday: { open: '06:00', close: '24:00' },
        tuesday: { open: '06:00', close: '24:00' },
        wednesday: { open: '06:00', close: '24:00' },
        thursday: { open: '06:00', close: '24:00' },
        friday: { open: '06:00', close: '24:00' },
        saturday: { open: '06:00', close: '24:00' },
        sunday: { open: '06:00', close: '24:00' }
      }
    },
  ];

  // Filter pharmacies based on distance only
  const filteredPharmacies = mockPharmacies.filter(() => {
    return true;
  });

  // Sort pharmacies based on selected sort option
  const sortedPharmacies = [...filteredPharmacies].sort((a, b) => {
    if (!sortOption) return 0;

    let aValue: any, bValue: any;

    switch (sortOption.value) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOption.direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });


  const handleRetry = () => {
    setHasError(false);
    startLoading('Retrying search...');
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  const handleClearSearch = () => {
    // This would typically navigate back to home or clear the search
    console.log('Clearing search');
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

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

  // Mobile navigation items
  const navigationItems = createMainNavigation(
    () => setActiveTab('home'),
    () => setActiveTab('search'),
    () => setActiveTab('map'),
    () => setActiveTab('profile')
  );

  // FAB actions
  const fabActions = createReportActions(
    () => console.log('Call pharmacy'),
    () => console.log('Get directions'),
    () => console.log('Report issue'),
    () => console.log('Share pharmacy')
  );


  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {backgroundElements}
      <div className="bg-white/95 p-lg shadow-lg sticky top-0 z-10 backdrop-blur-xl border-b border-white/20 overflow-visible">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-md w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-xs flex items-center gap-md">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center justify-center w-8 h-8 bg-transparent border-none rounded-full text-neutral-600 cursor-pointer transition-all duration-200 ease-in-out text-lg hover:bg-neutral-100 hover:text-neutral-800"
                >
                  ←
                </button>
              )}
              Results for "{searchQuery}"
            </h1>
            <div className="flex items-center gap-sm">
              <p className="text-base text-neutral-600 font-medium m-0">
                Found {sortedPharmacies.length} pharmacies near you
              </p>
              {sortOption && (
                <div className="flex items-center gap-xs px-sm py-xs bg-primary/10 rounded-sm text-xs text-primary font-medium">
                  {sortOption.icon}
                  <span>Sorted by {sortOption.label}</span>
                  <span className="opacity-70">
                    {sortOption.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-md items-center">
            <SortDropdown
              options={pharmacySortOptions}
              selectedOption={sortOption}
              onSelect={handleSortChange}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-lg min-h-[calc(100vh-100px)] relative z-2">
        {(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-4xl">
            {hasError ? (
              <NetworkErrorEmptyState onRetry={handleRetry} />
            ) : sortedPharmacies.length === 0 ? (
              <NoResultsEmptyState 
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
                onRetry={handleRetry}
              />
            ) : (
              sortedPharmacies.map((pharmacy) => (
                <Card
                  key={pharmacy.id}
                  padding="lg"
                  onClick={() => onPharmacyClick(pharmacy.name)}
                  className="w-full"
                >
                {/* Compact Card Design */}
                <div>
                  {/* Main Info */}
                  <div>
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="text-lg font-bold text-neutral-900 m-0">
                        {pharmacy.name}
                      </h3>
                      {pharmacy.isVerified && (
                        <div className="flex items-center gap-xs bg-success/15 px-sm py-xs rounded-full border border-success/30">
                          <CheckCircle size={14} color="#10B981" />
                          <span className="text-xs font-bold text-success">
                            VERIFIED
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-xs mb-xs text-neutral-600 text-sm">
                      <MapPin size={14} />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-xs text-neutral-600 text-sm mb-sm">
                      <Phone size={14} />
                      <span>{pharmacy.phone}</span>
                    </div>
                    
                    {pharmacy.openHours && (
                      <div className="flex items-center gap-xs text-neutral-600 text-sm mb-md">
                        <Clock size={14} />
                        <span>Opens Saturday at 9:00 AM</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons Below Details */}
                  <div className="grid grid-cols-4 gap-sm mb-md">
                    {/* Call Button */}
                    {pharmacy.phone && (
                      <button
                        onClick={() => window.open(`tel:${pharmacy.phone}`, '_self')}
                        className="flex flex-col items-center gap-xs p-sm bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg border-none text-xs font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-lg min-h-[50px] justify-center hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <Phone size={18} />
                        <span>Call</span>
                      </button>
                    )}
                    
                    {/* WhatsApp Button */}
                    {pharmacy.phone && (
                      <button
                        onClick={() => {
                          if (pharmacy.phone) {
                            const message = `Hi, I'm looking for medicine availability at ${pharmacy.name}. Can you help me?`;
                            const whatsappUrl = `https://wa.me/${pharmacy.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }
                        }}
                        className="flex flex-col items-center gap-xs p-sm bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg border-none text-xs font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-lg min-h-[50px] justify-center hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <MessageCircle size={18} />
                        <span>WhatsApp</span>
                      </button>
                    )}
                    
                    {/* Email Button */}
                    {pharmacy.email && (
                      <button
                        onClick={() => {
                          const subject = `Medicine Availability Inquiry - ${pharmacy.name}`;
                          const body = `Hello,\n\nI'm looking for medicine availability at your pharmacy. Could you please help me with the following:\n\n1. Medicine name:\n2. Required quantity:\n3. Preferred timing:\n\nThank you for your assistance.`;
                          const mailtoUrl = `mailto:${pharmacy.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          window.open(mailtoUrl, '_self');
                        }}
                        className="flex flex-col items-center gap-xs p-sm bg-gradient-primary text-white rounded-lg border-none text-xs font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-lg min-h-[50px] justify-center hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <Mail size={18} />
                        <span>Email</span>
                      </button>
                    )}
                    
                    {/* Directions Button */}
                    {pharmacy.address && (
                      <button
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
                          window.open(mapsUrl, '_blank');
                        }}
                        className="flex flex-col items-center gap-xs p-sm bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg border-none text-xs font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-lg min-h-[50px] justify-center hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <MapPin size={18} />
                        <span>Directions</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end items-center pt-md border-t border-neutral-200">
                  <span className="text-sm text-primary font-bold">
                    View Details →
                  </span>
                </div>
              </Card>
              ))
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="fixed bottom-xl right-xl z-20 shadow-2xl">
      </div>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && (
        <BottomNavigation
          items={navigationItems}
          activeItem={activeTab}
          onItemClick={(itemId) => setActiveTab(itemId)}
        />
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <FloatingActionButton
          icon={<Plus size={24} />}
          actions={fabActions}
          position="bottom-right"
          size="medium"
        />
      )}
      </div>
  );
};
