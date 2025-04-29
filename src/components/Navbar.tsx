
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/services" className="text-gray-700 hover:text-primary font-medium">
            Services
          </Link>
          <Link to="/resources" className="text-gray-700 hover:text-primary font-medium">
            Resources
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary font-medium">
            About Us
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium">
            Pricing
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-secondary hover:bg-secondary-light">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-lg absolute w-full">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/resources" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary-light">
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
