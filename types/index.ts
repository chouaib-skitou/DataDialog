export interface User {
  id: string
  name: string
}

export interface SchemaProperty {
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "binary"
  label: string
  options?: string[] // For select type
  defaultValue?: any
}

export interface SchemaDefinition {
  id: string
  name: string // Changed from "string" to string for clarity
  version: string
  properties: Record<string, SchemaProperty>
  isCore: boolean // To distinguish core from extension schemas
}

export interface StructuredPart {
  id: string // Unique ID for this instance of the part in a message
  schemaId: string // ID of the schema definition used
  data: Record<string, any> // Data conforming to the schema
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  timestamp: string
  text?: string
  structuredParts?: StructuredPart[]
}

export interface Thread {
  id: string
  title: string
  participantIds: string[]
  messages: Message[]
  lastUpdated: string
}
