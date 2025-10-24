import React from 'react';
import { colors, borderRadius, shadows, spacing, transitions } from '../styles/tokens';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
}) => {
  const paddingMap = {
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  };

  const baseStyles: React.CSSProperties = {
    background: colors.background.primary,
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    padding: paddingMap[padding],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.border.light}`,
    color: colors.text.primary,
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'translateY(-8px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
  };

  return (
    <div
      style={baseStyles}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, {
            transform: 'translateY(0)',
            boxShadow: shadows.md,
          });
        }
      }}
    >
      {children}
    </div>
  );
};
