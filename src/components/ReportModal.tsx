import React, { useState } from 'react';
import { X, MapPin, Pill, CheckCircle, Upload, AlertCircle, Check } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (report: any) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pharmacy: '',
    medicine: '',
    status: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(formData);
      onClose();
    }, 2000);
  };

  const overlayStyles: React.CSSProperties = {
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
    padding: spacing.lg,
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: borderRadius['2xl'],
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: shadows['2xl'],
    position: 'relative',
  };

  const headerStyles: React.CSSProperties = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.xl,
  };

  const progressBarStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  };

  const progressStepStyles = (isActive: boolean, isCompleted: boolean): React.CSSProperties => ({
    flex: 1,
    height: '4px',
    borderRadius: borderRadius.full,
    backgroundColor: isCompleted || isActive ? colors.primary : colors.neutral[200],
    transition: 'all 0.3s',
  });

  const statusOptionStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    border: `2px solid ${isSelected ? colors.primary : colors.neutral[200]}`,
    backgroundColor: isSelected ? colors.neutral[50] : 'white',
    cursor: 'pointer',
    transition: 'all 0.25s',
    textAlign: 'center',
  });

  const successContainerStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing['3xl'],
  };

  const checkIconWrapperStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: borderRadius.full,
    background: colors.gradient.blueTeal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing.lg,
    animation: 'scaleIn 0.5s ease-out',
  };

  if (isSubmitted) {
    return (
      <div style={overlayStyles} onClick={onClose}>
        <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
          <div style={successContainerStyles}>
            <div style={checkIconWrapperStyles}>
              <Check size={48} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: colors.neutral[900], marginBottom: spacing.md }}>
              Thank You!
            </h2>
            <p style={{ fontSize: '16px', color: colors.neutral[600], lineHeight: '150%' }}>
              Your report has been submitted successfully and is now being reviewed by our community moderators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyles}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: colors.neutral[900] }}>
              Report Medicine Availability
            </h2>
            <p style={{ fontSize: '14px', color: colors.neutral[600], marginTop: spacing.xs }}>
              Step {step} of 4
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing.sm,
              color: colors.neutral[400],
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={contentStyles}>
          <div style={progressBarStyles}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={progressStepStyles(i === step, i < step)} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <div style={{ marginBottom: spacing.md }}>
                <MapPin size={32} color={colors.primary} style={{ marginBottom: spacing.md }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.neutral[900], marginBottom: spacing.sm }}>
                  Select Pharmacy
                </h3>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.lg }}>
                  Choose the pharmacy where you want to report medicine availability
                </p>
              </div>
              <Input
                placeholder="Search for pharmacy..."
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                icon={<MapPin size={20} />}
              />
              <div style={{ marginTop: spacing.lg }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                  disabled={!formData.pharmacy}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: spacing.md }}>
                <Pill size={32} color={colors.primary} style={{ marginBottom: spacing.md }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.neutral[900], marginBottom: spacing.sm }}>
                  Select Medicine
                </h3>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.lg }}>
                  Search for the medicine you want to report
                </p>
              </div>
              <Input
                placeholder="Search for medicine..."
                value={formData.medicine}
                onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}
                icon={<Pill size={20} />}
              />
              <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md }}>
                <Button variant="outline" size="lg" onClick={() => setStep(1)} fullWidth>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(3)}
                  disabled={!formData.medicine}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ marginBottom: spacing.md }}>
                <CheckCircle size={32} color={colors.primary} style={{ marginBottom: spacing.md }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.neutral[900], marginBottom: spacing.sm }}>
                  Medicine Status
                </h3>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.lg }}>
                  What is the current availability status?
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.lg }}>
                <div
                  style={statusOptionStyles(formData.status === 'in_stock')}
                  onClick={() => setFormData({ ...formData, status: 'in_stock' })}
                >
                  <CheckCircle size={32} color={colors.success} style={{ margin: '0 auto', marginBottom: spacing.sm }} />
                  <div style={{ fontWeight: 600, fontSize: '16px', color: colors.neutral[900] }}>In Stock</div>
                  <div style={{ fontSize: '14px', color: colors.neutral[600], marginTop: spacing.xs }}>
                    Medicine is available
                  </div>
                </div>
                <div
                  style={statusOptionStyles(formData.status === 'out_of_stock')}
                  onClick={() => setFormData({ ...formData, status: 'out_of_stock' })}
                >
                  <AlertCircle size={32} color={colors.error} style={{ margin: '0 auto', marginBottom: spacing.sm }} />
                  <div style={{ fontWeight: 600, fontSize: '16px', color: colors.neutral[900] }}>Out of Stock</div>
                  <div style={{ fontSize: '14px', color: colors.neutral[600], marginTop: spacing.xs }}>
                    Medicine is not available
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: spacing.md }}>
                <Button variant="outline" size="lg" onClick={() => setStep(2)} fullWidth>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(4)}
                  disabled={!formData.status}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ marginBottom: spacing.md }}>
                <Upload size={32} color={colors.primary} style={{ marginBottom: spacing.md }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.neutral[900], marginBottom: spacing.sm }}>
                  Additional Information
                </h3>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.lg }}>
                  Add notes or upload a photo (optional)
                </p>
              </div>
              <textarea
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: spacing.md,
                  fontSize: '16px',
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.lg,
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md }}>
                <Button variant="outline" size="lg" onClick={() => setStep(3)} fullWidth>
                  Back
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
                  Submit Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
