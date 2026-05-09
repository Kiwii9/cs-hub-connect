import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import SearchFilters from "@/components/SearchFilters";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useResourcesByMajor } from "@/hooks/use-resources";
import { useLanguage } from "@/contexts/LanguageContext";

const MajorPage = () => {
  const params = useParams<{ college: string; major: string }>();
  const college = decodeURIComponent(params.college ?? "");
  const major = decodeURIComponent(params.major ?? "");
  const { t, isArabic } = useLanguage();
  const { data: allResources = [], isLoading } = useResourcesByMajor(college, major);
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [section, setSection] = useState("");
  const [fileType, setFileType] = useState("");

  const filteredResources = useMemo(() => allResources.filter((resource: any) => {
    const mappedSection = resource.type === "practice" ? "lab_practical" : resource.type === "lab_practical" ? "lab_practical" : "theory";
    if (section && mappedSection !== section) return false;
    if (fileType && resource.file_type !== fileType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches =
        resource.title?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.topic?.toLowerCase().includes(query) ||
        resource.course_label?.toLowerCase().includes(query) ||
        resource.file_type?.toLowerCase().includes(query) ||
        resource.tags?.some((tag: string) => tag.toLowerCase().includes(query));
      if (!matches) return false;
    }
    if (academicYear && resource.academic_year !== academicYear) return false;
    if (semester && resource.semester !== semester) return false;
    if (batchYear && resource.batch_year !== parseInt(batchYear)) return false;
    if (lecturerId && resource.lecturer_id !== lecturerId) return false;
    return true;
  }), [allResources, searchQuery, academicYear, semester, batchYear, lecturerId, section, fileType]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/70">
          <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />{t("Back to search", "العودة للبحث")}</Link>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{college}</p>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{major}</h1>
                <p className="text-muted-foreground max-w-2xl">{t("Search approved resources for this KFU major. Use Section for Theory or Lab/Practical, then File Type for notes, slides, exams, recordings, and more.", "ابحث في المصادر المعتمدة لهذا التخصص. استخدم القسم لاختيار نظري أو عملي، ثم نوع الملف للملاحظات والسلايدات والاختبارات والتسجيلات وغيرها.")}</p>
              </div>
              <Link to="/upload"><Button className="rounded-full border">{t("Add Resource", "إضافة مصدر")}</Button></Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8 space-y-6">
          <div className="rounded-3xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><Search className="h-4 w-4" />{t("Clean search view", "واجهة بحث بسيطة")}</div>
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
          </div>
          <div className="space-y-4">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />) : filteredResources.length > 0 ? filteredResources.map((resource: any) => <ResourceCard key={resource.id} resource={resource} />) : <div className="rounded-3xl border border-dashed border-border py-16 text-center"><p className="text-muted-foreground text-lg mb-2">{t("No resources found", "لا توجد مصادر")}</p><p className="text-sm text-muted-foreground mb-4">{t("Be the first to share something useful for this major.", "كن أول من يشارك مصدرًا مفيدًا لهذا التخصص.")}</p><Link to="/upload"><Button variant="outline" className="rounded-full border">{t("Upload a Resource", "ارفع مصدر")}</Button></Link></div>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MajorPage;
