
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ResourceCard from '@/components/dashboard/ResourceCard';
import { Book, FileText, BookOpen, FileBarChart, Calculator, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResourcesPage: React.FC = () => {
  const resources = {
    guides: [
      {
        title: "Property Tax Protest Guide",
        description: "Step-by-step guide to protesting your property taxes successfully.",
        tags: ["Beginner", "Guide"],
        link: "#",
        icon: <Book size={20} />
      },
      {
        title: "Understanding Market Value",
        description: "How assessors determine your property's value and how to challenge it.",
        tags: ["Education"],
        link: "#",
        icon: <Building size={20} />
      },
      {
        title: "Preparing for Your Hearing",
        description: "What to expect and how to present your case effectively at a protest hearing.",
        tags: ["Advanced"],
        link: "#",
        icon: <FileText size={20} />
      }
    ],
    laws: [
      {
        title: "Texas Property Tax Code",
        description: "Official regulations governing property taxation in Texas.",
        tags: ["Legal"],
        link: "#",
        icon: <BookOpen size={20} />
      },
      {
        title: "Homestead Exemption Laws",
        description: "Understand the laws around homestead exemptions and how they affect your taxes.",
        tags: ["Legal", "Exemptions"],
        link: "#",
        icon: <FileText size={20} />
      },
      {
        title: "Recent Tax Law Changes",
        description: "Summary of recent changes to property tax laws that may affect your protest.",
        tags: ["Legal", "Updates"],
        link: "#",
        icon: <FileText size={20} />
      }
    ],
    tools: [
      {
        title: "Tax Savings Calculator",
        description: "Estimate your potential tax savings from a successful protest.",
        tags: ["Calculator"],
        link: "#",
        icon: <Calculator size={20} />
      },
      {
        title: "Comparable Property Finder",
        description: "Find properties similar to yours with lower assessments.",
        tags: ["Research"],
        link: "#",
        icon: <Building size={20} />
      },
      {
        title: "Market Value Analyzer",
        description: "Analyze recent sales data to determine your property's true market value.",
        tags: ["Analysis"],
        link: "#",
        icon: <FileBarChart size={20} />
      }
    ]
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Property Tax Resources</h1>
            <p className="text-gray-500">
              Educational resources and tools to help with your property tax protest
            </p>
          </div>
          
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
              <TabsTrigger value="laws">Tax Laws</TabsTrigger>
              <TabsTrigger value="tools">Tools & Calculators</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.guides.map((resource, index) => (
                  <ResourceCard key={index} {...resource} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="laws">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.laws.map((resource, index) => (
                  <ResourceCard key={index} {...resource} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.tools.map((resource, index) => (
                  <ResourceCard key={index} {...resource} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ResourcesPage;
