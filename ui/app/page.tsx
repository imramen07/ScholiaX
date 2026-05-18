"use client"

import { AppProvider } from '@/lib/store'
import { AppSidebar } from '@/components/app-sidebar'
import { MainContent } from '@/components/main-content'

export default function Home() {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex-1 ml-72 h-full">
          <MainContent />
        </div>
      </div>
    </AppProvider>
  )
}
