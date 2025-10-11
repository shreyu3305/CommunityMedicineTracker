import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Clock, CheckCircle, Edit } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface PharmacyProfilePageProps {
  pharmacyId: string;
  onBack: () => void;
}

export const PharmacyProfilePage: React.FC<PharmacyProfilePageProps> = ({
  pharmacyId,
  onBack,
}) => {
  const mockPharmacy = {
    id: pharmacyId,
    name: 'HealthPlus Pharmacy',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'contact@healthplus.com',
    isVerified: true,
    openHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 6:00 PM',
      sunday: 'Closed',
    },
  };

  const mockInventory = [
    { medicine: 'Paracetamol 500mg', status: 'in_stock', lastUpdated: '2 hours ago' },
    { medicine: 'Ibuprofen 400mg', status: 'in_stock', lastUpdated: '3 hours ago' },
    { medicine: 'Amoxicillin 250mg', status: 'low_stock', lastUpdated: '1 day ago' },
    { medicine: 'Aspirin 75mg', status: 'out_of_stock', lastUpdated: '2 days ago' },
  ];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.neutral[50],
  };

  const headerStyles: React.CSSProperties = {
    background: colors.gradient.blueTeal,
    color: 'white',
    padding: spacing.xl,
    position: 'relative',
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const profileImageStyles: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.xl,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 700,
    color: colors.primary,
    boxShadow: shadows.xl,
    margin: '0 auto',
    marginBottom: spacing.lg,
  };

  const contentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.lg,
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  };

  const infoRowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.md} 0`,
    borderBottom: `1px solid ${colors.neutral[100]}`,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
  };

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error'> = {
      in_stock: 'success',
      low_stock: 'warning',
      out_of_stock: 'error',
    };

    const labels: Record<string, string> = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
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
            Back
          </Button>

          <div style={profileImageStyles}>H+</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{mockPharmacy.name}</h1>
              {mockPharmacy.isVerified && (
                <CheckCircle size={28} fill="white" color={colors.primary} />
              )}
            </div>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: spacing.md }}>
              {mockPharmacy.address}
            </p>
            <Badge variant="success" size="md">Open Now</Badge>
          </div>
        </div>
      </div>

      <div style={contentStyles}>
        <div style={gridStyles}>
          <Card padding="lg">
            <h2 style={sectionTitleStyles}>Contact Information</h2>
            <div>
              <div style={infoRowStyles}>
                <Phone size={20} color={colors.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: colors.neutral[600] }}>Phone</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: colors.neutral[900] }}>
                    {mockPharmacy.phone}
                  </div>
                </div>
              </div>
              <div style={infoRowStyles}>
                <Mail size={20} color={colors.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: colors.neutral[600] }}>Email</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: colors.neutral[900] }}>
                    {mockPharmacy.email}
                  </div>
                </div>
              </div>
              <div style={infoRowStyles}>
                <MapPin size={20} color={colors.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: colors.neutral[600] }}>Address</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: colors.neutral[900] }}>
                    {mockPharmacy.address}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 style={sectionTitleStyles}>Opening Hours</h2>
            <div>
              {Object.entries(mockPharmacy.openHours).map(([day, hours]) => (
                <div key={day} style={infoRowStyles}>
                  <Clock size={20} color={colors.primary} />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: colors.neutral[900], textTransform: 'capitalize' }}>
                      {day}
                    </span>
                    <span style={{ fontSize: '16px', color: hours === 'Closed' ? colors.error : colors.neutral[600] }}>
                      {hours}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <h2 style={sectionTitleStyles}>Current Inventory</h2>
            <Button variant="outline" size="sm" icon={<Edit size={18} />}>
              Update Inventory
            </Button>
          </div>
          <table style={tableStyles}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                <th style={{ textAlign: 'left', padding: spacing.md, fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                  Medicine
                </th>
                <th style={{ textAlign: 'center', padding: spacing.md, fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                  Status
                </th>
                <th style={{ textAlign: 'right', padding: spacing.md, fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map((item, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${colors.neutral[100]}` }}>
                  <td style={{ padding: spacing.md, fontSize: '16px', color: colors.neutral[900] }}>
                    {item.medicine}
                  </td>
                  <td style={{ padding: spacing.md, textAlign: 'center' }}>
                    {getStatusBadge(item.status)}
                  </td>
                  <td style={{ padding: spacing.md, fontSize: '14px', color: colors.neutral[600], textAlign: 'right' }}>
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card padding="lg" style={{ marginTop: spacing.lg }}>
          <h2 style={sectionTitleStyles}>Location</h2>
          <div style={{
            height: '300px',
            borderRadius: borderRadius.lg,
            backgroundColor: colors.neutral[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE), linear-gradient(45deg, #E0F2FE 25%, transparent 25%, transparent 75%, #E0F2FE 75%, #E0F2FE)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}>
            <div style={{ textAlign: 'center', color: colors.neutral[400] }}>
              <MapPin size={48} style={{ margin: '0 auto', marginBottom: spacing.md }} />
              <p style={{ fontSize: '16px' }}>Google Maps embed would appear here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
