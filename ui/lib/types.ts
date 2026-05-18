export type Mode = 0 | 1 | 2 | 3

export interface Document {
  id: string
  name: string
  type: 'textbook' | 'pyp' // Previous Year Paper
  status: 'uploading' | 'processing' | 'indexed' | 'error'
  processingStep?: string
  isScanned?: boolean
  uploadedAt: Date
}

export interface ProcessingStep {
  label: string
  status: 'pending' | 'active' | 'complete'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface VivaQuestion {
  id: string
  question: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface GradingResult {
  score: number
  maxScore: number
  feedback: string
  strengths: string[]
  improvements: string[]
  rewardPoints: number
}

export interface ExamQuestion {
  id: string
  questionNumber: string
  content: string
  marks: number
  markingScheme?: string
}

export interface LearningStats {
  documentsIndexed: number
  questionsAnswered: number
  averageScore: number
  rewardPoints: number
  studyStreak: number
}
