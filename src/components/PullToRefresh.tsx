import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  threshold = 80,
  resistance = 0.5,
  disabled = false,
  children,
  style
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isDragging.current) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only allow pull to refresh when at the top of the page
    if (scrollTop === 0 && currentY > startY) {
      e.preventDefault();
      
      const distance = (currentY - startY) * resistance;
      setPullDistance(distance);
      setCurrentY(currentY);
      
      if (distance > threshold) {
        setCanRefresh(true);
        setIsPulling(true);
      } else {
        setCanRefresh(false);
        setIsPulling(false);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !isDragging.current) return;
    
    isDragging.current = false;
    
    if (canRefresh && pullDistance > threshold) {
      setIsRefreshing(true);
      setIsPulling(false);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRefresh(false);
      }
    } else {
      // Reset if not enough pull distance
      setPullDistance(0);
      setIsPulling(false);
      setCanRefresh(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isRefreshing) return;
    
    setStartY(e.clientY);
    setCurrentY(e.clientY);
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || isRefreshing || !isDragging.current) return;
    
    const currentY = e.clientY;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop === 0 && currentY > startY) {
      e.preventDefault();
      
      const distance = (currentY - startY) * resistance;
      setPullDistance(distance);
      setCurrentY(currentY);
      
      if (distance > threshold) {
        setCanRefresh(true);
        setIsPulling(true);
      } else {
        setCanRefresh(false);
        setIsPulling(false);
      }
    }
  };

  const handleMouseUp = () => {
    if (disabled || isRefreshing || !isDragging.current) return;
    
    isDragging.current = false;
    
    if (canRefresh && pullDistance > threshold) {
      handleRefresh();
    } else {
      setPullDistance(0);
      setIsPulling(false);
      setCanRefresh(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsPulling(false);
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
      setCanRefresh(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isDragging.current = false;
    };
  }, []);

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;
  const scale = 0.5 + (progress * 0.5);

  const refreshIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: `${threshold}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isRefreshing ? colors.primary + '10' : 'transparent',
    transform: `translateY(${Math.max(0, pullDistance - threshold)}px)`,
    transition: isRefreshing ? 'transform 0.3s ease' : 'none',
    zIndex: 1000
  };

  const iconStyles: React.CSSProperties = {
    transform: `rotate(${rotation}deg) scale(${scale})`,
    transition: isRefreshing ? 'transform 0.3s ease' : 'none',
    color: canRefresh ? colors.primary : colors.neutral[500]
  };

  const textStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: canRefresh ? colors.primary : colors.neutral[600],
    marginTop: spacing.sm,
    opacity: progress > 0.3 ? 1 : 0,
    transition: 'opacity 0.2s ease'
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        ...style
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Refresh Indicator */}
      <div style={refreshIndicatorStyles}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.sm
        }}>
          {isRefreshing ? (
            <RefreshCw 
              size={24} 
              style={{
                ...iconStyles,
                animation: 'spin 1s linear infinite'
              }}
            />
          ) : (
            <ArrowDown 
              size={24} 
              style={iconStyles}
            />
          )}
          
          <div style={textStyles}>
            {isRefreshing 
              ? 'Refreshing...' 
              : canRefresh 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        transform: `translateY(${Math.max(0, pullDistance)}px)`,
        transition: isRefreshing ? 'transform 0.3s ease' : 'none'
      }}>
        {children}
      </div>

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

// Hook for pull to refresh functionality
export const usePullToRefresh = (onRefresh: () => Promise<void> | void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    handleRefresh
  };
};

// Simple pull to refresh for specific elements
export const SimplePullToRefresh: React.FC<{
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ onRefresh, children, style }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      {isRefreshing && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.primary + '10',
          zIndex: 1000
        }}>
          <RefreshCw 
            size={20} 
            style={{
              animation: 'spin 1s linear infinite',
              color: colors.primary
            }}
          />
        </div>
      )}
      
      <div style={{
        transform: isRefreshing ? 'translateY(60px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}>
        {children}
      </div>
      
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
