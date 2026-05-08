import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Trash2, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useMyResources, useDeleteResource } from "@/hooks/use-resources";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, string> = {
  theory: "Theory", lab_practical: "Lab / Practical", notes: "Theory", summary: "Theory", lecture_link: "Theory", practice: "Lab / Practical",
};

const statusColors: Record<string, string> = {
  pending: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  active: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  reported: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  removed: "bg-destructive/10 text-destructive border-destructive/30",
};

const MyUploadsPage = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: resources = [], isLoading } = useMyResources(user?.id ?? "");
  const deleteResource = useDeleteResource();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteResource.mutateAsync(id);
      toast({ title: "Resource deleted", description: "Your resource has been removed." });
    } catch {
      toast({ title: "Error", description: "Failed to delete resource.", variant: "destructive" });
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-secondary border-2 border-border flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sign in to View Uploads</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to see your uploads.</p>
          <Link to="/login"><Button size="lg" className="border-2">Sign In</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Uploads</h1>
            <p className="text-muted-foreground">Manage your submitted resources. Pending items become public after admin approval.</p>
          </div>
          <Link to="/upload">
            <Button className="border-2">
              <Upload className="w-4 h-4 mr-2" />Upload New
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : resources.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-secondary border-2 border-border flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">No uploads yet</h2>
              <p className="text-muted-foreground mb-6">Start sharing resources with your fellow students!</p>
              <Link to="/upload"><Button className="border-2"><Upload className="w-4 h-4 mr-2" />Upload Your First Resource</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="border-2">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold truncate">{resource.title}</h3>
                        <Badge variant="outline" className="border-2 text-xs">{typeLabels[resource.type] || resource.type}</Badge>
                        <Badge variant="outline" className={`border text-xs ${statusColors[resource.status] || ""}`}>
                          {resource.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {resource.college || resource.courses?.code} · {resource.major || resource.courses?.name} · {resource.academic_year} · Sem {resource.semester}
                        {resource.course_label && ` · ${resource.course_label}`}
                        {resource.lecturers?.name && ` · ${resource.lecturers.name}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded {format(new Date(resource.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/resource/${resource.id}`}>
                        <Button size="sm" variant="outline" className="border-2">
                          <Eye className="w-4 h-4 mr-1" />View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(resource.id)}
                        disabled={deleteResource.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyUploadsPage;
