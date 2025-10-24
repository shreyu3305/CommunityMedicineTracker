import React, { useState, useEffect, useRef } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';

export interface SkipLink {
  id: string;
  label: string;
  target: string;
  description?: string;
  order?: number;
}

export interface SkipLinksProps {
  links: SkipLink[];
  visible?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right';
  style?: React.CSSProperties;
}

export const SkipLinks: React.FC<SkipLinksProps> = ({
  links,
  visible = false,
  position = 'top-left',
  style
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Show skip links when Tab is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % links.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + links.length) % links.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const target = document.getElementById(links[index].target);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsVisible(false);
        break;
      case 'Escape':
        e.preventDefault();
        setIsVisible(false);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && linkRefs.current[focusedIndex]) {
      linkRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      top: spacing.md,
      zIndex: 9999,
      display: isVisible ? 'flex' : 'none',
      flexDirection: 'column',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.background,
      border: `1px solid ${colors.neutral[300]}`,
      borderRadius: borderRadius.md,
      boxShadow: shadows.lg,
      minWidth: '200px'
    };

    switch (position) {
      case 'top-center':
        return { ...baseStyles, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...baseStyles, right: spacing.md };
      default:
        return { ...baseStyles, left: spacing.md };
    }
  };

  const linkStyles: React.CSSProperties = {
    display: 'block',
    padding: `${spacing.sm} ${spacing.md}`,
    color: colors.text,
    textDecoration: 'none',
    borderRadius: borderRadius.sm,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    transition: 'all 0.2s ease',
    outline: 'none',
    border: '2px solid transparent'
  };

  const focusedLinkStyles: React.CSSProperties = {
    ...linkStyles,
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    color: colors.primary
  };

  const hoverLinkStyles: React.CSSProperties = {
    backgroundColor: colors.neutral[100],
    color: colors.primary
  };

  if (!isVisible) return null;

  return (
    <div ref={containerRef} style={getPositionStyles()}>
      <div style={{ 
        fontSize: typography.sizes.xs, 
        color: colors.neutral[600], 
        marginBottom: spacing.xs,
        fontWeight: typography.weights.semibold,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Skip to:
      </div>
      {links
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((link, index) => (
          <a
            key={link.id}
            ref={(el) => (linkRefs.current[index] = el)}
            href={`#${link.target}`}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(link.target);
              if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              setIsVisible(false);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={(e) => {
              if (focusedIndex !== index) {
                Object.assign(e.currentTarget.style, hoverLinkStyles);
              }
            }}
            onMouseLeave={(e) => {
              if (focusedIndex !== index) {
                Object.assign(e.currentTarget.style, linkStyles);
              }
            }}
            style={focusedIndex === index ? focusedLinkStyles : linkStyles}
            aria-label={link.description || link.label}
            title={link.description || link.label}
          >
            {link.label}
          </a>
        ))}
    </div>
  );
};

// Predefined skip links for common sections
export const createCommonSkipLinks = (): SkipLink[] => [
  {
    id: 'skip-to-main',
    label: 'Skip to main content',
    target: 'main-content',
    description: 'Skip to the main content area',
    order: 1
  },
  {
    id: 'skip-to-search',
    label: 'Skip to search',
    target: 'search-section',
    description: 'Skip to the search functionality',
    order: 2
  },
  {
    id: 'skip-to-navigation',
    label: 'Skip to navigation',
    target: 'main-navigation',
    description: 'Skip to the main navigation menu',
    order: 3
  },
  {
    id: 'skip-to-results',
    label: 'Skip to results',
    target: 'search-results',
    description: 'Skip to the search results',
    order: 4
  },
  {
    id: 'skip-to-footer',
    label: 'Skip to footer',
    target: 'main-footer',
    description: 'Skip to the footer content',
    order: 5
  }
];

// Skip link for specific sections
export const SkipToSection: React.FC<{
  target: string;
  label: string;
  description?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ target, label, description, children, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible]);

  const handleSkipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetElement = document.getElementById(target);
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const targetElement = document.getElementById(target);
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsVisible(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsVisible(false);
    }
  };

  const skipLinkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: spacing.md,
    zIndex: 10000,
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.primary,
    color: colors.white,
    textDecoration: 'none',
    borderRadius: borderRadius.sm,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    transition: 'all 0.2s ease',
    outline: 'none',
    border: '2px solid transparent'
  };

  const focusedSkipLinkStyles: React.CSSProperties = {
    ...skipLinkStyles,
    backgroundColor: colors.primaryDark,
    borderColor: colors.white,
    transform: 'translateY(100px)'
  };

  return (
    <section ref={sectionRef} style={{ position: 'relative', ...style }}>
      {isVisible && (
        <a
          href={`#${target}`}
          onClick={handleSkipClick}
          onKeyDown={handleKeyDown}
          style={skipLinkStyles}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusedSkipLinkStyles);
          }}
          onBlur={(e) => {
            Object.assign(e.currentTarget.style, skipLinkStyles);
          }}
          aria-label={description || label}
          title={description || label}
        >
          {label}
        </a>
      )}
      {children}
    </section>
  );
};

// Skip link provider for global skip links
export const SkipLinkProvider: React.FC<{
  children: React.ReactNode;
  links?: SkipLink[];
  visible?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right';
}> = ({ children, links = createCommonSkipLinks(), visible = false, position = 'top-left' }) => {
  return (
    <>
      <SkipLinks links={links} visible={visible} position={position} />
      {children}
    </>
  );
};

// Hook for managing skip links
export const useSkipLinks = () => {
  const [links, setLinks] = useState<SkipLink[]>(createCommonSkipLinks());
  const [isVisible, setIsVisible] = useState(false);

  const addLink = (link: SkipLink) => {
    setLinks(prev => [...prev, link].sort((a, b) => (a.order || 0) - (b.order || 0)));
  };

  const removeLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateLink = (id: string, updates: Partial<SkipLink>) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const showSkipLinks = () => setIsVisible(true);
  const hideSkipLinks = () => setIsVisible(false);

  const skipTo = (target: string) => {
    const targetElement = document.getElementById(target);
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsVisible(false);
  };

  return {
    links,
    isVisible,
    addLink,
    removeLink,
    updateLink,
    showSkipLinks,
    hideSkipLinks,
    skipTo
  };
};

// Skip link for specific content areas
export const SkipToContent: React.FC<{
  children: React.ReactNode;
  id: string;
  label: string;
  description?: string;
  style?: React.CSSProperties;
}> = ({ children, id, label, description, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible]);

  const handleSkipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (contentRef.current) {
      contentRef.current.focus();
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsVisible(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsVisible(false);
    }
  };

  const skipLinkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: spacing.md,
    zIndex: 10000,
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.primary,
    color: colors.white,
    textDecoration: 'none',
    borderRadius: borderRadius.sm,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    transition: 'all 0.2s ease',
    outline: 'none',
    border: '2px solid transparent'
  };

  const focusedSkipLinkStyles: React.CSSProperties = {
    ...skipLinkStyles,
    backgroundColor: colors.primaryDark,
    borderColor: colors.white,
    transform: 'translateY(100px)'
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      {isVisible && (
        <a
          href={`#${id}`}
          onClick={handleSkipClick}
          onKeyDown={handleKeyDown}
          style={skipLinkStyles}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, focusedSkipLinkStyles);
          }}
          onBlur={(e) => {
            Object.assign(e.currentTarget.style, skipLinkStyles);
          }}
          aria-label={description || label}
          title={description || label}
        >
          {label}
        </a>
      )}
      <div
        ref={contentRef}
        id={id}
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};
