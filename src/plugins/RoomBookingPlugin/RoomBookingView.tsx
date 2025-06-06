import type React from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface RoomBookingData {
  roomName: string
  bookingDate: string
  startTime: string
}

const RoomBookingView: React.FC<PluginComponentProps<RoomBookingData>> = ({ data }) => {
  if (!data) return null

  return (
    <div className="p-3 border rounded-md bg-white shadow-sm space-y-1 text-sm">
      <h3 className="font-semibold">Réservation : {data.roomName}</h3>
      <p>
        <strong>Date :</strong> {new Date(data.bookingDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Heure :</strong> {data.startTime}
      </p>
    </div>
  )
}

export default RoomBookingView
