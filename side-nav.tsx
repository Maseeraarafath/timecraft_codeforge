"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Clock, LayoutDashboard, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className, ...props }: SideNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                "justify-start",
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/calendar"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/calendar" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                "justify-start",
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </Link>
            <Link
              href="/analytics"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/analytics" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                "justify-start",
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/settings" ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                "justify-start",
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

