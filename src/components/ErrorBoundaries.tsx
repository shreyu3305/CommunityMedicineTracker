import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  resetOnChange?: boolean;
  isolate?: boolean;
  style?: React.CSSProperties;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
  retry: () => void;
  style?: React.CSSProperties;
}

export interface ErrorReportProps {
  error: Error;
  errorInfo: ErrorInfo;
  onReport?: (errorData: any) => void;
  style?: React.CSSProperties;
}

export interface ErrorLoggerProps {
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReport?: (errorData: any) => void;
  style?: React.CSSProperties;
}

// Error Boundary Class Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call error handler
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetError();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
    this.props.onReset?.();
  };

  retry = () => {
    this.resetError();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, isolate } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error!}
          errorInfo={errorInfo!}
          resetError={this.resetError}
          retry={this.retry}
          style={isolate ? { position: 'relative', zIndex: 1000 } : undefined}
        />
      );
    }

    return children;
  }
}

// Error Fallback Component
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  retry,
  style
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    
    try {
      // Simulate error reporting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the error to your error reporting service
      console.log('Error reported:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
      
      alert('Error has been reported. Thank you for helping us improve!');
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
      alert('Failed to report error. Please try again later.');
    } finally {
      setIsReporting(false);
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

  const detailsStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.md,
    textAlign: 'left'
  };

  const detailsTitleStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm
  };

  const detailsContentStyles: React.CSSProperties = {
    fontSize: typography.sizes.xs,
    color: colors.neutral[600],
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  return (
    <div style={containerStyles}>
      <div style={iconStyles}>⚠️</div>
      
      <h3 style={titleStyles}>Something went wrong</h3>
      
      <p style={messageStyles}>
        We're sorry, but something unexpected happened. This error has been logged 
        and our team will investigate. You can try refreshing the page or contact 
        support if the problem persists.
      </p>
      
      <div style={buttonContainerStyles}>
        <button
          onClick={retry}
          style={primaryButtonStyles}
        >
          🔄 Try Again
        </button>
        
        <button
          onClick={resetError}
          style={secondaryButtonStyles}
        >
          🏠 Go to Home
        </button>
        
        <button
          onClick={handleReport}
          style={outlineButtonStyles}
          disabled={isReporting}
        >
          {isReporting ? '📤 Reporting...' : '📤 Report Error'}
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={outlineButtonStyles}
        >
          {isExpanded ? '🔽 Hide Details' : '🔍 Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={detailsStyles}>
          <div style={detailsTitleStyles}>Error Details:</div>
          <div style={detailsContentStyles}>
            <strong>Error:</strong> {error.message}
            {'\n\n'}
            <strong>Stack Trace:</strong>
            {'\n'}
            {error.stack}
            {'\n\n'}
            <strong>Component Stack:</strong>
            {'\n'}
            {errorInfo.componentStack}
          </div>
        </div>
      )}
    </div>
  );
};

// Error Report Component
export const ErrorReport: React.FC<ErrorReportProps> = ({
  error,
  errorInfo,
  onReport,
  style
}) => {
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    
    try {
      const errorData = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      await onReport?.(errorData);
      setIsReported(true);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    } finally {
      setIsReporting(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    ...style
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    color: colors.white,
    cursor: 'pointer',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    transition: 'all 0.2s ease'
  };

  const disabledButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.neutral[300],
    color: colors.neutral[500],
    cursor: 'not-allowed'
  };

  if (isReported) {
    return (
      <div style={containerStyles}>
        <div style={{ color: colors.success, fontSize: typography.sizes.sm }}>
          ✅ Error reported successfully
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <button
        onClick={handleReport}
        disabled={isReporting}
        style={isReporting ? disabledButtonStyles : buttonStyles}
      >
        {isReporting ? '📤 Reporting...' : '📤 Report Error'}
      </button>
    </div>
  );
};

// Error Logger Component
export const ErrorLogger: React.FC<ErrorLoggerProps> = ({
  onError,
  onReport,
  style
}) => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      error.stack = event.filename + ':' + event.lineno + ':' + event.colno;
      
      onError?.(error, {
        componentStack: '',
        errorBoundary: null
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason);
      
      onError?.(error, {
        componentStack: '',
        errorBoundary: null
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  return null;
};

// Error Boundary Hook
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => {
    setError(null);
  };

  const captureError = (error: Error) => {
    setError(error);
  };

  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

// Error Boundary Provider
export const ErrorBoundaryProvider: React.FC<{
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReport?: (errorData: any) => void;
  fallback?: ReactNode;
  style?: React.CSSProperties;
}> = ({ children, onError, onReport, fallback, style }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundaryProvider caught an error:', error, errorInfo);
    }
  };

  const handleReport = (errorData: any) => {
    onReport?.(errorData);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={fallback}
      style={style}
    >
      <ErrorLogger
        onError={handleError}
        onReport={handleReport}
      />
      {children}
    </ErrorBoundary>
  );
};

// Error Boundary with Retry
export const ErrorBoundaryWithRetry: React.FC<{
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  style?: React.CSSProperties;
}> = ({ children, onError, onRetry, maxRetries = 3, retryDelay = 1000, style }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    onError?.(error, errorInfo);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setIsRetrying(true);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsRetrying(false);
        onRetry?.();
      }, retryDelay);
    }
  };

  const handleReset = () => {
    setRetryCount(0);
    setIsRetrying(false);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      onReset={handleReset}
      fallback={
        <ErrorFallback
          error={new Error('Component failed to render')}
          errorInfo={{ componentStack: '' }}
          resetError={handleReset}
          retry={handleRetry}
        />
      }
      style={style}
    >
      {children}
    </ErrorBoundary>
  );
};
