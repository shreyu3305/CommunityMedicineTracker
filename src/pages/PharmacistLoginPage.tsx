import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Building } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface PharmacistLoginPageProps {
  onBack?: () => void;
  onLogin?: (credentials: { email: string; password: string }) => void;
}

export const PharmacistLoginPage: React.FC<PharmacistLoginPageProps> = ({
  onBack: propOnBack,
  onLogin: propOnLogin,
}) => {
  const navigate = useNavigate();
  const onBack = propOnBack || (() => navigate('/'));
  const onLogin = propOnLogin || ((credentials) => {
    console.log('Pharmacist login:', credentials);
    navigate('/pharmacist/dashboard');
  });
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

  // Add animated background elements
  const backgroundElements = (
    <>
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] animate-[float_20s_ease-in-out_infinite] z-1" />
      <div className="absolute top-[20%] -right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-white/10 to-white/5 rounded-full animate-[pulse_4s_ease-in-out_infinite] z-1" />
      <div className="absolute -bottom-[20%] left-[10%] w-[200px] h-[200px] bg-gradient-to-br from-white/8 to-white/3 rounded-full animate-[float_15s_ease-in-out_infinite] z-1" />
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

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {backgroundElements}
      
      {/* Back Button */}
      <div className="absolute top-lg left-lg z-10">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-white/15 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-200 ease-in-out backdrop-blur-sm outline-none hover:bg-white/25 hover:scale-105"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-lg mx-auto p-xl relative z-2 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-sm text-shadow-lg">
            {isRegisterMode ? 'Create Pharmacy Account' : 'Pharmacist Login'}
          </h1>
          <p className="text-base text-white/90 text-shadow-md">
            {isRegisterMode 
              ? 'Register your pharmacy to start managing inventory' 
              : 'Sign in to your pharmacy account'
            }
          </p>
        </div>

        <Card padding="lg" className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            {/* Pharmacy Name - FIRST in registration mode */}
            {isRegisterMode && (
              <div className="flex flex-col gap-sm">
                <div className="relative">
                  <Building 
                    size={20} 
                    color="#6b7280" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1"
                  />
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Enter pharmacy name"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 bg-background-secondary/80 text-text-primary text-base outline-none transition-all duration-300 ease-in-out focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  />
                </div>
              </div>
            )}

            {/* Pharmacy Address - in registration mode */}
            {isRegisterMode && (
              <div className="flex flex-col gap-sm">
                <div className="relative">
                  <Building 
                    size={20} 
                    color="#6b7280" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1"
                  />
                  <input
                    type="text"
                    value={pharmacyAddress}
                    onChange={(e) => setPharmacyAddress(e.target.value)}
                    placeholder="Enter pharmacy address"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 bg-background-secondary/80 text-text-primary text-base outline-none transition-all duration-300 ease-in-out focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-sm">
              <div className="relative">
                <Mail 
                  size={20} 
                  color="#6b7280" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 bg-background-secondary/80 text-text-primary text-base outline-none transition-all duration-300 ease-in-out focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <div className="relative">
                <Lock 
                  size={20} 
                  color="#6b7280" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 bg-background-secondary/80 text-text-primary text-base outline-none transition-all duration-300 ease-in-out focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                />
              </div>
            </div>

            {/* Confirm Password - only in registration mode */}
            {isRegisterMode && (
              <div className="flex flex-col gap-sm">
                <div className="relative">
                  <Lock 
                    size={20} 
                    color="#6b7280" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 bg-background-secondary/80 text-text-primary text-base outline-none transition-all duration-300 ease-in-out focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="bg-gradient-primary border-none rounded-md px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out mt-sm"
            >
              {isLoading 
                ? (isRegisterMode ? 'Creating Account...' : 'Signing In...') 
                : (isRegisterMode ? 'Create Account' : 'Sign In')
              }
            </Button>

            <div className="text-center mt-md pt-md border-t border-neutral-200/50">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="bg-none border-none text-primary text-sm font-medium cursor-pointer underline transition-all duration-200 ease-in-out hover:text-primary-dark"
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
