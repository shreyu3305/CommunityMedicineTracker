import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';

export interface HighContrastColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  border: string;
  shadow: string;
}

export interface HighContrastModeProps {
  children: React.ReactNode;
  enabled?: boolean;
  variant?: 'default' | 'dark' | 'light' | 'custom';
  customColors?: Partial<HighContrastColors>;
  style?: React.CSSProperties;
}

// High contrast color schemes
export const highContrastSchemes = {
  default: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#0000ff',
    secondary: '#800080',
    accent: '#ff0000',
    success: '#008000',
    warning: '#ffa500',
    error: '#ff0000',
    neutral: {
      50: '#ffffff',
      100: '#f0f0f0',
      200: '#e0e0e0',
      300: '#c0c0c0',
      400: '#a0a0a0',
      500: '#808080',
      600: '#606060',
      700: '#404040',
      800: '#202020',
      900: '#000000'
    },
    border: '#000000',
    shadow: '#000000'
  },
  dark: {
    background: '#000000',
    foreground: '#ffffff',
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    success: '#00ff00',
    warning: '#ff8000',
    error: '#ff0000',
    neutral: {
      50: '#000000',
      100: '#1a1a1a',
      200: '#333333',
      300: '#4d4d4d',
      400: '#666666',
      500: '#808080',
      600: '#999999',
      700: '#b3b3b3',
      800: '#cccccc',
      900: '#ffffff'
    },
    border: '#ffffff',
    shadow: '#ffffff'
  },
  light: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#000080',
    secondary: '#800080',
    accent: '#800000',
    success: '#008000',
    warning: '#ff8000',
    error: '#800000',
    neutral: {
      50: '#ffffff',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d5d5d5',
      400: '#c5c5c5',
      500: '#b5b5b5',
      600: '#a5a5a5',
      700: '#959595',
      800: '#858585',
      900: '#000000'
    },
    border: '#000000',
    shadow: '#000000'
  }
};

// Context for high contrast mode
interface HighContrastContextType {
  isEnabled: boolean;
  variant: 'default' | 'dark' | 'light' | 'custom';
  colors: HighContrastColors;
  toggle: () => void;
  setVariant: (variant: 'default' | 'dark' | 'light' | 'custom') => void;
  setCustomColors: (colors: Partial<HighContrastColors>) => void;
}

const HighContrastContext = createContext<HighContrastContextType | undefined>(undefined);

export const useHighContrast = () => {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within a HighContrastProvider');
  }
  return context;
};

export const HighContrastProvider: React.FC<{
  children: React.ReactNode;
  defaultEnabled?: boolean;
  defaultVariant?: 'default' | 'dark' | 'light' | 'custom';
  customColors?: Partial<HighContrastColors>;
}> = ({ children, defaultEnabled = false, defaultVariant = 'default', customColors }) => {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [variant, setVariant] = useState<'default' | 'dark' | 'light' | 'custom'>(defaultVariant);
  const [colors, setColors] = useState<HighContrastColors>(() => {
    if (variant === 'custom' && customColors) {
      return { ...highContrastSchemes.default, ...customColors };
    }
    return highContrastSchemes[variant];
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('highContrastMode');
    if (saved) {
      const { enabled, variant: savedVariant, colors: savedColors } = JSON.parse(saved);
      setIsEnabled(enabled);
      setVariant(savedVariant);
      if (savedColors) {
        setColors(savedColors);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('highContrastMode', JSON.stringify({
      enabled: isEnabled,
      variant,
      colors
    }));
  }, [isEnabled, variant, colors]);

  // Apply high contrast styles to document
  useEffect(() => {
    if (isEnabled) {
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      style.textContent = `
        :root {
          --hc-background: ${colors.background};
          --hc-foreground: ${colors.foreground};
          --hc-primary: ${colors.primary};
          --hc-secondary: ${colors.secondary};
          --hc-accent: ${colors.accent};
          --hc-success: ${colors.success};
          --hc-warning: ${colors.warning};
          --hc-error: ${colors.error};
          --hc-border: ${colors.border};
          --hc-shadow: ${colors.shadow};
        }
        
        .high-contrast {
          background-color: ${colors.background} !important;
          color: ${colors.foreground} !important;
          border-color: ${colors.border} !important;
        }
        
        .high-contrast * {
          background-color: inherit !important;
          color: inherit !important;
          border-color: ${colors.border} !important;
          box-shadow: none !important;
        }
        
        .high-contrast button,
        .high-contrast input,
        .high-contrast select,
        .high-contrast textarea {
          background-color: ${colors.background} !important;
          color: ${colors.foreground} !important;
          border: 2px solid ${colors.border} !important;
        }
        
        .high-contrast button:hover,
        .high-contrast input:hover,
        .high-contrast select:hover,
        .high-contrast textarea:hover {
          background-color: ${colors.primary} !important;
          color: ${colors.background} !important;
        }
        
        .high-contrast button:focus,
        .high-contrast input:focus,
        .high-contrast select:focus,
        .high-contrast textarea:focus {
          outline: 3px solid ${colors.accent} !important;
          outline-offset: 2px !important;
        }
        
        .high-contrast a {
          color: ${colors.primary} !important;
          text-decoration: underline !important;
        }
        
        .high-contrast a:hover {
          color: ${colors.accent} !important;
        }
        
        .high-contrast .primary {
          background-color: ${colors.primary} !important;
          color: ${colors.background} !important;
        }
        
        .high-contrast .secondary {
          background-color: ${colors.secondary} !important;
          color: ${colors.background} !important;
        }
        
        .high-contrast .success {
          background-color: ${colors.success} !important;
          color: ${colors.background} !important;
        }
        
        .high-contrast .warning {
          background-color: ${colors.warning} !important;
          color: ${colors.background} !important;
        }
        
        .high-contrast .error {
          background-color: ${colors.error} !important;
          color: ${colors.background} !important;
        }
      `;
      document.head.appendChild(style);
      
      // Add class to body
      document.body.classList.add('high-contrast');
      
      return () => {
        const existingStyle = document.getElementById('high-contrast-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
        document.body.classList.remove('high-contrast');
      };
    } else {
      const existingStyle = document.getElementById('high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      document.body.classList.remove('high-contrast');
    }
  }, [isEnabled, colors]);

  const toggle = () => setIsEnabled(prev => !prev);

  const handleSetVariant = (newVariant: 'default' | 'dark' | 'light' | 'custom') => {
    setVariant(newVariant);
    if (newVariant === 'custom' && customColors) {
      setColors({ ...highContrastSchemes.default, ...customColors });
    } else {
      setColors(highContrastSchemes[newVariant]);
    }
  };

  const handleSetCustomColors = (newColors: Partial<HighContrastColors>) => {
    setColors(prev => ({ ...prev, ...newColors }));
  };

  return (
    <HighContrastContext.Provider
      value={{
        isEnabled,
        variant,
        colors,
        toggle,
        setVariant: handleSetVariant,
        setCustomColors: handleSetCustomColors
      }}
    >
      {children}
    </HighContrastContext.Provider>
  );
};

export const HighContrastMode: React.FC<HighContrastModeProps> = ({
  children,
  enabled = false,
  variant = 'default',
  customColors,
  style
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [colors, setColors] = useState<HighContrastColors>(() => {
    if (variant === 'custom' && customColors) {
      return { ...highContrastSchemes.default, ...customColors };
    }
    return highContrastSchemes[variant];
  });

  // Apply high contrast styles
  useEffect(() => {
    if (isEnabled) {
      const style = document.createElement('style');
      style.id = 'high-contrast-mode-styles';
      style.textContent = `
        .high-contrast-mode {
          background-color: ${colors.background} !important;
          color: ${colors.foreground} !important;
          border-color: ${colors.border} !important;
        }
        
        .high-contrast-mode * {
          background-color: inherit !important;
          color: inherit !important;
          border-color: ${colors.border} !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('high-contrast-mode-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [isEnabled, colors]);

  const containerStyles: React.CSSProperties = {
    ...style,
    ...(isEnabled && {
      backgroundColor: colors.background,
      color: colors.foreground,
      border: `2px solid ${colors.border}`
    })
  };

  return (
    <div
      className={isEnabled ? 'high-contrast-mode' : ''}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

// High contrast toggle component
export const HighContrastToggle: React.FC<{
  variant?: 'button' | 'switch' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}> = ({ variant = 'button', size = 'md', style }) => {
  const { isEnabled, toggle, variant: currentVariant, setVariant } = useHighContrast();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: spacing.xs, fontSize: typography.sizes.xs };
      case 'lg':
        return { padding: spacing.lg, fontSize: typography.sizes.lg };
      default:
        return { padding: spacing.md, fontSize: typography.sizes.md };
    }
  };

  const buttonStyles: React.CSSProperties = {
    ...getSizeStyles(),
    border: '2px solid currentColor',
    borderRadius: borderRadius.md,
    backgroundColor: isEnabled ? colors.primary : 'transparent',
    color: isEnabled ? colors.background : colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...style
  };

  const switchStyles: React.CSSProperties = {
    position: 'relative',
    width: '60px',
    height: '30px',
    backgroundColor: isEnabled ? colors.primary : colors.neutral[300],
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...style
  };

  const switchThumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: isEnabled ? '32px' : '2px',
    width: '26px',
    height: '26px',
    backgroundColor: colors.background,
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'relative',
    ...style
  };

  const [showDropdown, setShowDropdown] = useState(false);

  if (variant === 'switch') {
    return (
      <div style={switchStyles} onClick={toggle}>
        <div style={switchThumbStyles} />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div style={dropdownStyles}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={buttonStyles}
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          High Contrast {isEnabled ? 'ON' : 'OFF'} ▼
        </button>
        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: colors.background,
              border: `2px solid ${colors.border}`,
              borderRadius: borderRadius.md,
              boxShadow: shadows.lg,
              zIndex: 1000
            }}
          >
            {Object.keys(highContrastSchemes).map((scheme) => (
              <button
                key={scheme}
                onClick={() => {
                  setVariant(scheme as 'default' | 'dark' | 'light');
                  setShowDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  border: 'none',
                  backgroundColor: currentVariant === scheme ? colors.primary : 'transparent',
                  color: currentVariant === scheme ? colors.background : colors.foreground,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      style={buttonStyles}
      aria-pressed={isEnabled}
      aria-label={`Toggle high contrast mode ${isEnabled ? 'off' : 'on'}`}
    >
      {isEnabled ? 'High Contrast ON' : 'High Contrast OFF'}
    </button>
  );
};

// High contrast aware component
export const HighContrastAware: React.FC<{
  children: React.ReactNode;
  fallbackColors?: Partial<HighContrastColors>;
  style?: React.CSSProperties;
}> = ({ children, fallbackColors, style }) => {
  const { isEnabled, colors } = useHighContrast();

  const componentStyles: React.CSSProperties = {
    ...style,
    ...(isEnabled && {
      backgroundColor: fallbackColors?.background || colors.background,
      color: fallbackColors?.foreground || colors.foreground,
      border: `2px solid ${fallbackColors?.border || colors.border}`
    })
  };

  return (
    <div style={componentStyles}>
      {children}
    </div>
  );
};

// High contrast text component
export const HighContrastText: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  style?: React.CSSProperties;
}> = ({ children, variant = 'primary', style }) => {
  const { isEnabled, colors } = useHighContrast();

  const getVariantColor = () => {
    if (!isEnabled) return colors.text;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.foreground;
    }
  };

  const textStyles: React.CSSProperties = {
    color: getVariantColor(),
    ...style
  };

  return (
    <span style={textStyles}>
      {children}
    </span>
  );
};

// High contrast button component
export const HighContrastButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, style }) => {
  const { isEnabled, colors } = useHighContrast();

  const getVariantStyles = () => {
    if (!isEnabled) return {};
    
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: colors.background
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: colors.background
        };
      case 'accent':
        return {
          backgroundColor: colors.accent,
          color: colors.background
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.background
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: `${spacing.xs} ${spacing.sm}`, fontSize: typography.sizes.sm };
      case 'lg':
        return { padding: `${spacing.md} ${spacing.lg}`, fontSize: typography.sizes.lg };
      default:
        return { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.sizes.md };
    }
  };

  const buttonStyles: React.CSSProperties = {
    ...getSizeStyles(),
    border: `2px solid ${isEnabled ? colors.border : colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...style
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
    >
      {children}
    </button>
  );
};
