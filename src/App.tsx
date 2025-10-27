import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
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

function AppContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSearch = (medicine: string) => {
    // Navigate to search results with query parameter
    const query = medicine || 'Medicine';
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handlePharmacyClick = (pharmacyName: string) => {
    console.log('Pharmacy clicked:', pharmacyName);
    navigate(`/pharmacy/${encodeURIComponent(pharmacyName)}`);
  };

  const handlePharmacistLogin = () => {
    navigate('/pharmacist/login');
  };

  const handleReportSubmit = (report: any) => {
    console.log('Report submitted:', report);
  };

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={<HomePage onSearch={handleSearch} onPharmacistLogin={handlePharmacistLogin} />} 
        />
        <Route 
          path="/search" 
          element={
            <SearchResultsPage
              searchQuery={searchParams.get('q') || ''}
              onPharmacyClick={handlePharmacyClick}
              onBack={() => navigate('/')}
            />
          } 
        />
        <Route 
          path="/medicine/:medicineName" 
          element={<MedicineDetailsPage />} 
        />
        <Route 
          path="/pharmacy/:pharmacyName" 
          element={<PharmacyProfilePage />} 
        />
        <Route path="/pharmacist/login" element={<PharmacistLoginPage />} />
        <Route path="/pharmacist/dashboard" element={<PharmacistDashboardPage />} />
      </Routes>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundaryProvider>
        <HighContrastProvider>
          <ThemeProvider>
            <LanguageProvider>
              <FontSizeProvider>
                <SearchHistoryProvider>
                  <SkipLinkProvider>
                    <AppContent />
                  </SkipLinkProvider>
                </SearchHistoryProvider>
              </FontSizeProvider>
            </LanguageProvider>
          </ThemeProvider>
        </HighContrastProvider>
      </ErrorBoundaryProvider>
    </BrowserRouter>
  );
}

export default App;
