import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { colors, spacing, borderRadius } from '../styles/tokens';

interface DistanceDisplayProps {
  distance: number; // Distance in kilometers
  unit?: 'km' | 'miles';
  showIcon?: boolean;
  compact?: boolean;
  style?: React.CSSProperties;
}

export const DistanceDisplay: React.FC<DistanceDisplayProps> = ({
  distance,
  unit = 'km',
  showIcon = true,
  compact = false,
  style
}) => {
  const formatDistance = (dist: number, unitType: 'km' | 'miles'): string => {
    if (unitType === 'miles') {
      const miles = dist * 0.621371;
      if (miles < 0.1) {
        return `${Math.round(miles * 5280)} ft`;
      } else if (miles < 1) {
        return `${Math.round(miles * 10) / 10} mi`;
      } else {
        return `${Math.round(miles * 10) / 10} mi`;
      }
    } else {
      if (dist < 0.1) {
        return `${Math.round(dist * 1000)} m`;
      } else if (dist < 1) {
        return `${Math.round(dist * 10) / 10} km`;
      } else {
        return `${Math.round(dist * 10) / 10} km`;
      }
    }
  };

  const getDistanceColor = (dist: number): string => {
    if (dist <= 0.5) return colors.success;
    if (dist <= 1.0) return colors.warning;
    if (dist <= 2.0) return colors.info;
    return colors.neutral[500];
  };

  const getDistanceLabel = (dist: number): string => {
    if (dist <= 0.5) return 'Very Close';
    if (dist <= 1.0) return 'Close';
    if (dist <= 2.0) return 'Nearby';
    return 'Far';
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    ...style
  };

  const iconStyles: React.CSSProperties = {
    color: getDistanceColor(distance),
    flexShrink: 0
  };

  const textStyles: React.CSSProperties = {
    fontSize: compact ? '12px' : '14px',
    fontWeight: 600,
    color: getDistanceColor(distance),
    margin: 0
  };

  const labelStyles: React.CSSProperties = {
    fontSize: compact ? '10px' : '12px',
    color: colors.neutral[600],
    margin: 0,
    marginLeft: spacing.xs
  };

  const badgeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: compact ? `${spacing.xs} ${spacing.sm}` : `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.full,
    background: `${getDistanceColor(distance)}10`,
    border: `1px solid ${getDistanceColor(distance)}30`,
    fontSize: compact ? '11px' : '12px',
    fontWeight: 600,
    color: getDistanceColor(distance)
  };

  if (compact) {
    return (
      <div style={containerStyles}>
        {showIcon && <MapPin size={12} style={iconStyles} />}
        <span style={textStyles}>{formatDistance(distance, unit)}</span>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      {showIcon && <Navigation size={16} style={iconStyles} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={textStyles}>{formatDistance(distance, unit)}</span>
          <span style={labelStyles}>{getDistanceLabel(distance)}</span>
        </div>
      </div>
    </div>
  );
};

// Badge version for cards
export const DistanceBadge: React.FC<Omit<DistanceDisplayProps, 'compact'>> = ({
  distance,
  unit = 'km',
  showIcon = true,
  style
}) => {
  const formatDistance = (dist: number, unitType: 'km' | 'miles'): string => {
    if (unitType === 'miles') {
      const miles = dist * 0.621371;
      if (miles < 0.1) {
        return `${Math.round(miles * 5280)} ft`;
      } else if (miles < 1) {
        return `${Math.round(miles * 10) / 10} mi`;
      } else {
        return `${Math.round(miles * 10) / 10} mi`;
      }
    } else {
      if (dist < 0.1) {
        return `${Math.round(dist * 1000)} m`;
      } else if (dist < 1) {
        return `${Math.round(dist * 10) / 10} km`;
      } else {
        return `${Math.round(dist * 10) / 10} km`;
      }
    }
  };

  const getDistanceColor = (dist: number): string => {
    if (dist <= 0.5) return colors.success;
    if (dist <= 1.0) return colors.warning;
    if (dist <= 2.0) return colors.info;
    return colors.neutral[500];
  };

  const badgeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    background: `${getDistanceColor(distance)}10`,
    border: `1px solid ${getDistanceColor(distance)}30`,
    fontSize: '12px',
    fontWeight: 600,
    color: getDistanceColor(distance),
    ...style
  };

  return (
    <div style={badgeStyles}>
      {showIcon && <MapPin size={12} />}
      <span>{formatDistance(distance, unit)}</span>
    </div>
  );
};
