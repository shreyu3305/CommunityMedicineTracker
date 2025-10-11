import React, { useState } from 'react';
import { Pill, User, Briefcase } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';

interface LoginPageProps {
  onLogin: (role: 'user' | 'pharmacist') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'pharmacist' | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (!email || !password) {
      setLoginError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against mock data
    const credentials = mockCredentials[selectedRole];
    if (email === credentials.email && password === credentials.password) {
      onLogin(selectedRole);
    } else {
      setLoginError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    background: colors.gradient.lightBlue,
  };

  const leftPanelStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    background: colors.gradient.blueTeal,
    color: 'white',
  };

  const rightPanelStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  };

  const formCardStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '450px',
  };

  const iconWrapperStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing.lg,
  };

  const roleCardStyles = (isSelected: boolean): React.CSSProperties => ({
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    border: `2px solid ${isSelected ? colors.primary : colors.neutral[200]}`,
    backgroundColor: isSelected ? colors.neutral[50] : 'white',
    cursor: 'pointer',
    transition: 'all 0.25s',
    textAlign: 'center',
    marginBottom: spacing.md,
  });

  return (
    <div style={containerStyles}>
      <div style={leftPanelStyles}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={iconWrapperStyles}>
            <Pill size={48} color="white" />
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: spacing.lg, lineHeight: '120%' }}>
            Community Medicine Tracker
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: '150%', marginBottom: spacing.xl }}>
            Join thousands of community members helping each other find essential medicines in their area.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg, marginTop: spacing['2xl'] }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: spacing.xs }}>10K+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Active Users</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: spacing.xs }}>500+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Pharmacies</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: spacing.xs }}>50K+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Reports</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: spacing.xs }}>95%</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      <div style={rightPanelStyles}>
        <Card padding="lg" style={formCardStyles}>
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: colors.neutral[900], marginBottom: spacing.sm }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '14px', color: colors.neutral[600] }}>
              {isSignup ? 'Sign up to start helping your community' : 'Sign in to continue'}
            </p>
            
            {!isSignup && (
              <div style={{
                marginTop: spacing.lg,
                padding: spacing.md,
                backgroundColor: colors.neutral[50],
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.neutral[200]}`
              }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.neutral[700], marginBottom: spacing.sm }}>
                  Test Credentials:
                </p>
                <div style={{ fontSize: '11px', color: colors.neutral[600], textAlign: 'left' }}>
                  <div><strong>User:</strong> user@example.com / user123</div>
                  <div><strong>Pharmacist:</strong> pharmacist@example.com / pharmacist123</div>
                </div>
              </div>
            )}
          </div>

          {!selectedRole ? (
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: colors.neutral[700], marginBottom: spacing.md }}>
                Select your role:
              </p>

              <div
                style={roleCardStyles(false)}
                onClick={() => setSelectedRole('user')}
              >
                <User size={32} color={colors.primary} style={{ margin: '0 auto', marginBottom: spacing.sm }} />
                <div style={{ fontWeight: 600, fontSize: '16px', color: colors.neutral[900], marginBottom: spacing.xs }}>
                  Continue as User
                </div>
                <div style={{ fontSize: '14px', color: colors.neutral[600] }}>
                  Search medicines and contribute reports
                </div>
              </div>

              <div
                style={roleCardStyles(false)}
                onClick={() => setSelectedRole('pharmacist')}
              >
                <Briefcase size={32} color={colors.primary} style={{ margin: '0 auto', marginBottom: spacing.sm }} />
                <div style={{ fontWeight: 600, fontSize: '16px', color: colors.neutral[900], marginBottom: spacing.xs }}>
                  Login as Pharmacist
                </div>
                <div style={{ fontSize: '14px', color: colors.neutral[600] }}>
                  Manage your pharmacy inventory
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: spacing.lg }}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: spacing.lg }}>
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                style={{ 
                  marginBottom: spacing.md,
                  background: 'linear-gradient(135deg, #00A6FB 0%, #06D6A0 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(0, 166, 251, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 166, 251, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 166, 251, 0.3)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
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
                fullWidth
                onClick={() => setSelectedRole(null)}
                style={{
                  background: 'transparent',
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: colors.neutral[600],
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.neutral[200];
                  e.currentTarget.style.color = colors.neutral[600];
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Choose Different Role
              </Button>

              <div style={{ marginTop: spacing.lg, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.primary,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          )}
        </Card>
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
