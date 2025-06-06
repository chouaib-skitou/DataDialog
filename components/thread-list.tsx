"use client"
import type { Thread, User } from "@/types"
import { cn, formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Assuming shadcn/ui

interface ThreadListProps {
  threads: Thread[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  currentUser: User
}

export function ThreadList({ threads, selectedThreadId, onSelectThread, currentUser }: ThreadListProps) {
  if (threads.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Aucun fil de discussion. Créez-en un !</div>
  }

  return (
    <div className="p-2 space-y-1">
      {threads.map((thread) => {
        const lastMessage = thread.messages[thread.messages.length - 1]

        // Determine display name for participants
        const otherParticipantNames =
          thread.participantIds
            .filter((id) => id !== currentUser.id)
            .map((id) => id.replace("user-", "").charAt(0).toUpperCase() + id.replace("user-", "").slice(1)) // Capitalize
            .join(", ") || "Vous-même"

        const getInitials = (name: string) => name.substring(0, 2).toUpperCase()

        return (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={cn(
              "w-full text-left p-3 rounded-md hover:bg-muted/50 transition-colors flex items-start space-x-3",
              selectedThreadId === thread.id && "bg-secondary hover:bg-secondary",
            )}
          >
            <Avatar className="h-10 w-10 border">
              {/* Placeholder for group avatar or first participant */}
              <AvatarFallback>{getInitials(thread.title)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h3 className="font-semibold text-sm truncate text-foreground">{thread.title}</h3>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatDate(lastMessage.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate" title={otherParticipantNames}>
                {otherParticipantNames}
              </p>
              {lastMessage && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  <span className={cn(lastMessage.senderId === currentUser.id && "font-medium")}>
                    {lastMessage.senderId === currentUser.id
                      ? "Vous: "
                      : `${lastMessage.senderId.replace("user-", "")}: `}
                  </span>
                  {lastMessage.text?.substring(0, 25) || "Élément structuré"}
                  {lastMessage.text && lastMessage.text.length > 25 ? "..." : ""}
                </p>
              )}
              {!lastMessage && <p className="text-xs text-muted-foreground italic mt-0.5">Aucun message</p>}
            </div>
          </button>
        )
      })}
    </div>
  )
}
