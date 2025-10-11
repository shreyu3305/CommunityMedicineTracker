import React, { useState } from 'react';
import { MapPin, Phone, Clock, CheckCircle, AlertCircle, HelpCircle, Filter, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import type { Pharmacy } from '../types';

interface SearchResultsPageProps {
  searchQuery: string;
  onReportClick: () => void;
  onPharmacyClick: (pharmacyId: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchQuery,
  onReportClick,
  onPharmacyClick,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  const mockPharmacies: Pharmacy[] = [
    {
      id: '1',
      name: 'HealthPlus Pharmacy',
      address: '123 Main Street, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      phone: '+1 (555) 123-4567',
      isVerified: true,
      distance: 0.5,
    },
    {
      id: '2',
      name: 'City Care Drugstore',
      address: '456 Oak Avenue, Midtown',
      latitude: 40.7580,
      longitude: -73.9855,
      phone: '+1 (555) 234-5678',
      isVerified: true,
      distance: 1.2,
    },
    {
      id: '3',
      name: 'Wellness Pharmacy',
      address: '789 Pine Road, Uptown',
      latitude: 40.7829,
      longitude: -73.9654,
      phone: '+1 (555) 345-6789',
      isVerified: false,
      distance: 2.3,
    },
  ];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.neutral[50],
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: 'white',
    padding: spacing.lg,
    boxShadow: shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  };

  const mainContentStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.lg,
    display: 'grid',
    gridTemplateColumns: '1fr 600px',
    gap: spacing.lg,
    minHeight: 'calc(100vh - 100px)',
  };

  const listContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  };

  const pharmacyCardStyles: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'all 0.25s',
  };

  const mapContainerStyles: React.CSSProperties = {
    position: 'sticky',
    top: '100px',
    height: 'calc(100vh - 120px)',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE), linear-gradient(45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE)',
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    overflow: 'hidden',
  };

  const fabStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 20,
    boxShadow: shadows['2xl'],
  };

  const getStatusIcon = (status: 'in_stock' | 'out_of_stock' | 'unknown') => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle size={16} />;
      case 'out_of_stock':
        return <AlertCircle size={16} />;
      default:
        return <HelpCircle size={16} />;
    }
  };

  const getStatusBadge = (status: 'in_stock' | 'out_of_stock' | 'unknown') => {
    const variantMap = {
      in_stock: 'success' as const,
      out_of_stock: 'error' as const,
      unknown: 'neutral' as const,
    };

    const labelMap = {
      in_stock: 'In Stock',
      out_of_stock: 'Out of Stock',
      unknown: 'Unknown',
    };

    return (
      <Badge variant={variantMap[status]} icon={getStatusIcon(status)}>
        {labelMap[status]}
      </Badge>
    );
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={headerContentStyles}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: colors.neutral[900], marginBottom: spacing.xs }}>
              Results for "{searchQuery}"
            </h1>
            <p style={{ fontSize: '14px', color: colors.neutral[600] }}>
              Found {mockPharmacies.length} pharmacies near you
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <Button
              variant="outline"
              size="md"
              icon={<Filter size={20} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div style={mainContentStyles}>
        <div style={listContainerStyles}>
          {mockPharmacies.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              hover
              padding="lg"
              onClick={() => {
                setSelectedPharmacy(pharmacy.id);
                onPharmacyClick(pharmacy.id);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.neutral[900] }}>
                      {pharmacy.name}
                    </h3>
                    {pharmacy.isVerified && (
                      <CheckCircle size={20} color={colors.primary} fill={colors.primary} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.neutral[600], fontSize: '14px', marginBottom: spacing.xs }}>
                    <MapPin size={16} />
                    <span>{pharmacy.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.neutral[600], fontSize: '14px' }}>
                    <Phone size={16} />
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.sm }}>
                  <Badge variant="info">{pharmacy.distance} km</Badge>
                  {getStatusBadge('in_stock')}
                  <div style={{ fontSize: '12px', color: colors.neutral[500], display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                    <Clock size={12} />
                    <span>Updated 2h ago</span>
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: spacing.md,
                borderTop: `1px solid ${colors.neutral[200]}`,
              }}>
                <span style={{ fontSize: '12px', color: colors.neutral[500] }}>
                  Confidence Score: <strong style={{ color: colors.success }}>95%</strong>
                </span>
                <span style={{ fontSize: '12px', color: colors.primary, fontWeight: 600 }}>
                  View Details →
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div style={mapContainerStyles}>
          <div style={{ textAlign: 'center', color: colors.neutral[400] }}>
            <MapPin size={48} style={{ margin: '0 auto', marginBottom: spacing.md }} />
            <p style={{ fontSize: '16px' }}>Interactive Map View</p>
            <p style={{ fontSize: '14px', marginTop: spacing.xs }}>Google Maps integration would appear here</p>
          </div>
        </div>
      </div>

      <div style={fabStyles}>
        <Button
          variant="primary"
          size="lg"
          icon={<Plus size={24} />}
          onClick={onReportClick}
        >
          Report Availability
        </Button>
      </div>
    </div>
  );
};
