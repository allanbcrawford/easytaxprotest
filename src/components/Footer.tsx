
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-gray-200">
              We help homeowners reduce their property tax bills with our AI-powered protest assistance.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-200 hover:text-white">About Us</Link></li>
              <li><Link to="/pricing" className="text-gray-200 hover:text-white">Pricing</Link></li>
              <li><Link to="/services" className="text-gray-200 hover:text-white">Services</Link></li>
              <li><Link to="/contact" className="text-gray-200 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/resources/guides" className="text-gray-200 hover:text-white">Tax Guides</Link></li>
              <li><Link to="/resources/blog" className="text-gray-200 hover:text-white">Blog</Link></li>
              <li><Link to="/resources/faqs" className="text-gray-200 hover:text-white">FAQs</Link></li>
              <li><Link to="/resources/case-studies" className="text-gray-200 hover:text-white">Case Studies</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-200 mb-4">Get the latest updates and tips for property tax savings.</p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Button className="bg-secondary hover:bg-secondary-light whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Easy Tax Protest. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-gray-300 hover:text-white">Terms & Conditions</Link>
            <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
