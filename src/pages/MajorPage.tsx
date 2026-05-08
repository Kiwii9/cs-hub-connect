import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Beaker, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import SearchFilters from "@/components/SearchFilters";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useResourcesByMajor } from "@/hooks/use-resources";

const MajorPage = () => {
  const params = useParams<{ college: string; major: string }>();
  const college = decodeURIComponent(params.college ?? "");
  const major = decodeURIComponent(params.major ?? "");
  const { data: allResources = [], isLoading } = useResourcesByMajor(college, major);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  const filteredResources = useMemo(() => allResources.filter((resource: any) => {
    const mappedType = resource.type === "practice" ? "lab_practical" : "theory";
    if (activeTab !== "all" && resource.type !== activeTab && mappedType !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches = resource.title?.toLowerCase().includes(query) || resource.tags?.some((tag: string) => tag.toLowerCase().includes(query)) || resource.topic?.toLowerCase().includes(query) || resource.course_label?.toLowerCase().includes(query);
      if (!matches) return false;
    }
    if (academicYear && resource.academic_year !== academicYear) return false;
    if (semester && resource.semester !== semester) return false;
    if (batchYear && resource.batch_year !== parseInt(batchYear)) return false;
    if (lecturerId && resource.lecturer_id !== lecturerId) return false;
    return true;
  }), [allResources, activeTab, searchQuery, academicYear, semester, batchYear, lecturerId]);

  const tabCounts = useMemo(() => ({
    all: allResources.length,
    theory: allResources.filter((r: any) => ["theory", "notes", "summary", "lecture_link"].includes(r.type)).length,
    lab_practical: allResources.filter((r: any) => ["lab_practical", "practice"].includes(r.type)).length,
  }), [allResources]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/70">
          <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Colleges</Link>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{college}</p>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{major}</h1>
                <p className="text-muted-foreground max-w-2xl">Approved Theory and Lab/Practical resources for this KFU major.</p>
              </div>
              <Link to="/upload"><Button className="rounded-full border">Add Resource</Button></Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="h-auto flex-wrap rounded-full border border-border bg-secondary/70 p-1">
              <TabsTrigger value="all" className="gap-2 rounded-full"><Layers className="w-4 h-4" />All ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="theory" className="gap-2 rounded-full"><BookOpen className="w-4 h-4" />Theory ({tabCounts.theory})</TabsTrigger>
              <TabsTrigger value="lab_practical" className="gap-2 rounded-full"><Beaker className="w-4 h-4" />Lab / Practical ({tabCounts.lab_practical})</TabsTrigger>
            </TabsList>
            <SearchFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} academicYear={academicYear} setAcademicYear={setAcademicYear} semester={semester} setSemester={setSemester} batchYear={batchYear} setBatchYear={setBatchYear} lecturerId={lecturerId} setLecturerId={setLecturerId} />
            <div className="space-y-4">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />) : filteredResources.length > 0 ? filteredResources.map((resource: any) => <ResourceCard key={resource.id} resource={resource} />) : <div className="rounded-3xl border border-dashed border-border py-16 text-center"><p className="text-muted-foreground text-lg mb-2">No resources found</p><p className="text-sm text-muted-foreground mb-4">Be the first to share something useful for this major.</p><Link to="/upload"><Button variant="outline" className="rounded-full border">Upload a Resource</Button></Link></div>}
            </div>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MajorPage;
