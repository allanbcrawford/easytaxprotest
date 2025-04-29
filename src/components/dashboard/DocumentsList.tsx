
import React, { useState } from 'react';
import { File, FilePlus, Download, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Property Deed.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2025-03-15'
    },
    {
      id: '2',
      name: 'Tax Assessment Notice.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadedAt: '2025-03-20'
    },
    {
      id: '3',
      name: 'Property Photos.zip',
      type: 'ZIP',
      size: '15.7 MB',
      uploadedAt: '2025-03-25'
    },
    {
      id: '4',
      name: 'Signed Authorization.pdf',
      type: 'PDF',
      size: '0.5 MB',
      uploadedAt: '2025-04-01'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadFile) return;
    
    // Simulate file upload
    const newDocument: Document = {
      id: String(documents.length + 1),
      name: uploadFile.name,
      type: uploadFile.name.split('.').pop()?.toUpperCase() || 'Unknown',
      size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploadDialogOpen(false);
    setUploadFile(null);
    
    toast({
      title: 'Document uploaded',
      description: `${uploadFile.name} has been successfully uploaded.`,
    });
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    
    toast({
      title: 'Document deleted',
      description: 'The document has been removed from your account.',
    });
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary-light">
              <FilePlus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document to your property tax protest case.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select file</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
              </div>
              {uploadFile && (
                <div className="text-sm text-gray-500">
                  Selected: {uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!uploadFile}
                className="bg-secondary hover:bg-secondary-light"
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredDocuments.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center">
                    <File className="mr-2 h-4 w-4 text-gray-400" />
                    {doc.name}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? `No documents matching "${searchTerm}"`
              : 'Get started by uploading your first document'}
          </p>
          {!searchTerm && (
            <Button 
              className="mt-6 bg-secondary hover:bg-secondary-light"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <FilePlus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
