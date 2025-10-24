import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, Hand } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface TouchGesturesProps {
  children: React.ReactNode;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotate?: (angle: number, center: { x: number; y: number }) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onTap?: (point: { x: number; y: number }) => void;
  onDoubleTap?: (point: { x: number; y: number }) => void;
  onLongPress?: (point: { x: number; y: number }) => void;
  minScale?: number;
  maxScale?: number;
  enablePinch?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  enableTap?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
  longPressDelay?: number;
  style?: React.CSSProperties;
}

export const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onPinch,
  onRotate,
  onPan,
  onTap,
  onDoubleTap,
  onLongPress,
  minScale = 0.5,
  maxScale = 3,
  enablePinch = true,
  enableRotate = true,
  enablePan = true,
  enableTap = true,
  enableDoubleTap = true,
  enableLongPress = true,
  longPressDelay = 500,
  style
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isGesturing, setIsGesturing] = useState(false);
  const [gestureType, setGestureType] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<TouchList | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const getCenter = (touches: TouchList) => {
    if (touches.length === 0) return { x: 0, y: 0 };
    
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    
    return {
      x: x / touches.length,
      y: y / touches.length
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    const touches = e.touches;
    lastTouchRef.current = touches;
    lastCenterRef.current = getCenter(touches);
    
    setIsGesturing(true);
    
    // Long press detection
    if (enableLongPress && touches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        if (touches.length === 1) {
          onLongPress?.(lastCenterRef.current);
        }
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    const touches = e.touches;
    const lastTouches = lastTouchRef.current;
    
    if (!lastTouches || touches.length === 0) return;
    
    const currentCenter = getCenter(touches);
    
    if (touches.length === 1 && lastTouches.length === 1) {
      // Single finger - pan or tap
      if (enablePan) {
        const deltaX = touches[0].clientX - lastTouches[0].clientX;
        const deltaY = touches[0].clientY - lastTouches[0].clientY;
        
        setTranslateX(prev => prev + deltaX);
        setTranslateY(prev => prev + deltaY);
        onPan?.(deltaX, deltaY);
        setGestureType('pan');
      }
    } else if (touches.length === 2 && lastTouches.length === 2) {
      // Two fingers - pinch, rotate, or pan
      const currentDistance = getDistance(touches[0], touches[1]);
      const lastDistance = getDistance(lastTouches[0], lastTouches[1]);
      
      if (enablePinch && Math.abs(currentDistance - lastDistance) > 5) {
        const scaleChange = currentDistance / lastDistance;
        const newScale = Math.max(minScale, Math.min(maxScale, scale * scaleChange));
        
        setScale(newScale);
        onPinch?.(newScale, currentCenter);
        setGestureType('pinch');
      }
      
      if (enableRotate) {
        const currentAngle = getAngle(touches[0], touches[1]);
        const lastAngle = getAngle(lastTouches[0], lastTouches[1]);
        const angleChange = currentAngle - lastAngle;
        
        setRotation(prev => prev + angleChange);
        onRotate?.(angleChange, currentCenter);
        setGestureType('rotate');
      }
    }
    
    lastTouchRef.current = touches;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    const touches = e.touches;
    const now = Date.now();
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (touches.length === 0) {
      setIsGesturing(false);
      setGestureType(null);
      
      // Tap detection
      if (enableTap && lastTouches.current && lastTouches.current.length === 1) {
        const touch = lastTouches.current[0];
        const point = { x: touch.clientX, y: touch.clientY };
        
        if (now - lastTapRef.current < 300) {
          // Double tap
          if (enableDoubleTap) {
            onDoubleTap?.(point);
          }
        } else {
          // Single tap
          onTap?.(point);
        }
        
        lastTapRef.current = now;
      }
    }
    
    lastTouchRef.current = touches;
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setTranslateX(0);
    setTranslateY(0);
  };

  const zoomIn = () => {
    const newScale = Math.min(maxScale, scale * 1.2);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(minScale, scale / 1.2);
    setScale(newScale);
  };

  const rotate = () => {
    setRotation(prev => prev + 90);
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    touchAction: 'none',
    ...style
  };

  const contentStyles: React.CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    transition: isGesturing ? 'none' : 'transform 0.3s ease',
    width: '100%',
    height: '100%'
  };

  const gestureIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.md,
    fontSize: '12px',
    fontWeight: 500,
    zIndex: 1000,
    opacity: isGesturing ? 1 : 0,
    transition: 'opacity 0.2s ease'
  };

  const controlsStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    zIndex: 1000
  };

  const controlButtonStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.full,
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <div
      ref={containerRef}
      style={containerStyles}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gesture Indicator */}
      {isGesturing && gestureType && (
        <div style={gestureIndicatorStyles}>
          {gestureType === 'pinch' && <ZoomIn size={14} style={{ marginRight: spacing.xs }} />}
          {gestureType === 'rotate' && <RotateCw size={14} style={{ marginRight: spacing.xs }} />}
          {gestureType === 'pan' && <Move size={14} style={{ marginRight: spacing.xs }} />}
          {gestureType.charAt(0).toUpperCase() + gestureType.slice(1)}
        </div>
      )}

      {/* Content */}
      <div style={contentStyles}>
        {children}
      </div>

      {/* Controls */}
      <div style={controlsStyles}>
        <button
          onClick={zoomIn}
          style={controlButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ZoomIn size={16} />
        </button>
        
        <button
          onClick={zoomOut}
          style={controlButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ZoomOut size={16} />
        </button>
        
        <button
          onClick={rotate}
          style={controlButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <RotateCw size={16} />
        </button>
        
        <button
          onClick={resetTransform}
          style={controlButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Hand size={16} />
        </button>
      </div>
    </div>
  );
};

// Map-specific touch gestures
export const MapTouchGestures: React.FC<{
  children: React.ReactNode;
  onZoom?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onRotate?: (angle: number) => void;
  style?: React.CSSProperties;
}> = ({ children, onZoom, onPan, onRotate, style }) => {
  return (
    <TouchGestures
      onPinch={(scale) => onZoom?.(scale)}
      onPan={(deltaX, deltaY) => onPan?.(deltaX, deltaY)}
      onRotate={(angle) => onRotate?.(angle)}
      minScale={0.5}
      maxScale={5}
      style={style}
    >
      {children}
    </TouchGestures>
  );
};

// Image-specific touch gestures
export const ImageTouchGestures: React.FC<{
  children: React.ReactNode;
  onZoom?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onRotate?: (angle: number) => void;
  style?: React.CSSProperties;
}> = ({ children, onZoom, onPan, onRotate, style }) => {
  return (
    <TouchGestures
      onPinch={(scale) => onZoom?.(scale)}
      onPan={(deltaX, deltaY) => onPan?.(deltaX, deltaY)}
      onRotate={(angle) => onRotate?.(angle)}
      minScale={0.5}
      maxScale={3}
      style={style}
    >
      {children}
    </TouchGestures>
  );
};

// Hook for touch gestures
export const useTouchGestures = () => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isGesturing, setIsGesturing] = useState(false);

  const reset = () => {
    setScale(1);
    setRotation(0);
    setTranslateX(0);
    setTranslateY(0);
  };

  const zoomIn = (factor = 1.2) => {
    setScale(prev => prev * factor);
  };

  const zoomOut = (factor = 1.2) => {
    setScale(prev => prev / factor);
  };

  const rotate = (angle = 90) => {
    setRotation(prev => prev + angle);
  };

  const pan = (deltaX: number, deltaY: number) => {
    setTranslateX(prev => prev + deltaX);
    setTranslateY(prev => prev + deltaY);
  };

  return {
    scale,
    rotation,
    translateX,
    translateY,
    isGesturing,
    setIsGesturing,
    reset,
    zoomIn,
    zoomOut,
    rotate,
    pan
  };
};
