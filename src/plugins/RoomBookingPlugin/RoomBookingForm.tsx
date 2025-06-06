"use client"

import type React from "react"
import { useState } from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface RoomBookingData {
  roomName: string
  bookingDate: string
  startTime: string
  endTime: string
}

const RoomBookingForm: React.FC<PluginComponentProps<RoomBookingData>> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RoomBookingData>({
    roomName: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
  })

  const handleChange = (field: keyof RoomBookingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="block font-medium">Nom de la salle *</label>
        <input
          type="text"
          value={formData.roomName}
          onChange={(e) => handleChange("roomName", e.target.value)}
          className="mt-1 block w-full p-1.5 border rounded-md"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-medium">Date *</label>
          <input
            type="date"
            value={formData.bookingDate}
            onChange={(e) => handleChange("bookingDate", e.target.value)}
            className="mt-1 block w-full p-1.5 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Heure *</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
            className="mt-1 block w-full p-1.5 border rounded-md"
            required
          />
        </div>
      </div>
      {onSubmit && (
        <button type="submit" className="mt-3 w-full bg-green-600 text-white px-3 py-1.5 rounded-md text-sm">
          Enregistrer
        </button>
      )}
    </form>
  )
}

export default RoomBookingForm
