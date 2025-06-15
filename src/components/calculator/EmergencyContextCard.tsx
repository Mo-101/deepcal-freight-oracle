
import React from 'react';

interface EmergencyContextProps {
  emergencyContext: {
    isEmergency: boolean;
    context: string;
    grade: string;
    priority?: string;
  };
}

const EmergencyContextCard: React.FC<EmergencyContextProps> = ({ emergencyContext }) => {
  return (
    <div>
      <h3 className={`font-semibold mb-2 flex items-center ${emergencyContext.isEmergency ? 'text-red-400' : 'text-blue-400'}`}>
        {emergencyContext.isEmergency ? '🚨 Emergency Context' : '📋 Logistics Context'}
        <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
          emergencyContext.isEmergency ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
        }`}>
          {emergencyContext.priority}
        </span>
      </h3>
      <p className="text-sm">{emergencyContext.context}</p>
      <div className="mt-2 text-xs">
        <span className="font-medium">Grade: </span>
        <span className={emergencyContext.isEmergency ? 'text-red-300' : 'text-slate-300'}>
          {emergencyContext.grade}
        </span>
      </div>
    </div>
  );
};

export default EmergencyContextCard;
