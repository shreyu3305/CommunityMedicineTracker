import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { MedicineDetailsPage } from './pages/MedicineDetailsPage';
import { PharmacyProfilePage } from './pages/PharmacyProfilePage';
import { LoginPage } from './pages/LoginPage';
import { ReportModal } from './components/ReportModal';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
import { ThemeProvider } from './components/DarkModeToggle';
import { LanguageProvider } from './components/LanguageToggle';
import { FontSizeProvider } from './components/FontSizeAdjuster';
import { HighContrastProvider } from './components/HighContrastMode';
import { ErrorBoundaryProvider } from './components/ErrorBoundaries';
import { SkipLinkProvider } from './components/SkipLinks';
import type { ViewMode } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'pharmacist' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved authentication state on app start
  useEffect(() => {
    const savedUserRole = localStorage.getItem('userRole') as 'user' | 'pharmacist' | null;
    const savedView = localStorage.getItem('currentView') as ViewMode | null;
    
    if (savedUserRole) {
      setUserRole(savedUserRole);
      if (savedView) {
        setCurrentView(savedView);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save authentication state to localStorage
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('currentView', currentView);
    } else {
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentView');
    }
  }, [userRole, currentView]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleSearch = (medicine: string, location: string) => {
    setSearchQuery(medicine || 'Medicine');
    setCurrentView('search');
  };

  const handlePharmacyClick = (pharmacyId: string) => {
    console.log('Pharmacy clicked:', pharmacyId);
    setSelectedPharmacyId(pharmacyId);
    setCurrentView('pharmacy');
  };

  const handleMedicineClick = (medicine: string) => {
    setSelectedMedicine(medicine);
    setCurrentView('medicine');
  };

  const handleLogin = (role: 'user' | 'pharmacist') => {
    setUserRole(role);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentView');
  };

  const handleReportSubmit = (report: any) => {
    console.log('Report submitted:', report);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px',
        fontWeight: 500
      }}>
        Loading...
      </div>
    );
  }

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundaryProvider>
      <HighContrastProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <SearchHistoryProvider>
                <SkipLinkProvider>
            {currentView === 'home' && (
              <HomePage onSearch={handleSearch} onLogout={handleLogout} />
            )}

            {currentView === 'search' && (
              <SearchResultsPage
                searchQuery={searchQuery}
                onReportClick={() => setShowReportModal(true)}
                onPharmacyClick={handlePharmacyClick}
              />
            )}

            {currentView === 'medicine' && (
              <MedicineDetailsPage
                medicineName={selectedMedicine || searchQuery}
                onBack={() => setCurrentView('search')}
              />
            )}

            {currentView === 'pharmacy' && (
              <PharmacyProfilePage
                pharmacyId={selectedPharmacyId}
                onBack={() => setCurrentView('search')}
              />
            )}

            {showReportModal && (
              <ReportModal
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportSubmit}
              />
            )}
                </SkipLinkProvider>
              </SearchHistoryProvider>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HighContrastProvider>
    </ErrorBoundaryProvider>
  );
}

export default App;
