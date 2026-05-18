"use client"

import {
  BookOpen,
  FileText,
  Trophy,
  Flame,
  Target,
  BookCheck,
  FileQuestion,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Mode } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const modeCards: {
  id: Mode
  title: string
  description: string
  icon: typeof BookOpen
  color: string
}[] = [
  {
    id: 1,
    title: 'Preparation Mode',
    description: 'Study textbook chapters with AI-powered summaries and quick reference queries.',
    icon: BookOpen,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 2,
    title: 'Paper Explainer',
    description: 'Analyze previous year papers with detailed explanations and marking schemes.',
    icon: FileQuestion,
    color: 'bg-info/10 text-info',
  },
  {
    id: 3,
    title: 'Testing Mode',
    description: 'Challenge yourself with AI-generated viva questions and get instant grading.',
    icon: ClipboardCheck,
    color: 'bg-success/10 text-success',
  },
]

export function DashboardMode() {
  const { documents, stats, setCurrentMode } = useApp()

  const textbooks = documents.filter(d => d.type === 'textbook' && d.status === 'indexed')
  const papers = documents.filter(d => d.type === 'pyp' && d.status === 'indexed')

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, Scholar</h1>
        <p className="text-muted-foreground">
          Your AI-powered study companion is ready. Choose a mode to begin.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.documentsIndexed}</p>
                <p className="text-xs text-muted-foreground">Documents Indexed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <BookCheck className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.questionsAnswered}</p>
                <p className="text-xs text-muted-foreground">Questions Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Flame className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.studyStreak} days</p>
                <p className="text-xs text-muted-foreground">Study Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Points Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats.rewardPoints.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Reward Points Earned</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Next Milestone</p>
              <Progress value={(stats.rewardPoints % 500) / 5} className="w-32 h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {500 - (stats.rewardPoints % 500)} points to go
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mode Entry Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            {modeCards.map(mode => (
              <Card
                key={mode.id}
                className="bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => setCurrentMode(mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${mode.color.split(' ')[0]}`}>
                      <mode.icon className={`h-6 w-6 ${mode.color.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{mode.title}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Indexed Documents */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Indexed Documents</h2>

          {textbooks.length > 0 && (
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Textbooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {textbooks.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{doc.name}</span>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                      Indexed
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {papers.length > 0 && (
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-warning" />
                  Previous Year Papers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {papers.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{doc.name}</span>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                      Indexed
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
