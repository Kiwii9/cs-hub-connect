import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, BookMarked, Link as LinkIcon, PenTool, ExternalLink, Download, Calendar, User, GraduationCap, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportDialog from "@/components/ReportDialog";
import { useResource } from "@/hooks/use-resources";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const typeIcons: Record<string, any> = {
  notes: FileText, summary: BookMarked, lecture_link: LinkIcon, practice: PenTool,
};
const typeLabels: Record<string, string> = {
  notes: 'Notes', summary: 'Study Guide', lecture_link: 'Lecture Link', practice: 'Exercises',
};

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resource, isLoading } = useResource(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><Skeleton className="h-64 w-full" /></div>
            <div><Skeleton className="h-48 w-full" /></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Resource not found</h1>
          <Link to="/"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Courses</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const TypeIcon = typeIcons[resource.type] || FileText;
  const course = resource.courses;
  const tags = resource.tags ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {course && (
            <Link to={`/course/${course.id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to {course.name}
            </Link>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2">
                <CardHeader className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-secondary flex items-center justify-center border-2 border-border">
                      <TypeIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 border-2">{typeLabels[resource.type]}</Badge>
                      <h1 className="text-2xl font-bold tracking-tight">{resource.title}</h1>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resource.description && (
                    <div><h3 className="font-bold mb-2">Description</h3><p className="text-muted-foreground">{resource.description}</p></div>
                  )}
                  {resource.text_content && (
                    <div><h3 className="font-bold mb-2">Content</h3><div className="bg-secondary p-4 border-2 border-border whitespace-pre-wrap font-mono text-sm">{resource.text_content}</div></div>
                  )}
                  {tags.length > 0 && (
                    <div><h3 className="font-bold mb-2">Tags</h3><div className="flex flex-wrap gap-2">{tags.map((tag) => (<Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>))}</div></div>
                  )}
                  <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-border">
                    {resource.link_url && (
                      <a href={resource.link_url} target="_blank" rel="noopener noreferrer">
                        <Button className="border-2"><ExternalLink className="w-4 h-4 mr-2" />Open Link</Button>
                      </a>
                    )}
                    {resource.file_url && (
                      <Button className="border-2" onClick={async () => {
                        const { data, error } = await supabase.storage
                          .from('resources')
                          .createSignedUrl(resource.file_url!, 3600);
                        if (data?.signedUrl) {
                          window.open(data.signedUrl, '_blank');
                        }
                      }}><Download className="w-4 h-4 mr-2" />Download File</Button>
                    )}
                    <ReportDialog resourceId={resource.id} resourceTitle={resource.title} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {course && (
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2"><BookOpen className="w-5 h-5 text-muted-foreground" /><span className="font-bold">Course</span></div>
                    <Link to={`/course/${course.id}`} className="hover:underline">
                      <p className="font-mono text-sm">{course.code}</p><p>{course.name}</p>
                    </Link>
                  </CardContent>
                </Card>
              )}

              <Card className="border-2">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Lecturer</p><p className="font-medium">{resource.lecturers?.name || 'Unknown'}</p></div></div>
                  <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Academic Period</p><p className="font-medium">{resource.academic_year} • Semester {resource.semester}</p></div></div>
                  <div className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Batch Year</p><p className="font-medium">{resource.batch_year}</p></div></div>
                  {resource.section && <div className="flex items-center gap-3"><div className="w-5 h-5 flex items-center justify-center text-muted-foreground font-mono text-sm">§</div><div><p className="text-xs text-muted-foreground">Section</p><p className="font-medium">{resource.section}</p></div></div>}
                  {resource.week && <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Week</p><p className="font-medium">Week {resource.week}</p></div></div>}
                  {resource.topic && <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Topic</p><p className="font-medium">{resource.topic}</p></div></div>}
                  <div className="pt-4 border-t-2 border-border"><p className="text-xs text-muted-foreground">Added {format(new Date(resource.created_at), 'MMMM d, yyyy')}</p></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourceDetailPage;
