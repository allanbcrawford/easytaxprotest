
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AiChat from '@/components/dashboard/AiChat';

const AiChatPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">AI Tax Assistant</h1>
            <p className="text-gray-500">
              Chat with our AI assistant for help with your property tax protest
            </p>
          </div>
          
          <AiChat />
        </main>
      </div>
    </div>
  );
};

export default AiChatPage;
