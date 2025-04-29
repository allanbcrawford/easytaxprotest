
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    updates: true,
    offers: false,
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePassword = () => {
    if (password.new !== password.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (password.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would save to backend here
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });

    // Reset form
    setPassword({
      current: '',
      new: '',
      confirm: '',
    });
  };

  const handleSaveNotifications = () => {
    // In a real app, you would save to backend here
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="notifications">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <p className="text-sm text-gray-500">
                  Configure how you want to receive notifications and updates.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications and updates via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive text messages for important updates
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Show desktop notifications when browser is open
                    </p>
                  </div>
                  <Switch 
                    id="browser-notifications" 
                    checked={notifications.browser}
                    onCheckedChange={() => handleNotificationChange('browser')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="update-notifications">Product Updates</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications about new features and improvements
                    </p>
                  </div>
                  <Switch 
                    id="update-notifications" 
                    checked={notifications.updates}
                    onCheckedChange={() => handleNotificationChange('updates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offer-notifications">Special Offers</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications about promotions and discounts
                    </p>
                  </div>
                  <Switch 
                    id="offer-notifications" 
                    checked={notifications.offers}
                    onCheckedChange={() => handleNotificationChange('offers')}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="password">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Update your password to maintain account security.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    name="current"
                    type="password" 
                    value={password.current}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    name="new"
                    type="password" 
                    value={password.new}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    name="confirm"
                    type="password" 
                    value={password.confirm}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              
              <Button onClick={handleSavePassword}>Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="privacy">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-gray-500">
                  Manage your data and privacy preferences.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-gray-500">
                      Allow us to collect usage data to improve our services
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-gray-500">
                    Request a copy of all your data stored in our system
                  </p>
                  <Button variant="outline">Request Data Export</Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Account Deletion</h4>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserSettings;
