import React from 'react';
import { CheckCircle, XCircle, HelpCircle, AlertTriangle, Clock, Package, Package2, PackageX } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type MedicineStatus = 'in_stock' | 'out_of_stock' | 'low_stock' | 'unknown' | 'pending' | 'verified' | 'unverified';

interface StatusIconProps {
  status: MedicineStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  compact?: boolean;
  style?: React.CSSProperties;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'md',
  showLabel = false,
  showTooltip = false,
  compact = false,
  style
}) => {
  const getStatusConfig = (status: MedicineStatus) => {
    switch (status) {
      case 'in_stock':
        return {
          icon: CheckCircle,
          color: colors.success,
          label: 'In Stock',
          description: 'Medicine is available',
          bgColor: `${colors.success}10`,
          borderColor: colors.success
        };
      case 'out_of_stock':
        return {
          icon: XCircle,
          color: colors.error,
          label: 'Out of Stock',
          description: 'Medicine is not available',
          bgColor: `${colors.error}10`,
          borderColor: colors.error
        };
      case 'low_stock':
        return {
          icon: AlertTriangle,
          color: colors.warning,
          label: 'Low Stock',
          description: 'Limited quantity available',
          bgColor: `${colors.warning}10`,
          borderColor: colors.warning
        };
      case 'unknown':
        return {
          icon: HelpCircle,
          color: colors.neutral[500],
          label: 'Unknown',
          description: 'Status not reported',
          bgColor: `${colors.neutral[500]}10`,
          borderColor: colors.neutral[300]
        };
      case 'pending':
        return {
          icon: Clock,
          color: colors.info,
          label: 'Pending',
          description: 'Awaiting verification',
          bgColor: `${colors.info}10`,
          borderColor: colors.info
        };
      case 'verified':
        return {
          icon: Package,
          color: colors.success,
          label: 'Verified',
          description: 'Status verified by pharmacist',
          bgColor: `${colors.success}10`,
          borderColor: colors.success
        };
      case 'unverified':
        return {
          icon: Package2,
          color: colors.warning,
          label: 'Unverified',
          description: 'Community report, not verified',
          bgColor: `${colors.warning}10`,
          borderColor: colors.warning
        };
      default:
        return {
          icon: HelpCircle,
          color: colors.neutral[500],
          label: 'Unknown',
          description: 'Status unknown',
          bgColor: `${colors.neutral[500]}10`,
          borderColor: colors.neutral[300]
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeMap = {
    sm: { icon: 14, padding: spacing.xs, fontSize: '11px' },
    md: { icon: 18, padding: spacing.sm, fontSize: '12px' },
    lg: { icon: 24, padding: spacing.md, fontSize: '14px' }
  };

  const currentSize = sizeMap[size];

  const iconStyles: React.CSSProperties = {
    color: config.color,
    flexShrink: 0
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    ...style
  };

  const badgeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: compact ? `${spacing.xs} ${spacing.sm}` : `${currentSize.padding} ${spacing.md}`,
    borderRadius: compact ? borderRadius.sm : borderRadius.md,
    background: config.bgColor,
    border: `1px solid ${config.borderColor}`,
    fontSize: currentSize.fontSize,
    fontWeight: 600,
    color: config.color,
    boxShadow: showTooltip ? shadows.sm : 'none',
    transition: 'all 0.2s ease',
    cursor: showTooltip ? 'help' : 'default'
  };

  const labelStyles: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    fontWeight: 600,
    color: config.color,
    margin: 0
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '11px',
    color: colors.neutral[600],
    margin: 0,
    marginTop: '2px'
  };

  if (compact) {
    return (
      <div style={containerStyles}>
        <IconComponent size={currentSize.icon} style={iconStyles} />
        {showLabel && <span style={labelStyles}>{config.label}</span>}
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={badgeStyles} title={showTooltip ? config.description : undefined}>
        <IconComponent size={currentSize.icon} style={iconStyles} />
        {showLabel && (
          <div>
            <div style={labelStyles}>{config.label}</div>
            {showTooltip && (
              <div style={descriptionStyles}>{config.description}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized components for different use cases
export const StockStatusIcon: React.FC<Omit<StatusIconProps, 'status'> & { stockLevel: 'high' | 'medium' | 'low' | 'none' | 'unknown' }> = ({
  stockLevel,
  ...props
}) => {
  const statusMap = {
    high: 'in_stock' as MedicineStatus,
    medium: 'in_stock' as MedicineStatus,
    low: 'low_stock' as MedicineStatus,
    none: 'out_of_stock' as MedicineStatus,
    unknown: 'unknown' as MedicineStatus
  };

  return <StatusIcon status={statusMap[stockLevel]} {...props} />;
};

export const VerificationStatusIcon: React.FC<Omit<StatusIconProps, 'status'> & { isVerified: boolean }> = ({
  isVerified,
  ...props
}) => {
  return <StatusIcon status={isVerified ? 'verified' : 'unverified'} {...props} />;
};

// Status legend component
export const StatusLegend: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const statuses: MedicineStatus[] = ['in_stock', 'out_of_stock', 'low_stock', 'unknown', 'pending'];

  const legendStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.md,
    background: colors.neutral[50],
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
    ...style
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral[900],
    margin: 0,
    marginBottom: spacing.xs
  };

  return (
    <div style={legendStyles}>
      <h4 style={titleStyles}>Status Legend</h4>
      {statuses.map((status) => (
        <StatusIcon
          key={status}
          status={status}
          size="sm"
          showLabel={true}
          showTooltip={true}
          compact={true}
        />
      ))}
    </div>
  );
};
