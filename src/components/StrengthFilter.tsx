import React, { useState } from 'react';
import { Pill, Filter, X } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Badge } from './Badge';

export interface StrengthOption {
  value: string;
  label: string;
  dosage: number;
  unit: 'mg' | 'ml' | 'g' | 'mcg';
}

export interface StrengthFilterProps {
  selectedStrengths: string[];
  onStrengthsChange: (strengths: string[]) => void;
  availableStrengths?: StrengthOption[];
  showCustomInput?: boolean;
  maxSelections?: number;
  style?: React.CSSProperties;
}

export const StrengthFilter: React.FC<StrengthFilterProps> = ({
  selectedStrengths,
  onStrengthsChange,
  availableStrengths = defaultStrengths,
  showCustomInput = true,
  maxSelections = 5,
  style
}) => {
  const [customStrength, setCustomStrength] = useState('');
  const [showCustomInputField, setShowCustomInputField] = useState(false);

  const handleStrengthToggle = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      onStrengthsChange(selectedStrengths.filter(s => s !== strength));
    } else if (selectedStrengths.length < maxSelections) {
      onStrengthsChange([...selectedStrengths, strength]);
    }
  };

  const handleCustomStrengthAdd = () => {
    if (customStrength.trim() && !selectedStrengths.includes(customStrength.trim())) {
      if (selectedStrengths.length < maxSelections) {
        onStrengthsChange([...selectedStrengths, customStrength.trim()]);
        setCustomStrength('');
        setShowCustomInputField(false);
      }
    }
  };

  const handleRemoveStrength = (strength: string) => {
    onStrengthsChange(selectedStrengths.filter(s => s !== strength));
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    ...style
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[800],
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: spacing.sm
  };

  const strengthButtonStyles = (strength: string): React.CSSProperties => ({
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    border: `2px solid ${selectedStrengths.includes(strength) ? colors.primary : colors.neutral[300]}`,
    background: selectedStrengths.includes(strength) ? colors.primary + '15' : 'transparent',
    color: selectedStrengths.includes(strength) ? colors.primary : colors.neutral[700],
    cursor: selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength) ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'center',
    transition: 'all 0.2s ease',
    opacity: selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength) ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  });

  const selectedStrengthsStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm
  };

  const customInputStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    padding: `${spacing.sm} ${spacing.md}`,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={titleStyles}>
          <Pill size={18} color={colors.primary} />
          Strength Filter
        </div>
        {selectedStrengths.length > 0 && (
          <Badge variant="primary" size="sm">
            {selectedStrengths.length} selected
          </Badge>
        )}
      </div>

      <div style={gridStyles}>
        {availableStrengths.map((strength) => (
          <button
            key={strength.value}
            style={strengthButtonStyles(strength.value)}
            onClick={() => handleStrengthToggle(strength.value)}
            disabled={selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength.value)}
            onMouseEnter={(e) => {
              if (selectedStrengths.length < maxSelections || selectedStrengths.includes(strength.value)) {
                e.currentTarget.style.background = selectedStrengths.includes(strength.value) 
                  ? colors.primary + '25' 
                  : colors.neutral[100];
                e.currentTarget.style.borderColor = selectedStrengths.includes(strength.value) 
                  ? colors.primary 
                  : colors.neutral[400];
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = selectedStrengths.includes(strength.value) 
                ? colors.primary + '15' 
                : 'transparent';
              e.currentTarget.style.borderColor = selectedStrengths.includes(strength.value) 
                ? colors.primary 
                : colors.neutral[300];
            }}
          >
            <Pill size={14} />
            {strength.label}
          </button>
        ))}
      </div>

      {showCustomInput && (
        <div style={customInputStyles}>
          <input
            type="text"
            placeholder="Enter custom strength (e.g., 750mg)"
            value={customStrength}
            onChange={(e) => setCustomStrength(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomStrengthAdd()}
            style={inputStyles}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.neutral[300];
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCustomStrengthAdd}
            disabled={!customStrength.trim() || selectedStrengths.length >= maxSelections}
          >
            Add
          </Button>
        </div>
      )}

      {selectedStrengths.length > 0 && (
        <div style={selectedStrengthsStyles}>
          <div style={{ fontSize: '12px', color: colors.neutral[600], fontWeight: 500 }}>
            Selected:
          </div>
          {selectedStrengths.map((strength) => (
            <Badge
              key={strength}
              variant="primary"
              size="sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                cursor: 'pointer'
              }}
              onClick={() => handleRemoveStrength(strength)}
            >
              {strength}
              <X size={12} />
            </Badge>
          ))}
        </div>
      )}

      {selectedStrengths.length >= maxSelections && (
        <div style={{
          fontSize: '12px',
          color: colors.warning,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          marginTop: spacing.xs
        }}>
          <Filter size={12} />
          Maximum {maxSelections} strengths selected
        </div>
      )}
    </div>
  );
};

// Default strength options
export const defaultStrengths: StrengthOption[] = [
  { value: '250mg', label: '250mg', dosage: 250, unit: 'mg' },
  { value: '500mg', label: '500mg', dosage: 500, unit: 'mg' },
  { value: '650mg', label: '650mg', dosage: 650, unit: 'mg' },
  { value: '1000mg', label: '1000mg', dosage: 1000, unit: 'mg' },
  { value: '5ml', label: '5ml', dosage: 5, unit: 'ml' },
  { value: '10ml', label: '10ml', dosage: 10, unit: 'ml' },
  { value: '15ml', label: '15ml', dosage: 15, unit: 'ml' },
  { value: '30ml', label: '30ml', dosage: 30, unit: 'ml' },
  { value: '100mcg', label: '100mcg', dosage: 100, unit: 'mcg' },
  { value: '250mcg', label: '250mcg', dosage: 250, unit: 'mcg' },
  { value: '500mcg', label: '500mcg', dosage: 500, unit: 'mcg' },
  { value: '1g', label: '1g', dosage: 1, unit: 'g' }
];

// Compact version for smaller spaces
export const CompactStrengthFilter: React.FC<StrengthFilterProps> = (props) => (
  <StrengthFilter
    {...props}
    showCustomInput={false}
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);

// Strength filter with pills display
export const StrengthPills: React.FC<{
  selectedStrengths: string[];
  onStrengthsChange: (strengths: string[]) => void;
  availableStrengths?: StrengthOption[];
  maxSelections?: number;
  style?: React.CSSProperties;
}> = ({
  selectedStrengths,
  onStrengthsChange,
  availableStrengths = defaultStrengths,
  maxSelections = 3,
  style
}) => {
  const handleStrengthToggle = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      onStrengthsChange(selectedStrengths.filter(s => s !== strength));
    } else if (selectedStrengths.length < maxSelections) {
      onStrengthsChange([...selectedStrengths, strength]);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    ...style
  };

  const pillStyles = (strength: string): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    border: `1px solid ${selectedStrengths.includes(strength) ? colors.primary : colors.neutral[300]}`,
    background: selectedStrengths.includes(strength) ? colors.primary : 'transparent',
    color: selectedStrengths.includes(strength) ? 'white' : colors.neutral[600],
    cursor: selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength) ? 'not-allowed' : 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    opacity: selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength) ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  });

  return (
    <div style={containerStyles}>
      {availableStrengths.slice(0, 8).map((strength) => (
        <button
          key={strength.value}
          style={pillStyles(strength.value)}
          onClick={() => handleStrengthToggle(strength.value)}
          disabled={selectedStrengths.length >= maxSelections && !selectedStrengths.includes(strength.value)}
        >
          <Pill size={10} />
          {strength.label}
        </button>
      ))}
    </div>
  );
};
