import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, CheckCircle, Plus, MessageCircle, Mail } from 'lucide-react';
import { Card } from '../components/Card';
import { DotsLoader } from '../components/DotsLoader';
import { useLoading } from '../hooks/useLoading';
import { NoResultsEmptyState, NetworkErrorEmptyState } from '../components/EmptyState';
import { SortDropdown, pharmacySortOptions, type SortOption } from '../components/SortDropdown';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { BottomNavigation, createMainNavigation } from '../components/BottomNavigation';
import { FloatingActionButton, createReportActions } from '../components/FloatingActionButton';
import { colors, spacing, borderRadius } from '../styles/tokens';
import type { Pharmacy } from '../types';

interface SearchResultsPageProps {
  searchQuery: string;
  onReportClick: () => void;
  onPharmacyClick: (pharmacyId: string) => void;
  onBack?: () => void;
}


export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchQuery,
  onReportClick,
  onPharmacyClick,
  onBack,
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading({ delay: 1000 });
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'search' | null>(null);
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
    setErrorType(null);
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

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Add animated background elements
  const backgroundElements = (
    <>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite',
        zIndex: 1
      }} />
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

  const headerStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.lg,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'visible'
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%'
  };

  const mainContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.lg,
    minHeight: 'calc(100vh - 100px)',
    position: 'relative',
    zIndex: 2,
  };

  const listContainerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing['4xl'],
  };


  const fabStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 20,
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
  };

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
    <div style={containerStyles}>
      {backgroundElements}
      <div style={headerStyles}>
        <div style={headerContentStyles}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: spacing.xs, display: 'flex', alignItems: 'center', gap: spacing.md }}>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '50%',
                    color: colors.neutral[600],
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '18px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.neutral[100];
                    e.currentTarget.style.color = colors.neutral[800];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.neutral[600];
                  }}
                >
                  ←
                </button>
              )}
              Results for "{searchQuery}"
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500, margin: 0 }}>
                Found {sortedPharmacies.length} pharmacies near you
              </p>
              {sortOption && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: `${colors.primary}10`,
                  borderRadius: borderRadius.sm,
                  fontSize: '12px',
                  color: colors.primary,
                  fontWeight: 500
                }}>
                  {sortOption.icon}
                  <span>Sorted by {sortOption.label}</span>
                  <span style={{ opacity: 0.7 }}>
                    {sortOption.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            <SortDropdown
              options={pharmacySortOptions}
              selectedOption={sortOption}
              onSelect={handleSortChange}
              placeholder="Sort by"
            />
            
            
          </div>
        </div>
      </div>

      <div style={mainContentStyles}>
        {(
          <InfiniteScroll
            hasMore={sortedPharmacies.length < 50} // Mock: assume we have more data
            isLoading={isLoading}
            onLoadMore={() => {
              console.log('Loading more pharmacies...');
              // In a real app, this would load more data
            }}
            style={listContainerStyles}
          >
            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                width: '100%'
              }}>
                <DotsLoader />
              </div>
            ) : hasError ? (
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
                  onClick={() => {
                    setSelectedPharmacy(pharmacy.id);
                    onPharmacyClick(pharmacy.id);
                  }}
                >
                {/* Compact Card Design */}
                <div>
                  {/* Main Info */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: spacing.sm, 
                      marginBottom: spacing.xs 
                    }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 700, 
                        color: colors.neutral[900],
                        margin: 0
                      }}>
                        {pharmacy.name}
                      </h3>
                      {pharmacy.isVerified && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          background: colors.success + '15',
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.full,
                          border: `1px solid ${colors.success}30`
                        }}>
                          <CheckCircle size={14} color={colors.success} />
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 700, 
                            color: colors.success 
                          }}>
                            VERIFIED
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: spacing.xs, 
                      marginBottom: spacing.xs,
                      color: colors.neutral[600],
                      fontSize: '14px'
                    }}>
                      <MapPin size={14} />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: spacing.xs,
                      color: colors.neutral[600],
                      fontSize: '14px',
                      marginBottom: spacing.sm
                    }}>
                      <Phone size={14} />
                      <span>{pharmacy.phone}</span>
                    </div>
                    
                    {pharmacy.openHours && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        color: colors.neutral[600],
                        fontSize: '14px',
                        marginBottom: spacing.md
                      }}>
                        <Clock size={14} />
                        <span>Opens Saturday at 9:00 AM</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons Below Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: spacing.sm,
                    marginBottom: spacing.md
                  }}>
                    {/* Call Button */}
                    {pharmacy.phone && (
                      <button
                        onClick={() => window.open(`tel:${pharmacy.phone}`, '_self')}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: spacing.xs,
                          padding: spacing.sm,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          borderRadius: borderRadius.lg,
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          minHeight: '50px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                        }}
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
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: spacing.xs,
                          padding: spacing.sm,
                          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          color: 'white',
                          borderRadius: borderRadius.lg,
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                          minHeight: '50px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 211, 102, 0.3)';
                        }}
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
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: spacing.xs,
                          padding: spacing.sm,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: borderRadius.lg,
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          minHeight: '50px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                        }}
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
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: spacing.xs,
                          padding: spacing.sm,
                          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                          color: 'white',
                          borderRadius: borderRadius.lg,
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          minHeight: '50px',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        <MapPin size={18} />
                        <span>Directions</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingTop: spacing.md,
                  borderTop: `1px solid ${colors.neutral[200]}`,
                }}>
                  <span style={{ fontSize: '13px', color: colors.primary, fontWeight: 700 }}>
                    View Details →
                  </span>
                </div>
              </Card>
              ))
            )}
          </InfiniteScroll>
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



      <div style={fabStyles}>
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
