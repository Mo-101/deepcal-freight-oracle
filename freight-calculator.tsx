"use client";

import { useState, useEffect, useCallback } from "react";
import { ShipmentForm } from "./shipment-form";
import { ResultsPanel } from "./results-panel";
import { DataVisualizer } from "./data-visualizer";
import { FreightHeader } from "./freight-header";
import { ShipmentAnalytics } from "./shipment-analytics";
import { calculateOptimalCarrier } from "@/lib/decision-engine";
import type { ShipmentData, CarrierResult } from "@/lib/types";
import { fetchShipmentData } from "@/lib/data-service";
import { ForwarderAnalytics } from "./forwarder-analytics";
import { NewShipmentForm } from "./new-shipment-form";
import { RFQForm } from "./rfq-form";
import { RFQManager } from "./rfq-manager";
import { getSupabaseClient } from "@/lib/supabase-client";
import { GitHubDataImporter } from "./github-data-importer";
import { DeepCALEngineAnalytics } from "./deepcal-engine-analytics";

type TabType =
  | "calculator"
  | "analytics"
  | "history"
  | "detailed"
  | "new-shipment"
  | "rfq"
  | "data-import"
  | "engine-analytics";

export function FreightCalculator() {
  const [shipmentData, setShipmentData] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<CarrierResult[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<TabType>("calculator");
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to load from Supabase
      const supabase = getSupabaseClient();
      const { data, error: supabaseError } = await supabase
        .from("shipments")
        .select("*")
        .order("id", { ascending: false });

      if (supabaseError) {
        console.warn(
          "Supabase error, falling back to mock data:",
          supabaseError,
        );
        throw supabaseError;
      }

      if (data && data.length > 0) {
        // Convert to ShipmentData format
        const convertedData: ShipmentData[] = data.map((shipment) => ({
          request_reference:
            shipment.request_reference ||
            `REQ-${Math.random().toString(36).substring(2, 10)}`,
          date_of_collection:
            shipment.date_of_collection ||
            new Date().toISOString().split("T")[0],
          cargo_description: shipment.cargo_description || "",
          item_category: shipment.item_category || "General",
          origin_country: shipment.origin_country || "Unknown",
          destination_country: shipment.destination_country || "Unknown",
          weight_kg: String(shipment.weight_kg || "0"),
          volume_cbm: String(shipment.volume_cbm || "0"),
          final_quote_awarded_freight_forwader_Carrier:
            shipment.final_quote_awarded || "",
          "carrier+cost": String(shipment.freight_airline_cost || "0"),
          comments: shipment.comments || "",
          date_of_greenlight_to_pickup: "",
          origin_longitude: shipment.origin_longitude || 0,
          origin_latitude: shipment.origin_latitude || 0,
          destination_longitude: shipment.destination_longitude || 0,
          destination_latitude: shipment.destination_latitude || 0,
          carrier: shipment.freight_airline || "",
          kuehne_nagel: "0",
          scan_global_logistics: "0",
          dhl_express: "0",
          dhl_global: "0",
          bwosi: "0",
          agl: "0",
          siginon: "0",
          frieght_in_time: "0",
          initial_quote_awarded: "",
          date_of_arrival_destination: "",
          delivery_status: "Delivered",
          mode_of_shipment: "Air",
        }));

        setShipmentData(convertedData);
      } else {
        // Fall back to mock data if no data in Supabase
        const mockData = await fetchShipmentData();
        setShipmentData(mockData);
      }
    } catch (error) {
      console.error("Failed to load shipment data:", error);
      setError("Failed to load data, using fallback data");

      // Fall back to mock data
      try {
        const mockData = await fetchShipmentData();
        setShipmentData(mockData);
      } catch (mockError) {
        console.error("Failed to load mock data:", mockError);
        setError("Failed to load any data");
        setShipmentData([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCalculate = useCallback(
    (formData: {
      origin: string;
      destination: string;
      weight: number;
      volume: number;
      itemCategory: string;
      emergency: boolean;
      forwarderQuotes: {
        forwarder: string;
        cost: number;
        estimatedDays: number;
        mode: string;
      }[];
    }) => {
      try {
        // Find similar shipments based on criteria
        const similarShipments = shipmentData.filter(
          (shipment) =>
            shipment.origin_country.toLowerCase() ===
              formData.origin.toLowerCase() ||
            shipment.destination_country.toLowerCase() ===
              formData.destination.toLowerCase(),
        );

        // If forwarder quotes are provided, use them to generate results
        if (formData.forwarderQuotes && formData.forwarderQuotes.length > 0) {
          const quotesResults = formData.forwarderQuotes.map((quote) => {
            // Calculate reliability score based on historical data
            const forwarderShipments = similarShipments.filter(
              (shipment) =>
                shipment.final_quote_awarded_freight_forwader_Carrier ===
                quote.forwarder,
            );

            // Calculate reliability based on historical performance or use a default
            const reliabilityScore =
              forwarderShipments.length > 0
                ? Math.min(100, Math.floor(Math.random() * 30) + 70) // Simulated for demo
                : Math.min(100, Math.floor(Math.random() * 20) + 60); // Lower if no historical data

            // Calculate score based on cost, reliability, and estimated days
            const costFactor = Math.max(0, 100 - quote.cost / 1000); // Normalize cost
            const timeFactor = Math.max(0, 100 - quote.estimatedDays * 5); // Normalize time

            // Apply emergency weighting if needed
            const weights = formData.emergency
              ? { cost: 0.2, service: 0.5, risk: 0.3 } // Prioritize service and risk for emergencies
              : { cost: 0.33, service: 0.34, risk: 0.33 }; // Balanced for normal shipments

            const overallScore =
              costFactor * weights.cost +
              reliabilityScore * weights.service +
              timeFactor * weights.risk;

            return {
              carrier: quote.forwarder,
              cost: quote.cost,
              reliability: reliabilityScore,
              estimatedDays: quote.estimatedDays,
              score: Math.round(overallScore * 10) / 10,
              mode: quote.mode,
            };
          });

          // Sort by score
          setResults(quotesResults.sort((a, b) => b.score - a.score));
        } else {
          // Fall back to the original calculation if no quotes provided
          const calculatedResults = calculateOptimalCarrier(
            similarShipments,
            formData,
          );
          setResults(calculatedResults);
        }
      } catch (error) {
        console.error("Error calculating results:", error);
        setResults([]);
      }
    },
    [shipmentData],
  );

  const handleShipmentSelect = useCallback((shipment: ShipmentData) => {
    setSelectedShipment(shipment);
  }, []);

  const handleShipmentAdded = useCallback((newShipment: ShipmentData) => {
    setShipmentData((prevData) => [newShipment, ...prevData]);
  }, []);

  const handleRFQCreated = useCallback(() => {
    // Could refresh RFQ data here if needed
  }, []);

  if (error && shipmentData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Application</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <FreightHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {error && (
          <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200">
            Warning: {error}
          </div>
        )}

        <div className="mt-8">
          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ShipmentForm onCalculate={handleCalculate} loading={loading} />
              </div>
              <div className="lg:col-span-2">
                <ResultsPanel
                  results={results}
                  selectedShipment={selectedShipment}
                />
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <DataVisualizer shipmentData={shipmentData} />
          )}

          {activeTab === "history" && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Historical Shipments
              </h2>
              <div className="text-sm text-gray-400 mb-4">
                <span className="bg-gray-900 px-2 py-1 rounded mr-2">
                  Total: {shipmentData.length} shipments
                </span>
                <span className="bg-gray-900 px-2 py-1 rounded mr-2">
                  {
                    Array.from(
                      new Set(shipmentData.map((s) => s.destination_country)),
                    ).length
                  }{" "}
                  countries
                </span>
                <span className="bg-gray-900 px-2 py-1 rounded">
                  {
                    Array.from(
                      new Set(
                        shipmentData.map(
                          (s) => s.final_quote_awarded_freight_forwader_Carrier,
                        ),
                      ),
                    ).filter(Boolean).length
                  }{" "}
                  freight forwarders
                </span>
              </div>
              <div className="overflow-auto max-h-[70vh]">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Origin</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">Carrier</th>
                      <th className="px-4 py-3">Weight (kg)</th>
                      <th className="px-4 py-3">Volume (cbm)</th>
                      <th className="px-4 py-3">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipmentData.slice(0, 50).map((shipment, index) => (
                      <tr
                        key={`${shipment.request_reference}-${index}`}
                        className="border-b border-gray-700 odd:bg-gray-800/50 even:bg-gray-900/50 hover:bg-cyan-900/20 cursor-pointer"
                        onClick={() => handleShipmentSelect(shipment)}
                      >
                        <td className="px-4 py-3">
                          {shipment.request_reference}
                        </td>
                        <td className="px-4 py-3">{shipment.origin_country}</td>
                        <td className="px-4 py-3">
                          {shipment.destination_country}
                        </td>
                        <td className="px-4 py-3">
                          {
                            shipment.final_quote_awarded_freight_forwader_Carrier
                          }
                        </td>
                        <td className="px-4 py-3">{shipment.weight_kg}</td>
                        <td className="px-4 py-3">{shipment.volume_cbm}</td>
                        <td className="px-4 py-3">
                          $
                          {Number.parseFloat(
                            shipment["carrier+cost"] || "0",
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "detailed" && (
            <>
              <ShipmentAnalytics shipmentData={shipmentData} />
              <div className="mt-8">
                <ForwarderAnalytics shipmentData={shipmentData} />
              </div>
            </>
          )}

          {activeTab === "new-shipment" && (
            <NewShipmentForm onShipmentAdded={handleShipmentAdded} />
          )}

          {activeTab === "rfq" && (
            <div className="space-y-8">
              <RFQForm onRFQCreated={handleRFQCreated} />
              <RFQManager />
            </div>
          )}

          {activeTab === "data-import" && <GitHubDataImporter />}

          {activeTab === "engine-analytics" && <DeepCALEngineAnalytics />}
        </div>
      </div>
    </div>
  );
}
