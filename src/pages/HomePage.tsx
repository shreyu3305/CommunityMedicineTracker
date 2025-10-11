import React, { useState } from 'react';
import { Search, MapPin, Shield, Users, TrendingUp, Pill } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface HomePageProps {
  onSearch: (medicine: string, location: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  const [medicineName, setMedicineName] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (medicineName.trim()) {
      onSearch(medicineName, location);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: colors.gradient.lightBlue,
    position: 'relative',
    overflow: 'hidden',
  };

  const heroStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing['4xl']} ${spacing.lg}`,
    textAlign: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '56px',
    fontWeight: 700,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    lineHeight: '120%',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '20px',
    color: colors.neutral[600],
    marginBottom: spacing['3xl'],
    lineHeight: '150%',
  };

  const searchCardStyles: React.CSSProperties = {
    maxWidth: '700px',
    margin: '0 auto',
    marginBottom: spacing['3xl'],
  };

  const searchGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: spacing.md,
    marginBottom: spacing.lg,
  };

  const featuresStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: spacing.lg,
    marginTop: spacing['4xl'],
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.lg}`,
  };

  const featureCardStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing.xl,
  };

  const iconWrapperStyles: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: borderRadius.xl,
    background: colors.gradient.blueTeal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing.lg,
    boxShadow: shadows.glow,
  };

  const featureTitleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  };

  const featureDescStyles: React.CSSProperties = {
    fontSize: '16px',
    color: colors.neutral[600],
    lineHeight: '150%',
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
      <div style={heroStyles}>
        <div style={{ marginBottom: spacing['2xl'] }}>
          <div style={iconWrapperStyles}>
            <Pill size={40} color="white" />
          </div>
        </div>

        <h1 style={titleStyles}>Sumesh Fucked Shreya</h1>
        <p style={subtitleStyles}>
          Connect with local pharmacies and community members to find the medicines you need, when you need them.
        </p>

        <Card padding="lg" className="search-card" style={searchCardStyles}>
          <div style={searchGridStyles}>
            <Input
              placeholder="Search for a medicine..."
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              icon={<Search size={20} />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Your location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin size={20} />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSearch}
            icon={<Search size={20} />}
          >
            Search Now
          </Button>
        </Card>

        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outline" size="md" onClick={() => onSearch('', '')}>
            View Nearby Pharmacies
          </Button>
          <Button variant="ghost" size="md">
            How It Works
          </Button>
        </div>
      </div>

      <div style={featuresStyles}>
        {features.map((feature, index) => (
          <Card key={index} hover padding="lg">
            <div style={featureCardStyles}>
              <div style={iconWrapperStyles}>{feature.icon}</div>
              <h3 style={featureTitleStyles}>{feature.title}</h3>
              <p style={featureDescStyles}>{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
