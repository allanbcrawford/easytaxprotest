import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddress: string;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ isOpen, onClose, initialAddress }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    propertyAddress: initialAddress,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    entityOwned: '',
    entityType: '',
    entityName: '',
    relationshipToEntity: '',
    signerRole: '',
  });
  const [userId, setUserId] = useState(null);
  const [emailPrompt, setEmailPrompt] = useState('');
  const [passwordPrompt, setPasswordPrompt] = useState('');
  const [confirmPasswordPrompt, setConfirmPasswordPrompt] = useState('');
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setPropertyData(prev => ({ ...prev, propertyAddress: initialAddress }));
  }, [initialAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  // Step 1 validation: all property, contact, and entity fields
  const validateStep1 = () => {
    if (!propertyData.propertyAddress.trim()) {
      toast({ title: 'Address required', description: 'Please enter your property address', variant: 'destructive' });
      return false;
    }
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

  // Step 1: Insert user data into custom users table, then property, then entity if present
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    try {
      const newUserId = uuidv4();
      setUserId(newUserId);
      setEmailPrompt(propertyData.email);
      // Insert user personal data only
      const { error: userError } = await supabase.from('users').insert([
        {
          id: newUserId,
          first_name: propertyData.firstName,
          last_name: propertyData.lastName,
          email: propertyData.email,
          phone: propertyData.phone,
        },
      ]);
      if (userError) throw userError;
      // Insert property data
      const { error: propertyError } = await supabase.from('properties').insert([
        {
          user_id: newUserId,
          address_line1: propertyData.propertyAddress,
          formatted_address: propertyData.propertyAddress,
          // Add more fields if you collect them (address_line2, city, state, zip, lat, lng)
        },
      ]);
      if (propertyError) throw propertyError;
      // Insert entity data if present
      if (propertyData.entityOwned === 'yes') {
        const { error: entityError } = await supabase.from('entities').insert([
          {
            user_id: newUserId,
            name: propertyData.entityName,
            type: propertyData.entityType,
            relationship_to_entity: propertyData.relationshipToEntity,
          },
        ]);
        if (entityError) throw entityError;
      }
      setStep(2);
    } catch (err) {
      alert('Failed to save user info.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create auth user and link to custom user
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailPrompt,
        password: passwordPrompt,
        options: { data: { first_name: propertyData.firstName, last_name: propertyData.lastName } }
      });
      if (error && error.message.includes('already registered')) {
        setAuthError('Email already registered. Please use the login button in the header.');
        setLoading(false);
        return;
      } else if (error) {
        throw error;
      }
      // Get auth user id
      const { data: userData } = await supabase.auth.getUser();
      const authUserId = userData.user.id;
      // Update custom user record to link auth user id
      await supabase.from('users').update({ auth_user_id: authUserId }).eq('id', userId);
      setStep(3);
    } catch (err) {
      setAuthError(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Always fetch the latest user before insert
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user || !userData.user.id) {
      toast({ title: 'Not logged in', description: 'Please log in before submitting.', variant: 'destructive' });
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      // Debug log
      console.log('Submitting with user:', userData.user);
      // Now use userData.user.id for the insert
      const { data: propertyRecord, error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            user_id: userData.user.id,
            address_line1: propertyData.propertyAddress,
            formatted_address: propertyData.propertyAddress,
          },
        ])
        .select()
        .single();
      if (propertyError) throw propertyError;

      // Get entity ID if it exists
      let entityId = null;
      if (propertyData.entityOwned === 'yes') {
        const { data: entityData, error: entityError } = await supabase
          .from('entities')
          .select('id')
          .eq('user_id', userData.user.id)
          .eq('name', propertyData.entityName)
          .single();
        
        if (entityError) throw entityError;
        entityId = entityData.id;
      }

      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([
          {
            user_id: userData.user.id,
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
      onClose();
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

  if (!isOpen) return null;

  // Progress bar/steps
  const steps = [
    'Property & Contact Info',
    'Create Account',
    'Success',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Property Assessment</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <ol className="flex items-center w-full">
              {steps.map((label, idx) => (
                <React.Fragment key={label}>
                  <li className={`flex items-center ${step >= idx + 1 ? 'text-secondary' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= idx + 1 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="ml-2 text-sm">{label}</span>
                  </li>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${step >= idx + 2 ? 'bg-secondary' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </div>

          {/* Step 1: All property, contact, and entity fields */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit}>
              <div className="space-y-6">
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
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : 'Next'}</Button>
              </div>
            </form>
          )}

          {/* Step 2: Create Account */}
          {step === 2 && (
            <form onSubmit={handleAuth}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-2">Create Account</h3>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={emailPrompt}
                  onChange={e => setEmailPrompt(e.target.value)}
                  required
                  disabled
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
                {authError && <div className="text-red-600 text-sm">{authError}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Create Account'}
                </Button>
              </div>
              <div className="flex justify-between gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Previous</Button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-4">Success!</div>
              <div className="text-lg">Your information has been saved and your account has been created.</div>
              <Button className="mt-4" onClick={() => { onClose(); navigate('/dashboard'); }}>Go to Dashboard</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal; 