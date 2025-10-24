import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Phone, MapPin, Flag, Heart, Share2, Edit, Camera, Mic } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  background?: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  actions?: FABAction[];
  variant?: 'default' | 'extended' | 'mini';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  background?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = <Plus size={24} />,
  label,
  onClick,
  actions = [],
  variant = 'default',
  position = 'bottom-right',
  size = 'medium',
  color = 'white',
  background = colors.primary,
  disabled = false,
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (disabled) return;
    
    if (actions.length > 0) {
      setIsOpen(!isOpen);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      onClick?.();
    }
  };

  const handleActionClick = (action: FABAction) => {
    if (action.disabled) return;
    
    action.onClick();
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getPositionStyles = () => {
    const positions = {
      'bottom-right': { bottom: spacing.lg, right: spacing.lg },
      'bottom-left': { bottom: spacing.lg, left: spacing.lg },
      'top-right': { top: spacing.lg, right: spacing.lg },
      'top-left': { top: spacing.lg, left: spacing.lg },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    return positions[position];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { width: '40px', height: '40px', fontSize: '16px' },
      medium: { width: '56px', height: '56px', fontSize: '20px' },
      large: { width: '72px', height: '72px', fontSize: '24px' }
    };

    return sizes[size];
  };

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      borderRadius: borderRadius.full,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      fontWeight: 600,
      transition: 'all 0.3s ease',
      zIndex: 1000,
      boxShadow: shadows.lg,
      ...getPositionStyles(),
      ...getSizeStyles()
    };

    switch (variant) {
      case 'extended':
        return {
          ...baseStyles,
          borderRadius: borderRadius.xl,
          padding: `0 ${spacing.lg}`,
          minWidth: 'auto'
        };
      case 'mini':
        return {
          ...baseStyles,
          width: '40px',
          height: '40px',
          fontSize: '16px'
        };
      default:
        return baseStyles;
    }
  };

  const getActionStyles = (index: number) => {
    const baseStyles = {
      position: 'absolute' as const,
      width: '48px',
      height: '48px',
      borderRadius: borderRadius.full,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      boxShadow: shadows.md,
      zIndex: 999
    };

    const positions = {
      'bottom-right': {
        bottom: `${60 + (index * 60)}px`,
        right: '0px'
      },
      'bottom-left': {
        bottom: `${60 + (index * 60)}px`,
        left: '0px'
      },
      'top-right': {
        top: `${60 + (index * 60)}px`,
        right: '0px'
      },
      'top-left': {
        top: `${60 + (index * 60)}px`,
        left: '0px'
      },
      'center': {
        bottom: `${60 + (index * 60)}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    };

    return {
      ...baseStyles,
      ...positions[position],
      opacity: isOpen ? 1 : 0,
      transform: isOpen 
        ? (position === 'center' ? 'translateX(-50%)' : 'scale(1)')
        : (position === 'center' ? 'translateX(-50%) scale(0)' : 'scale(0)'),
      pointerEvents: isOpen ? 'auto' : 'none'
    };
  };

  const getLabelStyles = () => {
    if (variant !== 'extended' || !label) return { display: 'none' };

    return {
      fontSize: '14px',
      fontWeight: 600,
      color: 'inherit',
      whiteSpace: 'nowrap' as const
    };
  };

  return (
    <div ref={fabRef} style={{ position: 'relative' }}>
      {/* Main FAB */}
      <button
        onClick={handleClick}
        style={{
          ...getVariantStyles(),
          background: disabled ? colors.neutral[300] : background,
          color: disabled ? colors.neutral[500] : color,
          ...style
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = isOpen ? 'rotate(45deg)' : 'scale(1.1)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = isOpen ? 'rotate(45deg)' : 'scale(1)';
            e.currentTarget.style.boxShadow = shadows.lg;
          }
        }}
      >
        {isOpen && actions.length > 0 ? <X size={20} /> : icon}
        <span style={getLabelStyles()}>{label}</span>
      </button>

      {/* Action Buttons */}
      {actions.map((action, index) => (
        <button
          key={action.id}
          onClick={() => handleActionClick(action)}
          style={{
            ...getActionStyles(index),
            background: action.background || colors.neutral[700],
            color: action.color || 'white',
            opacity: action.disabled ? 0.5 : 1,
            cursor: action.disabled ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!action.disabled) {
              e.currentTarget.style.transform = position === 'center' 
                ? 'translateX(-50%) scale(1.1)' 
                : 'scale(1.1)';
              e.currentTarget.style.boxShadow = shadows.lg;
            }
          }}
          onMouseLeave={(e) => {
            if (!action.disabled) {
              e.currentTarget.style.transform = position === 'center' 
                ? 'translateX(-50%) scale(1)' 
                : 'scale(1)';
              e.currentTarget.style.boxShadow = shadows.md;
            }
          }}
        >
          {action.icon}
        </button>
      ))}

      {/* Action Labels */}
      {isOpen && actions.map((action, index) => (
        <div
          key={`label-${action.id}`}
          style={{
            position: 'absolute',
            ...getActionStyles(index),
            background: 'transparent',
            color: colors.neutral[700],
            fontSize: '12px',
            fontWeight: 500,
            width: 'auto',
            height: 'auto',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.md,
            pointerEvents: 'none',
            zIndex: 998,
            ...(position === 'bottom-right' ? { right: '60px' } : {}),
            ...(position === 'bottom-left' ? { left: '60px' } : {}),
            ...(position === 'top-right' ? { right: '60px' } : {}),
            ...(position === 'top-left' ? { left: '60px' } : {}),
            ...(position === 'center' ? { left: '50%', transform: 'translateX(-50%)' } : {})
          }}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
};

// Predefined FAB actions
export const createReportActions = (
  onCall: () => void,
  onDirections: () => void,
  onFlag: () => void,
  onShare: () => void
): FABAction[] => [
  {
    id: 'call',
    label: 'Call',
    icon: <Phone size={16} />,
    background: colors.success,
    onClick: onCall
  },
  {
    id: 'directions',
    label: 'Directions',
    icon: <MapPin size={16} />,
    background: colors.primary,
    onClick: onDirections
  },
  {
    id: 'flag',
    label: 'Report',
    icon: <Flag size={16} />,
    background: colors.warning,
    onClick: onFlag
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 size={16} />,
    background: colors.info,
    onClick: onShare
  }
];

export const createMediaActions = (
  onCamera: () => void,
  onMic: () => void,
  onEdit: () => void,
  onShare: () => void
): FABAction[] => [
  {
    id: 'camera',
    label: 'Camera',
    icon: <Camera size={16} />,
    background: colors.primary,
    onClick: onCamera
  },
  {
    id: 'mic',
    label: 'Record',
    icon: <Mic size={16} />,
    background: colors.success,
    onClick: onMic
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit size={16} />,
    background: colors.warning,
    onClick: onEdit
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 size={16} />,
    background: colors.info,
    onClick: onShare
  }
];

// Simple FAB without actions
export const SimpleFAB: React.FC<{
  icon?: React.ReactNode;
  onClick: () => void;
  position?: FloatingActionButtonProps['position'];
  size?: FloatingActionButtonProps['size'];
  color?: string;
  background?: string;
  style?: React.CSSProperties;
}> = ({ icon, onClick, position, size, color, background, style }) => (
  <FloatingActionButton
    icon={icon}
    onClick={onClick}
    position={position}
    size={size}
    color={color}
    background={background}
    style={style}
  />
);

// Extended FAB with label
export const ExtendedFAB: React.FC<{
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  position?: FloatingActionButtonProps['position'];
  size?: FloatingActionButtonProps['size'];
  color?: string;
  background?: string;
  style?: React.CSSProperties;
}> = ({ icon, label, onClick, position, size, color, background, style }) => (
  <FloatingActionButton
    icon={icon}
    label={label}
    onClick={onClick}
    variant="extended"
    position={position}
    size={size}
    color={color}
    background={background}
    style={style}
  />
);

// Mini FAB
export const MiniFAB: React.FC<{
  icon?: React.ReactNode;
  onClick: () => void;
  position?: FloatingActionButtonProps['position'];
  color?: string;
  background?: string;
  style?: React.CSSProperties;
}> = ({ icon, onClick, position, color, background, style }) => (
  <FloatingActionButton
    icon={icon}
    onClick={onClick}
    variant="mini"
    position={position}
    color={color}
    background={background}
    style={style}
  />
);

// Hook for FAB state
export const useFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close
  };
};
