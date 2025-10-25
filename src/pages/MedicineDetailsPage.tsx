import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle, History, Image } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface MedicineDetailsPageProps {
  medicineName: string;
  onBack: () => void;
}

export const MedicineDetailsPage: React.FC<MedicineDetailsPageProps> = ({
  medicineName,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'availability' | 'history' | 'photos'>('availability');


  return (
    <div className="min-h-screen bg-gradient-primary relative">
      <div className="bg-gradient-primary text-text-inverse p-xl relative z-2">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            className="text-white mb-lg"
          >
            Back to Results
          </Button>
          <h1 className="text-4xl font-extrabold mb-md text-shadow-lg bg-gradient-to-br from-white to-blue-50 bg-clip-text text-transparent">
            {medicineName}
          </h1>
          <div className="flex gap-md flex-wrap">
            <Badge variant="info" size="md">Tablet</Badge>
            <Badge variant="neutral" size="md">500mg</Badge>
            <Badge variant="neutral" size="md">Generic Available</Badge>
          </div>
          <p className="mt-md text-lg opacity-95 font-normal text-shadow-md">
            Paracetamol - Pain reliever and fever reducer
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-lg relative z-2">
        <div className="flex gap-sm mb-lg border-b-2 border-white/20 bg-white/10 rounded-t-2xl p-md backdrop-blur-sm">
          <button
            className={`px-md py-lg text-base font-bold border-none rounded-xl cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-sm ${
              activeTab === 'availability' 
                ? 'text-white bg-white/20' 
                : 'text-white/80 bg-transparent hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('availability')}
          >
            <MapPin size={18} className="inline mr-xs" />
            Nearby Availability
          </button>
          <button
            className={`px-md py-lg text-base font-bold border-none rounded-xl cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-sm ${
              activeTab === 'history' 
                ? 'text-white bg-white/20' 
                : 'text-white/80 bg-transparent hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} className="inline mr-xs" />
            Reports History
          </button>
          <button
            className={`px-md py-lg text-base font-bold border-none rounded-xl cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-sm ${
              activeTab === 'photos' 
                ? 'text-white bg-white/20' 
                : 'text-white/80 bg-transparent hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('photos')}
          >
            <Image size={18} className="inline mr-xs" />
            Photos & Notes
          </button>
        </div>

        {activeTab === 'availability' && (
          <div className="flex flex-col gap-md">
            {[1, 2, 3].map((item) => (
              <Card key={item} hover padding="lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        HealthPlus Pharmacy
                      </h3>
                      <CheckCircle size={18} color="#667eea" fill="#667eea" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-sm">
                      123 Main Street, Downtown
                    </p>
                    <div className="flex gap-md text-sm text-neutral-600">
                      <span>Distance: 0.5 km</span>
                      <span>•</span>
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-sm items-end">
                    <Badge variant="success" icon={<CheckCircle size={14} />}>
                      In Stock
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      Confidence: <strong className="text-success">95%</strong>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col gap-md">
            <Card padding="lg">
              <div className="border-l-3 border-success pl-md mb-lg">
                <div className="flex justify-between mb-sm">
                  <span className="font-semibold text-neutral-900">Status Updated</span>
                  <Badge variant="success">In Stock</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-xs">
                  HealthPlus Pharmacy - 123 Main Street
                </p>
                <p className="text-xs text-neutral-500">
                  Reported by John D. • 2 hours ago • Verified
                </p>
              </div>

              <div className="border-l-3 border-error pl-md mb-lg">
                <div className="flex justify-between mb-sm">
                  <span className="font-semibold text-neutral-900">Status Updated</span>
                  <Badge variant="error">Out of Stock</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-xs">
                  City Care Drugstore - 456 Oak Avenue
                </p>
                <p className="text-xs text-neutral-500">
                  Reported by Sarah M. • 5 hours ago
                </p>
              </div>

              <div className="border-l-3 border-success pl-md">
                <div className="flex justify-between mb-sm">
                  <span className="font-semibold text-neutral-900">Status Updated</span>
                  <Badge variant="success">In Stock</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-xs">
                  Wellness Pharmacy - 789 Pine Road
                </p>
                <p className="text-xs text-neutral-500">
                  Reported by Mike R. • 1 day ago • Verified
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'photos' && (
          <Card padding="lg">
            <div className="text-center p-2xl text-neutral-400">
              <Image size={48} className="mx-auto mb-md" />
              <p className="text-base mb-xs">No photos available yet</p>
              <p className="text-sm">Be the first to add a photo when reporting availability</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
