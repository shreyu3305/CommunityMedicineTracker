import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';

export interface LocationErrorProps {
  error?: GeolocationPositionError | null;
  onRetry?: () => void;
  onManualLocation?: () => void;
  onSettings?: () => void;
  style?: React.CSSProperties;
}

export interface LocationPermissionProps {
  onRequestPermission?: () => void;
  onManualLocation?: () => void;
  onSettings?: () => void;
  style?: React.CSSProperties;
}

export interface LocationUnavailableProps {
  onRetry?: () => void;
  onManualLocation?: () => void;
  onSettings?: () => void;
  style?: React.CSSProperties;
}

// Location Error component
export const LocationError: React.FC<LocationErrorProps> = ({
  error,
  onRetry,
  onManualLocation,
  onSettings,
  style
}) => {
  const [errorType, setErrorType] = useState<'permission' | 'unavailable' | 'timeout' | 'unknown'>('unknown');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setErrorType('permission');
          setErrorMessage('Location access denied. Please enable location permissions in your browser settings.');
          break;
        case error.POSITION_UNAVAILABLE:
          setErrorType('unavailable');
          setErrorMessage('Location information is unavailable. Please check your device settings and try again.');
          break;
        case error.TIMEOUT:
          setErrorType('timeout');
          setErrorMessage('Location request timed out. Please try again.');
          break;
        default:
          setErrorType('unknown');
          setErrorMessage('An unknown error occurred while getting your location.');
      }
    }
  }, [error]);

  const getErrorIcon = () => {
    switch (errorType) {
      case 'permission':
        return '🔒';
      case 'unavailable':
        return '📍';
      case 'timeout':
        return '⏱️';
      default:
        return '❌';
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'permission':
        return 'Location Permission Denied';
      case 'unavailable':
        return 'Location Unavailable';
      case 'timeout':
        return 'Location Request Timeout';
      default:
        return 'Location Error';
    }
  };

  const getErrorSuggestions = () => {
    switch (errorType) {
      case 'permission':
        return [
          'Click "Allow" when prompted for location access',
          'Check your browser settings and enable location permissions',
          'Try refreshing the page and allowing location access',
          'Use manual location entry as an alternative'
        ];
      case 'unavailable':
        return [
          'Check if location services are enabled on your device',
          'Ensure you have a stable internet connection',
          'Try moving to a different location',
          'Use manual location entry as an alternative'
        ];
      case 'timeout':
        return [
          'Check your internet connection',
          'Try again in a few moments',
          'Ensure location services are enabled',
          'Use manual location entry as an alternative'
        ];
      default:
        return [
          'Try refreshing the page',
          'Check your internet connection',
          'Use manual location entry as an alternative'
        ];
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    border: `1px solid ${colors.error}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    textAlign: 'center',
    ...style
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: spacing.sm
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.error,
    marginBottom: spacing.sm
  };

  const messageStyles: React.CSSProperties = {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 1.5
  };

  const suggestionsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'left'
  };

  const suggestionStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
    maxWidth: '300px'
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.primary,
    color: colors.white
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.neutral[200],
    color: colors.text,
    border: `1px solid ${colors.neutral[300]}`
  };

  const outlineButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`
  };

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>{getErrorIcon()}</div>
      
      <h3 style={titleStyles}>{getErrorTitle()}</h3>
      
      <p style={messageStyles}>{errorMessage}</p>
      
      <div style={suggestionsStyles}>
        <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.sm }}>
          Try these solutions:
        </h4>
        {getErrorSuggestions().map((suggestion, index) => (
          <div key={index} style={suggestionStyles}>
            <span style={{ color: colors.primary, fontWeight: typography.weights.bold }}>•</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
      
      <div style={buttonContainerStyles}>
        {errorType === 'permission' && (
          <button
            onClick={onSettings}
            style={primaryButtonStyles}
          >
            🔧 Open Browser Settings
          </button>
        )}
        
        <button
          onClick={onRetry}
          style={errorType === 'permission' ? secondaryButtonStyles : primaryButtonStyles}
        >
          🔄 Try Again
        </button>
        
        <button
          onClick={onManualLocation}
          style={outlineButtonStyles}
        >
          📍 Enter Location Manually
        </button>
      </div>
    </div>
  );
};

// Location Permission component
export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onRequestPermission,
  onManualLocation,
  onSettings,
  style
}) => {
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setPermissionState(result.state);
      });
    }
  }, []);

  const requestPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });
      
      setPermissionState('granted');
      onRequestPermission?.();
    } catch (error) {
      setPermissionState('denied');
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    textAlign: 'center',
    ...style
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: spacing.sm
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm
  };

  const messageStyles: React.CSSProperties = {
    fontSize: typography.sizes.md,
    color: colors.neutral[600],
    marginBottom: spacing.md,
    lineHeight: 1.5
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
    maxWidth: '300px'
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.primary,
    color: colors.white
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.neutral[200],
    color: colors.text,
    border: `1px solid ${colors.neutral[300]}`
  };

  const getPermissionMessage = () => {
    switch (permissionState) {
      case 'granted':
        return 'Location permission is already granted. You can now search for nearby pharmacies.';
      case 'denied':
        return 'Location permission has been denied. Please enable it in your browser settings to use location-based search.';
      case 'prompt':
        return 'Click "Allow" when prompted to enable location-based search for nearby pharmacies.';
      default:
        return 'We need your location to find nearby pharmacies. Your location data is not stored and is only used for this search.';
    }
  };

  const getPermissionIcon = () => {
    switch (permissionState) {
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      case 'prompt':
        return '📍';
      default:
        return '🔒';
    }
  };

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>{getPermissionIcon()}</div>
      
      <h3 style={titleStyles}>Location Access Required</h3>
      
      <p style={messageStyles}>{getPermissionMessage()}</p>
      
      <div style={buttonContainerStyles}>
        {permissionState === 'denied' && (
          <button
            onClick={onSettings}
            style={primaryButtonStyles}
          >
            🔧 Open Browser Settings
          </button>
        )}
        
        {permissionState !== 'granted' && (
          <button
            onClick={requestPermission}
            style={primaryButtonStyles}
          >
            📍 Allow Location Access
          </button>
        )}
        
        <button
          onClick={onManualLocation}
          style={secondaryButtonStyles}
        >
          📍 Enter Location Manually
        </button>
      </div>
    </div>
  );
};

// Location Unavailable component
export const LocationUnavailable: React.FC<LocationUnavailableProps> = ({
  onRetry,
  onManualLocation,
  onSettings,
  style
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    border: `1px solid ${colors.warning}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    textAlign: 'center',
    ...style
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: spacing.sm
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.warning,
    marginBottom: spacing.sm
  };

  const messageStyles: React.CSSProperties = {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 1.5
  };

  const suggestionsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'left'
  };

  const suggestionStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    width: '100%',
    maxWidth: '300px'
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.primary,
    color: colors.white
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.neutral[200],
    color: colors.text,
    border: `1px solid ${colors.neutral[300]}`
  };

  const suggestions = [
    'Check if location services are enabled on your device',
    'Ensure you have a stable internet connection',
    'Try moving to a different location',
    'Check your device\'s GPS settings',
    'Use manual location entry as an alternative'
  ];

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>📍</div>
      
      <h3 style={titleStyles}>Location Unavailable</h3>
      
      <p style={messageStyles}>
        We couldn't determine your current location. This might be due to network issues, 
        device settings, or location services being disabled.
      </p>
      
      <div style={suggestionsStyles}>
        <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.sm }}>
          Try these solutions:
        </h4>
        {suggestions.map((suggestion, index) => (
          <div key={index} style={suggestionStyles}>
            <span style={{ color: colors.primary, fontWeight: typography.weights.bold }}>•</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
      
      <div style={buttonContainerStyles}>
        <button
          onClick={onRetry}
          style={primaryButtonStyles}
        >
          🔄 Try Again
        </button>
        
        <button
          onClick={onManualLocation}
          style={secondaryButtonStyles}
        >
          📍 Enter Location Manually
        </button>
        
        <button
          onClick={onSettings}
          style={secondaryButtonStyles}
        >
          ⚙️ Check Device Settings
        </button>
      </div>
    </div>
  );
};

// Location error hook
export const useLocationError = () => {
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve(position);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
          ...options
        }
      );
    });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    isLoading,
    getCurrentPosition,
    clearError
  };
};
