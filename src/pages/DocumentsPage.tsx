
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DocumentsList from '@/components/dashboard/DocumentsList';

const DocumentsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-500">
              Manage and upload documents related to your property tax protest
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <DocumentsList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
