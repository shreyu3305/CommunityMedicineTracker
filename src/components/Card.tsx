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
    background: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    padding: paddingMap[padding],
    transition: transitions.base,
    cursor: onClick ? 'pointer' : 'default',
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
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
