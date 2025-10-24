import React, { useState } from 'react';
import { Search, MapPin, Shield, Users, TrendingUp, Settings } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MedicineSearch } from '../components/MedicineSearch';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { FontSizeAdjuster } from '../components/FontSizeAdjuster';
import { HighContrastToggle } from '../components/HighContrastMode';
import { TextToSpeech } from '../components/TextToSpeech';
import { LocationError } from '../components/LocationError';
import { SearchSuggestionsInput } from '../components/SearchSuggestions';
import { AriaMain, AriaHeading, AriaButton } from '../components/AriaLabels';
import { KeyboardNavigation } from '../components/KeyboardNavigation';
import { FocusIndicators } from '../components/FocusIndicators';
import { spacing, colors, borderRadius, shadows } from '../styles/tokens';

interface HomePageProps {
  onSearch: (medicine: string, location: string) => void;
  onLogout?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, onLogout }) => {
  const [medicineName, setMedicineName] = useState('');
  const [location, setLocation] = useState('');
  const [showMedicineSearch, setShowMedicineSearch] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = () => {
    if (medicineName.trim()) {
      onSearch(medicineName, location);
    }
  };

  const handleMedicineSelect = (medicine: string) => {
    setMedicineName(medicine);
    onSearch(medicine, location);
  };

  const handleMedicineSearch = (query: string) => {
    setMedicineName(query);
    onSearch(query, location);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Add animated background elements
  const backgroundElements = (
    <>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite',
        zIndex: 1
      }} />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </>
  );

  const heroStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing.xl} ${spacing.lg}`,
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '56px',
    fontWeight: 800,
    color: '#FFFFFF', // Pure white for maximum contrast
    marginBottom: spacing.md,
    lineHeight: '110%',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Stronger shadow for better contrast
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '20px',
    color: '#FFFFFF', // Pure white for better contrast
    marginBottom: spacing.xl,
    lineHeight: '160%',
    fontWeight: 400,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Stronger shadow
    opacity: 0.95, // Slight transparency for visual hierarchy
  };

  const searchCardStyles: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    marginBottom: spacing.xl,
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '32px',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: spacing['2xl'],
    position: 'relative',
    overflow: 'hidden',
  };

  // Add subtle inner glow effect
  const searchCardInner = (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    }} />
  );

  const searchGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: spacing.md,
    marginBottom: spacing.lg,
  };

  const featuresStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing['4xl'],
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.lg}`,
  };


  const iconWrapperStyles: React.CSSProperties = {
    width: '88px',
    height: '88px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing.lg,
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  // Add subtle glow effect to icons
  const iconGlow = (
    <div style={{
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '26px',
      opacity: 0.3,
      filter: 'blur(8px)',
      zIndex: -1,
    }} />
  );

  const featureTitleStyles: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: spacing.sm,
  };

  const featureDescStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '150%',
    fontWeight: 400,
  };

  const features = [
    {
      icon: <MapPin size={32} color="white" />,
      title: 'Find Nearby',
      description: 'Locate pharmacies near you with real-time medicine availability',
    },
    {
      icon: <Users size={32} color="white" />,
      title: 'Community Powered',
      description: 'Help others by reporting medicine stock status in your area',
    },
    {
      icon: <Shield size={32} color="white" />,
      title: 'Verified Information',
      description: 'Trust verified reports from pharmacists and active community members',
    },
    {
      icon: <TrendingUp size={32} color="white" />,
      title: 'Real-Time Updates',
      description: 'Get instant notifications when medicines become available',
    },
  ];

  return (
    <div style={containerStyles}>
      {backgroundElements}
      <div style={heroStyles}>
        <h1 style={titleStyles}>Find Medicines Around You – Instantly</h1>
        <p style={subtitleStyles}>
          Connect with local pharmacies and community members to find the medicines you need, when you need them.
        </p>

        <div className="search-card" style={searchCardStyles}>
          {searchCardInner}
          
          {/* Simple Single Row Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '12px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}>
            {/* Search Input */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(248, 250, 252, 0.8)',
              borderRadius: '12px',
              padding: '4px 12px',
              border: '1px solid rgba(226, 232, 240, 0.6)',
            }}>
              <Search size={18} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                placeholder="Search for medicines..."
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: colors.text.primary,
                  width: '100%',
                  padding: '12px 0',
                }}
              />
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '40px',
              background: 'rgba(226, 232, 240, 0.8)',
            }} />

            {/* Location Input */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(248, 250, 252, 0.8)',
              borderRadius: '12px',
              padding: '4px 12px',
              border: '1px solid rgba(226, 232, 240, 0.6)',
            }}>
              <MapPin size={18} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: colors.text.primary,
                  width: '100%',
                  padding: '12px 0',
                }}
              />
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '40px',
              background: 'rgba(226, 232, 240, 0.8)',
            }} />

            {/* Search Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSearch}
              icon={<Search size={18} />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '120px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              Search
            </Button>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: spacing.lg, 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          marginTop: spacing['4xl'],
          position: 'relative',
          zIndex: 0
        }}>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onSearch('', '')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: '16px',
              padding: '16px 32px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            View Nearby Pharmacies
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            icon={<Settings size={20} />}
            onClick={() => setShowSettings(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: '16px',
              padding: '16px 32px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            style={{
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: '16px',
              padding: '16px 32px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            How It Works
          </Button>
        </div>
      </div>

      <div style={featuresStyles}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: spacing['2xl'],
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={iconWrapperStyles}>
              {iconGlow}
              {feature.icon}
            </div>
            <h3 style={featureTitleStyles}>{feature.title}</h3>
            <p style={featureDescStyles}>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg
        }}>
          <div style={{
            background: 'white',
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            maxWidth: '500px',
            width: '100%',
            boxShadow: shadows.lg
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: colors.neutral[800],
              margin: 0,
              marginBottom: spacing.lg,
              textAlign: 'center'
            }}>
              Settings
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.md,
                background: colors.neutral[50],
                borderRadius: borderRadius.md
              }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: spacing.xs }}>
                    Theme
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.neutral[600], margin: 0 }}>
                    Choose your preferred theme
                  </p>
                </div>
                <DarkModeToggle variant="dropdown" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.md,
                background: colors.neutral[50],
                borderRadius: borderRadius.md
              }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: spacing.xs }}>
                    Language
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.neutral[600], margin: 0 }}>
                    Select your preferred language
                  </p>
                </div>
                <LanguageToggle variant="dropdown" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing.md,
                background: colors.neutral[50],
                borderRadius: borderRadius.md
              }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: spacing.xs }}>
                    Font Size
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.neutral[600], margin: 0 }}>
                    Adjust text size for better readability
                  </p>
                </div>
                <FontSizeAdjuster variant="slider" />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: spacing.lg,
              gap: spacing.md
            }}>
              {onLogout && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setShowSettings(false);
                    onLogout();
                  }}
                  style={{ color: colors.error, borderColor: colors.error }}
                >
                  Logout
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowSettings(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
