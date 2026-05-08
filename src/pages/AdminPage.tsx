import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Trash2, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useReports, useDismissReport, useRemoveResource } from "@/hooks/use-reports";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const reasonLabels: Record<string, string> = {
  leaked_exam: 'Leaked Exam', wrong_course: 'Wrong Course',
  spam: 'Spam/Low Quality', copyright: 'Copyright', other: 'Other',
};

const AdminPage = () => {
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: reportsList = [], isLoading } = useReports();
  const dismissReport = useDismissReport();
  const removeResource = useRemoveResource();

  const handleRemoveResource = async (reportId: string, resourceId: string) => {
    try {
      await removeResource.mutateAsync({ reportId, resourceId });
      toast({ title: "Resource removed", description: "The resource has been removed from the platform." });
    } catch {
      toast({ title: "Error", description: "Failed to remove resource.", variant: "destructive" });
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await dismissReport.mutateAsync(reportId);
      toast({ title: "Report dismissed" });
    } catch {
      toast({ title: "Error", description: "Failed to dismiss report.", variant: "destructive" });
    }
  };

  if (authLoading) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Link to="/"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const openReports = reportsList.filter(r => r.status === 'open');
  const reviewedReports = reportsList.filter(r => r.status !== 'open');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and moderate reported resources</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-2"><CardContent className="p-6 text-center"><p className="text-4xl font-bold text-chart-1">{openReports.length}</p><p className="text-muted-foreground">Open Reports</p></CardContent></Card>
          <Card className="border-2"><CardContent className="p-6 text-center"><p className="text-4xl font-bold text-chart-2">{reviewedReports.length}</p><p className="text-muted-foreground">Reviewed</p></CardContent></Card>
          <Card className="border-2"><CardContent className="p-6 text-center"><p className="text-4xl font-bold">{reportsList.length}</p><p className="text-muted-foreground">Total Reports</p></CardContent></Card>
        </div>

        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Open Reports {openReports.length > 0 && <Badge variant="destructive">{openReports.length}</Badge>}
            </CardTitle>
            <CardDescription>Reports requiring review and action</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : openReports.length > 0 ? (
              <Table>
                <TableHeader><TableRow className="border-b-2">
                  <TableHead>Resource</TableHead><TableHead>Reason</TableHead><TableHead>Details</TableHead><TableHead>Reported</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {openReports.map((report) => (
                    <TableRow key={report.id} className="border-b-2">
                      <TableCell>
                        <div className="font-medium">{report.resources?.title || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">ID: {report.resource_id}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="border-2">{reasonLabels[report.reason] || report.reason}</Badge></TableCell>
                      <TableCell className="max-w-[200px]"><p className="text-sm text-muted-foreground truncate">{report.details || '—'}</p></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(report.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/resource/${report.resource_id}`}><Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button></Link>
                          <Button size="sm" variant="ghost" onClick={() => handleDismissReport(report.id)}><X className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveResource(report.id, report.resource_id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground"><p>No open reports. All clear! 🎉</p></div>
            )}
          </CardContent>
        </Card>

        {reviewedReports.length > 0 && (
          <Card className="border-2">
            <CardHeader><CardTitle>Reviewed Reports</CardTitle><CardDescription>Previously reviewed reports</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="border-b-2">
                  <TableHead>Resource</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Reported</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {reviewedReports.map((report) => (
                    <TableRow key={report.id} className="border-b-2">
                      <TableCell className="font-medium">{report.resources?.title || report.resource_id}</TableCell>
                      <TableCell><Badge variant="secondary">{reasonLabels[report.reason] || report.reason}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="border-2 capitalize">{report.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(report.created_at), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
