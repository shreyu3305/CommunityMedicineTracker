import React from 'react';
import { colors, spacing, borderRadius } from '../styles/tokens';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius: radius = '4px',
  className,
  style,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: '50%',
          width: height,
          height: height
        };
      case 'text':
        return {
          borderRadius: '4px',
          height: '1rem',
          marginBottom: '0.5rem'
        };
      default:
        return {
          borderRadius: radius,
          width,
          height
        };
    }
  };

  const getAnimationStyles = () => {
    switch (animation) {
      case 'wave':
        return {
          background: `linear-gradient(90deg, ${colors.neutral[200]} 25%, ${colors.neutral[100]} 50%, ${colors.neutral[200]} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'skeleton-wave 1.5s infinite'
        };
      case 'pulse':
        return {
          background: colors.neutral[200],
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        };
      default:
        return {
          background: colors.neutral[200]
        };
    }
  };

  const skeletonStyles: React.CSSProperties = {
    ...getVariantStyles(),
    ...getAnimationStyles(),
    ...style
  };

  return (
    <>
      <div
        className={className}
        style={skeletonStyles}
      />
      <style>
        {`
          @keyframes skeleton-pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
            100% {
              opacity: 1;
            }
          }
          
          @keyframes skeleton-wave {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </>
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '75%' : '100%'}
        animation="pulse"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={className}
    style={{
      padding: spacing.lg,
      background: 'white',
      borderRadius: borderRadius.lg,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${colors.neutral[200]}`
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.md }}>
      <Skeleton variant="circular" width="48px" height="48px" animation="pulse" />
      <div style={{ marginLeft: spacing.md, flex: 1 }}>
        <Skeleton width="60%" height="20px" animation="pulse" style={{ marginBottom: spacing.xs }} />
        <Skeleton width="40%" height="16px" animation="pulse" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.md }}>
      <Skeleton width="80px" height="24px" animation="pulse" />
      <Skeleton width="60px" height="24px" animation="pulse" />
    </div>
  </div>
);

export const SkeletonPharmacyCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={className}
    style={{
      padding: spacing.lg,
      background: 'white',
      borderRadius: borderRadius.lg,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${colors.neutral[200]}`,
      marginBottom: spacing.md
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
          <Skeleton width="200px" height="24px" animation="pulse" />
          <Skeleton variant="circular" width="20px" height="20px" animation="pulse" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
          <Skeleton variant="circular" width="16px" height="16px" animation="pulse" />
          <Skeleton width="250px" height="16px" animation="pulse" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Skeleton variant="circular" width="16px" height="16px" animation="pulse" />
          <Skeleton width="150px" height="16px" animation="pulse" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.sm }}>
        <Skeleton width="50px" height="24px" animation="pulse" />
        <Skeleton width="80px" height="20px" animation="pulse" />
        <Skeleton width="60px" height="16px" animation="pulse" />
      </div>
    </div>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTop: `1px solid ${colors.neutral[200]}`
    }}>
      <Skeleton width="120px" height="16px" animation="pulse" />
      <Skeleton width="80px" height="16px" animation="pulse" />
    </div>
  </div>
);

export const SkeletonSearchBar: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={className}
    style={{
      padding: spacing.lg,
      background: 'white',
      borderRadius: borderRadius.lg,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${colors.neutral[200]}`,
      marginBottom: spacing.lg
    }}
  >
    <Skeleton width="100%" height="48px" animation="pulse" />
  </div>
);

export const SkeletonList: React.FC<{ 
  count?: number; 
  className?: string;
  itemComponent?: React.ComponentType<{ className?: string }>;
}> = ({ 
  count = 3, 
  className,
  itemComponent: ItemComponent = SkeletonPharmacyCard
}) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <ItemComponent key={index} />
    ))}
  </div>
);
