import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Car, User, Bike } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export interface DirectionsButtonProps {
  address: string;
  pharmacyName?: string;
  latitude?: number;
  longitude?: number;
  variant?: 'button' | 'card' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  showDistance?: boolean;
  showTravelTime?: boolean;
  style?: React.CSSProperties;
}

export const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  address,
  pharmacyName,
  latitude,
  longitude,
  variant = 'button',
  size = 'md',
  showDistance = true,
  showTravelTime = true,
  style
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getDirectionsUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    
    const query = pharmacyName ? `${pharmacyName}, ${address}` : address;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  };

  const getAppleMapsUrl = () => {
    if (latitude && longitude) {
      return `http://maps.apple.com/?daddr=${latitude},${longitude}`;
    }
    
    const query = pharmacyName ? `${pharmacyName}, ${address}` : address;
    return `http://maps.apple.com/?daddr=${encodeURIComponent(query)}`;
  };

  const handleDirectionsClick = async () => {
    setIsLoading(true);
    
    try {
      // Try to get user's current location for better directions
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude || address}`;
            window.open(directionsUrl, '_blank');
            setIsLoading(false);
          },
          () => {
            // Fallback to basic directions if location access denied
            window.open(getDirectionsUrl(), '_blank');
            setIsLoading(false);
          }
        );
      } else {
        // Fallback for browsers without geolocation
        window.open(getDirectionsUrl(), '_blank');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      window.open(getDirectionsUrl(), '_blank');
      setIsLoading(false);
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

    switch (variant) {
      case 'button':
        return {
          ...baseStyles,
          padding: size === 'sm' ? `${spacing.sm} ${spacing.md}` : size === 'md' ? `${spacing.md} ${spacing.lg}` : `${spacing.lg} ${spacing.xl}`,
          borderRadius: borderRadius.md,
          background: colors.primary,
          color: 'white',
          border: 'none',
          fontSize: size === 'sm' ? '13px' : size === 'md' ? '14px' : '16px',
          fontWeight: 600,
          boxShadow: shadows.sm
        };
      case 'card':
        return {
          ...baseStyles,
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          background: 'white',
          color: colors.neutral[800],
          border: `1px solid ${colors.neutral[200]}`,
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: shadows.sm,
          flexDirection: 'column' as const,
          textAlign: 'center' as const,
          minWidth: '200px'
        };
      case 'compact':
        return {
          ...baseStyles,
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.full,
          background: colors.primary + '15',
          color: colors.primary,
          border: `1px solid ${colors.primary}40`,
          fontSize: '12px',
          fontWeight: 600
        };
      default:
        return baseStyles;
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  if (variant === 'card') {
    return (
      <div
        style={{
          ...getVariantStyles(),
          ...style
        }}
        onClick={handleDirectionsClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ color: colors.primary, marginBottom: spacing.sm }}>
          <Navigation size={iconSize} />
        </div>
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: spacing.xs }}>
          Get Directions
        </h4>
        <p style={{ fontSize: '12px', color: colors.neutral[600], margin: 0, marginBottom: spacing.sm }}>
          {pharmacyName || 'Pharmacy'}
        </p>
        <p style={{ fontSize: '11px', color: colors.neutral[500], margin: 0 }}>
          {address}
        </p>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: spacing.sm,
            borderRadius: borderRadius.md,
            fontSize: '12px',
            color: colors.primary,
            fontWeight: 600
          }}>
            Loading...
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      style={getVariantStyles()}
      onClick={handleDirectionsClick}
      disabled={isLoading}
      onMouseEnter={(e) => {
        if (variant === 'button') {
          e.currentTarget.style.background = colors.primary + 'E6';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'button') {
          e.currentTarget.style.background = colors.primary;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = shadows.sm;
        }
      }}
    >
      {isLoading ? (
        <div style={{
          width: iconSize,
          height: iconSize,
          border: `2px solid ${variant === 'button' ? 'white' : colors.primary}`,
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      ) : (
        <Navigation size={iconSize} />
      )}
      
      <span>
        {variant === 'compact' ? 'Directions' : 'Get Directions'}
      </span>
      
      {variant === 'button' && (
        <ExternalLink size={iconSize - 2} style={{ opacity: 0.8 }} />
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

// Quick directions with travel options
export const QuickDirections: React.FC<{
  address: string;
  pharmacyName?: string;
  latitude?: number;
  longitude?: number;
  style?: React.CSSProperties;
}> = ({ address, pharmacyName, latitude, longitude, style }) => {
  const getDirectionsUrl = (mode: 'driving' | 'walking' | 'transit' | 'bicycling') => {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const destination = latitude && longitude ? `${latitude},${longitude}` : address;
    const params = new URLSearchParams({
      destination,
      travelmode: mode
    });
    
    if (pharmacyName) {
      params.append('destination_place_id', pharmacyName);
    }
    
    return `${baseUrl}&${params.toString()}`;
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    ...style
  };

  const optionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'white',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    color: colors.neutral[700]
  };

  const iconStyles = {
    driving: <Car size={16} color={colors.primary} />,
    walking: <User size={16} color={colors.success} />,
    transit: <Clock size={16} color={colors.info} />,
    bicycling: <Bike size={16} color={colors.warning} />
  };

  const labels = {
    driving: 'Drive',
    walking: 'Walk',
    transit: 'Public Transit',
    bicycling: 'Bike'
  };

  return (
    <div style={containerStyles}>
      <h4 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: colors.neutral[800],
        margin: 0,
        marginBottom: spacing.xs
      }}>
        Get Directions
      </h4>
      
      {(['driving', 'walking', 'transit', 'bicycling'] as const).map((mode) => (
        <a
          key={mode}
          href={getDirectionsUrl(mode)}
          target="_blank"
          rel="noopener noreferrer"
          style={optionStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.neutral[50];
            e.currentTarget.style.borderColor = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = colors.neutral[200];
          }}
        >
          {iconStyles[mode]}
          <span style={{ fontSize: '13px', fontWeight: 500 }}>
            {labels[mode]}
          </span>
          <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />
        </a>
      ))}
    </div>
  );
};

// Directions with estimated time and distance
export const DirectionsWithInfo: React.FC<{
  address: string;
  pharmacyName?: string;
  latitude?: number;
  longitude?: number;
  estimatedTime?: string;
  estimatedDistance?: string;
  style?: React.CSSProperties;
}> = ({
  address,
  pharmacyName,
  latitude,
  longitude,
  estimatedTime,
  estimatedDistance,
  style
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    background: colors.primary + '10',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.primary}30`,
    ...style
  };

  const infoStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral[800],
    margin: 0
  };

  const addressStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.neutral[600],
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  };

  const metaStyles: React.CSSProperties = {
    fontSize: '11px',
    color: colors.neutral[500],
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  return (
    <div style={containerStyles}>
      <div style={{ color: colors.primary }}>
        <MapPin size={20} />
      </div>
      
      <div style={infoStyles}>
        <h4 style={titleStyles}>
          {pharmacyName || 'Pharmacy Location'}
        </h4>
        <p style={addressStyles}>
          <MapPin size={12} />
          {address}
        </p>
        {(estimatedTime || estimatedDistance) && (
          <p style={metaStyles}>
            {estimatedTime && (
              <span>
                <Clock size={10} style={{ marginRight: spacing.xs }} />
                {estimatedTime}
              </span>
            )}
            {estimatedTime && estimatedDistance && ' • '}
            {estimatedDistance && (
              <span>
                <Car size={10} style={{ marginRight: spacing.xs }} />
                {estimatedDistance}
              </span>
            )}
          </p>
        )}
      </div>
      
      <DirectionsButton
        address={address}
        pharmacyName={pharmacyName}
        latitude={latitude}
        longitude={longitude}
        variant="compact"
        size="sm"
      />
    </div>
  );
};
