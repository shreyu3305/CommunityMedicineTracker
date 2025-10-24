import React, { useState, useEffect, useRef, useCallback } from 'react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface KeyboardNavigationProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  wrap?: boolean;
  disabled?: boolean;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right', index: number) => void;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  onEnter?: (index: number) => void;
  onSpace?: (index: number) => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  style?: React.CSSProperties;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  orientation = 'both',
  loop = true,
  wrap = true,
  disabled = false,
  onNavigate,
  onSelect,
  onEscape,
  onEnter,
  onSpace,
  onHome,
  onEnd,
  onPageUp,
  onPageDown,
  style
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="menuitem"]',
      '[role="option"]',
      '[role="tab"]',
      '[role="gridcell"]'
    ].join(', ');
    
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors));
  }, []);

  const getNextIndex = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const elements = getFocusableElements();
    if (elements.length === 0) return 0;

    let nextIndex = activeIndex;

    switch (direction) {
      case 'down':
      case 'right':
        nextIndex = activeIndex + 1;
        break;
      case 'up':
      case 'left':
        nextIndex = activeIndex - 1;
        break;
    }

    if (loop) {
      if (nextIndex >= elements.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = elements.length - 1;
    } else {
      nextIndex = Math.max(0, Math.min(elements.length - 1, nextIndex));
    }

    return nextIndex;
  }, [activeIndex, getFocusableElements, loop]);

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (disabled) return;

    const nextIndex = getNextIndex(direction);
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
      onNavigate?.(direction, nextIndex);
      setIsNavigating(true);
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [activeIndex, getNextIndex, disabled, onNavigate]);

  const select = useCallback(() => {
    if (disabled) return;
    
    onSelect?.(activeIndex);
    const elements = getFocusableElements();
    const element = elements[activeIndex] as HTMLElement;
    if (element) {
      element.click();
    }
  }, [activeIndex, disabled, onSelect, getFocusableElements]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    const { key, ctrlKey, altKey, metaKey } = e;

    // Prevent default behavior for navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(key)) {
      e.preventDefault();
    }

    switch (key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          navigate('up');
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          navigate('down');
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          navigate('left');
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          navigate('right');
        }
        break;
      case 'Enter':
        e.preventDefault();
        onEnter?.(activeIndex);
        select();
        break;
      case ' ':
        e.preventDefault();
        onSpace?.(activeIndex);
        select();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'Home':
        if (ctrlKey) {
          e.preventDefault();
          onHome?.();
        }
        break;
      case 'End':
        if (ctrlKey) {
          e.preventDefault();
          onEnd?.();
        }
        break;
      case 'PageUp':
        onPageUp?.();
        break;
      case 'PageDown':
        onPageDown?.();
        break;
    }
  }, [disabled, orientation, navigate, activeIndex, onEnter, onSpace, onEscape, onHome, onEnd, onPageUp, onPageDown, select]);

  // Focus management
  useEffect(() => {
    const elements = getFocusableElements();
    const element = elements[activeIndex] as HTMLElement;
    if (element) {
      element.focus();
    }
  }, [activeIndex, getFocusableElements]);

  // Update active index when focus changes
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const elements = getFocusableElements();
      const index = elements.indexOf(e.target as Element);
      if (index !== -1) {
        setActiveIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('focusin', handleFocusIn);
      return () => container.removeEventListener('focusin', handleFocusIn);
    }
  }, [getFocusableElements]);

  const containerStyles: React.CSSProperties = {
    outline: 'none',
    ...style
  };

  return (
    <div
      ref={containerRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

// Menu with keyboard navigation
export const KeyboardMenu: React.FC<{
  children: React.ReactNode;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  style?: React.CSSProperties;
}> = ({ children, onSelect, onEscape, style }) => (
  <KeyboardNavigation
    orientation="vertical"
    onSelect={onSelect}
    onEscape={onEscape}
    style={style}
  >
    {children}
  </KeyboardNavigation>
);

// Grid with keyboard navigation
export const KeyboardGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  style?: React.CSSProperties;
}> = ({ children, columns = 3, onSelect, onEscape, style }) => (
  <KeyboardNavigation
    orientation="both"
    onSelect={onSelect}
    onEscape={onEscape}
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: spacing.md,
      ...style
    }}
  >
    {children}
  </KeyboardNavigation>
);

// List with keyboard navigation
export const KeyboardList: React.FC<{
  children: React.ReactNode;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  style?: React.CSSProperties;
}> = ({ children, onSelect, onEscape, style }) => (
  <KeyboardNavigation
    orientation="vertical"
    onSelect={onSelect}
    onEscape={onEscape}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
      ...style
    }}
  >
    {children}
  </KeyboardNavigation>
);

// Tab navigation
export const KeyboardTabs: React.FC<{
  children: React.ReactNode;
  activeTab?: number;
  onTabChange?: (index: number) => void;
  onEscape?: () => void;
  style?: React.CSSProperties;
}> = ({ children, activeTab = 0, onTabChange, onEscape, style }) => {
  const [active, setActive] = useState(activeTab);

  const handleTabChange = (index: number) => {
    setActive(index);
    onTabChange?.(index);
  };

  return (
    <KeyboardNavigation
      orientation="horizontal"
      activeIndex={active}
      onSelect={handleTabChange}
      onEscape={onEscape}
      style={{
        display: 'flex',
        gap: spacing.sm,
        ...style
      }}
    >
      {children}
    </KeyboardNavigation>
  );
};

// Focus trap for modals
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onEscape?: () => void;
  style?: React.CSSProperties;
}> = ({ children, active = true, onEscape, style }) => {
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
    <div ref={containerRef} style={style}>
      {children}
    </div>
  );
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (options: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  disabled?: boolean;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right', index: number) => void;
  onSelect?: (index: number) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (options.disabled) return;

    const nextIndex = activeIndex + (direction === 'down' || direction === 'right' ? 1 : -1);
    
    if (options.loop) {
      setActiveIndex(nextIndex);
    } else {
      setActiveIndex(Math.max(0, nextIndex));
    }

    options.onNavigate?.(direction, nextIndex);
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 100);
  }, [activeIndex, options]);

  const select = useCallback(() => {
    if (options.disabled) return;
    options.onSelect?.(activeIndex);
  }, [activeIndex, options]);

  return {
    activeIndex,
    isNavigating,
    navigate,
    select,
    setActiveIndex
  };
};

// Keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const modifier = e.ctrlKey ? 'ctrl+' : e.altKey ? 'alt+' : e.metaKey ? 'meta+' : '';
      const shortcut = `${modifier}${key}`;
      
      if (shortcuts[shortcut]) {
        e.preventDefault();
        shortcuts[shortcut]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Accessible button with keyboard support
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, onClick, disabled, pressed, expanded, controls, describedBy, label, style }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
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
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  );
};
