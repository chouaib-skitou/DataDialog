"use client"

import type React from "react"
import type { Thread } from "@/services/ThreadService"
import threadServiceInstance from "@/services/ThreadService"

interface ThreadItemProps {
  thread: Thread
  onSelect: (threadId: string) => void
  isSelected: boolean
}

const ThreadItem: React.FC<ThreadItemProps> = ({ thread, onSelect, isSelected }) => {
  const unreadCount = threadServiceInstance.getUnreadMessageCount(thread.threadId)
  const lastMessage = thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : null

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { day: "2-digit", month: "short" })
  }

  return (
    <div
      onClick={() => onSelect(thread.threadId)}
      className={`p-3 cursor-pointer border-b border-gray-200 hover:bg-indigo-50 transition-colors
                  ${isSelected ? "bg-indigo-100 border-l-4 border-indigo-500" : "bg-white"}`}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className={`text-sm font-semibold truncate ${isSelected ? "text-indigo-700" : "text-gray-800"}`}>
          {thread.title}
        </h3>
        {lastMessage && (
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatDate(lastMessage.timestamp)}</span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500 truncate pr-2">
          {lastMessage ? `${lastMessage.author}: ${lastMessage.text.substring(0, 30)}...` : "Aucun message"}
        </p>
        {unreadCount > 0 && (
          <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default ThreadItem
