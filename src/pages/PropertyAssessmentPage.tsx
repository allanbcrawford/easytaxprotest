
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PropertyAssessmentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get address from location state or default to empty
  const { address = '' } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    address,
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    hasPool: false,
    hasGarage: false,
    needsRepair: false,
    email: '',
    phone: '',
    fullName: '',
    agreeToTerms: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string) => {
    setPropertyData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };
  
  const validateStep1 = () => {
    if (!propertyData.address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your property address",
        variant: "destructive",
      });
      return false;
    }
    
    if (!propertyData.propertyType) {
      toast({
        title: "Property type required",
        description: "Please select your property type",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!propertyData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }
    
    if (!propertyData.email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }
    
    if (!propertyData.agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms of service",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send data to backend here
      console.log('Property data submitted:', propertyData);
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', propertyData.email);
      localStorage.setItem('userName', propertyData.fullName);
      
      toast({
        title: "Property assessment submitted!",
        description: "We'll analyze your property and get back to you soon.",
      });
      
      navigate('/dashboard');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-center mb-2">Property Assessment</h1>
              <p className="text-center text-gray-600">
                Help us analyze your property for the most effective tax protest strategy
              </p>
              
              <div className="flex justify-center mt-6">
                <ol className="flex items-center w-full">
                  <li className={`flex items-center ${step >= 1 ? 'text-secondary' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 1 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      1
                    </span>
                    <span className="ml-2 text-sm">Property Details</span>
                  </li>
                  <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-secondary' : 'bg-gray-200'}`}></div>
                  <li className={`flex items-center ${step >= 2 ? 'text-secondary' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 2 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </span>
                    <span className="ml-2 text-sm">Contact Information</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 ? 'Property Details' : 'Contact Information'}
                </CardTitle>
                <CardDescription>
                  {step === 1 
                    ? 'Tell us about your property to help us with your tax protest' 
                    : 'Provide your contact information to create your account'}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address">Property Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={propertyData.address}
                          onChange={handleChange}
                          placeholder="123 Main St, Austin, TX 78701"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={propertyData.propertyType}
                          onChange={(e) => setPropertyData(prev => ({ ...prev, propertyType: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select property type</option>
                          <option value="Single Family">Single Family Home</option>
                          <option value="Condo">Condominium</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Multi-Family">Multi-Family</option>
                          <option value="Commercial">Commercial Property</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            min="0"
                            value={propertyData.bedrooms}
                            onChange={handleChange}
                            placeholder="3"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            min="0"
                            step="0.5"
                            value={propertyData.bathrooms}
                            onChange={handleChange}
                            placeholder="2"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="squareFeet">Square Feet</Label>
                          <Input
                            id="squareFeet"
                            name="squareFeet"
                            type="number"
                            min="0"
                            value={propertyData.squareFeet}
                            onChange={handleChange}
                            placeholder="1800"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            name="yearBuilt"
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={propertyData.yearBuilt}
                            onChange={handleChange}
                            placeholder="1995"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Property Features</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="hasPool"
                              checked={propertyData.hasPool}
                              onCheckedChange={() => handleCheckboxChange('hasPool')}
                            />
                            <label
                              htmlFor="hasPool"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Swimming Pool
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="hasGarage"
                              checked={propertyData.hasGarage}
                              onCheckedChange={() => handleCheckboxChange('hasGarage')}
                            />
                            <label
                              htmlFor="hasGarage"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Garage
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="needsRepair"
                              checked={propertyData.needsRepair}
                              onCheckedChange={() => handleCheckboxChange('needsRepair')}
                            />
                            <label
                              htmlFor="needsRepair"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Needs Significant Repairs
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={propertyData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={propertyData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={propertyData.phone}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div className="flex items-start space-x-2 pt-4">
                        <Checkbox
                          id="agreeToTerms"
                          checked={propertyData.agreeToTerms}
                          onCheckedChange={() => handleCheckboxChange('agreeToTerms')}
                          required
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="agreeToTerms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                          <p className="text-xs text-gray-500">
                            By checking this box, you agree to our{" "}
                            <a href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {step === 1 ? (
                    <>
                      <Button variant="outline" type="button" onClick={() => navigate('/')}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleNext} className="bg-secondary hover:bg-secondary-light">
                        Next Step
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" type="button" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button type="submit" className="bg-secondary hover:bg-secondary-light" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyAssessmentPage;
