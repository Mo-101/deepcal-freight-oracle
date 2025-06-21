
import os
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from dotenv import load_dotenv
from typing import List, Dict, Any

from models.schemas import (
    SyntheticDataConfig, GenerationJob, SyntheticDataset,
    TrainingJobRequest, TrainingJob, WeightVector,
    GroqOptimizationRequest, GroqScenarioRequest
)
from services.mostly_service import mostly_service
from services.groq_service import groq_service
from services.training_service import training_service

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DeepCAL++ API",
    description="Advanced multi-criteria optimization with synthetic data generation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DeepCAL++ API"}

# Synthetic Data Endpoints
@app.post("/api/synthetic/generate", response_model=GenerationJob)
async def start_synthetic_generation(config: SyntheticDataConfig):
    """Start synthetic data generation job"""
    try:
        job = await mostly_service.start_generation(config)
        return job
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start generation: {str(e)}")

@app.get("/api/synthetic/jobs/{job_id}", response_model=GenerationJob)
async def get_generation_job_status(job_id: str):
    """Get generation job status"""
    job = await mostly_service.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.get("/api/synthetic/datasets/{job_id}", response_model=SyntheticDataset)
async def get_synthetic_dataset(job_id: str):
    """Get synthetic dataset by job ID"""
    dataset = await mostly_service.get_dataset(job_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@app.get("/api/synthetic/datasets", response_model=List[SyntheticDataset])
async def list_synthetic_datasets():
    """List all synthetic datasets"""
    return await mostly_service.list_datasets()

@app.delete("/api/synthetic/datasets/{dataset_id}")
async def delete_synthetic_dataset(dataset_id: str):
    """Delete synthetic dataset"""
    success = await mostly_service.delete_dataset(dataset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"message": "Dataset deleted successfully"}

@app.get("/api/synthetic/stats")
async def get_generation_stats():
    """Get generation statistics"""
    return await mostly_service.get_generation_stats()

# Training Endpoints
@app.post("/api/training/start", response_model=TrainingJob)
async def start_model_training(request: TrainingJobRequest):
    """Start model training job"""
    try:
        job = await training_service.start_training(request)
        return job
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start training: {str(e)}")

@app.get("/api/training/jobs/{job_id}", response_model=TrainingJob)
async def get_training_job_status(job_id: str):
    """Get training job status"""
    job = await training_service.get_training_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    return job

@app.get("/api/training/jobs", response_model=List[TrainingJob])
async def list_training_jobs():
    """List all training jobs"""
    return await training_service.list_training_jobs()

@app.get("/api/training/weights/latest", response_model=WeightVector)
async def get_latest_weights():
    """Get latest trained weight vector"""
    return await training_service.get_latest_weights()

@app.get("/api/training/weights/{matrix_id}", response_model=WeightVector)
async def get_weight_matrix(matrix_id: str):
    """Get specific weight matrix"""
    weights = await training_service.get_weight_matrix(matrix_id)
    if not weights:
        raise HTTPException(status_code=404, detail="Weight matrix not found")
    return weights

@app.post("/api/training/weights/{matrix_id}")
async def save_weight_matrix(matrix_id: str, weights: WeightVector):
    """Save weight matrix"""
    success = await training_service.save_weight_matrix(matrix_id, weights)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save weight matrix")
    return {"message": "Weight matrix saved successfully"}

@app.get("/api/training/stats")
async def get_training_stats():
    """Get training statistics"""
    return await training_service.get_training_stats()

# Groq AI Endpoints
@app.post("/api/groq/optimize-weights", response_model=WeightVector)
async def optimize_weights_with_groq(request: GroqOptimizationRequest):
    """Optimize weight vector using Groq AI"""
    try:
        optimized_weights = await groq_service.optimize_weights(request)
        return optimized_weights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weight optimization failed: {str(e)}")

@app.post("/api/groq/generate-scenario")
async def generate_scenario_with_groq(request: GroqScenarioRequest):
    """Generate stress test scenario using Groq AI"""
    try:
        scenario = await groq_service.generate_scenario(request)
        return scenario
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scenario generation failed: {str(e)}")

@app.post("/api/groq/analyze-dataset")
async def analyze_dataset_quality(dataset: List[Dict[str, Any]]):
    """Analyze synthetic dataset quality using Groq AI"""
    try:
        analysis = await groq_service.analyze_dataset_quality(dataset)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset analysis failed: {str(e)}")

# Scenario Generation Endpoints
@app.post("/api/scenarios/peak_season", response_model=GenerationJob)
async def generate_peak_season_scenario():
    """Generate peak season stress test scenario"""
    config = SyntheticDataConfig(
        baseDatasetSize=1000,
        syntheticRatio=3.0,
        privacyLevel="high",
        scenarioType="stress_test"
    )
    return await mostly_service.start_generation(config)

@app.post("/api/scenarios/supply_disruption", response_model=GenerationJob)
async def generate_supply_disruption_scenario():
    """Generate supply disruption stress test scenario"""
    config = SyntheticDataConfig(
        baseDatasetSize=800,
        syntheticRatio=2.5,
        privacyLevel="high",
        scenarioType="stress_test"
    )
    return await mostly_service.start_generation(config)

@app.post("/api/scenarios/economic_downturn", response_model=GenerationJob)
async def generate_economic_downturn_scenario():
    """Generate economic downturn stress test scenario"""
    config = SyntheticDataConfig(
        baseDatasetSize=1200,
        syntheticRatio=2.0,
        privacyLevel="medium",
        scenarioType="stress_test"
    )
    return await mostly_service.start_generation(config)

# Error handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
