"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Mode, Document, ChatMessage, LearningStats, GradingResult } from './types'

interface AppState {
  currentMode: Mode
  setCurrentMode: (mode: Mode) => void
  documents: Document[]
  addDocument: (doc: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  removeDocument: (id: string) => void
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  stats: LearningStats
  updateStats: (updates: Partial<LearningStats>) => void
  isTestFrozen: boolean
  setTestFrozen: (frozen: boolean) => void
  lastGradingResult: GradingResult | null
  setLastGradingResult: (result: GradingResult | null) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<Mode>(0)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Data Structures & Algorithms',
      type: 'textbook',
      status: 'indexed',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Operating Systems Concepts',
      type: 'textbook',
      status: 'indexed',
      uploadedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'DSA Mid-Term 2023',
      type: 'pyp',
      status: 'indexed',
      uploadedAt: new Date('2024-02-01'),
    },
  ])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [stats, setStats] = useState<LearningStats>({
    documentsIndexed: 3,
    questionsAnswered: 47,
    averageScore: 78,
    rewardPoints: 1250,
    studyStreak: 7,
  })
  const [isTestFrozen, setTestFrozen] = useState(false)
  const [lastGradingResult, setLastGradingResult] = useState<GradingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const addDocument = useCallback((doc: Document) => {
    setDocuments(prev => [...prev, doc])
  }, [])

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    )
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }, [])

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatMessages(prev => [...prev, message])
  }, [])

  const clearChat = useCallback(() => {
    setChatMessages([])
  }, [])

  const updateStats = useCallback((updates: Partial<LearningStats>) => {
    setStats(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        documents,
        addDocument,
        updateDocument,
        removeDocument,
        chatMessages,
        addChatMessage,
        clearChat,
        stats,
        updateStats,
        isTestFrozen,
        setTestFrozen,
        lastGradingResult,
        setLastGradingResult,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
