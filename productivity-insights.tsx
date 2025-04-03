"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dailyData = [
  { time: "8 AM", productivity: 65 },
  { time: "9 AM", productivity: 80 },
  { time: "10 AM", productivity: 90 },
  { time: "11 AM", productivity: 85 },
  { time: "12 PM", productivity: 60 },
  { time: "1 PM", productivity: 50 },
  { time: "2 PM", productivity: 70 },
  { time: "3 PM", productivity: 75 },
  { time: "4 PM", productivity: 65 },
  { time: "5 PM", productivity: 60 },
]

const weeklyData = [
  { day: "Mon", productivity: 75, focusHours: 5 },
  { day: "Tue", productivity: 80, focusHours: 5.5 },
  { day: "Wed", productivity: 65, focusHours: 4 },
  { day: "Thu", productivity: 90, focusHours: 6 },
  { day: "Fri", productivity: 70, focusHours: 4.5 },
  { day: "Sat", productivity: 50, focusHours: 2 },
  { day: "Sun", productivity: 40, focusHours: 1.5 },
]

const factors = [
  { name: "Meeting Duration", score: 85, impact: "High" },
  { name: "Focus Time Blocks", score: 90, impact: "High" },
  { name: "Task Completion Rate", score: 75, impact: "Medium" },
  { name: "Context Switching", score: 60, impact: "High" },
  { name: "Break Frequency", score: 70, impact: "Medium" },
]

export function ProductivityInsights() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly">("daily")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm">
          Last 7 Days
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {timeframe === "daily" ? (
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#0ea5e9"
                activeDot={{ r: 8 }}
                name="Productivity Score"
              />
            </LineChart>
          ) : (
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 8]} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="productivity"
                stroke="#0ea5e9"
                activeDot={{ r: 8 }}
                name="Productivity Score"
              />
              <Line yAxisId="right" type="monotone" dataKey="focusHours" stroke="#22c55e" name="Focus Hours" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Productivity Factors</h3>
            <div className="space-y-4">
              {factors.map((factor) => (
                <div key={factor.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{factor.name}</span>
                    <span className="text-sm font-medium">{factor.score}/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${factor.score}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Impact: {factor.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
            <div className="space-y-3 text-sm">
              <p>
                • <strong>Schedule focus blocks:</strong> Your productivity peaks between 9-11 AM. Schedule your most
                important tasks during this time.
              </p>
              <p>
                • <strong>Reduce meeting duration:</strong> Try to keep meetings under 30 minutes to maintain focus
                throughout the day.
              </p>
              <p>
                • <strong>Take regular breaks:</strong> Your productivity drops after 2 hours of continuous work.
                Consider using the Pomodoro technique.
              </p>
              <p>
                • <strong>Batch similar tasks:</strong> Group similar tasks together to reduce context switching, which
                is currently impacting your productivity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

