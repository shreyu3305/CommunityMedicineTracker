import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, CheckCircle, AlertCircle, HelpCircle, Filter, Plus, List, Map } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { OperatingHours } from '../components/OperatingHours';
import { SkeletonList, SkeletonPharmacyCard } from '../components/Skeleton';
import { useLoading } from '../hooks/useLoading';
import { NoResultsEmptyState, NetworkErrorEmptyState } from '../components/EmptyState';
import { SortDropdown, pharmacySortOptions, type SortOption } from '../components/SortDropdown';
import { DistanceDisplay, DistanceBadge } from '../components/DistanceDisplay';
import { StatusIcon, StockStatusIcon, VerificationStatusIcon, StatusLegend } from '../components/StatusIcon';
import { PriceDisplay, PriceBadge, PriceComparison } from '../components/PriceDisplay';
import { ContactActions, ContactInfo, QuickContact } from '../components/ContactActions';
import { PullToRefresh } from '../components/PullToRefresh';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { SwipeActions, createPharmacyActions } from '../components/SwipeActions';
import { BottomNavigation, createMainNavigation } from '../components/BottomNavigation';
import { FloatingActionButton, createReportActions } from '../components/FloatingActionButton';
import { Tooltip, HelpIcon, ButtonTooltip } from '../components/Tooltip';
import { DistanceSlider, DistancePresets } from '../components/DistanceSlider';
import { LastUpdated, LastUpdatedBadge } from '../components/LastUpdated';
import { VerificationBadge, CompactVerificationBadge } from '../components/VerificationBadge';
import { HighContrastToggle } from '../components/HighContrastMode';
import { TextToSpeech, MedicineNameReader } from '../components/TextToSpeech';
import { LocationError, LocationPermission, LocationUnavailable } from '../components/LocationError';
import { SearchSuggestionsInput, useSearchSuggestions } from '../components/SearchSuggestions';
import { AriaMain, AriaHeading, AriaButton, AriaList, AriaListItem } from '../components/AriaLabels';
import { KeyboardNavigation, KeyboardList, KeyboardGrid } from '../components/KeyboardNavigation';
import { FocusIndicators, FocusRing } from '../components/FocusIndicators';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import type { Pharmacy } from '../types';

interface SearchResultsPageProps {
  searchQuery: string;
  onReportClick: () => void;
  onPharmacyClick: (pharmacyId: string) => void;
}

interface FilterOptions {
  status: string[];
  verification: string[];
  distance: number;
  priceRange: [number, number];
  confidenceLevel: string[];
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchQuery,
  onReportClick,
  onPharmacyClick,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    verification: [],
    distance: 20,
    priceRange: [0, 1000],
    confidenceLevel: []
  });
  const [searchRadius, setSearchRadius] = useState(20);
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
      distance: 0.3,
      confidenceScore: 95,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      price: 45.50,
      originalPrice: 52.00,
      currency: '₹',
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
      distance: 0.8,
      confidenceScore: 88,
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      price: 48.75,
      currency: '₹',
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
      distance: 1.2,
      confidenceScore: 72,
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      price: 42.00,
      originalPrice: 48.00,
      currency: '₹',
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
      distance: 1.5,
      confidenceScore: 65,
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      price: 51.25,
      currency: '₹',
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
      distance: 2.1,
      confidenceScore: 45,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      price: 38.90,
      currency: '₹',
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
      distance: 2.3,
      confidenceScore: 82,
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      price: 44.50,
      originalPrice: 50.00,
      currency: '₹',
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
      distance: 3.5,
      confidenceScore: 35,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      price: 35.75,
      currency: '₹',
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
      distance: 4.2,
      confidenceScore: 78,
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
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

  // Filter pharmacies based on current filters
  const filteredPharmacies = mockPharmacies.filter(pharmacy => {
    // Distance filter
    if (pharmacy.distance && pharmacy.distance > filters.distance) {
      return false;
    }

    // Verification filter
    if (filters.verification.length > 0) {
      const isVerified = pharmacy.isVerified;
      if (filters.verification.includes('verified') && !isVerified) return false;
      if (filters.verification.includes('unverified') && isVerified) return false;
    }

    // Confidence level filter
    if (filters.confidenceLevel.length > 0) {
      const score = pharmacy.confidenceScore || 50;
      let confidenceLevel = '';
      if (score >= 80) confidenceLevel = 'high';
      else if (score >= 60) confidenceLevel = 'medium';
      else confidenceLevel = 'low';
      
      if (!filters.confidenceLevel.includes(confidenceLevel)) return false;
    }

    return true;
  });

  // Sort pharmacies based on selected sort option
  const sortedPharmacies = [...filteredPharmacies].sort((a, b) => {
    if (!sortOption) return 0;

    let aValue: any, bValue: any;

    switch (sortOption.value) {
      case 'distance':
        aValue = a.distance || 0;
        bValue = b.distance || 0;
        break;
      case 'confidence':
        aValue = a.confidenceScore || 0;
        bValue = b.confidenceScore || 0;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'lastUpdated':
        // Mock last updated time for sorting
        aValue = new Date(a.lastUpdated || '2024-01-01').getTime();
        bValue = new Date(b.lastUpdated || '2024-01-01').getTime();
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

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      verification: [],
      distance: 20,
      priceRange: [0, 1000],
      confidenceLevel: []
    });
  };

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
    background: colors.gradient.primary,
    position: 'relative',
  };

  const headerStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.lg,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  };

  const mainContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.lg,
    minHeight: 'calc(100vh - 100px)',
  };

  const listContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing['4xl'],
  };

  const pharmacyCardStyles: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'all 0.25s',
  };

  const mapContainerStyles: React.CSSProperties = {
    position: 'sticky',
    top: '100px',
    height: 'calc(100vh - 120px)',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: spacing.lg,
  };

  const fabStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 20,
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
  };

  const getStatusIcon = (status: 'in_stock' | 'out_of_stock' | 'unknown' | 'low_stock' | 'pending') => {
    return (
      <StatusIcon 
        status={status} 
        size="sm" 
        showLabel={true} 
        showTooltip={true}
        compact={true}
      />
    );
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

  // Pharmacy actions for swipe
  const getPharmacyActions = (pharmacy: Pharmacy) => createPharmacyActions(
    () => console.log('Call', pharmacy.name),
    () => console.log('Directions to', pharmacy.name),
    () => console.log('Report', pharmacy.name)
  );

  return (
    <PullToRefresh
      onRefresh={async () => {
        startLoading('Refreshing results...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        stopLoading();
      }}
    >
      <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={headerContentStyles}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: spacing.xs }}>
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
            <Tooltip
              content="Sort results by distance, confidence score, price, or pharmacy name"
              variant="info"
              position="top"
            >
              <SortDropdown
                options={pharmacySortOptions}
                selectedOption={sortOption}
                onSelect={handleSortChange}
                placeholder="Sort by"
              />
            </Tooltip>
            
            {/* Unified Button Group */}
            <div style={{ 
              display: 'flex', 
              background: colors.background.secondary, 
              borderRadius: '12px',
              padding: '6px',
              gap: '4px',
              border: `1px solid ${colors.border.light}`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              {/* List View Button */}
              <button
                onClick={() => {
                  console.log('List button clicked');
                  setViewMode('list');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: viewMode === 'list' ? colors.primary : 'transparent',
                  color: viewMode === 'list' ? 'white' : colors.neutral[600],
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: viewMode === 'list' ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '60px',
                  justifyContent: 'center'
                }}
              >
                <List size={16} />
                List
              </button>
              
              {/* Map View Button */}
              <button
                onClick={() => {
                  console.log('Map button clicked');
                  setViewMode('map');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: viewMode === 'map' ? colors.primary : 'transparent',
                  color: viewMode === 'map' ? 'white' : colors.neutral[600],
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: viewMode === 'map' ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '60px',
                  justifyContent: 'center'
                }}
              >
                <Map size={16} />
                Map
              </button>
              
              {/* Filters Button */}
              <button
                onClick={() => {
                  console.log('Filters button clicked');
                  setShowFilters(!showFilters);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: showFilters ? colors.primary : 'transparent',
                  color: showFilters ? 'white' : colors.neutral[600],
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: showFilters ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '60px',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Filter size={16} />
                Filters
                {showFilters && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    background: 'white',
                    borderRadius: '50%'
                  }}></div>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>

      <div style={mainContentStyles}>
        {viewMode === 'list' ? (
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
              <SkeletonList count={6} itemComponent={SkeletonPharmacyCard} />
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
              <SwipeActions
                key={pharmacy.id}
                rightActions={getPharmacyActions(pharmacy)}
                disabled={!isMobile}
              >
                <Card
                  hover
                  padding="lg"
                  onClick={() => {
                    setSelectedPharmacy(pharmacy.id);
                    onPharmacyClick(pharmacy.id);
                  }}
                >
                {/* Compact Card Design */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: spacing.md
                }}>
                  {/* Main Info */}
                  <div style={{ flex: 1 }}>
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
                      <OperatingHours 
                        hours={pharmacy.openHours} 
                        compact={true} 
                        showStatus={true}
                      />
                    )}
                  </div>
                  
                  {/* Compact Status Section */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    gap: spacing.xs,
                    minWidth: '140px'
                  }}>
                    {/* Distance */}
                    <DistanceBadge 
                      distance={pharmacy.distance || 0} 
                      unit="km"
                      showIcon={true}
                    />
                    
                    {/* Status Row 1 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: spacing.xs
                    }}>
                      <Tooltip
                        content={`Confidence Score: ${pharmacy.confidenceScore || 50}%`}
                        variant="info"
                        position="top"
                      >
                        <ConfidenceBadge 
                          score={pharmacy.confidenceScore || 50} 
                          size="sm" 
                          showTooltip={false}
                        />
                      </Tooltip>
                      <VerificationBadge
                        status={pharmacy.isVerified ? 'verified' : 'unverified'}
                        size="sm"
                        showIcon={true}
                        showLabel={false}
                        showTooltip={true}
                        variant="badge"
                      />
                    </div>
                    
                    {/* Status Row 2 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: spacing.xs
                    }}>
                      {pharmacy.price && (
                        <PriceBadge 
                          price={pharmacy.price}
                          originalPrice={pharmacy.originalPrice}
                          currency={pharmacy.currency}
                        />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        {getStatusIcon('in_stock')}
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 600, 
                          color: colors.success 
                        }}>
                          In Stock
                        </span>
                      </div>
                    </div>
                    
                    {/* Last Updated */}
                    <LastUpdatedBadge
                      timestamp={pharmacy.lastUpdated || new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()}
                      variant="default"
                      size="sm"
                    />
                  </div>
                </div>
                
                {/* Compact Contact Actions */}
                <div style={{
                  marginTop: spacing.md,
                  padding: spacing.sm,
                  background: colors.neutral[50],
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.neutral[200]}`
                }}>
                  <ContactActions
                    phone={pharmacy.phone}
                    email={pharmacy.email}
                    address={pharmacy.address}
                    pharmacyName={pharmacy.name}
                    size="sm"
                    layout="horizontal"
                    showLabels={true}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: spacing.md,
                  borderTop: `1px solid ${colors.neutral[200]}`,
                }}>
                  <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                    Confidence Score: <strong style={{ color: colors.success }}>95%</strong>
                  </span>
                  <span style={{ fontSize: '13px', color: colors.primary, fontWeight: 700 }}>
                    View Details →
                  </span>
                </div>
              </Card>
              </SwipeActions>
              ))
            )}
          </InfiniteScroll>
        ) : (
          <div style={{
            width: '100%',
            height: 'calc(100vh - 200px)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: spacing['4xl']
          }}>
            {isLoading ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading map...</p>
              </div>
            ) : hasError ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: spacing.xl
              }}>
                <NetworkErrorEmptyState onRetry={handleRetry} />
              </div>
            ) : sortedPharmacies.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: spacing.xl
              }}>
                <NoResultsEmptyState 
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                  onRetry={handleRetry}
                />
              </div>
            ) : (
              <>
            {/* Map Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                linear-gradient(45deg, rgba(102, 126, 234, 0.05) 25%, transparent 25%, transparent 75%, rgba(118, 75, 162, 0.05) 75%)
              `,
              backgroundSize: '40px 40px, 60px 60px, 80px 80px'
            }} />
            
            {/* Map Markers */}
            {sortedPharmacies.map((pharmacy, index) => {
              const confidenceScore = pharmacy.confidenceScore || 50;
              const getMarkerColor = (score: number) => {
                if (score >= 80) return '#10B981'; // Green for high confidence
                if (score >= 60) return '#F59E0B'; // Orange for medium confidence
                return '#EF4444'; // Red for low confidence
              };
              
              return (
                <div
                  key={pharmacy.id}
                  style={{
                    position: 'absolute',
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 2
                  }}
                  onClick={() => {
                    setSelectedPharmacy(pharmacy.id);
                    onPharmacyClick(pharmacy.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.zIndex = '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.zIndex = '2';
                  }}
                >
                  {/* Distance Label */}
                  <div style={{
                    background: 'white',
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.full,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: colors.neutral[700],
                    marginBottom: spacing.xs,
                    border: `1px solid ${colors.neutral[200]}`,
                    whiteSpace: 'nowrap'
                  }}>
                    {pharmacy.distance ? `${Math.round(pharmacy.distance * 10) / 10} km` : 'N/A'}
                  </div>
                  
                  {/* Status Label */}
                  <div style={{
                    background: 'white',
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.full,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: colors.success,
                    marginBottom: spacing.xs,
                    border: `1px solid ${colors.success}30`,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={10} color={colors.success} />
                    In Stock
                  </div>
                  
                  {/* Quick Contact Button */}
                  {pharmacy.phone && (
                    <div style={{ marginBottom: spacing.xs }}>
                      <QuickContact
                        phone={pharmacy.phone}
                        pharmacyName={pharmacy.name}
                        style={{
                          fontSize: '10px',
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.full,
                          background: '#25D366',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Marker */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: getMarkerColor(confidenceScore),
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin size={16} color="white" />
                  </div>
                </div>
              );
            })}
            
            {/* Map Info */}
            <div style={{ 
              position: 'absolute',
              bottom: spacing.lg,
              left: spacing.lg,
              right: spacing.lg,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: spacing.md,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                <MapPin size={16} color="#667eea" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                  Manhattan, New York
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginBottom: spacing.sm }}>
                {sortedPharmacies.length} pharmacies found within {filters.distance}km radius
              </p>
              
              {/* Status Legend */}
              <div style={{ marginBottom: spacing.md }}>
                <StatusLegend style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  padding: 0,
                  gap: spacing.xs
                }} />
              </div>
              
              {/* Price Comparison */}
              <div style={{ marginBottom: spacing.md }}>
                <PriceComparison 
                  prices={sortedPharmacies
                    .filter(pharmacy => pharmacy.price)
                    .map(pharmacy => ({
                      pharmacy: pharmacy.name,
                      price: pharmacy.price!,
                      originalPrice: pharmacy.originalPrice
                    }))
                    .slice(0, 5)
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    gap: spacing.xs
                  }}
                />
              </div>
              
              {/* Confidence Legend */}
              <div style={{ 
                display: 'flex', 
                gap: spacing.sm, 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>Trust Level:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>High</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>Medium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>Low</span>
                </div>
              </div>
            </div>
            
            {/* Map Controls */}
            <div style={{
              position: 'absolute',
              top: spacing.md,
              right: spacing.md,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs
            }}>
              <button style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#667eea'
              }}>+</button>
              <button style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#667eea'
              }}>-</button>
            </div>
              </>
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

      {/* Distance Slider */}
      {showFilters && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: borderRadius.lg,
          boxShadow: shadows.lg,
          padding: spacing.lg,
          zIndex: 1000,
          minWidth: '300px',
          border: `1px solid ${colors.neutral[200]}`
        }}>
          <div style={{ marginBottom: spacing.md }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: colors.neutral[800], 
              margin: 0, 
              marginBottom: spacing.sm,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs
            }}>
              <MapPin size={18} color={colors.primary} />
              Search Radius
            </h3>
            <DistancePresets
              value={searchRadius}
              onChange={setSearchRadius}
              presets={[5, 10, 20, 30]}
              unit="km"
            />
          </div>
        </div>
      )}

      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        resultCount={sortedPharmacies.length}
      />

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
    </PullToRefresh>
  );
};
