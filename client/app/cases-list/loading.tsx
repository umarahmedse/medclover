import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen p-6">
      <Card className="mx-auto">
        <CardContent className="space-y-6 p-6">
          {/* Name Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Age Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Organs Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-40 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index}>
                  <Skeleton className="p-4 flex flex-col items-center justify-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </Skeleton>
                </Skeleton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

