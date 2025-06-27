
import React from "react";

interface OracleMoodPulseProps {
  isActive: boolean;
  mood?: "thinking" | "confident" | "processing";
}

export const OracleMoodPulse: React.FC<OracleMoodPulseProps> = ({
  isActive,
  mood = "confident"
}) => {
  const getMoodColor = () => {
    switch (mood) {
      case "thinking":
        return "bg-orange-400";
      case "processing":
        return "bg-blue-400";
      default:
        return "bg-green-500";
    }
  };

  if (!isActive) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">Mo is online</span>
      <div className={`w-2 h-2 ${getMoodColor()} rounded-full animate-pulse`} />
    </div>
  );
};
