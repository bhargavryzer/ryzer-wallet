"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan 1", value: 1000000 },
  { date: "Jan 15", value: 1200000 },
  { date: "Feb 1", value: 1100000 },
  { date: "Feb 15", value: 1300000 },
  { date: "Mar 1", value: 1500000 },
  { date: "Mar 15", value: 1400000 },
  { date: "Apr 1", value: 1600000 },
  { date: "Apr 15", value: 1800000 },
  { date: "May 1", value: 2000000 },
  { date: "May 15", value: 2200000 },
  { date: "Jun 1", value: 2400000 },
  { date: "Jun 15", value: 2600000 },
]

export function WalletBalanceChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] bg-muted/20 rounded-md animate-pulse" />
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-sm">{payload[0].payload.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                        <span className="font-bold text-sm">${payload[0].value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={2}
            activeDot={{ r: 6, style: { fill: "#7c3aed" } }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
