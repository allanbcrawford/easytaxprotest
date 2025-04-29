
import React from 'react';
import { Home, Calendar, BarChart, ArrowDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PropertySummaryProps {
  address?: string;
}

const PropertySummary: React.FC<PropertySummaryProps> = ({ 
  address = '123 Main St, Austin, TX 78701' 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Your Property</h3>
            <p className="text-white/90 flex items-center">
              <Home size={16} className="mr-2" />
              {address}
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Edit Details
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Current Assessment</div>
            <div className="flex items-center">
              <div className="mr-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">$425,000</div>
            </div>
            <div className="text-xs text-red-600">12% above market value</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Estimated Market Value</div>
            <div className="flex items-center">
              <div className="mr-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">$380,000</div>
            </div>
            <div className="text-xs text-blue-600">Based on comparable properties</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Potential Savings</div>
            <div className="flex items-center">
              <div className="mr-2 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">$1,350/year</div>
            </div>
            <div className="text-xs text-green-600">Estimated annual savings</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Protest Deadline</div>
            <div className="flex items-center">
              <div className="mr-2 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">May 15, 2025</div>
            </div>
            <div className="text-xs text-orange-600">41 days remaining</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Protest Progress</div>
            <div className="text-sm text-gray-500">2 of 5 steps complete</div>
          </div>
          <Progress value={40} className="h-2 bg-gray-200" />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-secondary mt-1" size={18} />
              <div>
                <div className="font-medium">Protest Deadline</div>
                <div className="text-sm text-gray-500">May 15, 2025</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-secondary mt-1" size={18} />
              <div>
                <div className="font-medium">Hearing Date</div>
                <div className="text-sm text-gray-500">Not scheduled yet</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySummary;
