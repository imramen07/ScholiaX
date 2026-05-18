"use client"

import { useApp } from '@/lib/store'
import { DashboardMode } from '@/components/modes/dashboard-mode'
import { PreparationMode } from '@/components/modes/preparation-mode'
import { PaperExplainerMode } from '@/components/modes/paper-explainer-mode'
import { TestingMode } from '@/components/modes/testing-mode'
import { cn } from '@/lib/utils'

export function MainContent() {
  const { currentMode } = useApp()

  return (
    <main className="flex-1 h-full overflow-hidden">
      <div
        className={cn(
          'h-full mode-transition',
          currentMode === 0 && 'overflow-auto'
        )}
      >
        {currentMode === 0 && <DashboardMode />}
        {currentMode === 1 && <PreparationMode />}
        {currentMode === 2 && <PaperExplainerMode />}
        {currentMode === 3 && <TestingMode />}
      </div>
    </main>
  )
}
