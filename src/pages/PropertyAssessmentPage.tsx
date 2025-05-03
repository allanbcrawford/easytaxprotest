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
import { supabase } from '../supabaseClient';

const PropertyAssessmentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Accept structured address from location.state
  const {
    property_address,
    address_line1,
    formatted_address,
  } = location.state || {};
  
  const initialAddress = property_address || address_line1 || formatted_address || '';
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    propertyAddress: initialAddress,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    entityOwned: '', // 'yes' or 'no'
    entityType: '', // LLC, Corporation, Partnership, Estate, Trust, Other
    entityName: '',
    relationshipToEntity: '',
    signerRole: '', // homeowner, property manager, authorized individual
  });
  const [authUser, setAuthUser] = useState<any>(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailPrompt, setEmailPrompt] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState('');
  const [confirmPasswordPrompt, setConfirmPasswordPrompt] = useState('');
  
  React.useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setAuthUser(data.user);
    });
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string) => {
    setPropertyData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };
  
  const validateStep = () => {
    if (!propertyData.firstName.trim() || !propertyData.lastName.trim()) {
      toast({ title: 'Name required', description: 'Please enter your first and last name', variant: 'destructive' });
      return false;
    }
    if (!propertyData.email.trim()) {
      toast({ title: 'Email required', description: 'Please enter your email address', variant: 'destructive' });
      return false;
    }
    if (!propertyData.signerRole) {
      toast({ title: 'Signer role required', description: 'Please confirm your role', variant: 'destructive' });
      return false;
    }
    if (propertyData.entityOwned === 'yes') {
      if (!propertyData.entityType || !propertyData.entityName.trim() || !propertyData.relationshipToEntity.trim()) {
        toast({ title: 'Entity info required', description: 'Please complete all entity fields', variant: 'destructive' });
        return false;
      }
    }
    return true;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep()) {
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
  
  // Handle email prompt for unauthenticated users
  const handleEmailPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      // Try sign up first
      const { data, error } = await supabase.auth.signUp({
        email: emailPrompt,
        password: passwordPrompt,
        options: { data: { first_name: propertyData.firstName, last_name: propertyData.lastName } }
      });
      if (error && error.message.includes('already registered')) {
        // If already registered, try sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailPrompt,
          password: passwordPrompt,
        });
        if (signInError) throw signInError;
      } else if (error) {
        throw error;
      }
      setShowEmailPrompt(false);
      // Get user and continue
      const { data: userData } = await supabase.auth.getUser();
      setAuthUser(userData.user);
      toast({ title: 'Logged in!', description: 'You are now logged in.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Auth failed', description: err.message || 'Could not log in.', variant: 'destructive' });
    } finally {
      setEmailLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (!authUser) {
      setShowEmailPrompt(true);
      setEmailPrompt(propertyData.email);
      return;
    }
    setLoading(true);
    try {
      // First, create or get the property record
      const { data: propertyRecord, error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            user_id: authUser.id,
            address_line1: propertyData.propertyAddress,
            formatted_address: propertyData.propertyAddress,
          },
        ])
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Create entity record if needed
      let entityId = null;
      if (propertyData.entityOwned === 'yes') {
        const { data: entityRecord, error: entityError } = await supabase
          .from('entities')
          .insert([
            {
              user_id: authUser.id,
              name: propertyData.entityName,
              type: propertyData.entityType,
              relationship_to_entity: propertyData.relationshipToEntity,
            },
          ])
          .select()
          .single();
        
        if (entityError) throw entityError;
        entityId = entityRecord.id;
      }

      // Then create the submission record
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([
          {
            user_id: authUser.id,
            property_id: propertyRecord.id,
            entity_id: entityId,
            property_address: propertyData.propertyAddress,
            first_name: propertyData.firstName,
            last_name: propertyData.lastName,
            email: propertyData.email,
            phone: propertyData.phone,
            entity_owned: propertyData.entityOwned,
            entity_type: propertyData.entityType,
            entity_name: propertyData.entityName,
            relationship_to_entity: propertyData.relationshipToEntity,
            signer_role: propertyData.signerRole,
            status: 'new',
          },
        ]);

      if (submissionError) throw submissionError;

      toast({ 
        title: 'Form submitted!', 
        description: 'Thank you for your submission. We will review your property assessment request shortly.' 
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Submission error:', err);
      toast({ 
        title: 'Submission failed', 
        description: err.message || 'There was a problem submitting your form. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
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
            
            {/* Email prompt modal for unauthenticated users */}
            {showEmailPrompt && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Sign Up or Log In</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setEmailLoading(true);
                    try {
                      // Try sign up first
                      const { data, error } = await supabase.auth.signUp({
                        email: emailPrompt,
                        password: passwordPrompt,
                        options: { data: { first_name: propertyData.firstName, last_name: propertyData.lastName } }
                      });
                      if (error && error.message.includes('already registered')) {
                        // If already registered, try sign in
                        const { error: signInError } = await supabase.auth.signInWithPassword({
                          email: emailPrompt,
                          password: passwordPrompt,
                        });
                        if (signInError) throw signInError;
                      } else if (error) {
                        throw error;
                      }
                      setShowEmailPrompt(false);
                      // Get user and continue
                      const { data: userData } = await supabase.auth.getUser();
                      setAuthUser(userData.user);
                      toast({ title: 'Logged in!', description: 'You are now logged in.' });
                      navigate('/dashboard');
                    } catch (err: any) {
                      toast({ title: 'Auth failed', description: err.message || 'Could not log in.', variant: 'destructive' });
                    } finally {
                      setEmailLoading(false);
                    }
                  }} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={emailPrompt}
                      onChange={e => setEmailPrompt(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={passwordPrompt}
                      onChange={e => setPasswordPrompt(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPasswordPrompt}
                      onChange={e => setConfirmPasswordPrompt(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full" disabled={emailLoading}>
                      {emailLoading ? 'Processing...' : 'Continue'}
                    </Button>
                  </form>
                  <Button variant="outline" className="w-full mt-2" onClick={() => setShowEmailPrompt(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Entity Information</CardTitle>
                <CardDescription>Fill out your contact and (if applicable) entity information below.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input id="propertyAddress" name="propertyAddress" value={propertyData.propertyAddress} onChange={handleChange} placeholder="123 Main St, Austin, TX 78701" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={propertyData.firstName} onChange={handleChange} placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={propertyData.lastName} onChange={handleChange} placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={propertyData.email} onChange={handleChange} placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={propertyData.phone} onChange={handleChange} placeholder="(123) 456-7890" />
                  </div>
                  <div className="space-y-2">
                    <Label>Is this property owned by a trust, LLC, or other entity?</Label>
                    <div className="flex gap-4">
                      <label><input type="radio" name="entityOwned" value="yes" checked={propertyData.entityOwned === 'yes'} onChange={handleChange} /> Yes</label>
                      <label><input type="radio" name="entityOwned" value="no" checked={propertyData.entityOwned === 'no'} onChange={handleChange} /> No</label>
                    </div>
                  </div>
                  {propertyData.entityOwned === 'yes' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="entityType">Entity Type</Label>
                        <select id="entityType" name="entityType" value={propertyData.entityType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                          <option value="">Select entity type</option>
                          <option value="LLC">LLC</option>
                          <option value="Corporation">Corporation</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Estate">Estate</option>
                          <option value="Trust">Trust</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entityName">Entity Name</Label>
                        <Input id="entityName" name="entityName" value={propertyData.entityName} onChange={handleChange} placeholder="Entity Name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationshipToEntity">Relationship to Entity</Label>
                        <Input id="relationshipToEntity" name="relationshipToEntity" value={propertyData.relationshipToEntity} onChange={handleChange} placeholder="e.g. Trustee, Member, Executor" required />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signerRole">Please confirm that you are signing this form as:</Label>
                    <select id="signerRole" name="signerRole" value={propertyData.signerRole} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                      <option value="">Select role</option>
                      <option value="homeowner">Homeowner</option>
                      <option value="property manager">Property Manager</option>
                      <option value="authorized individual">Authorized Individual</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="bg-secondary hover:bg-secondary-light" disabled={loading}>
                    {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>) : 'Submit'}
                  </Button>
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
