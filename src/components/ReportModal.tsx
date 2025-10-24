import React, { useState } from 'react';
import { X, MapPin, Pill, CheckCircle, Upload, AlertCircle, Check } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { Badge } from './Badge';
import { PhotoUpload } from './PhotoUpload';
import { FormValidation, useFormValidation, validationRules } from './FormValidation';
import { ProgressIndicator, StepProgressIndicator } from './ProgressIndicator';
import { useDraftSaving } from '../hooks/useDraftSaving';
import { SuccessAnimation, ConfettiAnimation, SuccessNotification } from './SuccessAnimation';
import { ReportHistory, ReportStatistics } from './ReportHistory';
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
    photo: null as File | null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const validationConfig = {
    pharmacy: {
      ...validationRules.required('Pharmacy name is required'),
      ...validationRules.pharmacyName('Please enter a valid pharmacy name')
    },
    medicine: {
      ...validationRules.required('Medicine name is required'),
      ...validationRules.medicineName('Please enter a valid medicine name')
    },
    status: {
      ...validationRules.required('Status is required')
    }
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateForm,
    getFieldProps
  } = useFormValidation(validationConfig);
  
  // Draft saving functionality
  const {
    saveDraft,
    loadDraft,
    deleteDraft,
    drafts,
    currentDraft,
    isSaving,
    lastSaved
  } = useDraftSaving({
    key: 'report_modal',
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    maxDrafts: 3
  });

  // Progress steps
  const progressSteps = [
    {
      id: 'pharmacy',
      title: 'Pharmacy Info',
      description: 'Enter pharmacy details',
      status: step >= 1 ? (step > 1 ? 'completed' : 'current') : 'pending'
    },
    {
      id: 'medicine',
      title: 'Medicine Details',
      description: 'Specify medicine information',
      status: step >= 2 ? (step > 2 ? 'completed' : 'current') : 'pending'
    },
    {
      id: 'status',
      title: 'Availability Status',
      description: 'Report medicine availability',
      status: step >= 3 ? (step > 3 ? 'completed' : 'current') : 'pending'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review and submit report',
      status: step >= 4 ? 'completed' : 'pending'
    }
  ];

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
      setShowSuccessAnimation(true);
      setShowConfetti(true);
      
      // Save as draft before submitting
      saveDraft(formData, 'report', 'Medicine Availability Report');
      
      setTimeout(() => {
        onSubmit(formData);
        setShowSuccessAnimation(false);
        setShowConfetti(false);
        onClose();
      }, 3000);
    }
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'white',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  };

  const headerStyles: React.CSSProperties = {
    padding: `${spacing.lg} ${spacing.xl}`,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 10,
    flexShrink: 0
  };

  const contentStyles: React.CSSProperties = {
    padding: spacing.xl,
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
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
          {/* Success Animations */}
          {showSuccessAnimation && (
            <SuccessAnimation
              isVisible={true}
              type="check"
              size="xl"
              message="Report Submitted!"
              subMessage="Thank you for your contribution"
              duration={2000}
            />
          )}
          
          {showConfetti && (
            <ConfettiAnimation
              isVisible={true}
              duration={3000}
            />
          )}
          
          <div style={successContainerStyles}>
            <div style={checkIconWrapperStyles}>
              <Check size={48} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: colors.neutral[900], marginBottom: spacing.md }}>
              Thank You!
            </h2>
            <p style={{ fontSize: '16px', color: colors.neutral[600], lineHeight: '150%', marginBottom: spacing.lg }}>
              Your report has been submitted successfully and is now being reviewed by our community moderators.
            </p>
            
            {formData.photo && (
              <div style={{ 
                background: colors.neutral[50], 
                padding: spacing.md, 
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.neutral[200]}`
              }}>
                <p style={{ fontSize: '14px', color: colors.neutral[600], marginBottom: spacing.sm }}>
                  Photo uploaded:
                </p>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: borderRadius.md,
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: `2px solid ${colors.neutral[200]}`
                }}>
                  <img 
                    src={URL.createObjectURL(formData.photo)} 
                    alt="Uploaded photo" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                </div>
              </div>
            )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
  }

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {/* Progress Indicator - Full Width */}
        <div style={{ 
          padding: `${spacing.lg} ${spacing.xl}`,
          borderBottom: `1px solid ${colors.neutral[200]}`,
          backgroundColor: colors.background.secondary
        }}>
          <ProgressIndicator
            steps={progressSteps}
            currentStep={step}
            orientation="horizontal"
            size="md"
            showDescriptions={true}
            style={{ width: '100%' }}
          />
        </div>
        
        {/* Draft Status */}
        {isSaving && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.sm,
            background: colors.info + '15',
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
            fontSize: '12px',
            color: colors.info
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors.info,
              animation: 'pulse 1s infinite'
            }} />
            Saving draft...
          </div>
        )}
        
        {lastSaved && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.sm,
            background: colors.success + '15',
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
            fontSize: '12px',
            color: colors.success
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colors.success
            }} />
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
        
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
              <FormValidation
                placeholder="Search for pharmacy..."
                value={formData.pharmacy}
                onChange={(value) => setFormData({ ...formData, pharmacy: value })}
                rules={validationConfig.pharmacy}
                label="Pharmacy Name"
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
              <FormValidation
                placeholder="Search for medicine..."
                value={formData.medicine}
                onChange={(value) => setFormData({ ...formData, medicine: value })}
                rules={validationConfig.medicine}
                label="Medicine Name"
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
                  marginBottom: spacing.lg,
                }}
              />
              
              <div style={{ marginBottom: spacing.lg }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: colors.neutral[700], 
                  marginBottom: spacing.sm 
                }}>
                  Upload Photo (Optional)
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  color: colors.neutral[500], 
                  marginBottom: spacing.md 
                }}>
                  Add a photo of the medicine or receipt for better verification
                </p>
                <PhotoUpload
                  onPhotoChange={(file) => setFormData({ ...formData, photo: file })}
                  maxSize={5}
                  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>
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
