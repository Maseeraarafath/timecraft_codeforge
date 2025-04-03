import type React from "react"
import { CalendarClock, CheckCircle, Clock, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  type: "meeting" | "task" | "focus" | "other"
  className?: string
}

function ActivityItem({ icon, title, description, time, type, className }: ActivityItemProps) {
  return (
    <div className={cn("flex items-center space-x-4 rounded-md p-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">{title}</p>
          <Badge
            variant={
              type === "meeting"
                ? "default"
                : type === "task"
                  ? "outline"
                  : type === "focus"
                    ? "secondary"
                    : "destructive"
            }
          >
            {type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-sm text-muted-foreground">{time}</div>
    </div>
  )
}

export function RecentActivity() {
  return (
    <div className="space-y-2">
      <ActivityItem
        icon={<Users className="h-4 w-4" />}
        title="Team Standup"
        description="Daily team sync meeting"
        time="9:00 AM"
        type="meeting"
      />
      <ActivityItem
        icon={<CheckCircle className="h-4 w-4" />}
        title="Complete Project Proposal"
        description="Finalize Q2 project proposal"
        time="10:30 AM"
        type="task"
      />
      <ActivityItem
        icon={<Clock className="h-4 w-4" />}
        title="Deep Work Session"
        description="Focus time for coding"
        time="11:00 AM"
        type="focus"
      />
      <ActivityItem
        icon={<CalendarClock className="h-4 w-4" />}
        title="Client Meeting"
        description="Review project progress with client"
        time="2:00 PM"
        type="meeting"
      />
      <ActivityItem
        icon={<CheckCircle className="h-4 w-4" />}
        title="Review Pull Requests"
        description="Review and merge team PRs"
        time="4:00 PM"
        type="task"
      />
    </div>
  )
}

