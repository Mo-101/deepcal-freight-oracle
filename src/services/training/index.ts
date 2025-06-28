// Unified entry point for all training backends
import { TrainingBackend } from './types';
import { FirebaseBackend } from './firebaseBackend';
import { PostgresBackend } from './postgresBackend';
import { LiveBackend } from './liveBackend';
import { ApiBackend } from './apiBackend';
import { AITrainingBridge } from './aiBridge';

export const trainingBackends: Record<string, TrainingBackend> = {
  firebase: new FirebaseBackend(),
  postgres: new PostgresBackend(),
  live: new LiveBackend(),
  api: new ApiBackend(),
};

export { AITrainingBridge };

export function getTrainingBackend(type: keyof typeof trainingBackends): TrainingBackend {
  return trainingBackends[type];
}
