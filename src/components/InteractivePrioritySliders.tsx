
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";

type Priorities = {
  time: number;
  cost: number;
  risk: number;
};

interface Props {
  value: Priorities;
  onChange: (value: Priorities) => void;
}

export const InteractivePrioritySliders: React.FC<Props> = ({ value, onChange }) => {
  // Update logic when any slider changes, others auto-balance
  const handleChange = (key: keyof Priorities) => (newVal: number[]) => {
    let updated = { ...value, [key]: newVal[0] };
    // Clamp all between 0 and 100
    updated.time = Math.max(0, Math.min(updated.time, 100));
    updated.cost = Math.max(0, Math.min(updated.cost, 100));
    updated.risk = Math.max(0, Math.min(updated.risk, 100));
    // Total for balancing
    let total = updated.time + updated.cost + updated.risk;
    // If total > 100, subtract overflow proportionally from others
    if (total !== 100) {
      const keys: (keyof Priorities)[] = ["time", "cost", "risk"];
      const changedIndex = keys.indexOf(key);
      const others = keys.filter((_, i) => i !== changedIndex);

      const excess = total - 100;

      if (excess !== 0) {
        // Distribute excess/deficit proportionally to others
        let othersTotal = updated[others[0]] + updated[others[1]];
        if (othersTotal === 0) {
          // Set others equal if they're both zero, unless all three are zero
          if (excess < 0) {
            // If total is < 100, add evenly
            updated[others[0]] = Math.round((100 - updated[key]) / 2);
            updated[others[1]] = 100 - updated[key] - updated[others[0]];
          } else {
            // If total > 100, set changed value, zero the rest
            updated[others[0]] = 0;
            updated[others[1]] = 0;
          }
        } else {
          // Subtract/add proportionally
          others.forEach((k) => {
            const portion = updated[k] / othersTotal;
            updated[k] = Math.round(updated[k] - portion * excess);
          });
          // Clamp to 0..100 again
          updated[others[0]] = Math.max(0, Math.min(updated[others[0]], 100));
          updated[others[1]] = Math.max(0, Math.min(updated[others[1]], 100));
          // Ensure sum is 100
          const sum = updated[keys[0]] + updated[keys[1]] + updated[keys[2]];
          if (sum !== 100) {
            // Fix by adjusting last
            updated[others[1]] += (100 - sum);
          }
        }
      }
    }
    onChange(updated);
  };

  // Utility for accessible slider label
  const sliderLabel = (key: keyof Priorities) =>
    key === "time"
      ? "Time Criticality"
      : key === "cost"
      ? "Cost Sensitivity"
      : "Risk Tolerance";

  const colors = {
    time: "bg-gradient-to-r from-cyan-400 to-blue-500",
    cost: "bg-gradient-to-r from-green-400 to-emerald-500",
    risk: "bg-gradient-to-r from-rose-500 to-pink-500",
  };

  const infos = {
    time: "Higher values favor speed over cost/risk.",
    cost: "Higher values favor cheaper options.",
    risk: "Higher values prefer carriers with lower risk.",
  };

  return (
    <div className="space-y-6">
      {(["time", "cost", "risk"] as (keyof Priorities)[]).map((key) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium flex items-center gap-1">
              {sliderLabel(key)}
              <span className="tooltip" style={{display:"inline-block"}}>
                <Info className="inline ml-1 text-purple-400 w-3 h-3" title={infos[key]} />
              </span>
            </span>
            <span className="text-sm font-semibold">{value[key]}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            value={[value[key]]}
            step={1}
            onValueChange={handleChange(key)}
            className="w-full"
          >
            <div className="relative pt-1">
              <div className={`h-2 rounded-full bg-slate-700`}>
                <div
                  className={`h-2 rounded-full ${colors[key]}`}
                  style={{ width: value[key] + "%" }}
                ></div>
              </div>
            </div>
          </Slider>
        </div>
      ))}
      <div className="flex justify-end text-xs text-slate-400 mt-2">
        <span>Total: {value.time + value.cost + value.risk}% (Always auto-balanced to 100%)</span>
      </div>
    </div>
  );
};

export default InteractivePrioritySliders;
