import React, { useState } from 'react';
import { Home, Search, Map, User, Plus, Heart, Settings, Bell } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
  onClick: () => void;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  variant?: 'default' | 'floating' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  style?: React.CSSProperties;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
  variant = 'default',
  size = 'md',
  showLabels = true,
  style
}) => {
  const [active, setActive] = useState(activeItem || items[0]?.id);

  const handleItemClick = (item: BottomNavItem) => {
    if (item.disabled) return;
    
    setActive(item.id);
    item.onClick();
    onItemClick?.(item.id);
  };

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      borderTop: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.lg
    };

    switch (variant) {
      case 'floating':
        return {
          ...baseStyles,
          margin: spacing.md,
          borderRadius: borderRadius.xl,
          border: 'none',
          boxShadow: shadows.xl
        };
      case 'minimal':
        return {
          ...baseStyles,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none'
        };
      default:
        return baseStyles;
    }
  };

  const getItemStyles = (item: BottomNavItem) => {
    const isActive = active === item.id;
    const sizes = {
      sm: { padding: `${spacing.sm} ${spacing.xs}`, fontSize: '10px' },
      md: { padding: `${spacing.md} ${spacing.sm}`, fontSize: '12px' },
      lg: { padding: `${spacing.lg} ${spacing.md}`, fontSize: '14px' }
    };

    return {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      padding: sizes[size].padding,
      background: 'transparent',
      border: 'none',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      color: isActive ? colors.primary : colors.neutral[500],
      fontSize: sizes[size].fontSize,
      fontWeight: isActive ? 600 : 500,
      opacity: item.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      position: 'relative' as const
    };
  };

  const getIconStyles = (item: BottomNavItem) => {
    const isActive = active === item.id;
    const sizes = {
      sm: 16,
      md: 20,
      lg: 24
    };

    return {
      width: sizes[size],
      height: sizes[size],
      color: isActive ? colors.primary : colors.neutral[500],
      transition: 'all 0.2s ease'
    };
  };

  const getBadgeStyles = (item: BottomNavItem) => {
    if (!item.badge || item.badge === 0) return { display: 'none' };

    return {
      position: 'absolute' as const,
      top: spacing.xs,
      right: spacing.sm,
      background: colors.error,
      color: 'white',
      borderRadius: borderRadius.full,
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 600,
      padding: `0 ${spacing.xs}`
    };
  };

  return (
    <div style={getVariantStyles()}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleItemClick(item)}
          style={getItemStyles(item)}
          onMouseEnter={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.background = colors.neutral[50];
              e.currentTarget.style.color = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = active === item.id ? colors.primary : colors.neutral[500];
            }
          }}
        >
          <div style={{ position: 'relative' }}>
            {active === item.id && item.activeIcon ? item.activeIcon : item.icon}
            {item.badge && item.badge > 0 && (
              <div style={getBadgeStyles(item)}>
                {item.badge > 99 ? '99+' : item.badge}
              </div>
            )}
          </div>
          {showLabels && (
            <span style={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: 'inherit',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {item.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Predefined navigation items
export const createMainNavigation = (
  onHome: () => void,
  onSearch: () => void,
  onMap: () => void,
  onProfile: () => void
): BottomNavItem[] => [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    onClick: onHome
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search size={20} />,
    onClick: onSearch
  },
  {
    id: 'map',
    label: 'Map',
    icon: <Map size={20} />,
    onClick: onMap
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={20} />,
    onClick: onProfile
  }
];

export const createPharmacyNavigation = (
  onHome: () => void,
  onSearch: () => void,
  onFavorites: () => void,
  onSettings: () => void
): BottomNavItem[] => [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    onClick: onHome
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search size={20} />,
    onClick: onSearch
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: <Heart size={20} />,
    onClick: onFavorites
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={20} />,
    onClick: onSettings
  }
];

// Floating bottom navigation
export const FloatingBottomNavigation: React.FC<BottomNavigationProps> = (props) => (
  <BottomNavigation
    {...props}
    variant="floating"
    style={{
      ...props.style,
      margin: spacing.md,
      borderRadius: borderRadius.xl
    }}
  />
);

// Minimal bottom navigation
export const MinimalBottomNavigation: React.FC<BottomNavigationProps> = (props) => (
  <BottomNavigation
    {...props}
    variant="minimal"
    showLabels={false}
    style={{
      ...props.style,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)'
    }}
  />
);

// Bottom navigation with floating action button
export const BottomNavigationWithFAB: React.FC<{
  items: BottomNavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  fabIcon?: React.ReactNode;
  fabLabel?: string;
  onFabClick?: () => void;
  style?: React.CSSProperties;
}> = ({
  items,
  activeItem,
  onItemClick,
  fabIcon = <Plus size={24} />,
  fabLabel = 'Add',
  onFabClick,
  style
}) => {
  const [active, setActive] = useState(activeItem || items[0]?.id);

  const handleItemClick = (item: BottomNavItem) => {
    if (item.disabled) return;
    
    setActive(item.id);
    item.onClick();
    onItemClick?.(item.id);
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Floating Action Button */}
      {onFabClick && (
        <button
          onClick={onFabClick}
          style={{
            position: 'absolute',
            top: -spacing.xl,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '56px',
            height: '56px',
            borderRadius: borderRadius.full,
            background: colors.primary,
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: shadows.lg,
            zIndex: 1001,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
            e.currentTarget.style.boxShadow = shadows.lg;
          }}
        >
          {fabIcon}
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        items={items}
        activeItem={active}
        onItemClick={handleItemClick}
        style={{
          paddingTop: onFabClick ? spacing.xl : 0
        }}
      />
    </div>
  );
};

// Hook for bottom navigation
export const useBottomNavigation = (initialActive?: string) => {
  const [activeItem, setActiveItem] = useState(initialActive);

  const setActive = (itemId: string) => {
    setActiveItem(itemId);
  };

  const isActive = (itemId: string) => {
    return activeItem === itemId;
  };

  return {
    activeItem,
    setActive,
    isActive
  };
};
