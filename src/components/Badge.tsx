import React from 'react';
import { colors, borderRadius, spacing } from '../styles/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
}) => {
  const variantColors: Record<string, { bg: string; text: string }> = {
    success: { bg: '#D1FAE5', text: colors.success },
    warning: { bg: '#FEF3C7', text: colors.warning },
    error: { bg: '#FEE2E2', text: colors.error },
    info: { bg: '#DBEAFE', text: colors.info },
    neutral: { bg: colors.neutral[100], text: colors.text.secondary },
  };

  const sizeStyles = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '12px',
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
    },
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: variantColors[variant].bg,
    color: variantColors[variant].text,
    borderRadius: borderRadius.full,
    fontWeight: 600,
    ...sizeStyles[size],
  };

  return (
    <span style={baseStyles}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};
