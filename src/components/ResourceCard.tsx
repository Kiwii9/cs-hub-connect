import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, BookMarked, Link as LinkIcon, PenTool, ExternalLink, Calendar, User, GraduationCap } from "lucide-react";
import { format } from "date-fns";

interface ResourceCardProps {
  resource: {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    academic_year: string;
    semester: string;
    batch_year: number;
    section?: string | null;
    tags?: string[] | null;
    created_at: string;
    lecturers?: { name: string } | null;
  };
}

const typeIcons: Record<string, any> = {
  notes: FileText,
  summary: BookMarked,
  lecture_link: LinkIcon,
  practice: PenTool,
};

const typeLabels: Record<string, string> = {
  notes: 'Notes',
  summary: 'Study Guide',
  lecture_link: 'Lecture Link',
  practice: 'Exercises',
};

const typeColors: Record<string, string> = {
  notes: 'bg-chart-1/10 text-chart-1 border-chart-1/30',
  summary: 'bg-chart-2/10 text-chart-2 border-chart-2/30',
  lecture_link: 'bg-chart-3/10 text-chart-3 border-chart-3/30',
  practice: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const TypeIcon = typeIcons[resource.type] || FileText;
  const tags = resource.tags ?? [];

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
                <Badge variant="outline" className={`mb-2 text-xs font-medium border ${typeColors[resource.type] || ''}`}>
                  {typeLabels[resource.type] || resource.type}
                </Badge>
                <h3 className="font-bold text-base leading-tight line-clamp-2">{resource.title}</h3>
              </div>
              <Link to={`/resource/${resource.id}`}>
                <Button size="sm" variant="outline" className="rounded-full border flex-shrink-0">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open
                </Button>
              </Link>
            </div>

            {resource.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{resource.lecturers?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{resource.academic_year} • Sem {resource.semester}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Batch {resource.batch_year}</span>
              </div>
              {resource.section && <span className="font-mono">Section {resource.section}</span>}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                ))}
                {tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs font-normal">+{tags.length - 4}</Badge>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3">
              Added {format(new Date(resource.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
