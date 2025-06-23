
import { useState } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';

export const useOracleAwakening = () => {
  const [isAwakening, setIsAwakening] = useState(false);

  const awakenOracle = async () => {
    const isLoaded = await csvDataEngine.isDataLoaded();
    if (!isLoaded) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    setIsAwakening(true);
  };

  return {
    isAwakening,
    setIsAwakening,
    awakenOracle
  };
};
