import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type TooltipVariant = 'default' | 'info' | 'warning' | 'success' | 'error';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  maxWidth?: number;
  showArrow?: boolean;
  trigger?: 'hover' | 'click' | 'focus';
  persistent?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  variant = 'default',
  position = 'auto',
  delay = 300,
  disabled = false,
  maxWidth = 300,
  showArrow = true,
  trigger = 'hover',
  persistent = false,
  style,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState<TooltipPosition>(position);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const getVariantStyles = (variant: TooltipVariant) => {
    const variants = {
      default: {
        backgroundColor: colors.neutral[900],
        color: 'white',
        border: `1px solid ${colors.neutral[700]}`,
        icon: <Info size={16} />
      },
      info: {
        backgroundColor: colors.info,
        color: 'white',
        border: `1px solid ${colors.info}`,
        icon: <Info size={16} />
      },
      warning: {
        backgroundColor: colors.warning,
        color: 'white',
        border: `1px solid ${colors.warning}`,
        icon: <AlertTriangle size={16} />
      },
      success: {
        backgroundColor: colors.success,
        color: 'white',
        border: `1px solid ${colors.success}`,
        icon: <CheckCircle size={16} />
      },
      error: {
        backgroundColor: colors.error,
        color: 'white',
        border: `1px solid ${colors.error}`,
        icon: <X size={16} />
      }
    };
    return variants[variant];
  };

  const calculatePosition = (triggerRect: DOMRect, tooltipRect: DOMRect): TooltipPosition => {
    if (position !== 'auto') return position;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const space = {
      top: triggerRect.top,
      bottom: viewport.height - triggerRect.bottom,
      left: triggerRect.left,
      right: viewport.width - triggerRect.right
    };

    // Prefer top, then bottom, then right, then left
    if (space.top >= tooltipRect.height + 10) return 'top';
    if (space.bottom >= tooltipRect.height + 10) return 'bottom';
    if (space.right >= tooltipRect.width + 10) return 'right';
    if (space.left >= tooltipRect.width + 10) return 'left';
    
    return 'top'; // fallback
  };

  const getTooltipPosition = (pos: TooltipPosition, triggerRect: DOMRect, tooltipRect: DOMRect) => {
    const gap = 8;
    
    switch (pos) {
      case 'top':
        return {
          top: triggerRect.top - tooltipRect.height - gap,
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: triggerRect.bottom + gap,
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
          left: triggerRect.left - tooltipRect.width - gap,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
          left: triggerRect.right + gap,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: 0, left: 0 };
    }
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current || !isVisible) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const finalPosition = calculatePosition(triggerRect, tooltipRect);
    setCalculatedPosition(finalPosition);
    
    const positionStyle = getTooltipPosition(finalPosition, triggerRect, tooltipRect);
    setTooltipStyle(positionStyle);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible]);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!persistent) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (trigger === 'focus' && (e.key === 'Escape')) {
      setIsVisible(false);
    }
  };

  const variantStyles = getVariantStyles(variant);

  const tooltipContainerStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1000,
    maxWidth: `${maxWidth}px`,
    ...tooltipStyle,
    ...style
  };

  const tooltipStyles: React.CSSProperties = {
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    border: variantStyles.border,
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.4,
    boxShadow: shadows.lg,
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.xs,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    transition: 'all 0.2s ease',
    pointerEvents: 'none',
    wordWrap: 'break-word'
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '6px solid transparent'
  };

  const getArrowStyles = (pos: TooltipPosition): React.CSSProperties => {
    const arrowColor = variantStyles.backgroundColor;
    
    switch (pos) {
      case 'top':
        return {
          ...arrowStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: arrowColor,
          borderBottom: 'none'
        };
      case 'bottom':
        return {
          ...arrowStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: arrowColor,
          borderTop: 'none'
        };
      case 'left':
        return {
          ...arrowStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: arrowColor,
          borderRight: 'none'
        };
      case 'right':
        return {
          ...arrowStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: arrowColor,
          borderLeft: 'none'
        };
      default:
        return {};
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
        onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
        onFocus={trigger === 'focus' ? showTooltip : undefined}
        onBlur={trigger === 'focus' ? hideTooltip : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ display: 'inline-block', position: 'relative' }}
        className={className}
      >
        {children}
      </div>

      {isVisible && (
        <div ref={tooltipRef} style={tooltipContainerStyles}>
          <div style={tooltipStyles}>
            {variant !== 'default' && (
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {variantStyles.icon}
              </span>
            )}
            <div style={{ flex: 1 }}>
              {content}
            </div>
          </div>
          {showArrow && (
            <div style={getArrowStyles(calculatedPosition)} />
          )}
        </div>
      )}
    </>
  );
};

// Specialized tooltip components for common use cases
export const InfoTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip {...props} variant="info" />
);

export const WarningTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip {...props} variant="warning" />
);

export const SuccessTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip {...props} variant="success" />
);

export const ErrorTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip {...props} variant="error" />
);

// Help icon with tooltip
export const HelpIcon: React.FC<{
  content: string | React.ReactNode;
  variant?: TooltipVariant;
  size?: number;
  style?: React.CSSProperties;
}> = ({ content, variant = 'default', size = 16, style }) => (
  <Tooltip content={content} variant={variant} trigger="hover">
    <HelpCircle 
      size={size} 
      color={colors.neutral[500]} 
      style={{ cursor: 'help', ...style }}
    />
  </Tooltip>
);

// Tooltip for form fields
export const FieldTooltip: React.FC<{
  content: string | React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
}> = ({ content, children, variant = 'default' }) => (
  <Tooltip 
    content={content} 
    variant={variant} 
    trigger="focus" 
    position="right"
    maxWidth={250}
  >
    {children}
  </Tooltip>
);

// Tooltip for buttons
export const ButtonTooltip: React.FC<{
  content: string | React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  disabled?: boolean;
}> = ({ content, children, variant = 'default', disabled = false }) => (
  <Tooltip 
    content={content} 
    variant={variant} 
    trigger="hover" 
    position="top"
    disabled={disabled}
  >
    {children}
  </Tooltip>
);
