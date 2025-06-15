
import React from 'react';
import { Card } from '@/components/ui/card';

interface DataStalenessWarningProps {
  dataStale: boolean;
  refreshingData: boolean;
  onRefresh: () => void;
}

const DataStalenessWarning: React.FC<DataStalenessWarningProps> = ({ 
  dataStale, 
  refreshingData, 
  onRefresh 
}) => {
  if (!dataStale) return null;

  return (
    <Card className="mb-6 p-4 bg-amber-900/20 border border-amber-600/30 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <i className="fas fa-exclamation-triangle text-amber-400"></i>
          <div>
            <div className="font-semibold text-amber-200">Updated Data Detected</div>
            <div className="text-sm text-amber-300">Your CSV file has been updated. Click refresh to load the latest data.</div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshingData}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {refreshingData ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </Card>
  );
};

export default DataStalenessWarning;
