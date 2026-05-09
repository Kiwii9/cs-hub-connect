import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Beaker,
  ExternalLink,
  Download,
  Calendar,
  User,
  GraduationCap,
  Clock,
  FileText,
  Share2,
  ThumbsUp,
  HeartHandshake,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportDialog from "@/components/ReportDialog";
import {
  useCreateComment,
  useResource,
  useResourceComments,
  useResourceReactionCounts,
  useToggleReaction,
} from "@/hooks/use-resources";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  fileTypeLabels,
  fileTypeLabelsAr,
  legacyResourceTypeLabels,
} from "@/data/kfuCatalog";
import { useLanguage } from "@/contexts/LanguageContext";

const typeIcons: Record<string, any> = {
  theory: BookOpen,
  lab_practical: Beaker,
  notes: BookOpen,
  summary: BookOpen,
  lecture_link: BookOpen,
  practice: Beaker,
};

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, isArabic } = useLanguage();
  const { data: resource, isLoading } = useResource(id || "");
  const { data: comments = [] } = useResourceComments(id || "");
  const { data: reactions = { upvote: 0, praise: 0 } } =
    useResourceReactionCounts(id || "");
  const createComment = useCreateComment();
  const toggleReaction = useToggleReaction();
  const [comment, setComment] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
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
          <h1 className="text-2xl font-bold mb-4">
            {t("Resource not found", "لم يتم العثور على المصدر")}
          </h1>
          <Link to="/">
            <Button>
              <ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
              {t("Back to Home", "العودة للرئيسية")}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const TypeIcon = typeIcons[resource.type] || BookOpen;
  const course = resource.courses;
  const tags = resource.tags ?? [];
  const publicLink = `${window.location.origin}/resource/${resource.id}`;

  const handleShare = async () => {
    try {
      if (navigator.share)
        await navigator.share({ title: resource.title, url: publicLink });
      else await navigator.clipboard.writeText(publicLink);
      toast({
        title: "Link ready",
        description: "Public resource link copied/shared.",
      });
    } catch {
      await navigator.clipboard.writeText(publicLink);
      toast({
        title: "Link copied",
        description: "Public resource link copied to clipboard.",
      });
    }
  };

  const handleReaction = async (reaction_type: "upvote" | "praise") => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Sign in with your KFU email to react.",
        variant: "destructive",
      });
      return;
    }
    await toggleReaction.mutateAsync({
      resource_id: resource.id,
      user_id: user.id,
      reaction_type,
    });
  };

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Sign in with your KFU email to comment.",
        variant: "destructive",
      });
      return;
    }
    const body = comment.trim();
    if (body.length < 2) return;
    await createComment.mutateAsync({
      resource_id: resource.id,
      user_id: user.id,
      body,
    });
    setComment("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            to={
              resource.college && resource.major
                ? `/major/${encodeURIComponent(resource.college)}/${encodeURIComponent(resource.major)}`
                : course
                  ? `/course/${course.id}`
                  : "/"
            }
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
            {t("Back to resources", "العودة للمصادر")}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 rounded-3xl">
                <CardHeader className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-secondary flex items-center justify-center border-2 border-border rounded-2xl">
                      <TypeIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 border-2">
                        {t(
                          legacyResourceTypeLabels[resource.type] ||
                            resource.type,
                          resource.type === "lab_practical"
                            ? "عملي / مختبر"
                            : "نظري",
                        )}
                      </Badge>
                      {resource.file_type && (
                        <Badge variant="secondary" className="mb-2 ml-2">
                          {t(
                            fileTypeLabels[resource.file_type] ||
                              resource.file_type,
                            fileTypeLabelsAr[resource.file_type] ||
                              resource.file_type,
                          )}
                        </Badge>
                      )}
                      <h1 className="text-2xl font-bold tracking-tight">
                        {resource.title}
                      </h1>
                      {(resource.course_label || course?.name) && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {resource.course_label ||
                            `${course?.code} ${course?.name}`}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resource.description && (
                    <div>
                      <h3 className="font-bold mb-2">
                        {t("Description", "الوصف")}
                      </h3>
                      <p className="text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                  )}
                  {resource.text_content && (
                    <div>
                      <h3 className="font-bold mb-2">
                        {t("Content", "المحتوى")}
                      </h3>
                      <div className="bg-secondary p-4 border-2 border-border rounded-2xl whitespace-pre-wrap font-mono text-sm">
                        {resource.text_content}
                      </div>
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-2">{t("Tags", "الوسوم")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-border">
                    {resource.link_url && (
                      <a
                        href={resource.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="border-2 rounded-full">
                          <ExternalLink
                            className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                          />
                          {t("Open Link", "فتح الرابط")}
                        </Button>
                      </a>
                    )}
                    {resource.file_url && (
                      <Button
                        className="border-2 rounded-full"
                        onClick={async () => {
                          const { data } = await supabase.storage
                            .from("resources")
                            .createSignedUrl(resource.file_url!, 3600);
                          if (data?.signedUrl)
                            window.open(data.signedUrl, "_blank");
                        }}
                      >
                        <Download
                          className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                        />
                        {t("Download File", "تحميل الملف")}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-2 rounded-full"
                      onClick={handleShare}
                    >
                      <Share2
                        className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                      />
                      {t("Share", "مشاركة")}
                    </Button>
                    <ReportDialog
                      resourceId={resource.id}
                      resourceTitle={resource.title}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 rounded-3xl">
                <CardContent className="p-5">
                  <h2 className="text-xl font-bold mb-4">
                    {t("Give recognition", "قدّر المساهمة")}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full border"
                      onClick={() => handleReaction("upvote")}
                    >
                      <ThumbsUp
                        className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                      />
                      {t("Upvote", "تصويت")} ({reactions.upvote})
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border"
                      onClick={() => handleReaction("praise")}
                    >
                      <HeartHandshake
                        className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                      />
                      {t("Praise", "شكر")} ({reactions.praise})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 rounded-3xl">
                <CardContent className="p-5 space-y-4">
                  <h2 className="text-xl font-bold">
                    {t("Comments", "التعليقات")}
                  </h2>
                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "No comments yet. Ask a question or thank the uploader.",
                          "لا توجد تعليقات بعد. اسأل سؤالًا أو اشكر صاحب المصدر.",
                        )}
                      </p>
                    ) : (
                      comments.map((item: any) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border bg-secondary/40 p-4"
                        >
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <p className="font-medium text-sm">
                              {item.profiles?.display_name || "KFU student"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {item.body}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        user
                          ? t(
                              "Write a helpful comment...",
                              "اكتب تعليقًا مفيدًا...",
                            )
                          : t("Sign in to comment", "سجل الدخول للتعليق")
                      }
                      className="min-h-[80px]"
                      disabled={!user}
                    />
                    <Button
                      className="rounded-full"
                      onClick={handleComment}
                      disabled={!user || createComment.isPending}
                    >
                      <Send
                        className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`}
                      />
                      {t("Post", "نشر")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-2 rounded-3xl">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("College / Major", "الكلية / التخصص")}
                      </p>
                      <p className="font-medium">
                        {resource.college || course?.college || "KFU"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resource.major || course?.major}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Lecturer / Uploader", "الدكتور / صاحب الرفع")}
                      </p>
                      <p className="font-medium">
                        {resource.lecturers?.name ||
                          resource.profiles?.display_name ||
                          "KFU student"}
                      </p>
                    </div>
                  </div>
                  {resource.file_type && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("File Type", "نوع الملف")}
                        </p>
                        <p className="font-medium">
                          {t(
                            fileTypeLabels[resource.file_type] ||
                              resource.file_type,
                            fileTypeLabelsAr[resource.file_type] ||
                              resource.file_type,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Academic Period", "الفترة الدراسية")}
                      </p>
                      <p className="font-medium">
                        {resource.academic_year} • {t("Semester", "الفصل")}{" "}
                        {resource.semester}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("Batch Year", "دفعة")}
                      </p>
                      <p className="font-medium">{resource.batch_year}</p>
                    </div>
                  </div>
                  {resource.section && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-muted-foreground font-mono text-sm">
                        §
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("Class Group", "الشعبة")}
                        </p>
                        <p className="font-medium">{resource.section}</p>
                      </div>
                    </div>
                  )}
                  {resource.week && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("Week", "الأسبوع")}
                        </p>
                        <p className="font-medium">
                          {t("Week", "الأسبوع")} {resource.week}
                        </p>
                      </div>
                    </div>
                  )}
                  {resource.topic && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("Topic", "الموضوع")}
                        </p>
                        <p className="font-medium">{resource.topic}</p>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t-2 border-border">
                    <p className="text-xs text-muted-foreground">
                      {t("Added", "أُضيف")}{" "}
                      {format(new Date(resource.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>
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
