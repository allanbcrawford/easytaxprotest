
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BillingDetails from '@/components/dashboard/BillingDetails';

const BillingPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-500">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BillingDetails />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BillingPage;
