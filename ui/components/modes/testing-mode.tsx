"use client"

import { useState, useEffect } from 'react'
import {
  ClipboardCheck,
  Lock,
  Unlock,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Loader2,
  Award,
  Target,
  TrendingUp,
  Star,
} from 'lucide-react'
import { useApp } from '@/lib/store'
import type { VivaQuestion, GradingResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const sampleVivaQuestions: VivaQuestion[] = [
  {
    id: '1',
    question: 'Explain the difference between a stack and a queue data structure. When would you use each?',
    topic: 'Data Structures',
    difficulty: 'easy',
  },
  {
    id: '2',
    question: 'What is the time complexity of searching in a balanced BST versus an unbalanced one? Explain why.',
    topic: 'Trees',
    difficulty: 'medium',
  },
  {
    id: '3',
    question: 'Describe how Quick Sort handles the worst-case scenario. What optimizations can prevent it?',
    topic: 'Sorting Algorithms',
    difficulty: 'medium',
  },
  {
    id: '4',
    question: 'Compare DFS and BFS graph traversal algorithms. What are their space complexities?',
    topic: 'Graph Algorithms',
    difficulty: 'medium',
  },
  {
    id: '5',
    question: 'Explain the concept of amortized analysis using dynamic arrays as an example.',
    topic: 'Algorithm Analysis',
    difficulty: 'hard',
  },
]

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function TestingMode() {
  const {
    isTestFrozen,
    setTestFrozen,
    lastGradingResult,
    setLastGradingResult,
    stats,
    updateStats,
    isProcessing,
    setIsProcessing,
  } = useApp()

  const [currentQuestion, setCurrentQuestion] = useState<VivaQuestion>(sampleVivaQuestions[0])
  const [answer, setAnswer] = useState('')
  const [isGrading, setIsGrading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Prevent page refresh if test is frozen
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTestFrozen) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isTestFrozen])

  const handleGenerateQuestion = () => {
    if (isTestFrozen) return

    setIsProcessing(true)
    setLastGradingResult(null)
    setAnswer('')

    setTimeout(() => {
      const nextIndex = (questionIndex + 1) % sampleVivaQuestions.length
      setQuestionIndex(nextIndex)
      setCurrentQuestion(sampleVivaQuestions[nextIndex])
      setIsProcessing(false)
    }, 1000)
  }

  const handleSubmitAnswer = () => {
    if (!answer.trim() || isGrading) return

    setIsGrading(true)

    // Simulate grading with AI
    setTimeout(() => {
      const score = Math.floor(Math.random() * 4) + 7 // 7-10 range for demo
      const maxScore = 10
      const percentage = (score / maxScore) * 100

      const feedback = [
        'Good understanding of fundamental concepts.',
        'Your explanation was clear and well-structured.',
        'Consider adding more specific examples.',
        'Time complexity analysis could be more detailed.',
      ]

      const strengths = [
        'Clear definition of concepts',
        'Good use of technical terminology',
        'Logical flow of explanation',
      ].slice(0, Math.floor(Math.random() * 2) + 2)

      const improvements = [
        'Include more real-world examples',
        'Elaborate on edge cases',
        'Add time/space complexity analysis',
      ].slice(0, Math.floor(Math.random() * 2) + 1)

      const rewardPoints = Math.floor(score * 15)

      const result: GradingResult = {
        score,
        maxScore,
        feedback: feedback[Math.floor(Math.random() * feedback.length)],
        strengths,
        improvements,
        rewardPoints,
      }

      setLastGradingResult(result)
      setIsGrading(false)

      // Update stats
      updateStats({
        questionsAnswered: stats.questionsAnswered + 1,
        rewardPoints: stats.rewardPoints + rewardPoints,
        averageScore: Math.round(
          (stats.averageScore * stats.questionsAnswered + percentage) /
            (stats.questionsAnswered + 1)
        ),
      })

      // Show confetti for high scores
      if (score >= 9) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }, 2500)
  }

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="flex h-full">
      {/* Main Testing Area */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header with Freeze Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-success" />
            <div>
              <h1 className="font-semibold text-foreground">Testing Mode</h1>
              <p className="text-xs text-muted-foreground">
                Answer viva questions and get instant AI grading
              </p>
            </div>
          </div>

          {/* Mode Freeze Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="freeze-mode"
                checked={isTestFrozen}
                onCheckedChange={setTestFrozen}
              />
              <Label
                htmlFor="freeze-mode"
                className={cn(
                  'flex items-center gap-1.5 text-sm cursor-pointer',
                  isTestFrozen ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {isTestFrozen ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Test Locked
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    Test Unlocked
                  </>
                )}
              </Label>
            </div>
          </div>
        </div>

        {/* Freeze Warning */}
        {isTestFrozen && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Test mode is locked. Page refresh and navigation are disabled to prevent cheating.
            </p>
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-6 bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={difficultyColors[currentQuestion.difficulty]}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() +
                    currentQuestion.difficulty.slice(1)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.topic}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateQuestion}
                disabled={isProcessing || isTestFrozen}
                className="gap-1.5"
              >
                <RefreshCw className={cn('h-3.5 w-3.5', isProcessing && 'animate-spin')} />
                New Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="space-y-3 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">{currentQuestion.question}</p>
            )}
          </CardContent>
        </Card>

        {/* Answer Input */}
        <div className="flex-1 flex flex-col">
          <Label className="mb-2 text-sm font-medium text-foreground">Your Answer</Label>
          <Textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here. Be thorough and include relevant examples..."
            className="flex-1 min-h-[200px] resize-none text-sm"
            disabled={isGrading}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              {answer.length} characters • {answer.split(/\s+/).filter(Boolean).length} words
            </p>
            <Button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || isGrading}
              className="gap-2"
            >
              {isGrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Answer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Grading Results Panel */}
      <div className="w-[380px] border-l border-border bg-card p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Grading Results</h2>
        </div>

        {isGrading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-foreground font-medium">AI is grading your answer...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Comparing with textbook context
            </p>
            <div className="mt-4 space-y-2 w-full max-w-[200px]">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5 mx-auto" />
              <Skeleton className="h-3 w-3/5 mx-auto" />
            </div>
          </div>
        ) : lastGradingResult ? (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center py-6 rounded-xl bg-muted/50">
              <div className="relative inline-block">
                <div
                  className={cn(
                    'text-5xl font-bold',
                    getScoreColor(lastGradingResult.score, lastGradingResult.maxScore)
                  )}
                >
                  {lastGradingResult.score}
                </div>
                <div className="text-lg text-muted-foreground">
                  / {lastGradingResult.maxScore}
                </div>
              </div>
              <Progress
                value={(lastGradingResult.score / lastGradingResult.maxScore) * 100}
                className="w-32 h-2 mx-auto mt-4"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {lastGradingResult.score >= 9
                  ? 'Excellent!'
                  : lastGradingResult.score >= 7
                  ? 'Good job!'
                  : 'Keep practicing!'}
              </p>
            </div>

            {/* Reward Points */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Reward Points</span>
              </div>
              <span className="text-xl font-bold text-primary">
                +{lastGradingResult.rewardPoints}
              </span>
            </div>

            {/* Feedback */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Feedback
              </h3>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                {lastGradingResult.feedback}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Strengths
              </h3>
              <ul className="space-y-1.5">
                {lastGradingResult.strengths.map((strength, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <Star className="h-3 w-3 text-success mt-0.5 shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-warning" />
                Areas for Improvement
              </h3>
              <ul className="space-y-1.5">
                {lastGradingResult.improvements.map((improvement, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <Target className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Award className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">
              Submit your answer to see grading results
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              AI will evaluate based on textbook context
            </p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-auto pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{stats.questionsAnswered}</p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Star
                className="h-4 w-4"
                style={{
                  color: ['#fbbf24', '#a855f7', '#22c55e', '#3b82f6'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
