import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  message?: string;
}

export interface ValidationConfig {
  [fieldName: string]: ValidationRule;
}

export interface FormValidationProps {
  value: string;
  rules: ValidationRule;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  style?: React.CSSProperties;
}

export const FormValidation: React.FC<FormValidationProps> = ({
  value,
  rules,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  label,
  disabled = false,
  showPasswordToggle = false,
  style
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);

  const validateField = (val: string): string | null => {
    if (rules.required && (!val || val.trim().length === 0)) {
      return rules.message || 'This field is required';
    }

    if (val && rules.minLength && val.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} characters required`;
    }

    if (val && rules.maxLength && val.length > rules.maxLength) {
      return rules.message || `Maximum ${rules.maxLength} characters allowed`;
    }

    if (val && rules.pattern && !rules.pattern.test(val)) {
      return rules.message || 'Invalid format';
    }

    if (val && rules.custom) {
      return rules.custom(val);
    }

    return null;
  };

  useEffect(() => {
    const validationError = validateField(value);
    setError(validationError);
    setIsValid(!validationError && value.length > 0);
  }, [value, rules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBlurred(true);
    if (onBlur) onBlur();
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...style
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.neutral[700],
    margin: 0
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    paddingRight: showPasswordToggle ? '48px' : spacing.md,
    border: `2px solid ${error ? colors.error : isFocused ? colors.primary : colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    fontSize: '15px',
    fontWeight: 500,
    color: colors.neutral[900],
    background: disabled ? colors.neutral[100] : 'white',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: isFocused ? `0 0 0 3px ${colors.primary}20` : 'none'
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    right: spacing.sm,
    color: error ? colors.error : isValid ? colors.success : colors.neutral[400],
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.error,
    fontWeight: 500,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  };

  const successStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.success,
    fontWeight: 500,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs
  };

  const shouldShowError = error && (hasBlurred || isFocused);
  const shouldShowSuccess = isValid && hasBlurred && !error;

  return (
    <div style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      
      <div style={inputContainerStyles}>
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyles}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={iconStyles}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {!showPasswordToggle && shouldShowError && (
          <AlertCircle size={18} style={iconStyles} />
        )}
        
        {!showPasswordToggle && shouldShowSuccess && (
          <CheckCircle size={18} style={iconStyles} />
        )}
      </div>
      
      {shouldShowError && (
        <p style={errorStyles}>
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {shouldShowSuccess && (
        <p style={successStyles}>
          <CheckCircle size={14} />
          Valid
        </p>
      )}
    </div>
  );
};

// Validation utilities
export const validationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || 'This field is required'
  }),
  
  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || 'Please enter a valid email address'
  }),
  
  phone: (message?: string): ValidationRule => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: message || 'Please enter a valid phone number'
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Minimum ${length} characters required`
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Maximum ${length} characters allowed`
  }),
  
  medicineName: (message?: string): ValidationRule => ({
    pattern: /^[a-zA-Z0-9\s\-\.]+$/,
    message: message || 'Medicine name can only contain letters, numbers, spaces, hyphens, and periods'
  }),
  
  pharmacyName: (message?: string): ValidationRule => ({
    pattern: /^[a-zA-Z0-9\s\-\.&]+$/,
    message: message || 'Pharmacy name can only contain letters, numbers, spaces, hyphens, periods, and ampersands'
  }),
  
  password: (message?: string): ValidationRule => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message: message || 'Password must be at least 8 characters with uppercase, lowercase, and number'
  })
};

// Form validation hook
export const useFormValidation = (config: ValidationConfig) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (fieldName: string, value: string): string | null => {
    const rules = config[fieldName];
    if (!rules) return null;

    if (rules.required && (!value || value.trim().length === 0)) {
      return rules.message || 'This field is required';
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} characters required`;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Maximum ${rules.maxLength} characters allowed`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }

    if (value && rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const setValue = (fieldName: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const setTouchedField = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string | null } = {};
    let isValid = true;

    Object.keys(config).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName] || '');
      newErrors[fieldName] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(config).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  };

  const resetForm = () => {
    setValues({});
    setErrors({});
    setTouched({});
  };

  const getFieldProps = (fieldName: string) => ({
    value: values[fieldName] || '',
    error: touched[fieldName] ? errors[fieldName] : null,
    onChange: (value: string) => setValue(fieldName, value),
    onBlur: () => setTouchedField(fieldName)
  });

  return {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateForm,
    resetForm,
    getFieldProps,
    isValid: Object.values(errors).every(error => !error) && Object.keys(values).length > 0
  };
};
