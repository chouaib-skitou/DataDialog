import { v4 as uuidv4 } from "uuid"
import type { Thread, Message, User, StructuredPart } from "@/types"

// Initial data for demonstration purposes
const users: User[] = [
  { id: "user-alice", name: "Alice" },
  { id: "user-bob", name: "Bob" },
  { id: "user-charlie", name: "Charlie" },
]

const threads: Thread[] = [
  {
    id: "thread-1",
    title: "Discussion Projet Alpha",
    participantIds: ["user-alice", "user-bob"],
    messages: [
      {
        id: uuidv4(),
        threadId: "thread-1",
        senderId: "user-alice",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        text: "Salut Bob, comment avance le projet Alpha ?",
      },
      {
        id: uuidv4(),
        threadId: "thread-1",
        senderId: "user-bob",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        text: "Salut Alice ! Ça avance bien. J'ai une question concernant une offre de stage.",
        structuredParts: [
          {
            id: uuidv4(),
            schemaId: "ext-internship",
            data: {
              company: "Tech Solutions Inc.",
              title: "Développeur React Junior",
              description: "Participer au développement de nouvelles fonctionnalités.",
              startDate: "2025-09-01",
            },
          },
        ],
      },
    ],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "thread-2",
    title: "Organisation Réunion Hebdo",
    participantIds: ["user-alice", "user-charlie"],
    messages: [
      {
        id: uuidv4(),
        threadId: "thread-2",
        senderId: "user-charlie",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        text: "Pour la réunion de demain, qui confirme sa présence ?",
        structuredParts: [
          {
            id: uuidv4(),
            schemaId: "core-checkbox",
            data: { label: "Confirmation présence", isChecked: false },
          },
        ],
      },
      {
        id: uuidv4(),
        threadId: "thread-2",
        senderId: "user-alice",
        timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
        text: "Je serai là!",
        structuredParts: [
          {
            id: uuidv4(),
            schemaId: "core-checkbox",
            data: { label: "Confirmation présence", isChecked: true },
          },
        ],
      },
    ],
    lastUpdated: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
  },
]

export const getCurrentUser = (): User => users[0] // Alice is current user

export const getUsers = (): User[] => [...users] // Return a copy

export const getThreads = (): Thread[] => {
  // Return a copy, sorted by lastUpdated
  return [...threads].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
}

export const getThreadById = (threadId: string): Thread | undefined => {
  const thread = threads.find((t) => t.id === threadId)
  return thread ? { ...thread, messages: [...thread.messages] } : undefined // Return a copy
}

export const createThread = (title: string, participantIds: string[]): Thread => {
  const currentUser = getCurrentUser()
  const newThread: Thread = {
    id: uuidv4(),
    title,
    participantIds: Array.from(new Set([currentUser.id, ...participantIds])), // Ensure current user is included and no duplicates
    messages: [],
    lastUpdated: new Date().toISOString(),
  }
  threads.unshift(newThread) // Add to the beginning for immediate visibility
  return { ...newThread } // Return a copy
}

export const addMessageToThread = (
  threadId: string,
  text?: string,
  structuredParts?: StructuredPart[],
): Message | undefined => {
  const threadIndex = threads.findIndex((t) => t.id === threadId)
  if (threadIndex === -1) return undefined

  const thread = threads[threadIndex]
  const currentUser = getCurrentUser()
  const newMessage: Message = {
    id: uuidv4(),
    threadId,
    senderId: currentUser.id,
    timestamp: new Date().toISOString(),
    text,
    structuredParts,
  }

  // Create new messages array and update thread
  const updatedMessages = [...thread.messages, newMessage]
  const updatedThread = { ...thread, messages: updatedMessages, lastUpdated: newMessage.timestamp }

  // Update the threads array
  threads[threadIndex] = updatedThread

  // Move the updated thread to the top
  threads.splice(threadIndex, 1)
  threads.unshift(updatedThread)

  return { ...newMessage } // Return a copy
}
