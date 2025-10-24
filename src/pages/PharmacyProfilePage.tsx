import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OperatingHours } from '../components/OperatingHours';
import { ContactActions } from '../components/ContactActions';
import { MedicineDetailsModal } from '../components/MedicineDetailsModal';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface PharmacyProfilePageProps {
  pharmacyId: string;
  onBack: () => void;
}

export const PharmacyProfilePage: React.FC<PharmacyProfilePageProps> = ({
  pharmacyId,
  onBack,
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mockPharmacy = {
    id: pharmacyId,
    name: 'HealthPlus Pharmacy',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'contact@healthplus.com',
    isVerified: true,
    openHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00', closed: true }
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Add animated background elements
  const backgroundElements = (
    <>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite',
        zIndex: 1
      }} />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </>
  );

  const headerStyles: React.CSSProperties = {
    background: 'transparent',
    color: colors.text.inverse,
    padding: spacing.xl,
    position: 'relative',
    zIndex: 2,
  };

  const headerContentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const profileImageStyles: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.primary,
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
    position: 'relative',
    zIndex: 2,
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
    fontSize: '22px',
    fontWeight: 700,
    color: '#1a1a1a',
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
      {backgroundElements}
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
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 800,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {mockPharmacy.name}
              </h1>
              {mockPharmacy.isVerified && (
                <CheckCircle size={32} fill="white" color={colors.primary} />
              )}
            </div>
            <p style={{ 
              fontSize: '18px', 
              opacity: 0.95, 
              marginBottom: spacing.md,
              fontWeight: 400,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
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
                  <div style={{ fontSize: '15px', color: '#6b7280', fontWeight: 500 }}>Phone</div>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a1a' }}>
                    {mockPharmacy.phone}
                  </div>
                </div>
              </div>
              <div style={infoRowStyles}>
                <Mail size={20} color={colors.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', color: '#6b7280', fontWeight: 500 }}>Email</div>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a1a' }}>
                    {mockPharmacy.email}
                  </div>
                </div>
              </div>
              <div style={infoRowStyles}>
                <MapPin size={20} color={colors.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', color: '#6b7280', fontWeight: 500 }}>Address</div>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a1a' }}>
                    {mockPharmacy.address}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Actions */}
            <div style={{ marginTop: spacing.lg }}>
              <ContactActions
                phone={mockPharmacy.phone}
                email={mockPharmacy.email}
                address={mockPharmacy.address}
                pharmacyName={mockPharmacy.name}
                size="md"
                layout="horizontal"
                showLabels={true}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 style={sectionTitleStyles}>Opening Hours</h2>
            <OperatingHours 
              hours={mockPharmacy.openHours} 
              showStatus={true}
              compact={false}
            />
          </Card>
        </div>

        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <h2 style={sectionTitleStyles}>Current Inventory</h2>
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
                  <td style={{ padding: spacing.md, fontSize: '17px', color: '#1a1a1a', fontWeight: 600 }}>
                    {item.medicine}
                  </td>
                  <td style={{ padding: spacing.md, textAlign: 'center' }}>
                    {getStatusBadge(item.status)}
                  </td>
                  <td style={{ padding: spacing.md, fontSize: '15px', color: '#6b7280', textAlign: 'right', fontWeight: 500 }}>
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Map */}
        <Card padding="none" style={{ marginTop: spacing.lg }}>
          <div style={{
            height: '500px',
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBW-fSpIT-yWFeYfOF0VIBlBHuEr12o4Cs&q=${encodeURIComponent(mockPharmacy.address)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${mockPharmacy.name}`}
            />
          </div>
        </Card>
      </div>
      
      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMedicine(null);
          }}
        />
      )}
    </div>
  );
};
