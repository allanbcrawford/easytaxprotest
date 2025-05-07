import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PropertyAssessmentPage from "./pages/PropertyAssessmentPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import AiChatPage from "./pages/AiChatPage";
import ResourcesPage from "./pages/ResourcesPage";
import SignaturesPage from "./pages/SignaturesPage";
import UserProfilePage from "./pages/UserProfilePage";
import SettingsPage from "./pages/SettingsPage";
import BillingPage from "./pages/BillingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { useEffect } from 'react';
import { supabase } from './supabaseClient';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    supabase.from('submissions').select('*').then((result) => {
      console.log('Supabase submissions table test:', result);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/property-assessment" element={<PropertyAssessmentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/documents" element={<DocumentsPage />} />
            <Route path="/dashboard/ai-chat" element={<AiChatPage />} />
            <Route path="/dashboard/resources" element={<ResourcesPage />} />
            <Route path="/dashboard/signatures" element={<SignaturesPage />} />
            <Route path="/dashboard/profile" element={<UserProfilePage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/billing" element={<BillingPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
