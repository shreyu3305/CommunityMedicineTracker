import React from 'react';
import { Tag, FlaskConical, ToggleLeft, ToggleRight } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export type BrandGenericMode = 'both' | 'brand' | 'generic';

export interface BrandGenericToggleProps {
  mode: BrandGenericMode;
  onModeChange: (mode: BrandGenericMode) => void;
  showLabels?: boolean;
  showIcons?: boolean;
  variant?: 'toggle' | 'buttons' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const BrandGenericToggle: React.FC<BrandGenericToggleProps> = ({
  mode,
  onModeChange,
  showLabels = true,
  showIcons = true,
  variant = 'toggle',
  size = 'md',
  style
}) => {
  const getModeInfo = (mode: BrandGenericMode) => {
    const modeMap = {
      both: {
        label: 'Both',
        icon: <Tag size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
        color: colors.primary,
        description: 'Show both brand and generic names'
      },
      brand: {
        label: 'Brand',
        icon: <Tag size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
        color: colors.info,
        description: 'Show only brand names'
      },
      generic: {
        label: 'Generic',
        icon: <FlaskConical size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />,
        color: colors.success,
        description: 'Show only generic names'
      }
    };
    return modeMap[mode];
  };

  const currentModeInfo = getModeInfo(mode);

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      transition: 'all 0.2s ease'
    };

    switch (variant) {
      case 'toggle':
        return {
          ...baseStyles,
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.lg,
          background: colors.neutral[100],
          border: `1px solid ${colors.neutral[300]}`,
          cursor: 'pointer'
        };
      case 'buttons':
        return {
          ...baseStyles,
          gap: spacing.xs
        };
      case 'segmented':
        return {
          ...baseStyles,
          background: colors.neutral[100],
          borderRadius: borderRadius.lg,
          padding: spacing.xs,
          gap: 0
        };
      default:
        return baseStyles;
    }
  };

  const containerStyles: React.CSSProperties = {
    ...getVariantStyles(),
    ...style
  };

  const handleToggle = () => {
    const nextMode = mode === 'both' ? 'brand' : mode === 'brand' ? 'generic' : 'both';
    onModeChange(nextMode);
  };

  const handleModeSelect = (selectedMode: BrandGenericMode) => {
    onModeChange(selectedMode);
  };

  if (variant === 'toggle') {
    return (
      <div style={containerStyles} onClick={handleToggle}>
        {showIcons && (
          <div style={{ color: currentModeInfo.color }}>
            {currentModeInfo.icon}
          </div>
        )}
        {showLabels && (
          <span style={{
            fontSize: size === 'sm' ? '13px' : size === 'md' ? '14px' : '15px',
            fontWeight: 600,
            color: currentModeInfo.color
          }}>
            {currentModeInfo.label}
          </span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          {mode === 'both' ? (
            <ToggleLeft size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} color={colors.neutral[500]} />
          ) : (
            <ToggleRight size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} color={currentModeInfo.color} />
          )}
        </div>
      </div>
    );
  }

  if (variant === 'buttons') {
    const buttonSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

    return (
      <div style={containerStyles}>
        <Button
          variant={mode === 'both' ? 'primary' : 'outline'}
          size={buttonSize}
          icon={showIcons ? <Tag size={iconSize} /> : undefined}
          onClick={() => handleModeSelect('both')}
          style={{
            borderColor: mode === 'both' ? colors.primary : colors.neutral[300],
            color: mode === 'both' ? 'white' : colors.neutral[700]
          }}
        >
          {showLabels && 'Both'}
        </Button>
        <Button
          variant={mode === 'brand' ? 'primary' : 'outline'}
          size={buttonSize}
          icon={showIcons ? <Tag size={iconSize} /> : undefined}
          onClick={() => handleModeSelect('brand')}
          style={{
            borderColor: mode === 'brand' ? colors.info : colors.neutral[300],
            color: mode === 'brand' ? 'white' : colors.neutral[700]
          }}
        >
          {showLabels && 'Brand'}
        </Button>
        <Button
          variant={mode === 'generic' ? 'primary' : 'outline'}
          size={buttonSize}
          icon={showIcons ? <FlaskConical size={iconSize} /> : undefined}
          onClick={() => handleModeSelect('generic')}
          style={{
            borderColor: mode === 'generic' ? colors.success : colors.neutral[300],
            color: mode === 'generic' ? 'white' : colors.neutral[700]
          }}
        >
          {showLabels && 'Generic'}
        </Button>
      </div>
    );
  }

  if (variant === 'segmented') {
    const segmentStyles = (segmentMode: BrandGenericMode): React.CSSProperties => ({
      flex: 1,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      border: 'none',
      background: mode === segmentMode ? 'white' : 'transparent',
      color: mode === segmentMode ? colors.neutral[800] : colors.neutral[600],
      cursor: 'pointer',
      fontSize: size === 'sm' ? '12px' : size === 'md' ? '13px' : '14px',
      fontWeight: mode === segmentMode ? 600 : 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      transition: 'all 0.2s ease',
      boxShadow: mode === segmentMode ? shadows.sm : 'none'
    });

    return (
      <div style={containerStyles}>
        <button
          style={segmentStyles('both')}
          onClick={() => handleModeSelect('both')}
        >
          {showIcons && <Tag size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
          {showLabels && 'Both'}
        </button>
        <button
          style={segmentStyles('brand')}
          onClick={() => handleModeSelect('brand')}
        >
          {showIcons && <Tag size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
          {showLabels && 'Brand'}
        </button>
        <button
          style={segmentStyles('generic')}
          onClick={() => handleModeSelect('generic')}
        >
          {showIcons && <FlaskConical size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
          {showLabels && 'Generic'}
        </button>
      </div>
    );
  }

  return null;
};

// Compact version for small spaces
export const CompactBrandGenericToggle: React.FC<BrandGenericToggleProps> = (props) => (
  <BrandGenericToggle
    {...props}
    size="sm"
    showLabels={false}
    variant="segmented"
    style={{
      ...props.style,
      padding: spacing.xs
    }}
  />
);

// Icon-only version
export const BrandGenericIconToggle: React.FC<{
  mode: BrandGenericMode;
  onModeChange: (mode: BrandGenericMode) => void;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}> = ({ mode, onModeChange, size = 'md', style }) => {
  const handleToggle = () => {
    const nextMode = mode === 'both' ? 'brand' : mode === 'brand' ? 'generic' : 'both';
    onModeChange(nextMode);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'both':
        return <Tag size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={colors.primary} />;
      case 'brand':
        return <Tag size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={colors.info} />;
      case 'generic':
        return <FlaskConical size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={colors.success} />;
      default:
        return <Tag size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={colors.neutral[500]} />;
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.neutral[100];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
      title={`Current mode: ${mode}. Click to cycle through both → brand → generic → both`}
    >
      {getModeIcon()}
    </button>
  );
};

// Status indicator showing current mode
export const BrandGenericStatus: React.FC<{
  mode: BrandGenericMode;
  style?: React.CSSProperties;
}> = ({ mode, style }) => {
  const getModeInfo = (mode: BrandGenericMode) => {
    const modeMap = {
      both: {
        label: 'Both Names',
        icon: <Tag size={14} />,
        color: colors.primary,
        description: 'Showing both brand and generic names'
      },
      brand: {
        label: 'Brand Only',
        icon: <Tag size={14} />,
        color: colors.info,
        description: 'Showing only brand names'
      },
      generic: {
        label: 'Generic Only',
        icon: <FlaskConical size={14} />,
        color: colors.success,
        description: 'Showing only generic names'
      }
    };
    return modeMap[mode];
  };

  const modeInfo = getModeInfo(mode);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      background: modeInfo.background || colors.neutral[100],
      borderRadius: borderRadius.md,
      fontSize: '12px',
      fontWeight: 500,
      color: modeInfo.color,
      ...style
    }}>
      {modeInfo.icon}
      <span>{modeInfo.label}</span>
    </div>
  );
};
