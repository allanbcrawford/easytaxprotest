
import React from 'react';
import { MapPin, HelpCircle, DollarSign } from 'lucide-react';

const StepsSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-badge">Step 1</div>
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Enter Your Address</h3>
            <p className="text-gray-600">
              Our real-time market data and local expertise will analyze your property, estimate your savings with just your address!
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="step-card">
            <div className="step-badge">Step 2</div>
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Answer Some Questions</h3>
            <p className="text-gray-600">
              Unlike our competitors, our proprietary EasyTax Method® takes your individual property's characteristics into account to maximize your savings.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="step-card">
            <div className="step-badge">Step 3</div>
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <DollarSign className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Save On Your Taxes</h3>
            <p className="text-gray-600">
              If we do not save you money on your property taxes, there is no fee for our services. That's our commitment!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsSection;
