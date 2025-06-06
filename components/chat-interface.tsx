"use client"

import { useState } from "react"
import type { MessageThread, Account, CoreSchema, StructuredPart } from "../shared/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageRenderer } from "@/components/message-renderer"
import { StructuredPartEditor } from "@/components/structured-part-editor"
import { Send, Plus, X } from "lucide-react"

interface ChatInterfaceProps {
  thread: MessageThread
  currentUser: Account
  schemas: CoreSchema[]
  onSendMessage: (threadId: string, content: any, schemas: any[]) => Promise<void>
}

export function ChatInterface({ thread, currentUser, schemas, onSendMessage }: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState("")
  const [structuredParts, setStructuredParts] = useState<StructuredPart[]>([])
  const [isAddingStructuredPart, setIsAddingStructuredPart] = useState(false)

  const handleSendMessage = async () => {
    if (!messageText.trim() && structuredParts.length === 0) return

    const content = {
      text: messageText.trim() || undefined,
      structuredParts,
    }

    const schemaRefs = structuredParts.map((part) => ({
      id: part.schemaId,
      version: part.schemaVersion,
      required: true,
    }))

    await onSendMessage(thread.id, content, schemaRefs)

    setMessageText("")
    setStructuredParts([])
  }

  const addStructuredPart = (schemaId: string) => {
    const schema = schemas.find((s) => s.id === schemaId)
    if (!schema) return

    const newPart: StructuredPart = {
      id: `part-${Date.now()}`,
      schemaId: schema.id,
      schemaVersion: schema.version,
      data: {},
    }

    setStructuredParts([...structuredParts, newPart])
    setIsAddingStructuredPart(false)
  }

  const updateStructuredPart = (partId: string, data: any) => {
    setStructuredParts((parts) => parts.map((part) => (part.id === partId ? { ...part, data } : part)))
  }

  const removeStructuredPart = (partId: string) => {
    setStructuredParts((parts) => parts.filter((part) => part.id !== partId))
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSenderName = (senderId: string) => {
    const sender = thread.participants.find((p) => p.id === senderId)
    return sender?.username || "Utilisateur inconnu"
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <span>{thread.title}</span>
          <div className="flex gap-2">
            {thread.participants.map((participant) => (
              <Badge key={participant.id} variant="secondary">
                {participant.username}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {thread.messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Aucun message dans ce fil</p>
              <p className="text-sm">Commencez la conversation !</p>
            </div>
          ) : (
            thread.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{getSenderName(message.senderId)}</span>
                    <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                  </div>

                  <MessageRenderer
                    message={message}
                    schemas={schemas}
                    isOwnMessage={message.senderId === currentUser.id}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <Separator className="my-4" />

        {/* Composer */}
        <div className="flex-shrink-0 space-y-4">
          {/* Parties structurées */}
          {structuredParts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Éléments structurés :</h4>
              {structuredParts.map((part) => {
                const schema = schemas.find((s) => s.id === part.schemaId)
                return (
                  <Card key={part.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{schema?.name}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => removeStructuredPart(part.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <StructuredPartEditor
                      part={part}
                      schema={schema!}
                      onChange={(data) => updateStructuredPart(part.id, data)}
                    />
                  </Card>
                )
              })}
            </div>
          )}

          {/* Ajouter partie structurée */}
          {isAddingStructuredPart && (
            <Card className="p-3">
              <h4 className="text-sm font-medium mb-2">Choisir un schéma :</h4>
              <div className="grid grid-cols-2 gap-2">
                {schemas.map((schema) => (
                  <Button
                    key={schema.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addStructuredPart(schema.id)}
                    className="justify-start"
                  >
                    <Badge variant={schema.type === "core" ? "default" : "secondary"} className="mr-2">
                      {schema.type === "core" ? "Noyau" : "Extension"}
                    </Badge>
                    {schema.name}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAddingStructuredPart(false)} className="mt-2">
                Annuler
              </Button>
            </Card>
          )}

          {/* Zone de saisie */}
          <div className="flex gap-2">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingStructuredPart(true)}
                disabled={isAddingStructuredPart}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
