"use client"

import type { Message, CoreSchema } from "../shared/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface MessageRendererProps {
  message: Message
  schemas: CoreSchema[]
  isOwnMessage: boolean
}

export function MessageRenderer({ message, schemas, isOwnMessage }: MessageRendererProps) {
  const renderStructuredPart = (part: any) => {
    const schema = schemas.find((s) => s.id === part.schemaId)
    if (!schema) return null

    return (
      <Card key={part.id} className="mt-2">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={schema.type === "core" ? "default" : "secondary"}>{schema.name}</Badge>
            <span className="text-xs text-muted-foreground">v{part.schemaVersion}</span>
          </div>

          <div className="space-y-2">
            {Object.entries(part.data).map(([key, value]) => {
              const property = schema.definition.properties[key]
              if (!property) return null

              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{property.label}:</span>
                  {renderFieldValue(property.type, value)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderFieldValue = (type: string, value: any) => {
    switch (type) {
      case "checkbox":
        return (
          <div className="flex items-center gap-1">
            <Checkbox checked={value} disabled />
            <span className="text-sm">{value ? "Oui" : "Non"}</span>
          </div>
        )

      case "binary":
        return (
          <div className="flex items-center gap-1">
            {value === true ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : value === false ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{value === true ? "Oui" : value === false ? "Non" : "En attente"}</span>
          </div>
        )

      case "multiple-choice":
        return (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(value) ? (
              value.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                {value}
              </Badge>
            )}
          </div>
        )

      case "color":
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
            <span className="text-sm font-mono">{value}</span>
          </div>
        )

      case "time-slot":
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{value}</span>
          </div>
        )

      default:
        return <span className="text-sm">{String(value)}</span>
    }
  }

  return (
    <div>
      {message.content.text && <p className="whitespace-pre-wrap">{message.content.text}</p>}

      {message.content.structuredParts?.map(renderStructuredPart)}
    </div>
  )
}
