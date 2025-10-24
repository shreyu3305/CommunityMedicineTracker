import React from 'react';
import { Search, MapPin, Wifi, WifiOff, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { colors, spacing, borderRadius } from '../styles/tokens';

interface EmptyStateProps {
  type: 'no-results' | 'network-error' | 'location-error' | 'search-error' | 'generic';
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
  };
  suggestions?: string[];
  onRetry?: () => void;
  onGoBack?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  icon,
  action,
  suggestions = [],
  onRetry,
  onGoBack
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'no-results':
        return <Search size={64} color={colors.neutral[400]} />;
      case 'network-error':
        return <WifiOff size={64} color={colors.error} />;
      case 'location-error':
        return <MapPin size={64} color={colors.warning} />;
      case 'search-error':
        return <AlertCircle size={64} color={colors.error} />;
      default:
        return <AlertCircle size={64} color={colors.neutral[400]} />;
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    textAlign: 'center',
    minHeight: '400px',
    background: 'white',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
    margin: spacing.lg
  };

  const iconStyles: React.CSSProperties = {
    marginBottom: spacing.lg,
    opacity: 0.8
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    lineHeight: '120%'
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '16px',
    color: colors.neutral[600],
    marginBottom: spacing.xl,
    lineHeight: '150%',
    maxWidth: '500px'
  };

  const suggestionsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: '400px'
  };

  const suggestionItemStyles: React.CSSProperties = {
    padding: spacing.sm,
    background: colors.neutral[50],
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[200]}`,
    fontSize: '14px',
    color: colors.neutral[700],
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>
        {icon || getDefaultIcon()}
      </div>
      
      <h2 style={titleStyles}>{title}</h2>
      <p style={descriptionStyles}>{description}</p>

      {suggestions.length > 0 && (
        <div style={suggestionsStyles}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: colors.neutral[800], 
            marginBottom: spacing.sm,
            textAlign: 'left'
          }}>
            Try searching for:
          </h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={suggestionItemStyles}
              onClick={() => {
                // This would typically trigger a search
                console.log('Search suggestion clicked:', suggestion);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.neutral[100];
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.neutral[50];
                e.currentTarget.style.borderColor = colors.neutral[200];
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <div style={actionsStyles}>
        {onGoBack && (
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft size={16} />}
            onClick={onGoBack}
          >
            Go Back
          </Button>
        )}
        
        {onRetry && (
          <Button
            variant="outline"
            size="md"
            icon={<RefreshCw size={16} />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        {action && (
          <Button
            variant={action.variant || 'primary'}
            size="md"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// Pre-built empty state components for common scenarios
export const NoResultsEmptyState: React.FC<{
  searchQuery?: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
}> = ({ searchQuery, onClearSearch, onRetry }) => {
  const suggestions = [
    'Paracetamol 500mg',
    'Ibuprofen 400mg',
    'Aspirin 75mg',
    'Amoxicillin 500mg',
    'Omeprazole 20mg'
  ];

  return (
    <EmptyState
      type="no-results"
      title="No pharmacies found"
      description={
        searchQuery 
          ? `We couldn't find any pharmacies with "${searchQuery}" nearby. Try adjusting your search or location.`
          : "We couldn't find any pharmacies in your area. Try expanding your search radius or checking your location."
      }
      suggestions={suggestions}
      action={onClearSearch ? {
        label: 'Clear Search',
        onClick: onClearSearch,
        variant: 'primary'
      } : undefined}
      onRetry={onRetry}
    />
  );
};

export const NetworkErrorEmptyState: React.FC<{
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ onRetry, onGoBack }) => (
  <EmptyState
    type="network-error"
    title="Connection Problem"
    description="We're having trouble connecting to our servers. Please check your internet connection and try again."
    onRetry={onRetry}
    onGoBack={onGoBack}
  />
);

export const LocationErrorEmptyState: React.FC<{
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ onRetry, onGoBack }) => (
  <EmptyState
    type="location-error"
    title="Location Access Required"
    description="We need access to your location to find nearby pharmacies. Please enable location services and try again."
    action={{
      label: 'Enable Location',
      onClick: () => {
        // This would typically request location permission
        console.log('Requesting location permission');
      },
      variant: 'primary'
    }}
    onRetry={onRetry}
    onGoBack={onGoBack}
  />
);

export const SearchErrorEmptyState: React.FC<{
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ onRetry, onGoBack }) => (
  <EmptyState
    type="search-error"
    title="Search Failed"
    description="Something went wrong while searching. Please try again or contact support if the problem persists."
    onRetry={onRetry}
    onGoBack={onGoBack}
  />
);
