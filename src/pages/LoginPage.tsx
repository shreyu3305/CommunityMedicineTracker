import React, { useState } from 'react';
import { Pill, User, Briefcase } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { FormValidation, useFormValidation, validationRules } from '../components/FormValidation';
import { colors, spacing, borderRadius } from '../styles/tokens';

interface LoginPageProps {
  onLogin: (role: 'user' | 'pharmacist') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'pharmacist' | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validationConfig = {
    email: {
      ...validationRules.required('Email is required'),
      ...validationRules.email('Please enter a valid email address')
    },
    password: {
      ...validationRules.required('Password is required'),
      ...validationRules.minLength(6, 'Password must be at least 6 characters')
    }
  };

  const { values, setValue, validateForm } = useFormValidation(validationConfig);

  // Static login credentials for testing
  const mockCredentials = {
    user: {
      email: 'user@example.com',
      password: 'user123'
    },
    pharmacist: {
      email: 'pharmacist@example.com',
      password: 'pharmacist123'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (!selectedRole) {
      setLoginError('Please select a role first');
      setIsLoading(false);
      return;
    }

    // Validate form before proceeding
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (!values.email || !values.password) {
      setLoginError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against mock data
    const credentials = mockCredentials[selectedRole];
    if (values.email === credentials.email && values.password === credentials.password) {
      onLogin(selectedRole);
    } else {
      setLoginError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    background: colors.gradient.primary,
    position: 'relative',
    overflow: 'hidden',
  };

  const leftPanelStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4xl'],
    background: colors.gradient.primary,
    color: colors.text.inverse,
    position: 'relative',
  };

  const rightPanelStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4xl'],
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
  };

  const formCardStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: spacing['3xl'],
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const iconWrapperStyles: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing.xl,
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
  };

  const roleCardStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.xl,
    borderRadius: '20px',
    border: `2px solid ${isSelected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'}`,
    backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    marginBottom: spacing.lg,
    boxShadow: isSelected ? '0 10px 30px rgba(102, 126, 234, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  });

  return (
    <div style={containerStyles}>
      <div style={leftPanelStyles}>
        <div style={{ maxWidth: '600px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={iconWrapperStyles}>
            <Pill size={56} color="white" />
          </div>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            marginBottom: spacing.lg, 
            lineHeight: '110%',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            Community Medicine Tracker
          </h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.95, 
            lineHeight: '160%', 
            marginBottom: spacing['2xl'],
            fontWeight: 400,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Join thousands of community members helping each other find essential medicines in their area.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: spacing.xl, 
            marginTop: spacing['3xl'],
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: spacing.xl,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: spacing.xs, color: '#ffffff' }}>10K+</div>
              <div style={{ fontSize: '16px', opacity: 0.9, fontWeight: 500 }}>Active Users</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: spacing.xs, color: '#ffffff' }}>500+</div>
              <div style={{ fontSize: '16px', opacity: 0.9, fontWeight: 500 }}>Pharmacies</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: spacing.xs, color: '#ffffff' }}>50K+</div>
              <div style={{ fontSize: '16px', opacity: 0.9, fontWeight: 500 }}>Reports</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: spacing.xs, color: '#ffffff' }}>95%</div>
              <div style={{ fontSize: '16px', opacity: 0.9, fontWeight: 500 }}>Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      <div style={rightPanelStyles}>
        <div style={formCardStyles}>
          <div style={{ textAlign: 'center', marginBottom: spacing['2xl'] }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: '#1a1a1a', 
              marginBottom: spacing.md,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              fontWeight: 500,
              lineHeight: '150%'
            }}>
              {isSignup ? 'Sign up to start helping your community' : 'Sign in to continue'}
            </p>
            
            {!isSignup && (
              <div style={{
                marginTop: spacing.xl,
                padding: spacing.lg,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: '#374151', 
                  marginBottom: spacing.sm,
                  textAlign: 'center'
                }}>
                  Test Credentials
                </p>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#6b7280', 
                  textAlign: 'left',
                  lineHeight: '150%'
                }}>
                  <div style={{ marginBottom: spacing.xs }}>
                    <strong style={{ color: '#667eea' }}>User:</strong> user@example.com / user123
                  </div>
                  <div>
                    <strong style={{ color: '#667eea' }}>Pharmacist:</strong> pharmacist@example.com / pharmacist123
                  </div>
                </div>
              </div>
            )}
          </div>

          {!selectedRole ? (
            <div>
              <p style={{ 
                fontSize: '16px', 
                fontWeight: 700, 
                color: '#374151', 
                marginBottom: spacing.lg,
                textAlign: 'center'
              }}>
                Select your role
              </p>

              <div
                style={roleCardStyles(false)}
                onClick={() => setSelectedRole('user')}
              >
                <User size={40} color="#667eea" style={{ margin: '0 auto', marginBottom: spacing.md }} />
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a', marginBottom: spacing.sm }}>
                  Continue as User
                </div>
                <div style={{ fontSize: '15px', color: '#6b7280', lineHeight: '140%' }}>
                  Search medicines and contribute reports
                </div>
              </div>

              <div
                style={roleCardStyles(false)}
                onClick={() => setSelectedRole('pharmacist')}
              >
                <Briefcase size={40} color="#667eea" style={{ margin: '0 auto', marginBottom: spacing.md }} />
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a', marginBottom: spacing.sm }}>
                  Login as Pharmacist
                </div>
                <div style={{ fontSize: '15px', color: '#6b7280', lineHeight: '140%' }}>
                  Manage your pharmacy inventory
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: spacing.lg }}>
                  <FormValidation
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    value={values.email || ''}
                    onChange={(value) => setValue('email', value)}
                    rules={validationConfig.email}
                  />
              </div>

              <div style={{ marginBottom: spacing.lg }}>
                <FormValidation
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={values.password || ''}
                  onChange={(value) => setValue('password', value)}
                  rules={validationConfig.password}
                  showPasswordToggle={true}
                />
              </div>

              {isSignup && (
                <div style={{ marginBottom: spacing.lg }}>
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {loginError && (
                <div style={{
                  padding: spacing.md,
                  backgroundColor: '#FEE2E2',
                  color: colors.error,
                  borderRadius: borderRadius.lg,
                  fontSize: '14px',
                  marginBottom: spacing.md,
                  border: `1px solid ${colors.error}20`
                }}>
                  {loginError}
                </div>
              )}

              <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1)';
                  }}
                >
                  <span style={{ 
                    position: 'relative', 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    {isLoading ? (
                      <>
                        <svg 
                          width="16" 
                          height="16" 
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
                        Signing In...
                      </>
                    ) : (
                      <>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ transition: 'transform 0.3s ease' }}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setSelectedRole(null)}
                  style={{
                    flex: 1,
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: `2px solid rgba(102, 126, 234, 0.3)`,
                    borderRadius: '16px',
                    padding: '16px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#667eea',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Choose Different Role
                </Button>
              </div>

              <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#764ba2';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          )}
        </div>
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
