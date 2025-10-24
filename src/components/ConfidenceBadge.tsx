import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { colors, spacing } from '../styles/tokens';

interface ConfidenceBadgeProps {
  score: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  score,
  showTooltip = false,
  size = 'md'
}) => {
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.error;
      default:
        return colors.neutral[400];
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <ShieldCheck size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />;
      case 'medium':
        return <Shield size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />;
      case 'low':
        return <ShieldAlert size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />;
      default:
        return <Shield size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />;
    }
  };

  const getConfidenceLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'High Trust';
      case 'medium':
        return 'Medium Trust';
      case 'low':
        return 'Low Trust';
      default:
        return 'Unknown';
    }
  };

  const level = getConfidenceLevel(score);
  const color = getConfidenceColor(level);
  const icon = getConfidenceIcon(level);
  const label = getConfidenceLabel(level);

  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '6px',
      gap: '4px'
    },
    md: {
      padding: '6px 12px',
      fontSize: '14px',
      borderRadius: '8px',
      gap: '6px'
    },
    lg: {
      padding: '8px 16px',
      fontSize: '16px',
      borderRadius: '10px',
      gap: '8px'
    }
  };

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizeStyles[size].gap,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: 600,
    borderRadius: sizeStyles[size].borderRadius,
    transition: 'all 0.2s ease',
    cursor: showTooltip ? 'help' : 'default',
    position: 'relative'
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: colors.neutral[900],
    color: 'white',
    padding: spacing.sm,
    borderRadius: '8px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    marginBottom: '8px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease',
    pointerEvents: 'none'
  };

  const tooltipContent = `
    Trust Score: ${score}%
    • Recent reports: ${Math.floor(score / 20)}/5
    • Verification rate: ${Math.floor(score / 10)}%
    • Data freshness: ${score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'}
  `;

  return (
    <div
      style={badgeStyles}
      onMouseEnter={(e) => {
        if (showTooltip) {
          const tooltip = e.currentTarget.querySelector('.confidence-tooltip') as HTMLElement;
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (showTooltip) {
          const tooltip = e.currentTarget.querySelector('.confidence-tooltip') as HTMLElement;
          if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
          }
        }
      }}
    >
      {icon}
      <span>{label}</span>
      {showTooltip && (
        <div className="confidence-tooltip" style={tooltipStyles}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Trust Score: {score}%</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            • Recent reports: {Math.floor(score / 20)}/5<br/>
            • Verification rate: {Math.floor(score / 10)}%<br/>
            • Data freshness: {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'}
          </div>
        </div>
      )}
    </div>
  );
};
