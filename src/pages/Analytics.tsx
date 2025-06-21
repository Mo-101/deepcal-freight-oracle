
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TabsAnalytics } from "@/components/analytics/TabsAnalytics";
import { AnalyticsExtendedPanel } from "@/components/analytics/AnalyticsExtendedPanel";
import { BarChart } from "lucide-react";
import { useShipmentData } from "@/hooks/useShipmentData";

const Analytics = () => {
  const { shipments } = useShipmentData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      <main className="container max-w-full mx-auto pt-5 px-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <BarChart className="w-7 h-7 text-lime-400" />
          DeepCAL++ Mission Control
        </h2>
        
        <div className="grid grid-cols-1 2xl:grid-cols-4 gap-6">
          <div className="2xl:col-span-3">
            <TabsAnalytics shipmentData={shipments} />
          </div>
          <div className="2xl:col-span-1">
            <AnalyticsExtendedPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
