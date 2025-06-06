import { v4 as uuidv4 } from "uuid"

export interface Annotation {
  type: string
  id: string
  label: string
  data: any
  version: string
}

export interface Message {
  messageId: string
  parentId: string | null
  author: string
  timestamp: string
  isRead: boolean
  text: string
  annotations: Annotation[]
}

export interface Thread {
  threadId: string
  title: string
  participants: string[]
  creationDate: string
  tags: string[]
  messages: Message[]
}

const threads: Thread[] = [
  {
    threadId: "thread-1",
    title: "Discussion Projet Alpha",
    participants: ["user-Alice", "user-Bob"],
    creationDate: new Date().toISOString(),
    tags: ["projet", "urgent"],
    messages: [
      {
        messageId: "msg-1-1",
        parentId: null,
        author: "user-Alice",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isRead: true,
        text: "Salut Bob, tu as vu les dernières specs ?",
        annotations: [],
      },
      {
        messageId: "msg-1-2",
        parentId: null,
        author: "user-Bob",
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        isRead: false,
        text: 'Oui, je regarde ça. Il y a un point sur la section "Stage" qui me semble important.',
        annotations: [
          {
            type: "StageSchema",
            id: uuidv4(),
            label: "Détail Stage Important",
            data: {
              companyName: "Polytech",
              internshipTitle: "Développement ChatApp",
              missionDescription: "Participer au développement du client de messagerie structurée.",
              startDate: "2025-09-01",
              endDate: "2026-02-28",
              supervisorName: "A. Max",
              weeklyHours: 35,
              remuneration: 600,
              requiredSkills: ["React", "TypeScript", "Tailwind"],
              applicationDeadline: "2025-07-15",
            },
            version: "1.0.0",
          },
        ],
      },
    ],
  },
  {
    threadId: "thread-2",
    title: "Organisation Réunion Hebdo",
    participants: ["user-Alice", "user-Charlie"],
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tags: ["réunion"],
    messages: [
      {
        messageId: "msg-2-1",
        parentId: null,
        author: "user-Charlie",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: true,
        text: "Pour la réunion de demain, qui confirme sa présence ?",
        annotations: [
          {
            type: "checkbox",
            id: uuidv4(),
            label: "Confirmation présence",
            data: { checked: false },
            version: "1.0.0",
          },
        ],
      },
    ],
  },
]

class ThreadService {
  private currentUserId = "user-Alice"

  public getCurrentUserId(): string {
    return this.currentUserId
  }

  public getAllThreads(): Thread[] {
    return JSON.parse(JSON.stringify(threads))
  }

  public getThreadById(threadId: string): Thread | undefined {
    const thread = threads.find((t) => t.threadId === threadId)
    return thread ? JSON.parse(JSON.stringify(thread)) : undefined
  }

  public createThread(title: string, participantIds: string[]): Thread {
    const allParticipants = Array.from(new Set([this.currentUserId, ...participantIds]))

    const newThread: Thread = {
      threadId: uuidv4(),
      title,
      participants: allParticipants,
      creationDate: new Date().toISOString(),
      tags: [],
      messages: [],
    }
    threads.push(newThread)
    return JSON.parse(JSON.stringify(newThread))
  }

  public addMessage(
    threadId: string,
    messageData: Omit<Message, "messageId" | "timestamp" | "isRead">,
  ): Message | null {
    const threadIndex = threads.findIndex((t) => t.threadId === threadId)
    if (threadIndex === -1) {
      return null
    }

    const newMessage: Message = {
      ...messageData,
      messageId: uuidv4(),
      timestamp: new Date().toISOString(),
      isRead: messageData.author === this.currentUserId,
    }

    threads[threadIndex].messages.push(newMessage)
    return JSON.parse(JSON.stringify(newMessage))
  }

  public getUnreadMessageCount(threadId: string): number {
    const thread = threads.find((t) => t.threadId === threadId)
    if (!thread) return 0
    return thread.messages.filter((m) => !m.isRead && m.author !== this.currentUserId).length
  }
}

const threadService = new ThreadService()
export default threadService
