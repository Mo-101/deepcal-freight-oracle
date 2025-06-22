
import React from 'react';

interface TOPSISMatrixProps {
  forwarderKPIs: any[];
  priorities: {
    time: number;
    cost: number;
    risk: number;
  };
  revealLevel: 'novice' | 'expert' | 'phd';
}

export const TOPSISMatrix: React.FC<TOPSISMatrixProps> = ({ forwarderKPIs, priorities, revealLevel }) => {
  if (!forwarderKPIs || forwarderKPIs.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No TOPSIS matrix data available
      </div>
    );
  }

  // Extract criteria from first data item
  const criteria = Object.keys(forwarderKPIs[0]).filter(key => 
    typeof forwarderKPIs[0][key] === 'number' && key !== 'id'
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-cyan-500/30">
            <th className="text-left p-2 text-cyan-400">Alternative</th>
            {criteria.map(criterion => (
              <th key={criterion} className="text-center p-2 text-cyan-400">
                {criterion}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forwarderKPIs.map((item, index) => (
            <tr key={item.id || index} className="border-b border-slate-700/50">
              <td className="p-2 text-white">{item.name || `Alt ${index + 1}`}</td>
              {criteria.map(criterion => (
                <td key={criterion} className="text-center p-2 text-gray-300">
                  {typeof item[criterion] === 'number' 
                    ? item[criterion].toFixed(2)
                    : item[criterion] || '-'
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
