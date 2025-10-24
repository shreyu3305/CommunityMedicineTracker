import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Building } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { spacing, borderRadius } from '../styles/tokens';

interface PharmacistLoginPageProps {
  onBack: () => void;
  onLogin: (credentials: { email: string; password: string }) => void;
}

export const PharmacistLoginPage: React.FC<PharmacistLoginPageProps> = ({
  onBack,
  onLogin,
}) => {
  const [email, setEmail] = useState('pharmacist@healthplus.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Registration form fields
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isRegisterMode) {
      // Simulate registration process
      setTimeout(() => {
        console.log('Registration:', { email, password, pharmacyName, pharmacyAddress });
        setIsLoading(false);
        // Switch back to login mode after successful registration
        setIsRegisterMode(false);
      }, 1500);
    } else {
      // Simulate login process
      setTimeout(() => {
        onLogin({ email, password });
        setIsLoading(false);
      }, 1500);
    }
  };

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

  const contentStyles: React.CSSProperties = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: spacing.xl,
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 800,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#FFFFFF',
    opacity: 0.9,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  };

  const inputGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: borderRadius.lg,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyles}>
      {backgroundElements}
      
      {/* Back Button */}
      <div style={{
        position: 'absolute',
        top: spacing.lg,
        left: spacing.lg,
        zIndex: 10
      }}>
        <button
          onClick={onBack}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div style={contentStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>
            {isRegisterMode ? 'Create Pharmacy Account' : 'Pharmacist Login'}
          </h1>
          <p style={subtitleStyles}>
            {isRegisterMode 
              ? 'Register your pharmacy to start managing inventory' 
              : 'Sign in to your pharmacy account'
            }
          </p>
        </div>

        <Card padding="lg" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.3)',
        }}>
          <form onSubmit={handleSubmit} style={formStyles}>
            {/* Pharmacy Name - FIRST in registration mode */}
            {isRegisterMode && (
              <div style={inputGroupStyles}>
                <div style={{ position: 'relative' }}>
                  <Building 
                    size={20} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1
                    }}
                  />
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Enter pharmacy name"
                    required
                    style={{
                      ...inputStyles,
                      paddingLeft: '48px',
                      color: '#1a1a1a',
                      background: 'rgba(248, 250, 252, 0.8)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                  />
                </div>
              </div>
            )}

            <div style={inputGroupStyles}>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={20} 
                  color="#6b7280" 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    ...inputStyles,
                    paddingLeft: '48px',
                    color: '#1a1a1a',
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                />
              </div>
            </div>

            <div style={inputGroupStyles}>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={20} 
                  color="#6b7280" 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    ...inputStyles,
                    paddingLeft: '48px',
                    color: '#1a1a1a',
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                />
              </div>
            </div>

            {/* Confirm Password - only in registration mode */}
            {isRegisterMode && (
              <div style={inputGroupStyles}>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={20} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1
                    }}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    style={{
                      ...inputStyles,
                      paddingLeft: '48px',
                      color: '#1a1a1a',
                      background: 'rgba(248, 250, 252, 0.8)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: borderRadius.md,
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                transition: 'all 0.2s ease',
                marginTop: spacing.sm,
              }}
            >
              {isLoading 
                ? (isRegisterMode ? 'Creating Account...' : 'Signing In...') 
                : (isRegisterMode ? 'Create Account' : 'Sign In')
              }
            </Button>

            <div style={{
              textAlign: 'center',
              marginTop: spacing.md,
              paddingTop: spacing.md,
              borderTop: '1px solid rgba(226, 232, 240, 0.5)'
            }}>
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#5a67d8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#667eea';
                }}
              >
                {isRegisterMode ? 'Already have an account? Sign In' : 'Create a new Pharmacy Account'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
