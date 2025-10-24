import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { colors, spacing } from '../styles/tokens';

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  initialPhoto?: string | null;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  disabled?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoChange,
  initialPhoto = null,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false
}) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file format
    if (!acceptedFormats.includes(file.type)) {
      return `File format not supported. Please use: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setIsUploading(true);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setIsUploading(false);
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
      onPhotoChange(file);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setError(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto'
  };

  const uploadAreaStyles: React.CSSProperties = {
    border: `2px dashed ${isDragOver ? colors.primary : colors.neutral[300]}`,
    borderRadius: '12px',
    padding: spacing.xl,
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    background: isDragOver ? `${colors.primary}05` : 'transparent',
    opacity: disabled ? 0.6 : 1
  };

  const previewStyles: React.CSSProperties = {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    background: colors.neutral[50],
    border: `1px solid ${colors.neutral[200]}`
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block'
  };

  const removeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    background: 'rgba(0, 0, 0, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s ease'
  };

  const errorStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: colors.error,
    fontSize: '14px',
    marginTop: spacing.sm,
    padding: spacing.sm,
    background: `${colors.error}10`,
    borderRadius: '8px',
    border: `1px solid ${colors.error}20`
  };

  const successStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: colors.success,
    fontSize: '14px',
    marginTop: spacing.sm,
    padding: spacing.sm,
    background: `${colors.success}10`,
    borderRadius: '8px',
    border: `1px solid ${colors.success}20`
  };

  return (
    <div style={containerStyles}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {photo ? (
        <div style={previewStyles}>
          <img src={photo} alt="Upload preview" style={imageStyles} />
          <button
            style={removeButtonStyles}
            onClick={handleRemovePhoto}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          style={uploadAreaStyles}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div style={{ marginBottom: spacing.md }}>
            {isUploading ? (
              <div style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto',
                border: `3px solid ${colors.neutral[200]}`,
                borderTop: `3px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <Camera size={48} color={isDragOver ? colors.primary : colors.neutral[400]} />
            )}
          </div>
          
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: colors.neutral[700], 
            marginBottom: spacing.xs 
          }}>
            {isUploading ? 'Processing...' : 'Upload Photo'}
          </h3>
          
          <p style={{ 
            fontSize: '14px', 
            color: colors.neutral[500], 
            marginBottom: spacing.md 
          }}>
            Drag and drop or click to select
          </p>
          
          <div style={{ 
            fontSize: '12px', 
            color: colors.neutral[400] 
          }}>
            Max {maxSize}MB • {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
          </div>
        </div>
      )}

      {error && (
        <div style={errorStyles}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {photo && !error && (
        <div style={successStyles}>
          <CheckCircle size={16} />
          <span>Photo uploaded successfully</span>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
