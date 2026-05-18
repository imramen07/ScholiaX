"use client"

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  BookOpen,
  Sparkles,
  Loader2,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react'
import { useApp } from '@/lib/store'
import type { ChatMessage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const sampleChapterContent = `# Chapter 3: Sorting Algorithms

## 3.1 Introduction to Sorting

Sorting is one of the most fundamental operations in computer science. A sorting algorithm arranges elements of a list in a certain order, typically ascending or descending.

## 3.2 Bubble Sort

Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order.

**Time Complexity:**
- Best Case: O(n)
- Average Case: O(n²)
- Worst Case: O(n²)

**Space Complexity:** O(1)

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
\`\`\`

## 3.3 Quick Sort

Quick Sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot.

**Time Complexity:**
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n²)

**Space Complexity:** O(log n)

## 3.4 Merge Sort

Merge Sort divides the array into two halves, recursively sorts them, and then merges the sorted halves.

**Time Complexity:** O(n log n) for all cases
**Space Complexity:** O(n)`

export function PreparationMode() {
  const { documents, chatMessages, addChatMessage, isProcessing, setIsProcessing } = useApp()
  const [selectedDoc, setSelectedDoc] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const textbooks = documents.filter(d => d.type === 'textbook' && d.status === 'indexed')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    addChatMessage(userMessage)
    setInputValue('')
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on the textbook content, here's a summary:\n\n**Key Points:**\n1. Sorting algorithms arrange elements in a specific order\n2. Bubble Sort has O(n²) time complexity\n3. Quick Sort uses divide-and-conquer with O(n log n) average case\n4. Merge Sort guarantees O(n log n) for all cases\n\nWould you like me to elaborate on any specific algorithm?`,
        `Great question! Let me explain:\n\n**Quick Sort vs Merge Sort:**\n\n• **Quick Sort** is generally faster in practice due to better cache performance and in-place sorting\n• **Merge Sort** provides guaranteed O(n log n) performance and is stable\n• For large datasets, Quick Sort is preferred unless stability is required\n\nThe textbook recommends Quick Sort for general-purpose sorting.`,
        `Here's what the chapter says about this topic:\n\n> "Sorting is one of the most fundamental operations in computer science."\n\nThe key takeaway is understanding the trade-offs between time complexity, space complexity, and stability when choosing a sorting algorithm for your specific use case.`,
      ]

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      addChatMessage(aiMessage)
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
    <div className="flex h-full">
      {/* Document Viewer - Left Pane */}
      <div className="flex-1 flex flex-col border-r border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">Document Viewer</span>
          </div>
          <Select value={selectedDoc} onValueChange={setSelectedDoc}>
            <SelectTrigger className="w-64 h-8 text-xs">
              <SelectValue placeholder="Select a textbook" />
            </SelectTrigger>
            <SelectContent>
              {textbooks.map(doc => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 p-6">
          {selectedDoc ? (
            <article className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                {sampleChapterContent.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={i} className="text-xl font-bold text-foreground mt-0 mb-4">
                        {line.replace('# ', '')}
                      </h1>
                    )
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
                        {line.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold text-foreground my-2">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    )
                  }
                  if (line.startsWith('```')) {
                    return null
                  }
                  if (line.startsWith('def ') || line.startsWith('    ')) {
                    return (
                      <code key={i} className="block bg-muted px-3 py-0.5 text-xs font-mono text-primary">
                        {line}
                      </code>
                    )
                  }
                  return (
                    <p key={i} className="text-muted-foreground my-1">
                      {line || '\u00A0'}
                    </p>
                  )
                })}
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Select a textbook to view its content</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Choose from indexed documents in the dropdown above
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* AI Chat Panel - Right Pane */}
      <div className="w-[420px] flex flex-col bg-card">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground">AI Assistant</span>
          <Badge variant="outline" className="ml-auto text-xs">
            Chapter Summarizer
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Ask questions about the selected chapter
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Summarize this chapter',
                    'Explain Quick Sort algorithm',
                    'Compare time complexities',
                  ].map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

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
                    'max-w-[90%] rounded-xl px-4 py-2.5 text-sm',
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
              <div className="flex items-start gap-2">
                <div className="bg-muted rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Retrieving & reranking context...
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this chapter..."
              className="min-h-[44px] max-h-[120px] resize-none text-sm"
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
      </div>
    </div>
  )
}
