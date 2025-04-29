
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CtaSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-hero-pattern rounded-xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Sign Up Today!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Sign Up In 30 Seconds!
          </p>
          <Button asChild className="bg-white text-primary hover:bg-gray-100">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
