"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface FreightHeaderProps {
  activeTab:
    | "calculator"
    | "analytics"
    | "history"
    | "detailed"
    | "new-shipment"
    | "rfq"
    | "data-import"
    | "engine-analytics"
  setActiveTab: (
    tab:
      | "calculator"
      | "analytics"
      | "history"
      | "detailed"
      | "new-shipment"
      | "rfq"
      | "data-import"
      | "engine-analytics",
  ) => void
}

export function FreightHeader({ activeTab, setActiveTab }: FreightHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: "calculator", label: "Calculator" },
    { id: "analytics", label: "Analytics" },
    { id: "history", label: "History" },
    { id: "detailed", label: "Detailed Analytics" },
    { id: "new-shipment", label: "New Shipment" },
    { id: "rfq", label: "RFQ" },
    { id: "data-import", label: "Data Import" },
    { id: "engine-analytics", label: "Engine Analytics" },
  ] as const

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-cyan-400">
          DeepCAL Logistics
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md text-sm ${
                    activeTab === tab.id ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md block w-full text-left ${
                    activeTab === tab.id ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
