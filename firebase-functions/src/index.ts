import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { spawn } from 'child_process';
import * as path from 'path';

admin.initializeApp();

interface TrainingConfig {
  dataSource: string;
  modelType: string;
  epochs: number;
  batchSize: number;
  weights?: any;
}

interface TrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  stage: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  metrics?: {
    accuracy: number;
    loss: number;
    epochsCompleted: number;
    samplesProcessed: number;
  };
  config: TrainingConfig;
}

// Start Training Job
export const startTrainingJob = functions.https.onCall(async (data: TrainingConfig, context) => {
  const jobId = admin.firestore().collection('training_jobs').doc().id;

  const job: TrainingJob = {
    id: jobId,
    status: 'pending',
    progress: 0,
    stage: 'Initializing',
    startedAt: new Date().toISOString(),
    config: data
  };

  await admin.firestore().collection('training_jobs').doc(jobId).set(job);
  runTrainingProcess(jobId, data);

  return job;
});

async function runTrainingProcess(jobId: string, config: TrainingConfig) {
  const jobRef = admin.firestore().collection('training_jobs').doc(jobId);

  try {
    await jobRef.update({
      status: 'running',
      stage: 'Starting training process',
      progress: 10
    });

    const scriptPath = path.resolve(__dirname, '../../training/firebase_training_bridge.py');
    const args = [
      '--data-source', config.dataSource,
      '--model-type', config.modelType,
      '--epochs', config.epochs.toString(),
      '--batch-size', config.batchSize.toString(),
      '--job-id', jobId
    ];

    const pythonProcess = spawn('python3', [scriptPath, ...args]);

    pythonProcess.stdout.on('data', async (data) => {
      const output = data.toString();
      console.log(`Training output: ${output}`);

      try {
        if (output.includes('PROGRESS:')) {
          const match = output.match(/PROGRESS:(\d+)/);
          if (match) {
            await jobRef.update({ progress: parseInt(match[1]) });
          }
        }

        if (output.includes('STAGE:')) {
          const match = output.match(/STAGE:(.+)/);
          if (match) {
            await jobRef.update({ stage: match[1].trim() });
          }
        }

        if (output.includes('METRICS:')) {
          const match = output.match(/METRICS:(\{.*\})/);
          if (match) {
            const metrics = JSON.parse(match[1]);
            await jobRef.update({ metrics });
          }
        }

      } catch (innerError) {
        console.error('Failed to update training status:', innerError);
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      const completedAt = new Date().toISOString();
      if (code === 0) {
        await jobRef.update({
          status: 'completed',
          progress: 100,
          stage: 'Training complete',
          completedAt
        });
      } else {
        await jobRef.update({
          status: 'failed',
          error: `Exited with code ${code}`,
          completedAt
        });
      }
    });

  } catch (err: any) {
    console.error('Unhandled training error:', err);
    await jobRef.update({
      status: 'failed',
      error: err.message || 'Unknown error',
      completedAt: new Date().toISOString()
    });
  }
}

// Get Training Status
export const getTrainingStatus = functions.https.onCall(async (data: { jobId: string }, context) => {
  const snapshot = await admin.firestore().collection('training_jobs').doc(data.jobId).get();
  return snapshot.exists ? snapshot.data() : { error: 'Job not found' };
});
