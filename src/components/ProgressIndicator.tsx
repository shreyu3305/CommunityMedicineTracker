import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export type ProgressStepStatus = 'pending' | 'current' | 'completed' | 'error';

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: ProgressStepStatus;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
  showStepNumbers?: boolean;
  style?: React.CSSProperties;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  showDescriptions = true,
  showStepNumbers = true,
  style
}) => {
  const getStepIcon = (step: ProgressStep, index: number) => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
    
    if (step.status === 'completed') {
      return <CheckCircle size={iconSize} color={colors.success} />;
    }
    
    if (step.status === 'error') {
      return <AlertCircle size={iconSize} color={colors.error} />;
    }
    
    if (step.status === 'current') {
      return <Clock size={iconSize} color={colors.primary} />;
    }
    
    return <Circle size={iconSize} color={colors.neutral[400]} />;
  };

  const getStepStyles = (step: ProgressStep, index: number) => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.xs,
      padding: orientation === 'horizontal' ? `${spacing.md} ${spacing.sm}` : `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      minWidth: orientation === 'horizontal' ? '180px' : 'auto',
      maxWidth: orientation === 'horizontal' ? '200px' : 'auto',
      width: orientation === 'horizontal' ? '180px' : 'auto',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: size === 'sm' ? '11px' : size === 'md' ? '12px' : '14px',
      textAlign: 'center',
      flex: 1,
      height: orientation === 'horizontal' ? '90px' : 'auto',
      overflow: 'hidden',
      wordWrap: 'break-word',
      whiteSpace: 'normal'
    };

    const statusStyles = {
      pending: {
        background: colors.background.primary,
        color: colors.text.tertiary,
        border: `2px solid ${colors.border.light}`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      },
      current: {
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}25 100%)`,
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        boxShadow: `0 4px 12px ${colors.primary}30`,
        fontWeight: 600
      },
      completed: {
        background: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.success}25 100%)`,
        color: colors.success,
        border: `2px solid ${colors.success}`,
        boxShadow: `0 4px 12px ${colors.success}30`,
        fontWeight: 600
      },
      error: {
        background: `linear-gradient(135deg, ${colors.error}15 0%, ${colors.error}25 100%)`,
        color: colors.error,
        border: `2px solid ${colors.error}`,
        boxShadow: `0 4px 12px ${colors.error}30`,
        fontWeight: 600
      }
    };

    return {
      ...baseStyles,
      ...statusStyles[step.status]
    };
  };

  const getConnectorStyles = (index: number) => {
    const isLastStep = index === steps.length - 1;
    if (isLastStep) return { display: 'none' };

    const currentStepIndex = currentStep || steps.findIndex(step => step.status === 'current');
    const isCompleted = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;

    return {
      width: orientation === 'horizontal' ? '30px' : '2px',
      height: orientation === 'horizontal' ? '3px' : '20px',
      background: isCompleted 
        ? colors.success
        : isCurrent 
        ? colors.primary
        : colors.border.light,
      borderRadius: borderRadius.full,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      margin: orientation === 'horizontal' ? `0 ${spacing.sm}` : `${spacing.xs} 0`,
      flexShrink: 0,
      alignSelf: 'center'
    };
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
    gap: orientation === 'horizontal' ? 0 : spacing.md,
    padding: orientation === 'horizontal' ? `${spacing.lg} ${spacing.xl}` : `${spacing.xl} ${spacing.lg}`,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.light}`,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    ...style
  };

  const stepContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    alignItems: 'center',
    gap: orientation === 'horizontal' ? 0 : spacing.xs,
    width: '100%',
    justifyContent: 'space-between',
    alignContent: 'center',
    flexWrap: 'nowrap'
  };

  const stepNumberStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size === 'sm' ? '24px' : size === 'md' ? '28px' : '32px',
    height: size === 'sm' ? '24px' : size === 'md' ? '28px' : '32px',
    borderRadius: borderRadius.full,
    fontSize: size === 'sm' ? '12px' : size === 'md' ? '14px' : '16px',
    fontWeight: 600,
    background: 'currentColor',
    color: 'white',
    marginRight: orientation === 'horizontal' ? spacing.sm : 0,
    marginBottom: orientation === 'horizontal' ? 0 : spacing.xs
  };

  const titleStyles: React.CSSProperties = {
    fontSize: size === 'sm' ? '12px' : size === 'md' ? '13px' : '14px',
    fontWeight: 600,
    color: 'inherit',
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.2,
    wordWrap: 'break-word',
    overflow: 'hidden',
    maxWidth: '100%'
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: size === 'sm' ? '10px' : size === 'md' ? '11px' : '12px',
    color: colors.neutral[600],
    margin: 0,
    marginTop: orientation === 'horizontal' ? spacing.xs : spacing.xs,
    textAlign: 'center',
    lineHeight: 1.3,
    wordWrap: 'break-word',
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'normal'
  };

  return (
    <div style={containerStyles}>
      {steps.map((step, index) => (
        <div key={step.id} style={stepContainerStyles}>
          <div style={getStepStyles(step, index)}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              {!showStepNumbers && getStepIcon(step, index)}
              <div>
                <h4 style={titleStyles}>{step.title}</h4>
                {showDescriptions && step.description && (
                  <p style={descriptionStyles}>{step.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {orientation === 'horizontal' && (
            <div style={getConnectorStyles(index)} />
          )}
        </div>
      ))}
    </div>
  );
};

// Compact version for small spaces
export const CompactProgressIndicator: React.FC<ProgressIndicatorProps> = (props) => (
  <ProgressIndicator
    {...props}
    size="sm"
    showDescriptions={false}
    orientation="horizontal"
    style={{
      ...props.style,
      gap: spacing.xs
    }}
  />
);

// Step-by-step progress with navigation
export const StepProgressIndicator: React.FC<ProgressIndicatorProps & {
  onStepClick?: (stepIndex: number) => void;
  allowStepNavigation?: boolean;
}> = ({
  steps,
  currentStep,
  onStepClick,
  allowStepNavigation = false,
  ...props
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (allowStepNavigation && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  const getStepStyles = (step: ProgressStep, index: number) => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borderRadius.md,
      transition: 'all 0.3s ease',
      cursor: allowStepNavigation ? 'pointer' : 'default'
    };

    const statusStyles = {
      pending: {
        background: 'transparent',
        color: colors.neutral[500],
        border: `1px solid ${colors.neutral[300]}`
      },
      current: {
        background: colors.primary + '15',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        boxShadow: shadows.sm
      },
      completed: {
        background: colors.success + '15',
        color: colors.success,
        border: `1px solid ${colors.success}40`
      },
      error: {
        background: colors.error + '15',
        color: colors.error,
        border: `1px solid ${colors.error}40`
      }
    };

    return {
      ...baseStyles,
      ...statusStyles[step.status],
      ...(allowStepNavigation && {
        '&:hover': {
          background: colors.neutral[100],
          transform: 'translateY(-1px)'
        }
      })
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, ...props.style }}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          style={getStepStyles(step, index)}
          onClick={() => handleStepClick(index)}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: borderRadius.full,
            background: step.status === 'completed' ? colors.success : 
                       step.status === 'current' ? colors.primary : 
                       step.status === 'error' ? colors.error : colors.neutral[300],
            color: 'white',
            fontSize: '12px',
            fontWeight: 600
          }}>
            {step.status === 'completed' ? (
              <CheckCircle size={14} />
            ) : step.status === 'error' ? (
              <AlertCircle size={14} />
            ) : (
              index + 1
            )}
          </div>
          
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              margin: 0
            }}>
              {step.title}
            </h4>
            {step.description && (
              <p style={{
                fontSize: '12px',
                color: colors.neutral[600],
                margin: 0,
                marginTop: spacing.xs
              }}>
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Progress bar version
export const ProgressBar: React.FC<{
  steps: ProgressStep[];
  currentStep?: number;
  showLabels?: boolean;
  style?: React.CSSProperties;
}> = ({
  steps,
  currentStep,
  showLabels = true,
  style
}) => {
  const currentStepIndex = currentStep || steps.findIndex(step => step.status === 'current');
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    ...style
  };

  const barContainerStyles: React.CSSProperties = {
    width: '100%',
    height: '8px',
    background: colors.neutral[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative'
  };

  const barStyles: React.CSSProperties = {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.success} 100%)`,
    borderRadius: borderRadius.full,
    width: `${progress}%`,
    transition: 'width 0.5s ease'
  };

  const labelsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: colors.neutral[600]
  };

  return (
    <div style={containerStyles}>
      <div style={barContainerStyles}>
        <div style={barStyles} />
      </div>
      
      {showLabels && (
        <div style={labelsStyles}>
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      )}
    </div>
  );
};
