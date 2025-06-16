
# DeepCAL++ FastAPI Backend

Production-ready FastAPI backend with MOSTLY AI and Groq integration for synthetic data generation and AI-powered optimization.

## Features

- **MOSTLY AI Integration**: Real synthetic data generation with privacy preservation
- **Groq AI Integration**: LLM-powered weight optimization and scenario generation
- **Async Processing**: Background jobs for long-running tasks
- **RESTful API**: Complete REST API matching React frontend expectations
- **Error Handling**: Comprehensive error handling and logging
- **Docker Support**: Containerized deployment with Docker Compose

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 2. Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api
```

## API Endpoints

### Synthetic Data
- `POST /api/synthetic/generate` - Start synthetic data generation
- `GET /api/synthetic/jobs/{job_id}` - Get job status
- `GET /api/synthetic/datasets/{job_id}` - Download dataset
- `GET /api/synthetic/datasets` - List all datasets
- `DELETE /api/synthetic/datasets/{dataset_id}` - Delete dataset
- `GET /api/synthetic/stats` - Generation statistics

### Training
- `POST /api/training/start` - Start model training
- `GET /api/training/jobs/{job_id}` - Get training status
- `GET /api/training/jobs` - List training jobs
- `GET /api/training/weights/latest` - Get latest weights
- `POST /api/training/weights/{matrix_id}` - Save weight matrix
- `GET /api/training/stats` - Training statistics

### Groq AI
- `POST /api/groq/optimize-weights` - AI weight optimization
- `POST /api/groq/generate-scenario` - AI scenario generation
- `POST /api/groq/analyze-dataset` - Dataset quality analysis

### Scenarios
- `POST /api/scenarios/peak_season` - Peak season stress test
- `POST /api/scenarios/supply_disruption` - Supply disruption test
- `POST /api/scenarios/economic_downturn` - Economic downturn test

## Configuration

### Required Environment Variables

```env
# MOSTLY AI
MOSTLY_API_KEY=mostly-your-api-key-here
MOSTLY_BASE_URL=https://app.mostly.ai

# Groq AI
GROQ_API_KEY=your-groq-api-key-here

# Database (optional for development)
DATABASE_URL=postgresql://user:password@localhost/deepcal

# Redis (optional for development)
REDIS_URL=redis://localhost:6379/0
```

### Optional Configuration

```env
# CORS origins for frontend
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Storage directories
UPLOAD_DIR=./uploads
DATASET_DIR=./datasets

# API security
API_SECRET_KEY=your-secret-key-here
```

## Production Deployment

1. **Set up environment variables** in your production environment
2. **Deploy with Docker Compose** or your preferred container orchestration
3. **Configure reverse proxy** (nginx, traefik, etc.) for HTTPS
4. **Set up monitoring** and logging
5. **Configure database backups** for production data

## Integration with React Frontend

Update your React app's `syntheticDataService.ts` baseURL:

```typescript
// In development
this.baseURL = 'http://localhost:8000/api';

// In production  
this.baseURL = 'https://your-api-domain.com/api';
```

## Monitoring

- Health check endpoint: `GET /health`
- API documentation: `http://localhost:8000/docs`
- OpenAPI specification: `http://localhost:8000/openapi.json`

## Development

### Adding New Endpoints

1. Add Pydantic models to `models/schemas.py`
2. Implement service logic in `services/`
3. Add endpoints to `main.py`
4. Update tests and documentation

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

## Security

- API key validation for external services
- CORS configuration for frontend integration
- Input validation with Pydantic models
- Error handling without sensitive data exposure

## Support

For issues and questions, check the API documentation at `/docs` when running the server.
