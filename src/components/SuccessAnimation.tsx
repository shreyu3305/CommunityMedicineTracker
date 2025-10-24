import React, { useState, useEffect } from 'react';
import { CheckCircle, Check, Star, Heart, Zap, Trophy, Gift, Sparkles } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type AnimationType = 'check' | 'star' | 'heart' | 'zap' | 'trophy' | 'gift' | 'sparkles';

export interface SuccessAnimationProps {
  isVisible: boolean;
  type?: AnimationType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  subMessage?: string;
  duration?: number;
  onComplete?: () => void;
  style?: React.CSSProperties;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  type = 'check',
  size = 'lg',
  message = 'Success!',
  subMessage,
  duration = 2000,
  onComplete,
  style
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Show message after animation starts
      setTimeout(() => setShowMessage(true), 300);
      
      // Complete animation after duration
      setTimeout(() => {
        setIsAnimating(false);
        setShowMessage(false);
        onComplete?.();
      }, duration);
    }
  }, [isVisible, duration, onComplete]);

  const getIcon = () => {
    const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64;
    
    const icons = {
      check: <CheckCircle size={iconSize} />,
      star: <Star size={iconSize} />,
      heart: <Heart size={iconSize} />,
      zap: <Zap size={iconSize} />,
      trophy: <Trophy size={iconSize} />,
      gift: <Gift size={iconSize} />,
      sparkles: <Sparkles size={iconSize} />
    };
    
    return icons[type];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        container: { width: '80px', height: '80px' },
        icon: { fontSize: '24px' },
        message: { fontSize: '14px' },
        subMessage: { fontSize: '12px' }
      },
      md: {
        container: { width: '120px', height: '120px' },
        icon: { fontSize: '32px' },
        message: { fontSize: '16px' },
        subMessage: { fontSize: '13px' }
      },
      lg: {
        container: { width: '160px', height: '160px' },
        icon: { fontSize: '48px' },
        message: { fontSize: '20px' },
        subMessage: { fontSize: '14px' }
      },
      xl: {
        container: { width: '200px', height: '200px' },
        icon: { fontSize: '64px' },
        message: { fontSize: '24px' },
        subMessage: { fontSize: '16px' }
      }
    };
    
    return sizes[size];
  };

  const sizeStyles = getSizeStyles();

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: spacing.md,
    ...style
  };

  const iconContainerStyles: React.CSSProperties = {
    ...sizeStyles.container,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    background: isAnimating ? colors.success : 'transparent',
    color: isAnimating ? 'white' : colors.success,
    transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.3s ease',
    boxShadow: isAnimating ? shadows.lg : shadows.sm,
    position: 'relative',
    overflow: 'hidden'
  };

  const messageStyles: React.CSSProperties = {
    fontSize: sizeStyles.message.fontSize,
    fontWeight: 700,
    color: colors.success,
    margin: 0,
    opacity: showMessage ? 1 : 0,
    transform: showMessage ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease'
  };

  const subMessageStyles: React.CSSProperties = {
    fontSize: sizeStyles.subMessage.fontSize,
    color: colors.neutral[600],
    margin: 0,
    opacity: showMessage ? 1 : 0,
    transform: showMessage ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease',
    transitionDelay: '0.1s'
  };

  if (!isVisible && !isAnimating) return null;

  return (
    <div style={containerStyles}>
      <div style={iconContainerStyles}>
        {getIcon()}
        
        {/* Ripple effect */}
        {isAnimating && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            borderRadius: borderRadius.full,
            background: colors.success + '20',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple 0.6s ease-out'
          }} />
        )}
      </div>
      
      {showMessage && (
        <div>
          <h3 style={messageStyles}>{message}</h3>
          {subMessage && (
            <p style={subMessageStyles}>{subMessage}</p>
          )}
        </div>
      )}
      
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

// Confetti animation
export const ConfettiAnimation: React.FC<{
  isVisible: boolean;
  duration?: number;
  onComplete?: () => void;
  style?: React.CSSProperties;
}> = ({
  isVisible,
  duration = 3000,
  onComplete,
  style
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Create confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: [colors.primary, colors.success, colors.warning, colors.error, colors.info][
          Math.floor(Math.random() * 5)
        ],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2
        }
      }));
      
      setParticles(newParticles);
      
      // Clean up after duration
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000,
      ...style
    }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            borderRadius: borderRadius.sm,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confettiFall ${duration}ms linear forwards`
          }}
        />
      ))}
      
      <style>
        {`
          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

// Bounce animation
export const BounceAnimation: React.FC<{
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
  onComplete?: () => void;
  style?: React.CSSProperties;
}> = ({
  isVisible,
  children,
  duration = 1000,
  onComplete,
  style
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, duration);
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        animation: isAnimating ? `bounce ${duration}ms ease-out` : 'none',
        ...style
      }}
    >
      {children}
      
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              transform: translate3d(0, -30px, 0);
            }
            70% {
              transform: translate3d(0, -15px, 0);
            }
            90% {
              transform: translate3d(0, -4px, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

// Pulse animation
export const PulseAnimation: React.FC<{
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
  onComplete?: () => void;
  style?: React.CSSProperties;
}> = ({
  isVisible,
  children,
  duration = 1500,
  onComplete,
  style
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, duration);
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        animation: isAnimating ? `pulse ${duration}ms ease-in-out` : 'none',
        ...style
      }}
    >
      {children}
      
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

// Success notification with animation
export const SuccessNotification: React.FC<{
  isVisible: boolean;
  title: string;
  message?: string;
  type?: AnimationType;
  duration?: number;
  onClose?: () => void;
  style?: React.CSSProperties;
}> = ({
  isVisible,
  title,
  message,
  type = 'check',
  duration = 3000,
  onClose,
  style
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: spacing.lg,
      right: spacing.lg,
      background: 'white',
      borderRadius: borderRadius.lg,
      boxShadow: shadows.lg,
      border: `1px solid ${colors.success}40`,
      padding: spacing.lg,
      maxWidth: '400px',
      zIndex: 1000,
      animation: 'slideInRight 0.3s ease-out',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <SuccessAnimation
          isVisible={true}
          type={type}
          size="sm"
          duration={1000}
        />
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.neutral[800],
            margin: 0
          }}>
            {title}
          </h4>
          {message && (
            <p style={{
              fontSize: '14px',
              color: colors.neutral[600],
              margin: 0,
              marginTop: spacing.xs
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes slideInRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
