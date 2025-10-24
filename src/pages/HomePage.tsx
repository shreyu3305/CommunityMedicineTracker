import React, { useState } from 'react';
import { Search, MapPin, Pill } from 'lucide-react';
import { Button } from '../components/Button';
import { spacing, colors } from '../styles/tokens';

interface HomePageProps {
  onSearch: (medicine: string) => void;
  onPharmacistLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, onPharmacistLogin }) => {
  const [medicineName, setMedicineName] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (medicineName.trim()) {
      onSearch(medicineName);
    }
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
    padding: `${spacing['4xl']} ${spacing.lg} ${spacing.xl} ${spacing.lg}`,
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
    maxWidth: '1000px',
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


  return (
    <div style={containerStyles}>
      {backgroundElements}
      
      {/* Top Right Login Button */}
      <div style={{
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        zIndex: 10
      }}>
        <Button 
          variant="outline" 
          size="sm" 
          icon={<Pill size={16} />}
          onClick={onPharmacistLogin}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            color: '#1a1a1a',
            borderRadius: '12px',
            padding: '10px 18px',
            fontWeight: '600',
            fontSize: '13px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
          }}
        >
          Pharmacist Login
        </Button>
      </div>
      
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
            onClick={() => onSearch('')}
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
        </div>
      </div>


    </div>
  );
};
