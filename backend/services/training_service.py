
import os
import asyncio
import pandas as pd
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
import json
from models.schemas import TrainingJob, TrainingJobRequest, JobStatus, WeightVector

class TrainingService:
    def __init__(self):
        # In-memory storage (in production, use database)
        self.training_jobs: Dict[str, TrainingJob] = {}
        self.weight_matrices: Dict[str, WeightVector] = {}
        
        # Load default weights
        self.weight_matrices["default"] = WeightVector(
            cost=0.35,
            time=0.35,
            reliability=0.2,
            risk=0.1
        )

    async def start_training(self, request: TrainingJobRequest) -> TrainingJob:
        """Start model training job"""
        job_id = str(uuid.uuid4())
        
        job = TrainingJob(
            id=job_id,
            status=JobStatus.PENDING,
            progress=0,
            datasetId=request.datasetId,
            weights=request.weights,
            createdAt=datetime.utcnow()
        )
        
        self.training_jobs[job_id] = job
        
        # Start background training task
        asyncio.create_task(self._run_training(job_id))
        
        return job

    async def _run_training(self, job_id: str):
        """Background task to run model training"""
        try:
            job = self.training_jobs[job_id]
            job.status = JobStatus.RUNNING
            job.progress = 10
            
            # Simulate training process
            await asyncio.sleep(2)  # Load data
            job.progress = 30
            
            await asyncio.sleep(3)  # Feature engineering
            job.progress = 50
            
            await asyncio.sleep(4)  # Train Neutrosophic engine
            job.progress = 70
            
            await asyncio.sleep(2)  # Validate TOPSIS weights
            job.progress = 85
            
            await asyncio.sleep(1)  # Generate weight matrices
            job.progress = 95
            
            # Store trained weights
            self.weight_matrices[f"trained_{job_id}"] = job.weights
            self.weight_matrices["latest"] = job.weights
            
            # Complete training
            job.status = JobStatus.COMPLETED
            job.progress = 100
            job.completedAt = datetime.utcnow()
            job.accuracy = 0.94 + (hash(job_id) % 100) / 1000  # Simulated accuracy
            
        except Exception as e:
            job = self.training_jobs[job_id]
            job.status = JobStatus.FAILED
            job.error = str(e)
            job.completedAt = datetime.utcnow()

    async def get_training_job(self, job_id: str) -> Optional[TrainingJob]:
        """Get training job status"""
        return self.training_jobs.get(job_id)

    async def list_training_jobs(self) -> List[TrainingJob]:
        """List all training jobs"""
        return list(self.training_jobs.values())

    async def get_latest_weights(self) -> WeightVector:
        """Get latest trained weight vector"""
        return self.weight_matrices.get("latest", self.weight_matrices["default"])

    async def get_weight_matrix(self, matrix_id: str) -> Optional[WeightVector]:
        """Get specific weight matrix"""
        return self.weight_matrices.get(matrix_id)

    async def save_weight_matrix(self, matrix_id: str, weights: WeightVector) -> bool:
        """Save weight matrix"""
        self.weight_matrices[matrix_id] = weights
        return True

    async def get_training_stats(self) -> Dict[str, Any]:
        """Get training statistics"""
        total_jobs = len(self.training_jobs)
        completed_jobs = sum(1 for job in self.training_jobs.values() if job.status == JobStatus.COMPLETED)
        
        avg_accuracy = 0.0
        if completed_jobs > 0:
            accuracies = [job.accuracy for job in self.training_jobs.values() 
                         if job.accuracy is not None]
            avg_accuracy = sum(accuracies) / len(accuracies) if accuracies else 0.0
        
        last_training = "Never"
        if self.training_jobs:
            latest_job = max(self.training_jobs.values(), key=lambda j: j.createdAt)
            last_training = latest_job.createdAt.isoformat()
        
        return {
            "totalJobs": total_jobs,
            "completedJobs": completed_jobs,
            "averageAccuracy": avg_accuracy,
            "lastTraining": last_training,
            "availableMatrices": len(self.weight_matrices)
        }

# Singleton instance
training_service = TrainingService()
