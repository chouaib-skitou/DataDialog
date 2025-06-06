"use client"

import type React from "react"

interface TimeSlot {
  start: string
  end: string
  id: string
  label?: string
}

interface TimeSlotSelectorProps {
  id: string
  label: string
  proposedSlots: TimeSlot[]
  chosenSlotId: string | null
  onChange?: (chosenSlotId: string | null) => void
  readOnly?: boolean
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  id,
  label,
  proposedSlots,
  chosenSlotId,
  onChange,
  readOnly = false,
}) => {
  const handleSelectSlot = (slotId: string) => {
    if (onChange && !readOnly) {
      onChange(chosenSlotId === slotId ? null : slotId)
    }
  }

  const formatSlotDisplay = (slot: TimeSlot): string => {
    if (slot.label) return slot.label
    const startTime = new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    const endTime = new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${startTime} - ${endTime}`
  }

  const chosenSlotDetails = chosenSlotId ? proposedSlots.find((s) => s.id === chosenSlotId) : null

  return (
    <div className="my-2 p-3 border rounded-md bg-gray-50">
      <p className={`block text-sm font-medium ${readOnly ? "text-gray-500" : "text-gray-700"} mb-2`}>{label}</p>
      {readOnly ? (
        <p className="text-sm">Créneau choisi : {chosenSlotDetails ? formatSlotDisplay(chosenSlotDetails) : "Aucun"}</p>
      ) : (
        <div className="space-y-2">
          {proposedSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleSelectSlot(slot.id)}
              disabled={readOnly}
              className={`w-full text-left px-3 py-2 text-sm rounded-md border
                          ${chosenSlotId === slot.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
                          ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {formatSlotDisplay(slot)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeSlotSelector
