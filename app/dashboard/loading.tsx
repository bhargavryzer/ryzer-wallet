import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[125px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Skeleton className="h-[350px]" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-[350px]" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 