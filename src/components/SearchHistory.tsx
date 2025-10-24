import React, { useState } from 'react';
import { Clock, TrendingUp, X, Search, Pill, MapPin, Building, Trash2, History } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Badge } from './Badge';
import { useSearchHistory } from '../contexts/SearchHistoryContext';

interface SearchHistoryProps {
  onSearchSelect: (query: string) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSearchSelect,
  onClose,
  style
}) => {
  const { 
    searchHistory, 
    popularSearches, 
    clearHistory, 
    removeSearch, 
    getRecentSearches, 
    getPopularSearches 
  } = useSearchHistory();
  
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');

  const recentSearches = getRecentSearches(10);
  const popularSearchesList = getPopularSearches(10);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Pill size={16} color={colors.primary} />;
      case 'pharmacy':
        return <Building size={16} color={colors.info} />;
      case 'location':
        return <MapPin size={16} color={colors.success} />;
      default:
        return <Search size={16} color={colors.neutral[500]} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medicine':
        return colors.primary;
      case 'pharmacy':
        return colors.info;
      case 'location':
        return colors.success;
      default:
        return colors.neutral[500];
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const containerStyles: React.CSSProperties = {
    background: 'white',
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    maxHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    background: colors.neutral[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[900],
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const tabContainerStyles: React.CSSProperties = {
    display: 'flex',
    borderBottom: `1px solid ${colors.neutral[200]}`
  };

  const tabStyles: React.CSSProperties = {
    flex: 1,
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    color: colors.neutral[600],
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease'
  };

  const activeTabStyles: React.CSSProperties = {
    ...tabStyles,
    color: colors.primary,
    borderBottomColor: colors.primary,
    background: `${colors.primary}05`
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '400px'
  };

  const itemStyles: React.CSSProperties = {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.neutral[100]}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  };

  const itemInfoStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0
  };

  const queryStyles: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 500,
    color: colors.neutral[900],
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const metaStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.neutral[500],
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: '2px'
  };

  const badgeStyles: React.CSSProperties = {
    fontSize: '10px',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    fontWeight: 500
  };

  const emptyStateStyles: React.CSSProperties = {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.neutral[500]
  };

  const emptyIconStyles: React.CSSProperties = {
    margin: '0 auto',
    marginBottom: spacing.sm,
    color: colors.neutral[400]
  };

  const handleItemClick = (query: string) => {
    onSearchSelect(query);
    onClose();
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeSearch(id);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      clearHistory();
    }
  };

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h3 style={titleStyles}>
          <History size={18} color={colors.primary} />
          Search History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          icon={<X size={16} />}
          onClick={onClose}
          style={{ color: colors.neutral[500] }}
        />
      </div>

      {/* Tabs */}
      <div style={tabContainerStyles}>
        <button
          style={activeTab === 'recent' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('recent')}
        >
          <Clock size={14} style={{ marginRight: spacing.xs }} />
          Recent ({recentSearches.length})
        </button>
        <button
          style={activeTab === 'popular' ? activeTabStyles : tabStyles}
          onClick={() => setActiveTab('popular')}
        >
          <TrendingUp size={14} style={{ marginRight: spacing.xs }} />
          Popular ({popularSearchesList.length})
        </button>
      </div>

      {/* Content */}
      <div style={contentStyles}>
        {activeTab === 'recent' ? (
          <>
            {recentSearches.length > 0 ? (
              <>
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    style={itemStyles}
                    onClick={() => handleItemClick(item.query)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.neutral[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div style={itemInfoStyles}>
                      {getTypeIcon(item.type)}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={queryStyles}>{item.query}</p>
                        <div style={metaStyles}>
                          <span>{formatTimeAgo(item.timestamp)}</span>
                          {item.resultCount && (
                            <>
                              <span>•</span>
                              <span>{item.resultCount} results</span>
                            </>
                          )}
                          {item.category && (
                            <>
                              <span>•</span>
                              <Badge
                                variant="custom"
                                style={{
                                  ...badgeStyles,
                                  backgroundColor: `${getTypeColor(item.type)}15`,
                                  color: getTypeColor(item.type)
                                }}
                              >
                                {item.category}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={(e) => handleRemoveItem(e, item.id)}
                      style={{ 
                        color: colors.neutral[400],
                        minWidth: 'auto',
                        padding: spacing.xs
                      }}
                    />
                  </div>
                ))}
                
                {recentSearches.length > 0 && (
                  <div style={{ 
                    padding: spacing.md, 
                    borderTop: `1px solid ${colors.neutral[200]}`,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      onClick={handleClearHistory}
                      style={{ color: colors.error }}
                    >
                      Clear All History
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div style={emptyStateStyles}>
                <Clock size={32} style={emptyIconStyles} />
                <p style={{ fontSize: '16px', fontWeight: 500, margin: 0, marginBottom: spacing.xs }}>
                  No recent searches
                </p>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Your search history will appear here
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {popularSearchesList.length > 0 ? (
              popularSearchesList.map((item, index) => (
                <div
                  key={`${item.query}-${index}`}
                  style={itemStyles}
                  onClick={() => handleItemClick(item.query)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.neutral[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={itemInfoStyles}>
                    {getTypeIcon(item.type)}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={queryStyles}>{item.query}</p>
                      <div style={metaStyles}>
                        <span>{item.count} searches</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <Badge
                              variant="custom"
                              style={{
                                ...badgeStyles,
                                backgroundColor: `${getTypeColor(item.type)}15`,
                                color: getTypeColor(item.type)
                              }}
                            >
                              {item.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="custom"
                    style={{
                      ...badgeStyles,
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    #{index + 1}
                  </Badge>
                </div>
              ))
            ) : (
              <div style={emptyStateStyles}>
                <TrendingUp size={32} style={emptyIconStyles} />
                <p style={{ fontSize: '16px', fontWeight: 500, margin: 0, marginBottom: spacing.xs }}>
                  No popular searches
                </p>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Popular searches will appear here
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
