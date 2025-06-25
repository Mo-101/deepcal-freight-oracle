
"use client"

import React, { useEffect } from "react"
import DeepCALHeader from "@/components/DeepCALHeader"
import DeepTalkHeader from "@/components/deeptalk/DeepTalkHeader"
import DeepTalkMain from "@/components/deeptalk/DeepTalkMain"
import VoiceConfig from "@/components/deeptalk/VoiceConfig"
import { useDeepTalkLogic } from "@/hooks/useDeepTalkLogic"
import { useVoiceConfig } from "@/hooks/useVoiceConfig"

const DeepTalk = () => {
  const {
    messages,
    input,
    setInput,
    isProcessing,
    isListening,
    routeDatabase,
    trainingBufferStatus,
    handleSubmit,
    handleStartListening,
    handleQuickQuery
  } = useDeepTalkLogic()

  const {
    voiceConfig,
    showVoiceConfig,
    setShowVoiceConfig,
    handleVoiceConfigSave
  } = useVoiceConfig()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, voiceConfig)
  }

  const handleQuickQueryWithConfig = (query: string) => {
    handleQuickQuery(query, voiceConfig)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" style={{
      fontFamily: "'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'",
      overflow: 'auto'
    }}>
      {/* Header Section */}
      <div className="w-full">
        <DeepCALHeader />
      </div>

      {/* Mobile Header */}
      <div className="w-full px-4 lg:px-6">
        <DeepTalkHeader 
          trainingBufferStatus={trainingBufferStatus}
          onShowVoiceConfig={() => setShowVoiceConfig(true)}
        />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-full">
          {/* Main Chat Area */}
          <div className="lg:col-span-12">
            <DeepTalkMain
              messages={messages}
              input={input}
              setInput={setInput}
              isProcessing={isProcessing}
              isListening={isListening}
              routeDatabase={routeDatabase}
              trainingBufferStatus={trainingBufferStatus}
              onSubmit={handleFormSubmit}
              onStartListening={handleStartListening}
              onQuickQuery={handleQuickQueryWithConfig}
              onShowVoiceConfig={() => setShowVoiceConfig(true)}
            />
          </div>
        </div>
      </div>

      {/* Voice Config Modal */}
      <VoiceConfig
        isOpen={showVoiceConfig}
        onClose={() => setShowVoiceConfig(false)}
        onConfigSave={handleVoiceConfigSave}
      />

      <style>
        {`
        .oracle-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
        }
        `}
      </style>
    </div>
  )
}

export default DeepTalk
