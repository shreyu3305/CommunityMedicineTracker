import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface PriceDisplayProps {
  price?: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showComparison?: boolean;
  showSavings?: boolean;
  compact?: boolean;
  style?: React.CSSProperties;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = '₹',
  size = 'md',
  showComparison = false,
  showSavings = false,
  compact = false,
  style
}) => {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getSavings = (): number | null => {
    if (!originalPrice || !price) return null;
    return originalPrice - price;
  };

  const getSavingsPercentage = (): number | null => {
    if (!originalPrice || !price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const getPriceTrend = (): 'up' | 'down' | 'stable' | null => {
    if (!originalPrice || !price) return null;
    if (price > originalPrice) return 'up';
    if (price < originalPrice) return 'down';
    return 'stable';
  };

  const sizeMap = {
    sm: { fontSize: '12px', iconSize: 12, padding: spacing.xs },
    md: { fontSize: '14px', iconSize: 14, padding: spacing.sm },
    lg: { fontSize: '16px', iconSize: 16, padding: spacing.md }
  };

  const currentSize = sizeMap[size];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    ...style
  };

  const priceStyles: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    fontWeight: 600,
    color: colors.neutral[900],
    margin: 0
  };

  const originalPriceStyles: React.CSSProperties = {
    fontSize: compact ? '11px' : '12px',
    color: colors.neutral[500],
    textDecoration: 'line-through',
    margin: 0
  };

  const savingsStyles: React.CSSProperties = {
    fontSize: compact ? '10px' : '11px',
    fontWeight: 600,
    color: colors.success,
    background: `${colors.success}10`,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    margin: 0
  };

  const trendIconStyles: React.CSSProperties = {
    color: colors.neutral[400],
    flexShrink: 0
  };

  if (!price) {
    return (
      <div style={containerStyles}>
        <AlertCircle size={currentSize.iconSize} color={colors.neutral[400]} />
        <span style={{ ...priceStyles, color: colors.neutral[500] }}>
          Price not available
        </span>
      </div>
    );
  }

  const savings = getSavings();
  const savingsPercentage = getSavingsPercentage();
  const trend = getPriceTrend();

  return (
    <div style={containerStyles}>
      <DollarSign size={currentSize.iconSize} color={colors.primary} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <span style={priceStyles}>
            {formatPrice(price)}
          </span>
          
          {trend && showComparison && (
            <>
              {trend === 'up' && <TrendingUp size={12} color={colors.error} />}
              {trend === 'down' && <TrendingDown size={12} color={colors.success} />}
              {trend === 'stable' && <Minus size={12} color={colors.neutral[400]} />}
            </>
          )}
        </div>
        
        {originalPrice && originalPrice !== price && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <span style={originalPriceStyles}>
              {formatPrice(originalPrice)}
            </span>
            
            {showSavings && savings && savingsPercentage && (
              <span style={savingsStyles}>
                Save {formatPrice(savings)} ({savingsPercentage}%)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Price comparison component
export const PriceComparison: React.FC<{
  prices: Array<{ pharmacy: string; price: number; originalPrice?: number }>;
  style?: React.CSSProperties;
}> = ({ prices, style }) => {
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.md,
    background: colors.neutral[50],
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
    ...style
  };

  const headerStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral[900],
    margin: 0,
    marginBottom: spacing.xs
  };

  const priceItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    background: 'white',
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[200]}`
  };

  const pharmacyStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: colors.neutral[700],
    margin: 0
  };

  const priceStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral[900],
    margin: 0
  };

  const bestPriceStyles: React.CSSProperties = {
    ...priceStyles,
    color: colors.success
  };

  return (
    <div style={containerStyles}>
      <h4 style={headerStyles}>Price Comparison</h4>
      {sortedPrices.map((item, index) => (
        <div key={index} style={priceItemStyles}>
          <span style={pharmacyStyles}>{item.pharmacy}</span>
          <span style={index === 0 ? bestPriceStyles : priceStyles}>
            ₹{item.price.toFixed(2)}
          </span>
        </div>
      ))}
      
      {sortedPrices.length > 1 && (
        <div style={{
          fontSize: '12px',
          color: colors.neutral[600],
          textAlign: 'center',
          marginTop: spacing.xs
        }}>
          Price range: ₹{lowestPrice.price.toFixed(2)} - ₹{highestPrice.price.toFixed(2)}
        </div>
      )}
    </div>
  );
};

// Price badge component for cards
export const PriceBadge: React.FC<{
  price: number;
  originalPrice?: number;
  currency?: string;
  style?: React.CSSProperties;
}> = ({ price, originalPrice, currency = '₹', style }) => {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getSavings = (): number | null => {
    if (!originalPrice || !price) return null;
    return originalPrice - price;
  };

  const savings = getSavings();

  const badgeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    background: savings ? `${colors.success}10` : colors.primaryLight,
    border: `1px solid ${savings ? colors.success : colors.primary}30`,
    fontSize: '12px',
    fontWeight: 600,
    color: savings ? colors.success : colors.primary,
    ...style
  };

  return (
    <div style={badgeStyles}>
      <DollarSign size={12} />
      <span>{formatPrice(price)}</span>
      {savings && (
        <span style={{ fontSize: '10px', opacity: 0.8 }}>
          (Save ₹{savings.toFixed(2)})
        </span>
      )}
    </div>
  );
};
