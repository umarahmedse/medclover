import * as React from "react"
import { LockOpen, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MedicalCaseStatusProps {
  isClosed: boolean
  caseId: string
}

export function MedicalCaseStatus({ isClosed, caseId }: MedicalCaseStatusProps) {
  return (
    <Badge
      variant={isClosed ? "default" : "secondary"}
      className={cn(
        "h-9 px-4 py-0 text-sm font-medium",
        !isClosed ? "bg-green-500 hover:bg-green-600" : "bg-red-200 hover:bg-red-300",
      )}
    >
      {!isClosed ? <LockOpen className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
      Case {caseId} {!isClosed ? "Open" : "Closed"}
    </Badge>
  )
}

