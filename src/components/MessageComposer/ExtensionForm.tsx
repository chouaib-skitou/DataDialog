"use client"

import React from "react"
import { usePlugins, type PluginComponentProps } from "@/contexts/PluginContext"
import type { Annotation } from "@/services/ThreadService"
import Loader from "@/components/Shared/Loader"

interface ExtensionFormProps {
  selectedSchema?: { name: string; version: string }
  onExtensionData: (annotation: Annotation) => void
  extensionDataKey: string
}

const ExtensionForm: React.FC<ExtensionFormProps> = ({ selectedSchema, onExtensionData, extensionDataKey }) => {
  const pluginRegistry = usePlugins()

  if (!selectedSchema || !pluginRegistry) return null

  const plugin = pluginRegistry[selectedSchema.name]
  if (!plugin) return <p className="text-xs text-red-500 p-2 border rounded">Plugin non trouvé.</p>

  const FormComponent = plugin.FormComponent as React.ComponentType<PluginComponentProps>

  const handleSubmit = (dataFromPlugin: any) => {
    const annotation: Annotation = {
      type: selectedSchema.name,
      id: `ext-${selectedSchema.name}-${Date.now()}`,
      label: `Extension: ${selectedSchema.name}`,
      data: dataFromPlugin,
      version: selectedSchema.version,
    }
    onExtensionData(annotation)
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-gray-50">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">
        Extension : {selectedSchema.name} v{selectedSchema.version}
      </h4>
      <React.Suspense fallback={<Loader />}>
        <FormComponent key={extensionDataKey} onSubmit={handleSubmit} />
      </React.Suspense>
    </div>
  )
}

export default ExtensionForm
