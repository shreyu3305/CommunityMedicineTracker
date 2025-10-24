import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpDown, MapPin, Shield, Type } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type SortOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
  direction: 'asc' | 'desc';
};

interface SortDropdownProps {
  options: SortOption[];
  selectedOption: SortOption | null;
  onSelect: (option: SortOption) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  placeholder = 'Sort by',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: '160px'
  };

  const triggerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'white',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    minWidth: '160px',
    fontSize: '14px',
    fontWeight: 500,
    color: selectedOption ? colors.neutral[900] : colors.neutral[500]
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    border: `2px solid ${colors.primary}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.lg,
    zIndex: 1000,
    marginTop: spacing.xs,
    overflow: 'hidden',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
    transition: 'all 0.2s ease',
    minHeight: isOpen ? '200px' : '0px'
  };

  const optionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    color: colors.neutral[700],
    borderBottom: `1px solid ${colors.neutral[100]}`
  };

  const selectedOptionStyles: React.CSSProperties = {
    ...optionStyles,
    background: `${colors.primary}10`,
    color: colors.primary,
    fontWeight: 600
  };

  const handleOptionClick = (option: SortOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  const getSortIcon = (direction: 'asc' | 'desc') => {
    return direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div ref={dropdownRef} style={containerStyles}>
      <div
        style={triggerStyles}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('SortDropdown clicked, disabled:', disabled, 'isOpen:', isOpen);
          !disabled && setIsOpen(!isOpen);
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = colors.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = colors.neutral[300];
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {getSortIcon(selectedOption.direction)}
              </span>
            </>
          ) : (
            <>
              <ArrowUpDown size={16} color={colors.neutral[400]} />
              <span>{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown 
          size={16} 
          color={colors.neutral[400]} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </div>

      <div style={dropdownStyles}>
        {isOpen && (
          <div style={{ padding: '8px', background: '#f0f0f0', fontSize: '12px', color: '#666' }}>
            Debug: Dropdown is open
          </div>
        )}
        {options.map((option, _index) => (
          <div
            key={`${option.value}-${option.direction}`}
            style={selectedOption?.value === option.value && selectedOption?.direction === option.direction 
              ? selectedOptionStyles 
              : optionStyles
            }
            onClick={() => handleOptionClick(option)}
            onMouseEnter={(e) => {
              if (selectedOption?.value !== option.value || selectedOption?.direction !== option.direction) {
                e.currentTarget.style.background = colors.neutral[50];
              }
            }}
            onMouseLeave={(e) => {
              if (selectedOption?.value !== option.value || selectedOption?.direction !== option.direction) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {option.icon}
            <span style={{ flex: 1 }}>{option.label}</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>
              {getSortIcon(option.direction)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pre-defined sort options for pharmacies
export const pharmacySortOptions: SortOption[] = [
  {
    value: 'distance',
    label: 'Distance',
    icon: <MapPin size={16} color={colors.neutral[600]} />,
    direction: 'asc'
  },
  {
    value: 'distance',
    label: 'Distance',
    icon: <MapPin size={16} color={colors.neutral[600]} />,
    direction: 'desc'
  },
  {
    value: 'confidence',
    label: 'Trust Score',
    icon: <Shield size={16} color={colors.neutral[600]} />,
    direction: 'desc'
  },
  {
    value: 'confidence',
    label: 'Trust Score',
    icon: <Shield size={16} color={colors.neutral[600]} />,
    direction: 'asc'
  },
  {
    value: 'name',
    label: 'Name',
    icon: <Type size={16} color={colors.neutral[600]} />,
    direction: 'asc'
  },
  {
    value: 'name',
    label: 'Name',
    icon: <Type size={16} color={colors.neutral[600]} />,
    direction: 'desc'
  },
  {
    value: 'lastUpdated',
    label: 'Recently Updated',
    icon: <ArrowUpDown size={16} color={colors.neutral[600]} />,
    direction: 'desc'
  },
  {
    value: 'lastUpdated',
    label: 'Recently Updated',
    icon: <ArrowUpDown size={16} color={colors.neutral[600]} />,
    direction: 'asc'
  }
];
