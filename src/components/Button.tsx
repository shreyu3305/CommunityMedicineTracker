import React from 'react';
import { colors, borderRadius, shadows, transitions, spacing } from '../styles/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    fontWeight: 600,
    borderRadius: borderRadius.lg,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: transitions.base,
    fontFamily: 'inherit',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: colors.gradient.primary,
      color: colors.text.inverse,
      boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
    },
    secondary: {
      background: 'rgba(79, 70, 229, 0.1)',
      color: colors.primary,
      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.2)',
    },
    outline: {
      background: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
    },
    md: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: '16px',
    },
    lg: {
      padding: `${spacing.lg} ${spacing.xl}`,
      fontSize: '18px',
    },
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'translateY(-3px)',
    boxShadow: variant === 'primary' ? '0 12px 35px rgba(102, 126, 234, 0.5)' : '0 8px 25px rgba(102, 126, 234, 0.3)',
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      disabled={disabled}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, {
          transform: 'translateY(0)',
          boxShadow: variantStyles[variant].boxShadow,
        });
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};
