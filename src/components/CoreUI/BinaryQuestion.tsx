"use client"

import type React from "react"

interface BinaryQuestionProps {
  id: string
  label: string
  answer?: "yes" | "no" | null
  onChange?: (answer: "yes" | "no") => void
  readOnly?: boolean
}

const BinaryQuestion: React.FC<BinaryQuestionProps> = ({ id, label, answer, onChange, readOnly = false }) => {
  const handleSelect = (value: "yes" | "no") => {
    if (onChange && !readOnly) {
      onChange(value)
    }
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-gray-50">
      <p className={`block text-sm font-medium ${readOnly ? "text-gray-500" : "text-gray-700"} mb-2`}>{label}</p>
      {readOnly ? (
        <p className="text-sm">Réponse : {answer === "yes" ? "Oui" : answer === "no" ? "Non" : "Non répondu"}</p>
      ) : (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleSelect("yes")}
            disabled={readOnly}
            className={`px-3 py-1 text-sm rounded-md border
                        ${answer === "yes" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
                        ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
          >
            Oui
          </button>
          <button
            type="button"
            onClick={() => handleSelect("no")}
            disabled={readOnly}
            className={`px-3 py-1 text-sm rounded-md border
                        ${answer === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
                        ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
          >
            Non
          </button>
        </div>
      )}
    </div>
  )
}

export default BinaryQuestion
