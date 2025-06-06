"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ThreadList from "@/components/ThreadList/ThreadList"
import MessageList from "@/components/MessageList/MessageList"
import MessageComposer from "@/components/MessageComposer/MessageComposer"
import Header from "@/components/Shared/Header"
import Footer from "@/components/Shared/Footer"
import type { Thread } from "@/services/ThreadService"
import threadServiceInstance from "@/services/ThreadService"

const App: React.FC = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>("thread-1")
  const [threads, setThreads] = useState<Thread[]>([])

  useEffect(() => {
    setThreads(threadServiceInstance.getAllThreads())
  }, [])

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
  }

  const handleMessageSent = () => {
    setThreads([...threadServiceInstance.getAllThreads()])
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r bg-white overflow-y-auto shadow-sm">
          <ThreadList
            onSelectThread={handleSelectThread}
            selectedThreadId={selectedThreadId}
            threads={threads}
            setThreads={setThreads}
          />
        </aside>
        <main className="flex-1 flex flex-col bg-white">
          {selectedThreadId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <MessageList threadId={selectedThreadId} key={selectedThreadId} />
              </div>
              <footer className="border-t bg-gray-50">
                <MessageComposer threadId={selectedThreadId} onMessageSent={handleMessageSent} />
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
              <div className="text-center">
                <p className="text-lg">Sélectionnez un fil de discussion pour démarrer.</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
