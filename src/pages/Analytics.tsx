
import DeepCALHeader from "@/components/DeepCALHeader";
import { BarChart, Radar } from "lucide-react";

const Analytics = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
    <DeepCALHeader />
    <main className="container max-w-3xl mx-auto pt-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <BarChart className="w-7 h-7 text-pink-600" />
        Analytics & KPIs
      </h2>
      <section className="rounded-xl bg-white shadow p-6 space-y-4">
        <div>
          <div className="font-semibold">Key Performance Indicators</div>
          <ul className="list-disc ml-6 mt-1 text-sm">
            <li>
              <b>Average Transit Time:</b> <span className="text-blue-900">3.6 days</span>
            </li>
            <li>
              <b>Cost per KG:</b> <span className="text-green-800">$1.74</span>
            </li>
            <li>
              <b>Reliability Index:</b> <span className="text-purple-800">87%</span>
            </li>
            <li>
              <b>Risk/Disruption:</b> <span className="text-red-700">Low (0.12)</span>
            </li>
          </ul>
        </div>
        <div className="flex gap-4 mt-6 items-center">
          <Radar className="w-7 h-7 text-indigo-400" />
          <span className="text-muted-foreground text-sm">All analytics based on actual, validated data. If you see a hiccup, it’s probably the user’s fault.</span>
        </div>
      </section>
    </main>
  </div>
);

export default Analytics;
