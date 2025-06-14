
import React from "react";
import { BrainCog, ArrowRight, Star, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Step indicator for pipeline
const Step = ({ active, label, icon }: { active?: boolean, label: string, icon: React.ReactNode }) => (
  <div className={cn(
    "flex flex-col items-center relative pb-1 pt-2",
    active ? "opacity-100 font-bold text-blue-900" : "opacity-50"
  )}>
    <div className={cn("rounded-full bg-white shadow-md p-3", active ? "ring-4 ring-blue-300" : "ring-0")}>{icon}</div>
    <div className={cn("text-xs mt-2", active && "text-primary")}>{label}</div>
  </div>
);

const pipeline = [
  {
    label: "Data Loaded",
    icon: <Star className="w-7 h-7 text-yellow-500" />,
  },
  {
    label: "Engine Engaged",
    icon: <BrainCog className="w-7 h-7 text-lime-500" />,
  },
  {
    label: "Decision Output",
    icon: <Star className="w-7 h-7 text-blue-500" />,
  },
];

const EnginePipeline: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  return (
    <div className="w-full flex justify-center gap-0 items-center my-8">
      <Step active={enabled} label={pipeline[0].label} icon={pipeline[0].icon} />
      <ArrowRight className={cn("w-7 h-7 mx-2", enabled ? "text-blue-700" : "text-muted-foreground")} />
      <Step active={enabled} label={pipeline[1].label} icon={pipeline[1].icon} />
      <ArrowRight className={cn("w-7 h-7 mx-2", enabled ? "text-blue-700" : "text-muted-foreground")} />
      <Step active={enabled} label={pipeline[2].label} icon={pipeline[2].icon} />
      {!enabled && (
        <div className="absolute right-4 flex items-center gap-1 text-muted-foreground text-xs">
          <Lock className="w-4 h-4" /> “All logic is on ice until data is verified.”
        </div>
      )}
    </div>
  );
};

export default EnginePipeline;
