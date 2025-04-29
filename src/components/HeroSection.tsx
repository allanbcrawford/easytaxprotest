
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      navigate('/property-assessment', { state: { address } });
    }
  };

  return (
    <div className="bg-hero-pattern py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Save On Your Property Taxes With Our <span className="text-secondary">Savings-Or-Free</span> Guarantee
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Quick, Easy, And Risk-Free — Sign Up In Under A Minute
        </p>
        
        <form 
          onSubmit={handleEstimate}
          className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-2 flex items-center"
        >
          <div className="flex-1 flex items-center px-3">
            <MapPin className="text-gray-400 mr-2" size={20} />
            <Input 
              type="text" 
              placeholder="Enter your property address" 
              className="border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            className="bg-secondary hover:bg-secondary-light text-white font-medium px-5 py-2"
          >
            Estimate Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
