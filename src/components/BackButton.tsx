import React from 'react';
import { ArrowLeft, ChevronLeft, Home, History } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export interface BackButtonProps {
  onClick?: () => void;
  variant?: 'button' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  icon?: 'arrow' | 'chevron' | 'home' | 'history';
  style?: React.CSSProperties;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  variant = 'button',
  size = 'md',
  showLabel = true,
  label = 'Back',
  icon = 'arrow',
  style
}) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
    
    switch (icon) {
      case 'arrow':
        return <ArrowLeft size={iconSize} />;
      case 'chevron':
        return <ChevronLeft size={iconSize} />;
      case 'home':
        return <Home size={iconSize} />;
      case 'history':
        return <History size={iconSize} />;
      default:
        return <ArrowLeft size={iconSize} />;
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      fontFamily: 'inherit'
    };

    const sizes = {
      sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: '12px' },
      md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: '14px' },
      lg: { padding: `${spacing.md} ${spacing.lg}`, fontSize: '16px' }
    };

    switch (variant) {
      case 'button':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'white',
          color: colors.neutral[700],
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: borderRadius.md,
          fontWeight: 500,
          boxShadow: shadows.sm
        };
      case 'link':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'transparent',
          color: colors.primary,
          textDecoration: 'underline',
          fontWeight: 500
        };
      case 'icon':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'transparent',
          color: colors.neutral[600],
          padding: `${spacing.xs} ${spacing.sm}`
        };
      default:
        return baseStyles;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - go back in browser history
      window.history.back();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    
    switch (variant) {
      case 'button':
        target.style.transform = 'translateY(-1px)';
        target.style.boxShadow = shadows.md;
        target.style.borderColor = colors.primary;
        break;
      case 'link':
        target.style.color = colors.primary + 'E6';
        break;
      case 'icon':
        target.style.color = colors.primary;
        target.style.background = colors.primary + '10';
        break;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    
    switch (variant) {
      case 'button':
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = shadows.sm;
        target.style.borderColor = colors.neutral[300];
        break;
      case 'link':
        target.style.color = colors.primary;
        break;
      case 'icon':
        target.style.color = colors.neutral[600];
        target.style.background = 'transparent';
        break;
    }
  };

  return (
    <button
      style={getVariantStyles()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIcon()}
      {showLabel && <span>{label}</span>}
    </button>
  );
};

// Breadcrumb-style back button
export const BreadcrumbBackButton: React.FC<BackButtonProps> = (props) => (
  <BackButton
    {...props}
    variant="link"
    icon="chevron"
    size="sm"
    style={{
      ...props.style,
      color: colors.neutral[500],
      textDecoration: 'none'
    }}
  />
);

// Header-style back button
export const HeaderBackButton: React.FC<BackButtonProps> = (props) => (
  <BackButton
    {...props}
    variant="icon"
    showLabel={false}
    size="md"
    style={{
      ...props.style,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      background: colors.neutral[100],
      color: colors.neutral[600]
    }}
  />
);

// Navigation back button with history
export const NavigationBackButton: React.FC<{
  onBack?: () => void;
  onHome?: () => void;
  showHome?: boolean;
  style?: React.CSSProperties;
}> = ({ onBack, onHome, showHome = true, style }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      ...style
    }}>
      <BackButton
        onClick={handleBack}
        variant="button"
        size="sm"
        label="Back"
      />
      {showHome && (
        <Button
          variant="outline"
          size="sm"
          icon={<Home size={16} />}
          onClick={handleHome}
        >
          Home
        </Button>
      )}
    </div>
  );
};

// Smart back button that adapts based on history
export const SmartBackButton: React.FC<{
  fallbackUrl?: string;
  fallbackLabel?: string;
  style?: React.CSSProperties;
}> = ({ fallbackUrl = '/', fallbackLabel = 'Home', style }) => {
  const [canGoBack, setCanGoBack] = React.useState(false);

  React.useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleClick = () => {
    if (canGoBack) {
      window.history.back();
    } else {
      window.location.href = fallbackUrl;
    }
  };

  return (
    <BackButton
      onClick={handleClick}
      variant="button"
      size="md"
      label={canGoBack ? 'Back' : fallbackLabel}
      icon={canGoBack ? 'arrow' : 'home'}
      style={style}
    />
  );
};

// Context-aware back button
export const ContextBackButton: React.FC<{
  context?: string;
  onBack?: () => void;
  style?: React.CSSProperties;
}> = ({ context, onBack, style }) => {
  const getContextLabel = () => {
    switch (context) {
      case 'search':
        return 'Back to Search';
      case 'pharmacy':
        return 'Back to Results';
      case 'medicine':
        return 'Back to Pharmacy';
      case 'profile':
        return 'Back to Profile';
      default:
        return 'Back';
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case 'search':
        return 'arrow';
      case 'pharmacy':
        return 'chevron';
      case 'medicine':
        return 'chevron';
      case 'profile':
        return 'arrow';
      default:
        return 'arrow';
    }
  };

  return (
    <BackButton
      onClick={onBack}
      variant="button"
      size="md"
      label={getContextLabel()}
      icon={getContextIcon() as any}
      style={style}
    />
  );
};
