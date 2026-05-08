import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, GraduationCap, Users, Shield, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/SkeletonCard";
import { useCourses } from "@/hooks/use-courses";
import { kfuColleges } from "@/data/kfuCatalog";
import kfuLogo from "@/assets/kfu-logo.png";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const { data: courses = [], isLoading } = useCourses();

  const courseColleges = useMemo(() => {
    const colleges = courses.map((course) => course.college).filter((college): college is string => Boolean(college));
    return Array.from(new Set(colleges));
  }, [courses]);

  const visibleColleges = courseColleges.length > 0 ? courseColleges : [...kfuColleges];

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      course.name.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.college?.toLowerCase().includes(query) ||
      course.major?.toLowerCase().includes(query);
    const matchesCollege = selectedCollege === "all" || course.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--accent))_0%,transparent_35%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--background)))]">
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(hsl(var(--foreground))_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="text-center lg:text-left">
                <Badge variant="outline" className="mb-5 border-primary/20 bg-background/70 px-4 py-2 text-sm backdrop-blur">
                  <Sparkles className="mr-2 h-4 w-4" />Built by KFU students, for KFU students
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">KFU Study Hub</h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  A polished resource-sharing platform for every King Faisal University major: notes, lecture links, and helpful study material in one trusted place.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><GraduationCap className="mr-2 h-4 w-4" />All KFU majors</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Users className="mr-2 h-4 w-4" />Community-reviewed</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Shield className="mr-2 h-4 w-4" />No leaked exams</Badge>
                </div>
              </div>
              <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur">
                <img src={kfuLogo} alt="King Faisal University" className="mx-auto mb-5 h-20" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">{visibleColleges.length}</p><p className="text-xs text-muted-foreground">Colleges</p></div>
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">{courses.length}</p><p className="text-xs text-muted-foreground">Courses</p></div>
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">KFU</p><p className="text-xs text-muted-foreground">Email gated</p></div>
                </div>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by course, college, major, or topic..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 rounded-2xl border border-border bg-background pl-12 text-base shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-border bg-accent/30">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-sm"><Shield className="mr-2 inline h-4 w-4" /><strong>Academic Integrity:</strong> No leaked exams or cheating materials allowed. Share only student-made notes, legitimate links, and educational explanations. <Link to="/disclaimer" className="underline hover:text-primary">Learn more</Link></p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div><h2 className="text-3xl font-bold tracking-tight">KFU Courses</h2><p className="text-muted-foreground">{isLoading ? "Loading..." : `${filteredCourses.length} course${filteredCourses.length !== 1 ? "s" : ""} available`} • Structured for all colleges and majors.</p></div>
            <div className="flex max-w-3xl flex-wrap gap-2">
              <Button variant={selectedCollege === "all" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setSelectedCollege("all")}>All</Button>
              {visibleColleges.slice(0, 8).map((college) => <Button key={college} variant={selectedCollege === college ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setSelectedCollege(college)}>{college}</Button>)}
            </div>
          </div>
          {isLoading ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}</div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div>}
          {!isLoading && filteredCourses.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center"><p className="text-lg text-muted-foreground">No courses found matching "{searchQuery || selectedCollege}"</p><p className="mt-2 text-sm text-muted-foreground">Add the missing course in Supabase, or upload it under the correct KFU college once the catalog is expanded.</p></div>}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
