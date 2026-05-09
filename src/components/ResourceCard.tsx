import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Beaker, ExternalLink, Calendar, User, GraduationCap, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fileTypeLabels, fileTypeLabelsAr, legacyResourceTypeLabels } from "@/data/kfuCatalog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface ResourceCardProps {
  resource: {
    id: string;
    type: string;
    title: string;
    file_type?: string | null;
    description?: string | null;
    academic_year: string;
    semester: string;
    batch_year: number;
    section?: string | null;
    tags?: string[] | null;
    created_at: string;
    course_label?: string | null;
    college?: string | null;
    major?: string | null;
    lecturers?: { name: string } | null;
    courses?: { code?: string; name?: string } | null;
  };
}

const typeIcons: Record<string, any> = {
  theory: BookOpen,
  lab_practical: Beaker,
  notes: BookOpen,
  summary: BookOpen,
  lecture_link: BookOpen,
  practice: Beaker,
};

const typeColors: Record<string, string> = {
  theory: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  lab_practical: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  notes: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  summary: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  lecture_link: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  practice: "bg-chart-3/10 text-chart-3 border-chart-3/30",
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const { toast } = useToast();
  const { t, isArabic } = useLanguage();
  const TypeIcon = typeIcons[resource.type] || BookOpen;
  const tags = resource.tags ?? [];
  const publicLink = `${window.location.origin}/resource/${resource.id}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: resource.title, url: publicLink });
      } else {
        await navigator.clipboard.writeText(publicLink);
        toast({ title: t("Link copied", "تم نسخ الرابط"), description: t("Public resource link copied to clipboard.", "تم نسخ رابط المصدر العام.") });
      }
    } catch {
      await navigator.clipboard.writeText(publicLink);
      toast({ title: t("Link copied", "تم نسخ الرابط"), description: t("Public resource link copied to clipboard.", "تم نسخ رابط المصدر العام.") });
    }
  };

  return (
    <Card className="rounded-3xl border border-border hover:shadow-lg transition-all group bg-card">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border flex-shrink-0">
            <TypeIcon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0">
                <Badge variant="outline" className={`mb-2 text-xs font-medium border ${typeColors[resource.type] || ""}`}>
                  {t(legacyResourceTypeLabels[resource.type] || resource.type, resource.type === "lab_practical" ? "عملي / مختبر" : "نظري")}
                </Badge>
                {resource.file_type && (
                  <Badge variant="secondary" className="mb-2 ml-2 text-xs font-medium">
                    {t(fileTypeLabels[resource.file_type] || resource.file_type, fileTypeLabelsAr[resource.file_type] || resource.file_type)}
                  </Badge>
                )}
                <h3 className="font-bold text-base leading-tight line-clamp-2">{resource.title}</h3>
                {(resource.course_label || resource.courses?.name) && (
                  <p className="mt-1 text-xs text-muted-foreground">{resource.course_label || `${resource.courses?.code ?? ""} ${resource.courses?.name ?? ""}`}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button size="sm" variant="outline" className="rounded-full border" onClick={handleShare}>
                  <Share2 className={`w-4 h-4 ${isArabic ? "ml-1" : "mr-1"}`} />{t("Share", "مشاركة")}
                </Button>
                <Link to={`/resource/${resource.id}`}>
                  <Button size="sm" variant="outline" className="rounded-full border">
                    <ExternalLink className={`w-4 h-4 ${isArabic ? "ml-1" : "mr-1"}`} />{t("Open", "فتح")}
                  </Button>
                </Link>
              </div>
            </div>

            {resource.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /><span>{resource.lecturers?.name || t("Student upload", "رفع طالب")}</span></div>
              <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{resource.academic_year} • Sem {resource.semester}</span></div>
              <div className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /><span>{resource.major || "KFU"}</span></div>
              {resource.section && <span className="font-mono">{t("Class", "شعبة")} {resource.section}</span>}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 4).map((tag) => <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>)}
                {tags.length > 4 && <Badge variant="secondary" className="text-xs font-normal">+{tags.length - 4}</Badge>}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3">{t("Added", "أُضيف")} {format(new Date(resource.created_at), "MMM d, yyyy")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
