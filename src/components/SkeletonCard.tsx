import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CourseCardSkeleton = () => (
  <Card className="border-2 border-border">
    <CardContent className="p-6">
      <Skeleton className="h-5 w-16 mb-3" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
    </CardContent>
  </Card>
);

export const ResourceCardSkeleton = () => (
  <Card className="border-2 border-border">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-16 mb-2" />
          <Skeleton className="h-5 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
