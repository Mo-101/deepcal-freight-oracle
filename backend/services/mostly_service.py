
import os
import asyncio
import pandas as pd
import hashlib
from typing import Optional, Dict, Any, List
from mostlyai import MostlyAI
from models.schemas import SyntheticDataConfig, GenerationJob, JobStatus, SyntheticDataset, DatasetMetadata, PrivacyMetrics
from datetime import datetime
import uuid
import json

class MostlyAIService:
    def __init__(self):
        self.api_key = os.getenv("MOSTLY_API_KEY")
        self.base_url = os.getenv("MOSTLY_BASE_URL", "https://app.mostly.ai")
        
        if not self.api_key:
            raise ValueError("MOSTLY_API_KEY environment variable is required")
        
        self.client = MostlyAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
        
        # In-memory job storage (in production, use Redis or database)
        self.jobs: Dict[str, GenerationJob] = {}
        self.datasets: Dict[str, SyntheticDataset] = {}

    async def start_generation(self, config: SyntheticDataConfig) -> GenerationJob:
        """Start synthetic data generation job"""
        job_id = str(uuid.uuid4())
        
        job = GenerationJob(
            id=job_id,
            status=JobStatus.PENDING,
            progress=0,
            config=config,
            createdAt=datetime.utcnow()
        )
        
        self.jobs[job_id] = job
        
        # Start background task
        asyncio.create_task(self._run_generation(job_id))
        
        return job

    async def _run_generation(self, job_id: str):
        """Background task to run synthetic data generation"""
        try:
            job = self.jobs[job_id]
            job.status = JobStatus.RUNNING
            job.progress = 10
            
            # Load base dataset (embedded_shipments.csv)
            base_data_path = "../public/embedded_shipments.csv"
            df = pd.read_csv(base_data_path)
            
            job.progress = 20
            
            # Configure generator based on scenario type
            generator_config = self._build_generator_config(job.config, df)
            
            job.progress = 30
            
            # Train generator
            generator = self.client.train(data=df, **generator_config)
            
            job.progress = 60
            
            # Generate synthetic data
            target_size = int(len(df) * job.config.syntheticRatio)
            synthetic_data = self.client.generate(generator, size=target_size)
            
            job.progress = 90
            
            # Create dataset
            dataset = self._create_dataset(job_id, synthetic_data, job.config)
            self.datasets[dataset.id] = dataset
            
            # Complete job
            job.status = JobStatus.COMPLETED
            job.progress = 100
            job.completedAt = datetime.utcnow()
            job.recordsGenerated = len(synthetic_data)
            
        except Exception as e:
            job = self.jobs[job_id]
            job.status = JobStatus.FAILED
            job.error = str(e)
            job.completedAt = datetime.utcnow()

    def _build_generator_config(self, config: SyntheticDataConfig, df: pd.DataFrame) -> Dict[str, Any]:
        """Build MOSTLY AI generator configuration"""
        base_config = {
            "name": f"DeepCAL Synthetic Generator - {config.scenarioType.value}",
            "privacy_level": config.privacyLevel.value,
        }
        
        # Scenario-specific configurations
        if config.scenarioType == "stress_test":
            base_config.update({
                "augmentation_ratio": 1.5,
                "noise_level": 0.1,
                "outlier_detection": True
            })
        elif config.scenarioType == "seasonal_variation":
            base_config.update({
                "time_series_augmentation": True,
                "seasonal_patterns": True
            })
        
        return base_config

    def _create_dataset(self, job_id: str, synthetic_data: pd.DataFrame, config: SyntheticDataConfig) -> SyntheticDataset:
        """Create synthetic dataset with metadata"""
        dataset_id = str(uuid.uuid4())
        
        # Calculate privacy metrics (simplified)
        privacy_metrics = PrivacyMetrics(
            kAnonymity=5,  # Would calculate real k-anonymity
            lDiversity=3,  # Would calculate real l-diversity
            tCloseness=0.1  # Would calculate real t-closeness
        )
        
        # Create source hash
        source_hash = hashlib.md5(synthetic_data.to_string().encode()).hexdigest()
        
        metadata = DatasetMetadata(
            generatedAt=datetime.utcnow(),
            recordCount=len(synthetic_data),
            sourceHash=source_hash,
            scenario=config.scenarioType.value,
            privacyMetrics=privacy_metrics
        )
        
        dataset = SyntheticDataset(
            id=dataset_id,
            jobId=job_id,
            records=synthetic_data.to_dict('records'),
            metadata=metadata
        )
        
        return dataset

    async def get_job_status(self, job_id: str) -> Optional[GenerationJob]:
        """Get generation job status"""
        return self.jobs.get(job_id)

    async def get_dataset(self, job_id: str) -> Optional[SyntheticDataset]:
        """Get synthetic dataset by job ID"""
        for dataset in self.datasets.values():
            if dataset.jobId == job_id:
                return dataset
        return None

    async def list_datasets(self) -> List[SyntheticDataset]:
        """List all synthetic datasets"""
        return list(self.datasets.values())

    async def delete_dataset(self, dataset_id: str) -> bool:
        """Delete synthetic dataset"""
        if dataset_id in self.datasets:
            del self.datasets[dataset_id]
            return True
        return False

    async def get_generation_stats(self) -> Dict[str, Any]:
        """Get generation statistics"""
        total_jobs = len(self.jobs)
        completed_jobs = sum(1 for job in self.jobs.values() if job.status == JobStatus.COMPLETED)
        total_records = sum(job.recordsGenerated or 0 for job in self.jobs.values() if job.recordsGenerated)
        
        last_generation = "Never"
        if self.jobs:
            latest_job = max(self.jobs.values(), key=lambda j: j.createdAt)
            last_generation = latest_job.createdAt.isoformat()
        
        return {
            "totalJobs": total_jobs,
            "completedJobs": completed_jobs,
            "totalRecords": total_records,
            "lastGeneration": last_generation
        }

# Singleton instance
mostly_service = MostlyAIService()
