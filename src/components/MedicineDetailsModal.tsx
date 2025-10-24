import React from 'react';
import { X, Pill, AlertTriangle, Shield, Clock, Star, Heart, Brain, Eye, Droplet, Zap, Info, CheckCircle, XCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';

interface MedicineDetails {
  id: string;
  name: string;
  genericName: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler' | 'other';
  strength: string;
  manufacturer: string;
  description: string;
  category: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  dosage: {
    adults: string;
    children: string;
    elderly: string;
  };
  sideEffects: string[];
  interactions: string[];
  warnings: string[];
  storage: string;
  expiry: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  images?: string[];
}

interface MedicineDetailsModalProps {
  medicine: MedicineDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineDetailsModal: React.FC<MedicineDetailsModalProps> = ({
  medicine,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getFormIcon = (form: string) => {
    switch (form) {
      case 'tablet': return <Pill size={20} />;
      case 'capsule': return <Pill size={20} />;
      case 'syrup': return <Droplet size={20} />;
      case 'injection': return <Zap size={20} />;
      case 'cream': return <Heart size={20} />;
      case 'drops': return <Eye size={20} />;
      case 'inhaler': return <Brain size={20} />;
      default: return <Pill size={20} />;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge variant="success" icon={<CheckCircle size={14} />}>In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning" icon={<AlertTriangle size={14} />}>Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="error" icon={<XCircle size={14} />}>Out of Stock</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'pain-relief': colors.error,
      'antibiotics': colors.info,
      'vitamins-supplements': colors.success,
      'respiratory': colors.warning,
      'digestive': colors.primary,
      'cardiovascular': colors.error,
      'diabetes': colors.info,
      'skin-care': colors.warning,
      'mental-health': colors.primary,
      "women's-health": colors.error
    };
    return colors[category] || colors.neutral[500];
  };

  const modalOverlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing.lg
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.xl,
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.primary}05 100%)`
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.neutral[900],
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '16px',
    color: colors.neutral[600],
    margin: 0,
    marginTop: spacing.xs
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.xl,
    overflowY: 'auto',
    flex: 1
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: spacing.xl
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const infoGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md
  };

  const infoItemStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  };

  const infoLabelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.neutral[600]
  };

  const infoValueStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[900]
  };

  const listStyles: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const listItemStyles: React.CSSProperties = {
    padding: `${spacing.sm} 0`,
    borderBottom: `1px solid ${colors.neutral[100]}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const ratingStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const starStyles: React.CSSProperties = {
    color: colors.warning,
    display: 'flex',
    gap: '2px'
  };

  const priceStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    color: colors.success
  };

  const originalPriceStyles: React.CSSProperties = {
    fontSize: '16px',
    color: colors.neutral[500],
    textDecoration: 'line-through',
    marginLeft: spacing.sm
  };

  return (
    <div style={modalOverlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyles}>
          <div>
            <h2 style={titleStyles}>
              {getFormIcon(medicine.form)}
              {medicine.name}
            </h2>
            <p style={subtitleStyles}>
              {medicine.genericName} • {medicine.strength} • {medicine.manufacturer}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={20} />}
            onClick={onClose}
            style={{ color: colors.neutral[500] }}
          />
        </div>

        {/* Content */}
        <div style={contentStyles}>
          {/* Basic Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Info size={20} color={colors.primary} />
              Basic Information
            </h3>
            <div style={infoGridStyles}>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Category</span>
                <Badge 
                  variant="custom" 
                  style={{ 
                    backgroundColor: `${getCategoryColor(medicine.category)}20`,
                    color: getCategoryColor(medicine.category),
                    border: `1px solid ${getCategoryColor(medicine.category)}30`
                  }}
                >
                  {medicine.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Form</span>
                <span style={infoValueStyles}>{medicine.form.charAt(0).toUpperCase() + medicine.form.slice(1)}</span>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Strength</span>
                <span style={infoValueStyles}>{medicine.strength}</span>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Availability</span>
                {getAvailabilityBadge(medicine.availability)}
              </div>
            </div>
          </div>

          {/* Price Information */}
          {medicine.price && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>
                <Shield size={20} color={colors.success} />
                Pricing
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <span style={priceStyles}>
                  {medicine.currency || '₹'}{medicine.price.toFixed(2)}
                </span>
                {medicine.originalPrice && (
                  <span style={originalPriceStyles}>
                    {medicine.currency || '₹'}{medicine.originalPrice.toFixed(2)}
                  </span>
                )}
                {medicine.originalPrice && (
                  <Badge variant="success">
                    Save {medicine.currency || '₹'}{(medicine.originalPrice - medicine.price).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Star size={20} color={colors.warning} />
              Rating & Reviews
            </h3>
            <div style={ratingStyles}>
              <div style={starStyles}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(medicine.rating) ? colors.warning : 'none'}
                    color={i < Math.floor(medicine.rating) ? colors.warning : colors.neutral[300]}
                  />
                ))}
              </div>
              <span style={{ fontSize: '16px', fontWeight: 600, color: colors.neutral[900] }}>
                {medicine.rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '14px', color: colors.neutral[600] }}>
                ({medicine.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Dosage Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Clock size={20} color={colors.info} />
              Dosage Information
            </h3>
            <div style={infoGridStyles}>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Adults</span>
                <span style={infoValueStyles}>{medicine.dosage.adults}</span>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Children</span>
                <span style={infoValueStyles}>{medicine.dosage.children}</span>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Elderly</span>
                <span style={infoValueStyles}>{medicine.dosage.elderly}</span>
              </div>
            </div>
          </div>

          {/* Side Effects */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <AlertTriangle size={20} color={colors.warning} />
              Side Effects
            </h3>
            <ul style={listStyles}>
              {medicine.sideEffects.map((effect, index) => (
                <li key={index} style={listItemStyles}>
                  <AlertTriangle size={16} color={colors.warning} />
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Drug Interactions */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <XCircle size={20} color={colors.error} />
              Drug Interactions
            </h3>
            <ul style={listStyles}>
              {medicine.interactions.map((interaction, index) => (
                <li key={index} style={listItemStyles}>
                  <XCircle size={16} color={colors.error} />
                  <span>{interaction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Shield size={20} color={colors.error} />
              Important Warnings
            </h3>
            <ul style={listStyles}>
              {medicine.warnings.map((warning, index) => (
                <li key={index} style={listItemStyles}>
                  <Shield size={16} color={colors.error} />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Storage Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Clock size={20} color={colors.info} />
              Storage & Expiry
            </h3>
            <div style={infoGridStyles}>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Storage Instructions</span>
                <span style={infoValueStyles}>{medicine.storage}</span>
              </div>
              <div style={infoItemStyles}>
                <span style={infoLabelStyles}>Expiry Date</span>
                <span style={infoValueStyles}>{medicine.expiry}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>
              <Info size={20} color={colors.primary} />
              Description
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: colors.neutral[700], margin: 0 }}>
              {medicine.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: spacing.xl,
          borderTop: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          gap: spacing.md,
          justifyContent: 'flex-end',
          background: colors.neutral[50]
        }}>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mock medicine details data
export const mockMedicineDetails: MedicineDetails[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    form: 'tablet',
    strength: '500mg',
    manufacturer: 'Various',
    description: 'Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It is effective for treating mild to moderate pain and reducing fever. It works by blocking the production of prostaglandins in the brain.',
    category: 'pain-relief',
    price: 25.50,
    originalPrice: 30.00,
    currency: '₹',
    dosage: {
      adults: '1-2 tablets every 4-6 hours (max 8 tablets/day)',
      children: '10-15mg/kg every 4-6 hours',
      elderly: '1 tablet every 6-8 hours'
    },
    sideEffects: [
      'Nausea and vomiting (rare)',
      'Allergic reactions (very rare)',
      'Liver damage (with overdose)',
      'Skin rash (rare)'
    ],
    interactions: [
      'Warfarin - may increase bleeding risk',
      'Alcohol - may increase liver damage risk',
      'Other paracetamol products - risk of overdose'
    ],
    warnings: [
      'Do not exceed recommended dose',
      'Consult doctor if pregnant or breastfeeding',
      'Avoid alcohol while taking this medication',
      'Stop use if allergic reaction occurs'
    ],
    storage: 'Store at room temperature, away from moisture and heat',
    expiry: '2025-12-31',
    availability: 'in_stock',
    rating: 4.2,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    form: 'tablet',
    strength: '400mg',
    manufacturer: 'Various',
    description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and fever. It works by reducing hormones that cause inflammation and pain in the body.',
    category: 'pain-relief',
    price: 35.75,
    originalPrice: 40.00,
    currency: '₹',
    dosage: {
      adults: '1 tablet every 6-8 hours (max 4 tablets/day)',
      children: '5-10mg/kg every 6-8 hours',
      elderly: '1 tablet every 8-12 hours'
    },
    sideEffects: [
      'Stomach upset and heartburn',
      'Dizziness and headache',
      'Increased blood pressure',
      'Stomach ulcers (with long-term use)'
    ],
    interactions: [
      'Aspirin - may reduce effectiveness',
      'Blood pressure medications - may reduce effectiveness',
      'Warfarin - may increase bleeding risk'
    ],
    warnings: [
      'Take with food to reduce stomach upset',
      'Do not use if you have stomach ulcers',
      'Consult doctor if you have heart problems',
      'Avoid alcohol while taking this medication'
    ],
    storage: 'Store at room temperature, protect from light',
    expiry: '2025-06-30',
    availability: 'in_stock',
    rating: 4.0,
    reviewCount: 95
  }
];
