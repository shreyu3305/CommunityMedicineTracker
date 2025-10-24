import React, { useState, useEffect } from 'react';
import { Type, Minus, Plus, RotateCcw } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface FontSizeAdjusterProps {
  fontSize?: FontSize;
  onFontSizeChange?: (fontSize: FontSize) => void;
  variant?: 'button' | 'slider' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPreview?: boolean;
  style?: React.CSSProperties;
}

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  fontSize: controlledFontSize,
  onFontSizeChange,
  variant = 'button',
  size = 'md',
  showLabel = true,
  showPreview = true,
  style
}) => {
  const [currentFontSize, setCurrentFontSize] = useState<FontSize>('md');

  const fontSize = controlledFontSize || currentFontSize;

  // Load saved font size from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('app-font-size') as FontSize;
    if (savedFontSize && !controlledFontSize) {
      setCurrentFontSize(savedFontSize);
    }
  }, [controlledFontSize]);

  // Save font size to localStorage
  useEffect(() => {
    if (!controlledFontSize) {
      localStorage.setItem('app-font-size', fontSize);
    }
  }, [fontSize, controlledFontSize]);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px'
    };
    
    root.style.fontSize = fontSizes[fontSize];
    root.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const handleFontSizeChange = (newFontSize: FontSize) => {
    if (!controlledFontSize) {
      setCurrentFontSize(newFontSize);
    }
    onFontSizeChange?.(newFontSize);
  };

  const fontSizes = [
    { value: 'xs' as FontSize, label: 'Extra Small', size: '12px' },
    { value: 'sm' as FontSize, label: 'Small', size: '14px' },
    { value: 'md' as FontSize, label: 'Medium', size: '16px' },
    { value: 'lg' as FontSize, label: 'Large', size: '18px' },
    { value: 'xl' as FontSize, label: 'Extra Large', size: '20px' }
  ];

  const currentSize = fontSizes.find(size => size.value === fontSize) || fontSizes[2];

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
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
          fontWeight: 500
        };
      case 'slider':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'transparent',
          border: 'none',
          color: colors.neutral[600]
        };
      case 'dropdown':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: borderRadius.md,
          boxShadow: shadows.sm,
          position: 'relative' as const
        };
      default:
        return baseStyles;
    }
  };

  const getFontSizeIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
    return <Type size={iconSize} />;
  };

  if (variant === 'dropdown') {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: 'relative', ...style }}>
        <button
          style={getVariantStyles()}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          {getFontSizeIcon()}
          {showLabel && <span>{currentSize.label}</span>}
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: spacing.xs,
            background: 'white',
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: borderRadius.md,
            boxShadow: shadows.lg,
            zIndex: 1000,
            minWidth: '200px'
          }}>
            {fontSizes.map((sizeOption) => (
              <button
                key={sizeOption.value}
                onClick={() => {
                  handleFontSizeChange(sizeOption.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  background: fontSize === sizeOption.value ? colors.primary + '15' : 'transparent',
                  color: fontSize === sizeOption.value ? colors.primary : colors.neutral[700],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontSize: '14px',
                  fontWeight: fontSize === sizeOption.value ? 600 : 500,
                  transition: 'all 0.2s ease',
                  textAlign: 'left' as const
                }}
                onMouseEnter={(e) => {
                  if (fontSize !== sizeOption.value) {
                    e.currentTarget.style.background = colors.neutral[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (fontSize !== sizeOption.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{sizeOption.label}</div>
                  <div style={{ fontSize: '12px', color: colors.neutral[500] }}>
                    {sizeOption.size}
                  </div>
                </div>
                {showPreview && (
                  <div style={{
                    fontSize: sizeOption.size,
                    color: colors.neutral[600],
                    fontWeight: 600
                  }}>
                    Aa
                  </div>
                )}
                {fontSize === sizeOption.value && (
                  <div style={{ color: colors.primary }}>
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  if (variant === 'slider') {
    const handleDecrease = () => {
      const currentIndex = fontSizes.findIndex(size => size.value === fontSize);
      if (currentIndex > 0) {
        handleFontSizeChange(fontSizes[currentIndex - 1].value);
      }
    };

    const handleIncrease = () => {
      const currentIndex = fontSizes.findIndex(size => size.value === fontSize);
      if (currentIndex < fontSizes.length - 1) {
        handleFontSizeChange(fontSizes[currentIndex + 1].value);
      }
    };

    const handleReset = () => {
      handleFontSizeChange('md');
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, ...style }}>
        <button
          onClick={handleDecrease}
          disabled={fontSize === 'xs'}
          style={{
            ...getVariantStyles(),
            opacity: fontSize === 'xs' ? 0.5 : 1,
            cursor: fontSize === 'xs' ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (fontSize !== 'xs') {
              e.currentTarget.style.color = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (fontSize !== 'xs') {
              e.currentTarget.style.color = colors.neutral[600];
            }
          }}
        >
          <Minus size={16} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.md}`,
          background: colors.neutral[50],
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.neutral[200]}`
        }}>
          {getFontSizeIcon()}
          {showLabel && <span>{currentSize.label}</span>}
          {showPreview && (
            <div style={{
              fontSize: currentSize.size,
              color: colors.neutral[600],
              fontWeight: 600
            }}>
              Aa
            </div>
          )}
        </div>

        <button
          onClick={handleIncrease}
          disabled={fontSize === 'xl'}
          style={{
            ...getVariantStyles(),
            opacity: fontSize === 'xl' ? 0.5 : 1,
            cursor: fontSize === 'xl' ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (fontSize !== 'xl') {
              e.currentTarget.style.color = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (fontSize !== 'xl') {
              e.currentTarget.style.color = colors.neutral[600];
            }
          }}
        >
          <Plus size={16} />
        </button>

        <button
          onClick={handleReset}
          style={{
            ...getVariantStyles(),
            color: colors.neutral[500]
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.neutral[500];
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    );
  }

  // Button variant
  const handleClick = () => {
    const currentIndex = fontSizes.findIndex(size => size.value === fontSize);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    handleFontSizeChange(fontSizes[nextIndex].value);
  };

  return (
    <button
      style={getVariantStyles()}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {getFontSizeIcon()}
      {showLabel && <span>{currentSize.label}</span>}
      {showPreview && (
        <div style={{
          fontSize: currentSize.size,
          color: colors.neutral[600],
          fontWeight: 600
        }}>
          Aa
        </div>
      )}
    </button>
  );
};

// Compact version for headers
export const CompactFontSizeAdjuster: React.FC<FontSizeAdjusterProps> = (props) => (
  <FontSizeAdjuster
    {...props}
    size="sm"
    showLabel={false}
    variant="slider"
    style={{
      ...props.style,
      padding: `${spacing.xs} ${spacing.sm}`,
      minWidth: 'auto'
    }}
  />
);

// Font size context for global state
export const FontSizeContext = React.createContext<{
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}>({
  fontSize: 'md',
  setFontSize: () => {}
});

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>('md');

  useEffect(() => {
    const savedFontSize = localStorage.getItem('app-font-size') as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-font-size', fontSize);
    
    // Apply font size to document
    const root = document.documentElement;
    const fontSizes = {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px'
    };
    
    root.style.fontSize = fontSizes[fontSize];
    root.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = React.useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
