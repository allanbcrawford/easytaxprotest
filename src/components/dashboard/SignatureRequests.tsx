
import React, { useState } from 'react';
import { FileSignature, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SignatureRequest {
  id: string;
  documentName: string;
  requestDate: string;
  status: 'pending' | 'completed' | 'expired';
  dueDate: string;
}

const SignatureRequests: React.FC = () => {
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([
    {
      id: '1',
      documentName: 'Tax Protest Authorization Form',
      requestDate: '2025-03-25',
      status: 'pending',
      dueDate: '2025-04-15'
    },
    {
      id: '2',
      documentName: 'Property Information Verification',
      requestDate: '2025-03-28',
      status: 'completed',
      dueDate: '2025-04-10'
    },
    {
      id: '3',
      documentName: 'Homestead Exemption Declaration',
      requestDate: '2025-03-15',
      status: 'expired',
      dueDate: '2025-03-30'
    }
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleSign = (request: SignatureRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };
  
  const handleConfirmSignature = () => {
    if (!selectedRequest || !signatureData) return;
    
    // Update signature status
    setSignatureRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'completed' as const } 
          : req
      )
    );
    
    // Reset and close dialog
    setIsDialogOpen(false);
    setSignatureData('');
    
    toast({
      title: 'Document signed',
      description: `${selectedRequest.documentName} has been signed successfully.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Check className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><AlertTriangle className="h-3 w-3 mr-1" /> Expired</Badge>;
      default:
        return null;
    }
  };

  // Simple canvas signature component
  const SignatureCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.lineCap = 'round';
    }, []);
    
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    };
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      setIsDrawing(false);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      setSignatureData(canvas.toDataURL());
    };
    
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData('');
    };
    
    return (
      <div className="space-y-4">
        <div className="border rounded">
          <canvas
            ref={canvasRef}
            width={500}
            height={150}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="w-full touch-none"
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Signature Requests</h2>
        <p className="text-gray-500">
          Documents that require your electronic signature for your property tax protest
        </p>
      </div>
      
      {signatureRequests.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatureRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileSignature className="mr-2 h-4 w-4 text-gray-400" />
                      {request.documentName}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(request.requestDate)}</TableCell>
                  <TableCell>{formatDate(request.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSign(request)}
                      disabled={request.status !== 'pending'}
                    >
                      {request.status === 'pending' ? 'Sign' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <FileSignature className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No signature requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            You'll be notified when documents require your signature
          </p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              Please draw your signature below to sign{' '}
              {selectedRequest?.documentName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <SignatureCanvas />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-secondary hover:bg-secondary-light"
              onClick={handleConfirmSignature}
              disabled={!signatureData}
            >
              Sign Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add missing imports
import { useRef, useEffect } from 'react';

export default SignatureRequests;
