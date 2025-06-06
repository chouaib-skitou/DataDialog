// Types partagés entre frontend et backend
export interface Account {
  id: string
  username: string
  email: string
}

export interface MessageThread {
  id: string
  title: string
  participants: Account[]
  createdAt: Date
  updatedAt: Date
  category?: string
  messages: Message[]
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  content: MessageContent
  timestamp: Date
  schemas: SchemaReference[]
}

export interface MessageContent {
  text?: string
  structuredParts: StructuredPart[]
}

export interface StructuredPart {
  id: string
  schemaId: string
  schemaVersion: string
  data: any
}

export interface SchemaReference {
  id: string
  version: string
  required: boolean
}

// Schéma noyau - Types génériques
export interface CoreSchema {
  id: string
  name: string
  version: string
  type: "core" | "extension"
  definition: SchemaDefinition
}

export interface SchemaDefinition {
  properties: Record<string, SchemaProperty>
  required?: string[]
}

export interface SchemaProperty {
  type: "checkbox" | "binary" | "multiple-choice" | "time-slot" | "color" | "text" | "number"
  label: string
  description?: string
  options?: any
}

// Types génériques du schéma noyau
export interface CheckboxField {
  type: "checkbox"
  label: string
  checked: boolean
}

export interface BinaryField {
  type: "binary"
  question: string
  answer?: boolean
}

export interface MultipleChoiceField {
  type: "multiple-choice"
  question: string
  options: string[]
  selected?: string[]
  multiSelect: boolean
}

export interface TimeSlotField {
  type: "time-slot"
  label: string
  availableSlots: TimeSlot[]
  selectedSlot?: string
}

export interface TimeSlot {
  id: string
  start: Date
  end: Date
  label: string
}

export interface ColorField {
  type: "color"
  label: string
  value?: string // RGB hex value
}

// Schémas d'extension - Types métiers
export interface InternshipSchema {
  company: string
  mission: string
  startDate: Date
  endDate: Date
  location: string
  requirements: string[]
  contact: string
}

export interface RoomBookingSchema {
  building: string
  room: string
  date: Date
  startTime: string
  endTime: string
  purpose: string
  equipment: string[]
}

export interface PizzaOrderSchema {
  pizzaType: string
  size: "small" | "medium" | "large"
  toppings: string[]
  quantity: number
  specialInstructions?: string
}
