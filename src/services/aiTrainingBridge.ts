
import { firebaseTrainingService } from './firebaseTrainingService'

interface ConversationSample {
  userInput: string
  aiResponse: string
  context: any
  timestamp: string
  intent: string
  metrics: {
    responseLength: number
    confidence: number
    routeDataUsed: boolean
  }
}

class AITrainingBridge {
  private static instance: AITrainingBridge
  private conversationBuffer: ConversationSample[] = []
  private readonly BUFFER_SIZE = 10

  private constructor() {}

  public static getInstance(): AITrainingBridge {
    if (!AITrainingBridge.instance) {
      AITrainingBridge.instance = new AITrainingBridge()
    }
    return AITrainingBridge.instance
  }

  async logConversationToTraining(
    userInput: string, 
    aiResponse: string, 
    context: any
  ): Promise<void> {
    const sample: ConversationSample = {
      userInput,
      aiResponse,
      context: {
        intent: context.intent,
        routeCount: context.routeDatabase?.length || 0,
        hasShipmentContext: !!context.currentShipment
      },
      timestamp: new Date().toISOString(),
      intent: context.intent || 'unknown',
      metrics: {
        responseLength: aiResponse.length,
        confidence: 0.9,
        routeDataUsed: context.routeDatabase?.length > 0
      }
    }

    // Add to buffer
    this.conversationBuffer.push(sample)
    console.log(`📊 Added conversation to training buffer (${this.conversationBuffer.length}/${this.BUFFER_SIZE})`)

    // Flush buffer when full
    if (this.conversationBuffer.length >= this.BUFFER_SIZE) {
      await this.flushTrainingBuffer()
    }
  }

  private async flushTrainingBuffer(): Promise<void> {
    if (this.conversationBuffer.length === 0) return

    try {
      console.log('🚀 Flushing conversation buffer to training system...')
      
      // Convert conversations to training format
      const trainingData = this.conversationBuffer.map(sample => ({
        input: sample.userInput,
        output: sample.aiResponse,
        metadata: {
          intent: sample.intent,
          timestamp: sample.timestamp,
          metrics: sample.metrics
        }
      }))

      // Send to Firebase training service (mock implementation for now)
      // In real implementation, this would upload to Firestore training_samples collection
      console.log('📤 Training samples ready:', trainingData.length)
      
      // Clear buffer
      this.conversationBuffer = []
      console.log('✅ Training buffer flushed successfully')

    } catch (error) {
      console.error('❌ Failed to flush training buffer:', error)
    }
  }

  getBufferStatus(): { count: number; maxSize: number } {
    return {
      count: this.conversationBuffer.length,
      maxSize: this.BUFFER_SIZE
    }
  }

  async forceFlush(): Promise<void> {
    await this.flushTrainingBuffer()
  }
}

const aiTrainingBridge = AITrainingBridge.getInstance()

export const logConversationToTraining = (userInput: string, aiResponse: string, context: any) => 
  aiTrainingBridge.logConversationToTraining(userInput, aiResponse, context)

export const getTrainingBufferStatus = () => aiTrainingBridge.getBufferStatus()

export const flushTrainingBuffer = () => aiTrainingBridge.forceFlush()
