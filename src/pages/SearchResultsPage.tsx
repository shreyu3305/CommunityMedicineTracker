import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, CheckCircle, Plus, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { Card } from '../components/Card';
import { useLoading } from '../hooks/useLoading';
import { NoResultsEmptyState, NetworkErrorEmptyState } from '../components/EmptyState';
import { BottomNavigation, createMainNavigation } from '../components/BottomNavigation';
import { FloatingActionButton, createReportActions } from '../components/FloatingActionButton';
import type { Pharmacy } from '../types';
import { apiClient } from '../services/api';

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
  const [isMobile, setIsMobile] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  // Fetch pharmacies from API
  useEffect(() => {
    const fetchPharmacies = async () => {
      startLoading('Searching for pharmacies...');
      setHasError(false);
      
      try {
        console.log('SearchResultsPage: Searching for:', searchQuery);
        // If there's a search query, pass it to filter pharmacies by medicine
        // If no query or empty query, get all pharmacies
        const medicineQuery = (searchQuery && searchQuery.trim() !== '') ? searchQuery : undefined;
        const response = await apiClient.getPharmacies(medicineQuery);
        
        console.log('SearchResultsPage: Response:', response);
        console.log('SearchResultsPage: Response ok?', response.ok);
        console.log('SearchResultsPage: Response data?', response.data);
        console.log('SearchResultsPage: Response data length?', response.data?.length);
        
        if (response.ok) {
          // Handle both array and non-array responses
          const dataArray = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
          
          console.log('SearchResultsPage: Data array length:', dataArray.length);
          
          // Transform backend data to frontend format
          const transformedPharmacies: Pharmacy[] = dataArray.map((pharmacy: any) => ({
            id: pharmacy._id || pharmacy.id,
            name: pharmacy.name,
            address: pharmacy.address,
            latitude: pharmacy.latitude,
            longitude: pharmacy.longitude,
            phone: pharmacy.phone,
            email: pharmacy.email,
            isVerified: pharmacy.isVerified || false,
            openHours: pharmacy.openHours || {},
          }));
          
          console.log('SearchResultsPage: Transformed pharmacies:', transformedPharmacies);
          setPharmacies(transformedPharmacies);
        } else {
          console.error('SearchResultsPage: Response not ok:', response.error);
          setHasError(true);
        }
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
        setHasError(true);
      } finally {
        stopLoading();
      }
    };

    fetchPharmacies();
  }, [searchQuery, startLoading, stopLoading]);

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

  // Note: Backend already filters pharmacies by medicine name, so we don't need to filter again here
  // If no search query, show all pharmacies. If there's a query, backend returns only pharmacies with that medicine.
  const filteredPharmacies = pharmacies;


  const handleRetry = async () => {
    setHasError(false);
    startLoading('Retrying search...');
    
    try {
      const response = await apiClient.getPharmacies();
      if (response.ok && response.data) {
        const transformedPharmacies: Pharmacy[] = response.data.map((pharmacy: any) => ({
          id: pharmacy._id || pharmacy.id,
          name: pharmacy.name,
          address: pharmacy.address,
          latitude: pharmacy.latitude,
          longitude: pharmacy.longitude,
          phone: pharmacy.phone,
          email: pharmacy.email,
          isVerified: pharmacy.isVerified || false,
          openHours: pharmacy.openHours || {},
        }));
        setPharmacies(transformedPharmacies);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setHasError(true);
    } finally {
      stopLoading();
    }
  };

  const handleClearSearch = () => {
    // This would typically navigate back to home or clear the search
    console.log('Clearing search');
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
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-lg py-lg">
          <div className="flex items-center gap-lg">
            {onBack && (
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
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-xs truncate drop-shadow-sm leading-tight">
                {searchQuery && searchQuery.trim() !== '' ? (
                  <>
                    Results for{' '}
                    <span className="text-yellow-200 font-semibold">"{searchQuery}"</span>
                  </>
                ) : (
                  'All Pharmacies'
                )}
              </h1>
              <p className="text-sm md:text-base text-white/80 font-medium m-0">
                <span className="font-semibold text-white">{filteredPharmacies.length}</span>{' '}
                {searchQuery && searchQuery.trim() !== '' 
                  ? 'pharmacy' + (filteredPharmacies.length !== 1 ? 'ies' : '') + ' found' 
                  : 'pharmacy' + (filteredPharmacies.length !== 1 ? 'ies' : '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-lg min-h-[calc(100vh-100px)] relative z-2">
        {(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-4xl">
            {hasError ? (
              <NetworkErrorEmptyState onRetry={handleRetry} />
            ) : filteredPharmacies.length === 0 ? (
              <NoResultsEmptyState 
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
                onRetry={handleRetry}
              />
            ) : (
              filteredPharmacies.map((pharmacy) => (
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
