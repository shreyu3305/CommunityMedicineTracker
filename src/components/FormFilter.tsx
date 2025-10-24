import React from 'react';
import { Pill, Circle, Droplet, Syringe, Eye, Heart, Filter, X } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Badge } from './Badge';

export interface FormOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface FormFilterProps {
  selectedForms: string[];
  onFormsChange: (forms: string[]) => void;
  availableForms?: FormOption[];
  showDescriptions?: boolean;
  maxSelections?: number;
  style?: React.CSSProperties;
}

export const FormFilter: React.FC<FormFilterProps> = ({
  selectedForms,
  onFormsChange,
  availableForms = defaultForms,
  showDescriptions = true,
  maxSelections = 4,
  style
}) => {
  const handleFormToggle = (form: string) => {
    if (selectedForms.includes(form)) {
      onFormsChange(selectedForms.filter(f => f !== form));
    } else if (selectedForms.length < maxSelections) {
      onFormsChange([...selectedForms, form]);
    }
  };

  const handleRemoveForm = (form: string) => {
    onFormsChange(selectedForms.filter(f => f !== form));
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: spacing.sm
  };

  const formButtonStyles = (form: string): React.CSSProperties => ({
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    border: `2px solid ${selectedForms.includes(form) ? colors.primary : colors.neutral[300]}`,
    background: selectedForms.includes(form) ? colors.primary + '15' : 'transparent',
    color: selectedForms.includes(form) ? colors.primary : colors.neutral[700],
    cursor: selectedForms.length >= maxSelections && !selectedForms.includes(form) ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'center',
    transition: 'all 0.2s ease',
    opacity: selectedForms.length >= maxSelections && !selectedForms.includes(form) ? 0.5 : 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: '80px',
    justifyContent: 'center'
  });

  const selectedFormsStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={titleStyles}>
          <Filter size={18} color={colors.primary} />
          Form Filter
        </div>
        {selectedForms.length > 0 && (
          <Badge variant="primary" size="sm">
            {selectedForms.length} selected
          </Badge>
        )}
      </div>

      <div style={gridStyles}>
        {availableForms.map((form) => (
          <button
            key={form.value}
            style={formButtonStyles(form.value)}
            onClick={() => handleFormToggle(form.value)}
            disabled={selectedForms.length >= maxSelections && !selectedForms.includes(form.value)}
            onMouseEnter={(e) => {
              if (selectedForms.length < maxSelections || selectedForms.includes(form.value)) {
                e.currentTarget.style.background = selectedForms.includes(form.value) 
                  ? colors.primary + '25' 
                  : colors.neutral[100];
                e.currentTarget.style.borderColor = selectedForms.includes(form.value) 
                  ? colors.primary 
                  : colors.neutral[400];
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = selectedForms.includes(form.value) 
                ? colors.primary + '15' 
                : 'transparent';
              e.currentTarget.style.borderColor = selectedForms.includes(form.value) 
                ? colors.primary 
                : colors.neutral[300];
            }}
            title={showDescriptions ? form.description : undefined}
          >
            <div style={{ color: 'inherit' }}>
              {form.icon}
            </div>
            <div>{form.label}</div>
          </button>
        ))}
      </div>

      {selectedForms.length > 0 && (
        <div style={selectedFormsStyles}>
          <div style={{ fontSize: '12px', color: colors.neutral[600], fontWeight: 500 }}>
            Selected:
          </div>
          {selectedForms.map((form) => {
            const formOption = availableForms.find(f => f.value === form);
            return (
              <Badge
                key={form}
                variant="primary"
                size="sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  cursor: 'pointer'
                }}
                onClick={() => handleRemoveForm(form)}
              >
                {formOption?.icon}
                {formOption?.label}
                <X size={12} />
              </Badge>
            );
          })}
        </div>
      )}

      {selectedForms.length >= maxSelections && (
        <div style={{
          fontSize: '12px',
          color: colors.warning,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          marginTop: spacing.xs
        }}>
          <Filter size={12} />
          Maximum {maxSelections} forms selected
        </div>
      )}
    </div>
  );
};

// Default form options
export const defaultForms: FormOption[] = [
  {
    value: 'tablet',
    label: 'Tablet',
    icon: <Pill size={20} />,
    description: 'Solid dosage form, usually round or oval'
  },
  {
    value: 'capsule',
    label: 'Capsule',
    icon: <Circle size={20} />,
    description: 'Gelatin shell containing powder or liquid'
  },
  {
    value: 'syrup',
    label: 'Syrup',
    icon: <Droplet size={20} />,
    description: 'Liquid medicine with sweet taste'
  },
  {
    value: 'injection',
    label: 'Injection',
    icon: <Syringe size={20} />,
    description: 'Sterile liquid for injection'
  },
  {
    value: 'cream',
    label: 'Cream',
    icon: <Eye size={20} />,
    description: 'Semi-solid topical preparation'
  },
  {
    value: 'drops',
    label: 'Drops',
    icon: <Droplet size={20} />,
    description: 'Liquid drops for eyes, ears, or nose'
  },
  {
    value: 'inhaler',
    label: 'Inhaler',
    icon: <Heart size={20} />,
    description: 'Device for delivering medicine to lungs'
  },
  {
    value: 'other',
    label: 'Other',
    icon: <Pill size={20} />,
    description: 'Other dosage forms'
  }
];

// Compact version for smaller spaces
export const CompactFormFilter: React.FC<FormFilterProps> = (props) => (
  <FormFilter
    {...props}
    showDescriptions={false}
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);

// Form filter with pills display
export const FormPills: React.FC<{
  selectedForms: string[];
  onFormsChange: (forms: string[]) => void;
  availableForms?: FormOption[];
  maxSelections?: number;
  style?: React.CSSProperties;
}> = ({
  selectedForms,
  onFormsChange,
  availableForms = defaultForms,
  maxSelections = 3,
  style
}) => {
  const handleFormToggle = (form: string) => {
    if (selectedForms.includes(form)) {
      onFormsChange(selectedForms.filter(f => f !== form));
    } else if (selectedForms.length < maxSelections) {
      onFormsChange([...selectedForms, form]);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    ...style
  };

  const pillStyles = (form: string): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    border: `1px solid ${selectedForms.includes(form) ? colors.primary : colors.neutral[300]}`,
    background: selectedForms.includes(form) ? colors.primary : 'transparent',
    color: selectedForms.includes(form) ? 'white' : colors.neutral[600],
    cursor: selectedForms.length >= maxSelections && !selectedForms.includes(form) ? 'not-allowed' : 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    opacity: selectedForms.length >= maxSelections && !selectedForms.includes(form) ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  });

  return (
    <div style={containerStyles}>
      {availableForms.slice(0, 6).map((form) => (
        <button
          key={form.value}
          style={pillStyles(form.value)}
          onClick={() => handleFormToggle(form.value)}
          disabled={selectedForms.length >= maxSelections && !selectedForms.includes(form.value)}
        >
          {form.icon}
          {form.label}
        </button>
      ))}
    </div>
  );
};
