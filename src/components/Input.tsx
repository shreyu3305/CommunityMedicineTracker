import React from 'react';
import { colors, borderRadius, spacing, transitions } from '../styles/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.text.secondary,
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: icon ? `${spacing.md} ${spacing.md} ${spacing.md} 48px` : `${spacing.md} ${spacing.md}`,
    fontSize: '16px',
    border: `2px solid ${error ? colors.error : isFocused ? colors.primary : colors.border.light}`,
    borderRadius: borderRadius.lg,
    outline: 'none',
    transition: transitions.base,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: spacing.md,
    color: isFocused ? colors.primary : colors.text.tertiary,
    display: 'flex',
    alignItems: 'center',
    transition: transitions.base,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.error,
    marginTop: spacing.xs,
  };

  return (
    <div style={wrapperStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputContainerStyles}>
        {icon && <div style={iconStyles}>{icon}</div>}
        <input
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};
