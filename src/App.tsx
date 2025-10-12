import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { MedicineDetailsPage } from './pages/MedicineDetailsPage';
import { PharmacyProfilePage } from './pages/PharmacyProfilePage';
import { LoginPage } from './pages/LoginPage';
import { ReportModal } from './components/ReportModal';
import type { ViewMode } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'pharmacist' | null>(null);

  const handleSearch = (medicine: string, location: string) => {
    setSearchQuery(medicine || 'Medicine');
    setCurrentView('search');
  };

  const handlePharmacyClick = (pharmacyId: string) => {
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
  };

  const handleReportSubmit = (report: any) => {
    console.log('Report submitted:', report);
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {currentView === 'home' && (
        <HomePage onSearch={handleSearch} />
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
    </>
  );
}

export default App;
