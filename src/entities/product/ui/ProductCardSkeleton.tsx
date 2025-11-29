import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 p-6">
        <Skeleton className="mx-auto h-32 w-32 rounded-lg" />
      </div>
      <CardContent className="p-6 pt-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
}
