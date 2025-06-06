"use client"

import { useState, useEffect, useCallback } from "react"
import { ThreadList } from "@/components/thread-list"
import { MessageArea } from "@/components/message-area"
import type { Thread, User } from "@/types"
import { getThreads, getThreadById, getCurrentUser, createThread as createNewThread } from "@/services/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

export default function DataDialogApp() {
  const [threads, setThreadsState] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadParticipantIds, setNewThreadParticipantIds] = useState("")

  const refreshData = useCallback(() => {
    const currentThreads = getThreads()
    setThreadsState(currentThreads)
    if (selectedThread) {
      const updatedSelected = currentThreads.find((t) => t.id === selectedThread.id)
      setSelectedThread(updatedSelected || (currentThreads.length > 0 ? currentThreads[0] : null))
    } else if (currentThreads.length > 0) {
      setSelectedThread(currentThreads[0])
    }
  }, [selectedThread])

  useEffect(() => {
    setCurrentUser(getCurrentUser())
    refreshData()
  }, [refreshData])

  const handleSelectThread = (threadId: string) => {
    const thread = getThreadById(threadId)
    setSelectedThread(thread || null)
  }

  const handleMessageSent = () => {
    refreshData()
  }

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !currentUser) return
    const participantIds = newThreadParticipantIds
      .split(",")
      .map((id) => id.trim().toLowerCase()) // Standardize IDs
      .filter((id) => id !== currentUser.id && id !== "")

    const newThread = createNewThread(newThreadTitle, participantIds)
    setNewThreadTitle("")
    setNewThreadParticipantIds("")
    setIsCreateThreadOpen(false)
    refreshData() // Refresh all data
    setSelectedThread(newThread) // Select the newly created thread
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-card">
        <h2 className="text-lg font-semibold text-primary">Fils de discussion</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsCreateThreadOpen(true)} title="Nouveau fil">
          <PlusCircle className="h-5 w-5 text-primary" />
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r bg-card overflow-y-auto">
          <ThreadList
            threads={threads}
            selectedThreadId={selectedThread?.id || null}
            onSelectThread={handleSelectThread}
            currentUser={currentUser}
          />
        </aside>
        <main className="flex-1 flex flex-col bg-background">
          {selectedThread ? (
            <MessageArea
              key={selectedThread.id}
              thread={selectedThread}
              currentUser={currentUser}
              onMessageSent={handleMessageSent}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Sélectionnez un fil pour afficher les messages ou créez-en un nouveau.</p>
            </div>
          )}
        </main>
      </div>

      <Dialog open={isCreateThreadOpen} onOpenChange={setIsCreateThreadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau fil de discussion</DialogTitle>
            <DialogDescription>
              Entrez un titre et les IDs des participants (ex: user-bob, user-charlie).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Titre du fil"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <Input
              placeholder="IDs des participants (séparés par une virgule)"
              value={newThreadParticipantIds}
              onChange={(e) => setNewThreadParticipantIds(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleCreateThread}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
