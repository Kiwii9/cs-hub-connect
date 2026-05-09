import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap, Shield, Sparkles, Coffee, Globe2, BookOpen, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useResourcesByMajor } from "@/hooks/use-resources";
import { getMajorsForCollege, kfuCollegeMajors, kfuColleges } from "@/data/kfuCatalog";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t, isArabic } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(kfuColleges[0] ?? "");
  const [selectedMajor, setSelectedMajor] = useState("");
  const majors = useMemo(() => getMajorsForCollege(selectedCollege), [selectedCollege]);
  const activeMajor = selectedMajor || majors[0] || "";
  const { data: resources = [], isLoading } = useResourcesByMajor(selectedCollege, activeMajor);

  const filteredResources = resources.filter((resource: any) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      resource.title?.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query) ||
      resource.topic?.toLowerCase().includes(query) ||
      resource.course_label?.toLowerCase().includes(query) ||
      resource.file_type?.toLowerCase().includes(query) ||
      resource.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  const totalMajors = Object.values(kfuCollegeMajors).reduce((count, items) => count + items.length, 0);

  const handleCollegeSelect = (college: string) => {
    setSelectedCollege(college);
    setSelectedMajor("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--accent))_0%,transparent_35%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--background)))]">
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(hsl(var(--foreground))_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className={isArabic ? "text-center lg:text-right" : "text-center lg:text-left"}>
                <Badge variant="outline" className="mb-5 border-primary/20 bg-background/70 px-4 py-2 text-sm backdrop-blur">
                  <Sparkles className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />
                  {t("Built by KFU students, for KFU students", "صُنع بواسطة طلاب KFU ولطلاب KFU")}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Marja&apos; | مرجع</h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  {t(
                    "A free-of-charge, community-driven student resource platform for King Faisal University students. Browse by college and major, search approved materials, and share useful explanations, notes, slides, recorded lectures, revisions, and past-exam compilations.",
                    "منصة موارد طلابية مجانية بالكامل ويقودها المجتمع لطلاب جامعة الملك فيصل. تصفح حسب الكلية والتخصص، وابحث في المصادر المعتمدة، وشارك الشروحات والملاحظات والسلايدات والمحاضرات المسجلة والمراجعات وتجميعات الاختبارات السابقة."
                  )}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><GraduationCap className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{kfuColleges.length} {t("colleges", "كلية")}</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><BookOpen className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{totalMajors} {t("majors", "تخصص")}</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Shield className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{t("Approved before public", "اعتماد قبل النشر")}</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Globe2 className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{t("English + Arabic", "العربية + الإنجليزية")}</Badge>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link to="/upload"><Button size="lg" className="rounded-full"><Upload className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{t("Upload a resource", "ارفع مصدر")}</Button></Link>
                  <a href="https://ko-fi.com/kiwii9" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="rounded-full border"><Coffee className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />{t("Support the creator", "ادعم المطور")}</Button>
                  </a>
                </div>
              </div>

              <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur">
                <div className="mb-5">
                  <p className="text-sm font-medium text-primary">{t("Global Search", "بحث عام")}</p>
                  <h2 className="text-2xl font-bold">{t("Find student resources faster", "اعثر على مصادر الطلاب أسرع")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("Select a college and major, then search by title, topic, tag, course name, or file type.", "اختر الكلية والتخصص، ثم ابحث بالعنوان أو الموضوع أو الوسم أو اسم المقرر أو نوع الملف.")}
                  </p>
                </div>
                <div className="relative">
                  <Search className={`${isArabic ? "right-4" : "left-4"} absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground`} />
                  <Input
                    placeholder={t("Search resources, notes, slides, exams...", "ابحث في المصادر، الملاحظات، السلايدات، الاختبارات...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`h-14 rounded-2xl border border-border bg-background ${isArabic ? "pr-12 text-right" : "pl-12"} text-base shadow-sm`}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Select value={selectedCollege} onValueChange={handleCollegeSelect}>
                    <SelectTrigger className="rounded-2xl border"><SelectValue placeholder={t("Select college", "اختر الكلية")} /></SelectTrigger>
                    <SelectContent className="max-h-72 border bg-popover">
                      {kfuColleges.map((college) => <SelectItem key={college} value={college}>{college}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={activeMajor} onValueChange={setSelectedMajor}>
                    <SelectTrigger className="rounded-2xl border"><SelectValue placeholder={t("Select major", "اختر التخصص")} /></SelectTrigger>
                    <SelectContent className="max-h-72 border bg-popover">
                      {majors.map((major) => <SelectItem key={major} value={major}>{major}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-accent/30">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-sm"><Shield className={`${isArabic ? "ml-2" : "mr-2"} inline h-4 w-4`} /><strong>{t("Academic Integrity:", "النزاهة الأكاديمية:")}</strong> {t("No leaked exams or cheating materials allowed. Everything is free and moderated before going public.", "لا يُسمح بتسريب الاختبارات أو مواد الغش. كل شيء مجاني ويتم مراجعته قبل النشر.")} <Link to="/disclaimer" className="underline hover:text-primary">{t("Learn more", "اعرف أكثر")}</Link></p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl border">
              <CardHeader><CardTitle>{t("Choose College", "اختر الكلية")}</CardTitle><CardDescription>{t("CCSIT is included with all KFU colleges.", "تمت إضافة كلية علوم الحاسب وتقنية المعلومات مع جميع كليات KFU.")}</CardDescription></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {kfuColleges.map((college) => (
                  <Button key={college} variant={selectedCollege === college ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => handleCollegeSelect(college)}>{college}</Button>
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-3xl border">
              <CardHeader><CardTitle>{t("Choose Major", "اختر التخصص")}</CardTitle><CardDescription>{t("Resources below update based on the selected major.", "المصادر في الأسفل تتغير حسب التخصص المختار.")}</CardDescription></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {majors.map((major) => (
                  <Button key={major} variant={activeMajor === major ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setSelectedMajor(major)}>{major}</Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{selectedCollege}</p>
              <h2 className="text-2xl font-bold">{activeMajor || t("Select a major", "اختر تخصصًا")}</h2>
            </div>
            {activeMajor && <Link to={`/major/${encodeURIComponent(selectedCollege)}/${encodeURIComponent(activeMajor)}`}><Button variant="outline" className="rounded-full border">{t("Open major page", "افتح صفحة التخصص")}</Button></Link>}
          </div>

          <div className="space-y-4">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />) : filteredResources.length > 0 ? filteredResources.map((resource: any) => <ResourceCard key={resource.id} resource={resource} />) : (
              <div className="rounded-3xl border border-dashed border-border py-16 text-center">
                <p className="text-muted-foreground text-lg mb-2">{t("No approved resources found", "لا توجد مصادر معتمدة بعد")}</p>
                <p className="text-sm text-muted-foreground mb-4">{t("Be the first to share something helpful for this major.", "كن أول من يشارك مصدرًا مفيدًا لهذا التخصص.")}</p>
                <Link to="/upload"><Button variant="outline" className="rounded-full border">{t("Upload a Resource", "ارفع مصدر")}</Button></Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
