import React from 'react';
import { colors } from '../styles/tokens';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = colors.primary,
  className,
  style
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '32px';
    }
  };

  const spinnerSize = getSize();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        minHeight: '200px',
        ...style
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid rgba(102, 126, 234, 0.1)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
