import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface DistanceSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: 'km' | 'miles';
  showLabels?: boolean;
  showCurrentValue?: boolean;
  presetValues?: number[];
  style?: React.CSSProperties;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 50,
  step = 1,
  unit = 'km',
  showLabels = true,
  showCurrentValue = true,
  presetValues = [5, 10, 20, 30],
  style
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const getPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    ...style
  };

  const sliderContainerStyles: React.CSSProperties = {
    position: 'relative',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const trackStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '6px',
    background: colors.neutral[200],
    borderRadius: borderRadius.full,
    transform: 'translateY(-50%)'
  };

  const fillStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: '6px',
    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary}80 100%)`,
    borderRadius: borderRadius.full,
    transform: 'translateY(-50%)',
    width: `${getPercentage()}%`,
    transition: isDragging ? 'none' : 'width 0.2s ease'
  };

  const thumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: `${getPercentage()}%`,
    width: '20px',
    height: '20px',
    background: 'white',
    border: `3px solid ${colors.primary}`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'grab',
    boxShadow: shadows.md,
    transition: isDragging ? 'none' : 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  };

  const thumbHoverStyles: React.CSSProperties = {
    ...thumbStyles,
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: shadows.lg
  };

  const labelsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.neutral[600],
    fontWeight: 500
  };

  const currentValueStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  };

  const presetButtonsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    marginTop: spacing.sm
  };

  const presetButtonStyles = (presetValue: number): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: borderRadius.md,
    border: `1px solid ${value === presetValue ? colors.primary : colors.neutral[300]}`,
    background: value === presetValue ? colors.primary + '15' : 'transparent',
    color: value === presetValue ? colors.primary : colors.neutral[600],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  });

  const formatValue = (val: number) => {
    if (unit === 'miles') {
      return `${val} mi`;
    }
    return `${val} km`;
  };

  return (
    <div style={containerStyles}>
      {showCurrentValue && (
        <div style={currentValueStyles}>
          <Navigation size={16} />
          <span>Search radius: {formatValue(value)}</span>
        </div>
      )}

      <div style={sliderContainerStyles} ref={sliderRef} onMouseDown={handleMouseDown}>
        <div style={trackStyles} />
        <div style={fillStyles} />
        <div 
          ref={thumbRef}
          style={isDragging ? thumbHoverStyles : thumbStyles}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>

      {showLabels && (
        <div style={labelsContainerStyles}>
          <span style={labelStyles}>{formatValue(min)}</span>
          <span style={labelStyles}>{formatValue(max)}</span>
        </div>
      )}

      {presetValues.length > 0 && (
        <div style={presetButtonsStyles}>
          {presetValues.map((presetValue) => (
            <button
              key={presetValue}
              style={presetButtonStyles(presetValue)}
              onClick={() => onChange(presetValue)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = value === presetValue 
                  ? colors.primary + '25' 
                  : colors.neutral[100];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = value === presetValue 
                  ? colors.primary + '15' 
                  : 'transparent';
              }}
            >
              <MapPin size={12} />
              {formatValue(presetValue)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactDistanceSlider: React.FC<DistanceSliderProps> = (props) => (
  <DistanceSlider
    {...props}
    showLabels={false}
    presetValues={props.presetValues || [5, 10, 20]}
    style={{
      ...props.style,
      gap: spacing.xs
    }}
  />
);

// Distance slider with preset buttons only
export const DistancePresets: React.FC<{
  value: number;
  onChange: (value: number) => void;
  presets?: number[];
  unit?: 'km' | 'miles';
  style?: React.CSSProperties;
}> = ({ 
  value, 
  onChange, 
  presets = [5, 10, 20, 30], 
  unit = 'km',
  style 
}) => {
  const formatValue = (val: number) => {
    if (unit === 'miles') {
      return `${val} mi`;
    }
    return `${val} km`;
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    ...style
  };

  const buttonStyles = (presetValue: number): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: borderRadius.md,
    border: `2px solid ${value === presetValue ? colors.primary : colors.neutral[300]}`,
    background: value === presetValue ? colors.primary : 'transparent',
    color: value === presetValue ? 'white' : colors.neutral[600],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  });

  return (
    <div style={containerStyles}>
      {presets.map((presetValue) => (
        <button
          key={presetValue}
          style={buttonStyles(presetValue)}
          onClick={() => onChange(presetValue)}
          onMouseEnter={(e) => {
            if (value !== presetValue) {
              e.currentTarget.style.background = colors.primary + '15';
              e.currentTarget.style.borderColor = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (value !== presetValue) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = colors.neutral[300];
            }
          }}
        >
          <MapPin size={14} />
          {formatValue(presetValue)}
        </button>
      ))}
    </div>
  );
};
