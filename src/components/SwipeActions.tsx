import React, { useState, useRef, useEffect } from 'react';
import { Heart, Star, Flag, Trash2, Edit, Share2, Phone, MapPin } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  background?: string;
  action: () => void;
}

export interface SwipeActionsProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
  onSwipe?: (direction: 'left' | 'right', action: SwipeAction) => void;
  style?: React.CSSProperties;
}

export const SwipeActions: React.FC<SwipeActionsProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 100,
  resistance = 0.5,
  disabled = false,
  onSwipe,
  style
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDirection, setActiveDirection] = useState<'left' | 'right' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setCurrentX(touch.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const newTranslateX = deltaX * resistance;
    
    setCurrentX(touch.clientX);
    setTranslateX(newTranslateX);
    
    // Determine direction and show appropriate actions
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0 && leftActions.length > 0) {
        setActiveDirection('left');
      } else if (deltaX < 0 && rightActions.length > 0) {
        setActiveDirection('right');
      } else {
        setActiveDirection(null);
      }
    } else {
      setActiveDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (disabled || !isDragging) return;
    
    setIsDragging(false);
    
    const deltaX = currentX - startX;
    const absDeltaX = Math.abs(deltaX);
    
    if (absDeltaX > threshold) {
      // Swipe threshold reached
      if (deltaX > 0 && leftActions.length > 0) {
        // Swiped right - show left actions
        setTranslateX(leftActions.length * 80);
        setIsOpen(true);
        setActiveDirection('left');
      } else if (deltaX < 0 && rightActions.length > 0) {
        // Swiped left - show right actions
        setTranslateX(-rightActions.length * 80);
        setIsOpen(true);
        setActiveDirection('right');
      }
    } else {
      // Reset position
      setTranslateX(0);
      setIsOpen(false);
      setActiveDirection(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !isDragging) return;
    
    const deltaX = e.clientX - startX;
    const newTranslateX = deltaX * resistance;
    
    setCurrentX(e.clientX);
    setTranslateX(newTranslateX);
    
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0 && leftActions.length > 0) {
        setActiveDirection('left');
      } else if (deltaX < 0 && rightActions.length > 0) {
        setActiveDirection('right');
      } else {
        setActiveDirection(null);
      }
    } else {
      setActiveDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (disabled || !isDragging) return;
    
    setIsDragging(false);
    
    const deltaX = currentX - startX;
    const absDeltaX = Math.abs(deltaX);
    
    if (absDeltaX > threshold) {
      if (deltaX > 0 && leftActions.length > 0) {
        setTranslateX(leftActions.length * 80);
        setIsOpen(true);
        setActiveDirection('left');
      } else if (deltaX < 0 && rightActions.length > 0) {
        setTranslateX(-rightActions.length * 80);
        setIsOpen(true);
        setActiveDirection('right');
      }
    } else {
      setTranslateX(0);
      setIsOpen(false);
      setActiveDirection(null);
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    action.action();
    onSwipe?.(activeDirection!, action);
    closeActions();
  };

  const closeActions = () => {
    setTranslateX(0);
    setIsOpen(false);
    setActiveDirection(null);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeActions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const renderActions = (actions: SwipeAction[], direction: 'left' | 'right') => {
    if (actions.length === 0) return null;

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [direction]: 0,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1
      }}>
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            style={{
              width: '80px',
              height: '100%',
              background: action.background || colors.primary,
              color: action.color || 'white',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              opacity: isOpen && activeDirection === direction ? 1 : 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = isOpen && activeDirection === direction ? 1 : 0.8;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: borderRadius.md,
    ...style
  };

  const contentStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    background: 'white',
    transform: `translateX(${translateX}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div
      ref={containerRef}
      style={containerStyles}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Actions */}
      {renderActions(leftActions, 'left')}
      
      {/* Right Actions */}
      {renderActions(rightActions, 'right')}
      
      {/* Content */}
      <div ref={contentRef} style={contentStyles}>
        {children}
      </div>
    </div>
  );
};

// Predefined action sets
export const createPharmacyActions = (onCall: () => void, onDirections: () => void, onReport: () => void): SwipeAction[] => [
  {
    id: 'call',
    label: 'Call',
    icon: <Phone size={16} />,
    color: 'white',
    background: colors.success,
    action: onCall
  },
  {
    id: 'directions',
    label: 'Directions',
    icon: <MapPin size={16} />,
    color: 'white',
    background: colors.primary,
    action: onDirections
  },
  {
    id: 'report',
    label: 'Report',
    icon: <Flag size={16} />,
    color: 'white',
    background: colors.warning,
    action: onReport
  }
];

export const createMedicineActions = (onFavorite: () => void, onShare: () => void, onReport: () => void): SwipeAction[] => [
  {
    id: 'favorite',
    label: 'Favorite',
    icon: <Heart size={16} />,
    color: 'white',
    background: colors.error,
    action: onFavorite
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 size={16} />,
    color: 'white',
    background: colors.info,
    action: onShare
  },
  {
    id: 'report',
    label: 'Report',
    icon: <Flag size={16} />,
    color: 'white',
    background: colors.warning,
    action: onReport
  }
];

export const createReviewActions = (onEdit: () => void, onDelete: () => void, onReport: () => void): SwipeAction[] => [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit size={16} />,
    color: 'white',
    background: colors.primary,
    action: onEdit
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 size={16} />,
    color: 'white',
    background: colors.error,
    action: onDelete
  },
  {
    id: 'report',
    label: 'Report',
    icon: <Flag size={16} />,
    color: 'white',
    background: colors.warning,
    action: onReport
  }
];

// Swipeable card component
export const SwipeableCard: React.FC<{
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right', action: SwipeAction) => void;
  style?: React.CSSProperties;
}> = ({ children, leftActions, rightActions, onSwipe, style }) => {
  return (
    <SwipeActions
      leftActions={leftActions}
      rightActions={rightActions}
      onSwipe={onSwipe}
      style={{
        borderRadius: borderRadius.lg,
        boxShadow: shadows.sm,
        ...style
      }}
    >
      {children}
    </SwipeActions>
  );
};

// Hook for swipe actions
export const useSwipeActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDirection, setActiveDirection] = useState<'left' | 'right' | null>(null);

  const openActions = (direction: 'left' | 'right') => {
    setActiveDirection(direction);
    setIsOpen(true);
  };

  const closeActions = () => {
    setActiveDirection(null);
    setIsOpen(false);
  };

  const toggleActions = (direction: 'left' | 'right') => {
    if (isOpen && activeDirection === direction) {
      closeActions();
    } else {
      openActions(direction);
    }
  };

  return {
    isOpen,
    activeDirection,
    openActions,
    closeActions,
    toggleActions
  };
};
