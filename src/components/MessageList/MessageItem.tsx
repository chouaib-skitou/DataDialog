"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"
import type { Message, Annotation } from "@/services/ThreadService"
import threadServiceInstance from "@/services/ThreadService"
import { usePlugins, type PluginComponentProps } from "@/contexts/PluginContext"
import UICheckbox from "@/components/CoreUI/Checkbox"
import BinaryQuestion from "@/components/CoreUI/BinaryQuestion"
import MultipleChoice from "@/components/CoreUI/MultipleChoice"
import TimeSlotSelector from "@/components/CoreUI/TimeSlotSelector"
import ColorPicker from "@/components/CoreUI/ColorPicker"

interface MessageItemProps {
  message: Message
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const pluginRegistry = usePlugins()
  const currentUserId = threadServiceInstance.getCurrentUserId()
  const isOwnMessage = message.author === currentUserId

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
  }

  const renderAnnotation = (annotation: Annotation) => {
    const coreProps = { id: annotation.id, label: annotation.label, readOnly: true }

    switch (annotation.type) {
      case "checkbox":
        return <UICheckbox {...coreProps} isChecked={annotation.data?.checked || false} />
      case "binaryQuestion":
        return <BinaryQuestion {...coreProps} answer={annotation.data?.answer || null} />
      case "multipleChoice":
        return (
          <MultipleChoice
            {...coreProps}
            options={annotation.data?.options || []}
            selectedValues={annotation.data?.selectedValues || []}
            allowMultiple={annotation.data?.allowMultiple}
          />
        )
      case "timeSlotSelector":
        return (
          <TimeSlotSelector
            {...coreProps}
            proposedSlots={annotation.data?.proposedSlots || []}
            chosenSlotId={annotation.data?.chosenSlotId || null}
          />
        )
      case "colorPicker":
        return <ColorPicker {...coreProps} value={annotation.data?.value || "#000000"} />
      default:
        if (pluginRegistry && pluginRegistry[annotation.type]) {
          const plugin = pluginRegistry[annotation.type]
          if (plugin.version === annotation.version) {
            const ViewComponent = plugin.ViewComponent as React.ComponentType<PluginComponentProps>
            return <ViewComponent data={annotation.data} readOnly={true} />
          }
        }
        return (
          <div className="p-2 my-1 border border-gray-300 bg-gray-50 text-gray-600 rounded text-xs">
            Annotation de type "{annotation.type}" (v{annotation.version}) non supportée.
          </div>
        )
    }
  }

  return (
    <div className={`flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg shadow-sm
                    ${isOwnMessage ? "bg-indigo-500 text-white" : "bg-white text-gray-800 border border-gray-200"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-semibold ${isOwnMessage ? "text-indigo-100" : "text-gray-600"}`}>
            {message.author}
          </span>
          <span className={`text-xs ${isOwnMessage ? "text-indigo-200" : "text-gray-400"}`}>
            {formatDate(message.timestamp)}
          </span>
        </div>

        {message.text && (
          <div className={`prose prose-sm max-w-none ${isOwnMessage ? "prose-invert" : ""}`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}

        {message.annotations?.length > 0 && (
          <div className={`mt-2 space-y-2 ${isOwnMessage ? "[&>div]:bg-indigo-400 [&>div]:border-indigo-500" : ""}`}>
            {message.annotations.map((anno) => (
              <div key={anno.id}>{renderAnnotation(anno)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageItem
