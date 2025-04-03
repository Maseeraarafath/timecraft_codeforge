import Link from "next/link"
import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-xl font-bold transition-colors hover:text-primary">
        TimeAI
      </Link>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link href="/calendar" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Calendar
      </Link>
      <Link
        href="/analytics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Analytics
      </Link>
      <Link href="/tasks" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Tasks
      </Link>
      <Link href="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Settings
      </Link>
    </nav>
  )
}

