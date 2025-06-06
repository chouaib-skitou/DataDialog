"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import MessageItem from "./MessageItem"
import threadServiceInstance, { type Thread } from "@/services/ThreadService"
import Loader from "@/components/Shared/Loader"

interface MessageListProps {
  threadId: string
}

const MessageList: React.FC<MessageListProps> = ({ threadId }) => {
  const [thread, setThread] = useState<Thread | null | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThread(threadServiceInstance.getThreadById(threadId))
  }, [threadId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [thread?.messages])

  if (thread === undefined) {
    return <Loader />
  }

  if (thread === null) {
    return <div className="p-6 text-gray-500">Fil de discussion non trouvé.</div>
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
      {thread.messages.map((message) => (
        <MessageItem key={message.messageId} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
