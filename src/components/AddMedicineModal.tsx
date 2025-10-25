import React, { useState } from 'react';
import { X, Plus, AlertCircle, Pill, Hash } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import type { Medicine } from '../types';

export interface AddMedicineData {
  name: string;
  quantity: number;
}

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicineData: AddMedicineData) => void;
  editingMedicine?: Medicine | null;
}


export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMedicine
}) => {
  const [formData, setFormData] = useState<AddMedicineData>({
    name: editingMedicine?.name || '',
    quantity: editingMedicine?.quantity || 0
  });

  // Update form data when editing medicine changes
  React.useEffect(() => {
    if (editingMedicine) {
      setFormData({
        name: editingMedicine.name,
        quantity: editingMedicine.quantity
      });
    } else {
      setFormData({
        name: '',
        quantity: 0
      });
    }
  }, [editingMedicine]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AddMedicineData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required';
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setFormData({
        name: '',
        quantity: 0
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding medicine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        quantity: 0
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: spacing.lg,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: borderRadius.xl,
        boxShadow: shadows.xl,
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing.xl,
          borderBottom: `1px solid ${colors.neutral[200]}`,
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.lg,
              background: colors.gradient.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <Plus size={24} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: colors.neutral[800],
                margin: 0
              }}>
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: colors.neutral[600],
                margin: 0
              }}>
                {editingMedicine ? 'Update medicine information' : 'Add a new medicine to your inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              color: colors.neutral[600],
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: spacing.xl }}>
          <div style={{ display: 'grid', gap: spacing.lg }}>
            {/* Medicine Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: colors.neutral[700],
                marginBottom: spacing.sm
              }}>
                Medicine Name *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  left: spacing.md,
                  color: errors.name ? colors.error : colors.neutral[400],
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease'
                }}>
                  <Pill size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Enter medicine name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    paddingLeft: '48px',
                    border: `2px solid ${errors.name ? colors.error : colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    fontSize: '15px',
                    fontWeight: 500,
                    color: colors.neutral[900],
                    background: 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? colors.error : colors.neutral[300];
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.name && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginTop: spacing.xs,
                  color: colors.error,
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: colors.neutral[700],
                marginBottom: spacing.sm
              }}>
                Quantity *
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  left: spacing.md,
                  color: errors.quantity ? colors.error : colors.neutral[400],
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease'
                }}>
                  <Hash size={16} />
                </div>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    paddingLeft: '48px',
                    border: `2px solid ${errors.quantity ? colors.error : colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    fontSize: '15px',
                    fontWeight: 500,
                    color: colors.neutral[900],
                    background: 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.quantity ? colors.error : colors.neutral[300];
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.quantity && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginTop: spacing.xs,
                  color: colors.error,
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  <AlertCircle size={14} />
                  {errors.quantity}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'flex-end',
            marginTop: spacing.xl,
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.neutral[200]}`
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: `2px solid rgba(102, 126, 234, 0.3)`,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.color = colors.primary;
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                background: isSubmitting 
                  ? colors.neutral[400] 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isSubmitting 
                  ? 'none' 
                  : '0 6px 20px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseDown={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ 
                      animation: 'spin 1s linear infinite',
                      transformOrigin: 'center'
                    }}
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  {editingMedicine ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus size={16} />
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};
