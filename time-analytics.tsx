"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Meetings", value: 12, color: "#0ea5e9" },
  { name: "Focus Time", value: 18, color: "#22c55e" },
  { name: "Admin Tasks", value: 5, color: "#f59e0b" },
  { name: "Breaks", value: 3, color: "#8b5cf6" },
  { name: "Communication", value: 7, color: "#ec4899" },
]

export function TimeAnalytics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} hours`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Time Breakdown</h3>
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value} hours</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium">{data.reduce((acc, item) => acc + item.value, 0)} hours</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">AI Insights</h3>
        <div className="space-y-2 text-sm">
          <p>• You spent 27% of your time in meetings, which is 5% less than last week.</p>
          <p>• Your focus time has increased by 3 hours compared to last week.</p>
          <p>• Most productive time of day: 9 AM - 11 AM</p>
          <p>• Suggestion: Consider scheduling more focus time in the mornings.</p>
        </div>
      </div>
    </div>
  )
}

