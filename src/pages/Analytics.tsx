
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TabsAnalytics } from "@/components/analytics/TabsAnalytics";
import { AnalyticsExtendedPanel } from "@/components/analytics/AnalyticsExtendedPanel";
import { PerformanceMetricsPanel } from "@/components/analytics/PerformanceMetricsPanel";
import { TrendAnalysisPanel } from "@/components/analytics/TrendAnalysisPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Target, Brain } from "lucide-react";
import { useShipmentData } from "@/hooks/useShipmentData";

const Analytics = () => {
  const { shipments } = useShipmentData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      <main className="container max-w-full mx-auto pt-5 px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-white mb-2">
            <BarChart className="w-8 h-8 text-lime-400" />
            DeepCAL++ Mission Control
          </h2>
          <p className="text-indigo-300">
            Comprehensive logistics analytics powered by real shipment data and AI-driven insights
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Intelligence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PerformanceMetricsPanel shipmentData={shipments} />
            <div className="grid grid-cols-1 2xl:grid-cols-4 gap-6">
              <div className="2xl:col-span-3">
                <TabsAnalytics shipmentData={shipments} />
              </div>
              <div className="2xl:col-span-1">
                <AnalyticsExtendedPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetricsPanel shipmentData={shipments} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendAnalysisPanel shipmentData={shipments} />
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 2xl:grid-cols-4 gap-6">
              <div className="2xl:col-span-3">
                <TabsAnalytics shipmentData={shipments} />
              </div>
              <div className="2xl:col-span-1">
                <AnalyticsExtendedPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
