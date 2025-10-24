import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, Edit } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OperatingHours } from '../components/OperatingHours';
import { ContactActions } from '../components/ContactActions';
import { MedicineDetailsModal } from '../components/MedicineDetailsModal';
import { DirectionsButton, QuickDirections, DirectionsWithInfo } from '../components/DirectionsButton';
import { ReviewsSection, ReviewSummary } from '../components/ReviewsSection';
import { MedicineInventory } from '../components/MedicineInventory';
import { PhotoGallery } from '../components/PhotoGallery';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'reviews' | 'photos'>('overview');
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

  // Mock reviews data
  const mockReviews = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      userAvatar: undefined,
      rating: 5,
      title: 'Excellent service and friendly staff',
      comment: 'The staff here is incredibly helpful and knowledgeable. They always have what I need and provide great advice.',
      date: '2024-01-15',
      helpful: 12,
      verified: true,
      response: {
        text: 'Thank you for your kind words, Sarah! We appreciate your feedback.',
        date: '2024-01-16',
        responder: 'HealthPlus Team'
      }
    },
    {
      id: '2',
      userName: 'Mike Chen',
      userAvatar: undefined,
      rating: 4,
      title: 'Good selection of medicines',
      comment: 'Good variety of medicines available. The pharmacy is clean and well-organized.',
      date: '2024-01-10',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      userName: 'Emily Davis',
      userAvatar: undefined,
      rating: 5,
      title: 'Fast and reliable',
      comment: 'Always quick service and they have everything I need. Highly recommend!',
      date: '2024-01-08',
      helpful: 15,
      verified: false
    },
    {
      id: '4',
      userName: 'Robert Wilson',
      userAvatar: undefined,
      rating: 3,
      title: 'Average experience',
      comment: 'The pharmacy is okay, but sometimes they don\'t have certain medicines in stock.',
      date: '2024-01-05',
      helpful: 3,
      verified: true
    },
    {
      id: '5',
      userName: 'Lisa Brown',
      userAvatar: undefined,
      rating: 5,
      title: 'Outstanding customer service',
      comment: 'The pharmacist took time to explain everything clearly. Very professional and caring.',
      date: '2024-01-03',
      helpful: 20,
      verified: true
    }
  ];

  // Mock photos data
  const mockPhotos = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1551076805-e3249034cfe7?w=400&h=300&fit=crop',
      title: 'Pharmacy Interior',
      description: 'Clean and modern interior of our pharmacy',
      uploadedAt: '2024-01-15',
      uploadedBy: 'HealthPlus Staff',
      likes: 8,
      isLiked: false,
      tags: ['interior', 'pharmacy', 'modern']
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
      title: 'Medicine Shelves',
      description: 'Well-organized medicine shelves',
      uploadedAt: '2024-01-12',
      uploadedBy: 'HealthPlus Staff',
      likes: 12,
      isLiked: true,
      tags: ['medicines', 'shelves', 'organization']
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      title: 'Consultation Area',
      description: 'Private consultation area for patient discussions',
      uploadedAt: '2024-01-10',
      uploadedBy: 'HealthPlus Staff',
      likes: 6,
      isLiked: false,
      tags: ['consultation', 'private', 'patient-care']
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
      title: 'Prescription Counter',
      description: 'Professional prescription dispensing area',
      uploadedAt: '2024-01-08',
      uploadedBy: 'HealthPlus Staff',
      likes: 9,
      isLiked: false,
      tags: ['prescription', 'counter', 'professional']
    }
  ];

  const mockInventory = [
    { medicine: 'Paracetamol 500mg', status: 'in_stock', lastUpdated: '2 hours ago' },
    { medicine: 'Ibuprofen 400mg', status: 'in_stock', lastUpdated: '3 hours ago' },
    { medicine: 'Amoxicillin 250mg', status: 'low_stock', lastUpdated: '1 day ago' },
    { medicine: 'Aspirin 75mg', status: 'out_of_stock', lastUpdated: '2 days ago' },
  ];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: colors.gradient.primary,
    position: 'relative',
  };

  const headerStyles: React.CSSProperties = {
    background: colors.gradient.primary,
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
                <th style={{ textAlign: 'center', padding: spacing.md, fontSize: '14px', fontWeight: 600, color: colors.neutral[700] }}>
                  Actions
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
                  <td style={{ padding: spacing.md, textAlign: 'center' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Create mock medicine data for the modal
                        const mockMedicine = {
                          id: `medicine-${index}`,
                          name: item.medicine,
                          genericName: item.medicine.split(' ')[0],
                          form: 'tablet' as const,
                          strength: '500mg',
                          manufacturer: 'Various',
                          description: `Detailed information about ${item.medicine}`,
                          category: 'pain-relief',
                          dosage: {
                            adults: '1-2 tablets every 4-6 hours',
                            children: '10-15mg/kg every 4-6 hours',
                            elderly: '1 tablet every 6-8 hours'
                          },
                          sideEffects: ['Nausea', 'Dizziness', 'Headache'],
                          interactions: ['Alcohol', 'Other medications'],
                          warnings: ['Take with food', 'Do not exceed recommended dose'],
                          storage: 'Store at room temperature',
                          expiry: '2025-12-31',
                          availability: item.status === 'in_stock' ? 'in_stock' : 'out_of_stock',
                          rating: 4.2,
                          reviewCount: 50
                        };
                        setSelectedMedicine(mockMedicine);
                        setIsModalOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Tab Navigation */}
        <div style={{ marginTop: spacing.lg }}>
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.neutral[200]}`,
            marginBottom: spacing.lg
          }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'inventory', label: 'Medicine Inventory' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'photos', label: 'Photos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  border: 'none',
                  background: 'transparent',
                  borderBottom: `2px solid ${activeTab === tab.id ? colors.primary : 'transparent'}`,
                  color: activeTab === tab.id ? colors.primary : colors.neutral[600],
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <Card padding="lg">
                <h2 style={sectionTitleStyles}>Location & Directions</h2>
                <DirectionsWithInfo
                  address={mockPharmacy.address}
                  pharmacyName={mockPharmacy.name}
                  estimatedTime="5 min drive"
                  estimatedDistance="1.2 km"
                  style={{ marginBottom: spacing.lg }}
                />
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
                  <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                    <MapPin size={48} style={{ margin: '0 auto', marginBottom: spacing.md }} />
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#6b7280' }}>Google Maps embed would appear here</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'inventory' && (
            <MedicineInventory
              medicines={mockInventory.map((item, index) => ({
                id: `medicine-${index}`,
                name: item.medicine,
                genericName: item.medicine.split(' ')[0],
                form: 'tablet' as const,
                strength: '500mg',
                manufacturer: 'Various',
                description: `Detailed information about ${item.medicine}`,
                category: 'pain-relief',
                availability: item.status as any,
                price: Math.random() * 100 + 10,
                rating: Math.random() * 2 + 3,
                reviewCount: Math.floor(Math.random() * 100)
              }))}
              onMedicineClick={(medicine) => {
                setSelectedMedicine(medicine);
                setIsModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection
              reviews={mockReviews}
              averageRating={4.2}
              totalReviews={mockReviews.length}
              onAddReview={() => console.log('Add review')}
              onReportReview={(reviewId) => console.log('Report review:', reviewId)}
              onHelpful={(reviewId) => console.log('Helpful:', reviewId)}
            />
          )}

          {activeTab === 'photos' && (
            <PhotoGallery
              photos={mockPhotos}
              onPhotoClick={(photo) => console.log('Photo clicked:', photo.id)}
              onLike={(photoId) => console.log('Like photo:', photoId)}
              onDownload={(photo) => console.log('Download photo:', photo.id)}
              onShare={(photo) => console.log('Share photo:', photo.id)}
            />
          )}
        </div>
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
