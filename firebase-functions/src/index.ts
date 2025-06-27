
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

  // Save job to Firestore
  await admin.firestore().collection('training_jobs').doc(jobId).set(job);

  // Start the training process
  runTrainingProcess(jobId, data);

  return job;
});

async function runTrainingProcess(jobId: string, config: TrainingConfig) {
  const jobRef = admin.firestore().collection('training_jobs').doc(jobId);
  
  try {
    // Update job status to running
    await jobRef.update({
      status: 'running',
      stage: 'Starting Python training script',
      progress: 10
    });

    // Prepare training script arguments
    const scriptArgs = [
      '--data-source', config.dataSource,
      '--model-type', config.modelType,
      '--epochs', config.epochs.toString(),
      '--batch-size', config.batchSize.toString(),
      '--job-id', jobId
    ];

    // Spawn Python training process
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../../training/firebase_training_bridge.py'),
      ...scriptArgs
    ]);

    // Handle process output
    pythonProcess.stdout.on('data', async (data) => {
      const output = data.toString();
      console.log(`Training output: ${output}`);
      
      // Parse progress updates from Python script
      if (output.includes('PROGRESS:')) {
        const progressMatch = output.match(/PROGRESS:(\d+)/);
        if (progressMatch) {
          await jobRef.update({ progress: parseInt(progressMatch[1]) });
        }
      }
      
      // Parse stage updates
      if (output.includes('STAGE:')) {
        const stageMatch = output.match(/STAGE:(.+)/);
        if (stageMatch) {
          await jobRef.update({ stage: stageMatch[1].trim() });
        }
      }
      
      // Parse metrics updates
      if (output.includes('METRICS:')) {
        const metricsMatch = output.match(/METRICS:(.+)/);
        if (metricsMatch) {
          const metrics = JSON.parse(metricsMatch[1]);
          await jobRef.update({ metrics });
        }
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Training error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code === 0) {
        await jobRef.update({
          status: 'completed',
          progress: 100,
          completedAt: new Date().toISOString(),
          stage: 'Training completed successfully'
        });
      } else {
        await jobRef.update({
          status: 'failed',
          error: `Training process exited with code ${code}`,
          completedAt: new Date().toISOString()
        });
      }
    });

  } catch (error) {
    console.error('Training process error:', error);
    await jobRef.update({
      status: 'failed',
      error: error.message,
      completedAt: new Date().toISOString()
    });
  }
}

export const getTrainingStatus = functions.https.onCall(async (data: { jobId: string }, context) => {
  const jobDoc = await admin.firestore().collection('training_jobs').doc(data.jobId).get();
  return jobDoc.exists ? jobDoc.data() : null;
});
