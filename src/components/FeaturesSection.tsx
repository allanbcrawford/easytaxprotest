
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Only Pay If You <span className="text-secondary">Save</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Leave the hard work to us with our Savings-Or-Free Guarantee
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-full p-1">
              <Check className="text-secondary h-5 w-5" />
            </div>
            <span className="text-gray-700 font-medium">Bespoke Tax Appeals</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-full p-1">
              <Check className="text-secondary h-5 w-5" />
            </div>
            <span className="text-gray-700 font-medium">20 Years Of Experience</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-full p-1">
              <Check className="text-secondary h-5 w-5" />
            </div>
            <span className="text-gray-700 font-medium">Maximized Savings</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 md:p-12 shadow-md">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3">120,220,302</div>
              <div className="text-xl text-secondary font-medium mb-4">Total Assessment Reductions</div>
              <p className="text-gray-600 mb-6">
                With 20 years of experience in maximizing property tax savings for residential and commercial 
                properties alike, EasyTaxProtest creates custom-tailored tax appeals to get the largest 
                assessment reduction possible.
              </p>
              <Button asChild className="bg-secondary hover:bg-secondary-light">
                <Link to="/signup">Start Saving Today</Link>
              </Button>
            </div>
            <div className="flex-1">
              <img 
                src="/lovable-uploads/5b6564b2-1255-4ffe-b061-2d6775a6890a.png" 
                alt="User dashboard interface showing property assessment details" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Tailor-Made Tax Appeals
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Other firms lump your property into a portfolio and attempt to get a group decrease. 
            Our tailor-made tax appeal method keeps your property's custom characteristics in mind.
          </p>
          <Button asChild className="bg-primary hover:bg-primary-light">
            <Link to="/how-it-works">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
