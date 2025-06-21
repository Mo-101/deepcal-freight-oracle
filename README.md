
# DeepCAL - Advanced Logistics Analytics Platform

**Developed by Mostar Industries**

## Overview

DeepCAL is a cutting-edge logistics analytics platform that revolutionizes freight forwarding through advanced AI-powered decision-making. Built with neutrosophic logic, AHP (Analytic Hierarchy Process), TOPSIS methodology, and Grey System framework, DeepCAL provides unprecedented insights into shipping routes, costs, and optimization strategies.

## Key Features

### 🧠 AI-Powered Analytics Engine
- **Neutrosophic Logic Framework**: Handles uncertainty and incomplete information in logistics decisions
- **Multi-Criteria Decision Analysis**: Uses AHP and TOPSIS for optimal route selection
- **Grey System Theory**: Analyzes limited data scenarios common in logistics
- **Graph Neural Networks**: Models complex shipping network relationships

### 🗣️ DeepTalk AI Assistant
- **Natural Language Processing**: Chat with your logistics data using advanced AI
- **Voice Integration**: Multiple TTS providers (ElevenLabs, OpenAI, Web Speech)
- **Real-time Insights**: Get instant answers about routes, costs, and optimization
- **Groq AI Integration**: Enhanced conversational intelligence

### 📊 Advanced Visualization
- **Interactive Maps**: Real-time logistics network visualization with Mapbox
- **Route Optimization**: Visual representation of optimal shipping corridors
- **Analytics Dashboard**: Comprehensive KPI monitoring and trend analysis
- **Animated Charts**: Dynamic data presentation with Recharts

### 🔄 Offline-First Architecture
- **IndexedDB Integration**: Local data storage for offline operation
- **Firebase Sync**: Seamless cloud synchronization when online
- **Real Data Focus**: No placeholder data - all analytics use actual shipment information

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack React Query
- **Database**: IndexedDB (local), Firestore (cloud)
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **Voice**: ElevenLabs, OpenAI TTS, Web Speech API
- **AI**: Groq API integration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── analytical/      # Analytics visualization components
│   ├── deeptalk/       # AI chat interface components
│   ├── training/       # ML training interface components
│   └── ui/             # Base UI components (Shadcn)
├── hooks/              # Custom React hooks
├── pages/              # Application pages/routes
├── services/           # API and data services
├── utils/              # Utility functions and helpers
└── types/              # TypeScript type definitions
```

## Core Principles

1. **Single Source of Truth**: All data originates from `deeptrack_2.csv` loaded into IndexedDB
2. **Append-Only Architecture**: New shipments append to existing data with strict schema validation
3. **Mathematical Foundation**: All calculations use real data through Neutrosophic + AHP + TOPSIS + Grey frameworks
4. **Zero Placeholders**: Production code never uses hard-coded sample data
5. **Offline-First Design**: Full functionality without internet connection
6. **Continuous Learning**: ML models retrain nightly using Firebase Functions

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with IndexedDB support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd deepcal-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

The application requires several API keys for full functionality:

- **Groq API**: For enhanced AI conversations in DeepTalk
- **ElevenLabs API**: For high-quality text-to-speech
- **OpenAI API**: Alternative TTS provider
- **Firebase**: For cloud synchronization and training

Configure these through the application's settings interface.

## Data Architecture

### Shipment Data Schema
All shipment data follows strict Zod validation:
- Origin/Destination with coordinates
- Cargo specifications (weight, dimensions, type)
- Forwarder details and pricing
- Route information and transit times
- Risk assessments and reliability scores

### Analytics Engine
The core engine processes real shipment data through:
1. **Neutrosophic Analysis**: Handles uncertain/incomplete data
2. **AHP Weighting**: User-defined priority matrices
3. **TOPSIS Ranking**: Multi-criteria optimization
4. **Grey Prediction**: Trend analysis and forecasting

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- **Lovable Platform**: One-click deployment through Lovable interface
- **Custom Domain**: Configure through Project → Settings → Domains
- **Self-hosted**: Build and deploy to any static hosting service

## API Integration

### Groq AI
```typescript
// Enhanced conversational AI
const response = await deepTalkGroqService.generateResponse(query, context);
```

### Firebase Training
```typescript
// Automated model retraining
const trainingResults = await firebaseTrainingService.trainModel(shipmentData);
```

### Voice Services
```typescript
// Multi-provider TTS
await voiceService.speak(text, { provider: 'elevenlabs' });
```

## Contributing

DeepCAL is developed by Mostar Industries with focus on:
- Clean, maintainable code architecture
- Comprehensive TypeScript typing
- Responsive design principles
- Accessibility standards
- Performance optimization

## Support

For technical support or business inquiries, contact Mostar Industries.

## License

Proprietary software developed by Mostar Industries. All rights reserved.

---

**Mostar Industries** - Revolutionizing logistics through advanced analytics and AI
