import React, { useState } from 'react';
import { Search, MapPin, Pill } from 'lucide-react';
import { Button } from '../components/Button';

interface HomePageProps {
  onSearch: (medicine: string) => void;
  onPharmacistLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, onPharmacistLogin }) => {
  const [medicineName, setMedicineName] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (medicineName.trim()) {
      onSearch(medicineName);
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

  // Add subtle inner glow effect
  const searchCardInner = (
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
  );


  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {backgroundElements}
      
      {/* Top Right Login Button */}
      <div className="absolute top-lg right-lg z-10">
        <Button 
          variant="outline" 
          size="sm" 
          icon={<Pill size={16} />}
          onClick={onPharmacistLogin}
          className="!bg-white/95 !border-2 !border-white !text-primary rounded-xl px-4 py-2 font-semibold text-xs !shadow-xl transition-all duration-300 ease-in-out flex items-center gap-2 hover:!bg-white hover:-translate-y-0.5 backdrop-blur-sm"
        >
          Pharmacist Login
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto px-lg py-4xl text-center relative z-2">
        <h1 className="text-5xl font-extrabold text-white mb-md leading-[110%] text-shadow-lg">Find Medicines Around You – Instantly</h1>
        <p className="text-xl text-white mb-xl leading-[160%] font-normal text-shadow-md opacity-95">
          Connect with local pharmacies and community members to find the medicines you need, when you need them.
        </p>

        {/* Simple Single Row Search */}
        <div className="max-w-4xl mx-auto mb-xl flex items-center gap-md bg-white/95 rounded-2xl p-3 border border-neutral-200/80 shadow-sm">
          {/* Search Input */}
          <div className="flex-1 flex items-center bg-background-secondary/80 rounded-xl px-3 py-1 border border-neutral-200/60">
            <Search size={18} color="#64748b" className="mr-2 flex-shrink-0" />
            <input
              placeholder="Search for medicines..."
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none outline-none text-base font-medium text-text-primary w-full py-3"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-neutral-200/80" />

          {/* Location Input */}
          <div className="flex-1 flex items-center bg-background-secondary/80 rounded-xl px-3 py-1 border border-neutral-200/60">
            <MapPin size={18} color="#64748b" className="mr-2 flex-shrink-0" />
            <input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none outline-none text-base font-medium text-text-primary w-full py-3"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-neutral-200/80" />

          {/* Search Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleSearch}
            icon={<Search size={18} />}
            className="!bg-gradient-primary border-none rounded-xl px-5 py-3 text-base font-semibold text-white !shadow-xl transition-all duration-300 ease-in-out min-w-[120px] flex items-center gap-2 hover:-translate-y-0.5 hover:!shadow-2xl"
          >
            Search
          </Button>
        </div>

        <div className="flex gap-lg justify-center flex-wrap mt-4xl relative z-0">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onSearch('')}
            className="!bg-white/95 !border-2 !border-white !text-primary rounded-xl px-6 py-3 font-semibold text-sm !shadow-xl transition-all duration-300 ease-in-out relative z-0 hover:!bg-white hover:-translate-y-0.5 backdrop-blur-sm"
          >
            View Nearby Pharmacies
          </Button>
        </div>
      </div>


    </div>
  );
};
