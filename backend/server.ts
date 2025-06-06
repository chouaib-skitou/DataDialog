import express from "express"
import cors from "cors"
import { v4 as uuidv4 } from "uuid"
import type { CoreSchema, MessageThread, Message, Account } from "../shared/types"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Base de données en mémoire (à remplacer par une vraie DB)
let schemas: CoreSchema[] = []
const threads: MessageThread[] = []
const accounts: Account[] = [
  { id: "1", username: "alice", email: "alice@polytech.fr" },
  { id: "2", username: "bob", email: "bob@polytech.fr" },
]

// Schémas noyau par défaut
const coreSchemas: CoreSchema[] = [
  {
    id: "core-checkbox",
    name: "Case à cocher",
    version: "1.0.0",
    type: "core",
    definition: {
      properties: {
        label: { type: "text", label: "Libellé" },
        checked: { type: "checkbox", label: "Coché" },
      },
      required: ["label"],
    },
  },
  {
    id: "core-binary",
    name: "Question binaire",
    version: "1.0.0",
    type: "core",
    definition: {
      properties: {
        question: { type: "text", label: "Question" },
        answer: { type: "binary", label: "Réponse (Oui/Non)" },
      },
      required: ["question"],
    },
  },
  {
    id: "core-multiple-choice",
    name: "Choix multiples",
    version: "1.0.0",
    type: "core",
    definition: {
      properties: {
        question: { type: "text", label: "Question" },
        options: { type: "text", label: "Options (séparées par des virgules)" },
        multiSelect: { type: "checkbox", label: "Sélection multiple" },
      },
      required: ["question", "options"],
    },
  },
  {
    id: "core-time-slot",
    name: "Créneaux temporels",
    version: "1.0.0",
    type: "core",
    definition: {
      properties: {
        label: { type: "text", label: "Libellé" },
        slots: { type: "text", label: "Créneaux disponibles" },
      },
      required: ["label"],
    },
  },
  {
    id: "core-color",
    name: "Sélecteur de couleur",
    version: "1.0.0",
    type: "core",
    definition: {
      properties: {
        label: { type: "text", label: "Libellé" },
        value: { type: "color", label: "Couleur" },
      },
      required: ["label"],
    },
  },
]

// Schémas d'extension
const extensionSchemas: CoreSchema[] = [
  {
    id: "ext-internship",
    name: "Offre de stage",
    version: "1.0.0",
    type: "extension",
    definition: {
      properties: {
        company: { type: "text", label: "Entreprise" },
        mission: { type: "text", label: "Mission" },
        startDate: { type: "text", label: "Date de début" },
        endDate: { type: "text", label: "Date de fin" },
        location: { type: "text", label: "Lieu" },
        requirements: { type: "text", label: "Prérequis" },
        contact: { type: "text", label: "Contact" },
      },
      required: ["company", "mission", "startDate"],
    },
  },
  {
    id: "ext-room-booking",
    name: "Réservation de salle",
    version: "1.0.0",
    type: "extension",
    definition: {
      properties: {
        building: { type: "text", label: "Bâtiment" },
        room: { type: "text", label: "Salle" },
        date: { type: "text", label: "Date" },
        startTime: { type: "text", label: "Heure de début" },
        endTime: { type: "text", label: "Heure de fin" },
        purpose: { type: "text", label: "Objet" },
        equipment: { type: "text", label: "Équipements nécessaires" },
      },
      required: ["building", "room", "date", "startTime", "endTime"],
    },
  },
  {
    id: "ext-pizza-order",
    name: "Commande pizza",
    version: "1.0.0",
    type: "extension",
    definition: {
      properties: {
        pizzaType: { type: "text", label: "Type de pizza" },
        size: { type: "multiple-choice", label: "Taille", options: { choices: ["small", "medium", "large"] } },
        toppings: { type: "text", label: "Garnitures supplémentaires" },
        quantity: { type: "number", label: "Quantité" },
        specialInstructions: { type: "text", label: "Instructions spéciales" },
      },
      required: ["pizzaType", "size", "quantity"],
    },
  },
]

// Initialiser les schémas
schemas = [...coreSchemas, ...extensionSchemas]

// Routes API pour les schémas
app.get("/api/schemas", (req, res) => {
  res.json(schemas)
})

app.get("/api/schemas/:id", (req, res) => {
  const schema = schemas.find((s) => s.id === req.params.id)
  if (!schema) {
    return res.status(404).json({ error: "Schema not found" })
  }
  res.json(schema)
})

app.post("/api/schemas", (req, res) => {
  const newSchema: CoreSchema = {
    id: uuidv4(),
    ...req.body,
    version: req.body.version || "1.0.0",
  }
  schemas.push(newSchema)
  res.status(201).json(newSchema)
})

app.put("/api/schemas/:id", (req, res) => {
  const index = schemas.findIndex((s) => s.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: "Schema not found" })
  }
  schemas[index] = { ...schemas[index], ...req.body }
  res.json(schemas[index])
})

app.delete("/api/schemas/:id", (req, res) => {
  const index = schemas.findIndex((s) => s.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: "Schema not found" })
  }
  schemas.splice(index, 1)
  res.status(204).send()
})

// Routes API pour les fils de messages
app.get("/api/threads", (req, res) => {
  res.json(threads)
})

app.get("/api/threads/:id", (req, res) => {
  const thread = threads.find((t) => t.id === req.params.id)
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" })
  }
  res.json(thread)
})

app.post("/api/threads", (req, res) => {
  const newThread: MessageThread = {
    id: uuidv4(),
    title: req.body.title,
    participants: req.body.participants || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    category: req.body.category,
    messages: [],
  }
  threads.push(newThread)
  res.status(201).json(newThread)
})

// Routes API pour les messages
app.post("/api/threads/:threadId/messages", (req, res) => {
  const thread = threads.find((t) => t.id === req.params.threadId)
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" })
  }

  const newMessage: Message = {
    id: uuidv4(),
    threadId: req.params.threadId,
    senderId: req.body.senderId,
    content: req.body.content,
    timestamp: new Date(),
    schemas: req.body.schemas || [],
  }

  thread.messages.push(newMessage)
  thread.updatedAt = new Date()
  res.status(201).json(newMessage)
})

// Routes API pour les comptes
app.get("/api/accounts", (req, res) => {
  res.json(accounts)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
