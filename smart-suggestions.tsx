import type React from "react"
import { Check, Clock, Coffee, Lightbulb, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SuggestionProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

function Suggestion({ icon, title, description, className }: SuggestionProps) {
  return (
    <div className={cn("flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Check className="h-4 w-4" />
          <span className="sr-only">Accept suggestion</span>
        </Button>
      </div>
    </div>
  )
}

export function SmartSuggestions() {
  return (
    <div className="space-y-4">
      <Suggestion
        icon={<Clock className="h-4 w-4" />}
        title="Block focus time"
        description="Schedule 2 hours of deep work tomorrow morning"
        className="bg-accent"
      />
      <Suggestion
        icon={<Users className="h-4 w-4" />}
        title="Team meeting"
        description="Schedule weekly team sync on Mondays at 10 AM"
      />
      <Suggestion
        icon={<Coffee className="h-4 w-4" />}
        title="Take a break"
        description="You've been working for 2 hours straight"
      />
      <Suggestion
        icon={<Lightbulb className="h-4 w-4" />}
        title="Optimize your schedule"
        description="Move non-essential meetings to Thursday"
      />
    </div>
  )
}

