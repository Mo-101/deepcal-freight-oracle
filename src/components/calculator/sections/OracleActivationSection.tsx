
import React from 'react';

interface OracleActivationSectionProps {
  isAwakening: boolean;
  validation: { weight?: string; volume?: string };
  onAwakenOracle: () => void;
}

const OracleActivationSection: React.FC<OracleActivationSectionProps> = ({
  isAwakening,
  validation,
  onAwakenOracle
}) => {
  return (
    <div className="pt-2">
      <button 
        onClick={onAwakenOracle}
        disabled={isAwakening || !!validation.weight || !!validation.volume}
        className="w-full bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        <i className="fas fa-bolt mr-2"></i>
        {isAwakening ? 'Awakening the Oracle...' : 'Awaken the Oracle'}
      </button>
    </div>
  );
};

export default OracleActivationSection;
