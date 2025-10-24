import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import type { MedicineCategory as MedicineCategoryType } from '../types';

interface MedicineCategoryProps {
  category: MedicineCategoryType;
  isSelected?: boolean;
  onClick?: (categoryId: string) => void;
  compact?: boolean;
}

export const MedicineCategory: React.FC<MedicineCategoryProps> = ({
  category,
  isSelected = false,
  onClick,
  compact = false
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: compact ? spacing.md : spacing.lg,
    borderRadius: borderRadius.lg,
    border: `2px solid ${isSelected ? category.color : colors.neutral[200]}`,
    background: isSelected ? `${category.color}10` : 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isSelected ? shadows.md : shadows.sm,
    position: 'relative',
    overflow: 'hidden'
  };

  const iconContainerStyles: React.CSSProperties = {
    width: compact ? '40px' : '48px',
    height: compact ? '40px' : '48px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: compact ? '18px' : '20px',
    fontWeight: 'bold',
    boxShadow: `0 4px 12px ${category.color}40`
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  };

  const titleStyles: React.CSSProperties = {
    fontSize: compact ? '14px' : '16px',
    fontWeight: 600,
    color: isSelected ? category.color : colors.neutral[900],
    margin: 0
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: compact ? '12px' : '14px',
    color: colors.neutral[600],
    margin: 0,
    lineHeight: '140%'
  };

  const countStyles: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: isSelected ? category.color : colors.neutral[500],
    background: isSelected ? 'white' : colors.neutral[100],
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start'
  };

  const handleClick = () => {
    if (onClick) {
      onClick(category.id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelected) {
      e.currentTarget.style.borderColor = category.color;
      e.currentTarget.style.background = `${category.color}05`;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = shadows.lg;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelected) {
      e.currentTarget.style.borderColor = colors.neutral[200];
      e.currentTarget.style.background = 'white';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = shadows.sm;
    }
  };

  return (
    <div
      style={containerStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={iconContainerStyles}>
        {category.icon}
      </div>
      
      <div style={contentStyles}>
        <h3 style={titleStyles}>{category.name}</h3>
        <p style={descriptionStyles}>{category.description}</p>
      </div>
      
      <div style={countStyles}>
        {category.medicineCount} medicines
      </div>
    </div>
  );
};

// Medicine Categories Data
export const medicineCategories: MedicineCategoryType[] = [
  {
    id: 'pain-relief',
    name: 'Pain Relief',
    description: 'Analgesics and pain management medicines',
    icon: '💊',
    color: colors.primary,
    medicineCount: 45
  },
  {
    id: 'antibiotics',
    name: 'Antibiotics',
    description: 'Anti-bacterial and infection treatment',
    icon: '🦠',
    color: colors.error,
    medicineCount: 32
  },
  {
    id: 'vitamins',
    name: 'Vitamins & Supplements',
    description: 'Nutritional supplements and vitamins',
    icon: '💊',
    color: colors.warning,
    medicineCount: 28
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    description: 'Cough, cold, and breathing medicines',
    icon: '🫁',
    color: colors.info,
    medicineCount: 24
  },
  {
    id: 'digestive',
    name: 'Digestive Health',
    description: 'Stomach, digestion, and gut health',
    icon: '🫀',
    color: colors.success,
    medicineCount: 19
  },
  {
    id: 'cardiovascular',
    name: 'Heart & Blood',
    description: 'Cardiovascular and blood pressure medicines',
    icon: '❤️',
    color: colors.error,
    medicineCount: 16
  },
  {
    id: 'diabetes',
    name: 'Diabetes Care',
    description: 'Blood sugar management and insulin',
    icon: '🩸',
    color: colors.warning,
    medicineCount: 14
  },
  {
    id: 'dermatology',
    name: 'Skin Care',
    description: 'Skin treatments and dermatology medicines',
    icon: '🧴',
    color: colors.info,
    medicineCount: 12
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    description: 'Anxiety, depression, and mental wellness',
    icon: '🧠',
    color: colors.primary,
    medicineCount: 10
  },
  {
    id: 'women-health',
    name: 'Women\'s Health',
    description: 'Gynecology and women\'s wellness',
    icon: '👩',
    color: colors.warning,
    medicineCount: 8
  }
];
