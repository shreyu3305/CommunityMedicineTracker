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
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            color: '#4F46E5',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2), 0 6px 15px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          Pharmacist Login
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto px-lg py-4xl text-center relative z-2">
        <h1 className="text-5xl font-extrabold text-white mb-md leading-[110%] text-shadow-lg">Find Medicines Around You – Instantly</h1>
        <p className="text-xl text-white mb-xl leading-[160%] font-normal text-shadow-md opacity-95">
          Connect with local pharmacies and community members to find the medicines you need, when you need them.
        </p>

        <div className="max-w-4xl mx-auto mb-xl">
          {/* Simple Single Row Search */}
          <div className="flex items-center gap-md bg-white/95 rounded-2xl p-3 border border-neutral-200/80 shadow-sm">
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
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                minWidth: '120px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5), 0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex gap-lg justify-center flex-wrap mt-4xl relative z-0">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onSearch('')}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              color: '#4F46E5',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)';
            }}
          >
            View Nearby Pharmacies
          </Button>
        </div>
      </div>


    </div>
  );
};
