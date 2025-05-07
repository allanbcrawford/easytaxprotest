import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabaseClient';

const UserProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyAddress: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user found');

        // Fetch user profile from users table
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (userError) throw userError;

        // Fetch user's property from properties table
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();

        if (propertyError && propertyError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw propertyError;
        }

        setUserData({
          name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Full Name',
          email: userProfile.email || 'Email Address',
          phone: userProfile.phone || 'Phone Number',
          address: userProfile.address || '',
          propertyAddress: property?.formatted_address || 'Property Address',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSaveChanges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      // Get the user's profile ID
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userProfile) throw new Error('User profile not found');

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.name.split(' ')[0],
          last_name: userData.name.split(' ').slice(1).join(' '),
          phone: userData.phone,
          address: userData.address,
        })
        .eq('id', userProfile.id);

      if (updateError) throw updateError;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancel = async () => {
    // Reset form by fetching fresh data
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      const { data: property } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userProfile.id)
        .single();

      setUserData({
        name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Full Name',
        email: userProfile.email || 'Email Address',
        phone: userProfile.phone || 'Phone Number',
        address: userProfile.address || '',
        propertyAddress: property?.formatted_address || 'Property Address',
      });
    } catch (error) {
      console.error('Error resetting form:', error);
      toast({
        title: "Error",
        description: "Failed to reset form. Please try again.",
        variant: "destructive",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and how others see you on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{userData.name}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex">
                <User className="w-4 h-4 mr-2 mt-2.5 text-gray-500" />
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex">
                <Mail className="w-4 h-4 mr-2 mt-2.5 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  disabled={true}
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <Phone className="w-4 h-4 mr-2 mt-2.5 text-gray-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Mailing Address</Label>
              <div className="flex">
                <MapPin className="w-4 h-4 mr-2 mt-2.5 text-gray-500" />
                <Input
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Mailing Address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Address</Label>
              <div className="flex">
                <Home className="w-4 h-4 mr-2 mt-2.5 text-gray-500" />
                <Input
                  id="propertyAddress"
                  name="propertyAddress"
                  value={userData.propertyAddress}
                  disabled={true}
                  placeholder="Property Address"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
