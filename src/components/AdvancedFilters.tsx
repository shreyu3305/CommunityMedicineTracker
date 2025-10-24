import React from 'react';
import { X, CheckCircle, AlertCircle, HelpCircle, Shield, MapPin, DollarSign } from 'lucide-react';
import { Button } from './Button';
import { colors, spacing } from '../styles/tokens';

interface FilterOptions {
  status: string[];
  verification: string[];
  distance: number;
  priceRange: [number, number];
  confidenceLevel: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount
}) => {
  const statusOptions = [
    { value: 'in_stock', label: 'In Stock', icon: <CheckCircle size={16} color={colors.success} /> },
    { value: 'out_of_stock', label: 'Out of Stock', icon: <AlertCircle size={16} color={colors.error} /> },
    { value: 'unknown', label: 'Unknown', icon: <HelpCircle size={16} color={colors.warning} /> }
  ];

  const verificationOptions = [
    { value: 'verified', label: 'Verified Only', icon: <Shield size={16} color={colors.primary} /> },
    { value: 'unverified', label: 'Unverified', icon: <Shield size={16} color={colors.neutral[400]} /> }
  ];

  const confidenceOptions = [
    { value: 'high', label: 'High Trust (80%+)', color: colors.success },
    { value: 'medium', label: 'Medium Trust (60-79%)', color: colors.warning },
    { value: 'low', label: 'Low Trust (<60%)', color: colors.error }
  ];

  const distanceOptions = [1, 2, 5, 10, 20, 50];

  const handleStatusChange = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleVerificationChange = (verification: string) => {
    const newVerification = filters.verification.includes(verification)
      ? filters.verification.filter(v => v !== verification)
      : [...filters.verification, verification];
    
    onFiltersChange({ ...filters, verification: newVerification });
  };

  const handleConfidenceChange = (confidence: string) => {
    const newConfidence = filters.confidenceLevel.includes(confidence)
      ? filters.confidenceLevel.filter(c => c !== confidence)
      : [...filters.confidenceLevel, confidence];
    
    onFiltersChange({ ...filters, confidenceLevel: newConfidence });
  };

  const handleDistanceChange = (distance: number) => {
    onFiltersChange({ ...filters, distance });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange];
    newPriceRange[index] = value;
    onFiltersChange({ ...filters, priceRange: newPriceRange });
  };

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : '-400px',
    width: '400px',
    height: '100vh',
    background: 'white',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'right 0.3s ease',
    overflowY: 'auto',
    padding: spacing.lg
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: spacing.xl
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const optionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: spacing.xs
  };

  const checkboxStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: `2px solid ${colors.neutral[300]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const sliderStyles: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: colors.neutral[200],
    outline: 'none',
    appearance: 'none'
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div style={containerStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.neutral[900], margin: 0 }}>
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={16} />}
            onClick={onClose}
            style={{ minWidth: 'auto', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: spacing.lg, padding: spacing.md, background: colors.neutral[50], borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.xs }}>
            Showing {resultCount} results
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            style={{ fontSize: '12px' }}
          >
            Clear All Filters
          </Button>
        </div>

        {/* Status Filter */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <CheckCircle size={18} color={colors.neutral[600]} />
            Medicine Status
          </div>
          {statusOptions.map((option) => (
            <div
              key={option.value}
              style={{
                ...optionStyles,
                background: filters.status.includes(option.value) ? `${colors.primary}10` : 'transparent'
              }}
              onClick={() => handleStatusChange(option.value)}
            >
              <div style={{
                ...checkboxStyles,
                background: filters.status.includes(option.value) ? colors.primary : 'transparent',
                borderColor: filters.status.includes(option.value) ? colors.primary : colors.neutral[300]
              }}>
                {filters.status.includes(option.value) && (
                  <CheckCircle size={10} color="white" />
                )}
              </div>
              {option.icon}
              <span style={{ fontSize: '14px', color: colors.neutral[700] }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Verification Filter */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <Shield size={18} color={colors.neutral[600]} />
            Verification Status
          </div>
          {verificationOptions.map((option) => (
            <div
              key={option.value}
              style={{
                ...optionStyles,
                background: filters.verification.includes(option.value) ? `${colors.primary}10` : 'transparent'
              }}
              onClick={() => handleVerificationChange(option.value)}
            >
              <div style={{
                ...checkboxStyles,
                background: filters.verification.includes(option.value) ? colors.primary : 'transparent',
                borderColor: filters.verification.includes(option.value) ? colors.primary : colors.neutral[300]
              }}>
                {filters.verification.includes(option.value) && (
                  <CheckCircle size={10} color="white" />
                )}
              </div>
              {option.icon}
              <span style={{ fontSize: '14px', color: colors.neutral[700] }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Confidence Level Filter */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <Shield size={18} color={colors.neutral[600]} />
            Trust Level
          </div>
          {confidenceOptions.map((option) => (
            <div
              key={option.value}
              style={{
                ...optionStyles,
                background: filters.confidenceLevel.includes(option.value) ? `${colors.primary}10` : 'transparent'
              }}
              onClick={() => handleConfidenceChange(option.value)}
            >
              <div style={{
                ...checkboxStyles,
                background: filters.confidenceLevel.includes(option.value) ? colors.primary : 'transparent',
                borderColor: filters.confidenceLevel.includes(option.value) ? colors.primary : colors.neutral[300]
              }}>
                {filters.confidenceLevel.includes(option.value) && (
                  <CheckCircle size={10} color="white" />
                )}
              </div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: option.color }}></div>
              <span style={{ fontSize: '14px', color: colors.neutral[700] }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Distance Filter */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <MapPin size={18} color={colors.neutral[600]} />
            Distance
          </div>
          <div style={{ marginBottom: spacing.md }}>
            <div style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.sm }}>
              Within {filters.distance} km
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.distance}
              onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
              style={sliderStyles}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: colors.neutral[500], marginTop: spacing.xs }}>
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
            {distanceOptions.map((distance) => (
              <button
                key={distance}
                onClick={() => handleDistanceChange(distance)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${filters.distance === distance ? colors.primary : colors.neutral[300]}`,
                  background: filters.distance === distance ? colors.primary : 'transparent',
                  color: filters.distance === distance ? 'white' : colors.neutral[600],
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {distance}km
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            <DollarSign size={18} color={colors.neutral[600]} />
            Price Range
          </div>
          <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <span style={{ color: colors.neutral[500] }}>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 1000)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.neutral[200]}` }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};
