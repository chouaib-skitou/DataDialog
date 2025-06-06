// Defines and provides access to message schemas.
// For this example, schemas are defined directly in this file.
// In a real application, these might be loaded from JSON files or a database.

import type { SchemaDefinition } from "@/types"

const coreSchemas: Record<string, SchemaDefinition> = {
  "core-checkbox": {
    id: "core-checkbox",
    name: "Case à cocher",
    version: "1.0.0",
    isCore: true,
    properties: {
      label: { type: "text", label: "Libellé de la case", defaultValue: "Valider ?" },
      isChecked: { type: "checkbox", label: "Cochée", defaultValue: false },
    },
  },
  "core-binary": {
    id: "core-binary",
    name: "Question Oui/Non",
    version: "1.0.0",
    isCore: true,
    properties: {
      question: { type: "text", label: "Question", defaultValue: "Êtes-vous sûr ?" },
      response: { type: "binary", label: "Réponse" }, // No default for binary response
    },
  },
}

const extensionSchemas: Record<string, SchemaDefinition> = {
  "ext-internship": {
    id: "ext-internship",
    name: "Offre de Stage",
    version: "1.0.0",
    isCore: false,
    properties: {
      company: { type: "text", label: "Entreprise", defaultValue: "" },
      title: { type: "text", label: "Intitulé du stage", defaultValue: "" },
      description: { type: "textarea", label: "Description", defaultValue: "" },
      startDate: { type: "date", label: "Date de début", defaultValue: "" },
    },
  },
  "ext-pizza-order": {
    id: "ext-pizza-order",
    name: "Commande de Pizza",
    version: "1.0.0",
    isCore: false,
    properties: {
      type: {
        type: "select",
        label: "Type de Pizza",
        options: ["Margherita", "Pepperoni", "Végétarienne"],
        defaultValue: "Margherita",
      },
      size: { type: "select", label: "Taille", options: ["Petite", "Moyenne", "Grande"], defaultValue: "Moyenne" },
      quantity: { type: "number", label: "Quantité", defaultValue: 1 },
    },
  },
}

export const getAllSchemas = (): SchemaDefinition[] => {
  return [...Object.values(coreSchemas), ...Object.values(extensionSchemas)]
}

export const getSchemaById = (id: string): SchemaDefinition | undefined => {
  return coreSchemas[id] || extensionSchemas[id]
}
