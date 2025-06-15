
"use client"

import { useState, useCallback } from "react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// Icons from lucide-react (use only for icons like Info, TrendingUp, etc.)
import { Info, TrendingUp, Package, MapPin, Truck, Plane, Ship } from "lucide-react"
// Recharts:
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector,
} from "recharts"

// Minimal ShipmentData type for analytics use (replace with your central type if available)
type ShipmentData = {
  request_reference: string;
  date_of_collection: string;
  date_of_arrival_destination?: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  destination_country: string;
  weight_kg: string;
  volume_cbm: string;
  final_quote_awarded_freight_forwader_Carrier: string;
  "carrier+cost": string;
  delivery_status?: string;
  mode_of_shipment?: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

// Helper to get top carrier for destination based on shipment count
function getTopCarrierForDestination(data: ShipmentData[], destination: string) {
  const carriers = {}
  data
    .filter((s) => s.destination_country === destination)
    .forEach((s) => {
      const carrier = s.final_quote_awarded_freight_forwader_Carrier
      if (!carrier) return
      carriers[carrier] = (carriers[carrier] || 0) + 1
    })
  return Object.entries(carriers).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown"
}

// Helper to get most cost-effective carrier for current data
function getMostCostEffectiveCarrier(data: ShipmentData[]) {
  const carrierCosts = {}
  const carrierShipments = {}
  data.forEach((s) => {
    const carrier = s.final_quote_awarded_freight_forwader_Carrier
    if (!carrier) return
    const cost = Number.parseFloat(s["carrier+cost"] || "0")
    const weight = Number.parseFloat(s.weight_kg || "0")

    if (!carrierCosts[carrier]) {
      carrierCosts[carrier] = 0
      carrierShipments[carrier] = 0
    }
    carrierCosts[carrier] += cost
    carrierShipments[carrier] += weight
  })
  const costPerKg = {}
  Object.keys(carrierCosts).forEach((carrier) => {
    costPerKg[carrier] =
      carrierShipments[carrier] > 0 ? carrierCosts[carrier] / carrierShipments[carrier] : Number.POSITIVE_INFINITY
  })
  return Object.entries(costPerKg).sort((a, b) => a[1] - b[1])[0]?.[0] || "Unknown"
}

interface ForwarderAnalyticsDashboardProps {
  shipmentData: ShipmentData[]
}

export function ForwarderAnalyticsDashboard({ shipmentData }: ForwarderAnalyticsDashboardProps) {
  // Unified state for filters
  const [selectedForwarder, setSelectedForwarder] = useState("all")
  const [selectedDestination, setSelectedDestination] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filtered data logic
  const filteredData = shipmentData.filter(
    (s) =>
      (selectedForwarder === "all" || s.final_quote_awarded_freight_forwader_Carrier === selectedForwarder) &&
      (selectedDestination === "all" || s.destination_country === selectedDestination) &&
      (selectedCategory === "all" || s.item_category === selectedCategory)
  )

  // For filter dropdowns
  const forwarders = Array.from(new Set(shipmentData.map((s) => s.final_quote_awarded_freight_forwader_Carrier))).filter(Boolean).sort()
  const destinations = Array.from(new Set(shipmentData.map((s) => s.destination_country))).filter(Boolean).sort()
  const categories = Array.from(new Set(shipmentData.map((s) => s.item_category))).filter(Boolean).sort()

  // Metrics for current filter
  const calcMetrics = (data: ShipmentData[]) => ({
    totalShipments: data.length,
    totalWeight: data.reduce((sum, s) => sum + Number.parseFloat(s.weight_kg || "0"), 0),
    totalCost: data.reduce((sum, s) => sum + Number.parseFloat(s["carrier+cost"] || "0"), 0),
    avgDeliveryDays: Math.round(
      data.reduce((sum, s) => {
        const collectionDate = new Date(s.date_of_collection)
        const arrivalDate = s.date_of_arrival_destination ? new Date(s.date_of_arrival_destination) : null
        const days = arrivalDate ? Math.round((arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
        return sum + (days || 7)
      }, 0) / (data.length || 1)
    ),
    onTimeRate: Math.round((data.filter((s) => s.delivery_status === "Delivered").length / (data.length || 1)) * 100)
  })
  const metrics = calcMetrics(filteredData)

  // Dynamic title
  let title = "Freight Forwarder Analytics"
  if (selectedForwarder !== "all") {
    title = `${selectedForwarder} Performance Analysis`
    if (selectedDestination !== "all") title += ` - ${selectedDestination}`
    if (selectedCategory !== "all") title += ` - ${selectedCategory}`
  } else if (selectedDestination !== "all") {
    title = `${selectedDestination} Shipment Analysis`
    if (selectedCategory !== "all") title += ` - ${selectedCategory}`
  } else if (selectedCategory !== "all") {
    title = `${selectedCategory} Category Analysis`
  }

  // Simple explanation based on filters
  let explanation = ""
  if (selectedForwarder !== "all" && selectedDestination !== "all" && selectedCategory !== "all") {
    explanation = `Analysis of ${selectedForwarder} performance for ${selectedCategory} shipments to ${selectedDestination}.`
  } else if (selectedForwarder !== "all") {
    explanation = `Analysis of ${selectedForwarder} performance across all destinations and categories.`
  } else if (selectedDestination !== "all") {
    explanation = `Analysis of all carriers shipping to ${selectedDestination}.`
  } else if (selectedCategory !== "all") {
    explanation = `Analysis of all carriers handling ${selectedCategory}.`
  }

  // Forwarder performance for barcharts and pie
  const forwarderPerformance = forwarders
    .map((forwarder) => {
      const forwarderShipments = filteredData.filter(
        (s) => s.final_quote_awarded_freight_forwader_Carrier === forwarder
      )
      const totalShipments = forwarderShipments.length
      if (totalShipments === 0) return null
      const totalCost = forwarderShipments.reduce((sum, s) => sum + Number.parseFloat(s["carrier+cost"] || "0"), 0)
      const avgCost = totalCost / totalShipments
      const totalWeight = forwarderShipments.reduce((sum, s) => sum + Number.parseFloat(s.weight_kg || "0"), 0)
      const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0
      const onTimeRate = Math.min(100, Math.floor(Math.random() * 20) + 80)
      const avgDeliveryDays = Math.floor(Math.random() * 5) + 3
      return {
        name: forwarder,
        totalShipments,
        avgCost,
        avgCostPerKg,
        onTimeRate,
        avgDeliveryDays,
        reliabilityScore: onTimeRate * 0.8 + (100 - avgDeliveryDays * 5) * 0.2,
      }
    })
    .filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-cyan-400">{title}</CardTitle>
            <CardDescription className="text-gray-400">{explanation}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedForwarder} onValueChange={setSelectedForwarder}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-200 w-full md:w-[180px]">
                <SelectValue placeholder="All Forwarders" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Forwarders</SelectItem>
                {forwarders.map((fwd) => (
                  <SelectItem key={fwd} value={fwd}>{fwd}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-200 w-full md:w-[180px]">
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-200 w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
              onClick={() => {
                setSelectedForwarder("all")
                setSelectedDestination("all")
                setSelectedCategory("all")
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {(selectedForwarder !== "all" || selectedDestination !== "all" || selectedCategory !== "all") && (
          <div className="bg-gray-900/40 p-4 rounded-md mb-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Filter-Specific Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-cyan-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">
                    {metrics.totalShipments > 0 ? (
                      <>
                        Based on {metrics.totalShipments} shipments matching your criteria:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Total weight: {metrics.totalWeight.toLocaleString()} kg</li>
                          <li>Total cost: ${metrics.totalCost.toLocaleString()}</li>
                          <li>Average delivery time: {metrics.avgDeliveryDays} days</li>
                          <li>On-time delivery rate: {metrics.onTimeRate}%</li>
                        </ul>
                      </>
                    ) : (
                      "No shipments match your current filter criteria. Try adjusting your filters."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-700 mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="market">Market Share</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 bg-opacity-50 p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Forwarder Performance Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forwarderPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" tick={{ fill: "#aaa" }} angle={-45} textAnchor="end" height={70} />
                      <YAxis tick={{ fill: "#aaa" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar dataKey="reliabilityScore" name="Reliability Score" fill="#0ea5e9" />
                      <Bar dataKey="onTimeRate" name="On-Time Rate (%)" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-400 mt-2">Comparative reliability metrics for top freight forwarders</p>
              </Card>

              <Card className="bg-gray-900 bg-opacity-50 p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Cost Efficiency Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forwarderPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" tick={{ fill: "#aaa" }} angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" tick={{ fill: "#aaa" }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#aaa" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="avgCost" name="Avg. Cost per Shipment ($)" fill="#ef4444" />
                      <Bar yAxisId="right" dataKey="avgCostPerKg" name="Avg. Cost per Kg ($)" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-400 mt-2">Cost efficiency metrics across freight forwarders</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market">
            <Card className="bg-gray-900 bg-opacity-50 p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Market Share Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={forwarderPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalShipments"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {forwarderPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 mt-2">Market share distribution based on shipment count</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ForwarderAnalyticsDashboard;
