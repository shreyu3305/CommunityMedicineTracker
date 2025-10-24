import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { MedicineDetailsPage } from './pages/MedicineDetailsPage';
import { PharmacyProfilePage } from './pages/PharmacyProfilePage';
import { PharmacistLoginPage } from './pages/PharmacistLoginPage';
import { PharmacistDashboardPage } from './pages/PharmacistDashboardPage';
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
  const [showReportModal, setShowReportModal] = useState(false);

  // Load saved view state on app start
  useEffect(() => {
    const savedView = localStorage.getItem('currentView') as ViewMode | null;
    if (savedView) {
      setCurrentView(savedView);
    }
  }, []);

  // Save current view to localStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleSearch = (medicine: string) => {
    setSearchQuery(medicine || 'Medicine');
    setCurrentView('search');
  };

  const handlePharmacyClick = (pharmacyId: string) => {
    console.log('Pharmacy clicked:', pharmacyId);
    setSelectedPharmacyId(pharmacyId);
    setCurrentView('pharmacy');
  };

  const handlePharmacistLogin = () => {
    setCurrentView('pharmacist-login');
  };

  const handlePharmacistLoginSubmit = (credentials: { email: string; password: string }) => {
    console.log('Pharmacist login:', credentials);
    // Here you would typically handle the actual login logic
    // For now, navigate to dashboard
    setCurrentView('pharmacist-dashboard');
  };



  const handleReportSubmit = (report: any) => {
    console.log('Report submitted:', report);
  };

  return (
    <ErrorBoundaryProvider>
      <HighContrastProvider>
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <SearchHistoryProvider>
                <SkipLinkProvider>
            {currentView === 'home' && (
              <HomePage onSearch={handleSearch} onPharmacistLogin={handlePharmacistLogin} />
            )}

            {currentView === 'search' && (
              <SearchResultsPage
                searchQuery={searchQuery}
                onReportClick={() => setShowReportModal(true)}
                onPharmacyClick={handlePharmacyClick}
                onBack={() => setCurrentView('home')}
              />
            )}

            {currentView === 'medicine' && (
              <MedicineDetailsPage
                medicineName={searchQuery}
                onBack={() => setCurrentView('search')}
              />
            )}

            {currentView === 'pharmacy' && (
              <PharmacyProfilePage
                pharmacyId={selectedPharmacyId}
                onBack={() => setCurrentView('search')}
              />
            )}

            {currentView === 'pharmacist-login' && (
              <PharmacistLoginPage
                onBack={() => setCurrentView('home')}
                onLogin={handlePharmacistLoginSubmit}
              />
            )}

            {currentView === 'pharmacist-dashboard' && (
              <PharmacistDashboardPage
                onBack={() => setCurrentView('home')}
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
