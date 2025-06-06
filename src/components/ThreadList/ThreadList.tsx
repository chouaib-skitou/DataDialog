"use client"

import type React from "react"
import { useState } from "react"
import ThreadItem from "./ThreadItem"
import threadServiceInstance, { type Thread } from "@/services/ThreadService"

interface ThreadListProps {
  onSelectThread: (threadId: string) => void
  selectedThreadId: string | null
  threads: Thread[]
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>
}

const ThreadList: React.FC<ThreadListProps> = ({ onSelectThread, selectedThreadId, threads, setThreads }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadParticipants, setNewThreadParticipants] = useState("")

  const handleCreateThread = () => {
    if (!newThreadTitle.trim()) return
    const participantIds = newThreadParticipants
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
    const newThread = threadServiceInstance.createThread(newThreadTitle, participantIds)
    setThreads(threadServiceInstance.getAllThreads())
    setNewThreadTitle("")
    setNewThreadParticipants("")
    setIsCreating(false)
    onSelectThread(newThread.threadId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 px-3 rounded-md"
        >
          {isCreating ? "Annuler" : "Nouveau Fil"}
        </button>
        {isCreating && (
          <div className="mt-3 p-3 border rounded-md bg-gray-50 space-y-2">
            <input
              type="text"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Titre du fil"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              value={newThreadParticipants}
              onChange={(e) => setNewThreadParticipants(e.target.value)}
              placeholder="Participants (ex: user-Bob,user-Charlie)"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleCreateThread}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 px-3 rounded-md"
            >
              Créer
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads
          .sort(
            (a, b) =>
              new Date(b.messages[b.messages.length - 1]?.timestamp || b.creationDate).getTime() -
              new Date(a.messages[a.messages.length - 1]?.timestamp || a.creationDate).getTime(),
          )
          .map((thread) => (
            <ThreadItem
              key={thread.threadId}
              thread={thread}
              onSelect={onSelectThread}
              isSelected={selectedThreadId === thread.threadId}
            />
          ))}
      </div>
    </div>
  )
}

export default ThreadList
