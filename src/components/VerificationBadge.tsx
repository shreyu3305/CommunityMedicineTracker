import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, Clock, Eye } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'rejected' | 'expired';
export type VerificationLevel = 'basic' | 'premium' | 'enterprise';

export interface VerificationBadgeProps {
  status: VerificationStatus;
  level?: VerificationLevel;
  showIcon?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'card' | 'inline';
  style?: React.CSSProperties;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  level,
  showIcon = true,
  showLabel = true,
  showTooltip = false,
  size = 'md',
  variant = 'badge',
  style
}) => {
  const getStatusInfo = (status: VerificationStatus) => {
    const statusMap = {
      verified: {
        label: 'Verified',
        icon: <CheckCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.success,
        background: colors.success + '15',
        border: colors.success + '40',
        description: 'This pharmacy has been verified by our team'
      },
      unverified: {
        label: 'Unverified',
        icon: <XCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.warning,
        background: colors.warning + '15',
        border: colors.warning + '40',
        description: 'This pharmacy has not been verified yet'
      },
      pending: {
        label: 'Pending',
        icon: <Clock size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.info,
        background: colors.info + '15',
        border: colors.info + '40',
        description: 'Verification is currently in progress'
      },
      rejected: {
        label: 'Rejected',
        icon: <XCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.error,
        background: colors.error + '15',
        border: colors.error + '40',
        description: 'Verification was rejected due to invalid information'
      },
      expired: {
        label: 'Expired',
        icon: <AlertTriangle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.warning,
        background: colors.warning + '15',
        border: colors.warning + '40',
        description: 'Verification has expired and needs renewal'
      }
    };
    return statusMap[status];
  };

  const getLevelInfo = (level?: VerificationLevel) => {
    if (!level) return null;
    
    const levelMap = {
      basic: {
        label: 'Basic',
        icon: <Shield size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />,
        color: colors.neutral[600]
      },
      premium: {
        label: 'Premium',
        icon: <Shield size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />,
        color: colors.primary
      },
      enterprise: {
        label: 'Enterprise',
        icon: <Shield size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />,
        color: colors.success
      }
    };
    return levelMap[level];
  };

  const statusInfo = getStatusInfo(status);
  const levelInfo = getLevelInfo(level);

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      fontWeight: 600,
      transition: 'all 0.2s ease',
      cursor: showTooltip ? 'help' : 'default'
    };

    const fontSize = size === 'sm' ? '11px' : size === 'md' ? '13px' : '15px';
    const padding = size === 'sm' ? `${spacing.xs} ${spacing.sm}` : size === 'md' ? `${spacing.sm} ${spacing.md}` : `${spacing.md} ${spacing.lg}`;

    switch (variant) {
      case 'badge':
        return {
          ...baseStyles,
          padding,
          fontSize,
          borderRadius: borderRadius.full,
          background: statusInfo.background,
          color: statusInfo.color,
          border: `1px solid ${statusInfo.border}`,
          boxShadow: shadows.sm
        };
      case 'card':
        return {
          ...baseStyles,
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: '14px',
          borderRadius: borderRadius.lg,
          background: statusInfo.background,
          color: statusInfo.color,
          border: `2px solid ${statusInfo.border}`,
          boxShadow: shadows.md,
          flexDirection: 'column' as const,
          textAlign: 'center' as const,
          gap: spacing.sm
        };
      case 'inline':
        return {
          ...baseStyles,
          padding: `${spacing.xs} 0`,
          fontSize,
          background: 'transparent',
          color: statusInfo.color,
          border: 'none'
        };
      default:
        return baseStyles;
    }
  };

  const containerStyles: React.CSSProperties = {
    ...getVariantStyles(),
    ...style
  };

  const iconStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: statusInfo.color
  };

  const labelStyles: React.CSSProperties = {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    color: 'inherit'
  };

  const levelStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: size === 'sm' ? '9px' : size === 'md' ? '10px' : '11px',
    color: levelInfo?.color || colors.neutral[500],
    fontWeight: 500,
    marginTop: variant === 'card' ? spacing.xs : 0
  };

  return (
    <div style={containerStyles} title={showTooltip ? statusInfo.description : undefined}>
      {showIcon && (
        <div style={iconStyles}>
          {statusInfo.icon}
        </div>
      )}
      
      {showLabel && (
        <span style={labelStyles}>
          {statusInfo.label}
        </span>
      )}
      
      {level && levelInfo && variant === 'card' && (
        <div style={levelStyles}>
          {levelInfo.icon}
          <span>{levelInfo.label}</span>
        </div>
      )}
    </div>
  );
};

// Compact version for small spaces
export const CompactVerificationBadge: React.FC<VerificationBadgeProps> = (props) => (
  <VerificationBadge
    {...props}
    size="sm"
    showLabel={false}
    style={{
      ...props.style,
      padding: `${spacing.xs} ${spacing.sm}`,
      minWidth: 'auto'
    }}
  />
);

// Status indicator with just icon
export const VerificationIcon: React.FC<{
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  style?: React.CSSProperties;
}> = ({ status, size = 'md', showTooltip = true, style }) => {
  const getStatusInfo = (status: VerificationStatus) => {
    const statusMap = {
      verified: {
        icon: <CheckCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.success,
        description: 'Verified pharmacy'
      },
      unverified: {
        icon: <XCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.warning,
        description: 'Unverified pharmacy'
      },
      pending: {
        icon: <Clock size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.info,
        description: 'Verification pending'
      },
      rejected: {
        icon: <XCircle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.error,
        description: 'Verification rejected'
      },
      expired: {
        icon: <AlertTriangle size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />,
        color: colors.warning,
        description: 'Verification expired'
      }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: statusInfo.color,
        cursor: showTooltip ? 'help' : 'default',
        ...style
      }}
      title={showTooltip ? statusInfo.description : undefined}
    >
      {statusInfo.icon}
    </div>
  );
};

// Verification status with detailed information
export const DetailedVerificationBadge: React.FC<VerificationBadgeProps & {
  verifiedDate?: string;
  verifiedBy?: string;
  expiryDate?: string;
}> = ({
  status,
  level,
  verifiedDate,
  verifiedBy,
  expiryDate,
  ...props
}) => {
  const statusInfo = getStatusInfo(status);
  const levelInfo = getLevelInfo(level);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    background: statusInfo.background,
    border: `1px solid ${statusInfo.border}`,
    ...props.style
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const detailsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    fontSize: '12px',
    color: colors.neutral[600]
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={{ color: statusInfo.color }}>
          {statusInfo.icon}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: statusInfo.color }}>
            {statusInfo.label}
          </div>
          {level && levelInfo && (
            <div style={{ fontSize: '11px', color: levelInfo.color }}>
              {levelInfo.label} Verification
            </div>
          )}
        </div>
      </div>
      
      {(verifiedDate || verifiedBy || expiryDate) && (
        <div style={detailsStyles}>
          {verifiedDate && (
            <div>Verified: {new Date(verifiedDate).toLocaleDateString()}</div>
          )}
          {verifiedBy && (
            <div>By: {verifiedBy}</div>
          )}
          {expiryDate && (
            <div>Expires: {new Date(expiryDate).toLocaleDateString()}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get status info (used by DetailedVerificationBadge)
const getStatusInfo = (status: VerificationStatus) => {
  const statusMap = {
    verified: {
      label: 'Verified',
      icon: <CheckCircle size={14} />,
      color: colors.success,
      background: colors.success + '15',
      border: colors.success + '40',
      description: 'This pharmacy has been verified by our team'
    },
    unverified: {
      label: 'Unverified',
      icon: <XCircle size={14} />,
      color: colors.warning,
      background: colors.warning + '15',
      border: colors.warning + '40',
      description: 'This pharmacy has not been verified yet'
    },
    pending: {
      label: 'Pending',
      icon: <Clock size={14} />,
      color: colors.info,
      background: colors.info + '15',
      border: colors.info + '40',
      description: 'Verification is currently in progress'
    },
    rejected: {
      label: 'Rejected',
      icon: <XCircle size={14} />,
      color: colors.error,
      background: colors.error + '15',
      border: colors.error + '40',
      description: 'Verification was rejected due to invalid information'
    },
    expired: {
      label: 'Expired',
      icon: <AlertTriangle size={14} />,
      color: colors.warning,
      background: colors.warning + '15',
      border: colors.warning + '40',
      description: 'Verification has expired and needs renewal'
    }
  };
  return statusMap[status];
};
