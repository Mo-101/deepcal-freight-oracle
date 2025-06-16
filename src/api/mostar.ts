
import axios from 'axios';

export const mostarApi = axios.create({
  baseURL: import.meta.env.VITE_SCORE_URL ??
    'https://us-central1-mostar-prod.cloudfunctions.net',
  timeout: 12_000,
});

export async function callScore(payload: unknown) {
  const { data } = await mostarApi.post('/score', payload);
  return data as { finalScore: number; voiceline: string };
}
