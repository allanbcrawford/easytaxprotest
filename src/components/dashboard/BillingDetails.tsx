
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, AlertCircle, Clock, Download, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

const BillingDetails: React.FC = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '1234',
      expMonth: 8,
      expYear: 2024,
      brand: 'Mastercard',
      isDefault: false,
    },
  ]);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2025-03-01',
      amount: 49.99,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'INV-002',
      date: '2025-02-01',
      amount: 49.99,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'INV-003',
      date: '2025-01-01',
      amount: 49.99,
      status: 'paid',
      downloadUrl: '#',
    },
  ]);
  
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  
  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    });
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleAddCard = () => {
    // Basic validation
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvc) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to add a new card.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would integrate with Stripe or another payment processor
    const [expMonth, expYear] = newCard.expiry.split('/');
    
    const newPaymentMethod: PaymentMethod = {
      id: `${paymentMethods.length + 1}`,
      type: 'card',
      last4: newCard.number.slice(-4),
      expMonth: parseInt(expMonth),
      expYear: parseInt(`20${expYear}`),
      brand: 'Visa', // This would normally be determined by the payment processor
      isDefault: false,
    };
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    
    toast({
      title: "Card added",
      description: "Your new payment method has been added successfully.",
    });
    
    // Reset form
    setNewCard({
      number: '',
      name: '',
      expiry: '',
      cvc: '',
    });
    
    setIsAddCardOpen(false);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <Tabs defaultValue="subscription" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        <TabsTrigger value="billing-history">Billing History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="subscription">
        <Card>
          <CardHeader>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>Manage your subscription plan and billing cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Premium Plan</h3>
                    <p className="text-sm text-gray-500">Billed monthly at {formatCurrency(49.99)}</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                    Active
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Next billing date:</p>
                    <p className="font-medium">April 1, 2025</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Plan Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Unlimited property assessments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Priority AI tax assistance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Advanced document management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>E-signature for all documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Premium tax resources and guides</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="payment-methods">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className={`p-4 border rounded-lg ${method.isDefault ? 'border-primary/50 bg-primary/5' : 'border-gray-200'} relative`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="text-gray-500" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">{method.brand} •••• {method.last4}</p>
                          {method.isDefault && (
                            <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefaultPaymentMethod(method.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Plus size={16} className="mr-2" />
                    Add New Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Enter your card details to add a new payment method.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="card-number" 
                        name="number"
                        placeholder="1234 5678 9012 3456" 
                        value={newCard.number}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input 
                        id="card-name" 
                        name="name"
                        placeholder="John Smith" 
                        value={newCard.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Expiry Date</Label>
                        <Input 
                          id="card-expiry" 
                          name="expiry"
                          placeholder="MM/YY" 
                          value={newCard.expiry}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card-cvc">CVC</Label>
                        <Input 
                          id="card-cvc" 
                          name="cvc"
                          placeholder="123" 
                          value={newCard.cvc}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCard}>
                      Add Card
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="billing-history">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Invoice</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-4">{invoice.id}</td>
                      <td className="py-4">{formatDate(invoice.date)}</td>
                      <td className="py-4">{formatCurrency(invoice.amount)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize">{invoice.status}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={invoice.downloadUrl} download>
                            <Download size={16} className="mr-1" />
                            <span>PDF</span>
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default BillingDetails;
