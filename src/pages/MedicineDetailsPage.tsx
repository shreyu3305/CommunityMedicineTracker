import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle, AlertCircle, History, Image } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { colors, spacing, borderRadius } from '../styles/tokens';

interface MedicineDetailsPageProps {
  medicineName: string;
  onBack: () => void;
}

export const MedicineDetailsPage: React.FC<MedicineDetailsPageProps> = ({
  medicineName,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'availability' | 'history' | 'photos'>('availability');

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.neutral[50],
  };

  const headerStyles: React.CSSProperties = {
    background: colors.gradient.blueTeal,
    color: 'white',
    padding: spacing.xl,
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const contentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.lg,
  };

  const tabsContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderBottom: `2px solid ${colors.neutral[200]}`,
  };

  const tabStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: '16px',
    fontWeight: 600,
    color: isActive ? colors.primary : colors.neutral[600],
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `3px solid ${isActive ? colors.primary : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.25s',
    marginBottom: '-2px',
  });

  const availabilityListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={headerContentStyles}>
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            style={{ color: 'white', marginBottom: spacing.lg }}
          >
            Back to Results
          </Button>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: spacing.md }}>
            {medicineName}
          </h1>
          <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Badge variant="info" size="md">Tablet</Badge>
            <Badge variant="neutral" size="md">500mg</Badge>
            <Badge variant="neutral" size="md">Generic Available</Badge>
          </div>
          <p style={{ marginTop: spacing.md, fontSize: '16px', opacity: 0.9 }}>
            Paracetamol - Pain reliever and fever reducer
          </p>
        </div>
      </div>

      <div style={contentStyles}>
        <div style={tabsContainerStyles}>
          <button
            style={tabStyles(activeTab === 'availability')}
            onClick={() => setActiveTab('availability')}
          >
            <MapPin size={18} style={{ display: 'inline', marginRight: spacing.xs }} />
            Nearby Availability
          </button>
          <button
            style={tabStyles(activeTab === 'history')}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} style={{ display: 'inline', marginRight: spacing.xs }} />
            Reports History
          </button>
          <button
            style={tabStyles(activeTab === 'photos')}
            onClick={() => setActiveTab('photos')}
          >
            <Image size={18} style={{ display: 'inline', marginRight: spacing.xs }} />
            Photos & Notes
          </button>
        </div>

        {activeTab === 'availability' && (
          <div style={availabilityListStyles}>
            {[1, 2, 3].map((item) => (
              <Card key={item} hover padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.neutral[900] }}>
                        HealthPlus Pharmacy
                      </h3>
                      <CheckCircle size={18} color={colors.primary} fill={colors.primary} />
                    </div>
                    <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.sm }}>
                      123 Main Street, Downtown
                    </p>
                    <div style={{ display: 'flex', gap: spacing.md, fontSize: '14px', color: colors.neutral[600] }}>
                      <span>Distance: 0.5 km</span>
                      <span>•</span>
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, alignItems: 'flex-end' }}>
                    <Badge variant="success" icon={<CheckCircle size={14} />}>
                      In Stock
                    </Badge>
                    <span style={{ fontSize: '12px', color: colors.neutral[500] }}>
                      Confidence: <strong style={{ color: colors.success }}>95%</strong>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={availabilityListStyles}>
            <Card padding="lg">
              <div style={{ borderLeft: `3px solid ${colors.success}`, paddingLeft: spacing.md, marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontWeight: 600, color: colors.neutral[900] }}>Status Updated</span>
                  <Badge variant="success">In Stock</Badge>
                </div>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.xs }}>
                  HealthPlus Pharmacy - 123 Main Street
                </p>
                <p style={{ fontSize: '12px', color: colors.neutral[500] }}>
                  Reported by John D. • 2 hours ago • Verified
                </p>
              </div>

              <div style={{ borderLeft: `3px solid ${colors.error}`, paddingLeft: spacing.md, marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontWeight: 600, color: colors.neutral[900] }}>Status Updated</span>
                  <Badge variant="error">Out of Stock</Badge>
                </div>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.xs }}>
                  City Care Drugstore - 456 Oak Avenue
                </p>
                <p style={{ fontSize: '12px', color: colors.neutral[500] }}>
                  Reported by Sarah M. • 5 hours ago
                </p>
              </div>

              <div style={{ borderLeft: `3px solid ${colors.success}`, paddingLeft: spacing.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontWeight: 600, color: colors.neutral[900] }}>Status Updated</span>
                  <Badge variant="success">In Stock</Badge>
                </div>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.xs }}>
                  Wellness Pharmacy - 789 Pine Road
                </p>
                <p style={{ fontSize: '12px', color: colors.neutral[500] }}>
                  Reported by Mike R. • 1 day ago • Verified
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'photos' && (
          <Card padding="lg">
            <div style={{ textAlign: 'center', padding: spacing['2xl'], color: colors.neutral[400] }}>
              <Image size={48} style={{ margin: '0 auto', marginBottom: spacing.md }} />
              <p style={{ fontSize: '16px', marginBottom: spacing.xs }}>No photos available yet</p>
              <p style={{ fontSize: '14px' }}>Be the first to add a photo when reporting availability</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
