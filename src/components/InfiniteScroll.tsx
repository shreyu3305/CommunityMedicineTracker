import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

export interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  error?: string | null;
  onRetry?: () => void;
  endMessage?: React.ReactNode;
  loader?: React.ReactNode;
  style?: React.CSSProperties;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
  rootMargin = '0px',
  error = null,
  onRetry,
  endMessage,
  loader,
  style
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
    
    if (entry.isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: 0.1
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin]);

  const defaultLoader = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      gap: spacing.sm
    }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ color: colors.neutral[600], fontSize: '14px' }}>
        Loading more...
      </span>
    </div>
  );

  const defaultEndMessage = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      color: colors.neutral[500],
      fontSize: '14px',
      textAlign: 'center'
    }}>
      <ChevronDown size={16} style={{ marginRight: spacing.sm }} />
      You've reached the end
    </div>
  );

  const errorMessage = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      gap: spacing.md
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        color: colors.error
      }}>
        <AlertCircle size={20} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          {error || 'Failed to load more items'}
        </span>
      </div>
      
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );

  return (
    <div style={style}>
      {children}
      
      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} style={{ height: '1px' }} />
      
      {/* Loading/End/Error states */}
      {isLoading && (loader || defaultLoader)}
      
      {!hasMore && !isLoading && !error && (endMessage || defaultEndMessage)}
      
      {error && errorMessage}
      
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

// Hook for infinite scroll functionality
export const useInfiniteScroll = <T,>(
  fetchMore: () => Promise<T[]>,
  initialData: T[] = []
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setIsHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newData = await fetchMore();
      
      if (newData.length === 0) {
        setIsHasMore(false);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchMore, isLoading, hasMore]);

  const retry = useCallback(() => {
    setError(null);
    loadMore();
  }, [loadMore]);

  const reset = useCallback(() => {
    setData(initialData);
    setPage(1);
    setIsHasMore(true);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    retry,
    reset
  };
};

// Virtual scrolling for large lists
export const VirtualInfiniteScroll: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  style?: React.CSSProperties;
}> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  onLoadMore,
  hasMore,
  isLoading,
  style
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
    
    // Load more when near bottom
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        ...style
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleStart + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pagination with infinite scroll
export const PaginatedInfiniteScroll: React.FC<{
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onPageChange?: (page: number) => void;
  showPageNumbers?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  currentPage,
  totalPages,
  hasMore,
  isLoading,
  onLoadMore,
  onPageChange,
  showPageNumbers = true,
  style
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  const renderPageNumbers = () => {
    if (!showPageNumbers || totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange?.(i)}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            border: `1px solid ${i === currentPage ? colors.primary : colors.neutral[300]}`,
            background: i === currentPage ? colors.primary : 'white',
            color: i === currentPage ? 'white' : colors.neutral[700],
            borderRadius: borderRadius.md,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: i === currentPage ? 600 : 500,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (i !== currentPage) {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (i !== currentPage) {
              e.currentTarget.style.borderColor = colors.neutral[300];
              e.currentTarget.style.color = colors.neutral[700];
            }
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.lg
      }}>
        {pages}
      </div>
    );
  };

  return (
    <div style={style}>
      {children}
      
      <div ref={sentinelRef} style={{ height: '1px' }} />
      
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
          gap: spacing.sm
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ color: colors.neutral[600], fontSize: '14px' }}>
            Loading more...
          </span>
        </div>
      )}
      
      {!hasMore && !isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
          color: colors.neutral[500],
          fontSize: '14px'
        }}>
          No more items to load
        </div>
      )}
      
      {renderPageNumbers()}
      
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
