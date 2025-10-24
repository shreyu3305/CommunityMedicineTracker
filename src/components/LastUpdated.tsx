import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface LastUpdatedProps {
  timestamp: string | number | Date;
  showIcon?: boolean;
  showRelative?: boolean;
  showAbsolute?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({
  timestamp,
  showIcon = true,
  showRelative = true,
  showAbsolute = false,
  variant = 'default',
  size = 'md',
  style
}) => {
  const [relativeTime, setRelativeTime] = useState<string>('');
  const [isStale, setIsStale] = useState<boolean>(false);

  const getVariantStyles = (variant: string) => {
    const variants = {
      default: {
        color: colors.neutral[600],
        icon: <Clock size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        background: 'transparent'
      },
      success: {
        color: colors.success,
        icon: <CheckCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        background: colors.success + '15'
      },
      warning: {
        color: colors.warning,
        icon: <AlertCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        background: colors.warning + '15'
      },
      error: {
        color: colors.error,
        icon: <AlertCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        background: colors.error + '15'
      }
    };
    return variants[variant as keyof typeof variants] || variants.default;
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  };

  const formatAbsoluteTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const updateRelativeTime = () => {
    try {
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        setRelativeTime('Unknown');
        setIsStale(true);
        return;
      }
      
      const relative = formatRelativeTime(date);
      setRelativeTime(relative);
      
      // Check if data is stale (older than 24 hours)
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      setIsStale(diffInHours > 24);
    } catch (error) {
      console.warn('Invalid timestamp:', timestamp);
      setRelativeTime('Unknown');
      setIsStale(true);
    }
  };

  useEffect(() => {
    updateRelativeTime();
    
    // Update every minute
    const interval = setInterval(updateRelativeTime, 60000);
    
    return () => clearInterval(interval);
  }, [timestamp]);

  const variantStyles = getVariantStyles(variant);
  const fontSize = size === 'sm' ? '11px' : size === 'md' ? '13px' : '15px';
  const padding = size === 'sm' ? `${spacing.xs} ${spacing.sm}` : size === 'md' ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.lg}`;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize,
    fontWeight: 500,
    color: variantStyles.color,
    background: variantStyles.background,
    padding,
    borderRadius: borderRadius.md,
    transition: 'all 0.2s ease',
    ...style
  };

  const iconStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: variantStyles.color,
    opacity: 0.8
  };

  const textStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const relativeStyles: React.CSSProperties = {
    fontSize,
    fontWeight: 600,
    color: variantStyles.color
  };

  const absoluteStyles: React.CSSProperties = {
    fontSize: size === 'sm' ? '10px' : size === 'md' ? '11px' : '12px',
    color: colors.neutral[500],
    fontWeight: 400
  };

  const staleStyles: React.CSSProperties = {
    ...relativeStyles,
    color: colors.warning,
    fontWeight: 600
  };

  return (
    <div style={containerStyles}>
      {showIcon && (
        <div style={iconStyles}>
          {variantStyles.icon}
        </div>
      )}
      
      <div style={textStyles}>
        {showRelative && (
          <span style={isStale ? staleStyles : relativeStyles}>
            {isStale ? 'Stale data' : relativeTime}
          </span>
        )}
        
        {showAbsolute && (
          <span style={absoluteStyles}>
            {formatAbsoluteTime(new Date(timestamp))}
          </span>
        )}
      </div>
    </div>
  );
};

// Compact version for small spaces
export const CompactLastUpdated: React.FC<LastUpdatedProps> = (props) => (
  <LastUpdated
    {...props}
    size="sm"
    showAbsolute={false}
    style={{
      ...props.style,
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '11px'
    }}
  />
);

// Badge version for status indicators
export const LastUpdatedBadge: React.FC<LastUpdatedProps> = ({
  timestamp,
  variant = 'default',
  style
}) => {
  const [relativeTime, setRelativeTime] = useState<string>('');
  const [isStale, setIsStale] = useState<boolean>(false);

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  useEffect(() => {
    try {
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        setRelativeTime('Unknown');
        setIsStale(true);
        return;
      }
      
      const relative = formatRelativeTime(date);
      setRelativeTime(relative);
      
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      setIsStale(diffInHours > 24);
    } catch (error) {
      console.warn('Invalid timestamp:', timestamp);
      setRelativeTime('Unknown');
      setIsStale(true);
    }
  }, [timestamp]);

  const getBadgeStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.full,
      fontSize: '11px',
      fontWeight: 600,
      transition: 'all 0.2s ease'
    };

    if (isStale) {
      return {
        ...baseStyles,
        background: colors.warning + '20',
        color: colors.warning,
        border: `1px solid ${colors.warning}40`
      };
    }

    switch (variant) {
      case 'success':
        return {
          ...baseStyles,
          background: colors.success + '20',
          color: colors.success,
          border: `1px solid ${colors.success}40`
        };
      case 'warning':
        return {
          ...baseStyles,
          background: colors.warning + '20',
          color: colors.warning,
          border: `1px solid ${colors.warning}40`
        };
      case 'error':
        return {
          ...baseStyles,
          background: colors.error + '20',
          color: colors.error,
          border: `1px solid ${colors.error}40`
        };
      default:
        return {
          ...baseStyles,
          background: colors.neutral[100],
          color: colors.neutral[600],
          border: `1px solid ${colors.neutral[200]}`
        };
    }
  };

  return (
    <div style={{ ...getBadgeStyles(), ...style }}>
      <Clock size={10} />
      <span>{relativeTime}</span>
    </div>
  );
};

// Auto-updating component that refreshes data
export const AutoUpdatingLastUpdated: React.FC<LastUpdatedProps & {
  onRefresh?: () => void;
  refreshInterval?: number;
}> = ({
  timestamp,
  onRefresh,
  refreshInterval = 300000, // 5 minutes
  ...props
}) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (onRefresh) {
        onRefresh();
        setLastRefresh(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [onRefresh, refreshInterval]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
      <LastUpdated timestamp={timestamp} {...props} />
      {onRefresh && (
        <button
          onClick={() => {
            onRefresh();
            setLastRefresh(new Date());
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: spacing.xs,
            borderRadius: borderRadius.sm,
            color: colors.neutral[500],
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.neutral[100];
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = colors.neutral[500];
          }}
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>
      )}
    </div>
  );
};
