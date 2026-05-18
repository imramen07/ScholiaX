"use client"

import { useState, useRef, useEffect } from 'react'
import {
  FileQuestion,
  Send,
  Loader2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Copy,
  Check,
  BookOpen,
  MessageSquare,
} from 'lucide-react'
import { useApp } from '@/lib/store'
import type { ChatMessage, ExamQuestion } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const sampleQuestions: ExamQuestion[] = [
  {
    id: '1',
    questionNumber: 'Q1a',
    content:
      'Explain the working principle of Quick Sort algorithm with a suitable example. Also analyze its time complexity for best, average, and worst cases.',
    marks: 10,
    markingScheme:
      '• Divide and conquer approach (2 marks)\n• Pivot selection and partitioning (3 marks)\n• Example with step-by-step execution (3 marks)\n• Time complexity analysis (2 marks)',
  },
  {
    id: '2',
    questionNumber: 'Q1b',
    content: 'Compare and contrast Merge Sort and Quick Sort. When would you prefer one over the other?',
    marks: 5,
    markingScheme:
      '• Time complexity comparison (1 mark)\n• Space complexity comparison (1 mark)\n• Stability comparison (1 mark)\n• Use case scenarios (2 marks)',
  },
  {
    id: '3',
    questionNumber: 'Q2a',
    content:
      'What is a Binary Search Tree (BST)? Explain insertion and deletion operations with examples.',
    marks: 10,
    markingScheme:
      '• BST definition and properties (2 marks)\n• Insertion algorithm with example (4 marks)\n• Deletion algorithm (all 3 cases) with example (4 marks)',
  },
  {
    id: '4',
    questionNumber: 'Q2b',
    content: 'Discuss the concept of AVL trees and explain the four rotation cases with diagrams.',
    marks: 8,
    markingScheme:
      '• AVL tree definition and balance factor (2 marks)\n• LL rotation (1.5 marks)\n• RR rotation (1.5 marks)\n• LR rotation (1.5 marks)\n• RL rotation (1.5 marks)',
  },
  {
    id: '5',
    questionNumber: 'Q3',
    content:
      'Implement Dijkstra\'s shortest path algorithm and trace its execution on a given weighted graph.',
    marks: 12,
    markingScheme:
      '• Algorithm explanation (3 marks)\n• Pseudocode/Implementation (4 marks)\n• Step-by-step tracing (3 marks)\n• Time complexity analysis (2 marks)',
  },
]

export function PaperExplainerMode() {
  const { documents, isProcessing, setIsProcessing } = useApp()
  const [selectedPaper, setSelectedPaper] = useState<string>('')
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const papers = documents.filter(d => d.type === 'pyp' && d.status === 'indexed')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleQuestionClick = (question: ExamQuestion) => {
    setSelectedQuestion(question)
    setChatMessages([])
    setIsDrawerOpen(true)

    // Auto-populate with explanation request
    setTimeout(() => {
      const autoMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `Explain this question and provide a model answer:\n\n"${question.content}"`,
        timestamp: new Date(),
      }
      setChatMessages([autoMessage])
      setIsProcessing(true)

      // Simulate AI response
      setTimeout(() => {
        const explanations: Record<string, string> = {
          '1': `**Understanding Quick Sort**

Quick Sort is a highly efficient, comparison-based sorting algorithm that uses the divide-and-conquer paradigm.

**Working Principle:**

1. **Choose a Pivot**: Select an element from the array as the pivot (commonly the last element, first element, or median)

2. **Partitioning**: Rearrange elements so that:
   - Elements smaller than pivot go to its left
   - Elements larger than pivot go to its right

3. **Recursion**: Apply the same process to the left and right subarrays

**Example with arr = [8, 4, 7, 3, 1, 9, 2]:**

Step 1: Pivot = 2, After partition: [1, 2, 7, 3, 8, 9, 4]
Step 2: Left [1] sorted, Right [7, 3, 8, 9, 4] with pivot = 4
Step 3: Continue recursively...

**Time Complexity:**
- **Best Case O(n log n)**: When pivot divides array into equal halves
- **Average Case O(n log n)**: Expected performance with random data
- **Worst Case O(n²)**: When array is already sorted (poor pivot choice)

**Key Point**: Randomized pivot selection helps avoid worst case in practice.`,
          '2': `**Merge Sort vs Quick Sort Comparison**

| Aspect | Merge Sort | Quick Sort |
|--------|-----------|------------|
| Time (Best) | O(n log n) | O(n log n) |
| Time (Worst) | O(n log n) | O(n²) |
| Space | O(n) | O(log n) |
| Stability | Stable | Not Stable |
| Cache | Poor | Excellent |

**When to use Merge Sort:**
- Stability is required (maintaining relative order)
- Working with linked lists
- External sorting (data doesn't fit in memory)

**When to use Quick Sort:**
- In-memory sorting with arrays
- Cache performance matters
- Average case performance is acceptable`,
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            explanations[question.id] ||
            `**Model Answer for ${question.questionNumber}**\n\nBased on the textbook context and marking scheme, here's a comprehensive answer...\n\n${question.content}\n\nThis question tests your understanding of fundamental concepts. Focus on providing clear definitions, step-by-step explanations, and relevant examples to score full marks.`,
          timestamp: new Date(),
        }

        setChatMessages(prev => [...prev, aiMessage])
        setIsProcessing(false)
      }, 2000)
    }, 300)
  }

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on the textbook context and the specific marking criteria:\n\n${inputValue.includes('example') ? 'Here\'s a detailed example...' : 'Let me clarify this concept...'}\n\nThe key points to remember are:\n1. Focus on the fundamental principles\n2. Provide step-by-step explanations\n3. Include relevant diagrams where applicable\n4. Analyze time/space complexity if asked\n\nThis approach should help you score maximum marks on this question.`,
        timestamp: new Date(),
      }

      setChatMessages(prev => [...prev, aiMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <FileQuestion className="h-5 w-5 text-info" />
          <div>
            <h1 className="font-semibold text-foreground">Paper Explainer</h1>
            <p className="text-xs text-muted-foreground">
              Click on any question to get detailed explanations
            </p>
          </div>
        </div>
        <Select value={selectedPaper} onValueChange={setSelectedPaper}>
          <SelectTrigger className="w-64 h-9">
            <SelectValue placeholder="Select exam paper" />
          </SelectTrigger>
          <SelectContent>
            {papers.map(paper => (
              <SelectItem key={paper.id} value={paper.id}>
                {paper.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Questions Grid */}
      <ScrollArea className="flex-1 p-6">
        {selectedPaper ? (
          <div className="space-y-4">
            {sampleQuestions.map((question, idx) => (
              <Card
                key={question.id}
                className={cn(
                  'bg-card hover:bg-muted/50 transition-all cursor-pointer group border-l-4',
                  selectedQuestion?.id === question.id
                    ? 'border-l-primary bg-primary/5'
                    : 'border-l-transparent'
                )}
                onClick={() => handleQuestionClick(question)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold text-foreground">
                      {question.questionNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        {question.content}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {question.marks} marks
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary gap-1"
                          onClick={e => {
                            e.stopPropagation()
                            handleQuestionClick(question)
                          }}
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
                          Solve Doubt
                        </Button>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <FileQuestion className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">Select an Exam Paper</p>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a previous year paper from the dropdown to view questions
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Solve Doubts Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[520px] sm:max-w-[520px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <SheetTitle>Solve Doubts</SheetTitle>
            </div>
            {selectedQuestion && (
              <div className="mt-2 p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {selectedQuestion.questionNumber}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedQuestion.marks} marks
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {selectedQuestion.content}
                </p>
              </div>
            )}
          </SheetHeader>

          {/* Marking Scheme */}
          {selectedQuestion?.markingScheme && (
            <div className="px-6 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs font-medium text-foreground">Marking Scheme</span>
              </div>
              <div className="text-xs text-muted-foreground whitespace-pre-line">
                {selectedQuestion.markingScheme}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
            <div className="space-y-4">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col gap-1',
                    message.role === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[95%] rounded-xl px-4 py-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground"
                      onClick={() => handleCopy(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-start">
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Retrieving textbook context...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up question..."
                className="min-h-[44px] max-h-[100px] resize-none text-sm"
                rows={1}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim() || isProcessing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
