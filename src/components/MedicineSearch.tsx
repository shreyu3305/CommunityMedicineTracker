import React, { useState } from 'react';
import { Search, Pill, ArrowRight, TrendingUp, X, Filter } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { FormValidation, validationRules } from './FormValidation';
import { Tooltip, HelpIcon, FieldTooltip } from './Tooltip';
import { StrengthFilter, StrengthPills } from './StrengthFilter';
import { FormFilter, FormPills } from './FormFilter';
import { BrandGenericToggle, BrandGenericStatus } from './BrandGenericToggle';
import { Card } from './Card';
import { Skeleton, SkeletonText } from './Skeleton';
import { EmptyState } from './EmptyState';
import { MedicineCategory, medicineCategories } from './MedicineCategory';
import { StatusIcon } from './StatusIcon';
import { PriceDisplay } from './PriceDisplay';
import { MedicineDetailsModal } from './MedicineDetailsModal';
import { SearchHistory } from './SearchHistory';
import { useSearchHistory } from '../contexts/SearchHistoryContext';
import { colors, spacing } from '../styles/tokens';
import type { Medicine } from '../types';

interface MedicineSearchProps {
  onMedicineSelect: (medicine: string) => void;
  onSearch: (query: string) => void;
}

export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  onMedicineSelect,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFrequentlySearched, setShowFrequentlySearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [brandGenericMode, setBrandGenericMode] = useState<'both' | 'brand' | 'generic'>('both');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const searchValidationRules = {
    ...validationRules.minLength(2, 'Search must be at least 2 characters'),
    ...validationRules.medicineName('Please enter a valid medicine name')
  };
  
  const { addSearch } = useSearchHistory();

  const frequentlySearchedItems = [
    'Ecosprin 75mg Strip Of 14 Tablets',
    'Dolo 650mg Strip Of 15 Tablets',
    'Evion 400mg Strip Of 10 Capsules',
    'Pan 40mg Strip Of 15 Tablets',
    'Paracetamol 500mg Strip Of 10 Tablets',
    'Ibuprofen 400mg Strip Of 10 Tablets',
    'Aspirin 75mg Strip Of 14 Tablets',
    'Amoxicillin 500mg Strip Of 10 Capsules',
    'Omeprazole 20mg Strip Of 15 Capsules',
    'Metformin 500mg Strip Of 10 Tablets'
  ];

  const popularMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      form: 'tablet',
      strength: '500mg',
      manufacturer: 'Various',
      description: 'Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It is effective for treating mild to moderate pain and reducing fever.',
      category: 'pain-relief',
      price: 25.50,
      originalPrice: 30.00,
      dosage: {
        adults: '1-2 tablets every 4-6 hours (max 8 tablets/day)',
        children: '10-15mg/kg every 4-6 hours',
        elderly: '1 tablet every 6-8 hours'
      },
      sideEffects: [
        'Nausea and vomiting (rare)',
        'Allergic reactions (very rare)',
        'Liver damage (with overdose)',
        'Skin rash (rare)'
      ],
      interactions: [
        'Warfarin - may increase bleeding risk',
        'Alcohol - may increase liver damage risk',
        'Other paracetamol products - risk of overdose'
      ],
      warnings: [
        'Do not exceed recommended dose',
        'Consult doctor if pregnant or breastfeeding',
        'Avoid alcohol while taking this medication',
        'Stop use if allergic reaction occurs'
      ],
      storage: 'Store at room temperature, away from moisture and heat',
      expiry: '2025-12-31',
      availability: 'in_stock',
      rating: 4.2,
      reviewCount: 128
    },
    {
      id: '2',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      form: 'tablet',
      strength: '400mg',
      manufacturer: 'Various',
      description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and fever. It works by reducing hormones that cause inflammation and pain in the body.',
      category: 'pain-relief',
      price: 35.75,
      originalPrice: 40.00,
      dosage: {
        adults: '1 tablet every 6-8 hours (max 4 tablets/day)',
        children: '5-10mg/kg every 6-8 hours',
        elderly: '1 tablet every 8-12 hours'
      },
      sideEffects: [
        'Stomach upset and heartburn',
        'Dizziness and headache',
        'Increased blood pressure',
        'Stomach ulcers (with long-term use)'
      ],
      interactions: [
        'Aspirin - may reduce effectiveness',
        'Blood pressure medications - may reduce effectiveness',
        'Warfarin - may increase bleeding risk'
      ],
      warnings: [
        'Take with food to reduce stomach upset',
        'Do not use if you have stomach ulcers',
        'Consult doctor if you have heart problems',
        'Avoid alcohol while taking this medication'
      ],
      storage: 'Store at room temperature, protect from light',
      expiry: '2025-06-30',
      availability: 'in_stock',
      rating: 4.0,
      reviewCount: 95
    },
    {
      id: '3',
      name: 'Aspirin 75mg',
      genericName: 'Acetylsalicylic Acid',
      form: 'tablet',
      strength: '75mg',
      manufacturer: 'Various',
      description: 'Blood thinner and pain relief',
      category: 'cardiovascular',
      price: 18.25
    },
    {
      id: '4',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      form: 'capsule',
      strength: '500mg',
      manufacturer: 'Various',
      description: 'Antibiotic for bacterial infections',
      category: 'antibiotics',
      price: 42.50,
      originalPrice: 48.00
    },
    {
      id: '5',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      form: 'capsule',
      strength: '20mg',
      manufacturer: 'Various',
      description: 'Proton pump inhibitor for acid reflux',
      category: 'digestive',
      price: 28.90
    },
    {
      id: '6',
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      form: 'tablet',
      strength: '500mg',
      manufacturer: 'Various',
      description: 'Diabetes medication',
      category: 'diabetes',
      price: 22.75,
      originalPrice: 25.00
    },
    {
      id: '7',
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      form: 'tablet',
      strength: '10mg',
      manufacturer: 'Various',
      description: 'ACE inhibitor for blood pressure',
      category: 'cardiovascular',
      price: 31.50
    },
    {
      id: '8',
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin',
      form: 'tablet',
      strength: '20mg',
      manufacturer: 'Various',
      description: 'Statin for cholesterol management',
      category: 'cardiovascular',
      price: 38.25,
      originalPrice: 42.00
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addSearch(searchQuery, undefined, selectedCategory || undefined, 'medicine');
      onSearch(searchQuery);
      setShowFilters(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedStrengths([]);
    setSelectedForms([]);
    setBrandGenericMode('both');
    setSelectedCategory(null);
  };

  const getFilteredMedicines = (medicines: Medicine[]) => {
    let filtered = medicines;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(medicine => medicine.category === selectedCategory);
    }

    // Filter by strength
    if (selectedStrengths.length > 0) {
      filtered = filtered.filter(medicine => 
        selectedStrengths.some(strength => 
          medicine.strength?.toLowerCase().includes(strength.toLowerCase())
        )
      );
    }

    // Filter by form
    if (selectedForms.length > 0) {
      filtered = filtered.filter(medicine => 
        selectedForms.includes(medicine.form)
      );
    }

    // Filter by brand vs generic
    if (brandGenericMode === 'brand') {
      filtered = filtered.filter(medicine => 
        medicine.name !== medicine.genericName
      );
    } else if (brandGenericMode === 'generic') {
      filtered = filtered.filter(medicine => 
        medicine.name === medicine.genericName || !medicine.genericName
      );
    }

    return filtered;
  };

  const handleMedicineClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    onMedicineSelect(medicine.name);
    setShowSuggestions(false);
    setShowFrequentlySearched(false);
  };

  const handleMedicineMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent input blur
  };

  const handleFrequentlySearchedClick = (item: string) => {
    setSearchQuery(item);
    onMedicineSelect(item);
    setShowFrequentlySearched(false);
  };

  const handleFrequentlySearchedMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent input blur
  };

  const handleInputFocus = () => {
    if (searchQuery.length === 0) {
      setShowFrequentlySearched(true);
      setShowSearchHistory(true);
      setShowSuggestions(false);
      setShowCategories(false);
    } else {
      setShowSuggestions(true);
      setShowFrequentlySearched(false);
      setShowCategories(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategories(false);
    setShowSuggestions(true);
    setShowFrequentlySearched(false);
  };

  const handleCategoryToggle = () => {
    setShowCategories(!showCategories);
    setShowSuggestions(false);
    setShowFrequentlySearched(false);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setShowCategories(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      setIsSearching(true);
      setShowSuggestions(true);
      setShowFrequentlySearched(false);
      
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    } else {
      setIsSearching(false);
      setShowSuggestions(false);
      setShowFrequentlySearched(true);
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow clicks on dropdown items
    setTimeout(() => {
      setShowFrequentlySearched(false);
      setShowSuggestions(false);
      setShowSearchHistory(false);
      setShowCategories(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setShowSuggestions(false);
    setShowFrequentlySearched(false);
    setShowCategories(false);
    setShowSearchHistory(false);
  };

  const filteredMedicines = getFilteredMedicines(popularMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }));

  const containerStyles: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: spacing.xl,
    position: 'relative',
    marginBottom: spacing['4xl'],
    zIndex: 1002,
  };

  const searchContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    zIndex: 1001,
  };

  const suggestionsContainerStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: spacing.sm,
  };

  const medicineItemStyles: React.CSSProperties = {
    padding: spacing.md,
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };


  return (
    <div style={containerStyles}>
      <div style={searchContainerStyles}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FieldTooltip
              content={
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Search Tips:</div>
                  <div>• Type at least 2 characters to search</div>
                  <div>• Use generic names (e.g., "Paracetamol")</div>
                  <div>• Include strength (e.g., "500mg")</div>
                  <div>• Press Enter to search</div>
                </div>
              }
              variant="info"
            >
              <FormValidation
                placeholder="Search for medicines"
                value={searchQuery}
                onChange={setSearchQuery}
                rules={searchValidationRules}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </FieldTooltip>
            
            {/* Clear Search Button */}
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutral[500],
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.neutral[100];
                  e.currentTarget.style.color = colors.neutral[700];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.neutral[500];
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Category Filter Button */}
          <div style={{ marginTop: spacing.sm, display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
            <Tooltip
              content="Filter medicines by category (Pain Relief, Antibiotics, etc.)"
              variant="info"
              position="top"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleCategoryToggle}
                style={{
                  background: selectedCategory ? `${colors.primary}10` : 'transparent',
                  borderColor: selectedCategory ? colors.primary : colors.neutral[300],
                  color: selectedCategory ? colors.primary : colors.neutral[700]
                }}
              >
                <Pill size={16} />
                {selectedCategory 
                  ? medicineCategories.find(c => c.id === selectedCategory)?.name 
                  : 'Categories'
                }
              </Button>
            </Tooltip>
            
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCategory}
                style={{
                  background: 'transparent',
                  borderColor: colors.neutral[300],
                  color: colors.neutral[500]
                }}
              >
                Clear
              </Button>
            )}
          </div>
          
          {showCategories && (
            <div style={suggestionsContainerStyles}>
              <div style={{
                padding: spacing.md,
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                borderRadius: '16px 16px 0 0'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Pill size={18} color={colors.primary} />
                  Medicine Categories
                </div>
              </div>
              <div style={{ padding: spacing.md, display: 'grid', gap: spacing.sm }}>
                {medicineCategories.map((category) => (
                  <MedicineCategory
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={handleCategorySelect}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          {showSearchHistory && (
            <SearchHistory
              onSearchSelect={(query) => {
                setSearchQuery(query);
                onMedicineSelect(query);
                setShowSearchHistory(false);
              }}
              onClose={() => setShowSearchHistory(false)}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                marginTop: spacing.xs
              }}
            />
          )}

          {showFrequentlySearched && (
            <div style={suggestionsContainerStyles}>
              <div style={{
                padding: spacing.md,
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                borderRadius: '16px 16px 0 0'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <TrendingUp size={18} color={colors.primary} />
                  Frequently Searched Items
                </div>
              </div>
              {frequentlySearchedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...medicineItemStyles,
                    borderBottom: index === frequentlySearchedItems.length - 1 ? 'none' : '1px solid #f3f4f6'
                  }}
                  onClick={() => handleFrequentlySearchedClick(item)}
                  onMouseDown={handleFrequentlySearchedMouseDown}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={{ flex: 1, fontSize: '15px', color: '#374151' }}>
                    {item}
                  </div>
                  <ArrowRight size={16} color="#9ca3af" />
                </div>
              ))}
            </div>
          )}

          {/* Filter Controls */}
          {showFilters && (
            <div style={{
              background: 'white',
              borderRadius: borderRadius.lg,
              boxShadow: shadows.lg,
              border: `1px solid ${colors.neutral[200]}`,
              marginTop: spacing.sm,
              padding: spacing.lg,
              maxWidth: '500px',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.neutral[800],
                  margin: 0
                }}>
                  Advanced Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  icon={<X size={16} />}
                />
              </div>

              {/* Brand vs Generic Toggle */}
              <div style={{ marginBottom: spacing.lg }}>
                <BrandGenericToggle
                  mode={brandGenericMode}
                  onModeChange={setBrandGenericMode}
                  variant="segmented"
                  size="sm"
                />
              </div>

              {/* Strength Filter */}
              <div style={{ marginBottom: spacing.lg }}>
                <StrengthPills
                  selectedStrengths={selectedStrengths}
                  onStrengthsChange={setSelectedStrengths}
                  maxSelections={3}
                />
              </div>

              {/* Form Filter */}
              <div style={{ marginBottom: spacing.lg }}>
                <FormPills
                  selectedForms={selectedForms}
                  onFormsChange={setSelectedForms}
                  maxSelections={3}
                />
              </div>

              {/* Filter Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: spacing.sm
              }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <BrandGenericStatus mode={brandGenericMode} />
                  {(selectedStrengths.length > 0 || selectedForms.length > 0) && (
                    <div style={{
                      fontSize: '12px',
                      color: colors.neutral[600],
                      fontWeight: 500
                    }}>
                      {selectedStrengths.length + selectedForms.length} filters active
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div style={suggestionsContainerStyles}>
              {isSearching ? (
                <div style={{ padding: spacing.md }}>
                  <SkeletonText lines={3} />
                </div>
              ) : hasSearchError ? (
                <div style={{ padding: spacing.md }}>
                  <EmptyState
                    type="search-error"
                    title="Search Failed"
                    description="Unable to search for medicines. Please try again."
                    onRetry={() => {
                      setHasSearchError(false);
                      // Retry the search
                      handleInputChange({ target: { value: searchQuery } } as any);
                    }}
                  />
                </div>
              ) : filteredMedicines.length > 0 ? (
                filteredMedicines.slice(0, 5).map((medicine) => (
                <div
                  key={medicine.id}
                  style={medicineItemStyles}
                  onClick={() => handleMedicineClick(medicine)}
                  onMouseDown={handleMedicineMouseDown}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <Pill size={20} color={colors.primary} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {medicine.name}
                      </div>
                      <StatusIcon 
                        status="in_stock" 
                        size="sm" 
                        showLabel={false}
                        compact={true}
                      />
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: spacing.xs }}>
                      {medicine.genericName} • {medicine.strength}
                    </div>
                    {medicine.price && (
                      <PriceDisplay 
                        price={medicine.price}
                        originalPrice={medicine.originalPrice}
                        currency={medicine.currency || '₹'}
                        size="sm"
                        showComparison={true}
                        showSavings={true}
                        compact={true}
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-end' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMedicineClick(medicine);
                      }}
                      style={{ fontSize: '11px', padding: `${spacing.xs} ${spacing.sm}` }}
                    >
                      Details
                    </Button>
                    <ArrowRight size={16} color="#9ca3af" />
                  </div>
                </div>
                ))
              ) : (
                <div style={{ padding: spacing.md, textAlign: 'center', color: '#6b7280' }}>
                  No medicines found
                </div>
              )}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: spacing.md }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={20} />}
            style={{
              borderColor: showFilters ? colors.primary : colors.neutral[300],
              color: showFilters ? colors.primary : colors.neutral[600]
            }}
          >
            Filters
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSearch}
            icon={<Search size={20} />}
            style={{ flex: 1 }}
          >
            Search
          </Button>
          
          {/* Demo button to test search error */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setHasSearchError(!hasSearchError)}
            style={{
              background: hasSearchError ? `${colors.error}10` : 'transparent',
              borderColor: hasSearchError ? colors.error : colors.neutral[300],
              color: hasSearchError ? colors.error : colors.neutral[700]
            }}
          >
            {hasSearchError ? 'Hide Error' : 'Test Error'}
          </Button>
        </div>
      </div>
      
      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
