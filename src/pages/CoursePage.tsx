import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import SearchFilters from "@/components/SearchFilters";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useCourse } from "@/hooks/use-courses";
import { useResourcesByCourse } from "@/hooks/use-resources";
import { useLanguage } from "@/contexts/LanguageContext";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isArabic } = useLanguage();
  const { data: course, isLoading: courseLoading } = useCourse(id || "");
  const { data: allResources = [], isLoading: resourcesLoading } = useResourcesByCourse(id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [section, setSection] = useState("");
  const [fileType, setFileType] = useState("");

  const filteredResources = useMemo(() => allResources
    .filter((resource: any) => {
      const mappedSection = resource.type === "practice" ? "lab_practical" : resource.type === "lab_practical" ? "lab_practical" : "theory";
      if (section && mappedSection !== section) return false;
      if (fileType && resource.file_type !== fileType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesTags = resource.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const matchesTopic = resource.topic?.toLowerCase().includes(query);
        const matchesFileType = resource.file_type?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTags && !matchesTopic && !matchesFileType) return false;
      }
      if (academicYear && resource.academic_year !== academicYear) return false;
      if (semester && resource.semester !== semester) return false;
      if (batchYear && resource.batch_year !== parseInt(batchYear)) return false;
      if (lecturerId && resource.lecturer_id !== lecturerId) return false;
      return true;
    })
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [allResources, searchQuery, academicYear, semester, batchYear, lecturerId, section, fileType]);

  if (courseLoading) return <div className="min-h-screen flex flex-col bg-background"><Header /><main className="flex-1 container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">{t("Loading course...", "جارٍ تحميل المقرر...")}</p></main><Footer /></div>;
  if (!course) return <div className="min-h-screen flex flex-col bg-background"><Header /><main className="flex-1 container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold mb-4">{t("Course not found", "لم يتم العثور على المقرر")}</h1><Link to="/"><Button><ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />{t("Back to Search", "العودة للبحث")}</Button></Link></main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/70">
          <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />{t("Back to Search", "العودة للبحث")}</Link>
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
              <Link to="/upload"><Button className="rounded-full border">{t("Add Resource", "إضافة مصدر")}</Button></Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8 space-y-6">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
            semester={semester}
            setSemester={setSemester}
            batchYear={batchYear}
            setBatchYear={setBatchYear}
            lecturerId={lecturerId}
            setLecturerId={setLecturerId}
            section={section}
            setSection={setSection}
            fileType={fileType}
            setFileType={setFileType}
          />
          <div className="space-y-4">
            {resourcesLoading ? Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />) : filteredResources.length > 0 ? filteredResources.map((resource: any) => <ResourceCard key={resource.id} resource={resource} />) : <div className="rounded-3xl border border-dashed border-border py-16 text-center"><p className="text-muted-foreground text-lg mb-2">{t("No resources found", "لا توجد مصادر")}</p><p className="text-sm text-muted-foreground mb-4">{t("Be the first to share something useful for this course.", "كن أول من يشارك مصدرًا مفيدًا لهذا المقرر.")}</p><Link to="/upload"><Button variant="outline" className="rounded-full border">{t("Upload a Resource", "ارفع مصدر")}</Button></Link></div>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
