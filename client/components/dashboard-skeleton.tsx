import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 p-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Cases Card */}
        <div className="p-6 rounded-lg border bg-card">
          <Skeleton className="h-4 w-[140px] mb-4" />
          <Skeleton className="h-[120px] w-[120px] rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-[60px] mx-auto mb-2" />
          <Skeleton className="h-4 w-[180px] mx-auto" />
        </div>

        {/* Bar Chart Card */}
        <div className="p-6 rounded-lg border bg-card md:col-span-1">
          <Skeleton className="h-4 w-[140px] mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
          <div className="mt-4 flex justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-8" />
            ))}
          </div>
        </div>

        {/* Cases Closed Card */}
        <div className="p-6 rounded-lg border bg-card">
          <Skeleton className="h-4 w-[140px] mb-4" />
          <Skeleton className="h-[120px] w-[120px] rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-[60px] mx-auto mb-2" />
          <Skeleton className="h-4 w-[180px] mx-auto" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-[120px]" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 mb-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

