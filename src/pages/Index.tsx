import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap, Users, Shield, Sparkles, Coffee, Globe2, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { ResourceCardSkeleton } from "@/components/SkeletonCard";
import { useResourcesByMajor } from "@/hooks/use-resources";
import { getMajorsForCollege, kfuCollegeMajors, kfuColleges } from "@/data/kfuCatalog";
import kfuLogo from "@/assets/kfu-logo.png";

const Index = () => {
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
              <div className="text-center lg:text-left">
                <Badge variant="outline" className="mb-5 border-primary/20 bg-background/70 px-4 py-2 text-sm backdrop-blur">
                  <Sparkles className="mr-2 h-4 w-4" />Built by KFU students, for KFU students
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">KFU Resource Hub</h1>
                <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  A free, bilingual-ready study resource platform organized by College → Major, with moderated Theory and Lab/Practical material for King Faisal University students.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><GraduationCap className="mr-2 h-4 w-4" />{kfuColleges.length} colleges</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><BookOpen className="mr-2 h-4 w-4" />{totalMajors} majors</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Shield className="mr-2 h-4 w-4" />Approval before public</Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm"><Globe2 className="mr-2 h-4 w-4" />English + Arabic friendly</Badge>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link to="/upload"><Button size="lg" className="rounded-full">Upload a resource</Button></Link>
                  <a href="https://ko-fi.com/kiwii9" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="rounded-full border"><Coffee className="mr-2 h-4 w-4" />Support the creator</Button>
                  </a>
                </div>
              </div>
              <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur">
                <img src={kfuLogo} alt="King Faisal University" className="mx-auto mb-5 h-20" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">100%</p><p className="text-xs text-muted-foreground">Free</p></div>
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">Theory</p><p className="text-xs text-muted-foreground">نظري</p></div>
                  <div className="rounded-2xl border border-border bg-secondary/60 p-4"><p className="text-2xl font-bold">Lab</p><p className="text-xs text-muted-foreground">عملي</p></div>
                </div>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search selected major resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 rounded-2xl border border-border bg-background pl-12 text-base shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-accent/30">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-sm"><Shield className="mr-2 inline h-4 w-4" /><strong>Academic Integrity:</strong> No leaked exams or cheating materials allowed. Everything is free and moderated before going public. <Link to="/disclaimer" className="underline hover:text-primary">Learn more</Link></p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl border">
              <CardHeader><CardTitle>1. Choose College</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {kfuColleges.map((college) => (
                  <Button key={college} variant={selectedCollege === college ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => handleCollegeSelect(college)}>{college}</Button>
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-3xl border">
              <CardHeader><CardTitle>2. Choose Major</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select value={activeMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger className="h-12 rounded-2xl border"><SelectValue placeholder="Select major" /></SelectTrigger>
                  <SelectContent className="bg-popover border max-h-72">
                    {majors.map((major) => <SelectItem key={major} value={major}>{major}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {majors.slice(0, 10).map((major) => (
                    <Button key={major} variant={activeMajor === major ? "secondary" : "ghost"} size="sm" className="rounded-full" onClick={() => setSelectedMajor(major)}>{major}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{activeMajor || "Select a major"}</h2>
              <p className="text-muted-foreground">{selectedCollege} • {isLoading ? "Loading..." : `${filteredResources.length} approved resource${filteredResources.length !== 1 ? "s" : ""}`}</p>
            </div>
            <Link to={`/major/${encodeURIComponent(selectedCollege)}/${encodeURIComponent(activeMajor)}`}>
              <Button variant="outline" className="rounded-full border" disabled={!activeMajor}>Open major page</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <ResourceCardSkeleton key={i} />)}</div>
          ) : filteredResources.length > 0 ? (
            <div className="space-y-4">{filteredResources.map((resource: any) => <ResourceCard key={resource.id} resource={resource} />)}</div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
              <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No approved resources yet for this major.</p>
              <p className="mt-2 text-sm text-muted-foreground">Be the first to upload Theory or Lab/Practical material.</p>
              <Link to="/upload"><Button className="mt-5 rounded-full">Upload Resource</Button></Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
