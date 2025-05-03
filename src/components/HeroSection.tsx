import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GooglePlacesAutocompleteInput from './GooglePlacesAutocompleteInput';
import PropertyDetailsModal from './PropertyDetailsModal';

const HeroSection: React.FC = () => {
  const [address, setAddress] = useState('');
  const [structuredAddress, setStructuredAddress] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Debug state changes
  useEffect(() => {
    console.log('Address updated:', address);
    console.log('Structured address updated:', structuredAddress);
  }, [address, structuredAddress]);

  const handlePlaceSelect = (place: any) => {
    console.log('Place selected in HeroSection:', place);
    if (place.formatted_address) {
      setAddress(place.formatted_address);
      setStructuredAddress({
        address_line1: place.formatted_address,
        lat: typeof place.geometry?.location?.lat === 'function' ? place.geometry.location.lat() : place.geometry?.location?.lat,
        lng: typeof place.geometry?.location?.lng === 'function' ? place.geometry.location.lng() : place.geometry?.location?.lng,
        formatted_address: place.formatted_address,
      });
    }
  };

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { address, structuredAddress });
    if (address && structuredAddress) {
      setShowModal(true);
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
          className="max-w-xl mx-auto bg-white rounded-lg p-2 flex items-center gap-2"
        >
          <div className="flex-1 flex items-center px-3 min-w-0">
            <MapPin className="text-gray-400 mr-2 flex-shrink-0" size={20} />
            <GooglePlacesAutocompleteInput onPlaceSelect={handlePlaceSelect} />
          </div>
          <Button 
            type="submit"
            className="bg-secondary hover:bg-secondary-light text-white font-medium px-5 py-2 flex-shrink-0"
            disabled={!address}
          >
            Estimate Now
          </Button>
        </form>
      </div>

      <PropertyDetailsModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialAddress={address}
      />
    </div>
  );
};

export default HeroSection;
