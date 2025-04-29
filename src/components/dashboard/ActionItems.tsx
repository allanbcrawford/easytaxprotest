
import React from 'react';
import { AlertCircle, CheckCircle2, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActionItem {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'urgent';
  action: string;
  icon: React.ReactNode;
}

const ActionItems: React.FC = () => {
  const [actionItems, setActionItems] = React.useState<ActionItem[]>([
    {
      id: 1,
      title: 'Complete Property Information',
      description: 'Add details about your property condition and features',
      status: 'pending',
      action: 'Complete',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 2,
      title: 'Upload Property Photos',
      description: 'Photos help strengthen your appeal case',
      status: 'pending',
      action: 'Upload',
      icon: <Upload className="h-5 w-5" />
    },
    {
      id: 3,
      title: 'Sign Authorization Form',
      description: 'Required to represent you in the protest',
      status: 'urgent',
      action: 'Sign Now',
      icon: <AlertCircle className="h-5 w-5" />
    },
    {
      id: 4,
      title: 'Verify Property Address',
      description: 'We need to confirm your exact property location',
      status: 'completed',
      action: 'View',
      icon: <CheckCircle2 className="h-5 w-5" />
    }
  ]);

  const handleCompleteItem = (id: number) => {
    setActionItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, status: 'completed' as const } 
          : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {actionItems.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <div className="mt-1">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    variant={item.status === 'completed' ? 'outline' : 'default'}
                    size="sm"
                    className={
                      item.status === 'urgent'
                        ? 'bg-red-500 hover:bg-red-600'
                        : item.status === 'completed'
                        ? ''
                        : 'bg-secondary hover:bg-secondary-light'
                    }
                    onClick={() => handleCompleteItem(item.id)}
                    disabled={item.status === 'completed'}
                  >
                    {item.action}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActionItems;
