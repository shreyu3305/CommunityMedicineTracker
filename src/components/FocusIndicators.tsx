import React, { useState, useEffect, useRef } from 'react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface FocusIndicatorsProps {
  children: React.ReactNode;
  variant?: 'default' | 'ring' | 'underline' | 'highlight' | 'outline';
  color?: string;
  thickness?: number;
  offset?: number;
  animated?: boolean;
  visible?: boolean;
  style?: React.CSSProperties;
}

export const FocusIndicators: React.FC<FocusIndicatorsProps> = ({
  children,
  variant = 'default',
  color = colors.primary,
  thickness = 2,
  offset = 2,
  animated = true,
  visible = true,
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [focusPosition, setFocusPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (container.contains(target)) {
        setIsFocused(true);
        updateFocusPosition(target);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (container.contains(target)) {
        setIsFocused(false);
      }
    };

    const updateFocusPosition = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      setFocusPosition({
        x: rect.left - containerRect.left - offset,
        y: rect.top - containerRect.top - offset,
        width: rect.width + (offset * 2),
        height: rect.height + (offset * 2)
      });
    };

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, [offset]);

  const getFocusStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      zIndex: 1000,
      transition: animated ? 'all 0.2s ease' : 'none'
    };

    switch (variant) {
      case 'ring':
        return {
          ...baseStyles,
          left: focusPosition.x,
          top: focusPosition.y,
          width: focusPosition.width,
          height: focusPosition.height,
          border: `${thickness}px solid ${color}`,
          borderRadius: borderRadius.md,
          boxShadow: `0 0 0 ${thickness}px ${color}40`
        };
      case 'underline':
        return {
          ...baseStyles,
          left: focusPosition.x,
          top: focusPosition.y + focusPosition.height - thickness,
          width: focusPosition.width,
          height: thickness,
          backgroundColor: color,
          borderRadius: borderRadius.sm
        };
      case 'highlight':
        return {
          ...baseStyles,
          left: focusPosition.x,
          top: focusPosition.y,
          width: focusPosition.width,
          height: focusPosition.height,
          backgroundColor: color + '20',
          borderRadius: borderRadius.md
        };
      case 'outline':
        return {
          ...baseStyles,
          left: focusPosition.x,
          top: focusPosition.y,
          width: focusPosition.width,
          height: focusPosition.height,
          border: `${thickness}px solid ${color}`,
          borderRadius: borderRadius.md
        };
      default:
        return {
          ...baseStyles,
          left: focusPosition.x,
          top: focusPosition.y,
          width: focusPosition.width,
          height: focusPosition.height,
          border: `${thickness}px solid ${color}`,
          borderRadius: borderRadius.md,
          boxShadow: `0 0 0 ${thickness}px ${color}40`
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    ...style
  };

  return (
    <div ref={containerRef} style={containerStyles}>
      {children}
      {isFocused && visible && (
        <div
          ref={focusRef}
          style={getFocusStyles()}
        />
      )}
    </div>
  );
};

// Focus ring component
export const FocusRing: React.FC<{
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  offset?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color, thickness, offset, animated, style }) => (
  <FocusIndicators
    variant="ring"
    color={color}
    thickness={thickness}
    offset={offset}
    animated={animated}
    style={style}
  >
    {children}
  </FocusIndicators>
);

// Focus underline component
export const FocusUnderline: React.FC<{
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  offset?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color, thickness, offset, animated, style }) => (
  <FocusIndicators
    variant="underline"
    color={color}
    thickness={thickness}
    offset={offset}
    animated={animated}
    style={style}
  >
    {children}
  </FocusIndicators>
);

// Focus highlight component
export const FocusHighlight: React.FC<{
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  offset?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color, thickness, offset, animated, style }) => (
  <FocusIndicators
    variant="highlight"
    color={color}
    thickness={thickness}
    offset={offset}
    animated={animated}
    style={style}
  >
    {children}
  </FocusIndicators>
);

// Focus outline component
export const FocusOutline: React.FC<{
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  offset?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color, thickness, offset, animated, style }) => (
  <FocusIndicators
    variant="outline"
    color={color}
    thickness={thickness}
    offset={offset}
    animated={animated}
    style={style}
  >
    {children}
  </FocusIndicators>
);

// Accessible button with focus indicators
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
  label?: string;
  focusVariant?: 'default' | 'ring' | 'underline' | 'highlight' | 'outline';
  focusColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  onClick,
  disabled,
  pressed,
  expanded,
  controls,
  describedBy,
  label,
  focusVariant = 'ring',
  focusColor,
  style
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const buttonStyles: React.CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    background: 'transparent',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    ...style
  };

  return (
    <FocusIndicators
      variant={focusVariant}
      color={focusColor}
    >
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        aria-pressed={pressed}
        aria-expanded={expanded}
        aria-controls={controls}
        aria-describedby={describedBy}
        aria-label={label}
        style={buttonStyles}
      >
        {children}
      </button>
    </FocusIndicators>
  );
};

// Accessible input with focus indicators
export const AccessibleInput: React.FC<{
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  focusVariant?: 'default' | 'ring' | 'underline' | 'highlight' | 'outline';
  focusColor?: string;
  style?: React.CSSProperties;
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  describedBy,
  required,
  invalid,
  disabled,
  readOnly,
  focusVariant = 'ring',
  focusColor,
  style
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    border: `1px solid ${invalid ? colors.error : colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    ...style
  };

  return (
    <FocusIndicators
      variant={focusVariant}
      color={focusColor}
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-label={label}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        style={inputStyles}
      />
    </FocusIndicators>
  );
};

// Focus trap with focus indicators
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onEscape?: () => void;
  focusVariant?: 'default' | 'ring' | 'underline' | 'highlight' | 'outline';
  focusColor?: string;
  style?: React.CSSProperties;
}> = ({ children, active = true, onEscape, focusVariant = 'ring', focusColor, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the trap
    const focusableElements = containerRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, onEscape]);

  if (!active) return <>{children}</>;

  return (
    <FocusIndicators
      variant={focusVariant}
      color={focusColor}
      style={style}
    >
      <div ref={containerRef}>
        {children}
      </div>
    </FocusIndicators>
  );
};

// Focus management hook
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);

  const focus = (element: HTMLElement) => {
    element.focus();
    setFocusedElement(element);
    setFocusHistory(prev => [...prev, element]);
  };

  const focusNext = () => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(focusedElement!);
    const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
    
    if (nextElement) {
      focus(nextElement);
    }
  };

  const focusPrevious = () => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(focusedElement!);
    const previousElement = focusableElements[currentIndex - 1] as HTMLElement;
    
    if (previousElement) {
      focus(previousElement);
    }
  };

  const focusFirst = () => {
    const firstElement = document.querySelector(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstElement) {
      focus(firstElement);
    }
  };

  const focusLast = () => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (lastElement) {
      focus(lastElement);
    }
  };

  return {
    focusedElement,
    focusHistory,
    focus,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  };
};
