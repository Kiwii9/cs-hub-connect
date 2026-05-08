import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Link as LinkIcon, Layers } from "lucide-react";
import { useResourceCountsByCourse } from "@/hooks/use-resources";

interface CourseCardProps {
  course: { id: string; code: string; name: string; level?: number | null; description?: string | null; college?: string | null; major?: string | null; };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { data: counts } = useResourceCountsByCourse(course.id);
  return (
    <Link to={`/course/${course.id}`}>
      <Card className="group h-full rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2 rounded-full border-primary/20 font-mono text-xs">{course.code}</Badge>
              <h3 className="text-lg font-bold tracking-tight group-hover:text-primary">{course.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.college && <Badge variant="secondary" className="rounded-full text-[11px] font-normal">{course.college}</Badge>}
                {course.major && <Badge variant="secondary" className="rounded-full text-[11px] font-normal">{course.major}</Badge>}
                {course.level && <span className="text-sm text-muted-foreground">Level {course.level}</span>}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          {course.description && <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>}
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-3 py-2"><FileText className="h-4 w-4" /><span>{counts?.notes ?? 0}</span></div>
            <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-3 py-2"><LinkIcon className="h-4 w-4" /><span>{counts?.lecture_link ?? 0}</span></div>
            <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-3 py-2"><Layers className="h-4 w-4" /><span>{counts?.total ?? 0}</span></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
