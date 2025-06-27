
import { useState } from 'react';
import { callScore } from '@/api/mostar';

export function useScore<T extends Record<string, unknown>>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{
    finalScore: number;
    voiceline: string;
  } | null>(null);

  const score = async (shipment: T) => {
    setLoading(true);
    setError(null);
    try {
      const res = await callScore(shipment);
      setData(res);
      return res;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, score };
}
