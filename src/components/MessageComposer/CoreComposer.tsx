"use client"

import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Annotation } from "@/services/ThreadService"
import UICheckbox from "@/components/CoreUI/Checkbox"
import BinaryQuestion from "@/components/CoreUI/BinaryQuestion"
import MultipleChoice from "@/components/CoreUI/MultipleChoice"
import TimeSlotSelector from "@/components/CoreUI/TimeSlotSelector"
import ColorPicker from "@/components/CoreUI/ColorPicker"

interface CoreComposerProps {
  onCoreChange: (data: { text: string; annotations: Annotation[] }) => void
  coreData: { text: string; annotations: Annotation[] }
}

type AnnotationType = "checkbox" | "binaryQuestion" | "multipleChoice" | "timeSlotSelector" | "colorPicker"

const annotationTemplates: Record<AnnotationType, Omit<Annotation, "id" | "version">> = {
  checkbox: { type: "checkbox", label: "Nouvelle case à cocher", data: { checked: false } },
  binaryQuestion: { type: "binaryQuestion", label: "Nouvelle question Oui/Non", data: { answer: null } },
  multipleChoice: {
    type: "multipleChoice",
    label: "Nouveau choix multiple",
    data: { options: [{ value: "opt1", label: "Option 1" }], selectedValues: [], allowMultiple: true },
  },
  timeSlotSelector: {
    type: "timeSlotSelector",
    label: "Nouveau sélecteur de créneau",
    data: { proposedSlots: [], chosenSlotId: null },
  },
  colorPicker: { type: "colorPicker", label: "Nouveau sélecteur de couleur", data: { value: "#FFFFFF" } },
}

const CoreComposer: React.FC<CoreComposerProps> = ({ onCoreChange, coreData }) => {
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false)

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCoreChange({ text: event.target.value, annotations: coreData.annotations })
  }

  const addAnnotation = (type: AnnotationType) => {
    const newAnnotation: Annotation = { ...annotationTemplates[type], id: uuidv4(), version: "1.0.0" }
    const updatedAnnotations = [...coreData.annotations, newAnnotation]
    onCoreChange({ text: coreData.text, annotations: updatedAnnotations })
    setShowAnnotationMenu(false)
  }

  const removeAnnotation = (id: string) => {
    const updatedAnnotations = coreData.annotations.filter((anno) => anno.id !== id)
    onCoreChange({ text: coreData.text, annotations: updatedAnnotations })
  }

  const updateAnnotationData = (id: string, newData: any) => {
    const updatedAnnotations = coreData.annotations.map((anno) =>
      anno.id === id ? { ...anno, data: { ...anno.data, ...newData } } : anno,
    )
    onCoreChange({ text: coreData.text, annotations: updatedAnnotations })
  }

  const renderAnnotationEditor = (annotation: Annotation) => {
    const commonProps = { id: annotation.id, label: annotation.label, readOnly: false }

    switch (annotation.type) {
      case "checkbox":
        return (
          <UICheckbox
            {...commonProps}
            isChecked={annotation.data?.checked}
            onChange={(checked) => updateAnnotationData(annotation.id, { checked })}
          />
        )
      case "binaryQuestion":
        return (
          <BinaryQuestion
            {...commonProps}
            answer={annotation.data?.answer}
            onChange={(answer) => updateAnnotationData(annotation.id, { answer })}
          />
        )
      case "multipleChoice":
        return (
          <MultipleChoice
            {...commonProps}
            options={annotation.data?.options}
            selectedValues={annotation.data?.selectedValues}
            allowMultiple={annotation.data?.allowMultiple}
            onChange={(selectedValues) => updateAnnotationData(annotation.id, { selectedValues })}
          />
        )
      case "timeSlotSelector":
        return (
          <TimeSlotSelector
            {...commonProps}
            proposedSlots={annotation.data?.proposedSlots}
            chosenSlotId={annotation.data?.chosenSlotId}
            onChange={(chosenSlotId) => updateAnnotationData(annotation.id, { chosenSlotId })}
          />
        )
      case "colorPicker":
        return (
          <ColorPicker
            {...commonProps}
            value={annotation.data?.value}
            onChange={(value) => updateAnnotationData(annotation.id, { value })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={coreData.text}
        onChange={handleTextChange}
        placeholder="Votre message texte (Markdown supporté)..."
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
        rows={3}
      />
      {coreData.annotations.length > 0 && (
        <div className="space-y-2 border-t pt-2">
          {coreData.annotations.map((anno) => (
            <div key={anno.id} className="p-0 border rounded-md bg-gray-50 relative">
              {renderAnnotationEditor(anno)}
              <button
                onClick={() => removeAnnotation(anno.id)}
                className="absolute top-1 right-1 p-0.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-full text-xs"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => setShowAnnotationMenu(!showAnnotationMenu)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded-md"
        >
          Ajouter Annotation Noyau +
        </button>
        {showAnnotationMenu && (
          <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border rounded-md shadow-lg z-10">
            {Object.keys(annotationTemplates).map((type) => (
              <button
                key={type}
                onClick={() => addAnnotation(type as AnnotationType)}
                className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
              >
                {annotationTemplates[type as AnnotationType].label.replace("Nouveau ", "").replace("Nouvelle ", "")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoreComposer
