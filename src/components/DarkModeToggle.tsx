import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface DarkModeToggleProps {
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  variant?: 'button' | 'switch' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: React.CSSProperties;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  mode: controlledMode,
  onModeChange,
  variant = 'button',
  size = 'md',
  showLabel = true,
  style
}) => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  const mode = controlledMode || currentMode;

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (mode === 'system') {
        setIsDark(e.matches);
      }
    };

    // Set initial value
    if (mode === 'system') {
      setIsDark(mediaQuery.matches);
    } else {
      setIsDark(mode === 'dark');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDark]);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && !controlledMode) {
      setCurrentMode(savedMode);
    }
  }, [controlledMode]);

  // Save theme to localStorage
  useEffect(() => {
    if (!controlledMode) {
      localStorage.setItem('theme-mode', mode);
    }
  }, [mode, controlledMode]);

  const handleModeChange = (newMode: ThemeMode) => {
    if (!controlledMode) {
      setCurrentMode(newMode);
    }
    onModeChange?.(newMode);
  };

  const getModeIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
    
    switch (mode) {
      case 'light':
        return <Sun size={iconSize} />;
      case 'dark':
        return <Moon size={iconSize} />;
      case 'system':
        return <Monitor size={iconSize} />;
      default:
        return <Monitor size={iconSize} />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

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
          background: isDark ? colors.neutral[800] : colors.neutral[100],
          color: isDark ? colors.neutral[100] : colors.neutral[800],
          border: `1px solid ${isDark ? colors.neutral[700] : colors.neutral[300]}`,
          borderRadius: borderRadius.md,
          fontWeight: 500
        };
      case 'switch':
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

  if (variant === 'dropdown') {
    const [isOpen, setIsOpen] = useState(false);
    const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
      { value: 'light', label: 'Light', icon: <Sun size={16} /> },
      { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
      { value: 'system', label: 'System', icon: <Monitor size={16} /> }
    ];

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
          {getModeIcon()}
          {showLabel && <span>{getModeLabel()}</span>}
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
            minWidth: '120px'
          }}>
            {modes.map((modeOption) => (
              <button
                key={modeOption.value}
                onClick={() => {
                  handleModeChange(modeOption.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  background: mode === modeOption.value ? colors.primary + '15' : 'transparent',
                  color: mode === modeOption.value ? colors.primary : colors.neutral[700],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontSize: '14px',
                  fontWeight: mode === modeOption.value ? 600 : 500,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (mode !== modeOption.value) {
                    e.currentTarget.style.background = colors.neutral[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== modeOption.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {modeOption.icon}
                {modeOption.label}
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

  if (variant === 'switch') {
    const handleToggle = () => {
      const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
      handleModeChange(nextMode);
    };

    return (
      <button
        style={getVariantStyles()}
        onClick={handleToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.neutral[600];
        }}
      >
        {getModeIcon()}
        {showLabel && <span>{getModeLabel()}</span>}
      </button>
    );
  }

  // Button variant
  const handleClick = () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    handleModeChange(nextMode);
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
      {getModeIcon()}
      {showLabel && <span>{getModeLabel()}</span>}
    </button>
  );
};

// Compact version for headers
export const CompactDarkModeToggle: React.FC<DarkModeToggleProps> = (props) => (
  <DarkModeToggle
    {...props}
    size="sm"
    showLabel={false}
    variant="button"
    style={{
      ...props.style,
      padding: `${spacing.xs} ${spacing.sm}`,
      minWidth: 'auto'
    }}
  />
);

// System theme detector
export const useSystemTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
};

// Theme context for global state
export const ThemeContext = React.createContext<{
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}>({
  mode: 'system',
  isDark: false,
  setMode: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const isSystemDark = useSystemTheme();
  const isDark = mode === 'dark' || (mode === 'system' && isSystemDark);

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDark]);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
