"use client"
import { useEffect, useRef } from "react"
import type { Thread, User, StructuredPart } from "@/types"
import { MessageItem } from "@/components/message-item"
import { MessageComposer } from "@/components/message-composer"
import { addMessageToThread } from "@/services/data-service"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming shadcn/ui

interface MessageAreaProps {
  thread: Thread
  currentUser: User
  onMessageSent: () => void
}

export function MessageArea({ thread, currentUser, onMessageSent }: MessageAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [thread.messages])

  const handleSendMessage = (text?: string, structuredParts?: StructuredPart[]) => {
    addMessageToThread(thread.id, text, structuredParts)
    onMessageSent()
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {" "}
      {/* Ensure parent has height */}
      <div className="p-3 border-b bg-card">
        <h2 className="text-lg font-semibold text-primary">{thread.title}</h2>
        <p className="text-sm text-muted-foreground">
          Avec:{" "}
          {thread.participantIds
            .filter((id) => id !== currentUser.id)
            .map((id) => id.replace("user-", ""))
            .join(", ") || "vous-même"}
        </p>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {thread.messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} currentUser={currentUser} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-3 bg-card">
        <MessageComposer onSend={handleSendMessage} />
      </div>
    </div>
  )
}
