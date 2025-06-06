"use client"

import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import CoreComposer from "./CoreComposer"
import ExtensionForm from "./ExtensionForm"
import { usePlugins } from "@/contexts/PluginContext"
import threadServiceInstance, { type Annotation, type Message } from "@/services/ThreadService"

interface MessageComposerProps {
  threadId: string
  onMessageSent: () => void
}

const MessageComposer: React.FC<MessageComposerProps> = ({ threadId, onMessageSent }) => {
  const pluginRegistry = usePlugins()
  const [coreData, setCoreData] = useState<{ text: string; annotations: Annotation[] }>({ text: "", annotations: [] })
  const [selectedSchema, setSelectedSchema] = useState<{ name: string; version: string } | undefined>()
  const [extensionAnnotation, setExtensionAnnotation] = useState<Annotation | null>(null)
  const [extensionFormKey, setExtensionFormKey] = useState<string>(uuidv4())

  const handleSend = () => {
    if (!coreData.text.trim() && coreData.annotations.length === 0 && !extensionAnnotation) return

    const allAnnotations = [...coreData.annotations]
    if (extensionAnnotation) allAnnotations.push(extensionAnnotation)

    const newMessageData: Omit<Message, "messageId" | "timestamp" | "isRead"> = {
      parentId: null,
      author: threadServiceInstance.getCurrentUserId(),
      text: coreData.text,
      annotations: allAnnotations,
    }

    if (threadServiceInstance.addMessage(threadId, newMessageData)) {
      onMessageSent()
      setCoreData({ text: "", annotations: [] })
      setSelectedSchema(undefined)
      setExtensionAnnotation(null)
      setExtensionFormKey(uuidv4())
    }
  }

  const handleSchemaSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const schemaName = event.target.value
    if (!schemaName) {
      setSelectedSchema(undefined)
      setExtensionAnnotation(null)
      return
    }
    if (pluginRegistry && pluginRegistry[schemaName]) {
      setSelectedSchema({ name: schemaName, version: pluginRegistry[schemaName].version })
      setExtensionAnnotation(null)
      setExtensionFormKey(uuidv4())
    }
  }

  return (
    <div className="p-4 border-t bg-gray-50 space-y-4">
      <CoreComposer onCoreChange={setCoreData} coreData={coreData} />
      <div className="border-t pt-3">
        <label htmlFor="schema-select" className="block text-xs font-medium text-gray-700 mb-1">
          Ajouter une extension :
        </label>
        <select
          id="schema-select"
          value={selectedSchema ? selectedSchema.name : ""}
          onChange={handleSchemaSelection}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm text-sm"
        >
          <option value="">Aucune</option>
          {pluginRegistry &&
            Object.entries(pluginRegistry).map(([schemaName, { version }]) => (
              <option key={schemaName} value={schemaName}>
                {schemaName} (v{version})
              </option>
            ))}
        </select>
      </div>
      {selectedSchema && (
        <ExtensionForm
          key={extensionFormKey}
          selectedSchema={selectedSchema}
          onExtensionData={setExtensionAnnotation}
          extensionDataKey={extensionFormKey}
        />
      )}
      <button
        onClick={handleSend}
        className="w-full sm:w-auto float-right bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
      >
        Envoyer
      </button>
    </div>
  )
}

export default MessageComposer
