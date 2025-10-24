import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export type Language = 'en' | 'hi';

export interface LanguageToggleProps {
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  variant?: 'button' | 'dropdown' | 'toggle';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showFlag?: boolean;
  style?: React.CSSProperties;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language: controlledLanguage,
  onLanguageChange,
  variant = 'button',
  size = 'md',
  showLabel = true,
  showFlag = true,
  style
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const language = controlledLanguage || currentLanguage;

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && !controlledLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, [controlledLanguage]);

  // Save language to localStorage
  useEffect(() => {
    if (!controlledLanguage) {
      localStorage.setItem('app-language', language);
    }
  }, [language, controlledLanguage]);

  const handleLanguageChange = (newLanguage: Language) => {
    if (!controlledLanguage) {
      setCurrentLanguage(newLanguage);
    }
    onLanguageChange?.(newLanguage);
  };

  const languages = [
    {
      code: 'en' as Language,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr'
    },
    {
      code: 'hi' as Language,
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      direction: 'ltr'
    }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

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
      case 'toggle':
        return {
          ...baseStyles,
          ...sizes[size],
          background: 'transparent',
          border: 'none',
          color: colors.neutral[600]
        };
      default:
        return baseStyles;
    }
  };

  const getLanguageIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
    return <Globe size={iconSize} />;
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
          {getLanguageIcon()}
          {showFlag && <span style={{ fontSize: '16px' }}>{currentLang.flag}</span>}
          {showLabel && <span>{currentLang.name}</span>}
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
            minWidth: '160px'
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  handleLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  background: language === lang.code ? colors.primary + '15' : 'transparent',
                  color: language === lang.code ? colors.primary : colors.neutral[700],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontSize: '14px',
                  fontWeight: language === lang.code ? 600 : 500,
                  transition: 'all 0.2s ease',
                  textAlign: 'left' as const
                }}
                onMouseEnter={(e) => {
                  if (language !== lang.code) {
                    e.currentTarget.style.background = colors.neutral[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== lang.code) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{lang.name}</div>
                  <div style={{ fontSize: '12px', color: colors.neutral[500] }}>
                    {lang.nativeName}
                  </div>
                </div>
                {language === lang.code && (
                  <Check size={16} color={colors.primary} />
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

  if (variant === 'toggle') {
    const handleToggle = () => {
      const nextLanguage = language === 'en' ? 'hi' : 'en';
      handleLanguageChange(nextLanguage);
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
        {getLanguageIcon()}
        {showFlag && <span style={{ fontSize: '16px' }}>{currentLang.flag}</span>}
        {showLabel && <span>{currentLang.name}</span>}
      </button>
    );
  }

  // Button variant
  const handleClick = () => {
    const nextLanguage = language === 'en' ? 'hi' : 'en';
    handleLanguageChange(nextLanguage);
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
      {getLanguageIcon()}
      {showFlag && <span style={{ fontSize: '16px' }}>{currentLang.flag}</span>}
      {showLabel && <span>{currentLang.name}</span>}
    </button>
  );
};

// Compact version for headers
export const CompactLanguageToggle: React.FC<LanguageToggleProps> = (props) => (
  <LanguageToggle
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

// Language context for global state
export const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  // Simple translation function (in a real app, this would use a proper i18n library)
  const t = (key: string): string => {
    const translations: Record<string, Record<Language, string>> = {
      'search.placeholder': {
        en: 'Search for medicines...',
        hi: 'दवाओं की खोज करें...'
      },
      'search.button': {
        en: 'Search',
        hi: 'खोजें'
      },
      'pharmacy.name': {
        en: 'Pharmacy',
        hi: 'फार्मेसी'
      },
      'medicine.name': {
        en: 'Medicine',
        hi: 'दवा'
      },
      'contact.call': {
        en: 'Call',
        hi: 'कॉल करें'
      },
      'contact.whatsapp': {
        en: 'WhatsApp',
        hi: 'व्हाट्सऐप'
      },
      'contact.email': {
        en: 'Email',
        hi: 'ईमेल'
      },
      'contact.directions': {
        en: 'Directions',
        hi: 'दिशा-निर्देश'
      },
      'status.in_stock': {
        en: 'In Stock',
        hi: 'उपलब्ध'
      },
      'status.low_stock': {
        en: 'Low Stock',
        hi: 'कम उपलब्ध'
      },
      'status.out_of_stock': {
        en: 'Out of Stock',
        hi: 'उपलब्ध नहीं'
      },
      'reviews.title': {
        en: 'Reviews',
        hi: 'समीक्षाएं'
      },
      'reviews.add': {
        en: 'Write a Review',
        hi: 'समीक्षा लिखें'
      },
      'photos.title': {
        en: 'Photos',
        hi: 'तस्वीरें'
      },
      'inventory.title': {
        en: 'Medicine Inventory',
        hi: 'दवा सूची'
      }
    };

    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation hook
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};
