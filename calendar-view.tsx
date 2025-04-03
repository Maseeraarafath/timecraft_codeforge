"use client"

import { useState } from "react"
import { addDays, format, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample event data
const events = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2025, 3, 3, 10, 0),
    duration: 60, // minutes
    type: "meeting",
  },
  {
    id: 2,
    title: "Project Review",
    date: new Date(2025, 3, 3, 14, 0),
    duration: 90,
    type: "meeting",
  },
  {
    id: 3,
    title: "Focus Time",
    date: new Date(2025, 3, 4, 9, 0),
    duration: 120,
    type: "focus",
  },
  {
    id: 4,
    title: "Client Call",
    date: new Date(2025, 3, 4, 15, 30),
    duration: 45,
    type: "meeting",
  },
]

function DayView({ date }: { date: Date }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  const dayEvents = events.filter((event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{format(date, "EEEE, MMMM d, yyyy")}</h3>
      <div className="space-y-2">
        {hours.map((hour) => {
          const hourEvents = dayEvents.filter((event) => event.date.getHours() === hour)

          return (
            <div key={hour} className="grid grid-cols-12 gap-2">
              <div className="col-span-1 text-sm text-muted-foreground">
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
              </div>
              <div className="col-span-11 min-h-[60px] rounded-md border border-dashed">
                {hourEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={cn(
                      "p-2 mb-1",
                      event.type === "meeting" ? "bg-blue-50" : event.type === "focus" ? "bg-green-50" : "bg-gray-50",
                    )}
                  >
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, "h:mm a")} -{" "}
                      {format(addDays(event.date, 0, event.duration * 60 * 1000), "h:mm a")}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ date }: { date: Date }) {
  const weekStart = startOfWeek(date)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Week of {format(weekStart, "MMMM d, yyyy")}</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center">
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-sm">{format(day, "d")}</div>
          </div>
        ))}
      </div>
      <div className="h-[500px] overflow-y-auto border rounded-md p-2">
        <p className="text-sm text-muted-foreground text-center py-4">Week view calendar will be implemented here</p>
      </div>
    </div>
  )
}

function MonthView({ date }: { date: Date }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{format(date, "MMMM yyyy")}</h3>
      <div className="flex justify-center">
        <Calendar mode="single" selected={date} className="rounded-md border" />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Events for {format(date, "MMMM d")}</h4>
        <div className="space-y-2">
          {events
            .filter((event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
            .map((event) => (
              <Card key={event.id} className="p-2">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(event.date, "h:mm a")} -{" "}
                  {format(addDays(event.date, 0, event.duration * 60 * 1000), "h:mm a")}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("day")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (view === "day") setDate(addDays(date, -1))
              else if (view === "week") setDate(addDays(date, -7))
              else setDate(addDays(date, -30))
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (view === "day") setDate(addDays(date, 1))
              else if (view === "week") setDate(addDays(date, 7))
              else setDate(addDays(date, 30))
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setDate(new Date())}>
            Today
          </Button>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        {view === "day" && <DayView date={date} />}
        {view === "week" && <WeekView date={date} />}
        {view === "month" && <MonthView date={date} />}
      </div>
    </div>
  )
}

