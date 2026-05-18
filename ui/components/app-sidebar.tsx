"use client"

import { useState, useCallback } from 'react'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  ClipboardCheck,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'
import type { Mode, Document, ProcessingStep } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

const modes: { id: Mode; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 0, label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Stats' },
  { id: 1, label: 'Preparation', icon: BookOpen, description: 'Study & Summarize' },
  { id: 2, label: 'Paper Explainer', icon: FileQuestion, description: 'Exam Analysis' },
  { id: 3, label: 'Testing', icon: ClipboardCheck, description: 'Viva & Grading' },
]

const scannedPdfSteps: ProcessingStep[] = [
  { label: 'PDF Detected', status: 'complete' },
  { label: 'Running Noise Removal', status: 'complete' },
  { label: 'Running OCR Pipeline (Tesseract/Paddle)', status: 'active' },
  { label: 'Chunking & Embedding', status: 'pending' },
  { label: 'FAISS Vector Store Ready', status: 'pending' },
]

const nativePdfSteps: ProcessingStep[] = [
  { label: 'Native PDF Detected', status: 'complete' },
  { label: 'Chunking', status: 'active' },
  { label: 'Embedded', status: 'pending' },
]

export function AppSidebar() {
  const { currentMode, setCurrentMode, documents, addDocument, updateDocument } = useApp()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState<Document | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)

  const simulateProcessing = useCallback(
    (doc: Document, isScanned: boolean) => {
      const steps = isScanned ? [...scannedPdfSteps] : [...nativePdfSteps]
      setProcessingSteps(steps.map((s, i) => ({ ...s, status: i === 0 ? 'complete' : 'pending' })))
      setProcessingProgress(0)

      let currentStep = 1
      const totalSteps = steps.length
      const progressPerStep = 100 / totalSteps

      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          setProcessingSteps(prev =>
            prev.map((s, i) => ({
              ...s,
              status: i < currentStep ? 'complete' : i === currentStep ? 'active' : 'pending',
            }))
          )
          setProcessingProgress(currentStep * progressPerStep)
          currentStep++
        } else {
          clearInterval(interval)
          setProcessingProgress(100)
          setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'complete' })))

          setTimeout(() => {
            updateDocument(doc.id, { status: 'indexed', processingStep: undefined })
            setUploadingDoc(null)
            setProcessingSteps([])
            setProcessingProgress(0)
          }, 500)
        }
      }, isScanned ? 1500 : 800)

      return () => clearInterval(interval)
    },
    [updateDocument]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const pdfFile = files.find(f => f.type === 'application/pdf')

      if (pdfFile) {
        const isScanned = pdfFile.name.toLowerCase().includes('scan')
        const newDoc: Document = {
          id: Date.now().toString(),
          name: pdfFile.name.replace('.pdf', ''),
          type: pdfFile.name.toLowerCase().includes('pyp') ? 'pyp' : 'textbook',
          status: 'processing',
          isScanned,
          uploadedAt: new Date(),
        }

        addDocument(newDoc)
        setUploadingDoc(newDoc)
        simulateProcessing(newDoc, isScanned)
      }
    },
    [addDocument, simulateProcessing]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'indexed':
        return <CheckCircle2 className="h-3.5 w-3.5 text-success" />
      case 'processing':
        return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
      case 'uploading':
        return <Clock className="h-3.5 w-3.5 text-warning" />
      case 'error':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />
    }
  }

  const getProcessingStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-3.5 w-3.5 text-success" />
      case 'active':
        return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
      case 'pending':
        return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-sidebar flex flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">ScholarX</h1>
          <p className="text-xs text-muted-foreground">AI Study Companion</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Modes
        </p>
        <div className="space-y-1">
          {modes.map(mode => (
            <Button
              key={mode.id}
              variant={currentMode === mode.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-auto py-2.5 px-3',
                currentMode === mode.id && 'bg-sidebar-accent'
              )}
              onClick={() => setCurrentMode(mode.id)}
            >
              <mode.icon
                className={cn(
                  'h-4 w-4',
                  currentMode === mode.id ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{mode.label}</span>
                <span className="text-xs text-muted-foreground">{mode.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </nav>

      <Separator />

      {/* Document Upload */}
      <div className="px-4 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Upload Document
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all cursor-pointer',
            isDragOver
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <Upload
            className={cn(
              'mb-2 h-6 w-6',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <p className="text-xs text-center text-muted-foreground">
            Drop PDF here or click to upload
          </p>
        </div>

        {/* OCR Processing Status */}
        {uploadingDoc && processingSteps.length > 0 && (
          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground truncate pr-2">
                {uploadingDoc.name}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => {
                  setUploadingDoc(null)
                  setProcessingSteps([])
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Progress value={processingProgress} className="h-1.5 mb-3" />
            <div className="space-y-1.5">
              {processingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {getProcessingStepIcon(step.status)}
                  <span
                    className={cn(
                      'text-xs',
                      step.status === 'active'
                        ? 'text-foreground font-medium'
                        : step.status === 'complete'
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/60'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Document Library */}
      <div className="flex-1 px-4 py-4 min-h-0">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Document Library
        </p>
        <ScrollArea className="h-full pr-2">
          <div className="space-y-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                    doc.type === 'textbook' ? 'bg-primary/10' : 'bg-warning/10'
                  )}
                >
                  <FileText
                    className={cn(
                      'h-4 w-4',
                      doc.type === 'textbook' ? 'text-primary' : 'text-warning'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {doc.type === 'textbook' ? 'Textbook' : 'PYPaper'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(doc.status)}
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Powered by Llama 3 & FAISS/BM25
        </p>
      </div>
    </aside>
  )
}
