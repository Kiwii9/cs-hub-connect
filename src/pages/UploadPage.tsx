import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload as UploadIcon, AlertCircle, Beaker, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLecturers } from "@/hooks/use-lecturers";
import { useCreateResource } from "@/hooks/use-resources";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { uploadResourceSchema } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";
import { academicYears, batchYears, getMajorsForCollege, kfuColleges, resourceTypeOptions, semesters } from "@/data/kfuCatalog";

const sections = ["A", "B", "C", "D"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

const UploadPage = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: lecturers = [] } = useLecturers();
  const createResource = useCreateResource();

  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const majors = useMemo(() => getMajorsForCollege(college), [college]);
  const [resourceType, setResourceType] = useState("");
  const [title, setTitle] = useState("");
  const [courseLabel, setCourseLabel] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [section, setSection] = useState("");
  const [week, setWeek] = useState("");
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setMajor("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast({ title: "Invalid file type", description: "Only PDF, PNG, and JPG files are allowed.", variant: "destructive" });
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 50MB.", variant: "destructive" });
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      college,
      major,
      type: resourceType,
      title,
      course_label: courseLabel || undefined,
      academic_year: academicYear,
      semester,
      batch_year: batchYear,
      lecturer_id: lecturerId || undefined,
      section: section || undefined,
      week: week || undefined,
      topic: topic || undefined,
      tags: tags || undefined,
      description: description || undefined,
      link_url: linkUrl || undefined,
      text_content: textContent || undefined,
    };

    const result = uploadResourceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Validation error", description: "Please fix the highlighted fields.", variant: "destructive" });
      return;
    }

    if (!file && !linkUrl && !textContent) {
      toast({ title: "Content required", description: "Please provide a file, link, or text content.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      let fileUrl: string | undefined;

      if (file && user) {
        const ext = file.name.split(".").pop();
        const safeMajor = major.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const filePath = `${user.id}/${safeMajor}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("resources").upload(filePath, file);
        if (uploadError) throw uploadError;
        fileUrl = filePath;
      }

      await createResource.mutateAsync({
        course_id: null,
        college,
        major,
        course_label: courseLabel || null,
        type: resourceType as "theory" | "lab_practical",
        title,
        academic_year: academicYear,
        semester,
        batch_year: parseInt(batchYear),
        lecturer_id: lecturerId || null,
        section: section || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        week: week ? parseInt(week) : undefined,
        topic: topic || undefined,
        description: description || undefined,
        file_url: fileUrl,
        link_url: linkUrl || undefined,
        text_content: textContent || undefined,
        uploader_id: user!.id,
        status: "pending",
      });

      toast({ title: "Submitted for approval", description: "Your resource is saved and will appear publicly after admin review." });
      setCollege(""); setMajor(""); setResourceType(""); setTitle(""); setCourseLabel(""); setAcademicYear("");
      setSemester(""); setBatchYear(""); setLecturerId(""); setSection("");
      setWeek(""); setTopic(""); setTags(""); setDescription("");
      setLinkUrl(""); setTextContent(""); setFile(null);
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-secondary border border-border flex items-center justify-center mx-auto mb-6 rounded-3xl">
              <UploadIcon className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Sign in to Upload</h1>
            <p className="text-muted-foreground mb-6">You need to be signed in with your official KFU email to upload resources.</p>
            <Link to="/login"><Button size="lg" className="border rounded-full">Sign In to Continue</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-sm text-destructive">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Colleges
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-primary mb-2">100% Free • مجاني بالكامل</p>
            <h1 className="text-3xl font-bold mb-2">Upload KFU Resource</h1>
            <p className="text-muted-foreground">Choose your college and major first, then submit Theory or Lab/Practical material for moderation.</p>
          </div>

          <Alert className="mb-8 border border-chart-1/30 bg-chart-1/10 rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Academic Integrity:</strong> Only upload student-made resources. No leaked exams, assignment solutions, or copyrighted materials.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border rounded-3xl">
              <CardHeader>
                <CardTitle>College & Major</CardTitle>
                <CardDescription>This replaces the old broad Course dropdown and keeps resources organized for all KFU students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>College *</Label>
                    <Select value={college} onValueChange={handleCollegeChange}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select college" /></SelectTrigger>
                      <SelectContent className="bg-popover border max-h-72">
                        {kfuColleges.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FieldError field="college" />
                  </div>
                  <div className="space-y-2">
                    <Label>Major *</Label>
                    <Select value={major} onValueChange={setMajor} disabled={!college}>
                      <SelectTrigger className="border"><SelectValue placeholder={college ? "Select major" : "Select college first"} /></SelectTrigger>
                      <SelectContent className="bg-popover border max-h-72">
                        {majors.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FieldError field="major" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Course / Subject Name <span className="text-muted-foreground">(optional)</span></Label>
                  <Input value={courseLabel} onChange={(e) => setCourseLabel(e.target.value)} placeholder="e.g., Database Systems, Anatomy Lab, English Writing" className="border" />
                  <p className="text-xs text-muted-foreground">Optional because many KFU resources are easier to organize by college + major first.</p>
                  <FieldError field="course_label" />
                </div>
              </CardContent>
            </Card>

            <Card className="border rounded-3xl">
              <CardHeader>
                <CardTitle>Resource Information</CardTitle>
                <CardDescription>Only two public categories are used: Theory or Lab/Practical.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Resource Type *</Label>
                    <Select value={resourceType} onValueChange={setResourceType}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="bg-popover border">
                        {resourceTypeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label} / {type.labelAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError field="type" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Week 1-4 Theory Notes" className="border" />
                    <FieldError field="title" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year *</Label>
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent className="bg-popover border">{academicYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                    </Select>
                    <FieldError field="academic_year" />
                  </div>
                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select semester" /></SelectTrigger>
                      <SelectContent className="bg-popover border">{semesters.map((sem) => <SelectItem key={sem.value} value={sem.value}>{sem.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FieldError field="semester" />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Year *</Label>
                    <Select value={batchYear} onValueChange={setBatchYear}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select batch" /></SelectTrigger>
                      <SelectContent className="bg-popover border">{batchYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                    </Select>
                    <FieldError field="batch_year" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border rounded-3xl">
              <CardHeader>
                <CardTitle>Optional Details</CardTitle>
                <CardDescription>Add context to help students find the right material.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Select value={section} onValueChange={setSection}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent className="bg-popover border">{sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Week Number</Label>
                    <Input type="number" min="1" max="16" value={week} onChange={(e) => setWeek(e.target.value)} placeholder="1-16" className="border" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Lecturer</Label>
                    <Select value={lecturerId} onValueChange={setLecturerId}>
                      <SelectTrigger className="border"><SelectValue placeholder="Select lecturer if listed" /></SelectTrigger>
                      <SelectContent className="bg-popover border max-h-72">{lecturers.map((lecturer) => <SelectItem key={lecturer.id} value={lecturer.id}>{lecturer.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., lab safety, definitions, chapter 3" className="border" />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma-separated, e.g., midterm, lab, definitions" className="border" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the resource..." className="border min-h-[90px]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border rounded-3xl">
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Provide the resource content. Large PDF/image uploads are now supported up to 50MB.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 rounded-2xl border border-dashed p-4">
                  <Label>File Upload (PDF, PNG, JPG — max 50MB)</Label>
                  <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="border" />
                  {file && <p className="text-sm text-muted-foreground">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="border" />
                    <FieldError field="link_url" />
                  </div>
                  <div className="space-y-2">
                    <Label>Text Content</Label>
                    <Textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} placeholder="Paste short notes or instructions here..." className="border min-h-[80px] font-mono text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl border bg-secondary/50 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                {resourceType === "lab_practical" ? <Beaker className="h-5 w-5 mt-1" /> : <BookOpen className="h-5 w-5 mt-1" />}
                <div>
                  <p className="font-semibold">Moderation enabled</p>
                  <p className="text-sm text-muted-foreground">Your upload will be reviewed before it goes live to the public.</p>
                </div>
              </div>
              <Button type="submit" size="lg" className="rounded-full border" disabled={uploading}>
                <UploadIcon className="w-4 h-4 mr-2" />
                {uploading ? "Submitting..." : "Submit for Approval"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
