
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PropertySummary from '@/components/dashboard/PropertySummary';
import ActionItems from '@/components/dashboard/ActionItems';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's an overview of your property tax protest
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <PropertySummary />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <ActionItems />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
