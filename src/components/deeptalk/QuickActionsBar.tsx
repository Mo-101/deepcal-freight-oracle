
import React from "react"
import { Button } from "@/components/ui/button"

interface QuickActionsBarProps {
  onQuickQuery: (query: string) => void
}

export default function QuickActionsBar({ onQuickQuery }: QuickActionsBarProps) {
  const quickQueries = [
    { label: "Best Routes", query: "What are the best routes to South Sudan?" },
    { label: "Cost Analysis", query: "Compare costs for all carriers" },
    { label: "Reliability", query: "Show reliability metrics" },
    { label: "Calculate Cost", query: "Calculate shipping cost for 100kg to Juba" },
  ]

  return (
    <div className="px-6 py-3 bg-slate-900/50 border-b border-white/10">
      <div className="flex gap-2 overflow-x-auto">
        {quickQueries.map((item) => (
          <Button
            key={item.label}
            onClick={() => onQuickQuery(item.query)}
            variant="outline"
            size="sm"
            className="text-xs border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
