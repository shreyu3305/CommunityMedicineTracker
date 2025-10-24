import React, { useState } from 'react';
import { ArrowLeft, Pill, MapPin, Phone, Mail, CheckCircle, Plus, Edit, Trash2, User, Settings, Menu, X, LogOut } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OperatingHours } from '../components/OperatingHours';
import { spacing, borderRadius, colors } from '../styles/tokens';

interface PharmacistDashboardPageProps {
  onBack: () => void;
}

type TabType = 'account' | 'medicines';

export const PharmacistDashboardPage: React.FC<PharmacistDashboardPageProps> = ({
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Mock pharmacy data (same as what users see)
  const pharmacyData = {
    id: '1',
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

  // Mock inventory data (what users see)
  const inventoryData = [
    { medicine: 'Paracetamol 500mg', status: 'in_stock', lastUpdated: '2 hours ago', quantity: 150 },
    { medicine: 'Ibuprofen 400mg', status: 'in_stock', lastUpdated: '3 hours ago', quantity: 89 },
    { medicine: 'Amoxicillin 250mg', status: 'low_stock', lastUpdated: '1 day ago', quantity: 12 },
    { medicine: 'Aspirin 75mg', status: 'out_of_stock', lastUpdated: '2 days ago', quantity: 0 },
  ];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
  };

  const sidebarStyles: React.CSSProperties = {
    width: sidebarOpen ? '280px' : '0',
    height: '100vh',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
  };

  const mainContentStyles: React.CSSProperties = {
    flex: 1,
    minHeight: '100vh',
    position: 'relative',
    zIndex: 2,
    overflow: 'auto',
    marginLeft: sidebarOpen ? '280px' : '0',
    transition: 'margin-left 0.3s ease',
  };

  const headerStyles: React.CSSProperties = {
    background: 'transparent',
    color: 'white',
    padding: spacing.lg,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const contentStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.lg,
    position: 'relative',
    zIndex: 2,
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

  const renderAccountTab = () => (
    <div style={{ padding: spacing.xl, paddingTop: '100px', display: 'flex', flexDirection: 'column', gap: spacing.xl, height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: spacing.sm }}>
          Pharmacy Profile
        </h2>
        <p style={{ fontSize: '16px', color: colors.neutral[600], margin: 0 }}>
          Manage your pharmacy information and settings
        </p>
      </div>

      {/* Basic Information Section */}
      <div style={{ background: 'white', borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: spacing.lg, borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.sm }}>
          Basic Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg, marginBottom: spacing.lg }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: spacing.sm }}>
              Pharmacy Name *
            </label>
            <input
              type="text"
              placeholder="Enter pharmacy name"
              defaultValue={pharmacyData.name}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: borderRadius.lg,
                border: '2px solid #e5e7eb',
                background: isEditing ? '#ffffff' : '#f9fafb',
                color: isEditing ? '#1f2937' : '#6b7280',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
              onFocus={(e) => {
                if (isEditing) {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: spacing.sm }}>
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              defaultValue={pharmacyData.phone}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: borderRadius.lg,
                border: '2px solid #e5e7eb',
                background: isEditing ? '#ffffff' : '#f9fafb',
                color: isEditing ? '#1f2937' : '#6b7280',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
              onFocus={(e) => {
                if (isEditing) {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: spacing.sm }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              defaultValue={pharmacyData.email}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: borderRadius.lg,
                border: '2px solid #e5e7eb',
                background: isEditing ? '#ffffff' : '#f9fafb',
                color: isEditing ? '#1f2937' : '#6b7280',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: isEditing ? 'text' : 'not-allowed'
              }}
              onFocus={(e) => {
                if (isEditing) {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'end' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: spacing.sm, 
              padding: '14px 16px', 
              background: isEditing ? '#f9fafb' : '#f3f4f6', 
              borderRadius: borderRadius.lg, 
              border: '2px solid #e5e7eb', 
              width: '100%',
              opacity: isEditing ? 1 : 0.7
            }}>
              <input
                type="checkbox"
                defaultChecked={pharmacyData.isVerified}
                disabled={!isEditing}
                style={{ 
                  width: '20px', 
                  height: '20px',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  appearance: 'none',
                  backgroundColor: 'white',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <label style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: isEditing ? '#374151' : '#6b7280', 
                cursor: isEditing ? 'pointer' : 'not-allowed' 
              }}>
                Verified Pharmacy
              </label>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: spacing.sm }}>
            Address *
          </label>
          <textarea
            placeholder="Enter complete address"
            defaultValue={pharmacyData.address}
            rows={3}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: borderRadius.lg,
              border: '2px solid #e5e7eb',
              background: isEditing ? '#ffffff' : '#f9fafb',
              color: isEditing ? '#1f2937' : '#6b7280',
              fontSize: '16px',
              fontWeight: 500,
              outline: 'none',
              resize: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: isEditing ? 'text' : 'not-allowed'
            }}
            onFocus={(e) => {
              if (isEditing) {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          />
        </div>
      </div>

      {/* Logo Management Section */}
      <div style={{ background: 'white', borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: spacing.lg, borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.sm }}>
          Brand Identity
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: borderRadius.xl,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 700,
            color: 'white',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
            flexShrink: 0
          }}>
            H+
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', margin: 0, marginBottom: spacing.sm }}>
              Pharmacy Logo
            </h4>
            <p style={{ fontSize: '14px', color: colors.neutral[600], margin: 0, marginBottom: spacing.md }}>
              Upload a high-quality logo to represent your pharmacy brand
            </p>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => console.log('Upload logo')}
                style={{ boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
              >
                Upload Logo
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => console.log('Remove logo')}
              >
                Remove
              </Button>
            </div>
            <p style={{ fontSize: '12px', color: colors.neutral[500], margin: 0, marginTop: spacing.sm }}>
              Recommended: 200x200px, PNG or JPG format
            </p>
          </div>
        </div>
      </div>

      {/* Operating Hours Section */}
      <div style={{ background: 'white', borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: spacing.lg, borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.sm }}>
          Operating Hours
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md }}>
          {Object.entries(pharmacyData.openHours).map(([day, hours]) => (
            <div key={day} style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              padding: spacing.lg,
              border: '2px solid #f3f4f6',
              borderRadius: borderRadius.lg,
              background: '#fafbfc',
              transition: 'all 0.3s ease'
            }}>
              <input
                type="checkbox"
                defaultChecked={!hours.closed}
                disabled={!isEditing}
                style={{ 
                  width: '20px', 
                  height: '20px',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  appearance: 'none',
                  backgroundColor: 'white',
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  opacity: isEditing ? 1 : 0.6
                }}
              />
              
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#374151', 
                textTransform: 'capitalize',
                minWidth: '80px'
              }}>
                {day}
              </div>
              
              <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flex: 1 }}>
                <input
                  type="time"
                  defaultValue={hours.open}
                  disabled={!isEditing}
                  style={{
                    padding: '10px 12px',
                    borderRadius: borderRadius.md,
                    border: '2px solid #e5e7eb',
                    background: isEditing ? 'white' : '#f9fafb',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    color: isEditing ? '#374151' : '#6b7280',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
                <span style={{ fontSize: '14px', color: colors.neutral[500], fontWeight: 500 }}>to</span>
                <input
                  type="time"
                  defaultValue={hours.close}
                  disabled={!isEditing}
                  style={{
                    padding: '10px 12px',
                    borderRadius: borderRadius.md,
                    border: '2px solid #e5e7eb',
                    background: isEditing ? 'white' : '#f9fafb',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    color: isEditing ? '#374151' : '#6b7280',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                  onFocus={(e) => {
                    if (isEditing) {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  const renderMedicinesTab = () => (
    <div style={{ padding: spacing.xl, display: 'flex', flexDirection: 'column', gap: spacing.xl, height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: spacing.sm }}>
          Medicine Management
        </h2>
        <p style={{ fontSize: '16px', color: colors.neutral[600], margin: 0 }}>
          Manage your pharmacy inventory and medicine stock
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ background: 'white', borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: spacing.lg, borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.sm }}>
          Inventory Overview
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.lg }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
            borderRadius: borderRadius.lg, 
            padding: spacing.xl,
            textAlign: 'center',
            border: '2px solid #bbf7d0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '60px', 
              height: '60px', 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '50%' 
            }} />
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#16a34a', marginBottom: spacing.sm }}>
              {inventoryData.filter(item => item.status === 'in_stock').length}
            </div>
            <div style={{ fontSize: '16px', color: '#15803d', fontWeight: 600 }}>
              In Stock
            </div>
            <div style={{ fontSize: '12px', color: '#16a34a', marginTop: spacing.xs }}>
              Well stocked items
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', 
            borderRadius: borderRadius.lg, 
            padding: spacing.xl,
            textAlign: 'center',
            border: '2px solid #fde68a',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '60px', 
              height: '60px', 
              background: 'rgba(245, 158, 11, 0.1)', 
              borderRadius: '50%' 
            }} />
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#d97706', marginBottom: spacing.sm }}>
              {inventoryData.filter(item => item.status === 'low_stock').length}
            </div>
            <div style={{ fontSize: '16px', color: '#b45309', fontWeight: 600 }}>
              Low Stock
            </div>
            <div style={{ fontSize: '12px', color: '#d97706', marginTop: spacing.xs }}>
              Needs restocking
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fef2f2, #fecaca)', 
            borderRadius: borderRadius.lg, 
            padding: spacing.xl,
            textAlign: 'center',
            border: '2px solid #fca5a5',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '60px', 
              height: '60px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '50%' 
            }} />
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#dc2626', marginBottom: spacing.sm }}>
              {inventoryData.filter(item => item.status === 'out_of_stock').length}
            </div>
            <div style={{ fontSize: '16px', color: '#b91c1c', fontWeight: 600 }}>
              Out of Stock
            </div>
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: spacing.xs }}>
              Urgent restock needed
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div style={{ background: 'white', borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', margin: 0, borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.sm }}>
            Medicine Inventory
          </h3>
          <Button
            variant="primary"
            size="md"
            onClick={() => console.log('Add medicine')}
            style={{ 
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <Plus size={16} style={{ marginRight: spacing.xs }} />
            Add Medicine
          </Button>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: borderRadius.lg, border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: `2px solid #e5e7eb` }}>
                <th style={{ textAlign: 'left', padding: spacing.lg, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Medicine
                </th>
                <th style={{ textAlign: 'center', padding: spacing.lg, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Status
                </th>
                <th style={{ textAlign: 'center', padding: spacing.lg, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Quantity
                </th>
                <th style={{ textAlign: 'right', padding: spacing.lg, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Last Updated
                </th>
                <th style={{ textAlign: 'center', padding: spacing.lg, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: `1px solid #f3f4f6`,
                  transition: 'all 0.2s ease'
                }}>
                  <td style={{ padding: spacing.lg, fontSize: '16px', color: '#1f2937', fontWeight: 600 }}>
                    {item.medicine}
                  </td>
                  <td style={{ padding: spacing.lg, textAlign: 'center' }}>
                    {getStatusBadge(item.status)}
                  </td>
                  <td style={{ padding: spacing.lg, textAlign: 'center', fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: spacing.lg, fontSize: '14px', color: '#6b7280', textAlign: 'right' }}>
                    {item.lastUpdated}
                  </td>
                  <td style={{ padding: spacing.lg, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                      <button
                        onClick={() => console.log('Edit', item.medicine)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                          border: '1px solid #c7d2fe',
                          borderRadius: borderRadius.md,
                          color: colors.primary,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log('Delete', item.medicine)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
                          border: '1px solid #fca5a5',
                          borderRadius: borderRadius.md,
                          color: '#dc2626',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyles}>
      {/* Sidebar */}
      <div style={sidebarStyles}>
        {sidebarOpen && (
          <div style={{ 
            padding: spacing.lg, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Sidebar Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Pill size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                    {pharmacyData.name}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.neutral[600] }}>
                    Pharmacist Dashboard
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.sm,
                  color: colors.neutral[600],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <nav style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: spacing.sm, 
              marginBottom: spacing.xl,
              flexShrink: 0
            }}>
              <button
                onClick={() => setActiveTab('account')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  background: activeTab === 'account' ? colors.primary + '15' : 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.md,
                  color: activeTab === 'account' ? colors.primary : colors.neutral[700],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <User size={20} />
                <span style={{ fontSize: '16px', fontWeight: 600 }}>Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab('medicines')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  background: activeTab === 'medicines' ? colors.primary + '15' : 'transparent',
                  border: 'none',
                  borderRadius: borderRadius.md,
                  color: activeTab === 'medicines' ? colors.primary : colors.neutral[700],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Pill size={20} />
                <span style={{ fontSize: '16px', fontWeight: 600 }}>Medicines</span>
              </button>
            </nav>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: spacing.sm, 
              marginTop: 'auto',
              flexShrink: 0
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  background: 'transparent',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  color: colors.neutral[700],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Back</span>
              </button>
              
              <button
                onClick={() => console.log('Logout')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  background: 'transparent',
                  border: `1px solid ${colors.error}`,
                  borderRadius: borderRadius.md,
                  color: colors.error,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <LogOut size={18} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={mainContentStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                  outline: 'none'
                }}
              >
                <Menu size={18} />
              </button>
            )}
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 700,
              color: 'white',
              margin: 0
            }}>
              {activeTab === 'account' ? 'Account Management' : 'Medicine Management'}
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: colors.primary,
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                  outline: 'none',
                  minWidth: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)';
                  e.target.style.background = 'linear-gradient(135deg, #ffffff, #f1f5f9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
                  e.target.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Edit size={16} />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    outline: 'none',
                    minWidth: '80px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Save profile');
                    setIsEditing(false);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: colors.primary,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    outline: 'none',
                    minWidth: '120px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)';
                    e.target.style.background = 'linear-gradient(135deg, #ffffff, #f1f5f9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
                    e.target.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={contentStyles}>
          {activeTab === 'account' ? renderAccountTab() : renderMedicinesTab()}
        </div>
      </div>
    </div>
  );
};