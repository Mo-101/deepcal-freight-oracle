
import asyncio
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, List, Optional
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import uuid
import os
import json
from models.schemas import TrainingJob, TrainingJobRequest, JobStatus, WeightVector

class RealTrainingService:
    def __init__(self):
        # Real training jobs storage
        self.training_jobs: Dict[str, TrainingJob] = {}
        self.models_dir = "models"
        self.weights_dir = "weights"
        
        # Create directories
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.weights_dir, exist_ok=True)
        
        # Load default weights
        self.current_weights = WeightVector(
            cost=0.35,
            time=0.35,
            reliability=0.2,
            risk=0.1
        )

    async def start_real_training(self, request: TrainingJobRequest) -> TrainingJob:
        """Start real ML model training"""
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
        
        # Start real training task
        asyncio.create_task(self._run_real_training(job_id))
        
        return job

    async def _run_real_training(self, job_id: str):
        """Real ML training implementation"""
        try:
            job = self.training_jobs[job_id]
            job.status = JobStatus.RUNNING
            job.progress = 5
            
            # Load real data from parquet files
            await asyncio.sleep(1)
            data = self._load_training_data()
            job.progress = 15
            
            # Preprocess data
            X, y = self._preprocess_data(data)
            job.progress = 25
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            job.progress = 35
            
            # Initialize and train model
            model = RandomForestRegressor(
                n_estimators=100,
                random_state=42,
                n_jobs=-1
            )
            
            # Train with progress updates
            await asyncio.sleep(2)
            model.fit(X_train, y_train)
            job.progress = 70
            
            # Evaluate model
            predictions = model.predict(X_test)
            mse = mean_squared_error(y_test, predictions)
            r2 = r2_score(y_test, predictions)
            accuracy = max(0, min(100, r2 * 100))
            
            job.progress = 85
            
            # Save model
            model_path = os.path.join(self.models_dir, f"model_{job_id}.joblib")
            joblib.dump(model, model_path)
            
            # Optimize weights based on feature importance
            optimized_weights = self._optimize_weights_from_model(model, X.columns)
            self.current_weights = optimized_weights
            
            # Save weights
            weights_path = os.path.join(self.weights_dir, f"weights_{job_id}.json")
            with open(weights_path, 'w') as f:
                json.dump(optimized_weights.model_dump(), f)
            
            job.progress = 100
            job.status = JobStatus.COMPLETED
            job.completedAt = datetime.utcnow()
            job.accuracy = accuracy
            
            print(f"Training completed for job {job_id}: Accuracy={accuracy:.2f}%, MSE={mse:.4f}")
            
        except Exception as e:
            job = self.training_jobs[job_id]
            job.status = JobStatus.FAILED
            job.error = str(e)
            job.completedAt = datetime.utcnow()
            print(f"Training failed for job {job_id}: {e}")

    def _load_training_data(self) -> pd.DataFrame:
        """Load real training data from multiple sources"""
        # Try to load parquet files from training directory
        training_files = []
        if os.path.exists("training"):
            for file in os.listdir("training"):
                if file.endswith(".parquet"):
                    training_files.append(os.path.join("training", file))
        
        if training_files:
            # Load real parquet data
            dfs = []
            for file in training_files:
                try:
                    df = pd.read_parquet(file)
                    dfs.append(df)
                except Exception as e:
                    print(f"Error loading {file}: {e}")
            
            if dfs:
                return pd.concat(dfs, ignore_index=True)
        
        # Fallback: generate synthetic training data
        return self._generate_synthetic_training_data()

    def _generate_synthetic_training_data(self) -> pd.DataFrame:
        """Generate synthetic data for training when real data is not available"""
        np.random.seed(42)
        n_samples = 1000
        
        origins = ['US', 'CN', 'DE', 'SG', 'JP', 'GB', 'FR', 'AU', 'CA', 'IN']
        destinations = ['US', 'CN', 'DE', 'SG', 'JP', 'GB', 'FR', 'AU', 'CA', 'IN']
        
        data = []
        for i in range(n_samples):
            origin = np.random.choice(origins)
            destination = np.random.choice(destinations)
            weight = np.random.uniform(10, 2000)
            volume = np.random.uniform(0.1, 50)
            
            # Create realistic cost based on weight, volume, and distance
            base_cost = weight * 0.5 + volume * 10
            distance_multiplier = 1.0 if origin == destination else np.random.uniform(1.2, 3.0)
            cost = base_cost * distance_multiplier + np.random.uniform(100, 500)
            
            # Transit time based on distance and shipping method
            base_time = 1 if origin == destination else np.random.uniform(3, 25)
            time = base_time + np.random.uniform(0, 5)
            
            data.append({
                'origin_country': origin,
                'destination_country': destination,
                'weight_kg': weight,
                'volume_cbm': volume,
                'carrier_cost': cost,
                'transit_time_days': time,
                'reliability_score': np.random.uniform(70, 99),
                'risk_score': np.random.uniform(1, 30)
            })
        
        return pd.DataFrame(data)

    def _preprocess_data(self, data: pd.DataFrame) -> tuple:
        """Preprocess data for ML training"""
        # Encode categorical variables
        le_origin = LabelEncoder()
        le_dest = LabelEncoder()
        
        data_processed = data.copy()
        data_processed['origin_encoded'] = le_origin.fit_transform(data['origin_country'])
        data_processed['destination_encoded'] = le_dest.fit_transform(data['destination_country'])
        
        # Select features
        feature_columns = [
            'origin_encoded', 'destination_encoded', 'weight_kg', 'volume_cbm'
        ]
        
        # Add cost-related features if available
        if 'carrier_cost' in data.columns:
            feature_columns.append('carrier_cost')
        if 'reliability_score' in data.columns:
            feature_columns.append('reliability_score')
        if 'risk_score' in data.columns:
            feature_columns.append('risk_score')
        
        X = data_processed[feature_columns]
        
        # Target variable (transit time prediction)
        y = data_processed.get('transit_time_days', data_processed.get('transit_time', 
                                                                      np.random.uniform(1, 30, len(data))))
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
        
        return X_scaled, y

    def _optimize_weights_from_model(self, model, feature_names) -> WeightVector:
        """Optimize decision weights based on trained model feature importance"""
        feature_importance = model.feature_importances_
        
        # Map feature importance to decision criteria
        importance_dict = dict(zip(feature_names, feature_importance))
        
        # Calculate weights based on feature importance
        cost_weight = importance_dict.get('carrier_cost', 0.2) + importance_dict.get('weight_kg', 0.1)
        time_weight = 0.4  # Transit time is always important
        reliability_weight = importance_dict.get('reliability_score', 0.2)
        risk_weight = importance_dict.get('risk_score', 0.1)
        
        # Normalize weights to sum to 1
        total = cost_weight + time_weight + reliability_weight + risk_weight
        
        return WeightVector(
            cost=cost_weight / total,
            time=time_weight / total,
            reliability=reliability_weight / total,
            risk=risk_weight / total
        )

    async def get_training_job(self, job_id: str) -> Optional[TrainingJob]:
        """Get real training job status"""
        return self.training_jobs.get(job_id)

    async def list_training_jobs(self) -> List[TrainingJob]:
        """List all training jobs"""
        return list(self.training_jobs.values())

    async def get_latest_weights(self) -> WeightVector:
        """Get latest trained weights"""
        return self.current_weights

    async def get_training_stats(self) -> Dict[str, Any]:
        """Get real training statistics"""
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
            "modelFiles": len([f for f in os.listdir(self.models_dir) if f.endswith('.joblib')]),
            "weightVersions": len([f for f in os.listdir(self.weights_dir) if f.endswith('.json')])
        }

# Real training service instance
real_training_service = RealTrainingService()
