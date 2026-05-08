import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Beaker, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import SearchFilters from "@/components/SearchFilters";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useCourse } from "@/hooks/use-courses";
import { useResourcesByCourse } from "@/hooks/use-resources";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading: courseLoading } = useCourse(id || "");
  const { data: allResources = [], isLoading: resourcesLoading } = useResourcesByCourse(id || "");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  const filteredResources = useMemo(() => allResources
    .filter((resource) => {
      const mappedType = resource.type === "practice" ? "lab_practical" : "theory";
      if (activeTab !== "all" && resource.type !== activeTab && mappedType !== activeTab) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesTags = resource.tags?.some(tag => tag.toLowerCase().includes(query));
        const matchesTopic = resource.topic?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTags && !matchesTopic) return false;
      }
      if (academicYear && resource.academic_year !== academicYear) return false;
      if (semester && resource.semester !== semester) return false;
      if (batchYear && resource.batch_year !== parseInt(batchYear)) return false;
      if (lecturerId && resource.lecturer_id !== lecturerId) return false;
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [allResources, activeTab, searchQuery, academicYear, semester, batchYear, lecturerId]);

  const tabCounts = useMemo(() => ({
    all: allResources.length,
    theory: allResources.filter((r: any) => ["theory", "notes", "summary", "lecture_link"].includes(r.type)).length,
    lab_practical: allResources.filter((r: any) => ["lab_practical", "practice"].includes(r.type)).length,
  }), [allResources]);

  if (courseLoading) return <div className="min-h-screen flex flex-col bg-background"><Header /><main className="flex-1 container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Loading course...</p></main><Footer /></div>;
  if (!course) return <div className="min-h-screen flex flex-col bg-background"><Header /><main className="flex-1 container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold mb-4">Course not found</h1><Link to="/"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Colleges</Button></Link></main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/70">
          <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Colleges</Link>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-1">{course.code}</p>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{course.name}</h1>
                <div className="mb-3 flex flex-wrap gap-2">
                  {course.college && <Badge variant="secondary" className="rounded-full">{course.college}</Badge>}
                  {course.major && <Badge variant="outline" className="rounded-full">{course.major}</Badge>}
                </div>
                {course.description && <p className="text-muted-foreground max-w-2xl">{course.description}</p>}
              </div>
              <Link to="/upload"><Button className="rounded-full border">Add Resource</Button></Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="h-auto flex-wrap rounded-full border border-border bg-secondary/70 p-1">
              <TabsTrigger value="all" className="gap-2 rounded-full data-[state=active]:shadow-sm"><Layers className="w-4 h-4" />All Materials ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="theory" className="gap-2 rounded-full data-[state=active]:shadow-sm"><BookOpen className="w-4 h-4" />Theory ({tabCounts.theory})</TabsTrigger>
              <TabsTrigger value="lab_practical" className="gap-2 rounded-full data-[state=active]:shadow-sm"><Beaker className="w-4 h-4" />Lab / Practical ({tabCounts.lab_practical})</TabsTrigger>
            </TabsList>
            <SearchFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} academicYear={academicYear} setAcademicYear={setAcademicYear} semester={semester} setSemester={setSemester} batchYear={batchYear} setBatchYear={setBatchYear} lecturerId={lecturerId} setLecturerId={setLecturerId} />
            <div className="space-y-4">
              {resourcesLoading ? Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />) : filteredResources.length > 0 ? filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />) : <div className="rounded-3xl border border-dashed border-border py-16 text-center"><p className="text-muted-foreground text-lg mb-2">No resources found</p><p className="text-sm text-muted-foreground mb-4">Be the first to share something useful for this course.</p><Link to="/upload"><Button variant="outline" className="rounded-full border">Upload a Resource</Button></Link></div>}
            </div>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
