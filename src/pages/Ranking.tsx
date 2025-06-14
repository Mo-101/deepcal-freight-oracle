
import DeepCALHeader from "@/components/DeepCALHeader";
import { BarChart2, BadgeCheck } from "lucide-react";

const demo = [
  { forwarder: "Alpha Carrier", closeness: 0.82 },
  { forwarder: "Bravo Freight", closeness: 0.76 },
  { forwarder: "GammaRunner", closeness: 0.63 },
];

const Ranking = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100">
    <DeepCALHeader />
    <main className="container max-w-3xl mx-auto pt-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <BarChart2 className="w-7 h-7 text-indigo-500" />
        Route/Forwarder Rankings (TOPSIS)
      </h2>
      <table className="w-full border-collapse rounded-xl overflow-hidden bg-card shadow mb-6">
        <thead>
          <tr className="bg-indigo-50">
            <th className="py-2 px-3 text-left font-normal">Forwarder</th>
            <th className="py-2 px-3 text-left font-normal">Closeness (Ci)</th>
            <th className="py-2 px-3 text-left font-normal">Best?</th>
          </tr>
        </thead>
        <tbody>
          {demo.map((row, i) => (
            <tr key={row.forwarder} className={i === 0 ? "bg-green-50" : ""}>
              <td className="py-3 px-3 font-medium">{row.forwarder}</td>
              <td className="py-3 px-3">{row.closeness}</td>
              <td className="py-3 px-3">{i === 0 ? <BadgeCheck className="inline-block w-5 h-5 text-green-600" /> : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-sm text-muted-foreground px-2">
        <span>
          Rankings computed via <b>Grey/Neutrosophic AHP-TOPSIS</b>.
          <br />
          <span className="italic">"It's not magic—it's math, but with room for uncertainty and sarcasm."</span>
        </span>
      </div>
    </main>
  </div>
);

export default Ranking;
