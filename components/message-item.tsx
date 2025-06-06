"use client"
import type { Message, User, StructuredPart } from "@/types"
import { cn, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSchemaById } from "@/services/schema-service"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MessageItemProps {
  message: Message
  currentUser: User
}

const renderStructuredPartData = (part: StructuredPart, isOwnMessage: boolean) => {
  const schema = getSchemaById(part.schemaId)
  if (!schema) return <p className="text-xs text-red-500">Schéma inconnu: {part.schemaId}</p>

  return (
    <div className="space-y-1 text-sm">
      {Object.entries(schema.properties).map(([key, propDef]) => {
        const value = part.data[key] ?? propDef.defaultValue // Use default value if data is missing
        if (value === undefined && propDef.type !== "binary") return null // Don't render if no value and not binary

        switch (propDef.type) {
          case "checkbox":
            return (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={`${part.id}-${key}`} checked={!!value} disabled />
                <label
                  htmlFor={`${part.id}-${key}`}
                  className={cn("text-sm", isOwnMessage ? "text-primary-foreground/90" : "")}
                >
                  {propDef.label}
                </label>
              </div>
            )
          case "binary":
            let responseText = "Non répondu"
            if (value === true) responseText = "Oui"
            if (value === false) responseText = "Non"
            return (
              <div key={key} className={cn(isOwnMessage ? "text-primary-foreground/90" : "")}>
                <span className={cn("font-medium", isOwnMessage ? "text-primary-foreground" : "")}>
                  {propDef.label}:
                </span>{" "}
                {responseText}
              </div>
            )
          default:
            return (
              <div key={key} className={cn(isOwnMessage ? "text-primary-foreground/90" : "")}>
                <span className={cn("font-medium", isOwnMessage ? "text-primary-foreground" : "")}>
                  {propDef.label}:
                </span>{" "}
                {String(value)}
              </div>
            )
        }
      })}
    </div>
  )
}

export function MessageItem({ message, currentUser }: MessageItemProps) {
  const isOwnMessage = message.senderId === currentUser.id
  const senderName =
    message.senderId.replace("user-", "").charAt(0).toUpperCase() + message.senderId.replace("user-", "").slice(1)
  const senderInitials = senderName.substring(0, 2).toUpperCase()

  return (
    <div className={cn("flex mb-3 items-end space-x-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback>{senderInitials}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] p-3 rounded-lg shadow-sm",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none",
        )}
      >
        <div className="flex justify-between items-center mb-1">
          {!isOwnMessage && <span className="text-xs font-semibold">{senderName}</span>}
          <span className={cn("text-xs", isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {formatDate(message.timestamp)}
          </span>
        </div>

        {message.text && <p className="whitespace-pre-wrap text-sm">{message.text}</p>}

        {message.structuredParts && message.structuredParts.length > 0 && (
          <div className={cn("mt-2 space-y-2")}>
            {message.structuredParts.map((part) => {
              const schema = getSchemaById(part.schemaId)
              return (
                <Card
                  key={part.id}
                  className={cn(
                    isOwnMessage ? "bg-primary/80 border-primary-foreground/20 text-primary-foreground" : "bg-card",
                    "shadow-none",
                  )}
                >
                  <CardHeader className="p-2 border-b">
                    <CardTitle
                      className={cn(
                        "text-xs flex items-center justify-between",
                        isOwnMessage ? "text-primary-foreground" : "text-card-foreground",
                      )}
                    >
                      {schema?.name || "Élément Structuré"}
                      {schema && (
                        <Badge
                          variant={isOwnMessage ? "secondary" : "outline"} // Use secondary for better contrast on dark bg
                          className={cn(
                            "text-xs px-1.5 py-0.5",
                            isOwnMessage ? "bg-primary-foreground/20 text-primary-foreground" : "",
                          )}
                        >
                          {schema.version}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 text-sm">{renderStructuredPartData(part, isOwnMessage)}</CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      {isOwnMessage && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
