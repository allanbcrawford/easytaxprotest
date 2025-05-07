import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface Submission {
  id: string;
  created_at: string;
  status: string;
  property_address: string;
  documents_generated: boolean;
  signatures_pending: boolean;
}

const AdminDashboardPage = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Submission[];
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">
              Manage and monitor all property tax protest submissions
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading submissions...</div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submissions?.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {submission.property_address}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Created: {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Status: <span className="font-medium">{submission.status}</span>
                        </p>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${submission.documents_generated ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="text-sm">
                              {submission.documents_generated ? 'Documents Ready' : 'Documents Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${submission.signatures_pending ? 'bg-yellow-500' : 'bg-green-500'}`} />
                            <span className="text-sm">
                              {submission.signatures_pending ? 'Signatures Pending' : 'Signatures Complete'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 