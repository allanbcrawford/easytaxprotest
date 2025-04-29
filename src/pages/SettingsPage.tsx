
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserSettings from '@/components/dashboard/UserSettings';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-500">
              Configure your preferences and notification settings
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserSettings />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
