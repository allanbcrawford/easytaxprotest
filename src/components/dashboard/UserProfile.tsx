
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mocked user data - in a real app, this would come from your auth system
  const [userData, setUserData] = useState({
    name: localStorage.getItem('userName') || 'Jane Doe',
    email: localStorage.getItem('userEmail') || 'jane.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Austin, TX 78701',
    propertyAddress: '456 Property Lane, Austin, TX 78702',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSaveChanges = () => {
    // In a real app, you would save to backend here
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form to original values
    setUserData({
      name: localStorage.getItem('userName') || 'Jane Doe',
      email: localStorage.getItem('userEmail') || 'jane.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Austin, TX 78701',
      propertyAddress: '456 Property Lane, Austin, TX 78702',
    });
    setIsEditing(false);
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-xl text-white">
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{userData.name}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isEditing ? (
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <Input 
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <Input 
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Mailing Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <Input 
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <Input 
                        id="propertyAddress"
                        name="propertyAddress"
                        value={userData.propertyAddress}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p>{userData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p>{userData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mailing Address</p>
                      <p>{userData.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Home className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Property Address</p>
                      <p>{userData.propertyAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        {isEditing && (
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
