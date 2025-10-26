import React, { useState } from 'react';
import { ArrowLeft, Pill, Plus, Edit, Trash2, User, Menu, X, LogOut } from 'lucide-react';
import { Badge } from '../components/Badge';
import { AddMedicineModal, AddMedicineData } from '../components/AddMedicineModal';
import type { Medicine } from '../types';

interface PharmacistDashboardPageProps {
  onBack: () => void;
}

type TabType = 'account' | 'medicines';

export const PharmacistDashboardPage: React.FC<PharmacistDashboardPageProps> = ({
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [operatingHours, setOperatingHours] = useState<{[key: string]: {open: string, close: string, closed: boolean}}>({
    monday: { open: '09:00', close: '20:00', closed: false },
    tuesday: { open: '09:00', close: '20:00', closed: false },
    wednesday: { open: '09:00', close: '20:00', closed: false },
    thursday: { open: '09:00', close: '20:00', closed: false },
    friday: { open: '09:00', close: '20:00', closed: false },
    saturday: { open: '10:00', close: '18:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: false }
  });
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      quantity: 150
    },
    {
      id: '2',
      name: 'Ibuprofen 400mg',
      quantity: 89
    },
    {
      id: '3',
      name: 'Amoxicillin 250mg',
      quantity: 12
    },
    {
      id: '4',
      name: 'Aspirin 75mg',
      quantity: 0
    }
  ]);

  // Mock pharmacy data (same as what users see)
  const pharmacyData = {
    id: '1',
    name: 'HealthPlus Pharmacy',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'contact@healthplus.com',
    isVerified: true,
    openHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
  };



  // Handle adding/editing medicine
  const handleAddMedicine = async (medicineData: AddMedicineData) => {
    if (editingMedicine) {
      // Update existing medicine
      setMedicines(prev => prev.map(med => 
        med.id === editingMedicine.id 
          ? { ...med, name: medicineData.name, quantity: medicineData.quantity, lastUpdated: new Date().toISOString() }
          : med
      ));
      console.log('Medicine updated:', { ...editingMedicine, ...medicineData });
      setEditingMedicine(null);
    } else {
      // Add new medicine
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        name: medicineData.name,
        quantity: medicineData.quantity
      };

      setMedicines(prev => [...prev, newMedicine]);
      console.log('Medicine added:', newMedicine);
    }
  };

  // Handle editing medicine
  const handleEditMedicine = (medicineId: string) => {
    const medicine = medicines.find(med => med.id === medicineId);
    if (medicine) {
      setEditingMedicine(medicine);
      setShowAddMedicineModal(true);
    }
  };

  // Handle deleting medicine
  const handleDeleteMedicine = (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(med => med.id !== medicineId));
      console.log('Medicine deleted:', medicineId);
    }
  };


  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error'> = {
      in_stock: 'success',
      low_stock: 'warning',
      out_of_stock: 'error',
    };

    const labels: Record<string, string> = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const renderAccountTab = () => (
    <div className="p-xl pt-5 flex flex-col gap-xl h-full max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-lg">
        <h2 className="text-3xl font-bold text-text-primary m-0 mb-sm">
          Pharmacy Profile
        </h2>
        <p className="text-base text-neutral-600 m-0">
          Manage your pharmacy information and settings
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-xl p-xl shadow-custom-md border border-black/5">
        <h3 className="text-xl font-semibold text-text-primary mb-lg border-b-2 border-primary pb-sm">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-2 gap-lg mb-lg">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-sm">
              Pharmacy Name *
            </label>
            <input
              type="text"
              placeholder="Enter pharmacy name"
              defaultValue={pharmacyData.name}
              disabled={!isEditing}
              className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all duration-300 ease-in-out outline-none shadow-custom-sm ${
                isEditing 
                  ? 'bg-white text-neutral-800 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                  : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-sm">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              defaultValue={pharmacyData.phone}
              disabled={!isEditing}
              className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all duration-300 ease-in-out outline-none shadow-custom-sm ${
                isEditing 
                  ? 'bg-white text-neutral-800 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                  : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-sm">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              defaultValue={pharmacyData.email}
              disabled={!isEditing}
              className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all duration-300 ease-in-out outline-none shadow-custom-sm ${
                isEditing 
                  ? 'bg-white text-neutral-800 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                  : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
              }`}
            />
          </div>

          <div className="flex items-end">
            <div className={`flex items-center gap-sm px-4 py-3.5 rounded-lg border-2 border-neutral-300 w-full transition-all duration-300 ease-in-out ${
              isEditing ? 'bg-background-secondary opacity-100' : 'bg-neutral-100 opacity-70'
            }`}>
              <input
                type="checkbox"
                defaultChecked={pharmacyData.isVerified}
                disabled={!isEditing}
                className={`w-5 h-5 cursor-pointer appearance-none bg-white border-2 border-neutral-300 rounded-md outline-none transition-all duration-200 ease-in-out shadow-custom-sm ${
                  isEditing ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              />
              <label className={`text-base font-semibold transition-colors duration-200 ease-in-out ${
                isEditing ? 'text-neutral-700 cursor-pointer' : 'text-neutral-500 cursor-not-allowed'
              }`}>
                Verified Pharmacy
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-sm">
            Address *
          </label>
          <textarea
            placeholder="Enter complete address"
            defaultValue={pharmacyData.address}
            rows={3}
            disabled={!isEditing}
            className={`w-full px-4 py-3.5 rounded-lg border-2 transition-all duration-300 ease-in-out outline-none resize-none shadow-custom-sm ${
              isEditing 
                ? 'bg-white text-neutral-800 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
            }`}
          />
        </div>
      </div>


      {/* Operating Hours Section */}
      <div className="bg-white rounded-xl p-xl shadow-custom-md border border-black/5">
        <h3 className="text-xl font-semibold text-text-primary mb-lg border-b-2 border-primary pb-sm">
          Operating Hours
        </h3>
        
        <div className="grid grid-cols-2 gap-md">
          {Object.entries(operatingHours).map(([day]) => (
            <div key={day} className="flex items-center gap-md p-lg border-2 border-neutral-100 rounded-lg bg-background-secondary transition-all duration-300 ease-in-out">
              <div className="relative flex items-center justify-center w-6 h-6">
                <input
                  type="checkbox"
                  checked={!operatingHours[day as keyof typeof operatingHours].closed}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setOperatingHours(prev => ({
                      ...prev,
                      [day]: {
                        ...prev[day as keyof typeof prev],
                        closed: !e.target.checked
                      }
                    }));
                  }}
                  className={`w-5 h-5 cursor-pointer appearance-none border-2 rounded-md outline-none transition-all duration-200 ease-in-out shadow-custom-sm relative m-0 ${
                    !operatingHours[day as keyof typeof operatingHours].closed 
                      ? 'bg-primary border-primary' 
                      : 'bg-white border-neutral-300'
                  } ${isEditing ? 'opacity-100' : 'opacity-60 cursor-not-allowed'}`}
                />
                {!operatingHours[day as keyof typeof operatingHours].closed && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path 
                        d="M1 4L3 6L7 2" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="text-base font-semibold text-neutral-700 capitalize min-w-[80px] flex items-center">
                {day}
              </div>
              
              <div className="flex gap-sm items-center flex-1">
                <input
                  type="time"
                  value={operatingHours[day as keyof typeof operatingHours].open}
                  onChange={(e) => {
                    setOperatingHours(prev => ({
                      ...prev,
                      [day]: {
                        ...prev[day as keyof typeof prev],
                        open: e.target.value
                      }
                    }));
                  }}
                  disabled={!isEditing}
                  className={`px-3 py-2.5 rounded-md border-2 transition-all duration-300 ease-in-out outline-none shadow-custom-sm ${
                    isEditing 
                      ? 'bg-white text-neutral-700 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                      : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
                  }`}
                />
                <span className="text-sm text-neutral-500 font-medium">to</span>
                <input
                  type="time"
                  value={operatingHours[day as keyof typeof operatingHours].close}
                  onChange={(e) => {
                    setOperatingHours(prev => ({
                      ...prev,
                      [day]: {
                        ...prev[day as keyof typeof prev],
                        close: e.target.value
                      }
                    }));
                  }}
                  disabled={!isEditing}
                  className={`px-3 py-2.5 rounded-md border-2 transition-all duration-300 ease-in-out outline-none shadow-custom-sm ${
                    isEditing 
                      ? 'bg-white text-neutral-700 border-neutral-300 cursor-text focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' 
                      : 'bg-background-secondary text-neutral-500 border-neutral-300 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  const renderMedicinesTab = () => (
    <div className="p-xl flex flex-col gap-xl h-full max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-lg">
        <h2 className="text-3xl font-bold text-text-primary m-0 mb-sm">
          Medicine Management
        </h2>
        <p className="text-base text-neutral-600 m-0">
          Manage your pharmacy inventory and medicine stock
        </p>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-xl shadow-custom-md border border-black/5">
        <h3 className="text-xl font-semibold text-text-primary mb-lg border-b-2 border-primary pb-sm">
          Inventory Overview
        </h3>
        
        <div className="grid grid-cols-3 gap-lg">
          <div className="bg-gradient-success rounded-lg p-xl text-center border-2 border-green-200 relative overflow-hidden">
            <div className="absolute -top-2.5 -right-2.5 w-15 h-15 bg-green-100 rounded-full" />
            <div className="text-4xl font-bold text-green-600 mb-sm">
              {medicines.filter(med => med.quantity > 20).length}
            </div>
            <div className="text-base text-green-700 font-semibold">
              In Stock
            </div>
            <div className="text-xs text-green-600 mt-xs">
              Well stocked items
            </div>
          </div>
          
          <div className="bg-gradient-warning rounded-lg p-xl text-center border-2 border-yellow-200 relative overflow-hidden">
            <div className="absolute -top-2.5 -right-2.5 w-15 h-15 bg-yellow-100 rounded-full" />
            <div className="text-4xl font-bold text-yellow-600 mb-sm">
              {medicines.filter(med => med.quantity > 0 && med.quantity <= 20).length}
            </div>
            <div className="text-base text-yellow-700 font-semibold">
              Low Stock
            </div>
            <div className="text-xs text-yellow-600 mt-xs">
              Needs restocking
            </div>
          </div>
          
          <div className="bg-gradient-error rounded-lg p-xl text-center border-2 border-red-200 relative overflow-hidden">
            <div className="absolute -top-2.5 -right-2.5 w-15 h-15 bg-red-100 rounded-full" />
            <div className="text-4xl font-bold text-red-600 mb-sm">
              {medicines.filter(med => med.quantity === 0).length}
            </div>
            <div className="text-base text-red-700 font-semibold">
              Out of Stock
            </div>
            <div className="text-xs text-red-600 mt-xs">
              Urgent restock needed
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-xl p-xl shadow-custom-md border border-black/5">
        <div className="flex justify-between items-center mb-lg">
          <h3 className="text-xl font-semibold text-text-primary m-0 border-b-2 border-primary pb-sm">
            Medicine Inventory
          </h3>
          <button
            onClick={() => setShowAddMedicineModal(true)}
            className="flex items-center gap-sm px-7 py-4 bg-gradient-primary border-none rounded-xl text-white text-base font-bold cursor-pointer transition-all duration-300 ease-out shadow-custom-lg relative overflow-hidden min-w-[180px] justify-center tracking-wider hover:-translate-y-1 hover:scale-105 hover:shadow-custom-xl hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-500 active:translate-y-0 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm">
              <Plus size={18} />
            </div>
            <span className="text-shadow-sm relative z-2">
              Add Medicine
            </span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ease-in-out" />
          </button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-neutral-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background-secondary border-b-2 border-neutral-300">
                <th className="text-left p-lg text-sm font-semibold text-neutral-700">
                  Medicine
                </th>
                <th className="text-center p-lg text-sm font-semibold text-neutral-700">
                  Status
                </th>
                <th className="text-center p-lg text-sm font-semibold text-neutral-700">
                  Quantity
                </th>
                <th className="text-right p-lg text-sm font-semibold text-neutral-700">
                  Last Updated
                </th>
                <th className="text-center p-lg text-sm font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="border-b border-neutral-100 transition-all duration-200 ease-in-out">
                  <td className="p-lg text-base text-neutral-800 font-semibold">
                    {medicine.name}
                  </td>
                  <td className="p-lg text-center">
                    {getStatusBadge(medicine.quantity > 20 ? 'in_stock' : medicine.quantity > 0 ? 'low_stock' : 'out_of_stock')}
                  </td>
                  <td className="p-lg text-center text-base font-semibold text-neutral-800">
                    {medicine.quantity}
                  </td>
                  <td className="p-lg text-sm text-neutral-500 text-right">
                    Just now
                  </td>
                  <td className="p-lg text-center">
                    <div className="flex gap-sm justify-center">
                      <button
                        onClick={() => handleEditMedicine(medicine.id)}
                        className="flex items-center justify-center w-9 h-9 bg-gradient-edit border border-blue-200 rounded-md text-primary cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="flex items-center justify-center w-9 h-9 bg-gradient-delete border border-red-200 rounded-md text-red-600 cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} h-screen bg-white/95 backdrop-blur-lg border-r border-white/20 transition-all duration-300 ease-in-out overflow-hidden fixed top-0 left-0 z-30 flex flex-col`}>
        {sidebarOpen && (
          <div className="p-lg h-full flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-xl flex-shrink-0">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Pill size={20} color="white" />
                </div>
                <div>
                  <div className="text-base font-bold text-text-primary">
                    {pharmacyData.name}
                  </div>
                  <div className="text-xs text-neutral-600">
                    Pharmacist Dashboard
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-8 h-8 bg-transparent border-none rounded-sm text-neutral-600 cursor-pointer transition-all duration-200 ease-in-out hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-sm mb-xl flex-shrink-0">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-sm p-md border-none rounded-md cursor-pointer transition-all duration-200 ease-in-out text-left w-full ${
                  activeTab === 'account' 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-transparent text-neutral-700'
                }`}
              >
                <User size={20} />
                <span className="text-base font-semibold">Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab('medicines')}
                className={`flex items-center gap-sm p-md border-none rounded-md cursor-pointer transition-all duration-200 ease-in-out text-left w-full ${
                  activeTab === 'medicines' 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-transparent text-neutral-700'
                }`}
              >
                <Pill size={20} />
                <span className="text-base font-semibold">Medicines</span>
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="flex flex-col gap-sm mt-auto flex-shrink-0">
              <button
                onClick={onBack}
                className="flex items-center gap-sm p-md bg-transparent border border-neutral-300 rounded-md text-neutral-700 cursor-pointer transition-all duration-200 ease-in-out text-left w-full hover:bg-neutral-50"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-semibold">Back</span>
              </button>
              
              <button
                onClick={() => console.log('Logout')}
                className="flex items-center gap-sm p-md bg-transparent border border-error rounded-md text-error cursor-pointer transition-all duration-200 ease-in-out text-left w-full hover:bg-red-50"
              >
                <LogOut size={18} />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen relative z-2 overflow-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Header */}
        <div className={`bg-transparent text-white p-lg fixed top-0 right-0 z-40 flex items-center justify-between backdrop-blur-lg border-b border-white/10 transition-all duration-300 ease-in-out ${sidebarOpen ? 'left-[280px]' : 'left-0'}`}>
          <div className="flex items-center gap-md">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-10 h-10 bg-white/15 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-200 ease-in-out backdrop-blur-sm outline-none hover:bg-white/25"
              >
                <Menu size={18} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-white m-0">
              {activeTab === 'account' ? 'Account Management' : 'Medicine Management'}
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-sm items-center">
            {activeTab === 'account' && !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-gradient-to-br from-white to-background-secondary border border-white/30 rounded-lg text-primary text-sm font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-custom-md outline-none min-w-[100px] flex items-center gap-xs hover:-translate-y-0.5 hover:shadow-custom-xl hover:bg-gradient-to-br hover:from-white hover:to-background-tertiary active:translate-y-0"
              >
                <Edit size={16} />
                Edit
              </button>
            ) : activeTab === 'account' ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-lg outline-none min-w-[80px] hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Save profile');
                    setIsEditing(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-br from-white to-background-secondary border border-white/30 rounded-lg text-primary text-sm font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-custom-md outline-none min-w-[120px] relative overflow-hidden hover:-translate-y-0.5 hover:shadow-custom-xl hover:bg-gradient-to-br hover:from-white hover:to-background-tertiary active:translate-y-0"
                >
                  Save Changes
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-lg pt-[120px] relative z-2">
          {activeTab === 'account' ? renderAccountTab() : renderMedicinesTab()}
        </div>
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={showAddMedicineModal}
        onClose={() => {
          setShowAddMedicineModal(false);
          setEditingMedicine(null);
        }}
        onSubmit={handleAddMedicine}
        editingMedicine={editingMedicine}
      />
    </div>
  );
};